---
title: 小两百行 JavaScript 打造 lambda 演算解释器
date: 2016-06-27
desc: 小两百行 JavaScript 打造lambda 演算解释器
author: Tadeu Zagallo
social: http://tadeuzagallo.com/blog/about/
permission: 0
from: http://tadeuzagallo.com/blog/writing-a-lambda-calculus-interpreter-in-javascript/
tags: 
    - 翻译
    - JavaScript
---

最近，我发了一条[推特](https://twitter.com/tadeuzagallo/status/742836038264098817)，我喜欢上 lambda 演算了，它简单、强大。

我当然听说过 lambda 演算，但直到我读了这本书 [《类型和编程语言》（Types and Programming Languages）](https://www.cis.upenn.edu/~bcpierce/tapl) 我才体会到其中美妙。

<!-- more -->

已经有许多编译器/解析器/解释器（compiler / parser / interpreter）的教程，但大多数不会引导你完整实现一种语言，因为实现完全的语言语义，通常需要很多工作。不过在本文中， lambda 演算（译者注：又写作“λ 演算”，为统一行文，下文一律作 “lambda 演算”）是如此简单，我们可以搞定一切！


首先，什么是 lambda 演算呢？[维基百科](https://en.wikipedia.org/wiki/Lambda_calculus)是这样描述的:

> lambda 演算（又写作 “λ 演算”）是表达基于功能抽象和使用变量绑定和替代的应用计算数学逻辑形式系统。这是一个通用的计算模型，可以用来模拟单带图灵机，在 20 世纪 30 年代，由数学家奥隆索·乔奇第一次引入，作为数学基础的调查的一部分。

这是一个非常简单的 lambda 演算程序的模样：

```haskell
(λx. λy. x) (λy. y) (λx. x)
```

lambda 演算中只有两个结构，函数抽象（也就是函数声明）和应用（即函数调用），然而可以拿它做任何计算。

## 1. 语法

编写解析器之前，我们需要知道的第一件事是我们将要解析的语言的语法是什么，这是 [BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_Form)（译者注：Backus–Naur Form，巴科斯范式， 上下文无关的语法的标记技术） 表达式：

```
Term ::= Application
        | LAMBDA LCID DOT Term

Application ::= Application Atom
               | Atom

Atom ::= LPAREN Term RPAREN
        | LCID
```

语法告诉我们如何在分析过程中寻找 token 。但是等一下，token 是什么鬼？

## 2. Tokens

正如你可能已经知道的，解析器不会操作源代码。在开始解析之前，先通过 `词法分析器（lexer）` 运行源码，这会将源码打散成 token（语法中全大写的部分）。我们可以从上面的语法中提取的如下的 token ：

```javascript
LPAREN: '('
RPAREN: ')'
LAMBDA: 'λ' // 为了方便也可以使用 “\”
DOT: '.'
LCID: /[a-z][a-zA-Z]*/ // LCID 表示小写标识符
                       // 即任何一个小写字母开头的字符串
```

我们来建一个可以包含 `type` （以上的任意一种）的 `Token` 类，以及一个可选的 value (比如 `LCID` 的字符串)。

```javascript
class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
};
```

## 3. 词法分析器( Lexer )

现在我们可以拿上面定义的 token 来写 `词法分析器（Lexer）` 了， 为解析器解析程序提供一个很棒的 *API* 。

词法分析器的 token 生成的部分不是很好玩：这是一个大的 switch 语句，用来检查源代码中的下一个字符：

```javascript
_nextToken() {
  switch (c) {
    case 'λ':
    case '\\':
      this._token = new Token(Token.LAMBDA);
      break;

    case '.':
      this._token = new Token(Token.DOT);
      break;

    case '(':
      this._token = new Token(Token.LPAREN);
      break;

    /* ... */
  }
}
```

下面这些方法是处理 token 的辅助方法：

*   `next(Token)`: 返回下一个 token 是否匹配 `Token`
*   `skip(Token)`: 和 `next` 一样, 但如果匹配的话会跳过
*   `match(Token)`: 断言 `next` 方法返回 true 并 `skip`
*   `token(Token)`: 断言 `next` 方法返回 true 并返回 token

OK，现在来看 “解析器”！

## 4. 解析器

解析器基本上是语法的一个副本。我们基于每个 production 规则的名称（`::=` 的左侧）为其创建一个方法，再来看右侧内容 —— 如果是全大写的单词，说明它是一个 *终止符* （即一个 token ），词法分析器会用到它。如果是一个大写字母开头的单词，这是另外一段，所以同样为其调用 production 规则的方法。遇到 “/” （读作 “或”）的时候，要决定使用那一侧，这取决于基于哪一侧匹配我们的 token。

这个语法有点棘手的地方是：手写的解析器通常是[递归下降（recursive descent）](https://en.wikipedia.org/wiki/Recursive_descent_parser)的（我们的就是），它们无法处理左侧递归。你可能已经注意到了， `Application` 的右侧开头包含 `Application` 本身。所以如果我们只是遵循前面段落说到的流程，调用我们找到的所有 production，会导致无限递归。

幸运的是左递归可以用一个简单的技巧移除掉：

```
Application ::= Atom Application'

Application' ::= Atom Application'
                | ε  # empty
```

### 4.1. 抽象语法树 （AST）

进行分析时，需要以存储分析出的信息，为此要建立 [抽象语法树 ( AST )](https://en.wikipedia.org/wiki/Abstract_syntax_tree) 。lambda 演算的 AST 非常简单，因为我们只有 3 种节点： Abstraction （抽象）， Application （应用）以及 Identifier （标识符）（译者注： 为方便理解，这三个单词不译）。

*Abstraction* 持有其参数（param） 和主体（body）； *Application* 则持有语句的左右侧； *Identifier* 是一个叶节点，只有持有该标识符本身的字符串表示形式。

这是一个简单的程序及其 AST:

```
(λx. x) (λy. y)

Application {
  abstraction: Abstraction {
    param: Identifier { name: 'x' },
    body: Identifier { name: 'x' }
  },
  value: Abstraction {
    param: Identifier { name: 'y' },
    body: Identifier { name: 'y' }
  }
}
```

### 4.2. 解析器的实现

现在有了我们的 AST 节点，可以拿它们来建构真正的树了。下面是基于语法中的生成规则的分析方法：

```javascript
term() {
  // Term ::= LAMBDA LCID DOT Term
  //        | Application
  if (this.lexer.skip(Token.LAMBDA)) {
    const id = new AST.Identifier(this.lexer.token(Token.LCID).value);
    this.lexer.match(Token.DOT);
    const term = this.term();
    return new AST.Abstraction(id, term);
  }  else {
    return this.application();
  }
}

application() {
  // Application ::= Atom Application'
  let lhs = this.atom();
  while (true) {
    // Application' ::= Atom Application'
    //                | ε
    const rhs = this.atom();
    if (!rhs) {
      return lhs;
    } else {
      lhs = new AST.Application(lhs, rhs);
    }
  }
}

atom() {
  // Atom ::= LPAREN Term RPAREN
  //        | LCID
  if (this.lexer.skip(Token.LPAREN)) {
    const term = this.term(Token.RPAREN);
    this.lexer.match(Token.RPAREN);
    return term;
  } else if (this.lexer.next(Token.LCID)) {
    const id = new AST.Identifier(this.lexer.token(Token.LCID).value);
    return id;
  } else {
    return undefined;
  }
}
```

## 5. 求值（Evaluation）

现在，我们可以用 AST 来给程序求值了。不过想知道我们的解释器长什么样子，还得先看看 lambda 的求值规则。

### 5.1. 求值规则

首先，我们需要定义，什么是形式（terms）（从语法可以推断），什么是值（values）。

我们的 term 是:

```
t1 t2   # Application

λx. t1  # Abstraction

x       # Identifier
```

是的，这些几乎和我们的 AST 节点一模一样！但这其中哪些是 value？

value 是最终的形式，也就是说，它们不能再被求值了。在这个例子中，唯一的既是 term 又是 value 的是 abstraction（不能对函数求值，除非它被调用）。

实际的求值规则如下：

```
1)       t1 -> t1'
     _________________

      t1 t2 -> t1' t2

2)       t2 -> t2'
     ________________

      v1 t2 -> v1 t2'

3)    (λx. t12) v2 -> [x -> v2]t12 
```

我们可以这样解读每一条规则：

1. 如果 `t1` 是值为 `t1'` 的项， `t1 t2` 求值为 `t1' t2`。即一个 application 的左侧先被求值。
2. 如果 `t2` 是值为 `t2'` 的项， `v1 t2` 求值为 `v1 t2'`。注意这里左侧的是 `v1` 而非 `t1`， 这意味着它是 value，不能再一步被求值，也就是说，只有左侧的完成之后，才会对右侧求值。
3. application `(λx. t12) v2` 的结果，和 `t12` 中出现的所有 `x` 被有效替换之后是一样的。注意在对 application 求值之前，两侧必须都是 value。

### 5.2. 解释器

解释器遵循求值规则，将一个程序归化为 value。现在我们将上面的规则用 JavaScript 写出来：

首先定义一个工具，当某个节点是 value 的时候告诉我们：

```javascript
const isValue = node => node instanceof AST.Abstraction;
```

好了，如果 node 是 abstraction，它就是 value；否则就不是。

接下来是解释器起作用的地方：

```javascript
const eval = (ast, context={}) => {
  while (true) {
    if (ast instanceof AST.Application) {
      if (isValue(ast.lhs) && isValue(ast.rhs)) {
        context[ast.lhs.param.name] = ast.rhs;
        ast = eval(ast.lhs.body, context);
      } else if (isValue(ast.lhs)) {
        ast.rhs = eval(ast.rhs, Object.assign({}, context));
      } else {
        ast.lhs = eval(ast.lhs, context);
      }
    } else if (ast instanceof AST.Identifier) {
       ast = context[ast.name];
    } else {
      return ast;
    }
  }
};
```

代码有点密，但睁大眼睛好好看下，可以看到编码后的规则：

* 首先检测其是否为 application，如果是，则对其求值：
    *   若 abstraction 的两侧都是值，只要将所有出现的 `x` 用给出的值替换掉； (3)
    *   否则，若左侧为值，给右侧求值；(2)
    *   如果上面都不行，只对左侧求值；(1)
* 现在，如果下一个节点是 identifier，我们只需将它替换为它所表示的变量绑定的值。
* 最后，如果没有规则适用于AST，这意味着它已经是一个 value，我们将它返回。

另外一个值得提出的是上下文（context）。上下文持有从名字到值（AST节点）的绑定，举例来说，调用一个函数时，就说你说传的参数绑定到函数需要的变量上，然后再对函数体求值。

克隆上下文能保证一旦我们完成对右侧的求值，绑定的变量会从作用域出来，因为我们还持有原来的上下文。

如果不克隆上下文， application 右侧引入的绑定可能泄露并可以在左侧获取到 —— 这是不应当的。考虑下面的代码：

```haskell
(λx. y) ((λy. y) (λx. x))
```

这显然是无效程序： 最左侧 abstraction 中的标识符 `y`没有被绑定。来看下如果不克隆上下文，求值最后变成什么样。

左侧已经是一个 value，所以对右侧求值。这是个 application，所以会将 `(λx .x)` 与 `y` 绑定，然后对 `(λy. y)` 求值，而这就是 `y` 本身。所以最后的求值就成了 `(λx. x)`。

到目前，我们完成了右侧，它是 value，而 `y` 超出了作用域，因为我们退出了 `(λy. y)`， 如果求值的时候不克隆上下文，我们会得到一个变化过的的上下文，绑定就会泄漏，`y` 的值就是 `(λx. x)`，最后得到错误的结果。

## 6. Printing

OK， 现在差不多完成了：已经可以将一个程序归化为 value，我们要做的就是想办法将这个 value 表示出来。

一个简单的 办法是为每个AST节点添加 ` toString方法`：

```javascript
/* Abstraction */ toString() {
  return `(λ${this.param.toString()}. ${this.body.toString()})`;
}

/* Application */ toString() {
  return `${this.lhs.toString()} ${this.rhs.toString()}`;
}

/* Identifier */ toString() {
  return this.name;
}
```

现在我们可以在结果的根节点上调用 ` toString `方法，它会递归打印所有子节点， 以生成字符串表示形式。

## 7. 组合起来

我们需要一个脚本，将所有这些部分连接在一起，代码看起来是这样的：

```javascript
// assuming you have some source
const source = '(λx. λy. x) (λx. x) (λy. y)';

// wire all the pieces together
const lexer = new Lexer(source);
const parser = new Parser(lexer);
const ast = parser.parse();
const result = Interpreter.eval(ast);

// stringify the resulting node and print it
console.log(result.toString());
```

## 源代码

完整实现可以在 Github 上找到： [github.com/tadeuzagallo/lc-js](https://github.com/tadeuzagallo/lc-js)

#### 完成了！

感谢阅读，一如既往地欢迎你的反馈！
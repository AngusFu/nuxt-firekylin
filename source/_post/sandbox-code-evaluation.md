---
title: "手把手教你写一个 Javascript 框架：沙箱求值"
permission: 0
date: 2016-11-18 00:32:07
desc: "关于沙箱求值，ES6，Proxy，Symbol，WeakMap"
author: "Bertalan Miklos"
social: "https://blog.risingstack.com/author/bertalan/"
from: "https://blog.risingstack.com/writing-a-javascript-framework-sandboxed-code-evaluation/"
tags:
  - 翻译
  - JavaScript
  - ES6
---

**本文是“编写 JavaScript 框架”系列的第三章。在本章中，我将介绍浏览器中对代码求值的几种不同方式及其存在的问题，也会介绍一种依赖 JavaScript 新特性的方法。**

本系列主要是如何开发一个开源的客户端框架，框架名为 NX。我将在本系列中分享框架编写过程中如何克服遇到的主要困难。对 NX 感兴趣的朋友可以点击 NX 项目[主页](http://nx-framework.com/)查看。

本系列章节如下：

* [项目结构（Project structuring）](/2016/nx-project-structure/)
* [执行调度(Execution timing)](/2016/execution-timing/)
* 沙箱求值（本章）
* [数据绑定简介](/2016/data-bind-dirty-checking)
* [ES6 Proxy 实现数据绑定](/2016/es6-proxy-data-binding/)
* 自定义元素
* 客户端路由

## 邪恶 eval

> `eval()` 函数用来对字符串形式的 JavaScript 代码进行求值。

常见的代码求值方法是使用 `eval()` 函数。通过 `eval()` 执行的代码可以访问闭包和全局作用域，所以可能导致[代码注入(code injection)](https://en.wikipedia.org/wiki/Code_injection)，正因此 `eval()` 成为 JavaScript 中最臭名昭著的特性之一。

抛开上述缺点不说，`eval()` 在某些情况下还是很有用的。多数现代前端框架都需要 `eval()` 的这种功能，但是往往又因前述问题畏手畏脚。因此出现许多字符串求值方案，在沙箱而非全局作用域中进行操作。沙箱可以阻止代码访问与安全相关的数据，它通常是一个简单对象，用于替换代码中的全局对象。

## 常见做法

替代 `eval()` 最常见的方式是彻底重新实现。重新实现的过程由解析（parsing）、解释（interpreting）两步组成。首先由解析器创建[抽象语法树](https://en.wikipedia.org/wiki/Abstract_syntax_tree)，然后由解释器遍历语法树，将其译为运行在沙箱中的代码。

这种方案使用广泛，但可谓是杀鸡拿了把牛刀。放弃修补 `eval()`，选择从零开始重写，带来的后果就是，许多 bug 蠢蠢欲动，准备伺机而出。而随着语言的升级更新，也不得不频繁修改源码。

## 另一种思路

[NX](http://nx-framework.com)  尽可能避免了重新实现代码，采用一个很小的库处理求值，该库使用了一些较可能少为人知的新特性。

这一节逐步介绍这些特性，并使用它们解释用于代码求值的 [nx-compile](https://github.com/RisingStack/nx-compile) 库。这个库有一个名为 `compileCode()` 的函数，工作方式如下：

```javascript
const code = compileCode('return num1 + num2')

// 控制台打印 17
console.log(code({num1: 10, num2: 7}))

const globalNum = 12  
const otherCode = compileCode('return globalNum')

// 访问全局作用域被禁止
// 控制台打印 undefined
console.log(otherCode({num1: 2, num2: 3})) 
```

待到本文结束，我们会用不到 20 行的代码实现 `compileCode()` 函数。

### `new Function()`

> Function 构造函数用于创建新的 Function 对象。在 JavaScript 中，所有函数都是 Function 对象。

Function 构造函数可以达到 `eval()` 同样的目的。`new Function(...args, 'funcBody')` 对传入的 `'funcBody'` 字符进行求值，并返回执行这段代码的函数。`new Function()` 与 `eval()` 的不同主要体现在以下两方面：

* `new Function()` 方法只会对传入的代码求值一次。调用返回函数时，只会运行代码，而不会重新求值。

* `new Function()` 方法无法访问闭包中的本地变量；不过还是可以访问全局作用域。

```javascript
function compileCode (src) {  
  return new Function(src)
} 
```

对我们来说，`new Function()` 要优于 `eval()`。它性能更好，也更安全。不过要使其完全可用，还需要阻止其访问全局作用域。

### `with` 关键词

> `with` 能够扩展声明的作用域链。

JavaScript 中，`with` 关键词较少露面。`with` 可以帮我们半沙箱化地执行代码。`with` 语句块首先会试着从传递的沙箱对象检索变量，如果没有找到，则会到闭包和全局作用域中寻找。前面说过，`new Function()` 能够阻止访问闭包中的变量，故现在只需考虑全局作用域的问题。

```javascript
function compileCode (src) {
  src = 'with (sandbox) {' + src + '}'
  return new Function('sandbox', src)
}
```

在内部实现中，`with` 使用了 `in` 操作。对于语句块中的所有变量访问，都会使用 `variable in sandbox` 条件进行判断。若条件为真，则从沙箱对象中读取变量；否则会去全局变量中寻找变量。在 `with` 操作过程中，我们可以让 `variable in sandbox` 永远返回 true，这样就能阻止访问全局变量。

![Sandboxed code evaluation: Simple 'with' statement](http://s0.qhres.com/static/fc3642ce6bdb875f.svg)

### ES6 Proxy

> Proxy 对象用于自定义 Object 的一些基本操作，如属性读取、赋值等行为。

ES6 `Proxy` 封装对象，并定义一些 trap 函数，这些函数可以拦截该对象的基本操作行为。操作对象时，就会调用相应的 trap 函数。使用 `Proxy` 封装沙箱对象，定义一个 `has` 操作 trap，即可覆盖 `in` 操作符的默认行为。

```javascript
function compileCode (src) {
  src = 'with (sandbox) {' + src + '}'
  const code = new Function('sandbox', src)

  return function (sandbox) {
    const sandboxProxy = new Proxy(sandbox, {has})
    return code(sandboxProxy)
  }
}

// 用于拦截对 sandboxProxy 的 'in' 操作
function has (target, key) {
  return true
}
```

上面的代码耍了 `with` 代码块一把。`variable in sandbox` 将永远为真，因为 `has` trap 函数总是返回 true。`width` 代码块中的代码永远无法访问全局对象。

![Sandboxed code evaluation: 'with' statement and proxies](http://s0.qhres.com/static/d9e40b9163d31b54.svg)

### `Symbol.unscopables`

> Symbol 是一种唯一的、不可变的数据类型，可用作对象属性标识符。

`Symbol.unscopables` 是一个驰名 symbol（[Well-known symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)）。所谓“驰名 symbol”，实际上是一些内置 JavaScript `Symbol`，代表某些内部语言行为。驰名 symbol 可以用于添加或重写一些行为，如数据的迭代、基本类型转换。

> Symbol.unscopables 用于指定对象的一些固有和继承属性，这些属性被排除在 `with` 所绑定的环境之外无法读取。

`Symbol.unscopables` 用于定义对象的 unscopable 属性（译者：不译，请自行领会）。`with` 声明中的沙箱对象的 unscopable 属性无法读取，这些属性会从闭包、全局作用域中读取。通常极少需要用到 `Symbol.unscopables`。在[这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables)可以看到引入 `Symbol.unscopables` 的原因。

![Sandboxed code evaluation: 'with' statement and proxies. A security issue.](http://s3.qhres.com/static/f8e5bdb1ebf22a58.svg)

我们为沙箱对象 proxy 添加一个`get` trap 函数，拦截检索 `Symbol.unscopables` 属性的行为，总是返回 undefined。这样会骗到 `with` 代码块，使其认为沙箱对象没有任何 unscopable 属性。

```javascript
function compileCode (src) {
  src = 'with (sandbox) {' + src + '}'
  const code = new Function('sandbox', src)

  return function (sandbox) {
    const sandboxProxy = new Proxy(sandbox, {has, get})
    return code(sandboxProxy)
  }
}

function has (target, key) {
  return true
}

function get (target, key) {
  if (key === Symbol.unscopables) return undefined
  return target[key]
} 
```

![Sandboxed code evaluation: 'with' statement and proxies. Has and get traps.](http://s0.qhres.com/static/f2ac13b8fe932334.svg)

### 使用 WeakMap 进行缓存

代码现在是安全的，但性能还有可提升之处：可以看到，每次调用返回的函数时都会新建一个 `Proxy`。通过缓存可以避免该问题，每次调用时，若沙箱对象相同，则可以使用同一个 `Proxy` 对象。

Proxy 对象与沙箱对象一一对应，故可以单纯地将其作为沙箱对象的一个属性。不过，这可能会对外暴露代码实现细节。另外，若使用的是 `Object.freeze()` 冻结之后的不可变沙箱对象也不行。所以采用 `WeakMap` 才是更好的选择。

> WeakMap 对象是一个键值对集合。键为弱引用，必须是对象；值可以为任意类型。

`WeakMap` 可在不直接扩展对象属性的情况下为该对象附加数据。通过 `WeakMap` 间接为沙箱对象添加缓存的 `Proxy`。

```javascript
const sandboxProxies = new WeakMap()

function compileCode (src) {
  src = 'with (sandbox) {' + src + '}'
  const code = new Function('sandbox', src)

  return function (sandbox) {
    if (!sandboxProxies.has(sandbox)) {
      const sandboxProxy = new Proxy(sandbox, {has, get})
      sandboxProxies.set(sandbox, sandboxProxy)
    }
    return code(sandboxProxies.get(sandbox))
  }
}

function has (target, key) {
  return true
}

function get (target, key) {
  if (key === Symbol.unscopables) return undefined
  return target[key]
} 
```

这样一来，只会为每个沙箱对象新建一次 `Proxy` 对象。

### 最后一点

上面的 `compileCode()` 例子仅 19 行代码，已经是一个可以工作的沙箱代码求值工具。如果有兴趣看看 nx-compile 的完整代码，可以访问 [Github 仓库](https://github.com/RisingStack/nx-compile)。

除解释代码求值外，本章的主要目的是展示一些 ES6 新特性，用它们替代原有方式。贯穿整个例子，我试图展示了 `Proxy` 和 `Symbol` 的强大力量。

## 写在最后

如果对 NX 框架感兴趣，请访问 [主页](http://nx-framework.com/)。胆大的读者还可以在 Github 上查看 [NX 源码](https://github.com/RisingStack/nx-framework) 和 [nx-observe 源码](https://github.com/RisingStack/nx-observe)。

希望你喜欢这篇文章。下一章我们将讨论 [数据绑定](https://blog.risingstack.com/writing-a-javascript-framework-data-binding-dirty-checking/)。


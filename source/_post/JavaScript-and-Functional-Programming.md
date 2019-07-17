---
title: JavaScript  与函数式编程
date: 2016-08-10 12:19:08
desc: JavaScript  与函数式编程
author: Beth Allchurch
social: https://www.twitter.com/BethAllchurch
permission: 0
from: https://bethallchurch.github.io/JavaScript-and-Functional-Programming/
tags: 
    - 翻译
    - 函数式编程
    - JavaScript
---

> **译者注：推荐一篇译文，[《函数式编程术语解析》](http://pinggod.com/2016/函数式编程术语解析)。**

*本文是我在 2016 年 7 月 29 号听 Kyle Simpson 精彩的课程**《Functional-Light JavaScript》**时所做的笔记（外加个人的深入研究）（[幻灯片在这](https://speakerdeck.com/getify/functional-light-javascript)）。*

长久以来，面向对象在 JavaScript 编程范式中占据着主导地位。不过，最近人们对函数式编程的兴趣正在增长。函数式编程是一种编程风格，它强调将程序状态变化（即*副作用[side effect]*）的次数减到最小。因此，函数式编程鼓励使用*不可变*数据（immutable data）和纯函数（pure functions）（“纯”意味着没有副作用的）。它也更倾向于使用*声明式*的风格，鼓励使用命名良好的函数，这样就能使用在我们视线之外的那些打包好的细节实现，通过描述希望发生什么以进行编码。

尽管面向对象编程与函数式编程之间有些矛盾，它们却并非互斥的关系。JavaScript 所拥有的工具，能支持这两种方式。甚至可以说，就算不把它孤立地当作函数式语言使用，还是有不少来自函数式方法的概念和最佳实践可以帮助我们，让代码更干净，可读性更强，推理起来更简单。


## 副作用最小化

所谓*副作用*，指的是函数内部产生了超出函数之外的变化。函数可能会做一些事，如操作 DOM、修改更高层作用域中的变量值，或者将数据写入数据库。这些带来的就是副作用。

```javascript
// 有副作用的函数
var x = 10;

const myFunc = function ( y ) {
  x = x + y;
};

myFunc( 3 );
console.log( x ); // 13

myFunc( 3 );
console.log( x ); // 16 
```

副作用并非天生邪恶。不产生任何副作用的程序也无法影响世界，因此也没有任何意义（除非是作为理论兴趣进行研究）。不过，副作用确实是危险的，应当尽量避免使用，除非绝对必要。

当函数产生副作用的时候，仅凭借输入输出的内容，不足以明确函数究竟做了什么工作。必须了解上下文环境、程序状态的历史，这让函数更难理解。在不可预测的交互方式下，副作用可能带来一些 bug，且函数因上述依赖，测试起来也更困难。

副作用最小化是函数式编程中最基础的原则，接下来的多数小节都可以当作是避免副作用的一些办法概要。

## 视数据为不可变（Immutable）

变动（mutation）指的是值在原位置上的变化（an in-place change to a value）。不可变值意味着，一旦创建出来，永远都不会变化。在 JavaScript 中，简单值如数字、字符串、布尔值这些是不可变的。不过，像对象、数组这样的数据结构都是可变的。

```javascript
// push 方法改变了数组
const x = [1, 2];
console.log( x ); // [1, 2]

x.push( 3 );
console.log( x ); // [1, 2, 3] 
```
为什么要避免变动数据呢？

变动是一种副作用。程序中变化的东西越少，需要跟踪记录的也就越少，程序也就越简单。

JavaScript 中维持对象、数组等数据结构不可变性的可用工具很有限。通过 `Object.freeze` 可以强制实现对象的不可变，但作用深度只有一层：

```
const frozenObject = Object.freeze( { valueOne : 1, valueTwo : { nestedValue : 1 } } );
frozenObject.valueOne = 2; // 不允许
frozenObject.valueTwo.nestedValue = 2; // 竟然允许了! 
```

不过，还是有一些很棒的工具库解决了这些问题，其中最著名的要数 [Immutable](https://facebook.github.io/immutable-js/) 了。

对多数应用来说，使用工具库来保证不可变性有些矫枉过正。很多情况下，简单地将数据当作是不可变的，就能让我们受益良多。

### 避免变动：数组

JavaScript 数组方法可以被概括为[变动方法 (mutator methods) ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Mutator_methods)和非变动方法。应当尽可能避免变动方法。

举例来说，`concat` 方法可以用来替代 `push` 方法。`push` 改变了原数组；`concat` 返回由原数组和作为参数的数组组成的新数组，而原来的数组还是完整的。

```javascript
// push 改变了数组
const arrayOne = [1, 2, 3];
arrayOne.push( 4 );

console.log( arrayOne ); // [1, 2, 3, 4]

// concat 生成了新数组，原数组保持不变
const arrayTwo = [1, 2, 3];
const arrayThree = arrayTwo.concat([ 4 ]);

console.log( arrayTwo ); // [1, 2, 3]
console.log( arrayThree ); // [1, 2, 3, 4] 
```
还有一些非变动方法，包括 [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)、[`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)、[`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) 等。

### 避免变动：对象

可以使用 [`Object.assign`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 方法，而非直接编辑对象。该方法将源对象的属性复制到目标对象中，并将目标对象返回。如果总是用一个空对象作为目标对象，就能通过 `Object.assign` 避免直接编辑对象。

```javascript
const objectOne = { valueOne : 1 };
const objectTwo = { valueTwo : 2 };

const objectThree = Object.assign( {}, objectOne, objectTwo );

console.log( objectThree ); // { valueOne : 1, valueTwo : 2 } 
```

### 关于 `const` 

`const` 很有用，却不会使数据不可变。它只能防止变量被重新赋值。这不能混为一谈。

```javascript
const x = 1;
x = 2; // 不允许

const myArray = [1, 2, 3];
myArray = [0, 2, 3]; // 不允许

myArray[0] = 0; // 允许了! 
```

## 书写纯函数

*纯函数* 不会改变程序的状态，也不会产生可感知的副作用。纯函数的输出，仅仅取决于输入值。无论何时何地被调用，只要输入值相同，返回值也就一样。

纯函数是最小化副作用的重要工具。另外，与上下文无关的特点，也让它们有了高可测试性和可复用性。

前面讲副作用的小节中的代码里， `myFunc` 函数就是非纯函数，注意两次调用时输入相同但每次返回结果却不同。不过，它也能改写成纯函数：

```javascript
// 将全局变量变为局部变量
const myFunc = function ( y ) {
  const x = 10;
  return x + y;
}

console.log(myFunc( 3 )); // 13
console.log(myFunc( 3 )); // 13 
```

```javascript
// 将 x 作为参数传递
const x = 10;

const myFunc = function ( x, y ) {
  return x + y;
}

console.log(myFunc( x, 3 )); // 13
console.log(myFunc( x, 3 )); // 13 
```

你的程序最终肯定还是会产生一些副作用。当副作用产生的时候，小心应对，尽可能地约束、限制它们的影响。

## 书写返回函数的函数（Function-Generating Functions）

找一些程经验的人，让他们猜猜下面的代码做了什么：

例 1

```javascript
const numbers = [1, 2, 3];

for ( let i = 0; i < numbers.length; i++ ) {
  console.log( numbers[i] );
} 
```

例 2

```javascript
const numbers = [1, 2, 3];

const print = function ( input ) {
  console.log( input );
};

numbers.forEach( print ); 
```

我测试过的所有人在例 2 上运气更好。例 1 展示的是*命令式*方法，将一列数字打印出来。例 2 展示的是*声明式*方法。将循环遍历数组、在控制台打印数字这些细节各种包装成 `forEach` 和 `print` 函数，无需知道*如何做*，就可以表达我们需要程序*做什么*。这让代码可读性更高。例 2 的最后一行看起来，很接近英语句子。

采用这种方法，涉及到编写大量函数。利用现有函数编写生成新函数的函数，可以让这个过程中的重复（[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)-er）更少。

特别地，JavaScript 的两个特性让这种形式的函数生成变得可能。第一个是*闭包*。函数能够访问包含作用域中的变量，就算该作用域已不复存在，这就是闭包。第二个特性是，JavaScript 将函数当作值来对待。这使书写高阶函数成为可能，高阶函数可以接收函数作为参数，并/或返回函数。

这些特性组合在一起，我们就可以编写返回函数的函数了。返回的函数能“记住”传给生成函数的参数，并在程序的其他地方使用这些参数。

### 函数组合

通过*函数组合*，可能将函数组合在一起形成新的函数。一起来看例子：

```javascript
// 通过 add 和 square 函数组合生成 addThenSquare
const add = function ( x, y ) {
  return x + y;
};

const square = function ( x ) {
  return x * x;
};

const addThenSquare = function ( x, y ) {
  return square(add( x, y ));
};
```

你可能会发现一直在重复这种利用更小的函数生成一个更复杂的函数的形式。通常编写一个组合函数会更有效率：

```javascript
const add = function ( x, y ) {
  return x + y;
};

const square = function ( x ) {
  return x * x;
};

const composeTwo = function ( f, g ) {
  return function ( x, y ) {
    return g( f ( x, y ) );
  };
};

const addThenSquare = composeTwo( add, square ); 
```

还可以走得更远，编写一个更一般化的组合函数：

```javascript
// 这个版本的 composeTwo 的初始化函数可以接收任意数量的参数
const composeTwo = function ( f, g ) {
  return function ( ...args ) {
    return g( f( ...args ) );
  };
};

// composeMany 可以接收任意数量的函数
// 其初始化函数能接收任意数量的参数
const composeMany = function ( ...args ) {
  const funcs = args;
  return function ( ...args ) {
    funcs.forEach(( func ) => {
      args = [func.apply( this, args )]; 
    });
    return args[0];
  };
}; 
```

组合函数的最终形式取决于你所需的通用性水平，以及偏好的 API 类型。

### 偏函数（Partial Application）

*Partial 函数应用* 指定函数参数中的一个或多个，然后返回一个稍后会被完整调用的函数。

在下面的例子中，`double`、`triple` 和 `quadruple` 都是 `multiply` 函数的 partial 应用。

```javascript
const multiply = function ( x, y ) {
  return x * y;
};

const partApply = function ( fn, x ) {
  return function ( y ) {
    fn( x, y );
  };
};

const double = partApply( multiply, 2 );
const triple = partApply( multiply, 3 );
const quadruple = partApply( multiply, 4 );
```

### 柯里化

*柯里化*是将接收多个参数的函数转换为一系列只接收一个参数的函数的过程。

```javascript
const multiply = function ( x, y ) {
  return x * y;
};

const curry = function ( fn ) {
  return function ( x ) {
    return function ( y ) {
      return fn( x, y );
    };
  };
};

const curriedMultiply = curry( multiply );

const double = curriedMultiply( 2 );
const triple = curriedMultiply( 3 );
const quadruple = curriedMultiply( 4 );

console.log(triple( 6 )); // 18 
```
柯里化和 partial 应用在概念上很相似（可能不会两个都需要使用），但仍然有所不同。主要区别在于，柯里化总是生成函数套链，每次只接收一个参数，而 partial 应用返回的函数可以一次接收多个参数。 比较它们作用于最少接收三个参数的函数时，这种差别就更明晰了：

```javascript
const multiply = function ( x, y, z ) {
  return x * y * z;
};

const curry = function ( fn ) {
  return function ( x ) {
    return function ( y ) {
      return function ( z ) {
        return fn( x, y, z );
      };
    };
  };
};

const partApply = function ( fn, x ) {
  return function ( y, z ) {
    return fn( x, y, z );
  };
};

const curriedMultiply = curry( multiply );
const partiallyAppliedMultiply = partApply( multiply, 10 );

console.log(curriedMultiply( 10 )( 5 )( 2 )); // 100
console.log(partiallyAppliedMultiply( 5, 2 )); // 100
```

## 递归

*递归*函数是这样一种函数，它会一直调用自身，直至满足基本条件。递归函数是高度声明式的。它们也很优雅，写起来很爽！

下面是计算递归计算阶乘的例子：

```javascript
const factorial = function ( n ) {
  if ( n === 0 ) {
    return 1;
  }
  return n * factorial( n - 1 );
};

console.log(factorial( 10 )); // 3628800
```

在 JavaScript 中使用递归函数需要细心一些。每次函数调用都会向调用栈（call stack）中加入新的调用帧（call frame），当函数返回的时候，该调用帧从调用栈中弹出。递归函数调用在返回之前调用自身，所以很容易就会超出调用栈的限制，导致程序崩溃。

不过，这可以通过*尾调用优化*来避免。

### 尾调用优化

尾调用指的是，某个函数的最后一步动作是调用函数。尾调用优化指的是，当语言编译器识别到尾调用的时候，会对其复用相同的调用帧。这意味着，在编写尾调用的递归函数时，调用帧的限制永远不会被超出，因为调用帧会被反复使用。

下面是将前面的递归函数采用尾递归优化重写之后的例子:

```javascript
const factorial = function ( n, base ) {
  if ( n === 0 ) {
    return base;
  }
  base *= n;
  return factorial( n - 1, base );
};

console.log(factorial( 10, 1 )); // 3628800
```

[ES2015 语言规范](http://www.ecma-international.org/ecma-262/6.0/#sec-tail-position-calls)中已包含了适当的尾部调用的支持，但目前在大部分环境中尚未得到支持。可以在[这里](https://kangax.github.io/compat-table/es6/)查看你能否使用。

## 小结

函数式编程容纳了许多思想，借助它们可以优化代码。纯函数和不可变数据将副作用的危害最小化，声明式编程让代码可读性大大提高。在与复杂性的斗争中，这些是我们应当拥抱的重要工具。

## 资源

### 概述性

*   [SitePoint: An Introduction to Functional JavaScript](https://www.sitepoint.com/series/introduction-functional-javascript/)

*   [John Hughes: Why Functional Programming Matters](http://www.cs.utexas.edu/~shmat/courses/cs345/whyfp.pdf)

*   [Vasily Vasinov: 16 Months of Functional Programming](http://www.vasinov.com/blog/16-months-of-functional-programming/)

*   [Stephen Young: Functional programming with Javascript](http://stephen-young.me.uk/2013/01/20/functional-programming-with-javascript.html)

*   [James Sinclair: A Gentle Introduction to Functional JavaScript](http://jrsinclair.com/articles/2016/gentle-introduction-to-functional-javascript-intro/)

### 副作用

*   [Wikipedia: Side effect (computer science)](https://en.wikipedia.org/wiki/Side_effect_(computer_science))

*   [Stack Overflow: Are side effects a good thing?](http://stackoverflow.com/questions/763835/are-side-effects-a-good-thing)

### 不可变性

*   [Site Point: Immutability in JavaScript](https://www.sitepoint.com/immutability-javascript/)

*   [Auth0: Introduction to Immutable.js and Functional Programming Concepts](https://auth0.com/blog/2016/03/23/intro-to-immutable-js/)

*   [Stack Exchange: If immutable objects are good, why do people keep creating mutable objects?](http://programmers.stackexchange.com/questions/151733/if-immutable-objects-are-good-why-do-people-keep-creating-mutable-objects)

*   [Stack Overflow: Why is immutability so important(or needed) in javascript?](http://stackoverflow.com/questions/34385243/why-is-immutability-so-importantor-needed-in-javascript)

*   [React.js Conf 2015 - Immutable Data and React (video)](http://www.youtube.com/watch?v=I7IdS-PbEgI&t=14m8s)

*   [Redux: Avoiding Array Mutations with concat(), slice(), and …spread (video)](https://egghead.io/lessons/javascript-redux-avoiding-array-mutations-with-concat-slice-and-spread)

*   [Redux: Avoiding Object Mutations with Object.assign() and …spread (video)](https://egghead.io/lessons/javascript-redux-avoiding-object-mutations-with-object-assign-and-spread)

### 纯函数

*   [Redux: Pure and Impure Functions](https://egghead.io/lessons/javascript-redux-pure-and-impure-functions)

### 函数生成

*   [Eloquent JavaScript: Higher-Order Functions](http://eloquentjavascript.net/05_higher_order.html)

*   [Scott Sauyet: Compose Yourself: Fun with Functions](http://scott.sauyet.com/Javascript/Talk/Compose/2013-05-22/#slide-0)

*   [Vasily Vasinov: On Currying and Partial Function Application](http://www.vasinov.com/blog/on-currying-and-partial-function-application/)

*   [2ality: Currying versus partial application](http://www.2ality.com/2011/09/currying-vs-part-eval.html)

### 递归

*   [Stack Overflow: What is recursion and when should I use it?](http://stackoverflow.com/questions/3021/what-is-recursion-and-when-should-i-use-it)

*   [Medium: Recursion](https://medium.com/functional-javascript/recursion-282a6abbf3c5#.i913o81g3)

*   [Kyle Owen: ES6 Tail Call Optimization Explained](http://benignbemine.github.io/2015/07/19/es6-tail-calls/)

*   [Don Taylor: Functional JavaScript – Tail Call Optimization and Trampolines](https://taylodl.wordpress.com/2013/06/07/functional-javascript-tail-call-optimization-and-trampolines/)

*   [Mark McDonnell: Understanding recursion in functional JavaScript programming](http://www.integralist.co.uk/posts/js-recursion.html)
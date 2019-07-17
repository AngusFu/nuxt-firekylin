---
title: 'Facebook 开源代码优化工具 Prepack'
desc: 'Facebook 开源代码优化工具 Prepack'
date: 2017-05-04
tags:
  - JavaScript
---

Fackbook 又搞了个大新闻！

今天一早，朋友圈被一个名为 Prepack 的工具刷爆了。

周刊君很好奇地看了下官网（[prepack.io](https://prepack.io/)），这么厉害的工具，有必要第一时间向大家介绍一下（还能不能好好过个青年节了）。

看 “Prepack” 这个名字就能大概知道，它的作用，肯定是在发布前（“pre”）对代码动了些什么手脚。官网介绍 Prepack 是“一个使 JavaScript 跑得更快的工具”。那么它到底做了些什么厉害的事情呢？

根据官网首页信息，Prepack “能够消除那些可以本可以在编译（compile）阶段完成的运行时计算”，将代码中的某些部分替换为一系列赋值语句，这样一来就可以省去很多中间计算和对象的分配工作。

### 官方示例

下面是 Prepack 官网给出的一个例子：

```javascript
(function () {
  var self = this;
  ['A', 'B', 42].forEach(function(x) {
    var name = '_' + x.toString()[0].toLowerCase();
    var y = parseInt(x);
    self[name] = y ? y : x;
  });
})();
```

经过 Prepack 的处理，上面这段代码变成了下面这样：

```javascript
(function () {
  _a = "A";
  _b = "B";
  _4 = 42;
})();
```

原来的 `.forEach` 调用没有了，一系列的中间转换过程也不见了。借用官网的说法，“多数的计算都在 Prepack 编译时进行了预初始化”。

再举一个 Fibonacci 的例子：

```javascript
// 处理前
(function () {
  function fibonacci(x) {
    return x <= 1 ? x : fibonacci(x - 1) + fibonacci(x - 2);
  }
  global.x = fibonacci(23);
})();

// 处理后
(function () {
  x = 28657;
})();
```

### 工作机制

据官网介绍，Prepack 的实现依赖以下几个方面：

#### 1. AST（抽象语法树）

Prepack 是在 AST 这一层级对代码进行操作的。通过 Babel 来解析源码，并生成优化后的代码。关于 Babel 与 AST，周刊君推荐两篇文章：

* 《[Babel for ES6? And Beyond!](https://mp.weixin.qq.com/s/fFQUBeg332gdU8yNddauxQ)》

* 《[通过开发 Babel 插件理解抽象语法树（AST）](http://www.zcfy.cc/article/347)》

#### 2. 具体执行（Concrete Execution）

Prepack 的核心部分是“一个大致兼容 ECMAScript 5 的编译器”（an almost ECMAScript 5 compatible interpreter），而这个编译器是通过 JavaScript 实现的。这个编译器可以追踪、撤销包括对象变化在内的所有的操作。这样一来就能进行推理性的优化（speculative optimizations）。

#### 3. 符号执行（Symbolic Execution）

除了计算具体值，Prepack 的编译器还可以操作抽象值，而这些抽象值通常都来自于代码与环境的交互。如 `Date.now` 所返回的就是抽象值。此外，根据官网首页的描述，还可以通过 `__abstract()` 这样的辅助工具函数，手动插入抽象值。Prepack 会追踪发生在抽象值之上的操作，如果有分支情况，则会对所有可能性进行探查。

官网介绍说，“因此，Prepack 为 JavaScript 实现了一套符号执行引擎”。为了方便大家理解，周刊君特地引用了[维基百科](https://zh.wikipedia.org/wiki/%E7%AC%A6%E5%8F%B7%E6%89%A7%E8%A1%8C)上的一段话：

> 符号执行 （Symbolic Execution）是一种程序分析技术。其可以通过分析程序来得到让特定代码区域执行的输入。使用符号执行分析一个程序时，该程序会使用符号值作为输入，而非一般执行程序时使用的具体值。在达到目标代码时，分析器可以得到相应的路径约束，然后通过约束求解器来得到可以触发目标代码的具体值。

#### 4. 抽象解释（Abstract Interpretation）

官网的描述有点复杂。关于抽象解释，请移步[维基百科](https://en.wikipedia.org/wiki/Abstract_interpretation)。有兴趣的可以去官网阅读原文。

#### 5. 堆序列化（Heap Serialization）

初始化阶段结束时，Prepack 会捕获最终的堆。按顺序遍历堆，生成新的代码，创建、链接堆中的可及对象。

如前所述，堆中的一些值可能是对抽象值进行计算的结果。Prepack 将会根据这些值生成执行计算的代码，其计算过程与源程序相同。

### 环境很重要！

需要注意的是，Prepack 并未完整模拟浏览器、Node 环境，Prepack 对 `document` 和 `window` 并没有多少了解。对这样一些属性求值的时候，将会得到 `undefined`。如果需要在这样一些地方使用 Prepack，必须通过一些工具函数实现。

### 如何尝鲜

```bash
# 安装
npm install -g prepack

# 处理文件，并打印到控制台
prepack script.js

# 处理文件，并输出到新文件
prepack script.js --out script-processed.js
```

除了上面的基本用法之外，还支持如 sourceMap 等更多选项。这里就不一一介绍了。

### 当前支持情况

此外，官方介绍称，**“Prepack 目前仍处于早期开发阶段，尚未做好投入生产环境的准备”**。不过，还是响应 Prepack 的号召吧，“try it out, give feedback, and help fix bugs”。

想要进一步关于该项目的发展计划，可以访问官网首页的 [Roadmap](https://prepack.io/) 部分。

### 相关技术

Closure Compiler 同样会对 JavaScript 代码进行优化。Prepack 比 Closure Compiler 走得更远的地方在于执行了初始化阶段的全局代码，展开循环、递归。官网的一个说法是，“Prepack 着眼于运行时性能，而 Closure Compiler 的重点在于代码体积”。

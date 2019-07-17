---
title: "手把手教你写一个 Javascript 框架：项目结构"
date: 2016-11-20 23:27:40
desc: "手把手教你写一个 Javascript 框架：项目结构"
author: "Bertalan Miklos"
permission: 0
social: "https://blog.risingstack.com/author/bertalan/"
from: "https://blog.risingstack.com/writing-a-javascript-framework-project-structuring/"
tags:
  - 翻译
  - ES6
  - JavaScript
---
过去几个月中，RisingStack 的 JavaScript 工程师 Bertalan Miklos 编写了新一代客户端框架 [NX](http://nx-nxframework.rhcloud.com)。Bertalan 将通过**编写 JavaScript 框架**系列文章与我们分享他在编写框架过程中的收获：

**本章将展示 NX 的项目结构，并讲述如何解决可扩展性、依赖注入以及私有变量等方面的一些困难。**

本系列章节如下：

1.  项目结构（正是本文）
2.  [执行调度(Execution timing)](/2016/execution-timing/)
3.  [沙箱求值](/2016/sandbox-code-evaluation/)
4.  [数据绑定简介](/2016/data-bind-dirty-checking)
5.  [ES6 Proxy 实现数据绑定](/2016/es6-proxy-data-binding/)
6.  自定义元素
7.  客户端路由

## 项目结构

没有放之四海而皆准的项目结构，但有一些基本准则。感兴趣的同学可以看下我们的 Node Hero 系列中的《[Node.js 项目结构教程](https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/) 》这一章。

### NX 框架概览

NX 的目标是成为一个开源社区驱动的易于扩展的项目。项目特点如下：

* 包含现代客户端框架必须的所有特性；
* 除 polyfill 外，没有任何外部依赖；
* 代码总量 3000 行；
* 没有代码多于 300 行的模块；
* 单个特性模块依赖不超过 3 个。

项目各模块依赖关系如下图所示：

![JavaScript Framework in 2016: The NX project structure](https://p4.ssl.qhimg.com/t01c9e92dbaa52fc18f.png)

这种结构为典型框架开发难题提供了一种解决方案。

* 扩展性
* 依赖注入
* 私有变量

### 可扩展性实现

社区驱动项目必须易于扩展。故项目的核心部分应当小巧，并拥有一个预定义的依赖处理系统。前者确保项目易于理解，后者则保证框架稳定。

本节先聚焦于实现小巧的内核。

现代框架应当拥有的主要特性就是创建自定义元素并将其应用于 DOM 的能力。NX 的核心只有一个 `component` 函数，它的工作正在于此这个函数允许用户配置、注册一个新类型的元素。

```javascript
component(config)
  .register('comp-name')
```

注册的 `comp-name` 是空组件类型，可以按照预期在 DOM 中实例化。

```html
<comp-name></comp-name>
```

下一步是保证能使用新特性扩展组件。为保持简洁、可扩展，这些新特性不应该污染核心部分。这时候使用依赖注入就很方便了。

## 利用中间件实现依赖注入（DI）

如果你对依赖注入不太熟悉，建立先阅读这篇文章：《[Dependency Injection in Node.js](https://blog.risingstack.com/dependency-injection-in-node-js)》。

> 依赖注入是一种设计模式，在这种模式中，一个或多个依赖或服务被注入到或引用传递给一个独立对象。

DI 解决了硬性依赖，却引入了新问题。使用者需要知道如何配置、注入依赖。大多客户端框架都将这些工作交给 DI 容器，帮助开发者完成。

> DI 容器指的是知道如何实例化、配置对象的对象。

另外一种方式则是中间件 DI 模式，这在服务端得到广泛应用（如 Express、Koa 等）。其中的奥秘在于，所有可注入的依赖（中间件）拥有相同的接口，以相同方式注入。这种方法则无需 DI 容器。

为保持简洁，我决定采用中间件模式。若你曾使用过 Express，以下代码自然不会陌生：

```javascript
component()
  .use(paint) // inject paint middleware
  .use(resize) // inject resize middleware
  .register('comp-name')

function paint (elem, state, next) {
  // elem is the component instance, set it up or extend it here
  elem.style.color = 'red'
  // then call next to run the next middleware (resize)
  next()
}

function resize (elem, state, next) {
  elem.style.width = '100 px'
  next()
}
```

中间件在新的组件实例插入 DOM 时执行，通常会给实例扩展一些新特性。如若不同库扩展相同对象，则将导致名称冲突。暴露私有变量会加剧问题，并可能被其他人意外利用。

公开 API 小巧玲珑，其余部分隐身不见，正是避免问题的优秀方案。

### 处理私有变量

JavaScript 中需要通过函数作用域来实现私有变量。需要使用跨作用域私有变量时，人们习惯使用`_`前缀来标志，并将其公开暴露。这可以避免意外使用，但无法解决命名冲突。更好的办法是使用  ES6 的 `Symbol` 基本数据类型。

> Symbol 是一种唯一的、不可变的数据类型，可用作对象属性标识符。

下面的代码展示了 symbol 的实际使用：

```javascript
const color = Symbol()

// a middleware
function colorize (elem, state, next) {
  elem[color] = 'red'
  next()
}
```

这样一来，通过 `color` symbol （以及元素 elem）就能获取 `red`。`red` 的私有程度，可由 `color` symbol 暴露的不同程度控制。合理数量的私有变量，通过中心存储读取，是一种优雅的解决方案。

```javascript
// symbols module
exports.private = {
  color: Symbol('color from colorize')
}
exports.public = {}
```

`index.js` 如下：

```javascript
// main module
const symbols = require('./symbols')
exports.symbols = symbols.public
```

在项目内部，所有模块都可访问 symbol 存储对象，但私有部分不会对外暴露。公有部分则可用于对外部开发者暴露一些低层次特性。这就避免了意外使用，因为开发者需要明确引入需要使用的 symbol。此外，symbol 引用也不会像字符串一样产出冲突，是故不会产生命名冲突。

以下几点概括了不同场景下的用法：

**1. 公有变量**

正常使用.

```javascript
function (elem, state, next) {
  elem.publicText = 'Hello World!'
  next()
}
```

**2. 私有变量**

项目私有的跨作用域变量，应当在私有 symbol 对象中加入一个 symbol key。

```javascript
// symbols module
exports.private = {
  text: Symbol('private text')
}
exports.public = {}
```

并在需要的地方引入。

```javascript
const private = require('symbols').private

function (elem, state, next) {
  elem[private.text] = 'Hello World!'
  next()
}
```

**3. 半私有变量**

低层次 API 的变量，应当在公有 symbol 对象中加入一个 symbol key。

```javascript
// symbols module
exports.private = {
  text: Symbol('private text')
}
exports.public = {
  text: Symbol('exposed text')
}
```

并在需要的地方引入。

```javascript
const exposed = require('symbols').public

function (elem, state, next) {
  elem[exposed.text] = 'Hello World!'
  next()
}
```

### 写在最后

如果对 NX 框架感兴趣，请访问 [主页](http://nx-framework.com/)。胆大的读者还可以在 Github 上查看 [NX 源码](https://github.com/RisingStack/nx-framework) 和 [nx-observe 源码](https://github.com/RisingStack/nx-observe)。

希望你喜欢这篇文章。下一章我们将讨论执行调度。

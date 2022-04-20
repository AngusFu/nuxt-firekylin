---
title: "手把手教你写一个 Javascript 框架：执行调度"
permission: 0
date: 2016-11-14 22:37:14
desc: "手把手教你写一个 Javascript 框架：执行调度"
author: "Bertalan Miklos"
social: "https://blog.risingstack.com/author/bertalan/"
from: "https://blog.risingstack.com/writing-a-javascript-framework-execution-timing-beyond-settimeout/"
tags:
  - 翻译
  - JavaScript
  - Event Loop

---

**本文是“编写 JavaScript 框架”系列的第二章。在本章中，我将介绍 JavaScript 中异步执行代码的几种不同方式。你会读到关于事件循环相关的内容，以及像 setTimeout 和 Promise 等时间调度（timing）技术之间的差异。**

本系列主要是如何开发一个开源的客户端框架，框架名为 NX。我将在本系列中分享框架编写过程中如何克服遇到的主要困难。对 NX 感兴趣的朋友可以点击 NX 项目[主页](http://nx-framework.com/)查看。

本系列章节如下：

* [项目结构（Project structuring）](/post/nx-project-structure/)
* 执行调度（Execution timing)（本章）
* [沙箱求值（Sandboxed code evaluation）](/post/sandbox-code-evaluation/)
* [数据绑定简介](/post/data-bind-dirty-checking)
* [ES6 Proxy 实现数据绑定](/post/es6-proxy-data-binding/)
* 自定义元素
* 客户端路由

## 异步执行代码

说到异步执行代码，恐怕大部分人都很熟悉 `Promise`、`process.nextTick()`、`setTimeout()` 以及 `requestAnimationFrame()` 等方式吧。它们在内部都使用了事件循环（Event Loop），但就时间精确度而言，它们的表现却截然不同。

本章将解释它们之间的差异，并介绍如何实现像 NX 这样的现代框架所需要的时间调度系统。不必重造轮子，使用原生的事件循环就可以达到目的。

## 事件循环

所谓事件循环，实际 [ES6 标准](http://www.ecma-international.org/ecma-262/6.0/) 完全没有提到。JavaScript 自身只有任务、任务队列。更复杂的事件循环，分别由 NodeJS 和 [HTML5 标准](https://www.w3.org/TR/2016/CR-html51-20160621/webappapis.html#event-loops) 各自说明。因为本系列是关于前端的，我将在此阐释后者。

事件循环之所以称为循环，是由原因的。它是一个寻找新任务并执行任务的无限循环。一次循环被称为一个 tick。单个 tick 内执行的代码称作任务（task）。

```javascript
while (eventLoop.waitForTask()) {
  eventLoop.processNextTask()
}
```

所谓任务，是指那些可能在循环中安排其他任务的同步的代码片段。一种安排新任务的简单方式是使用 `setTimeout(taskFn)`。不过，任务也可能来自其他地方，如用户事件、网络请求或 DOM 操作。

![Execution timing: Event loop with tasks](http://s1.qhres.com/static/a0a33a05bacdd091.svg)

### 任务队列

来点更复杂的。事件循环中可以有多个任务队列，但有两个限制：来源相同的事件必须归属于同一队列；每个队列中的任务按照插入顺序执行。除此之外，浏览器是完全自由的。比如说，它可以自己决定接下来执行哪一个任务队列。

```javascript
while (eventLoop.waitForTask()) {
  const taskQueue = eventLoop.selectTaskQueue()
  if (taskQueue.hasNextTask()) {
    taskQueue.processNextTask()
  }
}
```

这个模型放松了对时间的精确控制。浏览器在执行我们用 `setTimeout()` 设置的任务之前，可能决定先处理完其他队列。

![Execution timing: Event loop with task queues](http://s3.qhres.com/static/9939d06126824a37.svg)

### Microtask 队列

幸运的是，事件循环中还有一个单线队列。每个 tick 内，当前任务完成后，microtask 队列被完全清空。

```javascript
while (eventLoop.waitForTask()) {
  const taskQueue = eventLoop.selectTaskQueue()
  if (taskQueue.hasNextTask()) {
    taskQueue.processNextTask()
  }

  const microtaskQueue = eventLoop.microTaskQueue
  while (microtaskQueue.hasNextMicrotask()) {
    microtaskQueue.processNextMicrotask()
  }
}
```

设置 microtask 最简单的方式是 `Promise.resolve().then(microtaskFn)`。microtask 按照插入顺序执行，因为只有一个 microtask 队列，故不会造成混乱。

此外，在一个 microtask 中还能设置新的 microtask，它们会被插在同一个队列中，在同一 tick 中执行。

![Execution timing: Event loop with microtask queue](http://s3.qhres.com/static/1af9de1bdcd9143c.svg)

### 渲染

还有一件事是渲染进度（rendering schedule）。不同于事件处理和解析，渲染不是由单独的背景任务完成的，而是由算法决定，**可能**会在每次 tick 末尾执行。

在这方面，浏览器自由度很大：可能在每个任务之后渲染，但也可能一直执行数百个任务而不进行渲染。

还是很幸运，我们有 `requestAnimationFrame()`，它会在下一次渲染之前执行传入的函数。最终我们的事件循环模型如下所示：

```javascript
while (eventLoop.waitForTask()) {  
  const taskQueue = eventLoop.selectTaskQueue()
  if (taskQueue.hasNextTask()) {
    taskQueue.processNextTask()
  }

  const microtaskQueue = eventLoop.microTaskQueue
  while (microtaskQueue.hasNextMicrotask()) {
    microtaskQueue.processNextMicrotask()
  }

  if (shouldRender()) {
    applyScrollResizeAndCSS()
    runAnimationFrames()
    render()
  }
}
```

![Execution timing: Event loop with rendering](http://s3.qhres.com/static/8d12e1879951d36b.svg)

接下来使用上面的这些知识，构建一个时间调度系统吧！

## 使用事件循环

和大多现代框架一样，[NX](http://nx-framework.com) 专注于处理幕后 DOM 操作和数据绑定。它将操作分批异步执行，以提高性能。为正确调度这些任务，它依赖于 `Promises`、`MutationObservers` 和 `requestAnimationFrame()`。

最佳的时间安排是这样的：

1. 开发者编写的代码
2. NX 进行数据绑定、响应 DOM 操作
3. 开发者定义的钩子
4.  浏览器渲染

### Step 1

NX 使用 [ES6 Proxy](https://ponyfoo.com/articles/es6-proxies-in-depth) 同步注册对象变动，使用 [MutationObserver](https://davidwalsh.name/mutationobserver-api) 同步注册 DOM 操作（下一章会谈更多）。为优化性能，NX 将推迟响应（reaction），将其作为 mircotask 放到第二步。延迟响应对象变化由 `Promise.resolve().then(reaction)` 实现的，而 MutationObserver 会自动处理，因为其内部就使用了 microtask 。

### Step 2

来自开发者的代码（任务）运行完成。NX 注册的 microtask 响应开始执行。因为是 microtask，所以它们会按顺序执行。请注意，目前还是在同一个 tick 中。

### Step 3

NX 使用 `requestAnimationFrame(hook)` 运行开发者传过来的钩子。这可能发生在之后一次 tick 中。重点还是在于，这些钩子在下次渲染之前，所有数据、DOM、CSS 变动之后运行。

### Step 4

浏览器渲染下一视图。也可能发生在稍后的 tick 中，但绝不会在上一步之前。

## 注意事项

基于原生事件循环，我们实现了一个简单而有效率的时间调度系统。理论上工作起来会很不错，不过时间调度是一件很微妙的事，小小的错误都可能导致一些奇怪的 bug。

在复杂系统中，很有必要设置一些关于时间调度的规则并在开发中遵守它们。以 NX 为例，我遵循了以下规则：

1. 内部操作中绝对不要使用 `setTimeout(fn, 0)`
2. 使用同一种方式注册 microtask
3. 仅将 microtask 只于内部操作
4. 不要将开发者钩子执行的时间窗口与其他东西混在一起

### Rule 1 and 2

对数据操作和 DOM 操作的响应，应当按照操作发生的顺序执行。只要不将顺序搞混，延迟它们都是可以的。搞混执行顺序会让事情变得难以预测，也难以寻找问题原因。

`setTimeout(fn, 0)` 完全无法预测。使用几种不同方法注册 microtask 也会导致执行顺序混乱。比如下面的例子中，`microtask2` 会错误地先于 `microtask1` 执行：

```javascript
Promise.resolve().then().then(microtask1) 
Promise.resolve().then(microtask2)
```

![Execution timing: Microtask registration method](http://s2.qhres.com/static/e3915d5eb20c8af1.svg)

### Rule 3 and 4

将开发者代码执行的时间窗口与内部操作隔离开非常重要。将两者混在一起，会导致一些看似无法预测的行为，并最终迫使开发者学习框架内部工作机制。想必很多开发者都有类似的经历。

## 写在最后

如果对 NX 框架感兴趣，请访问 [主页](http://nx-framework.com/)。胆大的读者还可以在Github 上查看 [NX 源码](https://github.com/RisingStack/nx-framework) 和 [nx-observe 源码](https://github.com/RisingStack/nx-observe)。

希望你喜欢这篇文章。下一章我们将讨论沙箱求值。


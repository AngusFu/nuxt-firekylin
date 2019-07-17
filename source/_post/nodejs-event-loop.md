---
title: "理解 Node.js 事件循环"
desc: "javascript event loop; Node.js 事件循环"
date: 2016-11-12
permission: 0
author: "Tamas Kadlecsik"
social: "https://blog.risingstack.com/author/tamas-kadlecsik/"
from: "https://blog.risingstack.com/node-js-at-scale-understanding-node-js-event-loop/"
tags:
  - 翻译
  - JavaScript
  - Node.js
  - Event Loop
---

本文介绍了 Node.js 事件循环是如何工作，如何使用 Node.js 构建高速应用。文章还会涉及最常见的一些问题及其解决方案。

（我们正在编写一系列文章，聚焦于那些大规模使用 Node.js 的公司、有一定 Node 基础的开发者们的需求。）

**Node.js at Scale 系列章节:**

*   **使用 npm**
    *   [npm 技巧与最佳实践](https://blog.risingstack.com/nodejs-at-scale-npm-best-practices)
    *   [语义化版本和模块发布](https://blog.risingstack.com/nodejs-at-scale-npm-publish-tutorial)
    *   [理解 Module System、CommonJS 和 require](https://blog.risingstack.com/node-js-at-scale-module-system-commonjs-require)

*   **深入 Node.js 底层**
    *   Node.js 事件循环 (**正是本文**)
    *   垃圾回收
    *   编写元素模块

*   **Building**
    *   Node.js 应用结构
    *   代码整洁之道
    *   异步处理
    *   事件源（Event sourcing）
    *   命令查询与责任隔离

*   **Testing**
    *   单元测试
    *   E2E 测试

*   **生产环境的 Node.js**
    *   应用监控
    *   应用调试
    *   应用分析

*   **微服务**
    *   请求签名（Request Signing）
    *   分布式跟踪（Distributed Tracing）
    *   API 网关（API Gateways）

* * *

## 问题提出

多数网站后端是不需要进行复杂运算的。程序多数时间都在等待进行硬盘读写，等待网络传输信息、响应返回。

IO 操作可能比数据处理要慢几个数量级。举个例子，SSD 可以达到 200-730 MB/s 的速度 —— 至少高端 SSD 可以做到。读取 1KB 数据仅需要 1.4μs，但同样的时间里，主频 2GHz 的 CPU 可以完成 28,000 次指令处理周期。

对网络通信来说，情况还可能更糟糕，ping 下 google.com 试试看：

```
$ ping google.com
64 bytes from 172.217.16.174: icmp_seq=0 ttl=52 time=33.017 ms  
64 bytes from 172.217.16.174: icmp_seq=1 ttl=52 time=83.376 ms  
64 bytes from 172.217.16.174: icmp_seq=2 ttl=52 time=26.552 ms  
64 bytes from 172.217.16.174: icmp_seq=3 ttl=52 time=40.153 ms  
64 bytes from 172.217.16.174: icmp_seq=4 ttl=52 time=37.291 ms  
64 bytes from 172.217.16.174: icmp_seq=5 ttl=52 time=58.692 ms  
64 bytes from 172.217.16.174: icmp_seq=6 ttl=52 time=45.245 ms  
64 bytes from 172.217.16.174: icmp_seq=7 ttl=52 time=27.846 ms 
```

平均延时为 44ms。数据包在网络上一个来回，前面提到的处理器可以执行 8800 万次周期。

## 解决方案

多数操作系统都提供了某种类型的异步 IO 接口，在允许我们在处理那些不依赖于通信结果的数据之外，通信还能继续...

数种方式可以达到此目的。如今的完成方式，主要是以额外的软件复杂性为代价，挖掘多线程潜力。比方说，在 Java 或 Python 中，文件读取是阻塞操作。在等待网络/硬盘通信（network/disk communication）完成时，程序无法做任何其他工作。我们能做的 —— 至少在 Java 中是如此 —— 只能是启动新的线程，然后在操作完成后通知主线程。

既枯燥又复杂，但能完成任务。那 Node 是怎样的呢？好吧，因为 Node.js（更准确的说是 V8） 是单线程的，我们肯定也会遇到同样的问题。我们代码只能在一个线程中运行。

**编者按**: 这里所说的并非完全正确。Java 和 Python 都有异步接口，但使用起来要比 Node.js 麻烦得多。感谢 [Shahar](https://disqus.com/by/keidi19/) 和 [Dirk Harrington](https://twitter.com/dirkjharrington) 指正。

也许你知道，有时候，在浏览器中用 `setTimeout(someFunction, 0)` 能够神奇地解决一些问题。可是为什么将超时时间设置为 0，将执行延迟 0ms 就能解决问题？难道和立即调用 `someFunction` 不是一回事吗？并非如此。

首先，来看看调用栈（call stack），又简称作“栈”。我会尽量将问题简化，因为我们只需要理解调用栈的最基本概念。如果你对此已经熟悉，请直接[跳到下一节吧](#事件循环)。

## 调用栈

调用一个函数时，返回地址（return address）、参数（arguments）、本地变量（local variables）等都会被推入栈中。如果在当前正在运行的函数中调用另一个函数，则该函数的相关内容也会以同样的方式推到栈顶。

为行文简便，接下来我将使用“函数被推入栈顶”这样不太准确的表达。

来看看吧！（**译者注：下面的示意图中的一些地方将 `square` 误作 `sqrt`，请根据代码甄别。**）

```javascript
function main () {
  const hypotenuse = getLengthOfHypotenuse(3, 4)
  console.log(hypotenuse)
}
 
function getLengthOfHypotenuse(a, b) {
  const squareA = square(a)
  const squareB = square(b)
  const sumOfSquares = squareA + squareB
  return Math.sqrt(sumOfSquares)  
}

function square(number) {  
  return number * number  
}

main()
```

首先调用 `main` 函数：

![The main function](http://p0.qhimg.com/t01ce56e785b8ca1925.png)

紧接着以 3 和 4 为参数，调用 `getLengthOfHypotenuse` 函数：

![The getLengthOfHypotenuse function](http://p0.qhimg.com/t01638ef1f34edebd4b.png)

然后是 `square(a)`：

![The square(a) function](http://p0.qhimg.com/t01853c10926172f492.png)

`square(a)` 返回后，从栈中弹出，其返回值赋值给 `squareA`。然后 `squareA` 被添加到 `getLengthOfHypotenuse` 的调用帧中：

![Variable a](http://p0.qhimg.com/t0131d9d440676ac6db.png)

下面计算 `square(b)` 也是一样：

![The square(b) function](http://p0.qhimg.com/t01d0940a2e39afc9b8.png)

![Variable b](http://p0.qhimg.com/t01e3c678adc983fe06.png)

下一行是表达式 `squareA + squareB` 求值：

![sumOfSquares](http://p0.qhimg.com/t01a6f422d209f22c87.png)

计算 `Math.sqrt(sumOfSquares)`:

![Math.sqrt](http://p0.qhimg.com/t01a839e63df37022d1.png)

现在 `getLengthOfHypotenuse` 剩下的工作就是将计算的最终结果返回：

![The return function](http://p0.qhimg.com/t018965143c9066d384.png)

`getLengthOfHypotenuse` 返回值被赋值给 `main` 中的 `hypotenuse`：

![hypotenuse](http://p0.qhimg.com/t0151eb79acb5966784.png)

控制台打印出 `hypotenuse`：

![The console log](http://p0.qhimg.com/t0103341d998752b217.png)

然后，`main` 返回，不带任何值，并从栈中弹出，栈变为空。

![Finally](http://p0.qhimg.com/t01d03e975bae0fee94.png)

**注意**： 上面提到函数执行完毕后，本地变量从栈中弹出。这仅对 Number、String、Boolean 等基本类型的值成立。对象、数组等值位于堆（heap）中，变量只是指向它们的指针。传递的变量其实只是指针，让这些值在不同的栈帧中可变化。当函数从栈中弹出后，只有指针弹出，而实际值依然还在堆中。当对象失去作用后，由垃圾回收器释放空间。

## 事件循环

![The Node.js Event Loop - cat version](http://p0.qhimg.com/t01c3a8e7546481b4ee.gif)

不不不，不是这种循环。 :)

所以，当我们调用 `setTimeout`、`http.get`、`process.nextTick` 或 `fs.readFile` 这样一些东西时，到底发生了什么？V8 代码没有这些，但 Chrome WebApi 和 Node.js 的 C++ API 中有。要了解它们，我们得更好地理解执行顺序。

看看一个更一般的 Node.js 应用 —— 监听 `localhost:3000/` 的服务器。收到请求时，服务器会在控制台上打印一些消息，请求 `wttr.in/`，然后将接收的响应转发给请求者。

```javascript
'use strict' 
const express = require('express')  
const superagent = require('superagent')  
const app = express()

app.get('/', sendWeatherOfRandomCity)

function sendWeatherOfRandomCity (request, response) {  
  getWeatherOfRandomCity(request, response)
  sayHi()
}

const CITIES = [  
  'london',
  'newyork',
  'paris',
  'budapest',
  'warsaw',
  'rome',
  'madrid',
  'moscow',
  'beijing',
  'capetown',
]

function getWeatherOfRandomCity (request, response) {  
  const city = CITIES[Math.floor(Math.random() * CITIES.length)]
  superagent.get(`wttr.in/${city}`)
    .end((err, res) => {
      if (err) {
        console.log('O snap')
        return response.status(500).send('There was an error getting the weather, try looking out the window')
      }
      const responseText = res.text
      response.send(responseText)
      console.log('Got the weather')
    })

  console.log('Fetching the weather, please be patient')
}

function sayHi () {  
  console.log('Hi')
}

app.listen(3000) 
```

请求 `localhost:3000` 时，除了获取天气，还有哪些内容打印出来？

如果你在 Node 方面有些经验，肯定不会惊讶：在代码中，尽管调用 `console.log('Fetching the weather, please be patient')` 在 `console.log('Got the weather')` 之后，当前者会先打印出来：

```bash
Fetching the weather, please be patient  
Hi  
Got the weather 
```

发生了什么？就算 V8 是单线程的，Node 底层的 C++ API 并不是啊。这意味着，无论何时调用非阻塞的操作，Node 会在底层调用一些和 JavaScript 代码同时运行的代码。一旦该隐藏线程接收到等待的值或者抛出错误，就会传入必要参数，调用提供的回调。

**注意**： 上面所谓的“一些和 JavaScript 代码同时运行的代码”，实际上是 [libuv](https://github.com/libuv/libuv) 的一部分。libuv 是处理线程池的开源库，用于处理信号，以及异步任务执行所必要的其他东西。一开始是为 Node.js 开发的，不过目前也有[很多其他项目](https://github.com/libuv/libuv/wiki/Projects-that-use-libuv)在使用。

为了深入底层，我们需要引入两个新概念：事件循环（event loop）和任务队列（task queue）。

### 任务队列

Javascript 是单线程、事件驱动型语言。这意味着，我们可以为事件添加监听器，当某一事件触发时，监听器执行提供的回调。

调用 `setTimeout`、`http.get` 或 `fs.readFile` 时，Node.js 将这些操作发送到另外一个线程，允许 V8 继续执行代码。计时完毕或 IO/http 操作完成后，Node 还会调用回调函数。

然后这些回调也可以将其他任务入列，其余亦可依此类推。这样，在处理请求时还能读取文件，并根据读取的内容发送 http 请求，而不会阻塞正在处理的其他请求。

尽管如此，我们只有一个主线程加一个调用栈，所以为避免在读取那个文件时又去处理另一个请求，回调函数需要等待调用栈变空。回调函数等待执行的中间状态被称为任务队列（又称作事件队列、消息队列）。一旦主线程结束此前工作，回调函数就会在一个无限循环当中被调用，因此叫作“事件循环”。（译者注：附原文如下）

> However, we only have one main thread and one call-stack, so in case there is another request being served when the said file is read, its callback will need to wait for the stack to become empty. The limbo where callbacks are waiting for their turn to be executed is called the task queue (or event queue, or message queue). Callbacks are being called in an infinite loop whenever the main thread has finished its previous task, hence the name 'event loop'.

在上一个例子中，事件循环大概如下所述：

1. express 为“request”事件注册了一个处理程序，请求 “/” 时会被调用；

2. 跳过函数，开始监听 3000 端口；

3. 调用栈为空，等待“request”事件触发；

4. 请求到来，等待已久的事件触发，express 调用 `sendWeatherOfRandomCity`；

5. `sendWeatherOfRandomCity` 入栈；

6. `getWeatherOfRandomCity` 被调用并入栈；

7. 调用 `Math.floor` 和 `Math.random`，入栈、出栈，`cities` 中的某一个被赋值给 `city`；

8. 传入 `'wttr.in/${city}'` 调用 `superagent.get`，为 `end` 事件设置处理回调；

9. 发送 `http://wttr.in/${city}` http 请求到底层线程，继续向下执行；

10. 控制台打印 `'Fetching the weather, please be patient'`，`getWeatherOfRandomCity` 函数返回；

11. 调用 `sayHi`，控制台打印 `'Hi'`；

12. `sendWeatherOfRandomCity` 函数返回、出栈，调用栈变空；

13. 等待 `http://wttr.in/${city}` 发送响应；

14. 一旦响应返回，`end` 事件触发；

15. 传给 `.end()` 的匿名回调函数调用，带着其闭包内所有变量一起入栈，也就是说，其内部能够访问、修改 `express, superagent, app, CITIES, request, response, city` 以及我们定义的函数；

16. 调用 `response.send()`，状态码为 `200` 或 `500`，再次发送到底层线程，response stream 不会阻塞代码执行，匿名回调出栈。

这样我们就能理解一开始提到的 `setTimeout` hack 是如何工作的。尽管将时间设置为 0，但是会延迟到当前栈和任务队列为空后执行，以允许浏览器重新绘制 UI，或 Node 处理其他请求。

### Microtask 与 Macrotask

实际上，不止一个任务队列，microtask（小型任务） 与 macrotask（巨型任务）各有一个任务队列。

Microtask 如：

*   `process.nextTick`

*   `promises`

*   `Object.observe`

Macrotask 如：

*   `setTimeout`

*   `setInterval`

*   `setImmediate`

*   `I/O`

看看下面的代码：

```javascript
console.log('script start')

const interval = setInterval(() => {  
  console.log('setInterval')
}, 0)

setTimeout(() => {  
  console.log('setTimeout 1')
  Promise.resolve().then(() => {
    console.log('promise 3')
  }).then(() => {
    console.log('promise 4')
  }).then(() => {
    setTimeout(() => {
      console.log('setTimeout 2')
      Promise.resolve().then(() => {
        console.log('promise 5')
      }).then(() => {
        console.log('promise 6')
      }).then(() => {
        clearInterval(interval)
      })
    }, 0)
  })
}, 0)

Promise.resolve().then(() => {  
  console.log('promise 1')
}).then(() => {
  console.log('promise 2')
}) 
```

控制台结果如下：

```bash
script start  
promise1  
promise2  
setInterval  
setTimeout1  
promise3  
promise4  
setInterval  
setTimeout2  
setInterval  
promise5  
promise6 
```

按照 [WHATWG](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue) 规范，每一次事件循环（one cycle of the event loop），只处理一个 (macro)task。待该 macrotask 完成后，所有的 microtask 会在同一次循环中处理。处理这些 microtask 时，还可以将更多的 microtask 入队，它们会一一执行，直到整个 microtask 队列处理完。

下图展示得更加清楚：

![The Node.js Event Loop](http://p0.qhimg.com/t01134d053300881c3b.png)

在上面的例子中：

**Cycle 1:**

1. `setInterval` 加入 macrotask 队列；

2. `setTimeout 1` 加入 macrotask 队列；

3. `Promise.resolve 1` 中，两个 `then` 加入 microtask 队列；

4.  调用栈变空，microtask 执行。

Macrotask queue: `setInterval`, `setTimeout 1`

**Cycle 2:**

5. microtask 队列为空，`setInteval` 回调执行，又一个 `setInterval` 加入 macrotask 队列，正好位于 `setTimeout 1` 之后；

Macrotask queue: `setTimeout 1`, `setInterval`

**Cycle 3:**

6. microtask 队列为空，`setTimeout 1` 回调执行，`promise 3` 和 `promise 4` 加入 microtask 队列；

7. `promise 3` 和 `promise 4` 执行，`setTimeout 2` 加入 macrotask 队列；

Macrotask queue: `setInterval`, `setTimeout 2`

**Cycle 4:**

8. microtask 队列为空，`setInteval` 回调执行，另一个 `setInterval` 加入 macrotask 队列，正好位于 `setTimeout 2` 之后；

Macrotask queue: `setTimeout 2`, `setInteval` 

9.  `setTimeout 2` 回调执行，`promise 5` 和 `promise 6` 加入 microtask 队列；

紧接着，`promise 5` 和 `promise 6` 的处理程序会清除 interval，但奇怪的是，`setInterval` 还是运行了一次。不过，如果在 Chrome 中运行代码，结果和预期是一致的。

<div class="tip">
**译者注**：笔者实际测试发现，情况可能和上面的叙述有所不同。Node v5.12 执行的结果是符合预期的。而 Chrome 53 上，反而出现一些状况，`promise 4` 之后，`setInterval` 执行了两次，原因未详，有待进一步追踪（disqus 评论被墙，我的 VPN 也没戏）。
</div>

使用 `process.nextTick` 和一些嵌套回调，在也 Node 中也能修复问题：

```javascript
console.log('script start')

const interval = setInterval(() => {  
  console.log('setInterval')
}, 0)

setTimeout(() => {  
  console.log('setTimeout 1')
  process.nextTick(() => {
    console.log('nextTick 3')
    process.nextTick(() => {
      console.log('nextTick 4')
      setTimeout(() => {
        console.log('setTimeout 2')
        process.nextTick(() => {
          console.log('nextTick 5')
          process.nextTick(() => {
            console.log('nextTick 6')
            clearInterval(interval)
          })
        })
      }, 0)
    })
  })
})

process.nextTick(() => {  
  console.log('nextTick 1')
  process.nextTick(() => {
    console.log('nextTick 2')
  })
}) 
```

这和上面的逻辑基本一样，只是看起来比较可怕。至少工作按照预期完成了。

### 驯服异步怪兽！

如前所见，在编写 Node.js 应用时，需要管理、留心两个任务队列和事件循环 —— 如果想要发挥它们全部的理力量，如果需要避免耗时任务阻塞主线程。

事件循环的概念一开始可能不太好掌握，一旦掌握之后就再也离不开了。可能导致回调地狱的延续传递风格看起来很丑，不过我们有 Promise，很快还有 async-await 在手... 在等待 async-await 的时候，还可以使用 [co](https://github.com/tj/co)、[koa](http://koajs.com/) 这些工具。

最后一点建议：

了解了 Node.js 和 V8 如何处理长时间任务，可以开始尝试使用。你之前可能听说过，应当将耗时循环放入任务队列。可以手动去做，或者借助 [async.js](http://caolan.github.io/async/)。

祝你搬砖愉快！如果有什么问题或想法，请在评论中提出。

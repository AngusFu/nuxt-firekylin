---
title: "手把手教你写一个 Javascript 框架：数据绑定"
date: 2016-11-14 16:44:01
desc: "手把手教你写一个 Javascript 框架：数据绑定"
author: "Bertalan Miklos"
social: "https://blog.risingstack.com/author/bertalan/"
from: "https://blog.risingstack.com/writing-a-javascript-framework-data-binding-dirty-checking/"
permission: 0
tags: 
    - 翻译
    - ES6
    - 数据绑定
---

**本文是“编写 JavaScript 框架”系列的第四章。本章我将解释脏检查和基于getter/setter 访问器的数据绑定技术，并指出它们各自的优缺点。**

本系列主要是如何开发一个开源的客户端框架，框架名为 NX。我将在本系列中分享框架编写过程中如何克服遇到的主要困难。对 NX 感兴趣的朋友可以点击 NX 项目[主页](http://nx-framework.com/)查看。

本系列章节如下：

* [项目结构（Project structuring）](/post/nx-project-structure/)
* [执行调度（Execution timing）](/post/execution-timing/)
* [沙箱求值（Sandboxed code evaluation）](/post/sandbox-code-evaluation/)
* 数据绑定简介(本文)
* [ES6 Proxy 实现数据绑定](/post/es6-proxy-data-binding/)
* 自定义元素
* 客户端路由

## 数据绑定简介

> 数据绑定是将数据源与数据提供者、消费者绑定并在它们之间保持同步的一种基本技术。

上面这个基本定义指出了数据绑定技术的通用构建模块。

- 定义数据提供者、消费者
- 定义哪些变化触发数据同步
- 数据提供者监听变化的方式
- 发送变化时运行的同步函数 —— 下文会将该函数称作 `handler()`

不同数据绑定技术采用不同方式实现以上几步。接下来几个小节介绍其中两种技术，即脏检查、getter/setter 访问器方法。介绍完它们后我将简要讨论它们各自的优缺点。

### 脏检查

脏检查可能是最广为人知的数据绑定方法。它是一种不错的传统选择，因其概念简单，无需复杂的语言特性支持。

### 脏检查语法

定义数据提供者和消费者无需任何特殊语法，仅靠普通 JavaScript 对象即可。

```javascript
const provider = {
  message: 'Hello World'
}
const consumer = document.createElement('p')
```

数据同步通常由提供者属性变化触发。那些需要对变化进行观察的属性，必须明确映射到各自的`handler()`函数。

```javascript
observe(provider, 'message', message => {
  consumer.innerHTML = message
})
```

`observe()` 函数仅仅保存了 `(provider, property) -> handler` 映射，留作后用。

```javascript
function observe (provider, prop, handler) {
  provider._handlers[prop] = handler
}
```

这样一来就可以定义数据提供者、消费者，为属性变化注册`handler()`函数。公有 API 部分已经完成，下面要完成的是内部实现。

### 监听变化

脏检查之所以“脏”是有原因的。它依赖周期性检查，而非直接监听属性变化。这种周期性检查通常称作 digest cycle。在一个 digest cycle 内，遍历由`observe()`所添加的每一个 `(provider, property) -> handler` 入口，并检查属性自上一次遍历以来是否发生了变化。若发生变化，则运行`handler()`函数。简单实现如下：

```javascript
function digest () {
  providers.forEach(digestProvider)
}

function digestProvider (provider) {
  for (let prop in provider._handlers) {
    if (provider._prevValues[prop] !== provider[prop]) {
      provider._prevValues[prop] = provider[prop]
      handler(provider[prop])
    }
  }
}
```

`digest()` 函数需要不时运行，以保障状态同步。

## getter/setter 访问器方法

getter/setter 访问器方法是当前的主流趋势，其支持广泛程度稍低，因为需要用到 ES5 getter/setter 功能。但这种方法之优雅足以弥补这个问题。

### 访问器语法

定义数据提供者需要一些特殊语法。普通提供者对象需要传给`observable()`函数，转换为可观察对象。

```javascript
const provider = observable({
  greeting: 'Hello',
  subject: 'World'
})
const consumer = document.createElement('p')
```

这完全可以弥补简单的 `handler()` 映射语法。在脏检查中，我们必须像下面这样，为每一个观察属性明确进行定义：

```javascript
observe(provider, 'greeting', greeting => {
  consumer.innerHTML = greeting + ' ' + provider.subject
})

observe(provider, 'subject', subject => {
  consumer.innerHTML = provider.greeting + ' ' + subject
})
```

又笨又长。访问器技术可以在 `handler()` 函数中自动检测用到的提供者属性，这样就可以简化以上代码。

```javascript
observe(() => {
  consumer.innerHTML = provider.greeting + ' ' + provider.subject
}) 
```

`observe()` 的实现与脏检查并不相同。我们仅仅需要执行传入的 `handler()`，并在其执行期间将其标记为当前活动函数。

```javascript
let activeHandler

function observe(handler) {
  activeHandler = handler
  handler()
  activeHandler = undefined
}
```

我们利用 JavaScript 单线程特点，采用单一的` activehandler `变量来记录当前运行的`handler()` 函数。

### 监听变化

“访问器技术”终于闪亮登场。借助于 getter/setter 访问器在背后的强力支持，数据提供者 provider 的能力大大增强。基本的思想是，拦截 provider 的属性获取、设置操作。

* get：如果存在正在运行的`activeHandler`，则保存`(provider, property) -> activeHandler`映射，稍后使用。

* set：运行所有 `(provide, property)` 对应的 `handler()`函数。

![The accessor data binding technique.](http://s0.qhres.com/static/363a87a8b3f27981.svg)

下面是监听单个属性变化的简单实现：

```javascript
function observableProp (provider, prop) {
  const value = provider[prop]
  Object.defineProperty(provider, prop, {
    get () {
      if (activeHandler) {
        provider._handlers[prop] = activeHandler
      }
      return value
    },
    set (newValue) {
      value = newValue
      const handler = obj._handlers[prop]
      if (handler) {
        activeHandler = handler
        handler()
        activeHandler = undefined
      }
    }
  })
}
```

上一节提到的`observable()`函数会递归遍历 provider 的属性，并使用 `observableProp()` 函数将它们统统转换为可观察对象。

```javascript
function observable (provider) {
  for (let prop in provider) {
    observableProp(provider, prop)
    if (typeof provider[prop] === 'object') {
      observable(provider[prop])
    }
  }
}
```

这只是一个简单实现，但用来对比两种技术已足够。

## 两种技术对比

本节将简要指出脏检查和访问器两种技术各自的优缺点。

### 语法形式

脏检查无需定义提供者、消费者，但将 `(provider, property)` 和 `handler()` 进行映射的方式笨拙又不灵活。

访问器技术需要使用 `observable()` 函数对提供者进行封装，不过自动进行 `handler()` 映射弥补了不足。对于使用数据绑定的大型项目来说，访问器技术是必备特性。

### 性能

脏检查早就因其性能表现臭名昭著。每次 digest cycle 中，需要对每个 `(provider, property) -> handler` 入口进行数次检查。此外，即便应用处于闲置状态也必须保持运转，因为它并不值得属性何时发生变化。

访问器方法更快一些，但在一些大型可观察对象面前，性能也可能发生退化。使用访问器替换提供者的所有属性，通常是过重了。一种解决办法是在必要时动态建立 getter/setter，而不是一次性提前完成。此外，还有一种简单方法是使用一个 `noObserve()` 函数包装不需要的属性，告诉 `observable()` 不要理会这些。但这会引入额外的语法。

### 灵活性

脏检查天生就能和扩展属性（动态添加的）以及访问器属性一起工作。

访问器技术在这方面有个弱点。初始化 getter/setter 时，扩展属性并不包含在内。比如对数组来说，这就会导致问题，但也能通过手动调用 `observableProp()` 来解决。访问器属性也无法支持，因为访问器属性无法再包装一次。一种常见的解决办法是使用 `computed()` 函数替代 getter。不过这会引入更多自定义语法。

### 时间控制

脏检查给我们的自由并不多，因为我们无从得知属性实际发生变化的时机。`handler()` 函数只能通过不时运行 `digest()` 循环而异步执行。

使用访问器技术，getter/setter 是同步触发的，因此就有了选择上的自由。我们可以决定是否立即执行 `handler()`，或者分批异步执行。前者保证了可预见性，后者则可以通过去重提升性能。

## 关于下一章

下一章我将介绍 [nx-observe](https://github.com/RisingStack/nx-observe) 数据绑定工具，阐述如何用 ES6 Proxy 替代  ES5 getters/setters，以弥补访问器技术的多数不足之处。

## 写在最后

如果对 NX 框架感兴趣，请访问 [主页](http://nx-framework.com/)。胆大的读者还可以在Github 上查看 [NX 源码](https://github.com/RisingStack/nx-framework) 和 [nx-observe 源码](https://github.com/RisingStack/nx-observe)。

希望你喜欢这篇文章。下一章我们将讨论 [沙箱求值（Sandboxed code evaluation）](https://blog.risingstack.com/writing-a-javascript-framework-sandboxed-code-evaluation/)。

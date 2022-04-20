---
title: "手把手教你写一个 Javascript 框架：使用 ES6 Proxy 实现数据绑定"
date: 2016-11-14 16:44:01
desc: "手把手教你写一个 Javascript 框架：使用 ES6 Proxy 实现数据绑定"
author: "Bertalan Miklos"
social: "https://blog.risingstack.com/author/bertalan/"
from: "https://blog.risingstack.com/writing-a-javascript-framework-data-binding-es6-proxy/"
permission: 0
tags: 
    - 翻译
    - ES6
    - 数据绑定
---

**本文是“编写 JavaScript 框架”系列的第五章。在本章中，我将介绍如何使用 ES6 Proxy 实现简单、强大的数据绑定。**

本系列主要是如何开发一个开源的客户端框架，框架名为 NX。我将在本系列中分享框架编写过程中如何克服遇到的主要困难。对 NX 感兴趣的朋友可以点击 NX 项目[主页](http://nx-framework.com)查看。

本系列章节如下：

* [项目结构（Project structuring）](/post/nx-project-structure/)
* [执行调度（Execution timing）](/post/execution-timing/)
* [沙箱求值（Sandboxed code evaluation）](/post/sandbox-code-evaluation/)
* [数据绑定简介](/post/data-bind-dirty-checking)
* ES6 Proxy 实现数据绑定 (本文)
* 自定义元素 
* 客户端路由

## 知识回顾

ES6 让 JavaScript 变得更加优雅，但多数新特性不过是语法糖罢了。Proxy 是少数几个无法 polyfill 的新增特性。如果还不太熟悉 Proxy，请先看一眼 [MDN 上的 Proxy 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)。

如果对 ES6 中的 [Reflection API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)、[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)、 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 以及 [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 有所了解，那便是极好的。

## nx-observe

[nx-observe](https://github.com/RisingStack/nx-observe) 是一个不到 140 行代码的数据绑定方案。对外暴露的 `observable(obj)` 、`observe(fn)`二者分别用于创建 observable 和 observer 函数。当使用到的 observable 对象发生属性变化时，observer 函数将自动执行。示例如下：

```javascript
// 这是一个 observable object
const person = observable({name: 'John', age: 20})

function print () {
  console.log(`${person.name}, ${person.age}`)
}

// 创建一个 observer 函数
// 控制台打印出 'John, 20'
observe(print)

// 控制台打印出 'Dave, 20'
setTimeout(() => person.name = 'Dave', 100)

// 控制台打印出 'Dave, 22'
setTimeout(() => person.age = 22, 200)
```

每当 `person.name` 或 `person.age` 发生变化，传给 `observe()` 的 `print` 函数就会重新运行。在这里，`print` 被称为 observer 函数。

如果对更多例子感兴趣，可以点开 [GitHub readme](https://github.com/RisingStack/nx-observe#example) 或 [NX 主页](http://nx-framework.com/docs/spa/observer)，看看更逼真的场景。

## 实现简单的 observable

接下来的小节解释 nx-observe 底层发生了什么。首先介绍 observable 对象的属性变化是如何被侦测到的，又是如何匹配 observer 的。然后再展示怎样运行这些由变化触发的 observer 函数。

### 注册变化

变化是通过由 ES6 Proxy 包装后的 observable 对象注册的。在 [Reflection API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) 的协助下，这些 proxy 能够完美拦截 get 和 set 操作。

下面代码中使用的 `currentObserver` 和 `queueObserver()` 会在下一节中解释。目前只需要知道，`currentObserver` 总是指向当前执行的 observer 函数，`queueObserver()` 把即将执行的 observer 加入队列。

```javascript

/* 将 observable 对象的属性映射到
   那些使用了这些属性的 observer 函数集合中 */
const observers = new WeakMap()

/* 指向当前正在执行的 observer 函数，
   也可能是 undefined */
let currentObserver

/* 将对象包装成 proxy，从而将其转换为 observable 对象，
   还为 observers 添加了一个空 Map，
   用于保存 property-observer 组合 */
function observable (obj) {
  observers.set(obj, new Map())
  return new Proxy(obj, {get, set})
}

/* 拦截 get 操作，若当前没有正在
   执行的 observer，则不会做任何事 */
function get (target, key, receiver) {
  const result = Reflect.get(target, key, receiver)
   if (currentObserver) {
     registerObserver(target, key, currentObserver)
   }
  return result
}

/* 若当前有 observer 函数正在运行，
   本函数会将该 observer 函数与
   当前取到的 observable 对象的属性进行配对，
   并将它们保存到 observers Map 中 */
function registerObserver (target, key, observer) {
  let observersForKey = observers.get(target).get(key)
  if (!observersForKey) {
    observersForKey = new Set()
    observers.get(target).set(key, observersForKey)
  }
  observersForKey.add(observer)
}

/* 拦截 set 操作，与当前设置的属性相关联的
   所有 observer 加入执行队列 */
function set (target, key, value, receiver) {
  const observersForKey = observers.get(target).get(key)
  if (observersForKey) {
    observersForKey.forEach(queueObserver)
  }
  return Reflect.set(target, key, value, receiver)
}
```

尚未设置 `currentObserver` 时，`get` 不会做任何事情。否则，`get` 操作会将拿到的 observable 对象属性与当前运行的 observer 函数组合（pair）在一起，保存到 `observers` WeakMap 中。对于 observable 对象的每个属性，observer 函数都保存在一个 `Set` 中。这样可以保证不会出现重复。

`set` 会检索所有与 observable 对象变动的属性相关的 observer，并将它们加入稍后执行的队列。

下图展示了前面的例子的执行步骤。

![JavaScript data binding with es6 proxy - observable code sample](https://blog-assets.risingstack.com/2016/11/writing-a-javascript-framework-data-binding-with-es6-proxy-observables-code.png)

1. 创建 observable 对象 `person`；
2. `currentObserver` 被设为 `print`；
3. `print` 开始执行；
4. 在 `print` 内部检索到 `person.name`；
5. 在 `person` 上触发 `get`；
6. `observers.get(person).get('name')` 检索到 `(person, name)` 组合的 observer Set；
7. `currentObserver` (print) 被添加到 observer Set 中；
8. 对 `person.age`，同理，执行前面 4-7 步；
9. `${person.name}, ${person.age}` 打印出来；
10. `print` 函数执行结束；
11. `currentObserver` 变为 undefined；
12. 其他代码开始运行；
13. 设置 `person.age` 为新的值（22）；
14. `person` 上触发 `set`；
15. `observers.get(person).get('age')` 检索到 `(person, age)` 组合的 observer Set，
16. observer Set 中的 observer（包括 `print`）入队准备执行；
17. 再次执行 `print`。

### observer 执行

队列中的 observer 是分批异步执行的，因此性能很好。注册期间，这些 observer 被异步地添加到 `queuedObservers` `Set` 中。`Set` 中不会包含重复元素，所以多次加入同一个 observer 也不会导致重复执行。如果该 `Set` 之前是空的，则会加入新的任务，在一段时间后迭代执行队列中所有的 observer。

```javascript
/* 包含触发的将要执行的 observer 函数 */
const queuedObservers = new Set()

/* 指向当前正在执行的 observer 函数，
   也可能是 undefined */
let currentObserver

/* 暴露的 observe 函数 */
function observe (fn) {
  queueObserver(fn)
}

/* 将 observer 添加到队列中，
   并确保队列会尽快执行 */
function queueObserver (observer) {
  if (queuedObservers.size === 0) {
    Promise.resolve().then(runObservers)
  }
  queuedObservers.add(observer)
}

/* 执行队列中的 observer，
   完成后 currentObserver 置为 undefined */
function runObservers () {
  try {
    queuedObservers.forEach(runObserver)
  } finally {
    currentObserver = undefined
    queuedObservers.clear()
  }
}

/* 将全局的 currentObserver 变量
  指向 observer 并执行 */
function runObserver (observer) {
  currentObserver = observer
  observer()
}
```

执行某一个 observer 时，上面的代码确保全局变量 `currentObserver` 指向该 observer。设置  `currentObserver`，会启用 `get`，监听、匹配执行时用到的 observable 对象的所有属性。

## 建立动态 observable tree

到目前为止，模型结合单层数据结构使用起来还挺好，但还需要用 observable 手动包装那些值是对象的属性。比如，下面的代码就没法达到预期：

```javascript
const person = observable({data: {name: 'John'}})

function print () {
  console.log(person.data.name)
}

// 控制台打印出 'John'
observe(print)

// does nothing
setTimeout(() => person.data.name = 'Dave', 100)
```

为了让代码正常工作，还需要将 `observable({data: {name: 'John'}})` 替换成 `observable({data: observable({name: 'John'})})`。幸运的是，稍微修改一下 `get` 就能解决问题。

```javascript
function get (target, key, receiver) {
  const result = Reflect.get(target, key, receiver)
  if (currentObserver) {
    registerObserver(target, key, currentObserver)
    if (typeof result === 'object') {
      const observableResult = observable(result)
      Reflect.set(target, key, observableResult, receiver)
      return observableResult
    }
  }
  return result
}
```

如果要返回的值是对象，那么在返回之前，`get` 会将其包装成 observable 对象。从性能方面来看也很完美，只会在需要的时候才会创建 observable 对象。

## 与 ES5 对比

利用 ES5 的属性访问器（getter/setter）也能实现类似的数据绑定。很多流行的框架/库都在使用，如 [MobX](https://mobxjs.github.io/mobx/) 和 [Vue](https://vuejs.org/)。相较于访问器，使用 Proxy 有两大优势，也有一点不足之处。

### 扩展属性

在 JavaScript 中，扩展属性（Expando properties） 是指动态添加的属性。ES5 技术不支持扩展属性，每个属性的访问器都必须预先定义才能实现拦截操作。这也是为何当今预定义的键值集合成为趋势的原因。

而 Proxy 技术可以真正支持扩展属性，因为 Proxy 是按照单个对象定义的，对象的所有属性操作都可以拦截。

扩展属性很重要，典型例子就是数组。离开添加、删除功能，JavaScript 数组几乎毫无用处。针对此问题，ES5 数据绑定技术通常自定义数组方法，或者干脆重写。

### getter 和 setter

通过某些特殊的语法，一些使用 ES5 方法的框架/库提供 `computed` 绑定属性。这些属性都有相应的原生实现，即 getter 和 setter。因为内部使用 getter 和 setter 实现数据绑定逻辑，那么也就无法再利用属性访问器了。

而 Proxy 可以拦截包括 getter 和 setter 在内的所有类型的属性访问和变动，所以这对 ES6 方法来说不构成问题。

### 不足之处

使用 Proxy 最大的不足还是在于浏览器支持。只有[比较新的浏览器](http://caniuse.com/#feat=proxy)才支持，而 Proxy API 最精华的部分却无法通过 polyfill 实现。

## 一点笔记

上面介绍的数据绑定方法能够工作，但为了更容易理解，我进行了一些简化处理。下面会提到一些之前没有提到的问题。

### 垃圾清理

内存泄漏比较恶心。前面的代码在某种意义上来说有所避免，因为使用了 `WeakMap` 保存 observer。因此，observable  对象及与其关联的 observer 也会同时被回收。

不过，实际使用场景常常是中心化、持久化的存储，伴随着频繁的 DOM 变动。这种情况下，DOM 在垃圾回收之前，必须释放所有为其注册的 observer。前面的例子并没有实现该功能，但可以在 [nx-observe 的代码](https://github.com/RisingStack/nx-observe/blob/master/observer.js) 中可以看到 `unobserve()` 方法如何实现。

### 多次包装

Proxy 是透明的，没有分辨 Proxy 和普通对象的原生方法。此外，它们还能无限嵌套，若不进行必要的预防，最终可能导致不停地对 observable 对象进行包装。

分辨 Proxy 与普通对象的办法有很多，例子中没有提到。其中一种办法是设置一个名为 `proxies` 的 `WeakSet` 对象，之后检查该 WeakSet 中是否存在某个 Proxy 对象即可。如果对 nx-observe 中的 `isObservable()` 方法感兴趣，可以去看[代码](https://github.com/RisingStack/nx-observe/blob/master/observer.js)。

### 继承

nx-observe 还能与原型继承搭配工作。请看示例：

```javascript
const parent = observable({greeting: 'Hello'})
const child = observable({subject: 'World!'})
Object.setPrototypeOf(child, parent)

function print () {
  console.log(`${child.greeting} ${child.subject}`)
}

// 控制台打印出 'Hello World!'
observe(print)

// 控制台打印出 'Hello There!'
setTimeout(() => child.subject = 'There!')

// 控制台打印出 'Hey There!'
setTimeout(() => parent.greeting = 'Hey', 100)

// 控制台打印出 'Look There!'
setTimeout(() => child.greeting = 'Look', 200)
```

沿着原型链中的每个对象都会触发 `get` 操作，直到找到属性，因此在所有可能需要的地方都会注册 observer。

还有一个鲜为人知事情，`set` 操作同样会（偷偷摸摸地）沿着原型链进行。有些极端情况就是因此造成的，这里略过不谈。

### 内部属性

Proxy 还能拦截“内部属性访问”。你的代码中可能会使用许多通常基本都不考虑的内部属性。这样一些属性，通常会使用如 [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 这样的值作为 key。这些属性也通常也能被 Proxy 拦截到，不过也也会有一些出现 bug 的情况。

### 异步特性

拦截到 `set`  操作时，observer 可以同步运行。这样有一些优势，比如减低复杂度，时序也可预测，堆栈跟踪更优雅。但某些场景下也会造成混乱。

想象一下，在单个循环中向6一个 observable 数组中添加 1000 项。数组长度会变化一千次，关联的 observer 也会在接连执行一千次。这恐怕不是什么好事。

另一个场景是双向观测。如若 observer 同步执行，下面的代码会造成无限循环。

```javascript
const observable1 = observable({prop: 'value1'})
const observable2 = observable({prop: 'value2'})

observe(() => observable1.prop = observable2.prop)
observe(() => observable2.prop = observable1.prop)
```

鉴于这些，nx-observe 将 observer 添加到不允许重复的队列中一起执行，以避免[无样式内容闪动](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)。如果你对 microtask 的概念还不熟悉，请查看我之前关于浏览器时间控制的[文章](https://blog.risingstack.com/writing-a-javascript-framework-execution-timing-beyond-settimeout/)。

## 写在最后

如果对 NX 框架感兴趣，请访问 [主页](http://nx-framework.com)。胆大的读者还可以在Github 上查看 [NX 源码](https://github.com/RisingStack/nx-framework) 和 [nx-observe 源码](https://github.com/RisingStack/nx-observe)。 

希望你喜欢这篇文章，下一章我们将讨论自定义 HTML 元素。

## 译者补记

关于 Proxy，可以参阅：

- [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/proxy)

- [Metaprogramming with proxies](http://exploringjs.com/es6/ch_proxies.html)

- [Pitfall: not all objects can be proxied transparently](http://www.2ality.com/2016/11/proxying-builtins.html)

- [实例解析 ES6 Proxy 使用场景](http://pinggod.com/2016/%E5%AE%9E%E4%BE%8B%E8%A7%A3%E6%9E%90-ES6-Proxy-%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF/)

- [ES6中的代理对象](http://www.cnblogs.com/ziyunfei/p/3187867.html)

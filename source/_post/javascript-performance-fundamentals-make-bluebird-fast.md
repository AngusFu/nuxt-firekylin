---
title: "Bluebird 高性能揭秘"
permission: 0
tags:
  - 翻译
  - Promise
date: 2017-01-12
desc: "Bluebird 高性能揭秘"
author: "Petka Antonov"
social: "https://www.reaktor.com/blog/author/petka-antonov/"
from: "https://reaktor.com/blog/javascript-performance-fundamentals-make-bluebird-fast/"
---

Bluebird 是一个广泛使用的 Promise 库，最早在 2013 年得到人们的关注。相比其他同等水平的 Promise 库，Bluebird 快了一百来倍。Bluebird 自始至终遵循着 JavaScript 优化的一些基本原则，所以才有这么好的性能。本文将会介绍其中最有价值的三个方面。

### 1.  函数中的对象分配最小化

对象分配（object allocation），尤其是函数中的对象分配，对性能的影响是很大的，因为其实现需要用到大量内部数据。JavaScript 实现了垃圾自动回收，占用内存的不单是分配的对象；垃圾回收器也有份，它在不断寻找那些不再使用的对象，以释放内存。JavaScript 占用内存越多，垃圾回收需要的 CPU 资源也就越多，这样一来，运行代码的 CPU 资源就会减少。

函数是 JavaScript 中的一等对象，和其他对象有着相同的特性。假设在函数 fnA 中，声明了另一个函数 fnB，那么每次调用外层的 fnA 时，都会有一个全新的 fnB 函数对象被创建，哪怕两次代码完全一样。请看下面的例子：

```js
function trim(string) {
    function trimStart(string) {
        return string.replace(/^\s+/g, "");
    }

    function trimEnd(string) {
        return string.replace(/\s+$/g, "");
    }

    return trimEnd(trimStart(string))
}
```

每次调用 trim 函数的时候，两个并非必需的函数对象（trimStart 和 trimEnd 函数）就会被创建出来。说这两个函数对象并非必需，是因为它们作为独特对象的特点并未起到丝毫作用，如属性赋值、变量隐藏等，所用到的仅仅是它们的内部功能而已。

要优化这个例子并不麻烦，将那两个函数移到 trim 函数之外就好。它们同处于相同模块，只会加载一次，所以这两个函数各自只会创建一个函数对象：

```js
function trimStart(string) {
    return string.replace(/^\s+/g, "");
}

function trimEnd(string) {
    return string.replace(/\s+$/g, "");
}

function trim(string) {
    return trimEnd(trimStart(string))
}
```

但更为常见的情况是，函数对象似乎是一种必要之恶，优化并不像上面这般简单。比如说，传递回调函数时，总是需要考虑特定上下文。这通常可以用闭包实现，简单又直观，效率却极低。举个小例子，使用 Node 读取 JSON 文件：

```js
var fs = require('fs');

function readFileAsJson(fileName, callback) {
    fs.readFile(fileName, 'utf8', function(error, result) {
        // 每次调用 readFileAsJson 函数时，会创建一个新的函数对象
       // 因为是闭包，也会分配一个内部上下文对象来保存状态
        if (error) {
            return callback(error);
        }
        // 需要 try-catch 来处理可能存在的非法 JSON 造成的语法错误
        try {
            var json = JSON.parse(result);
            callback(null, json);
        } catch (e) {
            callback(e);
        }
    })
}
```

在上面的例子中，传给 `fs.readFile` 的匿名回调，是不能从 readFileAsJson 函数中提取出来的，因为该匿名函数能够访问其外部的 callback 变量。需要注意的是，即便使用命名函数取代匿名函数，也不会有任何区别。

Bluebird 内部常用到的优化方法，是采用明确的普通对象保存与上下文相关的数据。对一次包含逐层传递 callback 的操作来说，只需分配一次对象。相比每当 callback 传入另一层函数时就需要创建新闭包，优化方法只需要传递一个额外的参数。假设某个操作调用 callback 分五步进行，若使用闭包则意味着要分配五个函数对象外加五个上下文对象，而使用优化方法则只需要一个普通对象。

假如可以修改 `fs.readFile` API，使其接收一个上下文对象，那么前面的例子可以这样优化：

```js
var fs = require('fs-modified');

function internalReadFileCallback(error, result) {
    // 修改后的 readFile 函数将上下文对象设置为 `this`
    // 并调用原来传来的 callback
    if (error) {
        return this(error);
    }
    // 需要 try-catch 来处理可能存在的非法 JSON 造成的语法错误
    try {
        var json = JSON.parse(result);
        this(null, json);
    } catch (e) {
        this(e);
    }
}

function readFileAsJson(fileName, callback) {
    // 修改后的  fs.readFile 接收上下文对象作为第四个参数
    // 但实际无需为 `callback` 单独创建一个普通对象
    // 直接将其作为上下文对象即可
    fs.readFile(fileName, 'utf8', internalReadFileCallback, callback);
}
```

显然，我们需要从内部、使用两个方面控制 API，这种优化对那些不接收上下文对象作为参数的 API 来说，全无用处。但当我们控制了多个内部层的时候，性能优化的收益则极为可观。顺便提一个经常被忽略的细节：JavaScript 数组的某些内置 API（如 forEach）可以接收一个上下文对象作为第二个参数。

### 2. 减小对象体积

减小经常、频繁使用的对象（如 Promise）的体积至关重要。对象被分配在栈（heap）中，对象体积越大，栈空间也会越快被占满，回收器要做的工作也更多。通常来说，对象体积越小，回收器判断对象状态时要访问的字段也就越少。

使用位运算符，布尔值 and/or 特定整数字段能够包装到更小的空间中。JavaScript 采用 32 位整数，所以可以将 32 个布尔字段（或 8 个 4 位整数字段，又或者 16 个布尔和 2 个 8 位整数字段 etc.）打包到一个字段中。为维护代码可读性，每个逻辑字段需要一对 getter/setter，用来对物理字段进行相关位运算操作。下面的例子展示如何使用整数保存一个布尔字段（未来还可扩展到多个逻辑字段）：

```js
// 使用 1 << 1 代表第二位, 1 << 2 代表第三位，依此类推
const READONLY = 1 << 0;

class File {
    constructor() {
        this._bitField = 0;
    }

    isReadOnly() {
        // 圆括号不可省略
        return (this._bitField & READONLY) !== 0;
    }

    setReadOnly() {
        this._bitField = this._bitField | READONLY;
    }

    unsetReadOnly() {
        this._bitField = this._bitField & (~READONLY);
    }
}
```

访问器方法如此短小，运行时很可能会被内联，所以也不会产生额外开销。

两个乃至多个不会同时用到的字段也可以合并成一个字段，用一个布尔值记录该字段所记录的值的类型即可。不过，如果像前面所讲的那样，将这个布尔字段打包在某个整数字段中，这样做的结果，无非只是节省了一些空间。

Bluebird 在保存一个 Promise 对象的完成值与拒绝理由时就用到这种技巧。如果该Promise 对象完成，则使用该字段记录完成值，反之亦然。重复一遍，属性访问必须通过访问器函数，将丑陋的优化字节隐藏在底层。

如果对象需要保存一个列表，尽量避免使用数组，直接使用索引属性，将值保存在对象上即可。

不要这样做：

```js
class EventEmitter {
    constructor() {
        this.listeners = [];
    }

    addListener(fn) {
        this.listeners.push(fn);
    }
}
```

应尽量避免使用数组：

```js
class EventEmitter {
    constructor() {
        this.length = 0;
    }

    addListener(fn) {
        var index = this.length;
        this.length++;
        this[index] = fn;
    }
}
```

若 `length` 字段被限制为一个小的整数（如 10 位，限制 event emitter 的监听器数量最大为 1024），则还可以与其他布尔字段、特定整数字段打包在一起。

### 3. 可选特性懒重写

Bluebird 提供了有些可选特性，使用它们时可能拉低整个库的性能。这些特性主要包括警告、long stack trace、取消、`Promise.prototype.bind` 以及 Promise 状态监控等。实现这些特性，须在整个库的不同地方调用不同的钩子函数。比如说，要实现 Promise 监控，那么每次创建 Promise 对象时就要调用某个函数。

在调用钩子函数之前，当然最好先检查是否需要启用监控特性，这比不管三七二十一直接调用要靠谱。不过借助于内联缓存和内联函数，对未启用这些特性的用户来说，影响其实可以完全忽略。将初始钩子函数设置为空函数即可达到目的：

```js
class Promise {
    // ...
    constructor(executor) {
        // ...
        this._promiseCreatedHook();
    }

    // 空方法
    _promiseCreatedHook() {}
}
```

如果用户并未启用监控特性，优化器发现函数是什么都没干，便会忽略它。所以实际上可以认为 constructor 中的钩子函数不存在。

那么如何启用相关特性呢？重写相关的空函数就可以啦：

```js
function enableMonitoringFeature() {
    Promise.prototype._promiseCreatedHook = function() {
        // 实际实现
    };

    // ...
}
```

这样的函数重写会使所有的 Promise 对象内联缓存失效，因此应该只在应用启动时，任何 Promise 对象创建之前进行重写。这样一来，空钩子函数就不会有任何影响了。

### 译者补充

拖拖拉拉，终于把这篇文章翻译出来了。需要说明的是，没有完全按照原文逐字翻译，插入了自己的一些理解。

遗憾的是，有一部分名词实在不好翻译，所以本文难免有一些生硬的地方。虽然译者可以摸着良心说，真的已经尽了最大的努力。

之前读到 stackoverflow 上的一个回答，也属于优化的一部分吧，涉及到 V8 中对象的两种存储模式，即字典模式、快速模式。建议有兴趣的同学看看：[how-does-bluebirds-util-tofastproperties-function-make-an-objects-properties](http://stackoverflow.com/questions/24987896/how-does-bluebirds-util-tofastproperties-function-make-an-objects-properties)。

另外，之前有个工具 [optimize-js](https://github.com/nolanlawson/optimize-js)，好像也可以针对 V8 做了一些优化，具体可以看文档，说得非常详细。
                

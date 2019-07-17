---
title: 深入 JavaScript 数组：进化与性能
date: 2017-09-12
desc: 深入 JavaScript 数组：进化与性能
author: Paul Shan
social: http://voidcanvas.com/author/paulshan/
permission: 0
from: http://voidcanvas.com/javascript-array-evolution-performance/
tags: 
  - 翻译
  - JavaScript
---

正式开始前需要声明，本文并不是要讲解 JavaScript 数组基础知识，也不会涉及语法和使用案例。本文讲得更多的是内存、优化、语法差异、性能、近来的演进。

在使用 JavaScript 前，我对 C、C++、C# 这些已经颇为熟悉。与许多 C/C++ 开发者一样，JavaScript 给我的第一印象并不好。

`Array` 是主要原因之一。JavaScript 数组不是连续（contiguous）的，其实现类似哈希映射（hash-maps）或字典（dictionaries）。我觉得这有点像是一门 B 级语言，数组实现根本不恰当。自那以后，JavaScript 和我对它的理解都发生了变化，很多变化。

## 为什么说 JavaScript 数组不是真正的数组

在聊 JavaScript 之前，先讲讲 `Array` 是什么。

数组是一串连续的内存位置，用来保存某些值。注意重点，“连续”（`continuous`，或 `contiguous`），这很重要。

[![数组内存示意图](http://p0.qhimg.com/t013e8a7ea0ed65a53e.png)](http://p0.qhimg.com/t013e8a7ea0ed65a53e.png)

上图展示了数组在内存中存储方式。这个数组保存了 4 个元素，每个元素 4 字节。加起来总共占用了 16 字节的内存区。

假设我们声明了 `tinyInt arr[4];`，分配到的内存区的地址从 `1201` 开始。一旦需要读取 `arr[2]`，只需要通过数学计算拿到 `arr[2]` 的地址即可。计算 `1201 + (2 X 4)`，直接从 `1209` 开始读取即可。

[![javascript 链表](http://p0.qhimg.com/t0108bfb507aa331fad.png)](http://res.cloudinary.com/dqubepfgb/image/upload/v1504384650/old-array-js_o8ufwz.png)

JavaScript 中的数据是哈希映射，可以使用不同的数据结构来实现，如链表。所以，如果在 JavaScript 中声明一个数组 `var arr = new Array(4)`，计算机将生成类似上图的结构。如果程序需要读取 `arr[2]`，则需要从 `1201` 开始遍历寻址。

以上就是 JavaScript 数组与真实数组的不同之处。显而易见，数学计算比遍历链表快。就长数组而言，情况尤其如此。

## JavaScript 数组的进化

不知你是否记得我们对朋友入手的 256MB 内存的电脑羡慕得要死的日子？而今天，8GB 内存遍地都是。

与此类似，JavaScript 这门语言也进化了不少。从 V8、SpiderMonkey 到 TC39 和与日俱增的 Web 用户，巨大的努力已经使 JavaScript 成为世界级必需品。一旦有了庞大的用户基础，性能提升自然是硬需求。

实际上，现代 JavaScript 引擎是会给数组分配连续内存的 —— 如果数组是同质的（所有元素类型相同）。优秀的程序员总会保证数组同质，以便 JIT（即时编译器）能够使用 `c` 编译器式的计算方法读取元素。

不过，一旦你想要在某个同质数组中插入一个其他类型的元素，JIT 将解构整个数组，并按照旧有的方式重新创建。

因此，如果你的代码写得不太糟，JavaScript `Array` 对象在幕后依然保持着真正的数组形式，这对现代 JS 开发者来说极为重要。

此外，数组跟随 ES2015/ES6 有了更多的演进。TC39 决定引入类型化数组（Typed Arrays），于是我们就有了 `ArrayBuffer`。

`ArrayBuffer`  提供一块连续内存供我们随意操作。然而，直接操作内存还是太复杂、偏底层。于是便有了处理 ArrayBuffer 的视图（View）。目前已有一些可用视图，未来还会有更多加入。

```javascript
var buffer = new ArrayBuffer(8);
var view   = new Int32Array(buffer);
view[0] = 100;
```

了解更多关于类型化数组（Typed Arrays）的知识，请访问 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)。

高性能、高效率的类型化数组在 WebGL 之后被引入。WebGL 工作者遇到了极大的性能问题，即如何高效处理二进制数据。另外，你也可以使用 [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 在多个 Web Worker 进程之间共享数据，以提升性能。

从简单的哈希映射到现在的 `SharedArrayBuffer`，这相当棒吧？

## 旧式数组 vs 类型化数组：性能

前面已经讨论了 JavaScript 数组的演进，现在来测试现代数组到底能给我们带来多大收益。下面是我在 Mac 上使用 `Node.js 8.4.0` 进行的一些微型测试结果。

### 旧式数组：插入

```javascript
var LIMIT = 10000000;
var arr = new Array(LIMIT);
console.time("Array insertion time");
for (var i = 0; i < LIMIT; i++) {
arr[i] = i;
}
console.timeEnd("Array insertion time");
```

**用时：_55ms_**

### Typed Array：插入

```javascript
var LIMIT = 10000000;
var buffer = new ArrayBuffer(LIMIT * 4);
var arr = new Int32Array(buffer);
console.time("ArrayBuffer insertion time");
for (var i = 0; i < LIMIT; i++) {
arr[i] = i;
}
console.timeEnd("ArrayBuffer insertion time");
```

**用时：_52ms_**

擦，我看到了什么？旧式数组和 ArrayBuffer 的性能不相上下？不不不。请记住，前面提到过，现代编译器已经智能化，能够将元素类型相同的传统数组在内部转换成内存连续的数组。第一个例子正是如此。尽管使用了 `new Array(LIMIT)`，数组实际依然以现代数组形式存在。

接着修改第一例子，将数组改成异构型（元素类型不完全一致）的，来看看是否存在性能差异。

### 旧式数组：插入（异构）

```javascript
var LIMIT = 10000000;
var arr = new Array(LIMIT);
arr.push({a: 22});
console.time("Array insertion time");
for (var i = 0; i < LIMIT; i++) {
arr[i] = i;
}
console.timeEnd("Array insertion time");
```

**用时：_1207ms_**

改变发生在第 3 行，添加一条语句，将数组变为异构类型。其余代码保持不变。性能差异表现出来了，`慢了 22 倍`。

### 旧式数组：读取

```javascript
var LIMIT = 10000000;
var arr = new Array(LIMIT);
arr.push({a: 22});
for (var i = 0; i < LIMIT; i++) {
arr[i] = i;
}
var p;
console.time("Array read time");
for (var i = 0; i < LIMIT; i++) {
//arr[i] = i;
p = arr[i];
}
console.timeEnd("Array read time");
```

**用时：_196ms_**

### Typed Array：读取

```javascript
var LIMIT = 10000000;
var buffer = new ArrayBuffer(LIMIT * 4);
var arr = new Int32Array(buffer);
console.time("ArrayBuffer insertion time");
for (var i = 0; i < LIMIT; i++) {
arr[i] = i;
}
console.time("ArrayBuffer read time");
for (var i = 0; i < LIMIT; i++) {
var p = arr[i];
}
console.timeEnd("ArrayBuffer read time");
```

**用时：_27ms_**

## 结论


类型化数组的引入是 JavaScript 发展历程中的一大步。Int8Array，Uint8Array，Uint8ClampedArray，Int16Array，Uint16Array，Int32Array，Uint32Array，Float32Array，Float64Array，这些是类型化数组视图，使用原生字节序（与本机相同）。我们还可以使用 [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 创建自定义视图窗口。希望未来会有更多帮助我们轻松操作 ArrayBuffer 的 DataView 库。

JavaScript 数组的演进非常 nice。现在它们速度快、效率高、健壮，在内存分配时也足够智能。

## 相关文章

1.  [Is JavaScript really interpreted or compiled language?](http://voidcanvas.com/is-javascript-really-interpreted-or-compiled-language/ "Is JavaScript really interpreted or compiled language?") 

2.  [Create / filter an array to have only unique elements in it](http://voidcanvas.com/create-filter-an-array-to-have-only-unique-elements-in-it/ "Create / filter an array to have only unique elements in it") 

3.  [Object.entries() & Object.values() in EcmaScript2017 (ES8) with examples](http://voidcanvas.com/object-entries-object-values-ecmascript2017-es8-examples/ "Object.entries() & Object.values() in EcmaScript2017 (ES8) with examples") 

4.  [import vs require – ESM & commonJs module differences](http://voidcanvas.com/import-vs-require/ "import vs require – ESM & commonJs module differences")

5.  [A deep dive into ember routers – Ember.js Tutorial part 5](http://voidcanvas.com/deep-dive-ember-routers-ember-js-tutorial-part-5/ "A deep dive into ember routers – Ember.js Tutorial part 5") 

6.  [Myths and Facts of JavaScript](http://voidcanvas.com/myths-facts-javascript/ "Myths and Facts of JavaScript")

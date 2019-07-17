---
title: "JavaScript Weekly 307 阅读笔记"
desc: "JavaScript Weekly 307 阅读笔记"
date: 2016-10-28
tags:
  - 原创
  - JavaScript
  - 阅读笔记
---

## js 编写简单的 compiler

- [How to Make a (Very) Simple Compiler with JS](https://medium.com/@kosamari/how-to-be-a-compiler-make-a-compiler-with-javascript-4a8a13d473b4#.ybwdnaudk)

这个小小的 compiler 还挺简单，将简单的画图指令转换为 SVG 标记。文章作者写了一个 [demo](https://kosamari.github.io/sbn/)，用来演示转换的整个过程，感觉不错，建议看看。

之前也有人讲过一些，比如 github 上的 [the-super-tiny-compiler](https://github.com/thejameskyle/the-super-tiny-compiler/)（有[中文版](https://github.com/yyzl/the-super-tiny-compiler)），貌似还在 2016 年 JSConf 上讲过。又如我之前翻译的这个，《[小两百行 JavaScript 打造 lambda 演算解释器](http://www.wemlion.com/2016/writing-a-lambda-calculus-interpreter-in-javascript/)》。

其实，说到底还是几个步骤，简单的 compiler 实现起来大同小异。词法分析生成 token，句法分析生成 AST，然后转换 AST，最后遍历 AST 生成代码。

说到遍历 AST 生成代码，实际上，我们常用的 Babel、UglifyJS 等等这些都有用到。

想到几篇文章，可以看看：

- [Babel 插件开发与单元测试覆盖度检查](https://www.h5jun.com/post/code-coverage-with-babel-plugin.html)

- [Babel for ES6? And Beyond!](https://www.h5jun.com/post/babel-for-es6-and-beyond.html)

- [可信前端之路-代码保护](https://segmentfault.com/a/1190000006851890)


## Typed Array

- [Exploring JavaScript: Typed Arrays](https://codingbox.io/exploring-javascript-typed-arrays-c8fd4f8bd24f#.vp28u69i6)

关于 **Typed Array 的浏览器支持**，目前还存在以下问题：

- IE 9 不支持
- IE10 (以及 IE 10&11 mobile) 不支持 Uint8ClampedArray
- Safari 5.1 不支持 Float64Array
- Firefox 14 以下没有 DataView
- Safari 6 之前的版本, Typed Array 比 Array 对象还要慢
- IE 10 中的 ArrayBuffer 没有 slice 方法

**Type Array 类型**如下：

| Type | 字节 | Web IDL type  |  C type  |
|:-----|:-----|:-------|:---------------|:---------|
| Int8Array | 1  | byte | int8_t |
| Uint8Array | 1 | 8-bit unsigned integer octet | uint8_t |
| Uint8ClampedArray | 1 | 8-bit unsigned integer (clamped) octet | uint8_t |
| Int16Array | 2 | 16-bit two’s complement signed integer short | int16_t |
| Uint16Array | 2 | 16-bit unsigned integer unsigned short | uint16_t |
| Int32Array | 4 | 32-bit two’s complement signed integer long | int32_t |
| Uint32Array | 4 | 32-bit unsigned integer unsigned long | uint32_t |
| Float32Array | 4 | 32-bit IEEE floating point number unrestricted float | float |
| Float64Array | 8 | 64-bit IEEE floating point number unrestricted double | double |


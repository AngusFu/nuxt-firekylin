---
title: "笔记：TypeScript 中引用全局变量"
tags:
  - 原创
  - TypeScript
date: 2016-09-08 13:42:47
desc: 
---

朋友的朋友，最近的一个项目使用了 angular.js，是使用 typescript 开发的。

让我惊奇的是，竟然还是使用 1.2 版本。

项目还引用了一个外部 js（没有现成的 `.d.ts` 文件可用）。这个 js 文件暴露了一个全局变量，需要在 ts 文件中调用。暂且命名为 `ClassOutOfTS`。

那么问题来了。在 ts 中直接调用 `new ClassOutOfTS()` 会引起编译报错，因为 ts 编译器根本就找不到 `ClassOutOfTS`的定义。

想想实在没什么好办法。那就自己去写个 `.d.ts` 文件好啦。

等等，好像不对。

我最近两周的空闲时间在看 angular2，好像有个例子中，出现过对 `window` 特殊处理的情况。

查查代码，还真有。废话少说，直接上代码：


```typescript
var ins:any = (<any>window).ClassOutOfTS();

```

虽然这办法很黑，可是也没什么更好的了。

简单解释下。上面这行代码中，关键部分是 `<any>window` 这一句。`<any>` 在这里的作用是强制类型转换。

编译器并不知晓 window 下面有哪些属性、方法。但强制转换成 any 类型之后，就不会报错了。

单记录下。以备不时之需。

## 2016-10-20 Update

另外一种类似的办法是，在当前文件再 declare 一下。

```typescript
declare const window;
var ins: any = window.ClassOutOfTS();
```


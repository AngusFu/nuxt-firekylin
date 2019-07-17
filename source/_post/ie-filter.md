---
title: "笔记：IE 下透明度问题"
date: 2016-11-14 11:11:11
desc: "IE 下透明度问题记录"
tags: 
  - 原创
  - CSS
---

IE8 下面遇到奇怪的问题。本来半透明的 png 图片，竟然一片黑。

![](https://p5.ssl.qhimg.com/t01685a11ad71082aa5.png)

然而，我明明按照习惯使用了 `opacity + filter` 的方式。

```css
img {
  opacity: 1;
  filter: alpha(opacity=100);
}
```

结果发现，IE8 完全不是这么解析的。于是想起之前看过不少地方提到为 IE8 准备的 `-ms-filter`（主要是滤镜什么的）。然后产生了下面这个方法：

```css
img {
  opacity: 1;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
  _filter: alpha(opacity=100);
}
```

要么是我以前真的没好好拿 IE8 测试过；要么一定是这次情况比较特殊，真的，之前还真没遇到过 `filter: alpha(opacity=100)` 失败过的。


## 另外一点

里面是一个 flash，功能和图片差不多。要求点击 flash，跳转到另外一个页面。如何实现？

首先想到的，自然是 `a>object` 呗。上 IE 测试下，失败。

然后，那就用 `div>(a+object)` 吧， `a` 绝对定位。好像还挺好，测试，还是不行。

可是 `a` 明明就在那里啊。随便加个背景色试试看？好像可以了。那试试 transparent 吧，又不行了。那就给加一个透明的背景图吧哈哈哈。

```html
 <div class="wrap">
  <a href="#"></a>
  <object>
    ....
  </object>
 </div>
```

```css
.wrap {
  position: relative;
}

.wrap > a {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=);
}
```

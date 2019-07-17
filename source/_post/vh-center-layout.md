---
title: 记一种水平垂直居中的办法
tags:
  - 原创
  - CSS
date: 2015-04-29
desc:
---

又学到了一种水平垂直居中的方法。适用于父级元素只有一个子元素的情况，比如全屏的效果。

父级元素：pos-r, w、h设定;

子元素：pos-a,w、h设定, t0 b0 l0 r0, m-a。

以前只知道 `margin: 0 auto` 之类的，从来没想到 `margin: auto` 的妙用...孤陋寡闻了...

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <title>Document</title>
    <style>
        .outer {
            position: relative;
            width: 300px;
            height: 300px;
            background-color: #f80;
            margin: 50px auto;
        }
        .inner {
            position: absolute;
            height: 100px;
            width: 60%;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #fff;
            margin: auto;
        }
    </style>
</head>
<body>
    <div class="outer">
        <div class="inner">Lorem ipsum dolor sit amet.</div>
    </div>
</body>
</html> 

```

效果如下：

![](http://p0.qhimg.com/t01e1f23859d1617d51.png)


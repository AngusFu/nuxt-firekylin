---
title: 近来在Firefox上遇到的一些坑
date: 2016-03-12
desc: 近来在Firefox上遇到的一些坑
tags: 
    - 原创
    - 开发心得
---

因为工作一年多以来，做的工作基本都是和 `webkit` 系列打交道。

先是做m站，后来做了两个 `app` 内嵌的 `hybrid` 项目，从来只考虑 `webkit` 前缀和相关的伪类。

最近四个多月开始做内部的管理系统，写写样式，偶尔做个 `calendar`、`tree` 之类的组件，所有的基本只考虑新版 `Chrome`。从来没考虑别的问题。

最近在帮人解决 `firefox` 下的一些兼容问题。`QA` 妹纸提交了一堆 `“bug”`。`Bug`列表让人看了头疼，还有点心虚。囧。

按部就班，先打开控制台。一番研究，发现不少 `“bug”` 都是样式的问题，并不是脚本兼容做得不好。

下面就细数下最近发现的一些 `bug`，算是做个备忘。以后还是得注意啊。


## 一）还在用 **background-position-x** 吗

以前看一些CSS规范，反复强调不要使用 `background-position-x` 之类的属性。

如[百度`FEX`](https://github.com/fex-team/styleguide/blob/master/css.md#46-2d-位置)就指出：
>** 4.6 2D 位置**
>[强制] 必须同时给出水平和垂直方向的位置。

```css
/* good */
body {
    background-position: center top; /* 50% 0% */
}

/* bad */
body {
    background-position: top; /* 50% 0% */
}
```

一直以来恪守这个规则，但并没有深究原因。

直到这次，真正遇到了问题。才在控制台上发现，原来 `background-position-x` 在 `Firefox` 下面是**无效**的！！！

## 二）咦，为嘛还没开始输入文本框就验证变红了？

第二个问题。

项目有个修改密码的表单。验证不通过的话，输入框会加上红色的边框。

然后 `QA` 妹纸在描述中说的是：

> `firefox` 浏览器中，修改密码页面，输入框中不输入任何字符，输入框颜色也是红的  

我还以为又是哪里的js写得不对呢。找了半天，还是决定从样式入手。

`Firefox` 的调试工具面板里，似乎只列出了样式表中的样式。浏览器默认样式的值，很难找到。我只能一点点试验。

最后发现，`input` 输入框好像都带了个 `required` 属性。这是 `HTML5` 里表示表单元素必填的属性。莫非问题出在这里？试着删除了这个属性，果然解决了。

其实，这红色的边框，并不是 `border`，而是 `box-shadow` 啊。

最后得到解决方案是加上这段 `CSS`：

```css
input:required:invalid {
    box-shadow: none;
}
```

## 三）我擦，明明写了 `outline: 0 `可是然并卵啊

`QA`妹纸还反映，登录、注册等视图的各种按钮，在 `Firefox` 怎么点击之后，会出现黑色的边框啊？

啥？难道写代码的前端哥们儿不知道在 `:active`、`:focus` 等状态下写个 `outline:0` 啊？这不科学。

于是又开始了神奇的探(gu)索(ge)之旅。

这次得到的答案是，这黑色的细线还真不是 `outline`。这是一个奇怪的伪类，`::-moz-focus-inner`。简直哭死在键盘上。

于是，下面这段代码解决问题：

```css
button::-moz-focus-inner,
input[type="reset"]::-moz-focus-inner,
input[type="button"]::-moz-focus-inner,
input[type="submit"]::-moz-focus-inner,
input[type="file"] > input[type="button"]::-moz-focus-inner {
    border-color: transparent;
}
```

## 最后，还有些其他的

- 还有什么 `clipboardData` 截图粘贴的问题，见上一篇: [【在网页中获取截图数据】Chrome和Firefox下的实战经验](https://segmentfault.com/a/1190000004584071)；

- 还有些东西，当时写到注释中了，忘了。。

TO BE CONTINUED...

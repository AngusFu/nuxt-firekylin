---
title: HTML 表单验证
desc: '[translation]Using HTML Form Validation in Pure JavaScript, HTML 表单验证'
date: 2016-11-05
from: https://www.raymondcamden.com/2016/10/19/using-html-form-validation-in-pure-javascript
author: '@Raymond Camden'
social: https://twitter.com/raymondcamden
permission: 0
tags:
  - JavaScript
  - 翻译
---

我是 [HTML 表单验证](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Data_form_validation)（HTML form validation） 的超级粉丝，因为它取代了我使用了近 20 年的 JavaScript 代码。不幸的是，[Safari](http://caniuse.com/#feat=form-validation) 并不支持这个特性（谈到 Web 时，先别跟我提 Apple 和他们的优先级）。

<caniuse src="/caniuse/embed.html?feat=form-validation&amp;periods=future_3,future_2,future_1,current,past_1,past_2,past_3,past_4,past_5"></caniuse>

不过，我确实很喜欢这个主意，将问题交给 HTML 自己解决。实际上，最近有个网站展示了许多类似的例子：[You Might Not Need JavaScript](http://youmightnotneedjs.com/)。如果还没看过，赶紧点开吧。这是一个极好的例子，展示了 HTML 和 CSS 可以如何取代我们使用了多年的 JavaScript 片段。


基于上面这些，今天早上，我倒产生了另外一些差不多完全相反的想法。可以在纯 JavaScript 表单中使用基于 HTML 的表单验证么？答案是可以（当然，首先浏览器得支持）。假如我们可以使用 [createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) 动态创建 DOM 元素，那么能够在 JavaScript 代码中添加简便的 email 验证么？似乎可以：

```javascript
var element = document.createElement('input');
element.setAttribute('type','email');
element.value = 'foo@foo.com';
console.log(element.validity.valid); 
```

上面这段代码所做的工作是创建一个离线 input 元素（译者注：原文为 virtual input element，但译者认为 virtual 的说法似乎有些歧义，看看最近两年火爆的 virtual DOM，还敢叫说 createElement 创建出来的活生生的元素是 virtual elment 么？倒是让我想起 offline canvas，是故借用），将它的 type 属性设置为 email 并设置其 value 为某一个值。然后就打印出这个值的有效状态了。可以重写这段代码，封装成函数：

```javascript
var elm;
function isValidEmail(s) {
  if(!elm) {
    elm = document.createElement('input');
    elm.setAttribute('type', 'email');
  }
  elm.value = s;
  return elm.validity.valid;
}

console.log(isValidEmail('foo'));
console.log(isValidEmail('goo@goo.com'));
console.log(isValidEmail('zoo')); 
```

我不太喜欢这段代码中引入了一个全局变量，不过这样可以缓存 DOM 元素，也还不错。如果封装在模块中，就将它保存在本地变量中吧。

还是那句话，代码在不支持 HTML 表单验证的浏览器中没法工作。但这确实非常简单，对吧？同样还可以用这种办法验证 URL 或者其他内容。不知亲爱的读者您对此作何评论？

可以在 JSBin 中运行代码看看效果： [https://jsbin.com/diqepa/edit?js,console](https://jsbin.com/diqepa/edit?js,console)。

> 若您喜欢本文, 可以看下我的 [Amazon Wishlist](http://www.amazon.com/gp/registry/wishlist/2TCL1D08EZEYE/ref=cm_wl_rlist_go_v?) 帮我实现愿望，或者[通过 PayPal 捐款支持我](https://paypal.me/RaymondCamden)。还可以[订阅邮件推送](https://feedburner.google.com/fb/a/mailverify?uri=RaymondCamdensBlog)获取最新信息。

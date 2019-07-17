---
title: 给 Service Worker 开后门
date: 2016-07-13
desc: 给 Service Worker 开后门
author: "@Jeremy Keith"
social: https://medium.com/@adactio/
from: https://medium.com/@adactio/backdoor-service-workers-86d241d79996#.bfuq4cdih
permission: 0
tags: 
    - 翻译
    - Service Worker
---


在[渐进式 Web App 开发峰会(Progressive Web App dev Summit)](https://adactio.com/journal/10866)上展示的时候，我花了[差不多 20 分钟](https://youtu.be/EyyEfxrk_NU?t=21m4s)讲了这样一点：

> [Alex](https://infrequently.org/)，你昨天演讲展示了华盛顿邮报(Washington Post)的 [AMP](https://www.ampproject.org/) （——译者注：Accelerated Mobile Pages Project） demo。轻轻那么一点，华盛顿邮报的 AMP 应用就出来了，还能够通过[自定义元素](https://www.ampproject.org/docs/reference/extended/amp-install-serviceworker.html)安装 Service Worker。可是我去看浏览器地址栏的时候……并不是华盛顿邮报。只是 AMP 的 CDN 而已。所以我和 AMP 团队的 [Paul Backaus](https://paulbakaus.com/) 聊了聊，他解释说那是一个 iframe，使用 iframe 能安装其他地方的 Service Worker。

Alex 和 [Emily](https://twitter.com/emschec) 解释说，嗯，这就是 iframe 的工作方式。当你仔细想想，其实还是挺有意义的，毕竟一个 iframe 和任何其他的浏览器窗口没什么不一样的。尽管如此，这还是会让人觉得有点违反[最小惊奇原则](https://en.wikipedia.org/wiki/Principle_of_least_astonishment)。

让我们假设，你遵循了我这并不当真的建议，去[创建一个渐进式的 Web 应用商店](https://adactio.com/journal/10800)，其首页可能有最新的十到二十个渐进式 Web App。你也可以同样地使用十到二十个 iframe，以便给浏览页面的用户“预安装”( pre-install )这些网站。

理论扯够了。现在来点实际操作……

假设你从未访问过我写的书的网站，[html5forwebdesigners.com](https://html5forwebdesigners.com/)(如果你访问过，又还想跟着我把实验进行下去，那么你得打开浏览器设置然后删除这个域下面存的所有东西)。

也许你曾不经意间访问过我的个人网站[adactio.com](https://adactio.com/)。主页下面有个小广告，上面写着“Read my book”，链接指向[html5forwebdesigners.com](https://html5forwebdesigners.com/)。我在链接后面加了这样两行标记：

```html
<iframe src="https://html5forwebdesigners.com/iframe.html" style="width: 0; height: 0; border: 0">
</iframe> 
```

该隐藏的 iframe 会拉取[带有一个 script 元素的空页面](https://html5forwebdesigners.com/iframe.html)。

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>HTML5 For Web Designers</title>
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js');
}
</script>
</head>
</html> 
```

这样就注册了我的[书籍网站的 Service Worker](https://html5forwebdesigners.com/serviceworker.js)，然后就开始下载所有[离线渲染整个网站](https://adactio.com/journal/10754)所需的资源。

搞定了。从未访问过 html5forwebdesigners.com 这个域名，但网站已经在你的设备上预加载过了，一切仅仅因为你访问过 adactio.com。

一些注意事项：

我不得不降低 html5forwebdesigners.com 的内容安全策略（Content Security Policy），以允许能通过 iframe 将其嵌入 adactio.com:

> Header always set Access-Control-Allow-Origin: “https://adactio.com"

若你的浏览器设置选择了“禁止第三方 cookie 及 网站数据”（“Block third-party cookies and site data”），通过 iframe 调用的 Service Worker 是不会被安装的：

> Uncaught (in promise) DOMException: Failed to register a ServiceWorker: The user denied permission to use Service Worker.

我在本文中的示例相对来说是无害的。不过，可以难想象一些更加极端的情形。想象有一家出版商，有 50 种出版物，每本书有一个网站。每个网站都可能有一个空页面，等待着通过 iframe 被其他 49 个网站嵌入。你只需要访问其中一个页面，就会有 50 个Service Workers 在后台运转起来缓存资源。

这就有了[“公地悲剧”](https://en.wikipedia.org/wiki/Tragedy_of_the_commons)的潜在可能。希望我们能清楚的知道，如何去使用这力量。

千万别让广告狗们知道哦！（直译：千万别给广告行业知道这。）
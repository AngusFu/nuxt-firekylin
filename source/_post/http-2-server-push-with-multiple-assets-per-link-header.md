---
title: HTTP2 Server Push 实践：单 Link  报头包含多资源场景
date: 2016-07-17 19:43:53
desc: HTTP2 Server Push 实践：单 Link  报头包含多资源场景
author: John Graham-Cumming
social: https://blog.cloudflare.com/author/john-graham-cumming/
permission: 0
from: https://blog.cloudflare.com/http-2-server-push-with-multiple-assets-per-link-header/
tags: 
    - 翻译
    - HTTP2
    - Server Push
---

## 译者注

译者在做自己的一个小工具（抓取博客的 Chrome 扩展）的时候，使用 jQuery 辅助作为 DOM 解析器，为了避免加载图片、脚本、样式表等无用的资源，在将字符串传给 `$` 的时候，先对字符串中的相关标签进行了处理。

但遇到[某个网站](https://www.qianduan.net/)的时候，一直疑惑不解，**明明已经做了替换**，但通过 Chrome Devtools 能看到，**部分资源还是会下载**。几经折腾，发现还是因为自己**懂得太少**了。

查看请求该页面时的 header，可以看到了如下信息：

```
link:</assets/css/screen.css?v=5bb156d854>; rel=preload; as=style, </content/images/2015/10/avatar.jpg>; rel=preload; as=image, </content/images/2015/10/avatar.jpg>; rel=preload; as=image, </content/images/2015/10/avatar.jpg>; rel=preload; as=image, </content/images/2015/10/avatar.jpg>; rel=preload; as=image, </content/images/2015/10/avatar.jpg>; rel=preload; as=image, <//www.qianduan.net/img/give-me-five/xitu.jpg>; rel=preload; as=image, <//www.qianduan.net/img/apps/shinning.jpg>; rel=preload; as=image, <//www.qianduan.net/img/apps/shakeme.jpg>; rel=preload; as=image, <//www.qianduan.net/img/give-me-five/qianduan_wechat.jpg>; rel=preload; as=image
```

于是，大概能猜出来上述问题的原因。这有点类似如一些站点会使用的 `<link rel="preload" href="/styles/other.css" as="style">` 标签（顺带一句，截至 2016 年 7 月 17 日，[caniuse](http://caniuse.com/#search=preload) 数据：China = 26.83%；Global = 44.59%）。

于是深入挖掘了一下。来看看 [W3C 标准](https://w3c.github.io/preload/#introduction)是怎么说的（同样由译者翻译）：

例如，应用可以使用 preload 关键词，提前、高优先级、不阻塞渲染地拉取的 CSS 资源，它会在适当的时候被使用：

例一：使用标签

```html
<!-- 通过声明标签预加载样式表 -->
<link rel="preload" href="/styles/other.css" as="style">

<!-- 或者通过 JavaScript 预加载样式表  -->
<script>
    var res = document.createElement("link");
    res.rel = "preload";
    res.as = "style";
    res.href = "styles/other.css";
    document.head.appendChild(res);
</script>
```

例二：使用  HTTP Header
```
Link: <https://example.com/other/styles.css>; rel=preload; as=style
```

上面的例子说明，资源可以通过声明性标记、HTTP header link 来指定，或者使用 JavaScript 预定。


记录以下资源备忘：

- [https://w3c.github.io/preload/](https://w3c.github.io/preload/)

- [http://caniuse.com/#search=preload](http://caniuse.com/#search=preload)

- [http://stackoverflow.com/questions/36641137/how-exactly-does-link-rel-preload-work](http://stackoverflow.com/questions/36641137/how-exactly-does-link-rel-preload-work)

- [https://blog.cloudflare.com/http-2-server-push-with-multiple-assets-per-link-header/](https://blog.cloudflare.com/http-2-server-push-with-multiple-assets-per-link-header/?)（也就是本文）

译文标题为意译，原标题为 `HTTP/2 Server Push with multiple assets per Link header`，恐有不当，特此说明。

另，为加强理解 `link` 报头与 `HTTP/2 Server Push` 二者，译文正文后附有 W3C preload 标准中 [“Server Push (HTTP/2)”](https://w3c.github.io/preload/#server-push-http-2) 一节译文。或有助于读懂本文。

<font style="color: red">
**注： 译文中凡是 “link 响应头” 的名词，英文为 “Link header”，翻译为“响应头 Link 字段”或许更恰当。**
</font>

## 正文

四月份的时候，我们[宣布](https://blog.cloudflare.com/announcing-support-for-http-2-server-push-2/)为所有的 CloudFlare  网站添加了 [HTTP/2 Server Push](https://www.cloudflare.com/http2/server-push/) 试验性支持。这样做是为了让客户能够在该新功能的基础上进行迭代。

![](https://blog.cloudflare.com/content/images/2016/06/1673801831_a93ecfc3c4_z.jpg)

<small>[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) [image](https://www.flickr.com/photos/mryipyop/1673801831/in/photolist-3xUEYg-nMS6rx-jvSsLx-9oBV3s-8KH2YK-o54g8R-8h4bmw-eapSfS-cj4No3-nMSXLP-nMRZQJ-iNpH9k-hcr3m3-nMS6ui-5RDVrK-fAaYES-nMXwba-cNFT3N-iZDTWg-k5VzKt-jeJE8T-7bM32E-d3rznG-89jZ9e-aVLkBT-4y2kdD-qtKzjY-62Yv2h-5WcKeC-87jJdA-5Es3vn-bQ8W5a-7DhbKd-hE5oza-6NutL7-5WLwFt-hcnrny-5WAoU1-5mSoVV-8RSQ7A-gXiVcG-5Wp6pS-8GFkMr-hcoeN9-bC1zH5-ePG8BQ-hcokfv-hcpgme-hcqQ59-qUkfTa) by [https://www.flickr.com/photos/mryipyop/](https://blog.cloudflare.com/http-2-server-push-with-multiple-assets-per-link-header/Mike)</small>

我们的 Server Push 实现，利用了 [HTTP `Link`](https://blog.cloudflare.com/announcing-support-for-http-2-server-push-2/#fnref:1) 报头，这在 W3C [Preload](https://www.w3.org/TR/preload/) 工作草案中有详细描述。

同样，我们还展示了，如何在 [PHP 代码](https://blog.cloudflare.com/using-http-2-server-push-with-php/) 中实现 Server Push，许多人已经开始测试、使用该特性了。

然而，我们的初始版本有很严格的限制：使用 Server Push，则每个 `link` 报头中，最多只能指定一个资源，另外，很多 CMS 和 Web 开发平台都不允许存在多个 `link` 报头。

现在该问题已得到解决，多个资源可以通过单个 `link` 报头推送。修改是实时生效的，如果你的浏览器支持 HTTP/2 的话，你正在阅读的本文就使用了该方式推送资源。

当 CloudFlare 读到源服务器（origin web server）的 `link` 报头时，它从中移除其中已通过 Server Push 推送给浏览器的资源。这样一来，要 debug `link` 和 Server Push 问题就困难了，所以我们又加上了一个叫做 `Cf-H2-Pushed` 的报头，它包含已经推送过的资源。

举个例子。打开最近的[这篇博客](https://blog.cloudflare.com/the-complete-guide-to-golang-net-http-timeouts/)，源服务器就会发送以下报头：

```
Cache-Control: public, max-age=0
Content-Encoding: gzip
Content-Length: 33640
Content-Type: text/html; charset=utf-8
Date: Wed, 29 Jun 2016 16:09:37 GMT
Expires: Wed, 29 Jun 2016 16:10:07 GMT
Link: </assets/css/screen.css?v=5fc240c512>; rel=preload; as=style,<//cdn.bizible.com/scripts/bizible.js>; rel=preload; as=script,</content/images/2016/06/Timeouts-001.png>; rel=preload; as=image,</content/images/2016/06/Timeouts-002.png>; rel=preload; as=image,<//platform.linkedin.com/in.js>; rel=preload; as=script,<https://code.jquery.com/jquery-1.11.3.min.js>; rel=preload; as=script,</assets/js/jquery.fitvids.js?v=5fc240c512>; rel=preload; as=script
Vary: Accept-Encoding
X-Ghost-Cache-Status:From Cache
X-Powered-By: Express
```

CloudFlare 决定使用使用 HTTP/2 Server Push 推送这些资源：
```
`/assets/css/screen.css?v=5fc240c512`,
`/content/images/2016/06/Timeouts-001.png`,
`/content/images/2016/06/Timeouts-002.png`,
`/assets/js/jquery.fitvids.js?v=5fc240c512`
```
响应通过 CloudFlare 的时候，这些资源将从 `link` 报头终移除，通过 Server Push 推送，并被添加到 `Cf-H2-Pushed` 报头中：

```
cache-control:public, max-age=30
cf-cache-status:EXPIRED
cf-h2-pushed:</assets/css/screen.css?v=5fc240c512>,</content/images/2016/06/Timeouts-001.png>,</content/images/2016/06/Timeouts-002.png>,</assets/js/jquery.fitvids.js?v=5fc240c512>
content-encoding:gzip
content-type:text/html; charset=utf-8
date:Wed, 29 Jun 2016 16:09:37 GMT
expires:Wed, 29 Jun 2016 16:10:07 GMT
link:<//cdn.bizible.com/scripts/bizible.js>; rel=preload; as=script,<//platform.linkedin.com/in.js>; rel=preload; as=script,<https://code.jquery.com/jquery-1.11.3.min.js>; rel=preload; as=script
server:cloudflare-nginx
status:200 OK
vary:Accept-Encoding
x-ghost-cache-status:From Cache
x-powered-by:Express 
```

在 Google Chrome 金丝雀版本（Google Chrome Canary）的开发者视图中可以看得很清楚。（译者注：翻译本文时译者使用的 Chrome 51.0.2704.106 m (64-bit) 确实无法看到 Push 信息，建议使用最新金丝雀版本一探究竟。）

![](http://p2.qhimg.com/t01b195f4dd002ab402.png)

### 结尾

如果你在使用  Server Push，请和我们联系。推送不同类型的资源（图片 vs 样式表 vs 脚本）、解决最佳的推送数量（目前我们支持 每页最多 50 条资源），我们对相关经验十分感兴趣。

## 附： Server Push (HTTP/2)

原文地址： [https://w3c.github.io/preload/#server-push-http-2](https://w3c.github.io/preload/#server-push-http-2)

HTTP/2 ([[RFC7540](https://w3c.github.io/preload/#bib-RFC7540)]) 允许服务器先发制人地向客户端发送（“推送”）响应。推送的响应（pushed response）在语义上（semantically）与服务器对请求的响应（server responding to a request）是等价的，而且类似于预加载的响应（preloaded response）；它会被浏览器保存，在[匹配到应用启动的其他请求](https://w3c.github.io/preload/#dfn-match-a-preloaded-response)的时候被执行。像这样的，从应用角度来看，使用预加载和服务器推送的请求，并无差别。

服务器*可能*会为应用定义的那些有权限的 [preload link](https://w3c.github.io/preload/#dfn-preload-link) 资源启用服务器推送。对那些声明的 [preload link](https://w3c.github.io/preload/#dfn-preload-link) 资源来说，启用服务器推送消除了客户端和服务器之间的请求往返。可选地，如果某个通过 `link` 报头([RFC5988](https://w3c.github.io/preload/#bib-RFC5988))声明的资源不希望使用服务器推送，开发者*可以使用 `nopush` 目标属性([RFC5988](https://w3c.github.io/preload/#bib-RFC5988)] section 5.4) 向服务器提供一个选择性退出的信号。示例如下：

例三
```
Link: </app/style.css>; rel=preload; as=style; nopush
Link: </app/script.js>; rel=preload; as=script
```

Note：上面的示例，向一个可以使用 HTTP/2 推送的服务器提示， `/app/style.css` 不应被推送（例如，来源方可能有额外信息显示其已经存在于缓存中），而  `/app/script.js` 应当可以作为服务器推送的候选资源。

为 [preload link](https://w3c.github.io/preload/#dfn-preload-link) 启用服务器推送是一个可选的优化项。比方说，服务器可能不会启用推送，如果它认为响应在客户端缓存中可以拿到：客户端会处理预加载指令，检查相关缓存，如果找不到资源则会发送请求。另外，服务器可能因为运维问题而不会启用推送，比如说可用服务器资源或者其他考量。最后，服务器推送的启用取决于协议的 HTTP/2 连接设置：客户端可能会限制或完全禁用服务器推送的使用。应用程序不应当依赖于服务器推送的可用性及其使用。

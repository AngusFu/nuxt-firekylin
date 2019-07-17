---
title: WebP 支持：超乎你想象
date: 2016-07-18 21:26:22
desc: WebP 支持：超乎你想象
author: "optimus.keycdn.com"
social: https://optimus.keycdn.com/
permission: 0
from: https://optimus.keycdn.com/support/webp-support/
tags: 
    - 翻译
    - Webp
    - 前端优化
---


WebP 是 Google 发明的更小的替代 JPEG 和 PNG 的格式。最近有很多关于**WebP支持**的疑惑，细说来就是可以用它做什么，不能做什么，比如说浏览器支持，CMS 支持等等。今天我想清除你所有可能的疑虑。WebP 的支持程度实际上比你想的可能要好得多。

[![webp support](http://p0.qhimg.com/t014487db6f8b3a6294.png)](https://optimuscdn.keycdn.com/support/wp-content/uploads/2016/07/webp-support.png)

## WebP 浏览器支持

并非所有浏览器都支持 WebP，所以很重要的是你得清楚哪些浏览器是支持的，这可能会影响你做决定，是否在你的网站或项目中转换并[采用 WebP 图片](https://optimus.keycdn.com/support/configuration-to-deliver-webp/)。下面是所有主流浏览器及其 [WebP支持程度](http://caniuse.com/#feat=webp)。

> 截至 2016 年 7 月，全球浏览器对 WebP 支持率是 **69.6%** – caniuse.com

### Chrome WebP

Google Chrome 官方**自 Chrome 23 起开始支持 WebP**）（最初发布于 2012 年 11 月），自 Chrome 9 起部分支持。部分支持指的是并不支持无损的、支持 alpha 通道的 WebP。

Google 的安卓浏览器（Google’s Android browser）从 4.2 版本起开始官方支持 WebP（最初发布于 2012 年 11 月），4 版本起开始部分支持。Google Chrome 安卓版（ Google’s Chrome for Android browser）从 Chrome 50 起开始支持 Webp。

### Opera WebP

Opera 官方**自 Opera 12.1 开始支持 WebP**（最初发布于 2012 年 11 月），自 Opera 11.5 起部分支持。部分支持指的是并不支持无损的、支持 alpha 通道的 WebP。

Opera mini 浏览器当前所有版本都官方支持 WebP。

### FireFox WebP

Firefox **当前不支持 WebP**。Mozilla 论坛的 [bug 856375](https://bugzilla.mozilla.org/show_bug.cgi?id=856375) 正在讨论此事。

### Internet Explorer WebP

Internet Explorer 和他们新的 Edge 浏览器，都**不支持WebP**。而且目前并无添加支持的[任何打算](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/webpimageformatsupport?filter=f3f0000bf&search=webp)。不过，已有[用户发声讨论](https://wpdev.uservoice.com/forums/257854-microsoft-edge-developer/suggestions/6508417-webp-image-format-support)，人们要求微软将 Webp 支持加入 Edge。

### Safari WebP

Apple 的 Safari 浏览器及其 iOS Safari 浏览器都**不支持WebP**。不过，最近 HTML5test 有条推文说我们有望在 iOS 10 看到[Safari支持 WebP](https://twitter.com/html5test/status/752434454061322240)。iOS 10 目前处于 beta 测试阶段，所以时间会说明一切。

## 你该使用 WebP 吗?

因为全球 WebP 支持度在 70% 左右浮动，使用这种图片格式来替代 PNG 和 JPEG 是极有意义的。还有重要的一点要提到，无论如何实现 WebP，**你只是为支持的浏览器提供 WebP 服务**，而为其他浏览器提供 PNG 和 JPEG。使用 WebP 并不会破坏你的图片。把这当做增值，而非改变。还有另外一些东西需要考虑，如浏览器市场份额，当前流量，WebP 相对于 PNG 和 JPEG 的文件体积。

### 1. 浏览器市场份额

决定是否使用 WebP 的时候，记得看下浏览器市场份额，因为 Chrome 和 Opera 支持 WebP，所以有必要看下他们的占比。我们从一些不同来源收集了一些统计数据，它们都有自己不同的数据收集方式：

**StatCounter 浏览器市场份额**

[StatCounter](http://gs.statcounter.com/#browser-ww-monthly-201506-201606) 截至 2016 年 6 月的数据显示，Chrome 占有市场份额为 58% 的，Firefox 以大约 16% 排名第二。

[![浏览器市场份额 statcounter](http://p0.qhimg.com/t01e98fb172678790eb.png)](https://optimuscdn.keycdn.com/support/wp-content/uploads/2016/07/browser-market-share-statcounter.png)


**W3Counter 浏览器市场份额**

[W3Counter](https://www.w3counter.com/globalstats.php) 截至 2016 年 6 月的数据显示，Chrome 占有约 57% 的市场比例，Safari 以约 14% 跻身第二。

[![浏览器市场份额 w3counter](http://p0.qhimg.com/t0192f7b51936dfdb31.png)](https://optimuscdn.keycdn.com/support/wp-content/uploads/2016/07/browser-market-share-w3counter.png)


**W3Schools 浏览器市场份额**

[W3Schools](http://www.w3schools.com/browsers/browsers_stats.asp) 截至 2016 年 5 月的数据显示，Chrome 占有约 71% 的市场份额，Firefox 以约 17% 居于其后。

[![浏览器市场份额 w3schools](http://p0.qhimg.com/t01db821c6f04c36003.png)](https://optimuscdn.keycdn.com/support/wp-content/uploads/2016/07/browser-market-share-w3schools.png)

**Clicky 浏览器市场份额**

[Clicky](https://clicky.com/marketshare/global/web-browsers/) 截至 2016 年 7 月的数据显示，Chrome 占有约 50% 的市场份额，Firefox 以约 18% 位居第二。

[![clicky browser market share](http://p0.qhimg.com/t017e1f50b2d8d11195.png)](https://optimuscdn.keycdn.com/support/wp-content/uploads/2016/07/clicky-browser-market-share.png)


从上面的数据可以看到，**Chrome 平均占有约 59% 的市场份额**，所以必须意识到，如果在项目中加入 Webp 图片，大多数访客都会看到 WebP 版本。Opera 仅拥有市场份额的一小部分，但它们的用户也可以看到。

### 2. Google Analytics

尽管浏览器市场份额对大多数人来说可能倾向于 Chrome，并不意味着你的网站/项目也是如此。确认数据总是很重要的。做起来很容易，点击 Google Analytics 的 “浏览器与操作系统”（“Browser & OS”）部分就能看到。在下面的例子中，可以看到将近 70% 的流量来自 Chrome。在这种情况下，WebP 是很有利的，这意味着 70% 的访客会看到更小体积的文件。

[![browser google analytics](http://p0.qhimg.com/t010cc69b1b3cce1efc.png)](https://optimuscdn.keycdn.com/support/wp-content/uploads/2016/07/browser-google-analytics.png)

还有，别忘了移动端！可以在 Google Analytics 的“设备”（“Devices”）部分看到。如你所见，大部分流量来自苹果设备。所以如果 iOS 10 完全支持 WebP 的话会颇有意思，这样一来会大量的移动端流量将会有戏剧性的不同。

[![google analytics mobile](http://p0.qhimg.com/t01270fb13519a7838f.png)](https://optimuscdn.keycdn.com/support/wp-content/uploads/2016/07/google-analytics-mobile.png)


### 3. WebP 文件体积

已经有大量研究比较了 WebP 与 PNG、JPEG 的文件体积。一定要去看看它们。

* [JPG 转 WebP – 压缩大小比较](https://optimus.keycdn.com/support/jpg-to-webp/)
    * **WebP 平均减小了 85.87% 的文件提交**。加载时间降低了 11%，页面整体大小减少了 29%。

* [PNG 转 WebP – 压缩大小比较](https://optimus.keycdn.com/support/png-to-webp/)
    * **WebP 平均减小了42.8% 的文件提交**。加载时间降低了 3%，页面整体大小减少了 25%。

* [WordPress 缓存开启下的 WebP
 案例研究](https://www.keycdn.com/blog/wordpress-cache-enabler/)

还需要考虑*成本效益比*（cost-benefit ratio）。对 WordPress 这样的 CMS 来说，现在有两种图片，一个是 JPEG 或 PNG，还有一个 WebP。因此使用 WebP 会占用服务器更多的硬盘空间。但事实是，更小体积的图片带来的是更快的加载时间。不应忽略节省下来的流量：取决于不同项目，积累下来的数量相当可观。

其他人正在使用 WebP，虽然你可能没注意到。Dollar Shave Club 可以将其 App 的大小由 230 MB 减少到 30 MB！结果就是，[使用 WebP 格式将体积减少了七倍](http://engineering.dollarshaveclub.com/shaving-our-image-size/)。

[![webp image savings](http://p0.qhimg.com/t01a44a5cc84b1188f7.png)](https://optimuscdn.keycdn.com/support/wp-content/uploads/2016/07/webp-image-savings.png)

## CMS WebP 支持

接着平台支持的问题就来了，不管你是使用 WordPress 或 Joomla 这样 的 CMS，或者仅仅是像 Laravel 这样的 PHP 框架搭建的简单的静态站点。下面我们将会介绍一点关于如何在在不同平台上支持 Webp 图片的内容。

### WordPress WebP

事实上，WordPress 很容易实现 WebP 支持。你可以使用我们的[集成图片优化(Image Optimizer)](https://wordpress.org/plugins/optimus/) 插件，在将图片上传至 WordPress 媒体库时候自动转换为 WebP 格式。

[![optimus webp files](http://p0.qhimg.com/t0156107f9070a92137.png)](https://optimuscdn.keycdn.com/support/wp-content/uploads/2016/07/optimus-webp-files.png)

然后你可以使用免费的 [WordPress Cache Enabler](https://wordpress.org/plugins/cache-enabler/) 插件来为访客提供 WebP 图片。

[![webp support caching](http://p0.qhimg.com/t01af7fe49591cfda47.png)](https://optimuscdn.keycdn.com/support/wp-content/uploads/2016/07/webp-support-caching.png)

重点是，Cache Enabler 做的其实是判断浏览器支持，为支持的浏览器提供 WebP，而为其他浏览器提供 JPEG 或 PNG。它实际上已经自动为你做好了切换工作。

### Joomla WebP

Yireo 的免费的 [WebP Joomla 扩展](https://www.yireo.com/software/joomla-extensions/webp)，允许在浏览器支持的情况下启用 WebP 支持。其侦测浏览器对 WebP 的支持，基于 user-agent 简单检测（这样就能正确匹配 Chrome）以及额外的 JavaScript 检测。如若检测到支持 WebP，扩展会解析输出的 HTML，确保那些支持图片（png，jpg，jpeg）的链接被 Webp 图片替换掉。

### Magento WebP

Yireo 的免费的 [WebP Magento 扩展](https://www.yireo.com/software/magento-extensions/webp)，允许在浏览器支持的情况下启用 WebP 支持。其侦测浏览器对 WebP 的支持，基于 user-agent 简单检测（Chrome）以及额外的 JavaScript 检测（这样也能够匹配其他浏览器）。如若检测到支持 WebP，扩展会解析 HTML 输出，确保那些支持图片（png，jpg，jpeg）的链接被 Webp 图片替换掉。

### 其他平台上的 WebP

对于其他平台，你应该去看看我们的这篇[如何提供 WebP (how to deliver WebP)](https://optimus.keycdn.com/support/configuration-to-deliver-webp/)。某些平台启用 WebP 支持，可能需要修改你的 `.htaccess` 文件或者 Nginx 配置。

## 小结

如你所见，WebP 的支持程度可能比你最初想的要好得多。当然应该讲浏览器市场份额以及当前的浏览数据纳入考虑中。比方说，如果 70% 以上的流量都来自 Chrome，那使用 WebP 来加速网站意义重大。如果你在使用 CMS，一切都很简单，因为有很多插件来帮你完成 WebP 的转换。

## 相关文章

*   [How to Use WordPress Retina and WebP Images](https://optimus.keycdn.com/support/wordpress-retina/)

*   [Convert to WebP Format – The Successor of JPEG](https://www.keycdn.com/blog/convert-to-webp-the-successor-of-jpeg/)
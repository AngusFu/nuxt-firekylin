---
title: font-display 的使用
permission: 0
tags:
  - 翻译
  - CSS
  - 性能
date: 2017-08-04 23:13:53
desc: font-display 的使用
author: Rob Dodson
social: https://twitter.com/rob_dodson
from: https://developers.google.com/web/updates/2016/02/font-display
---

进行性能优化时，决定 Web Font 的加载行为是一项技术活。`@font-face`规则中新增了一个`font-display`声明，开发者可以根据 Web Font 的加载时间来决定如何渲染或降级处理。

## 字体渲染差异

有了 Web Font，开发者可以在项目中加入丰富的排版功能。但需要权衡的是，下载字体会耗费一些时间。而下载时间难免会受到网络状况的影响，继而干扰用户体验。说实话，如果连页面展示都费劲，谁还会在乎你用多炫的字体呢。

字体下载可能比较慢，为了减轻风险，大多数浏览器都采用了超时处理。一旦超时，就使用后备字体。理想很美好，现实很无奈，浏览器在实现上各有自己的一套。

| Browser | Timeout | Fallback | Swap |
|:--------|:--------|:---------|:-----|
| **Chrome 35+** | 3 seconds | Yes | Yes |
| **Opera** | 3 seconds | Yes | Yes |
| **Firefox** | 3 seconds | Yes | Yes |
| **Internet Explorer** | 0 seconds | Yes | Yes |
| **Safari** | No timeout | N/A | N/A |

*   Chrome 和 Firefox 超时时间为 3 秒，超时后使用后备字体。若字体最终勉强加载成功，它将替换后备字体，重新渲染文本。

*   IE 浏览器超时时间为 0 秒，也就是说，会立即渲染文本。若所请求的字体尚不可用，则使用后备字体。一旦请求字体可用，将重新渲染文本。

*   Safari 没有超时行为（或者说，至少在基准网络超时之前什么也没干）。

更糟糕的是，这些规则对应用造成的影响，在很大程度上不受开发者控制。关注性能的开发者也许更乐意使用后备字体，使网页内容更快地展现，当更美观的 Web Font 下载完成后再加以使用。使用 Font Loading API 之类的工具，可以覆盖浏览器的某些默认行为，提升性能。但这将引入额外的 JavaScript 代码 —— 要么把代码内联到页面中；要么请求外部文件，而这可能带来额外的 HTTP 延时。

CSS 工作组为此提出了新方案：为`@font-face`增加新的`font-display`声明，用于控制字体下载完成之前的渲染行为。

## 字体下载时间轴

与一些浏览器目前使用的字体超时行为类似，`font-display`将字体下载过程划分为三个阶段。

1.  首先是字体阻塞阶段（font block period）。在此期间，如果字体未完成加载，则尝试使用它的任何元素必须以不可见的后备字体形式呈现；否则正常使用该字体。

2.  紧接着字体阻塞阶段的是字体交换阶段（font swap period）。在此期间，如果字体未完成加载，则尝试使用它的任何元素必须使用后备字体进行渲染；否则正常使用该字体。

3.  紧接着是字体故障阶段（font failure period）。此时若字体未完成加载，则将其标记为下载失败，并使用常规后备字体；否则正常使用该字体。

理解以上三个阶段，根据字体是否下载成功、何时下载完成等情况，就可以可以使用`font-display`来决定如何渲染字体了。

## 使用哪种 font-display 值？

要使用`font-display`，请在`@font-face`规则中添加代码：

```css
@font-face {
  font-family:  'Arvo';
  font-display:  auto;
  src:  local('Arvo'), url(https://fonts.gstatic.com/s/arvo/v9/rC7kKhY-eUDY-ucISTIf5PesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');
}
```

目前，`font-display`支持`auto | block | swap | fallback | optional`五种值。

### auto

`auto`使用的字体展示策略与浏览器一致。当前，大多数浏览器使用的默认策略类似`block`。

### block

`block`给予字体一个较短的阻塞时间（大多数情况下推荐使用 3s）和无限大的交换时间。换言之，如果字体未加载完成，浏览器将首先绘制“隐形”文本；一旦字体加载完成，立即切换字体。为此，浏览器将创建一个匿名字体，其类型与所选字体相似，但所有字形都不含“墨水”。使用特定字体渲染文本之后页面方才可用，只有这种情况下才应该使用 `block`。

### swap

使用 `swap`，则阻塞阶段时间为 0，交换阶段时间无限大。也就是说，如果字体没有完成加载，浏览器会立即绘制文字，一旦字体加载成功，立即切换字体。与 `block` 类似，如果使用特定字体渲染文本对页面很重要，且使用其他字体渲染仍将显示正确的信息，才应使用 `swap`。Logo 文字就很适合使用 `swap`，因为以合理的后备字体显示公司名称仍将正确传递信息，而且最终会以官方字体的样式展现。

### fallback

使用 `fallback`时，阻塞阶段时间将非常小（多数情况下推荐小于 100ms），交换阶段也比较短（多数情况下建议使用 3 秒钟）。换言之，如果字体没有加载，则首先会使用后备字体渲染。一旦加载成功，就会切换字体。但如果等待时间过久，则页面将一直使用后备字体。如果希望用户尽快开始阅读，而且不因新字体的载入导致文本样式发生变动而干扰用户体验，`fallback` 是一个很好的选择。举个例子，正文文本就符合这个条件。

### optional

使用 optional 时，阻塞阶段时间会非常小（多数情况下建议低于 100ms），交换阶段时间为 0。与 `fallback` 类似，如果字体能够为页面效果增色不少，但并非特别重要时，使用 `optional` 正好。使用 `optional` 时，将由浏览器来决定是否开始下载字体。可以不下载，也可以给予字体较低的优先级，一切取决于浏览器是否认为对用户最有利。当用户处于弱网络下，这是非常有用的，下载字体可能并非对资源最好的利用。

## 浏览器支持

启用 Chrome 49 桌面版、Opera 或 Opera for Android的 “Experimental Web Platform Features flag” 后可以使用 `font-display`。（译者注：该文发表于 2016 年。根据译者 2017 年 8 月 4 日访问[caniuse](http://caniuse.com/#search=font-display)获取的信息，Chrome 60 正式引入 `font-display`。）

## Demo

点击[链接](https://jsbin.com/nigahi/latest/edit?html,output)可以查看`font-display`的效果。对关注性能的开发者来说，`font-display` 可是相当有用的工具啊！

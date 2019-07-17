---
title: eBay：style & speed
date: 2016-07-27 15:47:19
desc: eBay：style & speed
author: Senthil Padmanabhan
social: http://www.ebaytechblog.com/author/spadmanabhan/
from: http://www.ebaytechblog.com/2016/06/30/browse-ebay-with-style-and-speed/
permission: 0
tags: 
    - 翻译
    - 用户体验
    - AMP
---


今年 eBay 的顶级举措之一是为我们的用户提供一个更好的浏览体验。在最近的一次[采访](http://diginomica.com/2016/04/28/ebay-looks-to-structured-data-to-fuel-growth/)中，[Devin Wenig](https://twitter.com/devinwenig) 对关于此事的重要性已经有了很棒的评论。我们的想法是利用结构化的数据和机器学习，让各种价值观不同的用户购物，这些用户中可能一些人偏好存钱，而另外一些人可能会关注像畅销品这样一些东西。

开始设计体验的时候，我们最先聚焦于移动 Web。和许多其他组织一样，移动 Web 已成为发展成长最高的产业点。我们希望先在移动 Web 中启动新的浏览体验，接下来是桌面电脑，以及原生 App。

移动 Web 新版浏览体验的核心设计原则是，简单，可访问，快，特快（simple, accessible, and fast, really fast）。就前端方面而言，我们已有许多可选项以达成目标。

* **精简、可访问** —— 从一开始我们就希望页面越瘦越好。这意味着保持最少的 HTML、CSS、JS。为达成目标，我们遵循着[模块化架构](http://www.ebaytechblog.com/2014/10/02/dont-build-pages-build-modules/)，并开始搭建原子化的组件。一个页面基本上就是一堆模块，模块又是由其他子模块搭起来的。这能够最大程度地实现代码复用，从而彻底地减少资源（CSS 和 JS）体积。除此之外，我们的样式库通过 CSS 强制使用可访问性（accessibility） —— 使用 [ARIA](https://en.wikipedia.org/wiki/WAI-ARIA) 属性定义样式，而非仅仅使用类名。这迫使开发者一开始就编写 [a11y](http://w3c.github.io/aria-in-html/) 友好型的标记，而不是在事后再去考虑。你可以在[这里](http://www.ebaytechblog.com/2015/11/04/how-our-css-framework-helps-enforce-accessibility/)读到更多。

* **面向平台编码** —— Web 平台已变得到对开发者更友好了，我们希望可以利用这一方面 —— 面向平台编码，而非背向平台。这意味着，我们可以减少对大体积的库文件和框架的依赖，并开始使用原生 API 达到同样的目的。比方说，在 DOM 操作的时候，我们试着不使用 jQuery，而是使用原生的 DOM API。类似地，可以使用 fetch [polyfill](https://github.com/github/fetch) 替代 [$.ajax](http://api.jquery.com/jquery.ajax/)，大致如此，不一而足。最终的结果就是页面加载更快，并且能更好地响应用户交互。顺带一句，jQuery 还是会被加载，因为某些针对 eBay 平台的特定代码还在依赖它，但我们正在努力以彻底移除此依赖。

不过，我们的努力并不止步于此。速度方面对我们来说至关重要，我们希望做更多关于速度的工作。因此我们使用了 AMP。


## AMP 试验

[AMP](https://www.ampproject.org/) 项目差不多和我们开始对浏览体验头脑风暴同时启动。我们关于如何渲染新体验的想法，与它似乎产生了很多共鸣。虽然 AMP 更多地面向基于出版的内容，它依然是使用开放 Web 构建的开源项目。并且，新版浏览体验的流量的一部分是通过搜索引擎进行的，这使一探 AMP 更富希望。所以我们很快联系上 Google 的 AMP 人员，讨论在正常的移动 Web 页面之外构建 AMP 版本的想法。他们非常支持。积极的反应鼓舞了我们，我们开始探索电子商务世界中的 AMP 技术，并同时开始开发 AMP 版本。

现在我们可以骄傲地宣布，新浏览体验的 AMP 版本正在使用，生产环境中有大约 800 万基于 AMP 的节点可以使用。在**移动浏览器**中看下一些受欢迎的搜索内容：比如说，[Camera Drones](https://cdn.ampproject.org/c/m.ebay.com/sch/amp/Camera-Drones/179697/bn_89951/i.html) 和 [Sony PlayStation](https://cdn.ampproject.org/c/m.ebay.com/sch/amp/Sony-PlayStation-4-Video-Game-Consoles/139971/bn_339810/i.html)。只需要在浏览的 URL 的路径后面加上 `amp/`，就会渲染出 AMP 版本（比如说，[非 AMP 版本](http://m.ebay.com/sch/16GB-iPhone-5s-Smartphones/9355/bn_341667/i.html)，[AMP 版本](http://m.ebay.com/sch/amp/16GB-iPhone-5s-Smartphones/9355/bn_341667/i.html)）。目前，我们尚未将所有常规页面（非 AMP）[链接到](https://www.ampproject.org/docs/guides/discovery.html) AMP。这一步还在等待一些任务的完成。就当前来说，我们仅在移动 Web 上启用了该新版浏览体验。接下来几周，桌面端也会启用。

所以电商世界中实现 AMP 的体验究竟如何？我们总结了如下的一些经验。

### **工作很好的部分**

* **最佳实践** —— AMP 很好的一点是，最终所得到的是构建移动 Web 页面的[最佳实践](https://www.ampproject.org/docs/get_started/technical_overview.html)的系列组合。我们已经遵循了一些最佳实践，但采用是分散在不同团队之间的，每个团队都有自己的偏好。这样的起步，帮我们巩固了优化列表，并将这些最佳实践吸收到日常开发周期中。这使我们更加有机地使用 AMP，而不是迫不得已而为。另外一个好的副作用是，这甚至让我们的非 AMP 页面变快了。

* **代码分叉更少** —— 这紧接着上一点。我们开始构建常规页面的时候，就遵循着 AMP 最佳实践，因此可以在非 AMP 页面与 AMP 页面之间复用大部分 UI 组件。这使代码分叉更少，不然的话维护起来绝对的噩梦。话虽如此，当涉及到基于 JavaScript 的组件的时候，还是会有一些分叉，不过我们正在寻找最佳解决方案。

* **AMP 组件列表** —— 虽然 AMP 项目最初关注更多的是基于出版的内容和新闻推送，AMP [组件列表](https://www.ampproject.org/docs/reference/extended.html)对构建一个基本的电商产品查看页面还是绰绰有余。用户没办法在内容项目上操作（如“加入购物车”），但还是可以有很好的浏览体验。好消息是，这个列表正在不断优化、成长中。像 [sidebar](https://www.ampproject.org/docs/reference/extended/amp-sidebar.html)、[carousel](https://www.ampproject.org/docs/reference/extended/amp-carousel.html)、[lightbox ](https://www.ampproject.org/docs/reference/extended/amp-lightbox.html) 等这些组件，对良好的电商用户体验至关重要。

* **内部 AMP 平台** —— 我们一直在考虑在搜索中利用 AMP 生态系统，类似于 Google 处理 AMP 的结果。这个计划尚处于很早的讨论阶段，不过很有意思。

### **复杂的部分**

* **基础组件** —— 将一个 eBay 页面投入生产环境中的时候，许多基础组件自动登场。这些组件有：全局的 header/footer，网站速度信标（现场速度信标套件），试验的库文件，以及统计模块等。它们中基本都有一些 JavaScript存在，这立刻让它们在 AMP 版本中无法使用。这给开发增加了复杂度。我们不得不 fork 一些基础组件，以支持 AMP。它们在发布前要经历严格的回归测试，这就会增加延时。此外，默认的前端服务器不得不根据条件调整，剔除或切换某些模块。学习曲线还好，而随着时间的推移，我们也将早期快速的 hack 已被替换为更健壮、可持续的解决方案。

* **跟踪** —— AMP 为用户提供活动跟踪，通过其 [amp-analytics](https://www.ampproject.org/docs/reference/extended/amp-analytics.html) 组件进行。`amp-analytics` 有好几种配置方式，但它还不能满足 eBay 的跟踪粒度。我们也一些像会话拼接（session stitching）这样的事情，这需要访问 cookie。为我们的需求专门写一个 `amp-analytics` 配置太慢了，而且不可控。我们需要组件层面的一些提升，希望很快能开发出来并提交给[项目](https://github.com/ampproject/amphtml)。

## 接下来

我们很高兴，能与谷歌和其他参与 AMP 项目的小伙伴们一起工作。我们已经创建了一个联合工作组以解决分歧，并且正在研究这些内容。

* **智能按钮** —— 这些让我们可以在认证支持的前提下，完成“添加到购物车”“立即购买”这些的动作。

* **输入框元素** —— 对电子商务来说，用户交互元素非常重要。它们可能是简单的搜索文本框或者复选框。

* **提升的跟踪** —— 如前所述，eBay 需要粒度更小的跟踪，所以我们必须找到完成任务的办法。

* **A/B Test** —— 这可以完成 AMP 项目的 [A/B 测试](https://en.wikipedia.org/wiki/A/B_testing)。

随着这些内容的发展，电子商务中的 AMP 会很快浮出水面。

我们也正在研究从 AMP 视图无缝切换到普通视图的办法，这有点像[华盛顿邮报](https://www.washingtonpost.com/pr/wp/2016/05/19/the-washington-post-introduces-new-progressive-web-app-experience/)使用 [Service Workers](https://ampbyexample.com/components/amp-install-serviceworker/) 所做到的。这将让 eBay 用户有更加完整、愉快的体验，无需切换上下文。

也有一些人向我们提问，Web 是否比 Native 获得了更多的青睐？答案是否。在 eBay中，我们坚信 Web 与 Native 并非互相竞争的关系。实际上，这两者是互补的，组合的生态系统工作得很好。我们会很快在 Native 平台上启用这些浏览体验。

我们正在通往使 eBay 成为全球购物首选地的路上，本文提及的尝试只是其中一小步。感谢我的同事 [Suresh Ayyasamy](https://www.linkedin.com/in/sureshrajkumar)，他和我一起实现了 eBay 的 AMP 版本，并成功将其投入生产环境。
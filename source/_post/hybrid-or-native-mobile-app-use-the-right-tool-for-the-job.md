---
title: Hybrid or Native： 适合工作的才是最好的
date: 2016-07-15 14:24:37
desc: Hybrid or Native： 适合工作的才是最好的
author: Rob Lauer
social: http://www.telerik.com/blogs/author/rob-lauer
permission: 0
from: http://www.telerik.com/blogs/hybrid-or-native-mobile-app-use-the-right-tool-for-the-job
tags: 
    - 翻译
    - 移动开发
    - Hybrid App
---

> 译者注：本文讲到的 hybrid & native 可能和我们通常理解的略有差异。文中 native 部分主要讲到的是 NativeScript，这一点可能在一些开发者看来是有争议的。关于 NativeScript，想起来[@前端外刊评论](http://qianduan.guru/) 有一篇文章[《使用 NativeScript 和 Angular2 构建跨平台 APP》](http://qianduan.guru/2016/07/03/create_cross_platform_app_with_nativescript_angular/)，可以参阅。

移动应用开发，何时该用 hybrid，何时又该用 native？一起来学习它们的差异，看看哪款更适合你。

移动应用开发者的工具箱正在膨胀，比任何人期待的都更加多样化了。从像 Xcode 和 Android Studio 这样的纯原生 (pure native) 解决方案，到 [Telerik NativeScript](https://www.nativescript.org/)和 React Native 这样的原生 JavaScript 选项，再到 [Kendo UI](http://www.telerik.com/kendo-ui) 和 Ionic 这样基于 web 的框架，开始App 开发比以前任何时候都容易。然而，随着可选项的增加，“选择悖论” (paradox of choice) 出现了 —— 我们惊呆了，看不懂了，竟然有*如此多*的可选项。我们真正想要的是，更少的选择，更清晰的指南。在这篇文章中，我希望能让您看清选择，为您指向一条康庄大道，创建成功的移动应用。

谈论移动应用开发的工具、服务，比如说[Telerik Platform by Progress](http://www.telerik.com/platform)提供的那些，选择就变得简洁多了：

- **想试试 hybrid ？**我们提供 [Cordova/PhoneGap](https://cordova.apache.org/) 开发，你可以使用任何移动端 JavaScript 框架

- **想用 native ？**我们支持 [NativeScript](https://www.nativescript.org/) 开发（附带可选的 [Angular 2 集成]）

使用 Telerik Platform，不需要 Mac，也不需要管理各种 SDK。你可以使用到最佳的模拟、调试以及像消息推送、实时同步（LiveSync）、App Store发布等等服务。

![hybrid native mobile web](http://p0.qhimg.com/t01f0b99ba0341c262c.png)

### Hybrid App 到底是什么？

我的同事 John Bristowe 在[这篇博客](http://developer.telerik.com/featured/what-is-a-hybrid-mobile-app/)中讲到了这个，其中有关于 hybrid 的全面解释。说得更清楚一点，Hybrid App 并不是移动端网站！它是安装在设备本地的应用，但使用 Web 技术（HTML5， CSS，JavaScript）编码，在 WebView 中运行。WebView 是打包在移动应用中的浏览器。

Hybrid App 无论是看起来、感觉起来还是使用起来，都很像 Native App（多数情况下... 往下看）。它可以与设备的原生功能如地理定位、相机、通讯录等等交互。任何无法使用的原生功能，通常都能用各种 [Cordova 插件](http://plugins.telerik.com/cordova)解决。

**听起来真棒，是吧？**来看看 hybrid 的更多优弱势：

#### Hybrid 强项

- **完全跨平台：**编码一次，然后就可以构建 iOS、Android 和/或 Windows Phone 应用

- **代码复用：**可以复制现有的大部分 Web App 代码，将其转换为移动 App

- **技能复用，学习曲线低：**如果你有 JavaScript、HTML、CSS 相关知识的话，很快就能使用 Cordova 和移动 JavaScript 框架开发应用

- **减少开发时间和成本：**因为上述有点，可以相对快速完成移动 App 开发并上线

- **健全的生态系统：** Cordova 是一个成熟的开源框架，[Kendo UI](http://www.telerik.com/kendo-ui) 包含一个著名的（且开源的）[移动框架](http://docs.telerik.com/kendo-ui/controls/hybrid/introduction)。

#### Hybrid 缺点

- **感知性能问题：** Hybrid App 在 WebView 中运行，所以会受到设备上 WebView 的性能的影响（尤其 Android 有一堆问题）

- **跨设备行为差异：** WebView 在各平台（甚至不同版本）上不一样，需要额外调整并优化代码，确保 App 按照预期能在所有设备上运行

- **大量图形和过渡（heavy graphics and transitions）情况下的性能问题：** WebView 在处理大量图形和过渡（特别是游戏和其他重 UI 的应用中）的时候，肯定有各种问题

- **特定平台 UI 或特性需要额外开发：**进军特殊平台的特性，通常需要额外编码，或者在某些情形下使用插件，甚至需要自己来创建插件

- **新版本平台支持缓慢：**新版移动平台可以使用的时候，在 Cordova 引入新版本及其特性的各种支持之前，需要等上几个月

### Native App 又是什么？

Native App 是运行在设备本地的应用，使用的是真实的原生 UI 元素。不像 Hybrid App，Native App 无需牺牲性能，因为它运行在设备原生环境中！**Native App 中没有 WebView 碍事了。** Native App 也能完整访问平台上所有可用的 API（所以不必使用任何插件，虽然它们也有用）。

**谈到 Native App，最好也是最简单的办法是使用免费、开源的 [NativeScript](https://www.nativescript.org/) 框架。**

![nativescript architecture](http://p0.qhimg.com/t0122c5404d78455584.png)

为什么使用 NativeScript ？好吧，就像 hybrid 技术，它可以让你使用所掌握和喜爱的 Web 技能（CSS 和 JavaScript/TypeScript），同时使用我们的插件如 [Telerik UI for NativeScript](http://www.telerik.com/nativescript-ui) 达到平滑、优雅的用户体验。

**这听起来也挺好的吧？** 也来看看 native 的优缺点细节：

#### Native 强项

- **跨平台：**同 hybrid 一样，使用 NativeScript 创建的应用，同一套代码可以在 iOS 和 Android 上运行

- **代码复用：**还是一样，可以将许多 JavaScript 业务逻辑拷到 NativeScript 应用中（当然得视情况而定）

- **技能复用：**如果你会 JavaScript 和 CSS，或者理解 XML（UI 标记）的概念，那你已经具备理解 NativeScript 的基础了

- **跨平台的原生 UI 和性能：**因为应用使用的是原生组件，它们在任何地方都能跑起来

- **利用现有的原生库：** NativeScript 提供包括 [CocoaPods](https://cocoapods.org/) 这样的原生库的框架外支持

- **新特性无缝支持：**新的移动操作系统版本可用的时候，NativeScript 马上就能提供支持

#### Native 弱势

- **相对较新：** [JavaScript Native](http://developer.telerik.com/featured/defining-a-new-breed-of-cross-platform-mobile-apps/) 框架相对来说还是比较新，因此社区还在制造资源、拓展文档

- **更陡峭的学习曲线：** Hybrid 让我们使用 HTML，但 NativeScript 迫使我们使用更多的原生应用概念如 原生 UI 元素。对不起，没有 div 了，但是 NativeScript 布局引擎[理解起来很简单](http://developer.telerik.com/featured/demystifying-nativescript-layouts/)

### 两者如何选择？

**这才是关键问题，对吧？**如果你想开发移动应用，而且有得选择，然后 [Telerik Platform](http://www.telerik.com/platform) 两种方案都支持，你会怎么选？这儿有一些问题是我们听到人们在选择 hybrid 和 native 开发时的谈论的：

**性能对我很重要 —— 如果体验不好客户才不会要！**如果性能是关键（通常都这样），那就使用 NativeScript 吧。

**我只想尽快上线应用。不需要完美，也不需要 100% 原生。**需要快速开发打样 App？那 hybrid 可能最好的选择。NativeScript 很酷的一点是，你甚至可以直接从打样 App 中复制大部分业务逻辑，放到 NativeScript App 中（它们都是 JavaScript）。

**我想让我的应用不会过时。我可等不及别人写插件或者更新框架。**和最新的移动平台保持同步确实有点麻烦，这也是为何 NativeScript 为各种新操作系统发布、API 升级提供快速支持。

**我*需要*给我的应用创建一个 Windows Phone 版本！**截至现在，Windows Phone 只支持 hybrid（不过 NativeScript 团队正在为此努力）。

### 下一步

**现在开始，在 Telerik Platform 上开始免费试用吧。**我们为你提供即时可用的开发体验，众多关于 hybrid 和 native 的快速入门教程。祝你好运！
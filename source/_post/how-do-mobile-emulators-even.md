---
title: 移动开发中的仿真器与模拟器
date: 2016-07-19 16:21:41
desc: 移动开发中的仿真器与模拟器
author: Jen Looper
social: http://developer.telerik.com/author/jlooper/
permission: 0
from: http://developer.telerik.com/content-types/tutorials/how-do-mobile-emulators-even/
tags: 
    - 翻译
    - 移动开发
    - 模拟器
---


**译者注：**

本文主要涉及到两个概念： Emulator 和 Simulator。通常我们在工作中可能统统习惯称为“模拟器”，但实际上二者有所不同。为了分清概念，本文将 Emulator 译作 “仿真器”， Simulator 译作 “模拟器”。听起来可能略拗口，如产生生理或心理不适，敬请谅解。

>仿真器（Emulator），又称仿真程序，在软件工程中指可以使计算机或者其他多媒体平台（掌上电脑，手机）能够运行其他平台上的程序，常被错误的称为模拟器。仿真器多用于电视游戏和街机，也有一些用于掌上电脑。仿真器一般需要ROM才能执行，ROM的最初来源是一些原平台的ROM芯片，通过一些手段将原程序拷贝下来（这个过程一般称之为“dump”）然后利用仿真器加载这些ROM来实现仿真过程。

>模拟器（Simulator），又称模拟程序，在计算机科学技术的软件工程中，是指完全基于主机程序并模拟了目标处理器的功能和指令系统的程序。而仿真器（emulator）具有更强大的硬件模仿功能。

> —— 转引自 [《simulator和emulator区别》](http://blog.csdn.net/laurensky/article/details/3323756)


另外，原文标题为 “How Do Mobile Emulators Even?”，译者根据正文内容，该而使用《移动开发中的仿真器与模拟器》作为标题。
**正文部分：**

每个移动开发者的专业生活都被许多瞬间所掌控，手指在键盘上滑动，耐心等待着屏幕上出现窗口，里面有他/她已为之付出多时的的移动 App。结束一天的工作，这充满希望的暂停让他们的心情达到高潮，伴随着一阵阵宽慰的叹息（也可能是诅咒），因为移动仿真器（emulator）还算给力。

好的仿真器（emulator）对创造一个好的移动 App 来说至关重要。可是有人会问，什么是仿真器，还是在移动环境中的？它们怎么工作？为什么有些仿真器比其他的要好？为什么 Android he iOS 仿真器差别如此之大？ 模拟器和仿真器之间到底有什么区别？让我们一起来看看。

## 模拟器和仿真器

首先来解决两者之间的混淆。仿真器（emulator）“模仿执行二进制代码的机器，而‘模拟器’通常指的是计算机模拟（computer simulation）”（[wikipedia](https://en.wikipedia.org/wiki/Emulator#Emulation_versus_simulation)）。单词“emulator” 1963 年由 IBM 创造，当时工程师们研发了使用“软件、微指令和硬件组合”的产品。如果说，仿真器更像是虚拟机，那么模拟器（simulator）则只不过是模拟虚拟机的软件。

为了更好地理解两者的差异，我直接上了 Telerik engineering —— 有疑惑的时候它总是解决问题的好去处。资深前端开发者 Kamen Bundev 不仅解释了差异，还提供了简短的历史介绍：

> 模拟器是为桌面电脑 CPU 编译的 OS（操作系统）版本，运行在虚拟机内。Android 发展早期，OS 甚至都没有为 [x86](https://en.wikipedia.org/wiki/X86) 编译版本，由虚拟机模拟（emulating）整个 [ARM](http://wanderingcoder.net/2010/07/19/ought-arm/) CPU 架构，因此它慢了数十倍。现在，Apple 和 Google 都提供了 x86 虚拟机镜像（VM images），所以若 CPU 支持的话，虚拟机会直接将多数调用传给底层 CPU 和 GPU，从而更快地模拟相应的平台。

因为仿真器是完整的 OS 虚拟机，需要像在真实机器上一样部署我们的 App，这也就意味着，部署起来，仿真器比模拟器花费的时间要多一些。

因此，使用模拟器和仿真器之间的最终权衡在在于速度与精确度之间的考量。模拟器仅仅是近似移动设备。仿真器的功能则更加全面 —— 这可能包含着从仿真器内部调用移动设备硬件的能力。与此同时，模拟器通常就是个壳 —— App 作为本地程序运行在电脑上，嵌套在框架以展示在不同设备上的外观。

有时候，模拟器对某些移动 App 来说已经基本足够了（如电子书、2D 游戏，商业基本业务线或教育领域的应用）。我早期进行移动开发时的经历，实际上就是使用非常棒的 Corona SDK 模拟器，它提供了极其快的方式，在开发过程中获取 App 粗糙快照，支持多种不同设备的内容自适应：
![](http://developer.telerik.com/wp-content/uploads/2016/07/s_0D72E32655E1D635539B8C6A76329ED1F7B86B6F1EB192AA0B731267F9DCAA8E_1466700748936_corona.gif)

不过，将 App 投入生产环境、装到客户的设备上，模拟器也只能帮你这么多了。

## 选择对的工具

并非所有模拟器生来都一样。每种框架的工程师们都倾向于，要么选择定制最适合的模拟器，要么使用本地仿真器以便可以进行脱机测（off-device testing）。基于 Cordova 的 hybrid 移动 App 跑在 [WebView](http://developer.telerik.com/featured/what-is-a-webview/) 中，它们很适合在自定义模拟器中测试，比如 [Telerik Platform](http://platform.telerik.com/) 中嵌有的基于 Web 的模拟器。这里，App 仅仅是运行在 iframe 中，该 iframe 中注入了 Cordova core 以及一些 mock 的核心插件，以便模拟真实功能。该模拟器甚至还包含模拟硬件工具如设置定位的工具：
![](http://developer.telerik.com/wp-content/uploads/2016/07/platform.jpg)

此外，通过在网页中呈现模拟效果，用户可以使用 Chrome 或者 Safari 等内置的开发者工具，通过控制台检查代码、侦测问题。

![s_0D72E32655E1D635539B8C6A76329ED1F7B86B6F1EB192AA0B731267F9DCAA8E_1466700796818_Screenshot+2016-06-23+12.50.40](http://developer.telerik.com/wp-content/uploads/2016/07/s_0D72E32655E1D635539B8C6A76329ED1F7B86B6F1EB192AA0B731267F9DCAA8E_1466700796818_Screenshot2016-06-2312.50.40.jpg)

其他 hybrid 移动 App 框架也都有类似的可靠的模拟器选项，在小的浏览器窗口中运行。Ionic 和 Telerik AppBuilder（如前文中图片所示）就是很棒的案例。使用 Web 技术构建的移动 App 可能是最容易模拟的。

功能全面的 IDE，同样可能提供内置的模拟器和仿真器，以使移动开发者的工作流程得到舒缓。一个出色的例子是 [Visual Studio 的知名仿真器](https://www.visualstudio.com/en-us/features/msft-android-emulator-vs.aspx)，它同样可以在像 Eclipse 等其他 IDE 中获取。另一个不错的例子是 AppBuilder 的桌面客户端模拟器，它是内置的，并且在保存之后使用 [LiveSync](http://www.telerik.com/blogs/programmatic-access-to-livesync-in-telerik-platform)：

![s_0D72E32655E1D635539B8C6A76329ED1F7B86B6F1EB192AA0B731267F9DCAA8E_1466735379837_Screenshot+2016-06-23+22.29.19](http://developer.telerik.com/wp-content/uploads/2016/07/s_0D72E32655E1D635539B8C6A76329ED1F7B86B6F1EB192AA0B731267F9DCAA8E_1466735379837_Screenshot2016-06-2322.29.19.jpg)

如果是那些并非跑在 WebView 中的非 hybrid 的移动 App 呢？不使用真实设备，开发者如何有效率地模拟 App？

## iOS 花园

开发者们可以使用的新的 “[Javascript Native](http://developer.telerik.com/featured/defining-a-new-breed-of-cross-platform-mobile-apps/)” 工具链、运行时和框架 —— 包括 Titanium、React Native、Fuse 以及 NativeScript —— 已经压缩了开发者对仿真器速度合理预期的边界。这些工具“利用 [JavaScript 虚拟机](http://developer.telerik.com/featured/a-guide-to-javascript-engines-for-idiots/)解释 JavaScript 代码，并且……将代码编译为可以构建 App 用户界面的原生 API”。其所构建的 App 可以在原生仿真器中模拟，并且能够通过如 NativeScript 的 CLI 工具开发，当开发者使用诸如 `tns emulate ios` or `tns livesync ios --watch` 这样的命令构建的时候使用这些原生仿真器。

![s_0D72E32655E1D635539B8C6A76329ED1F7B86B6F1EB192AA0B731267F9DCAA8E_1466705447732_Screenshot+2016-06-21+11.04.57](http://developer.telerik.com/wp-content/uploads/2016/07/s_0D72E32655E1D635539B8C6A76329ED1F7B86B6F1EB192AA0B731267F9DCAA8E_1466705447732_Screenshot2016-06-2111.04.57.jpg)

假如我们使用这些 JavaScript Native 工具开发 App 严重依赖于原生仿真器的话，生活就被这些低水平的（sub-par）原生仿真器严重影响了。对于拥有装着 Xcode 的 Mac 的开发者来说，[Xcode 模拟器](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/iOS_Simulator_Guide/Introduction/Introduction.html)是在开发进程获取 App 准确模样的完全可以接受的、相当快的方式。

Xcode 模拟器是一款 Mac 应用，可以运行为之特别构建的二进制码。可以使用它测试 App 在设备上的[几乎所有](http://www.dummies.com/how-to/content/the-ios-simulators-limitations.html)的预期功能。需要注意，例外的是那些特定硬件的元素无法在 Mac 上测试，比如说 iPhone 的加速度计和 GPS 功能。

> 在核心部分中，当你为 Xcode 模拟器构建应用的时候，Xcode 拿到代码并将其编译，创建一个 .ipa 文件，应用被设定为在 MacOSX 上运行，该文件可以运行在 i386 处理器中，iPhone/iPad/iPod 仿真器全都是 i386。因此，代码运行在为 i386 构建的模拟器上，而不是 [ARM](http://wanderingcoder.net/2010/07/19/ought-arm/)，ARM 是在真机设备上运行所需的。还有一条底线，Xcode 模拟器被设计来运行在 Mac 上像 iPhone 一样工作，但永远没法和 iPhone 真实体验相比。虽然也挺接近了。

## Android 的沼泽

不过对 Android 来说，水可相当脏了。为什么会有这么多不同种类的 Android 仿真器，以至于需要不断重造轮子？和不包含任何模拟 ARM 处理器企图的 Xcode 模拟器不同的是，Android 仿真器走了一条不同的路，它使用了一个听起来略讽刺的名字（但是开源的）“[Quick EMUlator](http://wiki.qemu.org/Main_Page)。

> Android 仿真器基于 QEMU(Quick EMUlator)，QEMU （使用 KVM,一个只在 Linux 可用的基于内核的虚拟机）在你的 x86 处理器的电脑上模拟 AMR 处理器。我当然不需要解释，为何通过软件模拟处理器并不是好主意，如果你想要反应快还可用的话。([来源：http://wiki.qemu.org/Main_Page](http://wiki.qemu.org/Main_Page))

Android 仿真器是慢出了名的。所有 Android 开发者都在观众或者客户面前碰到过这样尴尬的时刻，原生的 Android 仿真器（Android Virtual Device， 简称 AVD）没法启动了，或者简直慢到让人痛苦，等待的过程都能说段单口相声了。所有处理 Android 构建的框架都需要将 Android 仿真器糟糕的性能纳入考虑。

比如说， Xamarin 使用原生的 Xcode 模拟器，也能使用原生的 Android 模拟器，不过会提示它很慢，提供一些加速的小诀窍，并请求用户耐心等待：

>仿真器启动需要一段时间，在它启动完成之前，您可以考虑将它放在一边去做点别的事情。重新部署 App 也不需要关闭仿真器……运行时安装可能需要一段时间，请您耐心等待。

他们还打包了他们自己的 Android 仿真器，叫做 [Xamarin Player](https://developer.xamarin.com/releases/android/android-player/)。

一些 Titanium 开发者写了一篇[很棒的博文](http://www.appcelerator.com/blog/2013/07/speed-up-your-android-emulator/)，讨论如何利用 Intel 的 HAXM （Hardware Accelerated Execution Manager，硬件加速执行管理器）来替代 KVM 进行机器仿真。HAXM 确实让情况好了一点。

不过，一些开发者在 App 测试时已转向完全不同的 Android 仿真器；我个人比较喜欢 [Genymotion](http://www.genymotion.com/)（见下图），它是基于 VirtualBox 仿真器的。

![s_0D72E32655E1D635539B8C6A76329ED1F7B86B6F1EB192AA0B731267F9DCAA8E_1466735856004_Screenshot+2016-06-23+22.37.14](http://developer.telerik.com/wp-content/uploads/2016/07/s_0D72E32655E1D635539B8C6A76329ED1F7B86B6F1EB192AA0B731267F9DCAA8E_1466735856004_Screenshot2016-06-2322.37.14.jpg)

## 仅仅使用仿真器还不够的时候

在某个时间点，通常是 App 开发周期的晚中阶段，放开模拟器、仿真器，将你的 App 装到越多越好的设备上去，这很重要。侧装（side-loading）到 Android 上，使用作为外壳的辅助 App，针对 iPhone 做完整的开发配置或进行私有发布，这些都是合理的测试方法。希望理解仿真器如何工作以及作为移动 App 开发者它们在何处融入你的生活，能帮你缓解等待仿真器启动、部署安装时的痛苦。同时，深呼吸！
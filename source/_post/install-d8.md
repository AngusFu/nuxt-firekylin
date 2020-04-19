---
title: d8 安装手记
tags:
  - 原创
  - V8
date: 2020-04-19
desc: 安装 d8 踩的一些坑
abstract: "安装 d8 踩的一些坑"
---

最近在看极客时间[《图解 Google V8》](<https://time.geekbang.org/column/intro/296>)专栏，其中部分内容用到了 v8 的 debug 版本 `d8` 调试。之前也读过一些介绍 d8 调试的文章。于是有了在自己电脑上安装 d8 的想法。

## 自己动手

首先找到的是权威文档: [Installing V8 on a Mac](<https://gist.github.com/kevincennis/0cd2138c78a07412ef21>)。走到拉取源码这一步时，变遇到了限制，源码库太大，下载太慢。

这促使我想到了一个曲线救国的办法。使用阿里云 ECS，地域选择美国硅谷。并且我选择使用 docker 分阶段构建的方式，第一步编译 d8，第二步复制编译后的文件打入镜像中。

事实证明，源码下载速度上来了（感叹一句，国内程序员太难了）。但监控数据显示，刚创建的 2 核 4 G 的实例，CPU 使用率已飙升到 100%。我暗自庆幸，幸亏没有在自己电脑上编译，否则电脑还不得爆炸吗……

最终，整个编译耗费时间 100 余分钟。

![](https://p5.ssl.qhimg.com/t017441ab6f60c16928.jpg)



## 好用的 jsvu

就在等着编译完成的这段时间里，我还在持续搜索有没有其他更好的办法。难道大家真的要自己去编译吗？没有人提供一个下载即可用的二进制文件吗？

等啊等，找啊找，编译都快完成的时候，我发现了一个工具。这下我几个小时的工作，全白费了。

这个工具就是 GoogleChromeLabs 的 [jsvu](<https://github.com/GoogleChromeLabs/jsvu>)。

jsvu 是一个 JavaScript 引擎版本管理工具。其支持的引擎和操作系统如下 ——

![](https://p3.ssl.qhimg.com/t018daa32a5ac51563d.jpg)

太强了！

jsvu 安装方法如下 ——

1. 全局安装 `jsvu`： `npm install jsvu -g`

2. 将`~/.jsvu`路径添加到系统环境变量中：`export PATH="${HOME}/.jsvu:${PATH}"`

3. 执行 `jsvu` 命令通过命令行交互选择需要安装的 JS 引擎，如下图所示。

   也可以直接通过命令参数指定： `jsvu --os=mac64 --engines=v8-debug`。

   ![](https://s1.ssl.qhres.com/static/d04b435008efe9db.svg)

1. 然后就可以愉快地使用  `v8-debug`命令啦。

   ![](https://s1.ssl.qhres.com/static/06b5fb8d3442eec2.svg)

   当然，如果你更喜欢 `d8`这个简单的命令，也可以执行 `cp ~/.jsvu/v8-debug ~/.jsvu/d8` 将 v8-debug 脚本复制一份。

> 本文中命令行录屏图片是使用  [asciinema](<https://asciinema.org/>)  录制并通过 [svg-term-cli](<https://github.com/marionebl/svg-term-cli>) 转换为 SVG 的。

## 其他

通过 jsvu 我们能够很方便地管理 JS 引擎，也能指定安装特定版本。另外，jsvu 的[文档](<https://github.com/GoogleChromeLabs/jsvu>)中，还说明了 jsvu 如何与``eshost-cli``集成使用，这样我们可以很方便地测试不同 JS 引擎的执行效率差异。


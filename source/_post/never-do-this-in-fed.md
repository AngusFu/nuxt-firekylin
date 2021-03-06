---
title: 前端挖坑不完全指南
desc: 前端挖坑不完全指南
date: 2019-07-16
tags:
  - 原创
  - 前端
---

> 免责声明：请读者提高自身辨识能力，辩证地、批判地阅读。

专业挖坑，包教包会。如有雷同，绝非巧合。

<del>俗话说，前人种树，后人乘凉。聊到种树，第一步可能就是挖坑。</del>今天这篇文章，咱们就聊聊怎么给后人挖坑。

## 充分利用变量

作为专业挖坑的资深码农，你肯定知道[有人](https://quotesondesign.com/phil-karlton/)曾经曰过，计算机科学中只有两大难题，缓存失效和命名。相信你也曾为了一个变量/方法的命名，在各种翻译工具之间上下求索。命名实在是太麻烦，以至于专门有人做了一个[工具](https://unbug.github.io/codelf/)，用大数据解决你的烦恼。

那么，我们的第一招来了。首先，名字一定要含糊，千万别好好说话。组件名可以叫 “myComponent”，搞晕别人。想想他们到处找 “yourComponent” “hisComponent” “herComponent” 的样子，是不是觉得很开心？（还有更多哟，“neComponent” “wuliService” 都行）

其次，方法名一定要有个性，千万不要好好说话。过去式、形容词什么的可以不考虑了，禁用状态就叫 disable，钩子函数可以叫 “beforeXxxAfter”。什么，到底是 before 还是 after？自己想去吧。

## 风格多变，无章可循

相信你也曾经被一些问题困扰。tab 缩进还是空格缩进？缩进两个字符还是四个字符？字符串用单引号还是双引号？语句结尾加不加分号？

EditorConfig 插件是什么？坚决不装。高兴的时候用 tab，不高兴用 space。上午两个空格缩进，下午试试四个空格。

CSS 规则还有顺序？不存在的。想啥写啥，写啥来啥，意识流编程一级棒。

prettier 是什么？eslint 能吃吗？大家代码都一个风格，有意思吗？var、let、const 之间无缝切换，让你找不到规律，做自己的王。

husky 是什么狗？lint-staged 又是什么鬼？凡是阻止我快速 commit 代码的东西，都不是好东西。


## git commit -m 'update'

提交代码时，update/commit 一个单词足够说明问题。你问我每次提交到底都干了些什么？看代码不就得了吗？

万不得已时，记得千万不要用中文描述。为了维护程序员的尊严，强行拼凑几个单词，哪怕读不通也没关系。

你说 CHANGELOG？都是内部项目，要啥自行车？

什么 commitizen、commitlint 啊，名字那么长，谁能记得住？费时费力，追求效率的你，想必不会喜欢。


## 旧代码不要删

旧的功能下线了，代码可别删。某个页面使用新的技术重构了？宁可换个 repo 也得把原来的代码留着。时刻谨记，坑越多越好，老代码、死代码也是坑。

另外，如果你在起始阶段写了一些探索性的 Hello World 代码，请继续留着文件，连 router 中的 `/hello-world`也一并保留。保证作为小白的后人看到，也能快速上手不是？


## 重要文件不要提交

鲁迅（误）曾经说过，有些文件是不能提交到 git 仓库的。

含有敏感信息的`.env` 之类的文件不能提交？连 `.env.example`都别给人留。

记得把构建脚本 bundle.js 添加到`.gitignore`里，但是`package.json` 中的 `"build": "node bundle.js"` 这一行得留着。想想别人寻寻觅觅的样子就好玩。


## 牢记以下工程指标

- 改动一行代码，重新构建五分钟。
- 改动一行代码，生成文件变动数量常年保持在 80+。
- 构建工具多样化：fis、webpack、gulp、rollup、vue-cli 随便用，需要的话可以组成流水线。

## 打一枪，换一个地方

地道战告诉我们，打一枪，换一个地方。一次不够，那就多换几个。写代码的时候也是这样。千万不要拘泥于一套技术栈。

什么，有新需求了？要加个页面？最近正好有个框架比较火，不如咱就用新框架来写？

没有办法在现在的项目中引入新技术？没关系，你还可以自己新建一个 git 仓库。

公共组里申请 git 要走审批太麻烦？没关系，个人账户无限制。

新项目的代码怎么集成到现有项目？没关系，写个脚本自己拷。必要时还可以在现有项目再拿 gulp/webpack 处理一遍。

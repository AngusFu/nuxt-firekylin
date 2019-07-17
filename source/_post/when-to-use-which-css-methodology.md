---
title: "CSS 方法论的选择"
permission: 0
tags:
  - 翻译
  - CSS 
date: 2016-11-30 17:37:52
desc: "CSS 方法论的选择"
author: Samurai
social: http://twitter.com/simurai
from: http://simurai.com/blog/2016/11/27/css-methodologies
---

> 本文转载自：[众成翻译](http://www.zcfy.cc)
> 译者：[文蔺](http://www.zcfy.cc/@wemlin)
> 链接：[http://www.zcfy.cc/article/1828](http://www.zcfy.cc/article/1828)
> 原文：[http://simurai.com/blog/2016/11/27/css-methodologies](http://simurai.com/blog/2016/11/27/css-methodologies)

多年来，CSS 方法论层出不穷。不幸的是，并不存在适用所有场景的最佳选择。本文介绍了一些适用于不同情况的 CSS 方法论。

好，跟我一起开始踩坑之旅吧。

* * *

> 我只需要创建一个**单页面**或**简单的站点**。内容以文本为主，可能会有一两个表单。没有人和我协作，就我自己（还有我家的喵）。

👉 简单就好。直接给 HTML 元素添加样式，连 class 都不需要。[依赖级联关系，利用样式继承](https://www.smashingmagazine.com/2016/11/css-inheritance-cascade-global-scope-new-old-worst-best-friends/)。随着站点增长，可能需要开始看看 [OOCSS](http://oocss.org/)，或不时使用一些工具类。

* * *

> 我们是一个**中型团队**。项目复杂度增长较快，采用多人协作。

👉 使用 [BEM](https://en.bem.info/methodology/quick-start/)、[SUIT](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md)、[SMACSS](https://smacss.com/)、[ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/) 或 [Enduring CSS](http://ecss.io/) 等。它们各不相同，但也有相似点，在某些方面亦有重叠之处。它们所使用的命名约定，能保证你们之间不会发生冲突。和团队一起讨论下，在作出最终决定前，可能需要多进行一些尝试。

* * *

> 我们是有多个团队的大公司，产品**庞大而复杂**。跟踪变化相当困难。代码库不断变化，而我们又不想顾此失彼。

👉 使用 [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html)、[JSS](https://github.com/cssinjs/jss)，或其他类似的 CSS-in-JS 库。将 CSS 与 HTML/JS 绑在一起，更容易修改、移动或删除组件，而又不影响其他部分。还可以看看 [ACSS](https://acss.io/) 这样的 Atomic CSS，这是另一种解决相同问题的思路。

* * *

以上三种情况可能最常见，但也存在更多的具体需求不尽相同的情形：

> 我希望从原型开始工作。

👉 使用“单一用途类”，如 [TACHYONS](http://tachyons.io/) 或 [BASSCSS](http://basscss.com/)。同时编写 HTML 和 CSS，这项工作也可以很自由。不用在文件之间来回切换，不用再为如何编写类名冥思苦想，只要根据所思所想，快速进行构建。

* * *

> 项目中有大量状态、大量需要在运行时更新的内容。

👉 使用 CSS-in-JS 库。可以通过 JS 直接更新属性，无需查找类名或 DOM 节点。

* * *

> 我想发布一个 CSS 框架（啊我也想啊）。

👉 使用带有命名空间的 [BEM](https://en.bem.info/methodology/quick-start/)。如此一来，一定程度的保护作用的同时，尚能进行定制。此外，如果能够轻松定制主题也是极好的，比如提供一些便于修改的变量。

* * *

> 我想制作一个（不可定制的）第三方组件。

👉 使用 [CSS Modules](https://glenmaddern.com/articles/css-modules)。独有的类名，能够防止外部样式污染以及内部样式泄漏。此外，还可以考虑 iframe 或 Web Component。

* * *

> 我想在 [CodePen](https://codepen.io/) 上创建 Demo。

👉 用点新东西。这种时候，正好试试那些还不太熟悉的东西。

* * *

> 我讨厌我的同事。

👉 使用链式选择器，如 `.header > ul.nav li .button {}`。你的同事会因此苦不堪言，而你则可以在一旁暗暗幸灾乐祸。

好了。啊等等... 最后一条不算数哈。关于链式选择器，我能想到的唯一使用场景，就是在无法访问元素的时候。例如，内容由 CMS 决定，无法更改。这种时候，链式选择器应该是最（wei）佳（yi）选择吧。

* * *

如你所见，不同使用场景太多太多。因此，如非知己知彼，争论 CSS 方法论是很难得出结论的。

最后一点想法：不必抱死在一套 CSS 方法论上，还需有所借鉴，并探索出一套适合自己的方法。切换新方法是可能的，有时候则是必须的。例如一个起始于简单原型、团队成员与日俱增、日渐复杂的项目。但切换 CSS 方法论费时费力，容易出错，事先进行一些计划能够减少后期的很多问题。选择愉快!

* * *

> 免责声明：我个人也难以做到绝对中立，不偏不倚。能做到的同学请举手。此外，我使用这些 CSS 方法论的时间并不够长，并不敢宣称了解全部。但我已尽可能保持客观中立了，如果你认为本文错误连篇，或者漏掉了重要内容，请点击[链接](https://github.com/simurai/simurai.github.io/edit/master/_posts/2016-11-27-css-methodologies.md)尽情修改。

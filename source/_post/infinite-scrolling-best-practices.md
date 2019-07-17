---
title: 无限滚动加载最佳实践
date: 2016-06-27
desc: 无限滚动加载最佳实践
author: Nick Babich
social: https://uxplanet.org/@101
permission: 0
from: https://uxplanet.org/infinite-scrolling-best-practices-c7f24c9af1d#.1xzr65wil
tags: 
    - 翻译
    - 用户体验
    - JavaScript
---

无限滚动（Infinite scrolling），有时候被称为无尽滚动（endless scrolling），这种技术允许用户在大量内容上滚动，眼中看不到结束的地方。这种技术很简单，就是页面往下滚动的时候保持刷新。

![无限滚动](https://cdn-images-1.medium.com/max/800/1*PJem14yuB5rvPeq1DvapHQ.png)

这项技术使用户在没有*打断*和*额外交互*的情况下滚动列表 —— 随着用户滚动，一条条的内容就出现了。Facebook 的新闻推送页，Google 的图片搜索，Twitter 的时间线，这些页面都用到了这项技术。虽然听起来还挺有诱惑力的，但[并不是对所有网站或应用都通用的](https://uxplanet.org/ux-infinite-scrolling-vs-pagination-1030d29376f1#.dp7alvl5h)。


### 优秀无限滚动的五项原则

将无限滚动做好，并不是不可能完成的任务。为了完成它，记住并遵守以下方针。

#### 1. 导航条保持可见 

使用无限滚动时候，最好保持导航条*持续可见*，这样可以很快导航到页面或应用的不同区域，对用户来说也更简单。如果找不到导航条，用户将不得不一路向上将页面滚回去。

![Facebook’s 的导航条一直可见](https://cdn-images-1.medium.com/max/800/1*qLgZgBd9EeBGYunXc327Qw.jpeg)

*仅适用移动设备*：因为移动端屏幕要小得多，导航条所占比例可以相对大一些。如果屏幕上是滚动的内容，用户滚动获取新内容的时候，导航条可以隐藏起来；当用户开始往回滚动试图回到顶部的时候再显示出来。

![Facebook 保留一些垂直空间，根据滚动方向隐藏导航条。Image credit: lmjabreu](https://cdn-images-1.medium.com/max/800/1*cpUZxy8JkmTwc0KSmGz5lw.gif)

#### 2. 如果有页脚，加上“加载更多”按钮

无限滚动*阻碍用户的访问页脚*。实际上，这也是无限滚动设计的主要挑战之一：用户到达列表底部的时候，内容在不断地加载进来，用户会有一两秒时间看到页脚，直到下一组结果加载成功并将页脚挤出视图之外。这阻止用户接触到页脚。

拿 Bing 图片举例子。页脚包含“了解更多”、“帮助”等链接，但用户没办法真正点到任何一个，直到过一会儿，页面停止无限滚动。

![Image credit: Bing Images](https://cdn-images-1.medium.com/max/800/1*nIudn7OyCs4G0NdlXWhPcw.jpeg)

如果你的网站或应用有页脚，且它对你（或者，更要紧的，对你的用户）*很重要*，那就应该用“加载更多”的方法。新内容不会自动加载，直到用户点击了“加载更多”的按钮。这构成了一个很简单的交互界面，也使得按需加载额外内容的认知负荷可能是最小。

Instagram 使用“加载”更多按钮以便页脚简单可及，并且不会强制用户再三点击“加载更多”。

![Instagram 使用的一个“加载更多结果”按钮, 保证页脚可及的同时提供无限滚动的许多好处](https://cdn-images-1.medium.com/max/800/1*L1_uAf34Fdg-aq3g3HyVsw.png)

#### 3. 返回按钮将用户待回至之前的位置

有时候，无限滚动的实现带来一个主要的可用性缺陷：*滚动位置并未被记录为“状态”*。如果用户从列表中的链接跳转了，然后点返回按钮，他们希望能回到页面原来相同的位置。但是列表的位置不再存在了，这意味着使用浏览器的返回按钮一般都导致滚动位置重置到页面顶部。无怪乎用户很快就觉得沮丧，都没有一个合适的“回到列表”的功能。

![Back button in Safari](https://cdn-images-1.medium.com/max/800/1*jGh6Bvt7WlarQcxLH8B2XQ.png)

别让你的用户就因为使用*返回*按钮，找不到列表的位置。很重要的是，用户通过列表访问了某一个项目的详情页，他们点击浏览器返回按钮返回列表的时候，也应该在相同的位置。

Flickr 监听用户点击浏览器后退按钮的行为，满足用户的期望。APP 记住用户的滚动位置，所以当用户按后退按钮的时候，返回到原始位置。

![Image credit: Flickr](https://cdn-images-1.medium.com/max/800/1*-F5J91EOWn31ktMK_8b1og.jpeg)


#### 4. 提供为特定项添加书签的可能

无限滚动最常见的缺点之一就是，*内容出现的时候，没法添加书签*。喜爱内容的简单的书签（或者
“保存稍后再看”），作为未来的参照，对用户来说是很有用的工具。当网站或应用提供书签功能的时候，用户会使用的。比方说，Pinterest，使用书签工具帮助用户保存创意。

![Pinterest 用户可以标记或分析列表中的项目](https://cdn-images-1.medium.com/max/800/1*X30RVIXKY7m6fOqVJNgRMw.jpeg)


#### 5. 加载新内容时提供视觉反馈

当内容在加载的时候，用户需要明确的*指示*，说明正在进行中。使用[进度指示（process indicator）](https://uxplanet.org/progress-indicators-in-mobile-ux-design-a141e22f3ea0#.ql2tx2vc7)让用户知道，新内容正在加载，很快就会在页面上显示。

因为加载新内容是一个很快的动作（不会超过 2-10 秒钟），你可以使用*循环动画*来提供反馈，表明系统正在工作。

![微妙的动画(如Tumblr的加载指标)告诉用户“我为你加载更多的内容”](https://cdn-images-1.medium.com/max/800/1*GA51775yPy24NW5SXX12cA.jpeg)

也可以有助于为用户添加额外的清晰,包括文本解释了为什么用户等待(例如“加载评论…”)。
为用户添加*额外声明*，提供说明*为何*用户在等待的文本（如“正在加载评论”），也是很有用的。

![纺车动画](https://cdn-images-1.medium.com/max/800/1*KjDWVrNwgKdHHxIr84aitw.gif)

### 结论

无限滚动实现得好的话，可以达到令人难以置信的光滑无缝体验。很好的是，关于好的无限滚动，你已经获得一些线索了，这会帮你建立完美的用户体验。

谢谢！
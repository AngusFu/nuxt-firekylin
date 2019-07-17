---
title: 关于时序攻击
desc: '关于时序攻击，Timing-atack'
date: 2017-01-16
tags:
  - 原创
  - 笔记
  - 安全
---

前些日子，奇舞周刊公众号推送了一篇文章，[《Node.js 面试问题及答案(2017 版)》](http://www.zcfy.cc/article/node-js-interview-questions-and-answers-2017-edition-risingstack-2251.html)。其中有一个问题很有意思，请看下面这段代码，有什么问题吗？

```javascript
function checkApiKey (apiKeyFromDb, apiKeyReceived) {  
  if (apiKeyFromDb === apiKeyReceived) {
    return true
  }
  return false
}

```

可能很多人和我一样，一脸茫然。嗯哼？哪里错了？这不是挺好的嘛。

来看人家怎么说的，好像很有道理的样子：

![](https://p3.ssl.qhimg.com/t01b15077d6896b53c2.png)


嗯，这就是时序攻击（[Timing Atack](https://en.wikipedia.org/wiki/Timing_attack)），旁路攻击（[Side-channel attack](https://en.wikipedia.org/wiki/Side-channel_attack)）的一种。

恰巧今天刚刚看到一个 [slide](https://dev.opera.com/blog/timing-attacks/)，讲的也是这方面的内容。看来性能优化有时候也有负面作用。

文中给出的几个链接，基本上已经能说明所有问题了。

## Reference

- [Node.js 面试问题及答案(2017 版)](http://www.zcfy.cc/article/node-js-interview-questions-and-answers-2017-edition-risingstack-2251.html)

- [Timing Atack](https://en.wikipedia.org/wiki/Timing_attack)

- [Side-channel attack](https://en.wikipedia.org/wiki/Side-channel_attack)

- [Front-End Performance: The Dark Side](https://dev.opera.com/blog/timing-attacks/)


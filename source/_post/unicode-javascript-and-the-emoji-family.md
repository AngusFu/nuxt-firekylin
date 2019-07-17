---
title: "Emoji.prototype.length  —— Unicode 字符那些事儿"
date: 2017-04-27
desc: "Emoji.prototype.length  —— Unicode 字符那些事儿"
author: "@Stefan Judis"
social: https://www.contentful.com/blog/2016/12/06/unicode-javascript-and-the-emoji-family/
permission: 0
from: https://www.contentful.com/blog/2016/12/06/unicode-javascript-and-the-emoji-family/
tags: 
    - 翻译
    - Unicode
    - Emoji
    - JavaScript
---

> 译者注：本文用到了很多 emoji 符号，建议不要使用 Windows 系统阅读本文。

![](http://p0.qhimg.com/t01e96506ccc41c314a.png)

如今 emoji 已经成为文字交流的重要基础。离开这些精巧的符号，只怕很多对话早就因尴尬和误解而草草收场了。还记得当年短信风行时的那些事吗？

没有笑脸表情的文字聊天过程中，常常会得到“你不是在开玩笑吧？”这样的回复，以免将一些无聊的笑话信以为真。后来并没有花多久的时间，大家都明白了，单纯靠文字来理解那些幽默与调戏并不那么容易（但不管怎么说，这种套路确实应该少一些）。世界上首个 emoji 诞生之后不久，emoji 很快成为文字交流中不可或缺的要素。

日用之而不觉，我从未思考过 emoji 在技术层面上是如何工作的。但无论如何，它们肯定和 Unicode 有关系，尽管我确实不了解实际机制。老实说，我倒也没怎么在意……

读了 [Wes Bos 的一条推文](https://twitter.com/wesbos/status/769229581509332992)之后，我的想法被彻底改变。Wes Bos 在这条推文中分享了一些 JavaScript 字符串操作，其中也包括表示家庭的 family emoji。

```javascript
[...'👨‍👩‍👦']   // ["👨", "‍", "👩", "‍", "👦"]
'👨‍👩‍👦'.length // 8
```

OK, 对字符串使用[展开运算操作](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator)倒没什么稀奇的，可是一个符号拆分出了三个符号外加两个空字符，我颇有些疑惑。接着看到该符号的 `length`（长度） 竟然是 8，愈加困惑，展开数组中明明就只有五项啊。

当即测试这段代码，丝毫不爽，果然如 Wes 所述。什么鬼？不深入了解 Unicode、JavaScript 和 emoji，就难解我心头之惑。

## Unicode 简介

JavaScript 为什么会如此处理 emoji 呢？欲要理解个中原理，还需深入去看 Unicode 本身。

Unicode 是国际计算机工业标准。它是一个字母（或字符、符号）对应一个数值的映射集。如果没有 Unicode，像那些含有像德文字母 ß、ä、ö 这样的特殊字符的文档，就无法在其他不使用这类字符的系统上共享。感谢 Unicode 的跨平台、跨系统编码。

Unicode 中共有 1,114,112 个不同的码点（code point），它们通常使用 `U+` 加上一个十六进制数字表示。Unicode 码点取值范围是 `U+0000` 到 `U+10FFFF`。

这些码点总数超过十亿，它们被分为 17 个“平面”（plane）。每个平面包含六万五千多个码点。其中，最重要的平面是“多语言基本平面”（Basic Multilingual Plane，BMP），范围是 `U+0000` 至 `U+FFFF`。

BMP 基本平面几乎包含了所有现代语言中使用到的字符，以及很多其他符号。其余 16 个平面称作“补充平面”（Supplementary Planes），其中包含一些不同的案例，比如——聪明如你，可能已经猜到了——大多数 emoji 符号的定义。

## emoji 是如何定义的

我们今天所知的 emoji 至少由一个 Unicode 码点所定义。可以看下 [Full Emoji Data list](http://unicode.org/emoji/charts/full-emoji-list.html)，其中列出了所有定义的 emoji。你可能会问，Unicode 目前到底定义了多少不同的 emoji 呢？答案是“视情况而定”，这可是计算机科学中常见的答案。要回答这个问题，首先需要理解 Unicode。

如前面所述，emoji **至少**由一个码点定义。这也就意味着，还有一些 emoji 是由几种不同的 emoji 和码点组合而成的。这些组合称作序列（sequence）。有了序列，就可以做一些别的事，比方说，修饰那些中性 emoji （通常用黄色皮肤展示），让它们符合你的风格。

### 修饰序列

犹记得当初在聊天中发现可以按自己的肤色修饰“点赞”表情的时候，我感受到了一种包容，这个表情与我之间的联系似乎变得更加紧密了。

Unicode 中有五种修饰符，用于修饰与人相关的中性 emoji。不同的修饰符会产生不同肤色效果。修饰符基于 [Fitzpatrick 量表](https://en.wikipedia.org/wiki/Fitzpatrick_scale) 设定，其编码范围为`U+1F3FB`~`U+1F3FF`。

下面是使用修饰符修改 emoji 肤色的示例：

```javascript
// U+1F467 + U+1F3FD
👧 + 🏽
> 👧🏽
```

在那些支持修饰序列的操作系统中，为码点值为 `U+1F467` 的小女孩 emoji 添加修饰符之后，就能得一个肤色发生变化的小女孩表情。

### 零宽连接序列

与人相关的，可不止肤色这一种。再看看前面提到的家庭 emoji，显然并非所有家庭都是由爸爸、妈妈、儿子三者组成的。

Unicode 中包括一个中性的表示家庭的码点（`U+1F46A`- ‍👪），但这并非家庭真实写照。不过，还可以使用“零宽连接符”序列（Zero-Width-Joiner sequence）创建一些不同的家庭符号。

先来谈谈工作原理：Unicode 中有一个称为零宽连接符（`U+200D`）的码点。它就像胶水一样，将两个码点粘在一起以单个符号的形式展现。

想想要组成一个家庭的话，需要将哪些符号连在一起呢？很简单，两个大人，一个孩子。使用零宽连接符很容易就能拼出各种各样的家庭符号。

```javascript
// 中性家庭
// U+1F46A
> 👪

// 零宽连接序列: 家庭 (男人, 女人, 男孩)
// U+1F468 + U+200D + U+1F469 + U+200D + U+1F466
// 👨‍ + U+200D + 👩‍ + U+200D + 👦
> ‍👨‍👩‍👦

// 零宽连接序列: 家庭 (女人, 女人, 女孩)
// U+1F469 + U+200D + U+1F469 + U+200D + U+1F467
// 👩‍ + U+200D + 👩‍ U+200D + 👧
> ‍👩‍👩‍👧

// 零宽连接序列: 家庭 (女人, 女人, 女孩, 女孩)
// U+1F469 + U+200D + U+1F469 + U+200D + U+1F467 + U+200D + U+1F467
// 👩‍ + U+200D + 👩‍ + U+200D + 👧‍ + U+200D + 👧
> ‍👩‍👩‍👧‍👧
```

可以查看[全部的零宽连接序列](http://unicode.org/emoji/charts/emoji-zwj-sequences.html)，其中的类型更加多种多样，比如，带着两个女孩的父亲。不幸的是，在本文写作的时候，这些序列的支持度并不是很好。好在零宽连接序列还能优雅降级，单个码点分别独立显示。这有助于保持特殊组合符号的语义。

```javascript
// 零宽连接序列: 家庭 (男人, 女孩, 女孩)
// U+1F468 + U+200D + U+1F467 + U+200D + U+1F467
// 👨‍ + U+200D + 👧 + U+200D + 👧
> ‍👨‍👧‍👧  -> 尚不支持的情况下以这种形式显示
```

还有很棒的一点是，上面这些原则并不是仅仅针对家庭 emoji 的。来看看著名的 David Bowie emoji（该 emoji 的真名应该是“男歌手”）。这个表情实际上也是一个零宽连接序列，由一个男士（`U+1F468`）、一个零宽连接符和一个耳机（`U+1F3A4`）组成。

![Davide Bowie Emoji](http://p0.qhimg.com/t01a092336bcaba6240.png)

可能你已经猜到了，将男人(`U+1F468`)替换成女人(`U+1F469`)，结果就是一个女歌手（女版 David Bowie）。若再引入可以修改肤色的修饰符，还可能出现一个黑人女歌手。棒棒哒！

```javascript
// 零宽连接序列: 女歌手
// U+1F469 + U+1F3FF + U+200D + U+1F3A4
// 👩 + 🏿 + U+200D + 🎤
> 👩🏿🎤 -> 尚不支持的情况下以这种形式显示
```

然而，依然不幸，目前这种序列的支持程度也并不是很好。

### emoji 数量

回答 emoji 到底有多少种，得看怎么算了。是可用于展示 emoji 的不同码点的数量吗？需要计算可以展示的各种不同的 emoji 变体吗？

如果计算可展示的不同 emoji（包括所有序列、变体），总数是 2198。如果你对计算感兴趣，可以看下 [unicode.org](http://unicode.org/) 上的[完整章节](http://www.unicode.org/reports/tr51/index.html#Identification)。

除了“如何计算”这个问题之外，还有一个现实问题：新的 emoji 和 Unicode 字符在不断加入规范，想要记录准确的总数还是挺困难的。

### JavaScript 字符串与 16 位代码单元

JavaScript 字符串的格式是 UTF-16，使用一个 16 位的代码单元表示最常见的字符。掐指一算，这意味着一个代码单元能放下六万五千多个码点（译者注：`2^16=65536`），几乎和 BMP 一一对应。下面使用 BMP 中的一些符号试试看：

```javascript
'ﾂ'.length  // 1 -> U+FF82
'⛷'.length // 1 -> U+26F7
'☃'.length // 1 -> U+9731
```

不出所料，这些字符的 `length` 值正好是 1。可是，如果要用到的字符不在 BMP 范围内呢？

### 代理对

还可以将两个 BMP 码点结合在一起，形成一个新的码点，这就是代理对（surrogate pair）。

`U+D800` 到 `U+DBFF` 之间的保留码点用于所谓的高级代理（又作 leading surrogates，主代理），`U+DC00` 到 `U+DFFF` 之间的保留码点则用于低级代理（又作 trailing surrogates，尾代理）。

这两类码点总是同时成对出现，高级代理后面跟着低级代理。然后通过特定算法对超出范围的码点进行解码。

一起来看下面的例子：

```javascript
'👨'.length          // 2
'👨'.charCodeAt(0)   // 55357  -> U+D83D // 返回主代理的码点
'👨'.charCodeAt(1)   // 56424  -> U+DC68 // (译者注：这个是尾代理码点)
'👨'.codePointAt(0)  // 128104 -> U+1F468 // 返回组合在一起的代理的码点
'👨'.codePointAt(1)  // 56424  -> U+DC68
```

中性的男性 emoji 的码点是 `U+1F468`，在 JavaScript 中无法通过单个代码单元来表示。这就是为何需要使用代理对的原因，通过两个单独的代码单元组成这个表情。

分析 JavaScript 中的代码单元，有两种可能有用的方法。一个是 [`charCodeAt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)，遇上代理对的时候，该方法会分别返回每个代理的码点。另一个方法是 [`codePointAt`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt)，遇上主代理时会返回代理对组合的码点，遇上尾代理时则返回尾代理的码点。

看起来有点恐怖？深有同感。强烈建议仔细 MDN 上的相关文章。

再从数学方面深入看一下这个代表男性的 emoji。通过 `charCodeAt` 方法，我们可以检索到组成代理对的独立代码单元。

我们得到的第一个值是 `55357`，也就是十六进制的 `D83D`，这个是高级代理。得到的第二个值是 `56424`，即十六进制的 `DC68`，这是低级代理。这两个典型的代理对经过运算后便得到了 `128104`，映射到 emoji 就是男性符号。

```javascript
// 十六进制
0x1F468 = (0xD83D - 0xD800) * 0x400 + 0xDC68 - 0xDC00 + 0x10000
// 十进制
128104 = (55357 - 55296) * 1024 + 56424 - 56320 + 65536
```

### JavaScript 中的 `length` 属性与码点数量

学习了码点的相关知识，现在可以理解这让人困惑的 `length` 属性了。它会返回的是码点的数量，而非一开始所认为的肉眼所见符号的数量。在处理 JavaScript 字符串的时候，这让寻找 bug 变得相当麻烦。所以处理 BMP 平面之外的符号时千万要当心。

## 小结

再回到 Wes 最初的例子。

```javascript
// 零宽连接序列: family (man, woman, boy)
// U+1F468 + U+200D + U+1F469 + U+200D + U+1F466
[...'👨‍👩‍👦']   // ["👨", "‍", "👩", "‍", "👦"]
'👨‍👩‍👦'.length // 8

// neutral family
// U+1F46A
[...'👪']   // ['👪']
'👪'.length // 2
```

我们在这里看到的家庭 emoji 由一个男性、一个女性、一个男孩组成。展开运算符会检查所有码点。我们所看到的空字符并非真正的空字符，而是零宽连接符。读取该 emoji 的 `length` 属性会得到 8，其中每个 emoji 的 `length` 为 2，每个零宽连接符的 `length` 为 1，合起来正好是 8。

我真心享受深挖 Unicode 的过程。如果你同样对这个话题感兴趣，必须向你推荐 [@fakeunicode](https://twitter.com/FakeUnicode) 这个 Twitter 账号。你知道吗，甚至还有关于 emoji 的 [podcast](http://podcast.emojiwrap.com/)  和[会议](http://2016.emojicon.co/) 呢。我会保持关注的，了解这些每天都在使用的小符号真是有趣极了，你可能也会感兴趣的。

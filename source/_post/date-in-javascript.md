---
title: 聊聊 JavaScript Date 对象
tags:
  - 原创
  - JavaScript
date: 2016-08-31 12:05:45
desc: 闲谈 JavaScript 日期
---

## 时间的发现

日常生活中，各种形式的时间字符到处都是。

时间观念的产生，时间单位、计时工具的发明，给人类带来的变化实在一言难尽。

今天就来谈谈日期那些事儿。一起来看看 JavaScript 中的日期对象 Date。

## Date 对象

和其他对象如 Math、RegExp 等一样，Date 对象是 JavaScript 语言中的内建（build-in）对象。在工作中，Date 对象有着许多重要的应用。

创建一个 Date 实例很简单，下面简单回顾下常用的方法。

**获取当前时间**

```javascript
var now = new Date();
```

注意，JavaScript 中的当前时间与操作系统相关。因此，在重要的 Web 应用中，应该会避免使用该时间，更可靠的方式是操作前先请求服务器获取时间，或者将工作直接交给服务端。

**生成时间**

```javascript
// 2016-08-31 23:27:22
new Date(2016, 7, 31, 23, 27, 22);
new Date('2016-08-31 23:27:22');
new Date('2016/08/31 23:27:22');
```
上面只是最常见的几种形式。实际应用中会发现，Date 对象非常强大，能够解析多种格式的字符串。本文暂且略过不表。

值得一提的是，上面 `new Date('2016-08-31')` 这种形式应当尽量避免。如果没有记错，iOS 系统环境中，这种格式会报错，遇到该格式的字符串时，应该一律先进行替换操作：

```javascript
var string = '2016-08-31';
var date = new Date(string.replace(/-/g, '/'));
```

**获取或修改更多时间细节**

Date 对象提供了一系列 `set` `get` 方法供我们使用。方法名也很语义化。在此略过。


## 眼花缭乱的时间字符串

在工作中，常常会接触各种不同格式的时间字符串。除了那些格式整齐，地球人几乎都能读懂的之外，还有一些不那么为普通人所了解的格式。

与此同时，细心的同学可能注意到，在控制台中输入一个 Date 变量的引用，按下 `.` 的那一刻，会有一大堆属性、方法提示。除去 `set` `get` 这一类方法之外，还有一堆 `to***String` 形式的方法。相信多数同学用得不多。

往前数月，我也不太关注这些东西。但后来某次，后端返回的数据总是随机地有一些数据是 `2016-08-31T15:44:30.244Z` 这种格式的。当时不明白其含义，只能自作聪明地拿正则表达式来匹配，作为容错方案。

接下来，自己的一个小爬虫工具想要支持 rss 解析。拿到的不少日期数据是 `Thu Aug 25 2016 01:31:50 GMT+0800 (CST)` 这种格式的。

由此我开始试着去了解这些看上去奇奇怪怪的日期格式。

接下来，主要通过 JavaScript 中的 `to***String` 系列方法，了解这些时间字符串。


## 一堆 `to***String` 方法

首先，让我们写个简单的脚本，看看 Date 对象到底有哪些 `to***String` 方法。

注意，这些方法是无法通过 `for in` 循环取到的，也就是说，默认是 `enumerable: false`。

使用 `Object.getOwnPropertyDescriptor` 方法可以查看这些细节。

以 `toString` 为例，一起看下：

```javascript
Object.getOwnPropertyDescriptor(Date.prototype, 'toString');
```

结果如下：

```javascript
{
    writable: true,
    enumerable: false,
    configurable: true,
    value: function toString(),
    __proto__: Object
}
```

既然不能通过 `for in` 遍历，那还有没有其他办法呢？

有的。`Object.getOwnPropertyNames` 这个方法可以帮我们拿到对象自身属性的 key 值。

（写到这里，虽然看上去很啰嗦，但我总觉得有必要把细节记下来。万一下次又记不清了呢。）

接着，就可以愉快地取到所有的 `to***String` 方法名了。

```javascript
let proto = Date.prototype;
let names = Object.getOwnPropertyNames(proto).filter((name) => /^to[a-zA-Z]*String/.test(name));
console.log(names);
```

一共有 9 个，如下：

```json
[ "toString",
  "toDateString",
  "toTimeString",
  "toISOString",
  "toUTCString",
  "toGMTString",
  "toLocaleString",
  "toLocaleDateString",
  "toLocaleTimeString"
]
```

看名称大概也能知道，这 9 个方法可以分为三组。下面按组来细看。

## toString 系列

接下来，我们所有的实验，统一使用一个 Date 实例。需要说明的，我所使用的是 Chrome 52，所有实验都是在控制台中进行的。

```javascript
// 2016-09-02 10:49:22
var date = new Date(2016, 8, 2, 10, 49, 22);
```

一并展示出所有结果吧，就是这么简单粗暴。

![toString](http://p6.qhimg.com/t01788a97c49c40d8e7.png)

注意到，`date + ''` 和 `date.toString()` 的结果是一样的。这不是偶然，它们实际上是等价的。这涉及到 JavaScript 中的**隐式类型转换**。

根据 ECMA-262 标准，`toString()` `toDateString()` `toTimeString()` 执行的结果，是实现相关的（implementation-dependent）。

以 `toDateString()` 为例，看看标准中的是如何说的：

> 该方法返回一个 String 类型的值。该值是实现相关的，但其目的是以一种简便、便于阅读的形式，展示 Date 实例在当前时区内的“日期”部分。
> —— [ECMA-262 7ᵗʰ Edition ](http://www.ecma-international.org/ecma-262/7.0/index.html#sec-todatestring)

再来看看结果中的 `GMT+0800` 是什么鬼。所谓 `GMT`，是英文 “Greenwich Mean Time” 的缩写，完整翻译过来就是“格林尼治平时”，也就是通常所说的“格林尼治时间”，即位于英国伦敦郊区的皇家格林尼治天文台的标准时间。详细信息可以查看[维基百科](https://en.wikipedia.org/wiki/Greenwich_Mean_Time)。

至于“+0800”，则是[**时区**](https://zh.wikipedia.org/wiki/%E6%97%B6%E5%8C%BA)的概念了。这意味着，当前时间与标准时区相差 8 小时。

比如，此刻是北京时间 2016 年 9 月 2 日 13:07:22，也就是 `Fri Sep 02 2016 13:07:22 GMT+0800`，那么此时，格林尼治时区的时间就应该是 05:07:22。不过，从[世界时钟](http://www.timeanddate.com/time/zones/bst)中此时英国伦敦的时间是 06:07:22。为何会有此差别？因为 9 月 2 号的时候，伦敦使用的是 BST 时区，即 British Summer Time，也就是众所周知的“夏令时”。

![时区图](http://p6.qhimg.com/t01a2428498bf539feb.png)

像 BST、CST 这些标志，就像上面表格中的“中国标准时间”一样。这些是用来说明时区的，通常用缩写表示，不过这[并不是标准](https://zh.wikipedia.org/wiki/%E6%97%B6%E5%8C%BA)。CST 正好就是中国标准时间（China Standar Time）的缩写，可以参考 [timeanddate](http://www.timeanddate.com/time/zones/cst-china) 这个网站。

不过，上面仅仅是提到格林尼治时间。并不意味着真正用到了它。JavaScript 中实际使用到的，还是 UTC 时间。

## toLocaleString 系列

执行结果如下图所示：

![toLocaleString 系列](http://p9.qhimg.com/t01b54c2a69220c814e.png)

也很好理解。这三个方法，也是和实现相关的。[标准]中有一句很关键，“与宿主环境当前区域设置的约定保持一致”（"corresponds to the conventions of the host environment's current locale."）。

## 标准时间系列

接着看 `toISOString()` `toUTCString()` `toGMTString()` 三个方法。按照惯例，先看结果：

![toISOString() 与 toUTCString()、toGMTString()](http://p4.qhimg.com/t017844b50bac5b0ca6.png)

这些年，想必各种商业广告已经帮我们普及了 ISO 的概念，八九岁的时候就知道，某某品牌的摩托车号称通过 ISO-2001 标准。ISO，全称是国际标准化组织（International Organization for Standardization），负责制定全世界工商业国际标准的国际标准。

[JavaScript 标准](http://www.ecma-international.org/ecma-262/7.0/index.html#sec-date-time-string-format)定义的时间交换格式（interchange format），是基于 ISO 8601 扩展格式的简化版本，格式是 “YYYY-MM-DDTHH:mm:ss.sssZ”。`toISOString()` 返回的就是这样的字符串。

`T` 只是一个字面量，标志着接下来的内容是时间（相对于前面的日期而言）。

`Z` 标志着时差。直接使用 `Z`，意味着我们使用的是标准时间（UTC）。

在我们的例子中，`date.toISOString()` 的结果是 `2016-09-02T02:49:22.000Z`，可以看到，和我们的实际时间 10:49:22 相差了 8 小时。

当然，`Z` 的位置上，还可以使用`+HH:mm` `-HH:mm` 的形式。这样就是直接指定与标准时间的时差了。

例如，`2016-09-02T02:49:22.000Z` 作为标准时间，相当于北京时间的 10:49:22，换一种形式就是 `2016-09-02T10:49:22.000+08:00`。 

UTC 是“世界标准时间”的简称，又作“协调世界时” “世界协调时间”，英文是 Coordinated Universal Time。下面引用下[维基百科](https://zh.wikipedia.org/wiki/%E5%8D%8F%E8%B0%83%E4%B8%96%E7%95%8C%E6%97%B6)中的说明：

> 协调世界时是世界上调节时钟和时间的主要时间标准，它与0度经线的平太阳时相差不超过1秒，并不遵守夏令时。协调世界时是最接近格林尼治标准时间(GMT)的几个替代时间系统之一……
>  UTC基于国际原子时，并通过不规则的加入闰秒来抵消地球自转变慢的影响。

我们注意到，`toUTCString()` `toGMTString()` 两者返回的字符串是一样的。实际上，这还是和具体实现有关。

还是引用[维基百科](https://zh.wikipedia.org/wiki/%E6%A0%BC%E6%9E%97%E5%B0%BC%E6%B2%BB%E5%B9%B3%E6%97%B6)中的一段，来看看 UTC 时间和格林尼治时间的不同。

> 理论上来说，格林尼治标准时间的正午是指当太阳横穿格林尼治子午线时（也就是在格林尼治上空最高点时）的时间。由于地球在它的椭圆轨道里的运动速度不均匀，这个时刻可能与实际的太阳时有误差，最大误差达16分钟。
> 由于地球每天的自转是有些不规则的，而且正在缓慢减速，因此格林尼治时间已经不再被作为标准时间使用。现在的标准时间，是由原子钟报时的协调世界时（UTC）。

[ES 2016](http://www.ecma-international.org/ecma-262/7.0/index.html#sec-date-constructor) 中提到，`toGMTString()` 主要是用来满足旧代码兼容性的，新代码中推荐使用 `toUTCString()`。标准还提到这么一句：

> The function object that is the initial value of  Date.prototype.toGMTString is the same function object that is the initial value of  Date.prototype.toUTCString.

也就是说，在 JavaScript 中，`toUTCString()` `toGMTString()` 这俩是一样的。

```javascript
assertEqual(date.toGMTString, date,toUTCString);
```

## 日期提取工具

从字符串中提取时间，已经有很多工具，还相当智能，英文不必说，中文的“前天”“五天前”“上周三”之类的不在话下。

临时应急，也仅仅是为了辨别一些常用的日期字符串，我也写了一个小工具，主要是提取日期。

关键的正则表达式如下：

```javascript
// 2012 年 2 月 28 日
re_zh  = /(\d{4})\s*[^x00-xff]\s*(\d{1,2})\s*[^x00-xff]\s*(\d{1,2})\s*[^x00-xff]/,

// 2012-02-28, 2012.02.28, 2012/02/28
re_ymd = /\d{4}([\/\-\.])\d{1,2}(\1)\d{1,2}/,

// 02/28/2012 etc.
re_mdy = /\d{1,2}([\/\-\.])\d{1,2}(\1)\d{4}/,

re_en  = new RegExp([
    // toUTCString(): "Tue, 30 Aug 2016 03:01:19 GMT"
    /(\w{3}), (\d{2}) (\w{3}) (\d{4}) ((\d{2}):(\d{2}):(\d{2})) GMT/.source,

    // toString():  "Tue Aug 30 2016 11:02:45 GMT+0800 (中国标准时间)"
    /(\w{3}) (\w{3}) (\d{2}) (\d{4}) ((\d{2}):(\d{2}):(\d{2})) GMT\+\d{4}/.source,

    // toISOString(): "2016-08-30T03:01:19.543Z"
    /(\d{4})-(\d{2})-(\d{2})T((\d{2}):(\d{2}):(\d{2}))\.(\d{3})Z/.source,
    
    // toDateString(): "Tue Aug 30 2016"
    /(\w{3}) (\w{3}) (\d{2}) (\d{4})/.source
].join('|'), 'm');

```

详细代码，可见 [Github](https://github.com/AngusFu/date-parser)。之后有时间，也会考虑加入更智能的识别功能。


## 参考

- [http://www.timeanddate.com/](http://www.timeanddate.com/)
- [wikipedia](https://zh.wikipedia.org)
- [ECMAScript® 2016 Language Specification](http://www.ecma-international.org/ecma-262/7.0/index.html)
- [http://wwp.greenwichmeantime.com/](http://wwp.greenwichmeantime.com/)
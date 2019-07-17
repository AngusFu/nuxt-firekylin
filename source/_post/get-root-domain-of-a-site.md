---
title: 笔记：如何获取网站根域名
desc: 笔记：如何获取网站根域名
date: 2017-04-26
tags:
  - JavaScript
  - 开发心得
  - 原创
---

首先声明，这里所说的“根域名”，并不是指“全球共有13台根逻辑域名服务器”这句话中的“根域名”。而是指某一个站点的“根域名”（更新：或者也可以称之为“当前网站的主域名”，目前笔者并没有找到标准称呼）。

百度搜索是“www.baidu.com”，百度翻译的域名是“fanyi.baidu.com”，百度地图的域名则是“map.baidu.com”。这些域名有共同的部分“baidu.com”。在本文中，我们将“baidu.com”这样的域名称为“根域名”。前端同学应该都知道，在“.baidu.com”这一域下的 cookie 可以在其他子站点下拿到（当然，前提是端口号和协议都保持一致）。

最近开发的过程中遇上了一个小问题。无论访问哪个子站点，都要通过 js 将 cookie 存放到根域名下。

一开始比较大意，直接拿正则匹配。问题是忽略了这世界上还存在“www.xxx.edu.cn”这样的站点。在这种情况下，显然我们不能认为”edu.cn“是根域名。想在一个叫“edu.cn”的域下存 cookie？对不起，浏览器做不到。（这句话很重要。）

正则匹配是做不到了。搜索了一下，网上也没有什么特别好的解决方案。无非是枚举出国内常见的一些顶级域名，然后再进行处理，如下面这个 PHP 的例子：

![](https://ww2.sinaimg.cn/large/006tNbRwly1ff0e6map85j31000nuq53.jpg)

但如何确保我们枚举出的例子一定是完全的无遗漏的呢？不完美，放弃。

## PSL

接着上 github 上去找例子。倒是发现了一些解决域名的工具。比如一个名为 [psl](https://github.com/wrangr/psl) 的仓库。

[PSL](http://publicsuffix.org/) 是 “Public Suffix List” 的缩写，这个“公共域名后缀列表”项目本来是供浏览器厂商使用的。可以访问[官网](https://publicsuffix.org/)，另外建议看看这篇[《域名小知识：Public Suffix List》](https://imququ.com/post/domain-public-suffix-list.html)。

![](https://ww1.sinaimg.cn/large/006tNbRwly1ff0ei3m2wlj31f80ey0us.jpg)

我搜索到的这个 psl 仓库正是基于 PSL、使用 js 来解析域名的。粗略看了下，存放域名的 json 文件有 108 KB。吓死了。

![](https://ww3.sinaimg.cn/large/006tNbRwly1ff0eipy8z6j31ku0i4abp.jpg)

另一款叫做 [parse-domain](https://github.com/peerigon/parse-domain/) 的，光是生成的正则表达式文件就有 203 KB。

![](https://ww4.sinaimg.cn/large/006tNbRwly1ff0elsqwolj31ju0jmaco.jpg)

没办法，一个跑到浏览器上的前端脚本，本身不到 1500 行，为了一个判断引入上百 KB 的外部依赖，实在不划算。

于是只能自己另起炉灶，想想别的办法。

## document.domain

首先想到的是 `document.domain`。在一些需要跨域的场景中，可能会见到这货的身影。比如[这篇文章](http://www.tuicool.com/articles/jmY3Yr6) 所描述的，“相同主域名不同子域名下的页面，可以设置 document.domain 让它们同域”。

经过测试发现，对于域名`c.example.edu.cn`下的页面，可以执行下面这句：

```javascript
document.domain = 'example.edu.cn';
```

而在 Chrome 下，下面这句则无法执行：

```javascript
// DOMException
document.domain = 'edu.cn';
```

浏览器会抛出`DOMException`：

> 1 Uncaught DOMException: Failed to set the 'domain' property on 'Document': 'edu.cn' is not a suffix of 'c.example.edu.cn'.

IE 也会报出“参数无效”的错误；Firefox 下同样会抛出错误：

> NS_ERROR_DOM_BAD_DOCUMENT_DOMAIN: Illegal document.domain value

从报错信息可以看到， DOMException 是可以捕获到的。那就好办了。

将域名（或页面当前的 `document.domain`） split 成数据 `['x', 'example', 'edu', 'cn']`，从右向左逐次加上一个元素，每次将单词使用句点连接并赋值给 `document.domain`。如果 catch 到错误，则进行下一次操作。一旦赋值成功，即可 break 循环。

上代码：

```javascript
const domain = document.domain;
const list = domain.split('.');

let len = list.length;
let rootDomain = domain;

while (len--) {
  try {
    document.domain = list.slice(len).join('.');
    rootDomain = document.domain;
    break;
  } catch (e) {}
}

// 还得恢复原值，避免产生副作用
document.domain = domain;

console.log(rootDomain);
```

很好，经过简单测试，Chrome、IE 妥妥的。

然而 Firefox 挂了。挂在最后的还原阶段。也就是说，Firefox 允许修改 `document.domain`，但不允许修改成上一级之后，再回退到下一级。

此外（感谢老大），在 Safari 上测试发现，`document.domain = 'cn'` 不会报错！什么鬼？请移步[《Webkit下最无敌的跨大域方案》](https://imququ.com/post/document-domain-bug-in-webkit.html)。

功亏一篑。心好累啊。

## Cookie 救火

最后想起前面提到的一句，“想在一个叫 edu.cn 的域下存 cookie？对不起，浏览器做不到。”

要不咱试试 cookie？动手！

道理同上，每次尝试在手动拼接的 domain 下面存 cookie，然后检查 cookie 是否保存成功。一旦成功，则 break 循环，并清除该 cookie。没有副作用，只是多操作几次 cookie。

换个思路，总算是解决了。

代码被我放在了 [Github](https://github.com/AngusFu/browser-root-domain) 上。顺手贴在这里：

```javascript
var KEY = '__rT_dM__' + (+new Date());
var R = new RegExp('(^|;)\\s*' + KEY + '=1');
var Y1970 = (new Date(0)).toUTCString();

module.exports = function getRootDomain() {
  var domain = document.domain || location.hostname;
  var list = domain.split('.');
  var len = list.length;
  var temp = '';
  var temp2 = '';

  while (len--) {
    temp = list.slice(len).join('.');
    temp2 = KEY + '=1;domain=.' + temp;

    // try to set cookie
    document.cookie = temp2;
  
    if (R.test(document.cookie)) {
      // clear
      document.cookie = temp2 + ';expires=' + Y1970;
      return temp;
    }
  }
};
```


## 更新@20170504

今天在奇舞周刊的评论区看到有同学的评论。看来我遇到的问题，很早就有人遇到过了。
顺着评论看了下，知乎的这个回答非常清晰：[如何使用正则表达式得到一个 URL 中的主域名](https://www.zhihu.com/question/20994750?sort=created)。
当初真没想到“主域名”这个词，满脑子都是“根域名”。结果就与这回答失之交臂。当然，如果早点遇到知乎的回答，也就不会有这篇文章了吧。



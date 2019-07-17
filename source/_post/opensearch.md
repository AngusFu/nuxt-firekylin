---
title: Chrome 中的 “Tab to Search” 与 Open Search
date: 2017-05-08 11:28:59
desc: Chrome 中的 “Tab to Search” 与 Open Search
tags:
    - 原创
    - 技巧
---

## 描述

在 Chrome 中新建标签页，输入网址的时候，浏览器会根据书签、历史记录进行自动补全，通过 Tab 键可以在浏览器提供的补全选项中切换。

有时可以发现，点击 Tab 的时候，地址栏右侧会出现“按 `tab` 键可通过 XX 进行搜索”的提示。

![](https://ww3.sinaimg.cn/large/006tNbRwly1fffki13mxvj30z80aw0tu.jpg)

再次点击 Tab，地址栏中文字，就变成了一段蓝色文字：“使用 XX 搜索”。

![](https://ww3.sinaimg.cn/large/006tNbRwly1fffkisv96kj30t605idg5.jpg)

这时候就可以直接在地址栏中输入你要搜索的关键词，然后点击回车键，页面就会直接跳转到搜索页。

![](https://ww2.sinaimg.cn/large/006tNbRwly1fffkjwhpavj316g0piq5c.jpg)

很多网站都能通过这种方式进行快捷搜索。常用的如谷歌、百度这些搜索引擎，后来发现，知乎、掘金、Github 等等网站也能实现。

奇舞周刊网站提供了技术文章的搜索功能，和一般搜索有所不同的是，奇舞周刊的 url 是将搜索词放在 url 的 hash 部分的。这样是否也能实现呢？

## 功能实现

带着这个问题，首先通过搜索引擎找答案。找到了，是一个叫做 OpenSearch 的方案。

解决方案很简单，在 HTML 文档的 `head` 部分添加一个 `<link>` 标签：

```html
<link
    rel="search"
    href="/opensearch.xml"
    type="application/opensearchdescription+xml"
/>
```

接着创建一个 XML 文件。文件内容如下：

```xml
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
    <ShortName>奇舞周刊搜索</ShortName>
    <Description>奇舞周刊为您提供技术文章搜索支持。</Description>
    <Url type="text/html" method="get" template="https://weekly.75team.com/search.html#{searchTerms}"/>
</OpenSearchDescription>
```

上面这段是最简单的配置。`ShortName` 相当于前面举例中的 “XX”。`Description` 字段目前尚未在实际操作的 UI 呈现中看到。`Url` 字段的关键在 `template` 属性，该属性值是搜索页地址模板。

需要注意的是，这个 XML 文档必须放在当前域名下的 server 上。关于 OpenSearch XML 文档的各个地址配置，请参考 [OpenSearch 规范](http://www.opensearch.org/Specifications/OpenSearch/1.1#OpenSearch_description_document)。

## 通过 Form 实现

此外，根据 [Chromium 的文档](http://dev.chromium.org/tab-to-search)描述，还有一种方式可以实现 “Tab to search”，即当网站中存在一个用户提交的表单时，Chrome 会自动将该网站添加到可搜索站点列表中。该表单必须满足以下几点条件：

- 必须以 GET 方式提交；
- 提交目标是 HTTP 地址；
- 没有 JavaScript 脚本处理表单的 `onsubmit`；
- 只能有一个 type="text" 的 `input` 元素；
- 不包含 password、file、textarea 等元素；
- 其他 `input` 元素必须保持默认状态。

最后需要注意一点，无论是哪种方式，**在地址栏中选择的网址不能带有路径**，这时候才能完成 “Tab to search” 的任务。

更多信息，请查阅参考文档。

## References

- [chromium.org - Tab to Search](http://dev.chromium.org/tab-to-search)
- [wikiwand.com - OpenSearch](http://www.wikiwand.com/en/OpenSearch)
- [opensearch.org - OpenSearch Description](http://www.opensearch.org/Specifications/OpenSearch/1.1#OpenSearch_description_document)
- [知乎问答 - Chrome 是如何判断一个网站是搜索引擎的?](https://www.zhihu.com/question/28018277)

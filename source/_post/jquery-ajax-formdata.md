---
title: "使用 jQuery.ajax 上传带文件的表单"
desc:  "使用 jQuery.ajax 上传带文件的表单"
date: 2016-10-29
tags:
  - JavaScript
  - 原创
  - jQuery
---

今天帮人看代码的时候，遇到一点小问题。使用 jQuery 上传带文件的表单时，会有些问题。

首先，因为使用的是 FormData，所以必须在传入 `$.ajax` 的参数中配置 `processData: false`。

否则将会抛出 `Illegal invocation` 的异常，因为 jQuery 默认是会对传入的 data 字段的数据进行处理的。

[官方文档](http://api.jquery.com/jQuery.ajax/)是这么解释的：

![](http://p4.qhimg.com/t01d7c364142dff02d8.png)

其次，注意请求的 `Content-Type` 首部，默认是 `application/x-www-form-urlencoded; charset=UTF-8`，也就是我们通常见的 “a=A&b=B” 这种格式。但使用 FormData 时，就不行了。

对参数添加 `contentType 字段`，将其值设置为 `false` 即可。如果 jQuery 版本小于 1.6，则手动设置为 `multipart/form-data`。具体说明请见文档说明：

![](http://p8.qhimg.com/t0119601cbcb3c8db14.png)

我以前通常都是使用原生的 `XMLHttpRequest`，所以倒也没有遇到过这种问题。既然遇到了，就得解决。因此记录下来，以备日后查找。

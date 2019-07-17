---
title: 渐进式 Web App 的离线存储
date: 2016-08-18 18:04:13
desc: 渐进式 Web App 的离线存储
author: Addy Osmani
social: https://medium.com/@addyosmani/
permission: 0
from: https://medium.com/@addyosmani/offline-storage-for-progressive-web-apps-70d52695513c
tags: 
    - 翻译
    - 渐进式 Web App
---

2016 很可能成为**网络弹性**（network resilience）元年。

网络连接很可能**不靠谱**（flakey），或者根本就连不上，这也是为什么在 [渐进式 Web App](https://developers.google.com/web/progressive-web-apps/)（译者注：Progressive Web App，以下简称 `PWA`） 中，支持离线和性能可靠都很重要。本文总结了关于 PWA **离线数据存储**的一些创意。想想那些提供*有意义的*离线体验所需要的 JSON 数据、图片以及其他的静态数据。

![](http://p8.qhimg.com/t01f76cbfea0e1832fc.jpg)

**离线存储数据的建议：**

对 **URL寻址资源**(URL addressable resources)，使用 [**Cache API**](https://davidwalsh.name/cache)（这是 [Service Worker](https://developers.google.com/web/fundamentals/primers/service-worker/) 的一部分）。对其他数据，使用 **IndexedDB**（给它包装上 [Promises](http://www.html5rocks.com/en/tutorials/es6/promises/)）。

**常见问题解答：**

- IDB 和 Cache API 两者的 API 都是异步的（IDB 基于事件，Cache API 基于 Promise）。它们都可以在 [Web Worker、Window 以及 Service Worker](https://nolanlawson.github.io/html5workertest/) 三种环境下工作。

- IDB [到处](http://caniuse.com/#feat=indexeddb)都支持（译者注：原文如此，作者的意思请自行揣摩）。 Service Workers  和 Cache API 只在 Chrome、Firefox、Opera 中[支持](https://jakearchibald.github.io/isserviceworkerready/)， Edge 中尚在开发。

- IDB 不支持 Promise，但有一些*强大的*库提供了 Promise 包装。*后面会给出建议。*这些库会尽可能抹平 API 之间的强制复杂性（事务处理，schema 版本控制）。

- 原生的 IDB Promise 以及 [observer](https://github.com/WICG/indexed-db-observers) 已得到[提议](https://github.com/inexorabletash/indexeddb-promises)。

- 有多大的存储量？Chrome 和 Opera 中，是按**域**计算存储的（而不是按 API 计算）。在到达[储量限制](http://www.html5rocks.com/en/tutorials/offline/quota-research/)之前，两种存储机制都会一直进行存储。通过 [Quota Management API](https://www.w3.org/TR/quota-api/) 可以检查用量（译者注：这个 API 还在提案阶段）。Firefox 则没有对存储量做出限制，只是在 50 MB 之后会弹出提醒。移动版 Safari 最多可以存 50 MB；桌面版 Safari没有限制（满5 MB 之后有提醒）；IE 10+ 最多能存 250 MB，超过 10 MB 之后弹出提醒。以上数据来源于 PouchDB 对 IDB 存储行为的[跟踪](https://pouchdb.com/faq.html#data_limits)。朝着未来的方向看，如果应用需要更多持久化存储，请看正在进行中的 [Durable Storage](https://storage.spec.whatwg.org/)。

- Safari 在最新的 Tech Previews 中[修复了许多长期存在的 IDB bug](https://gist.github.com/nolanlawson/08eb857c6b17a30c1b26)。即便如此，Safari 10 的 IDB 并未完全通过 PouchDB 的测试套件，已经有人碰到了稳定性问题。在更多研究完成之前，可能会遇到各种不同的情况。请*务必*测试并提交 bug，让 webkit 的同学和相关支持库的作者们看看。

- URL寻址资源通常是指可以那些通过 URL 访问的静态资源。对 PWA 而言，你可以通过 Cache API 缓存那些组成你的应用 shell 的静态文件（JS/CSS/HTML），并通过 IndexedDB 向离线页面填充数据。对此没有硬性规定，PWA 仅靠 Cache API 就能玩得转。

- [Chrome](https://developers.google.com/web/tools/chrome-devtools/iterate/manage-data/local-storage) (Application tab)、Opera、[Firefox](https://developer.mozilla.org/en-US/docs/Tools/Storage_Inspector) (Storage Inspector)、Safari (Storage tab) 都已经支持 IndexedDB 调试。

**值得一看的 IndexedDB 库**

- [localForage](https://mozilla.github.io/localForage/)： 约 8 KB，Promise，对传统浏览器支持良好

- [idb-keyval](https://www.npmjs.com/package/idb-keyval)：小于 500 字节，Promise，提供 key-value 支持

- [idb](https://www.npmjs.com/package/idb)：约 1.7 KB，Promise, 可迭代、索引

- [Dexie](http://dexie.org/)：约 16 KB, Promises，复杂查询、辅助索引

- [PouchDB](https://pouchdb.com/)：约 45 KB ，支持[定制版本](https://pouchdb.com/2016/06/06/introducing-pouchdb-custom-builds.html)，同步的（？）

- [Lovefield](https://github.com/google/lovefield)：相关的内容

- [LokiJS](http://lokijs.org/#/)：内存中的

- [ydn-db](https://github.com/yathit/ydn-db)：类似 dexie，可以使用 WebSQL


**值得一看的 Service Worker 库**

- [sw-toolbox](https://github.com/GoogleChrome/sw-toolbox)：动态或运行时请求的离线缓存

- [sw-precache](https://github.com/GoogleChrome/sw-precache)：静态资源或应用 shell 的离线预缓存

- Webpack 用户可以直接使用上面的，或者可以看看 [offline-plugin](https://github.com/NekR/offline-plugin)

### 其他存储机制

- **Web Storage** (e.g LocalStorage) 是同步的，不支持 Web Worker，且有大小限制（只能存储字符串）。尽管之前异步 LocalStorage 的[想法](https://github.com/slightlyoff/async-local-storage)已有人提出来，但目前的焦点还是 [IndexedDB 2.0](https://w3c.github.io/IndexedDB/)。我个人就愿意使用 IDB 加上一个工具库。

- **Cookies** 自有其用途，但却是同步的，不支持 Web Worker，还有大小限制。在之前的项目中我使用了 [js-cookie](https://github.com/js-cookie/js-cookie)（gzip 后约 800 字节） 处理 cookie。目前已经有人勾勒出 [Async Cookies API](https://github.com/WICG/async-cookies-api) 的支持了，有一个可用的 polyfill。

- **WebSQL** 是异步的（基于回调函数），但它同样不支持 Web Worker。Firefox 和 Edge 也不支持它。如果某一天它完全消失，我不会觉得惊讶的。

- **File System API** 也是异步的（基于回调函数），在 Web Worker 和 window 中可以工作（虽然使用的是同步 API）。不幸的是，除 Chrome 之外它并无更多兴趣，而且是运行在沙盒中的（这意味着我们无法获取原生的文件访问权）。

- **File API** 正在由 [File and Directory Entries API](https://wicg.github.io/entries-api/) 和 [File API](https://w3c.github.io/FileAPI/) 规范完善。Github 上有一个 [File API 库](https://github.com/mailru/FileAPI)；关于保存文件，作为权宜之计，我一直在使用 [FileSaver.js](https://github.com/eligrey/FileSaver.js)。[可写文件](https://github.com/WICG/writable-files)的提案最终可能会为我们提供本地文件无缝交互的标准解决方案。

### 离线存储的现在与将来

如果对离线缓存感兴趣，下面这些成果值得关注。我个人对 IndexedDB 原生的 Promise 支持非常感兴趣。

![](http://cfowt.img48.wal8.com/img48/554911_20160815130845/147131009919.jpeg)

- [Durable Storage](https://storage.spec.whatwg.org/): 将存储与浏览器的清除策略隔开

- [Indexed Database API 2.0](https://w3c.github.io/IndexedDB/): 先进的 key-value 数据管理

- [Promisified IndexedDB](https://github.com/inexorabletash/indexeddb-promises): 原生支持 Promise 的 IndexedDB 版本

- [IndexedDB Observers](https://github.com/WICG/indexed-db-observers): 原生的 IndexedDB observer 支持

- [Async Cookies API](https://github.com/bsittler/async-cookies-api): 异步的 cookie API

- [Quota Management API](https://www.w3.org/TR/quota-api/): 检查应用、域的存储占用量

- [writable-files](https://github.com/WICG/writable-files): 允许网站与本地文件之间进一步的无缝交互

- [Directory downloads](https://github.com/drufball/directory-download): 支持直接下载文件夹（非 .zip 文件）

- [File and Directory Entries API](https://wicg.github.io/entries-api/): 支持文件和目录的拖拽上传


### 资源

- [Browser Database Comparison](http://nolanlawson.github.io/database-comparison/)

- [State of offline storage APIs](https://docs.google.com/presentation/d/11CJnf77N45qPFAhASwnfRNeEMJfR-E_x05v1Z6Rh5HA/edit)

- [IndexedDB, WebSQL, LocalStorage — what blocks the DOM?](https://nolanlawson.com/2015/09/29/indexeddb-websql-localstorage-what-blocks-the-dom/)

- [How to think about databases (Pokedex research)](https://nolanlawson.com/2016/02/08/how-to-think-about-databases/)

- [Which APIs are supported in Web Workers and Service Workers?](https://nolanlawson.github.io/html5workertest/)

离线存储并没有那么神奇，对潜在 API 的理解有助于你最大程度地利用现有的资源。无论你想直接使用这些 API，还是使用对它们进行抽象库文件，花一些时间来熟悉你的选择。

希望本文对你的 PWA 离线体验有所帮助。

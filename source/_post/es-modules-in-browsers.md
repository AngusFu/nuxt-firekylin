---
title: "浏览器中的 ES6 module 实现"
date: 2017-05-06
desc: "浏览器中的 ES6 module 实现"
author: "@Jake Archibald"
social: https://jakearchibald.com/
permission: 1
from: https://jakearchibald.com/2017/es-modules-in-browsers/
tags:
  - 翻译
  - ES6
---

ES6 的模块特性（module） 开始在浏览器端实现啦！一切正在路上...

| 浏览器| 备注  |
|------|-------|
| Safari 10.1      |      (无)    |
| Chrome Canary 60 | 打开 `chrome:flags` 启用“实验性网络平台功能”|
| Firefox 54       | 打开 `about:config` 启用 `dom.moduleScripts.enabled`|
| Edge 15          | 打开 `about:flags` 启用“实验性 JavaScript 功能”|

```html
<script type="module">
  import {addTextToBody} from './utils.js';

  addTextToBody('Modules are pretty cool.');
</script>
```

```javascript
// utils.js
export function addTextToBody(text) {
  const div = document.createElement('div');
  div.textContent = text;
  document.body.appendChild(div);
}
```

**[Live demo](https://cdn.rawgit.com/jakearchibald/a298d5af601982c338186cd355e624a8/raw/aaa2cbee9a5810d14b01ae965e52ecb9b2965a44/)**。

只需为 `script` 元素添加 `type=module` 属性，浏览器就会把该元素对应的内联脚本或外部脚本当成 ECMAScript 模块进行处理。

目前已经有一些 [很棒的关于 ECMAScript 模块的文章](https://ponyfoo.com/articles/es6-modules-in-depth)了，不过我还是想分享一些和浏览器相关的东西，它们都是我在测试代码、阅读规范的过程中学习到的。

## 尚未得到支持的 import 路径符号

```javascript
// 支持
import {foo} from 'https://jakearchibald.com/utils/bar.js';
import {foo} from '/utils/bar.js';
import {foo} from './bar.js';
import {foo} from '../bar.js';

// 不支持
import {foo} from 'bar.js';
import {foo} from 'utils/bar.js';
```

有效的路径符号应当符合以下条件规则之一：

* 完整的非相对路径。这样在将其传给`new URL(moduleSpecifier)`的时候才不会报错。
* 以 `/` 开头。
* 以 `./` 开头。
* 以 `../` 开头。

其他形式的符号被保留下来，未来将用于其他功能（如引入[import]内置模块）。

## 使用 `nomodule` 属性向后兼容

```html
<script type="module" src="module.js"></script>
<script nomodule src="fallback.js"></script>
```

**[Live demo](https://cdn.rawgit.com/jakearchibald/6110fb6df717ebca44c2e40814cc12af/raw/7fc79ed89199c2512a4579c9a3ba19f72c219bd8/)**。

支持 `type=module` 的浏览器将会忽略带有 `nomodule` 属性的 `script` 标签。这意味着我们可以为支持模块的浏览器提供模块形式的代码，同时为那些不支持模块的浏览器提供降级处理。

### 浏览器 issue

*   Firefox 暂不支持 `nomodule` ([issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1330900))。
*   Edge 暂不支持 `nomodule` ([issue](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10525830/))。
*   Safari 10.1 暂不支持 `nomodule`，但在最新的技术预览版中已经解决了此问题。对于 10.1 来说，有一个[相当棒的解决方案](https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc)。

## 默认延迟执行

```html
<!-- 这个脚本会在… -->
<script type="module" src="1.js"></script>

<!-- …这个脚本之后、… -->
<script src="2.js"></script>

<!-- …这个脚本之前执行。 -->
<script defer src="3.js"></script>
```

**[Live demo](https://cdn.rawgit.com/jakearchibald/d6808ea2665f8b3994380160dc2c0bc1/raw/c0a194aa70dda1339c960c6f05b2e16988ee66ac/)**。脚本执行顺序为 `2.js`, `1.js`, `3.js`。

获取脚本会导致 HTML parser 阻塞，这简直太太太太恶心了。对正常的脚本，我们可以使用 `defer` 属性来防止阻塞，脚本将延迟至文档解析完毕后执行，同时保持与其他使用 `defer` 的脚本之间的执行顺序。模块脚本的默认行为与 `defer` 相同 —— 无法使模块脚本阻塞 HTML parser。

模块脚本与使用 `defer` 的正常脚本使用相同的执行队列。

## 内联脚本同样延迟

```html
<!-- 这个脚本会在… -->
<script type="module">
  addTextToBody("Inline module executed");
</script>

<!-- …这个脚本… -->
<script src="1.js"></script>

<!-- …以及这个脚本之后、… -->
<script defer>
  addTextToBody("Inline script executed");
</script>

<!-- …这个脚本之前执行。 -->
<script defer src="2.js"></script>
```

**[Live demo](https://cdn.rawgit.com/jakearchibald/7026f72c0675898196f7669699e3231e/raw/fc7521aabd9485f30dbd5189b407313cd350cf2b/)**。执行顺序依次为 `1.js`、内联脚本、内联模块、`2.js`。

正常的内联脚本会忽略 `defer` 属性，而内联模块则总是延迟执行，无论是否引入其他内容。

## `async` 对内联、外部模块同样适用

```html
<!-- 脚本将会在其引入的模块加载完成后立即执行 -->
<script async type="module">
  import {addTextToBody} from './utils.js';

  addTextToBody('Inline module executed.');
</script>

<!-- 脚本及其引入的模块加载完成后立即执行 -->
<script async type="module" src="1.js"></script>

```

**[Live demo](https://module-script-tests-rgjnxtrtqq.now.sh/async)**。先完成加载的脚本先执行。

与正常脚本相同，带有 `async` 属性的脚本在下载时不会阻塞 HTML parser，一旦加载完毕，立即执行。不同的是，`async` 对内联模块也同样适用。

使用 `async` 时，脚本的执行顺序可能会和它们在 DOM 中出现的顺序不尽相同。

### 浏览器 issue

*   Firefox 不支持内联模块使用 `async`([issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1361369))。

## 模块只执行一次

```html
<!-- 1.js 只执行一次 -->
<script type="module" src="1.js"></script>
<script type="module" src="1.js"></script>
<script type="module">
  import "./1.js";
</script>

<!-- 普通脚本会执行多次 -->
<script src="2.js"></script>
<script src="2.js"></script>
```

**[Live demo](https://cdn.rawgit.com/jakearchibald/f7f6d37ef1b4d8a4f908f3e80d50f4fe/raw/1fcedde007a2b90049a7ea438781aebe69e22762/)**。

引入同一个模块多次的时候，模块只会执行一次。这对 HTML 中的模块脚本同样适用 —— 在同一个页面中，URL 相同的模块只会执行一次。

### 浏览器 issue

* Edge 会执行多次 ([issue](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11865922/))。

## 总是使用 CORS

```html
<!-- 模块不会执行，因其未通过 CORS 检查 -->
<script type="module" src="https://….now.sh/no-cors"></script>

<!-- 模块不会执行，因其引入的脚本未通过 CORS 检查 -->
<script type="module">
  import 'https://….now.sh/no-cors';

  addTextToBody("This will not execute.");
</script>

<!-- CORS 检查通过，模块将会执行 -->
<script type="module" src="https://….now.sh/cors"></script>
```

**[Live demo](https://cdn.rawgit.com/jakearchibald/2b8d4bc7624ca6a2c7f3c35f6e17fe2d/raw/fe04e60b0b7021f261e79b8ef28b0ccd132c1585/)**。

与正常脚本不同，模块脚本（及其引入的脚本）是通过 CORS 获取的。这意味着，跨域模块脚本必须返回类似 `Access-Control-Allow-Origin: *` 这样的有效的响应头。

### 浏览器 issue

*   Firefox 无法加载 demo 页面([issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1361373))。
*   Edge 加载了没有 CORS 响应头的模块([issue](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11865934/))。

## 不携带凭证信息

```html
<!-- 请求脚本时会携带相关凭证 (如 cookie) -->
<script src="1.js"></script>

<!-- 不会携带相关凭证 -->
<script type="module" src="1.js"></script>

<!-- 会携带相关凭证 -->
<script type="module" crossorigin src="1.js?"></script>

<!-- 不会携带相关凭证 -->
<script type="module" crossorigin src="https://other-origin/1.js"></script>

<!-- 会携带相关凭证-->
<script type="module" crossorigin="use-credentials" src="https://other-origin/1.js?"></script>
```

**[Live demo](https://module-script-tests-zoelmqooyv.now.sh/cookie-page)**。

在请求同源的情况下，多数基于 CORS 的 API 都会发送凭证信息（credentials，如 Cookie）。但 `fetch()` 和模块脚本恰恰例外 —— 除非手动声明，否则是不会发送相关凭证的。

对于一个同源的模块脚本，可以为其添加 `crossorigin` 属性（这看起来挺怪的，我已经在规范中提出这个[问题](https://github.com/whatwg/html/issues/2557)了），这样在请求时就可以携带相关凭证了。如果你还想将凭证发给其他域，请使用 `crossorigin="use-credentials"`。需要注意的是，接收凭证的域必须返回 `Access-Control-Allow-Credentials: true` 的响应头。

此外，还有一个与“模块只会执行一次”这条规则相关的问题。浏览器是通过 URL 来区别不同模块的，所以如果你先请求了一个模块而不携带任何凭证，紧接着又携带凭证信息去请求该模块，那么第二次得到的依然是不携带凭证的请求所返回的模块。这正是我在上面代码中的 URL 后面加上“?”的原因。

### 浏览器 issue

* 请求同源模块时，Chrome 会携带凭证信息([issue](https://bugs.chromium.org/p/chromium/issues/detail?id=717525))。
* 即使添加了 `crossorigin` 属性，Safari 在请求同源脚本时也不会携带凭证信息([issue](https://bugs.webkit.org/show_bug.cgi?id=171550))。
* Edge 则完全弄反了。请求同源模块时，Edge 默认会发送凭证信息，但如果手动添加了 `crossorigin` 属性，则又不会携带 ([issue](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11865956/))。

Firefox 是唯一正确实现这一点的浏览器 —— 好样的！

## Mime-types

不同于普通脚本，对于通过 module 引入的脚本，服务器必须返回[合法的 MIME type](https://html.spec.whatwg.org/multipage/scripting.html#javascript-mime-type)，否则脚本将不会执行。

**[Live demo](https://module-script-tests-zoelmqooyv.now.sh/mime)**。

### 浏览器 issue

* Edge 仍将执行 MIME type 非法的脚本([issue](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11865977/))。

---

以上就是我目前所学习到的所有内容。浏览器开始支持 ES6 模块，简直太开心啦~

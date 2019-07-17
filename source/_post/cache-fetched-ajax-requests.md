---
title: Fetch 请求的本地缓存
date: 2016-08-27 21:07:42
desc: Fetch 请求的本地缓存
author: Peter Bengtsson
social: https://twitter.com/peterbe
permission: 0
from: https://www.sitepoint.com/cache-fetched-ajax-requests/
tags: 
    - 翻译
    - JavaScript
    - 优化
    - 缓存
---

**本文展示了如何使用实现 fetch 请求的本地缓存**，遇到重复请求时，将会从 sessionStorage 中读取数据。这样做的好处是，无需为每个需要缓存的资源编写自定义代码。

如果你想在 JavaScript 盛会中露露脸，秀秀如何玩转 Promise、最前沿的 API 和 localStorage，那就接着往下看吧。

## Fetch API

此时此刻，你对 [fetch](https://www.sitepoint.com/introduction-to-the-fetch-api/) 可能已经很熟悉了。它是浏览器提供的用以替代旧版的`XMLHttpRequest`的原生 API。

<caniuse src="/caniuse/embed.html?feat=fetch&amp;periods=future_1,current,past_1,past_2"></caniuse>

并非所有浏览器都完美支持 fetch，但你可以使用 [GitHub 上的 fetch polyfill](https://github.com/github/fetch)（如果没事做，可以看看 [Fetch 标准](https://fetch.spec.whatwg.org/)）。

## 原始替代版本

做个假设，我们准确了解需要下载的那个资源，并且只想下载一次。可以使用全局变量作为缓存，像下面这样：

```javascript
let origin = null
fetch('https://httpbin.org/get')
  .then(r => r.json())
  .then(information => {
    origin = information.origin  // your client's IP
  })

// 需要延时以确保 fetch 完成
setTimeout(() => {
  console.log('Your origin is ' + origin)
}, 3000)
```

[On CodePen](http://codepen.io/SitePoint/pen/QEPEpB?editors=0010#0)

上面使用了全局变量来保存缓存的数据。马上可以发现问题，一旦刷新页面或者跳转到其他页面，缓存的数据就消失了。

在剖析这个办法的短板之前，先将解决方案升级下。

```javascript
fetch('https://httpbin.org/get')
  .then(r => r.json())
  .then(info => {
    sessionStorage.setItem('information', JSON.stringify(info))
  })

// 需要延时以确保 fetch 完成
setTimeout(() => {
  let info = JSON.parse(sessionStorage.getItem('information'))
  console.log('Your origin is ' + info.origin)
}, 3000)
```

[On CodePen](http://codepen.io/SitePoint/pen/zBXBwg?editors=0010#0)

第一个问题是，`fetch` 是基于 Promise 的，意味着我们无法准确知晓 fetch 何时完成，因此在 fetch 完成之前，我们不能依赖它的执行。

第二个问题是，该解决方案详细指定了 URL 和缓存的内容（本例中的 `information`）。我们需要一个基于 URL 的通用解决方案。

## 第一次的简单实现

在 `fetch`外面再包装一层，同样也返回 Promise。调用该方法时，我们并不关心结果是来源于网络还是本地缓存。

之前你可能是这样做的：

```javascript
fetch('https://httpbin.org/get')
  .then(r => r.json())
  .then(issues => {
    console.log('Your origin is ' + info.origin)
  })
```

[On CodePen](http://codepen.io/SitePoint/pen/pbBbwQ?editors=0011)

现在加上一层包装，重复的网络请求可以通过本地缓存进行优化。我们将这个包装过的方法简单称作 `cachedFetch`，代码如下：

```javascript
cachedFetch('https://httpbin.org/get')
  .then(r => r.json())
  .then(info => {
    console.log('Your origin is ' + info.origin)
  })
```

该方法首次运行的时候，需要发出网络请求，并将结果缓存下来。第二次请求时，则会直接从本地存储中取出数据。

首先试试简单地将 `fetch` 包装下：

```javascript
const cachedFetch = (url, options) => {
  return fetch(url, options)
}
```

[On CodePen](http://codepen.io/SitePoint/pen/kXmXwm?editors=0010#0)

这当然能工作，不过没什么用。接下来，来实现获取数据的**存储**。

```javascript
const cachedFetch = (url, options) => {
  // 将 URL 作为 sessionStorage 的 key
  let cacheKey = url
  return fetch(url, options).then(response => {
    // 仅在结果为 JSON 或其他非二进制数据情况下缓存结果
    let ct = response.headers.get('Content-Type')
    if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
      // 当然，除了 .text()，也有 .json() 方法
      // 不过结果最终还是会以字符串形式存在 sessionStorage 中
      // 如果不克隆 response，在其返回时就会被使用
      // 这里用这种方式，保持非入侵性
      response.clone().text().then(content => {
        sessionStorage.setItem(cacheKey, content)
      })
    }
    return response
  })
}
```

[On CodePen](http://codepen.io/SitePoint/pen/yJAJok?editors=0012)

上面发生了不少事。

`fetch` 所返回的首个 Promise 实际上还是径直发出了 GET 请求。注意如果有 CORS（Cross-Origin Resource Sharing，跨域资源共享）的问题，`.text()`、`.json()` 、`.blob()` 这些方法不会工作。

最有意思的点在于，我们需要*克隆*首个 Promise 返回的 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/clone) 对象。如果不这样做，我们就介入过多，当该 Promise 的最终使用者调用如 `.json()` 这些方法时，会得到如下错误：

```
TypeError: Body has already been consumed.
```

另外需要注意的一点是，需要注意响应类型：我们只存储状态码为 `200` *且*内容类型为 `application/json` 或 `text/*`的响应。因为 `sessionStorage` 只能存储文本数据。

下面是使用示例：

```javascript
cachedFetch('https://httpbin.org/get')
  .then(r => r.json())
  .then(info => {
    console.log('Your origin is ' + info.origin)
  })

cachedFetch('https://httpbin.org/html')
  .then(r => r.text())
  .then(document => {
    console.log('Document has ' + document.match(/<p>/).length + ' paragraphs')
  })

cachedFetch('https://httpbin.org/image/png')
  .then(r => r.blob())
  .then(image => {
    console.log('Image is ' + image.size + ' bytes')
  })
```

让人喜欢的是，这个解决方案到目前为止可以正常工作，也不会干扰 JSON *与* HTML 请求。当数据为图片的时候，它也不会试图将其存在 `sessionStorage` 中。

## 真实返回命中缓存的第二次实现

我们的第一次实现，仅仅只关心响应结果的**存储**。当你第二次调用 `cachedFetch` 时，并未试着从 `sessionStorage` 中*检索*任何内容。我们要做的，首先是返回一个 Promise，它需要返回一个 [Response 对象](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response)。

先看下最基本的实现：

```javascript
const cachedFetch = (url, options) => {
  // 将 URL 作为 sessionStorage 的 key
  let cacheKey = url

  // 命中缓存的新代码开始
  let cached = sessionStorage.getItem(cacheKey)
  if (cached !== null) {
    // it was in sessionStorage! Yay!
    let response = new Response(new Blob([cached]))
    return Promise.resolve(response)
  }
  // 命中缓存的新代码结束

  return fetch(url, options).then(response => {
    // 仅在结果为 JSON 或其他非二进制数据情况下缓存结果
    if (response.status === 200) {
      let ct = response.headers.get('Content-Type')
      if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
        // 当然，除了 .text()，也有 .json() 方法
        // 不过结果最终还是会以字符串形式存在 sessionStorage 中
        // 如果不克隆 response，在其返回时就会被使用
        // 这里用这种方式，保持非入侵性
        response.clone().text().then(content => {
          sessionStorage.setItem(cacheKey, content)
        })
      }
    }
    return response
  })
}
```

[On CodePen](http://codepen.io/SitePoint/pen/qNwNPb?editors=0012)

这已经可以工作了！

打开 [CodePen](http://codepen.io/SitePoint/pen/qNwNPb?editors=0012) 查看上面代码的实际效果，记得开启浏览器开发者工具中的  Network tab。多点几次 “Run” 按钮（CodePen 的右上角），可以发现，只有图片被反复请求。

本解决方案的好处是避免了“意面式回调”（callback spaghetti）。`sessionStorage.getItem` 的调用是同步的（也就是阻塞的），所以在 Promise 或者回调中无需应对“它在本地存储中是否存在？”这种问题。只要有内容，就返回缓存结果。否则就按正常逻辑执行。

## 考虑失效时间的第三次实现

到目前为止我们一直在使用 `sessionStorage`，它有点像 `localStorage`，除了在**打开新页面**时会被清除这一点。这意味着我们在使用一种“自然形式”，内容不会缓存很久。如果要使用 `localStorage` 来缓存内容，那就算远程内容改变了，浏览器还是会“永远”卡在本地内容。这太糟糕了。

更好的解决办法是提供*用户*控制。（这里的用户指的是使用 `cachedFetch` 函数的 Web 开发者。）就像 Memcached 或 Redis 这些服务端存储一样，我们可以指定缓存的使用期。

例如在 Python (with Flask) 中：

```bash
>>> from werkzeug.contrib.cache import MemcachedCache
>>> cache = MemcachedCache(['127.0.0.1:11211'])
>>> cache.set('key', 'value', 10)
True
>>> cache.get('key')
'value'
>>> # waiting 10 seconds
...
>>> cache.get('key')
>>>

```

对此，目前 `sessionStorage` 和 `localStorage` 都没有内建的功能实现，所以需要自己手动来实现。通过对比存储与缓存命中时的时间戳，可以达成目的。

在此之前，先看看大概应该长什么样子：

```javascript
// 使用默认过期时间，如 5 min
cachedFetch('https://httpbin.org/get')
  .then(r => r.json())
  .then(info => {
    console.log('Your origin is ' + info.origin)
  })

// 传递以秒为单位的数值
cachedFetch('https://httpbin.org/get', 2 * 60)  // 2 min
  .then(r => r.json())
  .then(info => {
    console.log('Your origin is ' + info.origin)
  })

// 和  fetch 选项放在一起，使用自定义的名字
let init = {
  mode: 'same-origin',
  seconds: 3 * 60 // 3 min
}
cachedFetch('https://httpbin.org/get', init)
  .then(r => r.json())
  .then(info => {
    console.log('Your origin is ' + info.origin)
  })
```

最重要的来了，每次保存响应数据的时候，*也*需要记录*何时*存储的。现在我们也可以切换到 `localStorage` 上了。代码会保证我们不会命中过期的缓存，在 `localStorage` 中内容原本是持久化的。

下面是最终的解决方案：

```javascript
const cachedFetch = (url, options) => {
  let expiry = 5 * 60 // 默认 5 min
  if (typeof options === 'number') {
    expiry = options
    options = undefined
  } else if (typeof options === 'object') {
    // 但愿你别设置为 0
    expiry = options.seconds || expiry
  }
  // 将 URL 作为 localStorage 的 key
  let cacheKey = url
  let cached = localStorage.getItem(cacheKey)
  let whenCached = localStorage.getItem(cacheKey + ':ts')
  if (cached !== null && whenCached !== null) {
    // 耶！ 它在 localStorage 中
    // 尽管 'whenCached' 是字符串
    // 但减号运算符会将其转换为数字
    let age = (Date.now() - whenCached) / 1000
    if (age < expiry) {
      let response = new Response(new Blob([cached]))
      return Promise.resolve(response)
    } else {
      // 清除旧值
      localStorage.removeItem(cacheKey)
      localStorage.removeItem(cacheKey + ':ts')
    }
  }

  return fetch(url, options).then(response => {
    // 仅在结果为 JSON 或其他非二进制数据情况下缓存结果
    if (response.status === 200) {
      let ct = response.headers.get('Content-Type')
      if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
        // 当然，除了 .text()，也有 .json() 方法
        // 不过结果最终还是会以字符串形式存在 sessionStorage 中
        // 如果不克隆 response，在其返回时就会被使用
        // 这里用这种方式，保持非入侵性
        response.clone().text().then(content => {
          localStorage.setItem(cacheKey, content)
          localStorage.setItem(cacheKey+':ts', Date.now())
        })
      }
    }
    return response
  })
} 
```

[On CodePen](http://codepen.io/SitePoint/pen/KrYrXA?editors=0012)

## 未来更好、更理想、更酷的实现

我们在避免过度变动 Web API，最棒的是 `localStorage` 可比依赖网络快得多了。看看这篇文章对 `localStorage` 和 XHR 的比较： [localForage vs. XHR](https://www.peterbe.com/plog/localforage-vs.-xhr)。它还衡量了其他内容，但得出基本结论，`localStorage` 确实很快，磁盘缓存热身（disk-cache warm-ups，？不知如何翻译，请读者赐教）也很少出现。

接下来，我们还能怎样改进方案呢？

### 处理二进制响应

我们的实现没有考虑缓存非文本的内容，如图片等等，但这并非不可能。需要一些更多的代码。特别的，我们可能想存储更多关于 [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) 的信息。从根本上说，所有响应都是 Blob。对文本和 JSON 来说，它只是字符串数组，`type` 和 `size` 并不真正那么重要，因为从字符串本身就能识别出来。对二进制内容而言，需要将它们转换为 [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。

关注更多内容，请看 [CodePen](http://codepen.io/SitePoint/pen/XKQKZv?editors=1010#0) 上支持图片的实现。

### 使用哈希键值缓存

另外一点潜在的优化点是对用作 key 的每个 URL 进行哈希处理，使其变得更小，以空间换取速度（trade space for speed）。在上面的例子中，我们使用了很多非常短小整洁的 URL（如 `https://httpbin.org/get`），但如果你使用了大量的带有很多查询字符串的长 URL，这样做就很有意义了。

办法之一是使用[这个不错的算法](http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/)，以其安全快速而知名：

```javascript
const hashstr = s => {
  let hash = 0;
  if (s.length == 0) return hash;
  for (let i = 0; i < s.length; i++) {
    let char = s.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
```

如果觉得这个不错，看下 [CodePen](http://codepen.io/SitePoint/pen/LkvkON?editors=0012)。在控制台上可以看到类似 `557027443` 这样的 key 值。

## 结语

现在我们拥有了一个可以使用在 web app 中的工作方案了，我们使用 Web API，并且知晓响应结果会很好地为用户缓存下来。

最后一件事大概是这个扩展置于本文之外，将其作为一个真实、具体的项目，加上测试和 `README`，并发布到 npm 上 —— 换个时间再做吧！

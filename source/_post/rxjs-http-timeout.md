---
title: Angular 2 中的 HTTP 请求超时处理
tags:
  - 原创
  - 笔记
  - RxJS
  - Angular 2
date: 2017-01-16 11:31:45
desc: "Angular 2 中的 HTTP 请求超时处理"
---


以前做 React Native 时，需要对请求进行超时处理。然而，React Native 提供的 `fetch` 方法，根本没有提供超时的选择。于是只能自己玩些如下的黑科技了，代码一看就很乱，还难以维护：

```javascript
const TIME_OUT = 3000;

let reqErrror = false;
let reqDone   = false;

let timeout = setTimeout(() => {
  // 超时错误
  reqErrror = true;
  // 标记本次请求结束
  reqDone = true;
}, TIME_OUT);

fetch('/api/test')
  .then(res => res.json())
  .then((data) => {
    clearTimeout(timeout);
    // 没有错误发生
    reqErrror = false;
    // 标记本次请求结束
    reqDone = true;
    // ...
  })
  .catch((e) => {
    clearTimeout(timeout);

    // 发生某种错误
    reqErrror = true;
    // 标记本次请求结束
    reqDone = true;

    console.error(e);
  });

```

那会儿刚开始接触，团队的几个人对 ES6 这些东西基本处在一种边学边用的状态，所以上面的方法在当时解决了问题，也还不错。后来离开项目，也许至今还在保留着这种方式吧。唉，当初的代码写得是有多乱啊，竟然都不会封装一下囧。

简单改写之后的代码如下：

```javascript

const fetchWithTimeout = function(url = '', option = {}, timeout) {
  if (!timeout) {
    return fetch(url, option);
  }

  let timeout = new Promise(function (resolve, reject) {
    setTimeout(function () {
      let err = new Error('timeout');
      reject(err);
    }, timeout);
  });

  return Promise.race([
    timeout,
    fetch(url, option).then(res => res.json())
  ]);
};

fetchWithTimeout('/api/test', {}, TIME_OUT)
  .then(res => res.json())
  .then(data => {
    // ...
  })
  .catch(e => {
    // ...
  });
```

好了，言归正传，其实这次我是要记录 Angular 2 中的 http 超时处理的，事情缘由不再赘述，和前面差不多。

同样我想到了 `race`。 不过在 stackoverflow 中有人提过这个问题，是用 `timeout` 操作符，但我使用的时候遇到了一些问题。

```javascript
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import 'rxjs/add/operator/race';
import 'rxjs/add/operator/delay';

const TIME_OUT = 3000;

// ...
let cancel$ = Observable.of(null).delay(TIME_OUT);

let request$ = this.http.get(url)
  .map(res => res.json())
  .catch(e => Observable.of(e));

let unsubscribe = request$.race(cancel$).subscribe(
  data => console.log(data),
  err  => consoel.error(err),
  ()   => console.log('complete');
);
// ...
```

暂且记录成这样吧，有空再补充。
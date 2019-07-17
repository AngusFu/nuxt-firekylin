---

title: 关于 setImmediate
date: 2016-10-27
desc: 关于 setImmediate
tags:
  - 原创
  - JavaScript
---

## W3C Draft

- [文档地址](https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html)

题目叫 “Efficient Script Yielding”，一份 2011 年的 “Editor's Draft”，从题目就能看出用途。建议有时间读一遍，超级短。摘要就一句话：

> This specification defines an interface for web applications to flush the browser event queue and receive an immediate callback.
> 本说明文档定义了一个用于刷新浏览器事件队列、接收即时回调的 Web 应用接口。

## MDN

- [文档地址](https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate)

MDN 的文档没得说。遇到问题去查查肯定不会害你，有时候运气好，还能读到翻译过来的中文版：

> This method is used to break up long running operations and run a callback function immediately after the browser has completed other operations such as events and display updates.
> 该方法用来把一些需要长时间运行的操作放在一个回调函数里,在浏览器完成后面的其他语句后,就立刻执行这个回调函数。

但同时，文档提到， **只有 IE 10+ 和 Node.js 0.10+ 实现了该方法**。setImmediate 受到了 Gecko 和 Webkit 的 “resistance”（抵制）。建议跟着去看看热闹。

MDN 文档中提到了三种模拟 setImmediate 的方式：`postMessage`、`MessageChannel`、`setTimeout(fn, 0)`。

## setImmediate polyfill

- [源码](https://github.com/YuzuJS/setImmediate)

对于 Node 0.9 之前的，使用 `process.nextTick` 模拟；对于非 IE 10 的现代浏览器，使用 `postMessage`；对 Web Worker，使用 `MessageChannel`（这个之后需要关注下）；对 IE 6–8，向 html 中插入新的 script 标签，在 `onreadystatechange` 事件中执行回调；其他浏览器，统一使用 `setTimeout(fn, 0)` 的形式。

```javascript
// Don't get fooled by e.g. browserify environments.
if ({}.toString.call(global.process) === "[object process]") {
    // For Node.js before 0.9
    installNextTickImplementation();

} else if (canUsePostMessage()) {
    // For non-IE10 modern browsers
    installPostMessageImplementation();

} else if (global.MessageChannel) {
    // For web workers, where supported
    installMessageChannelImplementation();

} else if (doc && "onreadystatechange" in doc.createElement("script")) {
    // For IE 6–8
    installReadyStateChangeImplementation();

} else {
    // For older browsers
    installSetTimeoutImplementation();
}
```

## Nicholas C. Zakas 的文章

- [文章地址](https://www.nczonline.net/blog/2011/09/19/script-yielding-with-setimmediate/)

文章很短，但讲得还挺仔细的。作者提到了两点好处：

- 可以直接在 UI 队列清空后直接插入 JS 任务；
- 延迟更短，不必等待下一次 timer tick

## Edge Demo 

- [Demo 地址](https://msedgeportal.trafficmanager.net/en-us/microsoft-edge/testdrive/demos/setImmediateSorting/)

通过 250 个数的排序，来对比处理效率。基本原理是，排序时将每一步的交换操作放在回调中，对比排序完成的效率。一共有四种：

- `setTimeout(fn, 15)`
- `setTimeout(fn, 4)`
- `PostMessage`
- `setImmediate`

关于前两种的时间间隔问题，建议直接取读 demo 底部的说明。已经很详细了。

## Stackoverflow

- [setImmediate vs. nextTick](http://stackoverflow.com/questions/15349733/setimmediate-vs-nexttick)

- [nextTick vs setImmediate, visual explanation](http://stackoverflow.com/questions/17502948/nexttick-vs-setimmediate-visual-explanation)

## 题外话

- 以前竟然不知道 setTimeout 也能接收第三个第四个参数的。`setTimeout((a, b) => a + b, 0, 22, 33)`。

- `!(x > 9)` 和 `x <= 9` 可不一定完全等价，前者在不确定 `x` 的类型时，特别有用，不用额外判断 undefined。



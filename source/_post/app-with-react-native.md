---
title: react-native 开发 App 手记
date: 2016-04-22
desc: react-native 开发 App 手记
tags: 
    - 原创
    - react-native
    - 开发心得
---

做了一个月的 `RN`。

遇到一些问题，陆续记录下来。一些关于组件上的问题不细说了。

## Android 下的键盘事件监听

一直想找安卓下面的键盘事件，可是官方文档（0.22）压根就没提这档子事啊。唯一稍微有点眉目的，就是关于[原生模块](http://reactnative.cn/docs/0.22/native-modules-android.html#%E5%8F%91%E9%80%81%E4%BA%8B%E4%BB%B6%E5%88%B0javascript)这里。

后来看到了 [react-native-keyboard-spacer](https://github.com/Andr3wHur5t/react-native-keyboard-spacer/blob/master/KeyboardSpacer.js)  这个组件的写法，很傻很天真的以为是需要使用什么 `java` 或 `OC` 的支持。


于是我决定去看看源码，找到所有含有 `keyboard` 的 `java` 文件。这么一找，还真找到了。

```java

if (mKeyboardHeight != heightDiff && heightDiff > mMinKeyboardHeightDetected) {
    // keyboard is now showing, or the keyboard height has changed
    mKeyboardHeight = heightDiff;
    WritableMap params = Arguments.createMap();
    WritableMap coordinates = Arguments.createMap();
    coordinates.putDouble("screenY", PixelUtil.toDIPFromPixel(mVisibleViewArea.bottom));
    coordinates.putDouble("screenX", PixelUtil.toDIPFromPixel(mVisibleViewArea.left));
    coordinates.putDouble("width", PixelUtil.toDIPFromPixel(mVisibleViewArea.width()));
    coordinates.putDouble("height", PixelUtil.toDIPFromPixel(mKeyboardHeight));
    params.putMap("endCoordinates", coordinates);
    sendEvent("keyboardDidShow", params);
} else if (mKeyboardHeight != 0 && heightDiff <= mMinKeyboardHeightDetected) {
    // keyboard is now hidden
    mKeyboardHeight = 0;
    sendEvent("keyboardDidHide", null);
}

```

嗯，安卓下的事件就在这里了。`keyboardDidShow` 和 `keyboardDidHide`。

看来 [react-native-keyboard-spacer](https://github.com/Andr3wHur5t/react-native-keyboard-spacer/blob/master/KeyboardSpacer.js)  还是很靠谱的。于是从其中抽取了键盘的逻辑，做成了 [react-native-keyboard-event](https://github.com/AngusFu/react-native-keyboard-event) 这个组件。可以使用 `npm` 来安装。

```javascript

import KeyListener from 'react-native-keyboard-event';
KeyListener.show(onkeyboardShow).hide(onkeyboardHide);
// Note
// event name is up to platform
KeyListener.hideEvent;
KeyListener.showEvent;

```

## fetch 方法

`fetch` 方法调用最好加上 `done` 方法，否则有时候会报错。

## RN 请求数量限制

网络请求数量需要做限制。不能无限请求，否则请求都会被阻塞一直发布出去。

为什么会遇到这种情况呢？因为底层有个死循环，四秒钟查找一次，是否有未上传的记录，若有则会通知前端上传，前端上传结果会反馈给底层。最后出现同一条记录反复通知反复失败的情况。通过分析日志，发现前端接到了通知，但 `fetch` 成功、失败的逻辑都没进去。

最后的解决办法，很简单，底层对请求数量做限制。


To be continued...



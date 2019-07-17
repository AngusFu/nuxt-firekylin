---
title: 判断资源并行加载完成的三种办法：计数、Promise及 $.Deferred
date: 2016-07-04
desc: 判断资源并行加载完成的三种办法：计数、Promise及 $.Deferred
tags: 
    - 原创
    - 开发心得
    - JavaScript
    - Promise
---

## 方法一：计数比较

```javascript
function loadImg(url, cb) {
    var img = new Image();
    img.src = url;
    img.onload = cb;
}

function loadImages(urlArr, afterAllLoadedFunc) {
    var count = urlArr.length;
    var loadedCount = 0;

    for (var i = count - 1; i >= 0; i--) {
        loadImg(urlArr[i], function () {
            loadedCount += 1;
            if (count === loadedCount) {
                afterAllLoadedFunc();
            }
        });
    }
}

loadImages(['./xx.jpg', './yy.jpg', './zz.jpg'], function () {
    alert('all imgs have been loaded');
});
```

## 方法二：Promise

```javascript
// 使用 Promise
// 兼容的话需要引入 es6-promise 库

var loadImg = function (url) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            resolve()  ;
        };
        img.onerror = function () {
            reject()  ;
        };
    });
};

Promise.all([
    loadImg('xxx.jpg'),
    loadImg('yyy.jpg'),
    loadImg('zzz.jpg'),
]).then(function () {
    alert('all images are loaded!')
});

```

## 方法三：$.Deferred

```javascript
// 如果有jquery
var loadImg = function (url) {
    var defer = $.Deferred();

    var img = new Image();
    img.src = url;
    img.onload = function () {
        defer.resolve()  ;
    };
    img.onerror = function () {
        defer.reject()  ;
    };

    return defer.promise();
};

$.when(loadImg('xx.jpg'), loadImg('yy.jpg'), loadImg('zz.jpg')).done(function () {
    alert('all images are loaded!')
});
```

更多请参考 [http://angusfu.github.io/slides/promise/](http://angusfu.github.io/slides/promise/)
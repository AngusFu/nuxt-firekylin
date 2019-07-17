---
title: Service Worker 生命周期
date: 2016-07-25 10:46:44
desc: Service Worker 生命周期
author: "@Ire Aderinokun"
social: https://twitter.com/ireaderinokun
permission: 0
from: https://bitsofco.de/the-service-worker-lifecycle/
tags: 
    - 翻译
    - Service Worker
---

如果使用过 Service Worker，之前你可能遇到过这样的问题，原来的 Service Worker 还在起作用，即使文件本身已经更新过。其中的原因在于 Service Worker 生命周期中的一些微妙之处；它可能会被安装，而且是有效的，但实际上却没有被 document 纳入控制。

Service Worker 可能拥有以下六种状态的一种：**解析成功（parsed）**，**正在安装（installing）**，**安装成功（installed）**，**正在激活（activating）**，**激活成功（activated）**，**废弃（redundant）**。

![Service Worker 状态](http://p0.qhimg.com/t01716a20bbd762eaba.png)


## 解析成功（Parsed）

首次注册 Service Worker 时，浏览器解决脚本并获得入口点。如果解析成功（而且满足其他条件，如 HTTPS 协议），就可以访问到 Service Worker 注册对象（registration object），其中包含 Service Worker 的状态及其作用域。

```javascript
/* In main.js */
if ('serviceWorker' in navigator) {  
    navigator.serviceWorker.register('./sw.js')
    .then(function(registration) {
        console.log("Service Worker Registered", registration);
    })
    .catch(function(err) {
        console.log("Service Worker Failed to Register", err);
    })
} 
```

Service Worker 注册成功，并不意味着它已经完成安装，也不能说明它已经激活，仅仅是脚本被成功解析，与 document 同源，而且源协议是 HTTPS。一旦完成注册，Service Worker 将进入下一状态。

## 正在安装（Installing）

Service Worker 脚本解析完成后，浏览器会试着安装，进入下一状态，“installing”。在 Service Worker `注册（registration）` 对象中，我们可以通过 `installing` 子对象检查该状态。

```javascript
/* In main.js */
navigator.serviceWorker.register('./sw.js').then(function(registration) {  
    if (registration.installing) {
        // Service Worker is Installing
    }
}) 
```
在 installing 状态中，Service Worker 脚本中的 `install` 事件被执行。我们通常在安装事件中，为 document 缓存静态文件。

```javascript
/* In sw.js */
self.addEventListener('install', function(event) {  
  event.waitUntil(
    caches.open(currentCacheName).then(function(cache) {
      return cache.addAll(arrayOfFilesToCache);
    })
  );
}); 
```

若事件中有 `event.waitUntil()` 方法，则 installing 事件会一直等到该方法中的 Promise 完成之后才会成功；若 Promise 被拒，则安装失败，Service Worker 直接进入**废弃（redundant）**状态。

```javascript
/* In sw.js */
self.addEventListener('install', function(event) {  
  event.waitUntil(
   return Promise.reject(); // Failure
  );
}); 
// Install Event will fail
```

## 安装成功/等待中（Installed/Waiting）

如果安装成功，Service Worker 进入**安装成功（installed）**（也称为**等待中[waiting]**）状态。在此状态中，它是一个有效的但尚未激活的 worker。它尚未纳入 document 的控制，确切来说是在等待着从当前 worker 接手。

在 Service Worker `注册（registration）` 对象中，可通过 `waiting` 子对象检查该状态。

```javascript
/* In main.js */
navigator.serviceWorker.register('./sw.js').then(function(registration) {  
    if (registration.waiting) {
        // Service Worker is Waiting
    }
}) 
```

这是通知 App 用户升级新版本或自动升级的好时机。

## 正在激活（Activating）

处于 waiting 状态的 Service Worker，在以下之一的情况下，会被触发 **activating** 状态。

* 当前已无激活状态的 worker

* Service Worker 脚本中的 `self.skipWaiting()` 方法被调用

* 用户已关闭 Service Worker 作用域下的所有页面，从而释放了此前处于激活态的 worker

* 超出指定时间，从而释放此前处于激活态的 worker

处于 activating 状态期间，Service Worker 脚本中的 `activate` 事件被执行。我们通常在 activate 事件中，清理 cache 中的文件。

```javascript
/* In sw.js */
self.addEventListener('activate', function(event) {  
  event.waitUntil(
    // 获取所有 cache 名称
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        // 获取所有不同于当前版本名称 cache 下的内容
        cacheNames.filter(function(cacheName) {
          return cacheName != currentCacheName;
        }).map(function(cacheName) {
          // 删除内容
          return caches.delete(cacheName);
        })
      ); // end Promise.all()
    }) // end caches.keys()
  ); // end event.waitUntil()
}); 
```

与 install 事件类似，如果 activate 事件中存在 `event.waitUntil()` 方法，则在其中的 Promise 完成之后，激活才会成功。如果 Promise 被拒，激活事件失败，Service Worker 进入**废弃（redundant）**状态。

## 激活成功（Activated）

如果激活成功，Service Worker 进入 **active** 状态。在此状态中，其成为接受 document 全面控制的激活态 worker。在 Service Worker `注册（registration）` 对象中，可以通过 `active` 子对象检查此状态。

```javascript
/* In main.js */
navigator.serviceWorker.register('./sw.js').then(function(registration) {  
    if (registration.active) {
        // Service Worker is Active
    }
}) 
```

如果 Service Worker 处于激活态，就可以应对事件性事件 —— `fetch` 和 `message`。

```javascript
/* In sw.js */

self.addEventListener('fetch', function(event) {  
  // Do stuff with fetch events
});

self.addEventListener('message', function(event) {  
  // Do stuff with postMessages received from document
}); 
```

## 废弃（Redundant）

Service Worker 可能以下之一的原因而被**废弃**（redundant，原意为“多余的，累赘的”）——

* installing 事件失败

* activating 事件失败

* 新的 Service Worker 替换其成为激活态 worker

如果 Service Worker 因前两个原因失败，我们可以通过开发者工具看到信息（以及其他相关信息）——

![Service Worker Redundant in DevTools](http://p0.qhimg.com/t0141f8766c67ce01c1.png)

如果已存在前一版本的激活态 Service Worker，它会继续保持对 document 的控制。
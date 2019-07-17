---
title: No WebSockets Over HTTP2
date: 2016-06-24
desc: No WebSockets Over HTTP2
author: "@Daniel Stenberg"
social: https://twitter.com/bagder
permission: 0
from: https://daniel.haxx.se/blog/2016/06/15/no-websockets-over-http2/
tags: 
    - 翻译
    - HTTP2
    - WebSocket
---

> 译者注： 《深入浅出 Node.js》第七章讲述 WebSocket 服务的构建中，对本文中反复提到的 `Upgrade` 有比较详细的说明。

> NO WEBSOCKETS OVER HTTP/2.

我这样说的意思是，在 HTTP/2 协议里，无法像在 HTTP/1.1 中把连接（connection）协商或提升为 WebSocket那样，如[RFC 6455](https://tools.ietf.org/html/rfc6455) 所描述的 —— 这个规范（[RFC 6455](https://tools.ietf.org/html/rfc6455)）详述了在一个 HTTP/1.1 请求中，客户端如何使用 `Upgrade: `将连 http 接转换为 WebSocket 连接。

注意 WebSocket 并非 HTTP/1 规范的一部分，它只是使用了 HTTP/1 的协议细节将 HTTP 连接转换为 WebSocket 连接。 类似地，HTTP/2 之上的 WebSocket 也不会成为 HTTP/2 规范的一部分，而是成为独立的一部分。

（附注：`Upgrade: ` 的机制，和在服务端支持的情况下，非 https 的HTTP/1.1 连接能[升级为 HTTP/2](http://httpwg.org/specs/rfc7540.html#discover-http) 是一样的。）

![chinese-socket](https://daniel.haxx.se/blog/wp-content/uploads/2010/08/chinese-socket.jpg)


## 草案

曾经有一份提交的[草案](https://tools.ietf.org/html/draft-hirano-httpbis-websocket-over-http2-01)描述了 HTTP/2 下的 WebSocket 如何实现。那时 IETF 工作组并没有对它表现出任何特别的兴趣，而且在我看来，很少有工作组有兴趣捡起这个球把它继续滚下去。它就这样，毫无进展了。

这很重要：** HTTP/2 下 WebSocket 的缺失，是因为根本没人写出来一份规范 **（及其实现）。这些事情不会自己发生，它们需要一群相信这份事业并为之努力工作的人。

HTTP/2 下 WebSocket 当然有好处，它只是连接上的一个数据流，这个连接同时也能服务于其他的非 WebSocket 的通信。而 HTTP/1 连接升级的 WebSocket 独占了整个连接。

## 替代方案 

所以 HTTP/2 下面我们拿什么来替代 WebSocket 呢？好吧，也有几个选择。可能的情况是，你要么坚持着 HTTP/2， 从 HTTP/1 升级，使用 Web 推送(Web push)，要么就走到 WebRTC 这条路上来。

如果你真的必须要坚持使用 WebSocket， 那很简单，你只需要像之前一样，从 HTTP/1 连接升级到 WebSocket。和我交谈过的大部分非常坚持 WebSocket的人都是那些开发者，他们就只需要很基本的单一的连接，所以 HTTP/1 和 HTTP/2 对他们来说没什么差别。

如果真的非常坚持使用 HTTP/2，你可以像过去使用 [长轮询](https://tools.ietf.org/html/rfc6202)那样，那会儿 WebSocket 还没被发明出来。这曾经是挺糟糕的方案，因为会浪费一个连接，而且有一个大部分时间是空闲着的连接也容易导致错误。在 HTTP/2 下面这样做，问题就少了很多，因为它只是一个不会被使用得太多的单向流，所以不会造成太多浪费。此外，连接很可能为其他数据流使用，这能减少空闲连接被 NATs 或防火墙干掉的问题。

[Web Push API](https://www.w3.org/TR/push-api/) 是 W3C 2015年带来的一个和 WebSocket 这样人工化的、“粗糙”的方式相比， 更有 Web 范儿的（more “webby”）推送方式。如果你主要是拿 WebSocket 来推送消息通知，这可能是更方便的选择。

WebSocket 之后引入的是 [WebRTC](http://w3c.github.io/webrtc-pc/)。这是用来解决浏览器之间通信的，不过拿过来做 WebSocket 曾被拿来做过的一些事情肯定也是一种选择。

## 未来

HTTP/2 下的 WebSocket *可能* 还是会被实现。它没被完成的实际情况，只能表明人们还没有足够的兴趣。

## Non-TLS

想一想，浏览器只能在 [TLS 之上使用 HTTP/2](https://daniel.haxx.se/blog/2015/03/06/tls-in-http2/)，而 WebSocket 只需通过普通的 TCP 连接就能完成。实际上，将 HTTP 连接提升到 WebSocket 的唯一途径就是使用 HTTP/1 中 `Upgrade: `响应头的小把戏，而不是 HTTP/2 为了减少需要的往返数量而使用的用于 TSL 的应用层协议(ALPN)的办法([ALPN method for TLS](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation))。

如果真有人要把 WebSocket 引入到 HTTP/2 中，他们很可能只能通过浏览器内部使用 TLS 来实现。
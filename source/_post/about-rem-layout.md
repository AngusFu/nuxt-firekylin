---
title: 关于移动端 rem 布局的一些总结
date: 2015-08-31
desc: 关于移动端 rem 布局的一些总结
tags: 
    - 原创
    - rem
---

## 【资源一】基础知识恕不回顾

基础知识参考以下两篇博客：

http://isux.tencent.com/web-app-rem.html

http://www.w3cplus.com/css3/define-font-size-with-css3-rem


## 【资源二】淘宝m站首页的动态实现

学习http://m.taobao.com 首页的实现。

**最近读到[@大漠][1]的新文章《[使用Flexible实现手淘H5页面的终端适配][2]》，和本部分有点关系。暂且加上来以供参考。（updated 2015-11-24）**

源码进行美化、解读之后，基本布局部分的代码已经被我还原出来了：（2016-01-13补充：后来才发现，早就开源在[github][3]上了）

```js
!function(win, lib) {
    var timer,
        doc     = win.document,
        docElem = doc.documentElement,

        vpMeta   = doc.querySelector('meta[name="viewport"]'),
        flexMeta = doc.querySelector('meta[name="flexible"]'),
 
        dpr   = 0,
        scale = 0,
 
        flexible = lib.flexible || (lib.flexible = {});
 
    // 设置了 viewport meta
    if (vpMeta) {
 
        console.warn("将根据已有的meta标签来设置缩放比例");
        var initial = vpMeta.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
 
        if (initial) {
            scale = parseFloat(initial[1]); // 已设置的 initialScale
            dpr = parseInt(1 / scale);      // 设备像素比 devicePixelRatio
        }
 
    }
    // 设置了 flexible Meta
    else if (flexMeta) {
        var flexMetaContent = flexMeta.getAttribute("content");
        if (flexMetaContent) {
 
            var initial = flexMetaContent.match(/initial\-dpr=([\d\.]+)/),
                maximum = flexMetaContent.match(/maximum\-dpr=([\d\.]+)/);
 
            if (initial) {
                dpr = parseFloat(initial[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
 
            if (maximum) {
                dpr = parseFloat(maximum[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
        }
    }
 
    // viewport 或 flexible
    // meta 均未设置
    if (!dpr && !scale) {
        // QST
        // 这里的 第一句有什么用 ?
        // 和 Android 有毛关系 ?
        var u = (win.navigator.appVersion.match(/android/gi), win.navigator.appVersion.match(/iphone/gi)),
            _dpr = win.devicePixelRatio;
 
        // 所以这里似乎是将所有 Android 设备都设置为 1 了
        dpr = u ? ( (_dpr >= 3 && (!dpr || dpr >= 3))
                        ? 3
                        : (_dpr >= 2 && (!dpr || dpr >= 2))
                            ? 2
                            : 1
                  )
                : 1;
 
        scale = 1 / dpr;
    }
 
    docElem.setAttribute("data-dpr", dpr);
 
    // 插入 viewport meta
    if (!vpMeta) {
        vpMeta = doc.createElement("meta");
         
        vpMeta.setAttribute("name", "viewport");
        vpMeta.setAttribute("content",
            "initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no");
 
        if (docElem.firstElementChild) {
            docElem.firstElementChild.appendChild(vpMeta)
        } else {
            var div = doc.createElement("div");
            div.appendChild(vpMeta);
            doc.write(div.innerHTML);
        }
    }
 
    function setFontSize() {
        var winWidth = docElem.getBoundingClientRect().width;
 
        if (winWidth / dpr > 540) {
            (winWidth = 540 * dpr);
        }
 
        // 根节点 fontSize 根据宽度决定
        var baseSize = winWidth / 10;
 
        docElem.style.fontSize = baseSize + "px";
        flexible.rem = win.rem = baseSize;
    }
 
    // 调整窗口时重置
    win.addEventListener("resize", function() {
        clearTimeout(timer);
        timer = setTimeout(setFontSize, 300);
    }, false);
 
     
    // 这一段是我自己加的
    // orientationchange 时也需要重算下吧
    win.addEventListener("orientationchange", function() {
        clearTimeout(timer);
        timer = setTimeout(setFontSize, 300);
    }, false);
 
 
    // pageshow
    // keyword: 倒退 缓存相关
    win.addEventListener("pageshow", function(e) {
        if (e.persisted) {
            clearTimeout(timer);
            timer = setTimeout(setFontSize, 300);
        }
    }, false);
 
    // 设置基准字体
    if ("complete" === doc.readyState) {
        doc.body.style.fontSize = 12 * dpr + "px";
    } else {
        doc.addEventListener("DOMContentLoaded", function() {
            doc.body.style.fontSize = 12 * dpr + "px";
        }, false);
    }
  
    setFontSize();
 
    flexible.dpr = win.dpr = dpr;
 
    flexible.refreshRem = setFontSize;
 
    flexible.rem2px = function(d) {
        var c = parseFloat(d) * this.rem;
        if ("string" == typeof d && d.match(/rem$/)) {
            c += "px";
        }
        return c;
    };
 
    flexible.px2rem = function(d) {
        var c = parseFloat(d) / this.rem;
         
        if ("string" == typeof d && d.match(/px$/)) {
            c += "rem";
        }
        return c;
    }
}(window, window.lib || (window.lib = {}));

```
**注意：**
淘宝首页在iPhone4上设置的initial-scale是0.5（其他尺寸类似）。

因此，这句在iPhone4上得出的结果是640：

```javascript
var winWidth = docElem.getBoundingClientRect().width;  
```

正是因为淘宝这种独特的设置，使得 ios 上 1px边框的问题完美解决（1px变2px， 又被 `initial-scale=0.5` 缩小了一半）。

## 【资源三】常规情况下js根据屏幕宽度动态计算

使用js动态计算：

```js

!(function(doc, win) {
    var docEle = doc.documentElement,
        evt = "onorientationchange" in window ? "orientationchange" : "resize",
        fn = function() {
            var width = docEle.clientWidth;
            width && (docEle.style.fontSize = 20 * (width / 320) + "px");
        };
     
    win.addEventListener(evt, fn, false);
    doc.addEventListener("DOMContentLoaded", fn, false);
 
}(document, window));

```
## 【资源四】媒体查询较密集的断点

使用css3 media query 实现

```css
@media screen and (min-width: 320px) {
    html {font-size: 14px;}
}
 
@media screen and (min-width: 360px) {
    html {font-size: 16px;}
}
 
@media screen and (min-width: 400px) {
    html {font-size: 18px;}
}
 
@media screen and (min-width: 440px) {
    html {font-size: 20px;}
}
 
@media screen and (min-width: 480px) {
    html {font-size: 22px;}
}
 
@media screen and (min-width: 640px) {
    html {font-size: 28px;}
}

```

## 【资源五】强大的单位——vw

使用单位 vw 实现动态计算。

```css
html {
    font-size: 31.25vw; /* 表达式：100*100vw/320 */
}
```

不过考虑到国内兼容性的问题，还是结合媒体查询来使用比较好。（媒体查询的断点暂时是借用上面的例子）
 
![图片描述][4]

```css
@media screen and (min-width: 320px) {
    html {
        font-size: 100px;
    }
}
 
@media screen and (min-width: 360px) {
    html {
        font-size: 112.5px;
    }
}
 
@media screen and (min-width: 400px) {
    html {
        font-size: 125px;
    }
}
 
@media screen and (min-width: 440px) {
    html {
        font-size: 137.5px;
    }
}
 
@media screen and (min-width: 480px) {
    html {
        font-size: 150px;
    }
}
 
@media screen and (min-width: 640px) {
    html {
        font-size: 200px;
    }
}
 
html {
    font-size: 31.25vw;
}
```

----------

## 【总结】

对以上种种方法的综合：

1、meta:viewport,  还是initial-scale为 1；

2、320px屏幕下，把页面根元素html的字体大小设置为50px；

3、鉴于我们拿到的设计图目前是640px宽的基准，这样我们就不用每次自己除以2了，直接在PS中量就好；

4、宽度什么的最好还是用百分比处理；涉及到高度、字体大小之类的则用rem。

eg：
设计稿上，div高度为40px；那么css就是 `div {height: 0.4rem;}` 

结果就只剩下一步转换：设计稿上量的长度转化为小数。 `50% => 0.5`  这种计算，不要太简单。。。

【方法一】纯粹css，支持calc函数的动态计算；不支持的用css媒体查询断点，优雅降级。

```css
@media screen and (min-width: 320px) {
    html {
        font-size: 50px;
    }
}
 
@media screen and (min-width: 360px) {
    html {
        font-size: 56px;
    }
}
 
@media screen and (min-width: 400px) {
    html {
        font-size: 63px;
    }
}
 
@media screen and (min-width: 440px) {
    html {
        font-size: 69px;
    }
}
 
@media screen and (min-width: 480px) {
    html {
        font-size: 75px;
    }
}

/**
 * 2016-01-13 订正
 * 做适当限制
 * 大于640的屏幕 固定为100px
 * 同时需要对body或者最外层wrapper做max-width: 640px的限制
 */
/*
@media screen and (min-width: 640px) {
    html {
        font-size: 100px;
    }
}

html {
    font-size: 15.625vw;
}
*/

html {
    font-size: 15.625vw;
}

@media screen and (min-width: 640px) {
    html {
        font-size: 100px;
    }
}

```
 
【方法二】脚本动态计算

**大前提：**

1、initial-scale 为 1；

2、在项目css中(注意不要被公共的base、common之类的影响了，资源加载顺序也是蛮重要的)，先把html的fontSize设置为 50px（或者加上媒体查询代码）, 避免加载未完成时候样式错乱; 

```css

/* css */
html {font-size: 50px;}
```

```javascript
/* javascript */

!(function(win, doc){
    function setFontSize() {
        // 获取window 宽度
        // zepto实现 $(window).width()就是这么干的
        var winWidth =  window.innerWidth;
        // doc.documentElement.style.fontSize = (winWidth / 640) * 100 + 'px' ;
        
        // 2016-01-13 订正
        // 640宽度以上进行限制 需要css进行配合
        var size = (winWidth / 640) * 100;
        doc.documentElement.style.fontSize = (size < 100 ? size : 100) + 'px' ;
    }
 
    var evt = 'onorientationchange' in win ? 'orientationchange' : 'resize';
    
    var timer = null;
 
    win.addEventListener(evt, function () {
        clearTimeout(timer);
 
        timer = setTimeout(setFontSize, 300);
    }, false);
    
    win.addEventListener("pageshow", function(e) {
        if (e.persisted) {
            clearTimeout(timer);
 
            timer = setTimeout(setFontSize, 300);
        }
    }, false);
 
    // 初始化
    setFontSize();
 
}(window, document));

```

嗯。。。

就这么愉快地结束了。。。

不知道解读了某宝首页的一点点代码，然后发在这里，会不会有什么后果。。。

==================================================

## 2016年1月13日补充

写过这篇博客之后，又陆续读过几篇关于布局的文章。

具体已经忘了，大约是大漠的文章，还有一篇应该是搜车前端的博文，另外应该还有关于手淘首页的分析的文章。

另外，自己也用rem布局实践过几个项目。

不得不说，个人觉得rem布局现在已经可以放弃了。`flex`布局已经很好用了，早已有之的百分比布局等稍用点心思也并不难。

这篇博客一直想改。但懒惰总是占据着我的身体。

最后再说下，字体大小自适应是错误的，字体大小自适应是错误的，字体大小自适应是错误的。

rem 布局，可以告别了。

迎接 flex 布局吧。


=========================================

### 写在最后

这篇博客写于半年前，那时候还是个刚毕业的菜鸟。

偶尔有点想法，看了一些大牛的文章，有了这篇博客。

这也是半年来唯一一篇产出。

5k的浏览量，95收藏，13推荐，已经让我很惊讶了。

谢谢各路大神们的关注。

半年来感受到的前端大环境变化还是很大。虽然在公司没有太多变化，但眼睛总得看着世界吧。

接下来，还得继续学习。

由于手上没什么项目，一直想探索出一套自己的自动化流程，但到现在也只是积累了许多版的草稿。

`nodejs`方面也得有所探索，`nodejs` 再加上 `shelljs` 和 `yargs` 用起来是真的很爽。（[鸣谢阮大神的文章][5]）

算是年终总结了。在前端的路上继续走吧。

=========================================

### 一点想法：评论区的回复

媒体查询和js动态计算是两种方式。

首先，支持 CSS3 `calc`方法 和 `rem`、`vw`单位的浏览器下，只需要`html {font-size: 15.625vw;}`这样一句就好，另外加个媒体查询限制下。

之前的一大堆密集的断点只是为了hack不支持`calc`或者`calc`的情况。其次，js动态设置html的`font-size`，只要浏览器支持rem单位即可。

为什么会考虑到密集的mq断点呢，因为当时还在考虑文字大小的自适应问题。

实践证明，字体大小自适应是一种错误的想法。

移动开发在必要情况的下，可以适当使用mq来调整字体大小，但做成完全自适应则是一种存在问题的做法。

因此，这里提到的 `calc`和`vh` `rem`配合的做法，最好只用来做布局的工作。js动态计算也是类似，更适合做布局。


  [1]: http://www.w3cplus.com
  [2]: http://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html
  [3]: https://github.com/amfe/lib-flexible
  [4]: https://segmentfault.com/img/bVpJlx
  [5]: www.ruanyifeng.com/blog/2015/05/command-line-with-node.html
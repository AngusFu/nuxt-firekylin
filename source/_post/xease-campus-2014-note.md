---
title: 某易 2014 校招面试总结
tags:
  - 原创
  - 面试
date: 2014-09-24
desc:
---

今天参加了某易的前端开发工程师一面。

算是离“前端”这两个字又近了一步吧——好吧，虽然我一面就跪了。

其实只是压根儿就没做面试的准备，因为对博主这种“技术爱好者”来说，某易的前端笔试题比某度变态 N 倍（仔细想想其实还是某度的笔试比较有质量），前 22 道选择基本靠蒙，最后居然接到面试通知了。

面试问了很多基本的问题。直到面试结束，博主才发现自己为自己挖了无数的坑。唉，都是泪。

初次面试的压力之下，面试有一些基本的问题没有被我解决或者答错了。下面依次来说说看。

第一题，10个 div，点击任意一个后打印出点击的的index。

so easy，果断用了 `aLi[i].index = i` 的方法。面试官复又问道闭包如何实现。

压力之下，博主竟然木有答粗来！！！现在再想想，真是自杀的心都有了！！！

回来之后想到的两种方法如下：

```javascript
var oUl = document.getElementsByTagName("ul")[0];
var aLi = oUl.children;

//常规方法
for(var i=0; i<aLi.length; i++){
    aLi[i].index = i;
    aLi[i].onclick = function(){
        console.log(this.index);
    };
}

//方法1
for(var i=0; i<aLi.length; i++){
    (function (idx){
        aLi[idx].onclick = function(){
            console.log(idx);
        };
    })(i);
}

//方法2
for(var i=0; i<aLi.length; i++){
    aLi[i].onclick = function(){
        var j = i;
        return  function(){
            console.log(j);
        };
    }();
}
```

第二个问题， CSS 实现首尾高度固定、中间高度自适应的 DIV 布局，没回答清楚。

最后百度了一番，看到[一篇文章](http://www.cnblogs.com/ckmouse/archive/2012/02/14/2351043.html) 。问题基本被解决了。只能怪自己基础不牢。

码基本参考前引文章，感谢作者解惑。

```html
<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <title>Document</title>
</head>
<body>
    <div class="con">
        <div class="top"></div>
        <div class="md"></div>
        <div class="bottom"></div>
    </div>
    
    <style>
        *{margin:0; padding:0;}
        html,body,.con{height:100%;width:100%;height:100%;width:100%;}            
        div{position:absolute;}
        .top,.bottom{width:100%;height:100px;z-index:5;}
        .top{background:red;top:0;}
        .bottom{background:black;bottom:0;}
        .md{
            width: 100%;
            background: #a7fad7;
            overflow: auto;
            top: 100px;
            bottom: 100px;
            position: absolute;
            _height: 100%;
            _border-top: -100px solid #eee;
            _border-bottom: -100px solid #eee;
            _top: 0;/*http://www.cnblogs.com/ckmouse/archive/2012/02/14/2351043.html*/
        }
    </style>
</body>
</html> 
```

重点有二。

其一是 absolute 定位的 div 的宽高可以由设置 top、right、bottom、left 等属性来控制，如此一来自适应的问题得到解决；

其二是 IE6 特殊的盒模型（width、height 将 border 包含在内），所以用一个 css hack 将其上下 border 设置为负数，高度设为百分之百）：

最后，还有一个基础问题。且mark之。  

```html
<div style="font:100px/200px Microsoft Yahei;width:660px;height:200px;text-overflow:ellipsis;">
    天地玄黄宇,宙洪荒日月。
</div>
<style>
    div {
        /*超出宽度的不可见*/
        overflow: hidden;
        /*不换行（除非遇到"<br>"）*/
        white-space: nowrap;
        /*以“...”方式表示文本隐藏。*/
        /*博主当时很肯定地说用这就够了，完全把上面两行忘得干干净净*/
        text-overflow: ellipsis;
    } 
</style> 
```

最后，以一句诗结束博主失败的面试：我本将心向明月，奈何明月照沟渠。


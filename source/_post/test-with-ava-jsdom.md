---
title: 使用 ava 和 jsdom 测试前端界面
date: 2016-06-29
desc: 使用 ava 和 jsdom 测试前端界面
tags: 
    - 原创
    - 测试
    - JavaScript
---

## 2016-09-03 更新

随着在工作学习中更多地接触、使用测试工具，发现自己在本文中的一些记录是不准确、不正确的。

今天（九月三日）在家看了 NingJs 的直播，其中有一个分享是关于测试框架的，非常棒，之后有可能的话还是找来视频再学习下。

是的，两个月前的理解，是很初级很浅陋的。

继续学习，继续钻研吧。

## 交代前因

前些天接手了一个旧项目。幸好不是在原来的基础上做些修修改改的工作，可以算是开发新版的。

把前面同事留下来的代码 down 下来，看了一下。总体还是挺好的。还有 ``macha + chai`` 的测试目录。

我也是最近一段时间开始接触测试。很久之前看了阮大神写的 mocha 教程，不过也就看看，写写简单的 demo。

前同事留下的测试，是基于浏览器的，主要还是功能测试。这里不详细说怎么在浏览器端使用 mocha 测试了。因为涉及到交互的反馈、追踪，所以采用的方式是，先用 iframe 加载待测页面，然后用 ``contentWindow`` 的方式拿到 iframe 的环境，再做一些操作。手动触发一些功能，然后再去判断相应的变化有没有发生。

本地启动了一个 server，浏览器里跑了几遍测试。最后发现的问题是，有一个点击测试怎么都过不了。于是又开启了阅读代码的过程。

最后发现了问题所在，页面使用的是自己封装的 tap 事件，整个事件系统也是对原生 Element 原型的拓展。可是怎么触发 tap 呢？前同事用了 `touchend`。可是并没有用啊， tap 事件的触发可是结合了从 touchstart 开启一系列事件参数的判断的。

后来我就想，浏览器端功能测试，能不能也拿到命令行上面来呢？



## 从 mocha 转到 ava

正在此时，我想起了 ``jsdom`` 这个大神级作品。

一开始打算用 ``mocha + jsdom`` 跑一把。<del>折腾了几次发现，mocha 这家伙不好适应异步的工作，这事情很难搞啊。</del>

可能要交代下我做了什么，嗯，我加载了一个 jquery 脚本，这样就得外部文件，于是就有异步场景了。试了好多遍，mocha 还是没能实现我的期望。（你也可以拿 mocha 试试看，多试几次，如果单纯靠那个 ``done`` 你就能成功，那么请私信我哟。）

又想想白天乱逛 github 的时候，在一些个项目中看到了 ``ava`` 这个测试工具。搜索一番，据说正适用于异步场景。

好，那就来试试看呗。前因交代清楚了，下面开始正式进入教程阶段。


## 开始讲 demo

我将自己的 demo 放到了 github 上，地址是[https://github.com/AngusFu/jsdom-ava-demo](https://github.com/AngusFu/jsdom-ava-demo)。你可以直接克隆项目，然后在本地跑起来。

因为是 demo，项目内容很简单，两个 js，一个用于测试 html 文件。


## 测试场景

先说测试场景：页面上有一个红色背景的 div，通过原生的 addEventListener 绑定了 click 事件。点击之后，将背景色变换为绿色。就酱简单？对，主要就这个，一方面我是想测试下 jsdom 对事件系统和 css 解析的支持（手动触发事件，css 解析和值变化），一方面是想试试这种异步场景下怎么更好地测试。

那些对测试脚本运行速度有非常严格要求的同学请想好了再往后看。因为根据我的经验，jsdom + ava 这俩组合起来，速度确实慢得不行。我还没仔细探究原因，但想来无非以下几点：

- 测试脚本要经过 babel 6 编译一遍，有耗时；

- jsdom 系统比较庞大，解析起来费劲；

- 我使用了 jsdom 的 jQueryify 方法从外部加载了 jQuery 文件（但这方法确实给力）；

- ava 本身其他方面的问题；


暂且忍着点。

核心 html 如下：

```html
<style>
    div {width: 500px; height: 500px; background-color: red;}
</style>
<div id="div"></div>

<script>
    document.getElementById("div").onclick = function () {
        this.style.backgroundColor = 'green';
    };
</script>
```

## 测试工具安装

下面来谈工具的安装。


首先安装 jsdom，这倒是很简单：

```bash
$ npm install --save jsdom
```

接着安装 ava，最好先全局安装一遍：

```bash

$ npm install -g ava

$ npm install --save ava

```

然后为了方便使用 ``npm test`` 命令，执行下面的命令：

```bash
$ ava --init
```

这一行的目的是将 ava 命令放到你的 ``package.json`` 中的 ``scripts`` 字段中，方便之后使用 ``npm test`` 直接开启跑测试。当然你也可以不管这一步，我就比较喜欢自己敲 ``ava xx.js`` 这样子。


## 编写测试

好了，环境安装完毕。下面来看脚本。

```javascript

import fs from 'fs';

import { jsdom } from 'jsdom';

import test from 'ava';

```

ava 在运行时会通过 babel 6 对测试脚本进行编译，因此完全可以自由发挥，generator、async & await 什么的都尽情地用吧。而且作者也是建议和支持这样做的，简单明了的测试脚本，重要性有时候可能和测试本身一样重要。

引入 fs 是为了读取我们的 html 文件。

关于 jsdom 的用法，更多的可以参考 [https://github.com/tmpvar/jsdom](https://github.com/tmpvar/jsdom)，看项目的文档。这里我使用的是简单易懂的 ``require('jsdom').jsdom`` 形式，便于以同步的形式解析生成我们需要的 window 对象，如下：


```javascript

var window = jsdom(fs.readFileSync('./test.html')).defaultView;

```

一个挺好用的方法是 ``jsdom.jQueryify``，能向页面注入 jQuery。不过这是个异步的方法（废话），所以这里我使用了 Promise，也是为了方便之后使用 async & await 语法。

```javascript
function jsdomTest() {
    return new Promise(function (resolve, reject) { 
        jsdom.jQueryify(window, "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.js", function () {
            resolve(window.jQuery);
        });
    });
}
```

ava 的测试用例写起来也挺简单，来看代码：


```javascript

test('点击测试', async t => {
    var $ = await jsdomTest();

    var $div = $('#div');

    var colorBeforeClick, colorAfterClick;

    console.log(colorBeforeClick = $div.css('background-color'));

    $div.trigger('click');

    console.log(colorAfterClick = $div.css('background-color'));
    
    t.not(colorBeforeClick, colorAfterClick, 'bgColor changed');
});


```

``test`` 的第一个参数是测试用例的名称，第二个参数是一个函数，该函数会注入 ``t`` 对象。我们所有的断言都是通过这个注入的 ``t`` 进行的。

友情提示：ava 的文档地址，[https://github.com/avajs/ava](https://github.com/avajs/ava)，也有中文版，但是没更新同步，所以建议还是看英文，否则用了一些过时的 API，以后升级之后追悔莫及。

来说上面的代码。首先我们使用的是 async & await 语法，整个看起来比回调函数嵌套要整洁许多，整个流程看起来也相对清楚。

第一步是先等待 jQuery 注入成功，拿到 ``$``。其实这一步可有可无，我纯粹是为了测试 jsdom API，并且懒得手动写 dispatch 事件的代码才这么干的。

接下来就开始 DOM 查询，然后先获取 div 当前的背景色并打印出来。接着手动触发 click 事件，然后再次获取 div 的背景色并打印。最后将触发点击前后的两个颜色值拿来对比。

依葫芦画瓢，差不多就这么搞定了。

打开命令行，进入工作目录，然后开始测试：

```bash

$  ava -v parallel.js

```

相信我，``-v`` 参数可以让你的命令行界面显得比较安静一些。

如果你想要使用 ``npm test`` 这样的命令来测试，请进一步阅读文档进行相关配置（将上面的 ``ava`` 换成 ``nom test``是没用的哦）。这里主要还是为了简便。


## 友情提示

友情提示第二波：会不会怀疑，触发点击事件之后，颜色立马就变了？不存在延迟、异步么？答案是 yes，真的不存在。假如你和我一样在这里犹豫了，那么说明存在这样两种可能性：

- js 基础不够牢，对相关机制的了解还不透彻

- 你被各种异步玩怕了（hybrid / RN 后遗症 ）

当时为了应对“潜在的异步”（啊我想到了迫害狂想症），我特意做了几百毫秒的 ``setTimeout`` 延时。结果呢，断言的谓词（not、same、notSame等等）各种正向、反向都试了一遍，测试永远通过。什么鬼？说好的良好的异步支持呢？后来再去看文档，发现人家写得清清楚楚：

> You must define all tests synchronously. They can't be defined inside setTimeout, setImmediate, etc.
> 所有测试必须同步定义。不能放在 setTimeout、setImmediate 等方法里面。

所以，真的，认真读文档是很有必要的。

真正遇到要延时的，怎么办？我想，Promise 会解救你的。


## 并行与串行

ava 声称是很高效的。通常情况下，同一个文件里测试都是并行的，并不一定按照顺序执行。

还以上面的代码为例。为了测试一下，我选择了投机取巧。不是并行吗？那我就检测 jQuery 存不存在就不行了吗？因为我们的 ``test`` 中，是异步加载 jQuery 的。所以如果测试是并行的，那么不一定能够检测到 ``window.$`` 的存在。

所以就有了 [parallel.js](https://github.com/AngusFu/jsdom-ava-demo/blob/master/parallel.js) 这个文件。添加的测试用例如下：

```javascript

test('串行测试', function (t) {
    console.log(window.$)
    t.true(!!window.$, '串行失败');
});

```

可是，如果我就要串行呢？

还好作者也想到了这种情况。将所有的 ``test`` 改成 ``test.serial`` 即可（见 [serial.js](https://github.com/AngusFu/jsdom-ava-demo/blob/master/serial.js)）。

需要说明的是，所谓的串行执行，只是在同一个测试文件中存在，同时测试多个文件的时候，就总体而言仍然是并行的。


## 结尾

ava 还有很多的用法和需要注意的地方。最好的办法还是看文档，然后自己写 demo，反复领会，并应用在实际业务中。

上面提到的内容，可能有不少错误。希望懂行的大神们能够提出来。

突然想到古人说，“苟日新，又日新，日日新”。

虽然经过今人考证，这也许只是类似甲骨文的祭祀记录的误读。但几千年来，这种“新”的精神始终在。

程序世界里，变化更是无时不在。今天的工具，明天也许就会被淘汰。

其实说到底，能够解决需求，能够方便高效使用的，才是最好的。

向做出这些工具的大神们致敬。


## 更新

### a 标签点击事件的坑

``a`` 标签的点击事件用了事件代理，然后通过手动触发无效。

经测试，在浏览器也有这种问题。

解决办法是直接使用 ``$('a')[0].click()``，原生的 ``click`` 方法比较靠谱。
    
参考： [http://stackoverflow.com/questions/773639/how-can-i-simulate-an-anchor-click-via-jquery](http://stackoverflow.com/questions/773639/how-can-i-simulate-an-anchor-click-via-jquery)

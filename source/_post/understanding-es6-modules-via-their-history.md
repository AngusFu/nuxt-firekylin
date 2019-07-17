---
title: 从发展历史理解 ES6 Module
date: 2016-07-22 15:16:30
desc: 从发展历史理解 ES6 Module
author: "@Elias Carlston"
social: https://twitter.com/ejmusicode
permission: 0
from: https://www.sitepoint.com/understanding-es6-modules-via-their-history/
tags: 
    - 翻译
    - ES6
    - JavaScript
    - 模块化
---

在很长一段时间内， ES6 带来了 JavaScript 最大的变化，包括管理大型、复杂代码库的一些新特性。这些特性，主要是 import 和 export 关键词，共同被称为 modules。

如果你现在还是 JavaScript 新手，特别是从其他已有内建模块（各种名字如 module、package、unit）支持的语言转过来的，ES6 的模块设计可能看起来挺奇怪的。很多从 JavaScript 社区多年来出现的用以弥补问题的解决方案而来设计都缺少内建的支持。

我们来看看，JavaScript 是如何克服每种方案的挑战的，还有哪些没能解决。最后我们会看清楚，这些方案是怎样影响 ES6 模块设计的，以及 ES6 是如何面向未来定位的。


## script 标签及其争议

最初，HTML 局限于面向文本的元素，一种非常静态的方式来处理。早期浏览器中最流行的 Mosaic 在所有 HTML 结束下载之前不会呈现任何内容。在使用拨号连接的九十年代初期，毫不夸张地说，这可能让用户盯着屏幕等待数分钟，两眼空空。

九十年代中期，网景浏览器甫一出现即人气暴涨。像当今的破坏性创新者一样，网景通过改变，推开了普遍不为人喜的边界。网景的许多创新之一便是边下载 HTML 边渲染，让用户得以尽快开始阅览，这标志着 Mosaic 的末日到来。

在 1995 年著名的 10 天时间里， Brendan Eich 为网景发明了 JavaScript。他们没有从动态地为网页编写脚本的主意来创造 —— 这方面 ViolaWWW 已经领先他们 5 年了 —— 而是更像[艾萨克歌手的缝纫机][Isaac Singer’s sewing machine](https://en.wikipedia.org/wiki/Isaac_Singer#I._M._Singer_.26_Co)，他们的流行使他们成为概念本身的同义词。

script 标签的实现需要追溯到阻塞 HTML 下载、渲染。由于那时候公共的可用通信资源的限制，无法处理同时获取两份数据源，所以当浏览器在标记中看到 script 时，会停止执行 HTML，转换到 JS 处理。另外，任何影响 HTML 渲染的通过浏览器提供的称为 DOM 的 API 进行的 JS 动作，对就算是当时最前沿的奔腾 CPU 都会造成计算紧张。因此当 JavaScript 结束下载的时候，会解析并执行，在此之后才能继续从断掉的地方开始处理 HTML。

一开始，几乎没有程序员进行大量的 JS 工作。尽管它的名字表明，JavaScript 相比于其服务端的亲故如 Java、ASP 等只是二等公民。世纪之交的时候，JavaScript 还是局限于客户端，服务端对其毫无影响 —— 通常只是简单的表单交互，如使第一个文本框获取焦点，或者在提交之前检验用户输入。那时候，AJAX 还只是一种家用清洁烧碱（*译者注*：好奇的读者可以看看 [http://www.ajaxdrains.com/services/emergency-drain-clearing/](http://www.ajaxdrains.com/services/emergency-drain-clearing/)）， 而几乎所有重要的的动作都需要从客户端到服务器再返回这样的完整来回，几乎所有 Web 开发者都是后端，压根看不上这“玩具”语言。

你赶上最后这段时间了吗？检验单个表单的单个文本域可能挺容易，但检验多个表单的多个文本域就复杂了 —— 确实，JS 代码也是如此。随着客户端脚本不可否认的可用性好处越来越明显，太多普通的 script 标签的问题也出现了：DOMReady 通知难以预料，文件合并中的变量冲突，依赖管理……无奇不有。

JS 开发者很容易找到工作，但很难觉得享受。2006 年 jQuery 出现的时候，开发者们亲切地接纳了。今天，排名前一千万的网站中，[65%](https://channel9.msdn.com/Blogs/BeLux-Developer/Riding-the-Modern-Web-CSS-Vendor-Prefixes/?wt.mc_id=DX_838516) 到 [70%](http://libscore.com/#libs) 都在使用 jQuery。但它从来没想过也几乎没做过什么解决构建的问题：这个“玩具”语言碰到了大时代，需要大时代的技巧。

## 我们到底需要什么？

幸运的是，其他语言已经碰到了复杂性障碍，并寻找到了解决方案：[模块化编程](https://en.wikipedia.org/wiki/Modular_programming)。模块化促进了大量的最佳实践：

1. **分离**：代码需要[分离](https://en.wikipedia.org/wiki/Separation_of_concerns)成小块，以便能为人所理解。最佳实践建议这些小块采用文件形式。

2. **可组合性**：在一个文件中编码，被许多其他文件重复使用。这提升了代码库的灵活性。

3. **依赖管理**：可能有 65% 的网站使用了 jQuery，但如果你的产品只是一个需要特定版本的网站插件呢？如果适合，你想要复用已有版本，否则再去加载。

4. **命名空间管理**：类似于依赖管理 —— 你能在不重写核心代码的前提下改变文件位置吗？

5. **一致性实现**：同样的问题，不应当每个人都有自己的一套解决方案。

## 早期解决方案

JavaScript 开发者们想出来的每种解决方案都对 ES6 模块结构产生过影响。我们会重温进化过程中的主要里程碑，社区在每一步中学到了什么，最后使用如今的 ES6 模块的形式展示结果。

1. **对象字面量模式**

2. **立即执行函数（IIFE）/揭示模块（Revealing Module）模式**

3.  **CommonJS**

4.  **AMD**

5.  **UMD**

### 对象字面量模式

![Object Literal Pattern](http://p0.qhimg.com/t0115dbced180643654.jpg)

JavaScript 已有了组织代码的内建结构：对象。对象字面量语法被用作早期组织代码的模式：

![Example code 1](http://p0.qhimg.com/t01fdd1a89b99861be8.png)

```html
 <!DOCTYPE html>
<html>
  <head>
    <script src="person.js"></script>
    <script src="author.js"></script>
  </head>
  <body>
    <script>
        person.author.doJob('ES6 module history');
    </script>
  </body>
  <script>
    // 共享作用域意味着其他代码可能会在无意中破坏我们的代码
    var person ='all gone!';
  </script>
</html> 

```

#### 好处

这种方法的主要好处是易于理解和实现。许多其他方面都不容易。

#### 阻碍

它依赖于全局作用域中的变量（person）；如果页面上的其他脚本声明了同名的变量，你的代码就会消失的无影无踪！另外，没有可复用性 —— 如果我们想让[猴子打字](http://babylonjs.com/),那就得重复 author.js文件了：

![Example code 2](http://p0.qhimg.com/t01b463505c5e328512.png)

最后，文件下载的顺序很重要。如果 person 或 monkey 一开始就不存在，那么所有的 author 都会出错。

### 立即执行函数/揭示模块模式

![IIFE revealing module pattern](http://p0.qhimg.com/t019cb492b6a6ec319d.png)

IIFE （根据该词[作者](http://dev.modern.ie/tools/staticscan/?wt.mc_id=DX_838516) Ben Alman 的说法，读作“iffy”）指的是立即执行的函数表达式。函数表达式是被包裹在第一组圆括号中的 function 关键字及函数体。第二组圆括号的作用是调用函数，将其中的所有参数传给函数。函数表达式调用返回一个对象，这样我们就得到了揭示模块模式：

![Example code 3](http://p0.qhimg.com/t019cf7ac589ae93c6c.png)

```html
 // IIFEPage.html
<!DOCTYPE html>
<html>
  <head>
    <script>
      // set init values
      var outerName ='Ross';
    </script>
    <script src="person.js"></script>
    <script src="monkey.js"></script>
    <script src="author.js"></script>
    <script>
      // we can get rid of person after author has loaded....
      person =undefined;
    </script>
  </head>
  <body>
    <script>
      // ...and author will still work here
      author.doJob('ES6 Module History');
    </script>
  </body>
</html> 

```

#### 好处

由于闭包，我们在 IIFE 内部可以拥有许多控制权。比如说，`innerName` 本质上是私有的，因为外面无法访问到 —— 我们选择通过对象的  name 属性揭示了其访问权。我们有了引入依赖的控制权 —— 如果需要函数外的其他东西（通常是 jQuery 的 “$”），可以将外面的名称放在参数中，而在函数体内部使用其他的任意的，名字。最后，集合这些技术，我们可以在 author 中实现装饰器模式，这解耦了代码和传给它的对象。

#### 阻碍

立即执行函数/揭示模块模式提供了很多特性，如我们所见，对 AMD 模式有很大的影响。不过语法略丑，这是一个没有标准的特殊的 hack，而且仍然严重依赖于全局作用域。

### CommonJS

![CommonJS](http://p0.qhimg.com/t01be00c54996d3ba63.jpg)

JavaScript 同时发展出服务器端的分支。剧透警告：Node 在战斗中获胜，但在早期有很多竞争者，包括 Ringo、Narwhal 和 Wakanda。开发者们知道客户端 JS 所经历的模块化的问题，他们想跳过早期的混乱和低效。所以他们形成了一个工作组，发展一种服务端模块标准。

一个经典笑话说，骆驼是委员会设计出来的马，这很有意思，因为这就是痛苦的事实：委员会能把某些事做得很好，但设计不在其中，所以 CommonJS 小组不可避免地在[次要问题](https://github.com/deltakosh/interoperable-web-development/)（译者注：原文为 “bikeshedding”，见 [https://en.wiktionary.org/wiki/bikeshedding](https://en.wiktionary.org/wiki/bikeshedding)）上陷入泥沼， 还有其他一些小组反模式的问题。不过在这段时间内，Node 从 CommonJS 的一些创意中，创造出自己的模块化实现。由于 Node 在服务端的流行，Node 的模块形式被（不正确地）称为 CommonJS，直至今日。

作为一个服务器端的解决方案，CommonJS 需要一个兼容的脚本加载器作为前提条件。该脚本加载器必须支持名为 require 和 module.exports 的函数，它们将模块相互导入导出（还有一个名为 “export” 的 module.exports 的简短形式，这里我们不会涉及）。虽然 CommonJS 从未在浏览器端流行起来，确实也有几个支持加载的工具，我们来看看通过 Browserify 预加载的例子。

![Example code 4 - CommonJS](http://p0.qhimg.com/t0177fe9e782878f681.png)

```html
 // commonJSPage.html
<!DOCTYPE html>
<html>
  <head>
    <script src="out/bundle.js"></script>
  </head>
  <body>
    <script>
    </script>
  </body>
</html> 

```

#### 好处

考虑到对外部加载器的需要，这种语法简洁明了，直接影响到 ES6 模块语法的设计。同样，模块将变量作用域限制在内部，不在需要甚至不能定义全局变量。

#### 阻碍

缺点是，CommonJS 在异步环境下表现并不好。所有 require 调用必须在代码开始工作之前执行。这也是为什么前面我们要进行预编译，这让“懒加载”变得很困难 —— 所有代码必须在开始执行之前加载。在网速或性能不好的手机上表现太差劲。

### AMD

![AMD](http://p0.qhimg.com/t019e16928fb1e004da.jpg)

巨大的讽刺是，在 CommonJS 工作组没能就服务端标准达成一致的时候，他们的讨论却产生了客户端格式的共识。AMD，或者称作异步模块定义（Asynchronous Module Definition），是从 CommonJS 讨论中诞生的。像 IBM、BBC 这些主要参与者们在 AMD 背后施加影响，AMD 迅速成为被称为前端开发的从业人员中的主导格式。

AMD 和 CommonJS 一样需要脚本加载器，尽管 AMD 只需要对 define 方法的支持。define 方法需要三个参数：模块名称，模块运行的依赖数组，所有依赖都可用之后执行的函数（该函数按照依赖声明的顺序，接收依赖作为参数）。只有函数参数是必须的。

有一点需要注意，尽管[官方不鼓励](https://groups.google.com/forum/#!msg/amd-implement/VAtOIIyVrOs/a2gdVuwol4gJ)命名的模块，而且这么做也没什么好处，但不幸的是这在实践中很常见。一旦你给模块命名了，就必须为每个模块设置 baseUrl 和 paths，失去了改变代码位置的自由。下面的例子展示了命名模块，但如果你还只是刚刚开始用，除非万不得已（将非 AMD 库如 jQuery 和 Underscore 包装成 AMD 模式可能需要使用命名模块 —— 点击上面的链接可以了解更多），千万别这么做。

AMD 的 *define 方法* 对应着 CommonJS 的 export，但 AMD 没有指定和 import 或 require 相同的方法。模块依赖由 *define* 方法的第二个参数处理，加载属于脚本加载器的外部模块。举个例子，CurlJS 将其加载方法 命名为 *curl*，而不是 *require*，两种方法接收的参数不同。

这种格式，利用了 JavaScript 运行的特点：先解析，解释代码（在这个阶段发现语法错误）；接着是执行，代码运行（运行时错误出现在这个阶段）。在解析期间，变量真实对应的目标（如 author.js 中第二行的 returnCreature）并不需要真实存在，代码只要语法正确就好。等待所有依赖加载完毕再去执行函数的责任落在了脚本加载器身上。

![Example code 4 - AMD](http://p0.qhimg.com/t018e00b449962be304.png)

```html
 // AMDPage.html
<!DOCTYPE html>
<html>
  <head>
    <script src="script/require.js"></script>
  </head>
  <body>
    <script>
    require.config({
        baseUrl:"script",
        paths: {
        "person":"person"
        }
    });
    require(["author"],function(author) {
        author.doJob('ES6 Module History');
    });
    </script>
  </body>
</html> 

```

#### 优缺点

AMD 统治前端领域多年，但却严重依赖于需要大量样板标记的丑陋语法。其因浏览器要求而拥有的异步特性，意味着[无法对其进行静态分析](https://code.visualstudio.com/)，此外还有很多类似缘故使其无法成为所有人通用的解决方案。

### UMD

![UMD_art_12](http://p0.qhimg.com/t015fea28e2356dd350.png)

人们说，最好的折中办法，往往不欢而散。统一模块定义（UMD）就是讲 AMD 和 CommonJS 合在一起的一种尝试，常见的做法是将 CommonJS 语法包裹在兼容 AMD 的代码中。

#### 优缺点

就像其他大部分的尝试一样，有了蛋糕，也吃了它，但却没尝到多少甜头。说得更完整点吧，它确实曾朝着端起那圣杯的道路努力过，想使用同构 JavaScript，在服务端和客户端同时运行。

### ES6 模块

![ES6 Modules](http://p0.qhimg.com/t01a4ac4b57ff949522.jpg)

TC39 委员会负责设计 ES6，这是该语言十五年来最大的一些改变，从 AMD 和 CommonJS 中吸取了教训。ES6 模块最终将带来其他语言已享用多年的内建的模块化支持，包含那些能够同时满足前后端开发者建议特性。下面是使用 ES6 的一个例子：

![Example code 6](http://p0.qhimg.com/t01a68e9e17f4a027ce.png)

```html
 <!DOCTYPE html>
<html>
  <head>
    <script src="./out/bundle.js"></script>
  </head>
  <body>
    <script>
      console.log('page loaded');
    </script>
  </body>
</html> 

```

只有一个小问题还悬而未决：前端生态系统很难支持 ES6 模块。没有浏览器原生支持新的 import 和 export 关键字以及提议的 HTML5 module 元素。像 Babel、Traceur 这样的转译器可以将 ES6 代码预编译为当前浏览器可以处理的 ES5 代码；但这些 ES5 代码需要被包裹在异步语法中，然后使用 RequireJS、Browserify 或 SystemJS 这样的脚本加载器处理。

试着将一个小小的 ES6 模块通过转译、异步加载两层处理，这似乎带来了实现上的困难。在我将本例子放到一起的时候，我得到了一个浏览器端的运行时错误，某个 require 声明无法找到其依赖。我知道 Browserify 有时候需要点斜线的目录前缀以识别模块（‘./author.js’），但破坏了我的 Babel 构建，因为我将其放在 Browserify bundle 的上一层。使用 Babel 和 Webpack 做应用的时候我也遇到了相似的问题。

点在于这是很前沿的东西。只要有时间，并非不可能实现，但需要更多时间来配置、排除故障，而不是使用更成熟的像 AMD + RequireJS 这样的技术。

## 结论

JavaScript 模块技术的历史，反映了互联网本身的爆发和演变。正如不再由无奈的终端控制的大型主机，像标准委员会这样集中控制的组织也不再发布命令并期望人们默默地服从。个人贡献者为他们认为最重要的问题设计自己的解决方案，最终流行采用的，正是人们投票决定的。

探索一系列不同的实现之后，标准跟进，汲取经验。这种态度 —— 史蒂夫·乔布斯简洁地概括为“能上市才是真行家” —— 体现的正是平等和务实，是它们使现代网络发展得如此成功，令人兴奋。

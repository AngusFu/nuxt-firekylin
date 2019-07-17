---
title: WebAssembly  初尝
date: 2016-08-16 14:46:36
desc: WebAssembly  初尝
author: "@Nick Larsen"
social: https://twitter.com/fody
from: http://cultureofdevelopment.com/blog/build-your-first-thing-with-web-assembly
permission: 0
tags: 
    - 翻译
    - WebAssembly
    - JavaScript
---


头一次听说 [WebAssembly](https://webassembly.github.io/) 的时候就觉得很酷，然后就超兴奋地开始尝试。但从一开始尝试的过程就不顺利，越来越让人灰心。本文的目的就是解决问题，让你免受困扰。

![beware of cliff](http://p4.qhimg.com/t014315b7ee6ed04cb7.jpg)

### 读者须知

本文写作于 2016 年 6 月 24 日。WebAssembly 是一项很新的、不稳定的技术；随着其标准化过程发展，本文中的任何内容都可能是错误的。

不过先不管了....

### WebAssembly 是什么

好吧，官网是这么描述的：

> WebAssembly，或者称作 wasm，是一项适用于 Web 编译的可移植的、体积与加载高效的格式。（WebAssembly or wasm is a new portable, size- and load-time-efficient format suitable for compilation to the web.）

嗯...什么鬼？什么格式？文本（Text）？二进制（Binary）？老实说，这个描述真糟糕。所以不管它，收起那些 binggo 游戏卡（buzzword bingo cards，一种填词游戏，这些词通常都是流行语，阅读[https://en.wikipedia.org/wiki/Buzzword_bingo](https://en.wikipedia.org/wiki/Buzzword_bingo)了解更多 —— 译者注），根据我所有的经验来描述吧：

> WebAssembly/wasm 是用来编写高性能的、浏览器无关的 Web 组件的一种字节码规范。（WebAssembly or wasm is a bytecode specification for writing performant, browser agnostic web components.）

有此妙语，听起来超棒，但仍然没 get 到点，接下来重点来了。WebAssembly 通过静态类型变量实现性能提升，运行时静态类型变量引用比动态类型变量更有效率。WebAssembly 由 [W3C Community Group](https://www.w3.org/community/webassembly/) 制定，最终将被所有规范兼容的浏览器支持。还有杀手锏，*最终*我们可以使用*任何*语言编写这些 Web 组件（web components）。

听起来酷了很多，不是么？

### 一起开始吧

学习新东西的时候，我通常会找尽可能最简单的例子来看它是如何工作的。不幸的是，对 WebAssembly 来说，这不太现实。在当前阶段，wasm 仅仅只是字节码规范。想象回到 1996 年，假如太阳公司（Sun Microsystems）的一些工程师们带来了 JVM，但却...没有 Java....若果真如此，我想当时的对话可能是这样的：

—— “伙计们，快来看看我们做的这个执行字节码的虚拟机！”
—— “真棒！但我们给它怎么写代码？”

![HelloWorld.class](http://p1.qhimg.com/t01c5889a9cdf0ef479.png)

*图：字节码形式的 HelloWorld*

—— “嗯..这问题提得好。等会儿我查查看。”
—— “真棒，如果遇到了任何问题，告诉我们你的想法，在我们的 github page 上贴出来。”
—— “你说对啦。我们现在先去看看其他项目。”

这个例子有些糟糕，因为 JVM 是基于 Java 语言的；尽管如此，希望你还是 get 到点了。如果都没有将代码编译为字节码的工具，要起步就很困难了。那我们要怎么开始？

### WebAssembly 之前有什么

多数技术都是创新的结果，特别是当合理的尝试成为正式规范时。wasm 也不例外，它实际上是 [asm.js](http://asmjs.org/) 的工作的延续， asm.js 是一个编写 javascript 组件的的规范，可编译为静态类型。wasm 的规范拓展了这些创意，它接受任何语言编译而成的字节码，这些字节码作为二进制文件而非文本文件通过网络传输；规范由很多来自主流浏览器厂商的代表们一起制定，而非仅仅是 Mozilla。

asm.js 仅仅是一个使用 javascript 语言特征的最小子集编写 javascript 的规范。你可以手写一些简单的 asm.js 代码，如果你想弄脏你的手，这正是极好的方式。（等会儿最好将这放在单独的文件中，通常约定文件名格式为 `your-module-name.asm.js`。）)

```javascript
function MyMathModule(global) {
    "use asm";
    var exp = global.Math.exp;
    function doubleExp(value) {
        value = +value;
        return +(+exp(+value) * 2.0);
    }
    return { doubleExp: doubleExp };
}
```

这还不是一个特别有用的函数，但符合规范。如果你觉得这很二，别人也是这么觉得的，不过基本上每一个字符都是必须的。在这当中，一元运算符 `+` 的作用是类型注解，这样编译器会知道那些变量是 double 类型的，运行时就不必再次分辨它们是什么。它相当挑剔，如果你把什么地方弄得一团糟，火狐控制台会给你一些合理的错误信息。

如果你想在浏览器中使用，像下面这样：

```javascript
var myMath = new MyMathModule(window);
for(var i = 0; i < 5; i++) {
    console.log(myMath.doubleExp(i));
}
```

一切正常的话，结果大概像下图这样：

![asm.js success](http://p6.qhimg.com/t01d27d8a53bcd3c767.png)

### 开始尝试 WebAssembly

现在我们已经有了一个可以工作的 asm.js 代码片段，可以使用 [WebAssembly github page](https://github.com/WebAssembly/binaryen) 提供的工具将其编译为 wasm。自己克隆代码仓库构建工具吧。这最麻烦了。这些工具一直在不断发展，代码会时不时挂掉，特别是在 Windows 环境下。

不管你是用 Windows 还是 Mac，电脑上必须要安装 make 和 cmake 命令行工具。如果你在使用 Windows，你还需要安装 Visual Studio 2015。Mac 用户按照[这里的说明](https://github.com/WebAssembly/binaryen#building) 操作；Windows 用户按照[这个说明](https://github.com/brakmic/brakmic/blob/master/webassembly/COMPILING_WIN32.md)操作。

![building binaryen](http://p8.qhimg.com/t01f65f188a46e3d538.png)

*图： Windows 下的工具构建*

对 WebAssembly 团队来说，发布可以工作的二进制文件意味着朝着正确的方向前进了一大步。

构建成功之后，binaryen 目录下会有一个 bin 文件夹，其中有一些用来将 asm.js 转换为 wasm 的工具。第一个工具是 `asm2wasm.exe`。它将 asm.js 代码转换为 `.s` 格式的代码，这些代码是生成 wasm 所需的抽象语法树（AST）的文本表现形式。运行工具，最终会得到类似下面的东西：

```
(module
  (memory 256 256)
  (export "memory" memory)
  (type $FUNCSIG$dd (func (param f64) (result f64)))
  (import $exp "global.Math" "exp" (param f64) (result f64))
  (export "doubleExp" $doubleExp)
  (func $doubleExp (param $0 f64) (result f64)
    (f64.mul
      (call_import $exp
        (get_local $0)
      )
      (f64.const 2)
    )
  )
)
```

以后我们可以逐行分析上面的代码，但现在我只想让你看下它的样子。我还得提醒你一点，因为 wasm 是二进制格式的，所以像你今天对 javascript 所做的那样右击、查看源码是行不通的。从头到尾都是二进制码。目前的计划是查看 wasm 模块源码时对二进制格式进行反汇编，让人能读懂。

接下来要做的是使用 `wasm-as.exe` 将 `.s` 格式的代码转换为 wasm 二进制码。运行文件，最后就能得到浏览器需要的真正的 wasm 二进制码。

![building wasm from asm.js](http://cultureofdevelopment.com/img/binaryen-transform.png)

*图：将 asm.js 转换为 wasm 二进制码*

![wasm bytecode](http://p6.qhimg.com/t01a5965c1d53b30e20.png)

*图：wasm 二进制码*

紧接着，安装最新版的 [Firefox](https://www.mozilla.org/en-US/firefox/new/) 或 [Chrome Canary](https://www.google.com/chrome/browser/canary.html)，并启用 WebAssembly。

如果你使用的是 Firefox，在地址栏中输入 `about:config`，点击“确认我会保证小心”。然后在搜索框中输入 `wasm`，双击 `javascript.options.wasm` 将值设置为 true，然后重启浏览器。

如果你使用的是 Chrome Canary，打开 `chrome://flags`，往下翻，找到 `Experimental WebAssembly`，点击“启用”链接，再重启浏览器。

最后一步就是让模块在浏览器中跑起来。初次尝试时，这又是一大痛点，完全不知道怎么做。在规范中使用 wasm 模块的 API 一点都没找到。最后我在 Canary 的控制台上输入 `WebAsse`，并没有任何提示。接着输入 `Was` 的时候，提示出来了！控制台上打印出的对象大概最简陋的文档了，不过这时候我突然想到，可以用一些其他工具 (emscripten) 将代码编译为 wasm。不过这是另外一篇博客的话题了。

一段时间之后，鼠标落在了 WebAssembly 的设计文档仓库上。我看到了一个名为 [JS.md](https://github.com/WebAssembly/design/blob/master/JS.md) 的文件，点击之后，有一个 API 的说明。仔细看顶部斜体的文字。但最精彩的部分还是最底部的代码片段，演示了如何最低限度地加载模块。我所需要做的就是拆出相关部分进行尝试。

```javascript
fetch("my-math-module.wasm")
    .then(function(response) {
        return response.arrayBuffer();
    })
    .then(function(buffer) {
        var dependencies = {
            "global": {},
            "env": {}
        };
        dependencies["global.Math"] = window.Math;
        var moduleBufferView = new Uint8Array(buffer);
        var myMathModule = Wasm.instantiateModule(moduleBufferView, dependencies);
        console.log(myMathModule.exports.doubleExp);
        for(var i = 0; i < 5; i++) {
            console.log(myMathModule.exports.doubleExp(i));
        }
    });
```

把代码放到 html 文件中，[启动本地文件服务器](https://www.npmjs.com/package/local-web-server)，在浏览器中加载页面。下面是在浏览器中的结果：

![wasm in a browser](http://p8.qhimg.com/t01631e5f7d290aae84.png)

*浏览器中运行的 wasm （至少尝试运行了） *

我估计需要去提交一个 bug 报告了。记着，一切都是实验性的、不稳定的，所以当此类事情发生的时候，别灰心丧气。

![keep calm and file bug reports](http://p3.qhimg.com/t017618b22a564ebf7f.png)

### 恭喜你

你已经完成了第一个 WebAssembly 组件。接下来做些什么？目前我们碰到的还只是皮毛而已。在本例中手写 asm.js 很重要，但需要时间和耐心。使用 emscripten 将应用转换为 asm.js 要简单多了。关于这一点，我强烈建议你阅读 asm.js 规范，特别是内存模型的部分，因为其中的许多概念都被迁移到 WebAssembly 上了。另外一个怪异的事情是，目前还不能直接将数组作为函数参数。人们已经达成共识，这需要改变，但规范中尚未有关于这一点的。去看看指针逻辑吧。

还有一点，在 wasm 中做一些工作的时候，你可能发展实际上 WebAssembly 还没普通的 javascript 运行得快。记住，现代的 javascript 引擎已经是高度优化的，wasm 要赶上这速度还需要时间。WebAssembly 还尚未进入准备生产的阶段。

如果你有任何关于 wasm 或者本文中提到的工具的问题，在 [Stack Overflow](http://stackoverflow.com) 中提出来，记得标上恰当的 tag。
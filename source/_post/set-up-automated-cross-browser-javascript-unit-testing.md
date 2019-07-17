---
title: 自动化、跨浏览器的 JavaScript 单元测试
date: 2016-08-15 15:52:45
desc: 自动化、跨浏览器的 JavaScript 单元测试
author: "@Philip Walton"
social: https://twitter.com/philwalton
permission: 0
from: https://philipwalton.com/articles/learning-how-to-set-up-automated-cross-browser-javascript-unit-testing/
tags: 
    - 翻译
    - 测试
    - 单元测试
---

大家都知道在不同浏览器上测试代码有多重要。多数时候我会觉得，开发者社区中的朋友们这一点做得非常棒 —— 至少是在初次发布项目的时候。

测试做得不好的是在每次修改代码的时候。

我个人也为此内疚。“自动化、跨浏览器的 JavaScript 单元测试”，这在我的 todo list 中已陈列数年，可每次坐下来打算认真弄明白时，又放弃了。我知道，有一部分是惰性所致，不过此话题的优质信息的惊人匮乏也难辞其咎。

有很多工具和框架（如 Karma）声称“使自动化，JavaScript 测试变简单”，但经验告诉我，这些工具所引入的复杂度，远超出它们所摆脱的麻烦（待会儿再细说）。在我的经验中，只要“工作就行”的工具，对专家来说是很好，不过学起来麻烦。我想要的是，理解这个过程在底层如何工作，这样万一测试程序挂掉（该来的最后总会来），我也能修复它。

对我来说，理解工作原理的最佳方法就是从头开始重造一遍。因此，我决定自己来造轮子，与社区分享我所学到的东西。

我写这篇文章，因为这正是几年前我刚开始发布开源项目时希望找到的。如果你自己从来没试过自动化、跨浏览器的 JavaScript 单元测试，但一直想学，那本文就是为你而写的。本文会向你解释整个工作过程，展示如何动手。


## 手动测试

在介绍自动化测试之前，我觉得有必要了解同样的页面在手动测试中是怎样的。

毕竟，自动化就是使用机器以解决现有工作流中的重复部分。没有完整了解手动测试，就想开始玩自动化，也不太可能理解自动化流程。

在手动测试中，在测试文件中编写测试用例，可能像下面这样：

```js
var assert = require('assert');
var SomeClass = require('../lib/some-class');

describe('SomeClass', function() {
  describe('someMethod', function() {
    it('accepts thing A and transforms it into thing B', function() {
      var sc = new SomeClass();
      assert.equal(sc.someMethod('A'), 'B');
    });
  });
}); 
```

上面这个例子使用 [Mocha](https://mochajs.org/) 和 Node.js 的 [`assert`](https://nodejs.org/api/assert.html) 模块，不过使用哪种测试或断言库并不是那么重要，用什么都行。

Mocha 在 Node.js 中运行，你可能会在命令行中运行下面的命令：

```bash
mocha test/some-class-test.js
```

要在浏览器中运行测试，需要一个 HTML 文件，文件中用 script 标签来加载脚本；又因为浏览器不理解 `require` 声明，你还需要一个像 [browserify](http://browserify.org/) 或 [webpack](https://webpack.github.io/) 这样的模块打包工具来解析依赖。

```bash
browserify test/*-test.js > test/index.js
```

很棒的是，这些模块打包工具会将所有测试文件（以及其他任何依赖）打包为一个文件，这样在测试页面中加载就变得简单了。[[1]](#footnote-1)

通常使用 Mocha 的测试文件长这样：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tests</title>
  <link href="../node_modules/mocha/mocha.css" rel="stylesheet" />
  <script src="../node_modules/mocha/mocha.js"></script>
</head>
<body>

  <!-- A container element for the visual Mocha results -->
  <div id="mocha"></div>

  <!-- Mocha setup and initiation code -->
  <script>
  mocha.setup('bdd');
  window.onload = function() {
    mocha.run();
  };
  </script>

  <!-- The script under test -->
  <script src="index.js"></script>

</body>
</html> 

```

如果你没在用 Node.js，那起步的时候你所做的可能就已经和上面的文件差不多，唯一的区别是所有的依赖可能是通过一个个 script 标签列出来的。


### 检测错误

测试框架可以知道测试是不是失败了，因为任何适合只要断言结果不是 true，断言库就会抛出错误。测试框架在 try/catch 代码块中运行每条测试，这样就能捕获任何可能抛出的错误，然后通过网页显示或者控制台打印出错误。

多数测试框架（如 Mocha）提供钩子（hooks），以便连通测试过程，使页面中其他脚本也能访问测试结果。对自动化测试来说，这是很重要的一个特性，因为自动化测试要工作，就得从测试脚本中拿到结果。

### 手动测试的好处

在浏览器中手动测试的很大的一点好处是，如果某个测试没有通过，可以使用浏览器的开发者工具 debug。

简单的代码如下：

```js
describe('SomeClass', () => {
  describe('someMethod', () => {
    it('accepts thing A and transforms it into thing B', () => {
      const sc = new SomeClass();

      debugger;
      assert.equal(sc.someMethod('A'), 'B');
    });
  });
});
```

重新打包，打开浏览器开发者工具，刷新页面，然后就能单步调试代码，轻松地跟踪问题的根源。

与此形成对比的是，多数现有的流行的自动化测试框架做起来却很困难！它们提供的部分方便之处就是打包单元测试，自动生成测试的页面。

在没有测试未通过之前，这也挺好，但万一有测试失败了，想要重现、在本地 debug 就没那么容易了。


## 自动化测试

尽管手动测试有些好处，缺点却也不少。打开几个不同的浏览器跑测试用例，每次的变动单调无趣还容易出错。更不用提，多数人都不会在本地开发机上装上所有版本的想要测试的浏览器。

如果想认真测试代码，确保每次变动都能进行恰当的测试，那就需要自动化了。不管你做得多好，手动测试容易造成遗忘和忽略，最终还挺浪费时间的。

不过自动化测试也有不好的地方。太多太多的自动化测试工具引入了一系列问题。构建过程稍有不同，测试稀奇古怪，错误调试起来苦不堪言。

在搭建自己的自动化测试系统时，我可不想再踩坑了，也不想放弃手动测试所带来的任何便利。所以在开始之前，我决定列一个需求清单。

毕竟，如果引入了新的问题，增加了复杂度，自动化系统就算不上那么成功。

### 需求

* 我需要通过命令行运行测试
* 我需要在本地调试未通过的测试
* 我需要通过 `npm` 安装所有测试依赖，这样任何人都能使用 `npm install && npm test` 使代码跑起来
* 我希望测试过程在持续化集成（CI）机器上跑起来，和在我的开发机上一样。这样一来，构建是一样的，无需检查新的变化就能调试错误
* 我希望所有测试能自动运行，无论何时，只要代码发生变化或是进行 pull request

脑子大概有了这个粗略的清单，接下来就该深入探究下，自动化的跨浏览器测试在流行的云测试机中是如何工作的。

### 云测试如何工作

现在已经有大量提供云测试的服务商，他们各有千秋。因为我在写开源代码，所以我只看那些为开源项目提供免费计划的服务商，在这当中，[Sauce Labs](https://saucelabs.com/opensauce/) 是唯一一家不需要我提供 email 就能开始新开源项目的。

最让我惊喜的是，开始阅读 Sauce Labs 中关于 JavaScript 单元测试文档的时候，我发现，这实际上是多么简单明了。许多测试框架号称让测试变得简单，但我却（错误地）以为那很难！

之前强调了，我不想让自动化测试和手动测试有什么根本的不同。结果我发现，Sauce Labs 所提供的自动测试方法几乎和我手动测试的过程一个样。

下面是测试步骤：

1. 给 Sauce Labs 提供你要测试的页面地址，并告诉它你要在哪些浏览器/平台上测试;
2. Sauce Labs 使用 [selenium webdriver](http://www.seleniumhq.org/projects/webdriver/) 为你所提供的每一种浏览器/平台组合加载页面。
3. Webdriver 检查页面是否有测试未通过，并保存结果。
4. Sauce Labs 将结果呈现给你。

就这么简单。

我曾错误地以为，需要将 JavaScript 代码提交给 Sauce Labs，然后在他们的机器上运行。实际上并非如此，他们只需要你提供的 URL。这就像人工测试一样，唯一的不同是，Sauce Labs 处理打开各种浏览器的工作，并为你记录测试结果。

### API

Sauce Labs 运行单元测试的 API 包括两个方法：

*   [开始 JS 单元测试（Start JS Unit Tests）](https://wiki.saucelabs.com/display/DOCS/JavaScript+Unit+Testing+Methods#JavaScriptUnitTestingMethods-StartJSUnitTests)

*   [获取 JS 单元测试状态（Get JS Unit Test Status）](https://wiki.saucelabs.com/display/DOCS/JavaScript+Unit+Testing+Methods#JavaScriptUnitTestingMethods-GetJSUnitTestStatus)

[开始 JS 单元测试](https://wiki.saucelabs.com/display/DOCS/JavaScript+Unit+Testing+Methods#JavaScriptUnitTestingMethods-StartJSUnitTests) 的方法初始化单个 HTML 页面（就是我们提供的 URL）测试，在你所提供的各种浏览器/平台组合上。

文档中给出了使用 `curl` 的例子：

```bash
curl https://saucelabs.com/rest/v1/SAUCE_USERNAME/js-tests \
  -X POST \
  -u SAUCE_USERNAME:SAUCE_ACCESS_KEY \
  -H 'Content-Type: application/json' \
  --data '{"url": "https://example.com/tests.html",  "framework": "mocha", "platforms": [["Windows 7", "firefox", "27"], ["Linux", "chrome", "latest"]]}' 
```

因为我们要做的是 JavaScript 单元测试，我会给出使用 [request](https://www.npmjs.com/package/request)  node 模块的例子，如果你在使用 Node.js，这可能更接近你使用的最后结果:

```js
request({
  url: `https://saucelabs.com/rest/v1/${username}/js-tests`,
  method: 'POST',
  auth: {
    username: process.env.SAUCE_USERNAME,
    password: process.env.SAUCE_ACCESS_KEY
  },
  json: true,
  body: {
    url: 'https://example.com/tests.html',
    framework: 'mocha',
    platforms: [
      ['Windows 7', 'firefox', '27'],
      ['Linux', 'chrome', 'latest']
    ]
  }
}, (err, response) => {
  if (err) {
    console.error(err);
  } else {
    console.log(response.body);
  }
}); 
```

注意，在 POST 的 body 中的 `framework: 'mocha'`。Sauce Labs 支持许多流行的 JavaScript 单元测试框架，如 Mocha，Jasmine，QUnit，以及 YUI。“支持”仅仅意味着，Sauce Lab 的 Webdriver 知道去哪找到测试结果（尽管多数情况下，你还是得自己填这些 —— 等会儿再细说）。

如果你所使用的测试框架不在上述列表中，可以设置 `framework: 'custom'`，这样 Sauce Labs 就会去寻找一个叫 `window.global_test_results` 的全局变量。结果的格式在文档的 [custom framework](https://wiki.saucelabs.com/display/DOCS/Reporting+JavaScript+Unit+Test+Results+to+Sauce+Labs+Using+a+Custom+Framework) 小节中列出来了。

#### Webdriver 获取 Mocha 测试结果

就算一开始请求时你已经告诉 Sauce Labs 你在使用 Mocha，你还是得更新页面的 HTML，将测试结果保存在一个 Sauce Labs 能够访问的全局变量中。

为支持 Mocha，将页面中的如下代码：

```html
<script>
mocha.setup('bdd');
window.onload = function() {
  mocha.run();
};
</script> 

```

修改成：

```html
<script>
mocha.setup('bdd');
window.onload = function() {
  var runner = mocha.run();
  var failedTests = [];

  runner.on('end', function() {
    window.mochaResults = runner.stats;
    window.mochaResults.reports = failedTests;
  });

  runner.on('fail', logFailure);

  function logFailure(test, err){
    var flattenTitles = function(test){
      var titles = [];
      while (test.parent.title){
        titles.push(test.parent.title);
        test = test.parent;
      }
      return titles.reverse();
    };

    failedTests.push({
      name: test.title,
      result: false,
      message: err.message,
      stack: err.stack,
      titles: flattenTitles(test)
    });
  };
};
</script> 

```

以上代码与 Mocha 样板默认代码的唯一区别在于，该逻辑将测试结果赋值给 Sauce Labs 所期望的 `window.mochaResults` 变量。新的代码不会影响浏览器中的手动测试，所以还可以像原来一样使用。

再强调此前提过的一点，Sauce Labs “运行”测试的时候，并非真正在运行什么东西，它只是访问一个网页，然后等到 `window.mochaResults` 对象被发现有值了。然后再记录结果。

#### 判断测试是否通过

[开始 JS 单元测试 (Start JS Unit Tests)](https://wiki.saucelabs.com/display/DOCS/JavaScript+Unit+Testing+Methods#JavaScriptUnitTestingMethods-StartJSUnitTests) 方法告诉 Sauce Labs 按照队列在你所要求的浏览器/平台中运行测试，但它并未范围测试结果。

它所返回的仅仅只是队列中任务的 ID。响应大概像下面这样：

```json
{
  "js tests": [
    "9b6a2d7e6c8d4fd2afeeb0ff7e54e694",
    "d38688ec7256497da6966f4523ddee76",
    "14054e68ccd344c0bed77a798a9ce1e8",
    "dbc54181f7d947458f52201ea5fcb901"
  ]
} 
```

要判断测试是否通过，可以调用[获取 JS 单元测试状态（Get JS Unit Test Status）](https://wiki.saucelabs.com/display/DOCS/JavaScript+Unit+Testing+Methods#JavaScriptUnitTestingMethods-GetJSUnitTestStatus)方法，这个方面接受一个任务 ID 列表，返回每个任务的当前状态。

定期调用这个方法，直到所有的工作完成。

```javascript
request({
  url: `https://saucelabs.com/rest/v1/${username}/js-tests/status`,
  method: 'POST',
  auth: {
    username: process.env.SAUCE_USERNAME,
    password: process.env.SAUCE_ACCESS_KEY
  },
  json: true,
  body: jsTests, // The response.body from the first API call.

}, (err, response) => {
  if (err) {
    console.error(err);
  } else {
    console.log(response.body);
  }
});
```

响应大致如下：

```json
{
  "completed": false,
  "js tests": [
    {
      "url": "https://saucelabs.com/jobs/75ac4cadb85e415fae957f7811d778b8",
      "platform": [
        "Windows 10",
        "chrome",
        "latest"
      ],
      "result": {
        "passes": 29,
        "tests": 30,
        "end": {},
        "suites": 7,
        "reports": [],
        "start": {},
        "duration": 97,
        "failures": 0,
        "pending": 1
      },
      "id": "1f74a237d5ba4a47b5a42570ae1e7999",
      "job_id": "75ac4cadb85e415fae957f7811d778b8"
    },
    // ... the rest of the jobs
  ]
}
```

一旦 `response.body.complete` 属性变为 `true`，所有测试结束，然后就能遍历以获取测试结果。

### 通过 localhost 测试

前面说过，Sauce Labs 是通过访问 URL “运行”测试的。所以这也意味着你所使用的 URL 必须是互联网上能公开访问的。

这样一来，如果要通过 `localhost` 跑测试，那就有问题了。

已经有一些解决该问题的工具了，包括 [Sauce Connect](https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy) (官方推荐)，这是 Sauce Labs 创建的一个代理服务器，它在本地服务器与 Sauce Labs 虚拟机之间开了一个安全连接。

Sauce Connect 是按照安全的要求来设计的，通过它，外人几乎不可能访问到你的代码。不过它的一个缺点是配置、使用极其复杂。

如果代码安全性很重要，Sauce Connect 可能值得一试；否则的话，还有一些更简单的类似方案。

我选择的是 [ngrok](https://ngrok.com/)。

#### ngrok

[ngrok](https://ngrok.com/) 是建立与 localhost 之间的安全信道（secure tunnels）的工具。它提供一个公开的 URL[[2]](#footnote-2) 给本地的 Web 服务器，这个 URL 恰恰就是在 Sauce Labs 上运行测试所需要的。

如果你在虚拟机上做过开发或手动测试，可能已经听说过 ngrok；如果没有，建议你好好去看看。这是个非常有用的工具。

在开发机上安装 ngrok，和下载二进制文件、加入到 PATH 一样简单；不过，如果你要在 Node 中使用 ngrok，最后还是通过 npm 来安装。

```
npm install ngrok
```

在 Node 中通过以下代码，可以开启一个 ngrok 进程：

```javascript
const ngrok = require('ngrok');

ngrok.connect(port, (err, url) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Tests now accessible at: ${url}`);
  }
});
```

一旦有了测试文件的公开 URL，使用 Sauce Labs 跨浏览器测试本地代码基本上就很简单啦！

## 过程整合

本文涵盖了不少话题，可能会给人以这样的印象：自动化跨浏览器的 JavaScript 单元测试很复杂。但实际上并不是这样的。

文章的框架是从我的角度来设定的 —— 我在试着解决自己的问题。而且就我自己的经验来看，真正的复杂之处仅仅是因为缺乏相关信息，整个过程如何工作，如何将所有这些整合起来。

如果理解了所有这些步骤，那就很简单了。总结起来就是这样：

**最初的手动过程：**
1. 编写测试，创建一个运行测试的 HTML 页面；
2. 在一两个本地浏览器中运行测试，确保正常工作。

**添加自动化：**
1. 新建 Sauce Labs 账号，获取用户名 和 access key；
2. 更新测试页面的源码，使 Sauce Labs 能够通过全局变量读取测试结果；
3. 使用 ngrok 创建安全信道连接本地测试页面，使其能公开访问；
4. 列出测试的浏览器/平台列表，调用 [Start JS Unit Tests](https://wiki.saucelabs.com/display/DOCS/JavaScript+Unit+Testing+Methods#JavaScriptUnitTestingMethods-StartJSUnitTests) 方法；
5. 周期调用 [Get JS Unit Test Status](https://wiki.saucelabs.com/display/DOCS/JavaScript+Unit+Testing+Methods#JavaScriptUnitTestingMethods-GetJSUnitTestStatus) 直至测试结束；
6. 报告测试结果。

## 更简单的方式

我知道本文开始的时候，我说了很多，你不需要任何框架来完成自动化、跨浏览器的 JavaScript 单元测试，我仍然坚信这一点。但尽管上述步骤很简单，你可能也并不想每个项目都重复去做。

我之前也有很多想要加入自动化测试的老项目，因此对我来说，将这些逻辑打包成模块是很有意义的。

强烈建议你自己尝试去实现，这样才能全面了解它如何工作。但如果你没有时间，且希望能快速搭建测试，建议你尝试我创建的 [Easy Sauce](https://github.com/philipwalton/easy-sauce) 项目。

### Easy Sauce

[Easy Sauce](https://github.com/philipwalton/easy-sauce) 是一个 Node 包，一个命令行工具（`easy-sauce`）。它也是我现在使用的跨浏览器测试工具。

`easy-sauce` 命令需要一个 HTML 测试文件的路径（默认为 `/test/`），一个启动本地服务器的端口（默认为 `1337`），以及以个测试的浏览器/平台列表。接下来 `easy-sauce` 会在 Sauce Lab 云端运行测试，将结果打印到控制台上并退出，返回合适的状态码，标明测试是否通过。

为了方便 npm 包，`easy-sauce` 默认会从 `package.json` 中读取配置项，不用单纯储存它们。这样有个额外好处就是，使用你的包的用户，能够很清楚地看到你所支持的浏览器/平台。

关于 `easy-sauce` 的完整使用指南，请移步 Github 上的[文档](https://github.com/philipwalton/easy-sauce)。

最后，我想强调的是，这个项目是专门来解决的我的用例的。虽然我觉得它可能对很多其他开发者会很有用，但我无意将其调转为功能齐全的测试解决方案。

`easy-sauce` 的整个点在于，填补了我（我相信很多开发者也是如此）与合适的测试之间的复杂性裂缝。

## 总结

本文开始的时候，我写了一个需求列表。有了 Easy Sauce，现在我可以满足所有我工作项目上的需求。

如果你的项目还没用上自动化跨浏览器单元测试，我想鼓励你尝试下 Easy Sauce。就算你不使用它，至少你得有相关知识完成自己的解决方案，或者对现有工具有更好的理解。

测试愉快！
<p id="footnote-1">
1. 使用模板打包工具的一个缺点是堆栈跟踪（stack traces）目前对 source map 的支持还不是很好。Chrome 的一个解决办法是 [node-source-map-support](https://github.com/evanw/node-source-map-support#browser-support) 模块。
</p>

<p id="footnote-2">
2. ngrok 生成的 URL 是公开的，这意味着理论上网络上的任何人都可以访问。不过，URL 是随机生成的，而测试只会跑那么几分钟，某人发现它的几率相当低。虽然没有 Sauce Connect 那么安全，相对也还是安全的。
</p>

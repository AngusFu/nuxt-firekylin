---
title: "前端界面 Modal 的控制"
tags:
  - 原创
  - JavaScript
  - 用户体验
date: 2016-12-02 20:38:23
desc: "关于自定义 Modal 的一些思考"
---

## 问题提出

需要说明的是，题目中所说的 Modal，指的是所有由前端开发者自定义的对话框，如通常用到的 Alert、Prompt、Confirm 等等，经常伴随着一个半透明的灰黑色全局 mask。

事情源自某天使用某网站的页面，出现一个自定义的 Comfirm，习惯性按下回车确认，等了很久也不见弹出层关闭。于是很绝望。继而发现，真不是这一个网站的问题。

看看一般浏览器原生的 alert、prompt、confirm 可以发现，它们基本上都提供默认操作项（eg.确认/取消），通过回车键可以直接完成。传统软件如 PhotoShop 也是如此，否则真不知那些无需鼠标的 PS 大神是怎样练出来的。然而不少自定义的插件，却并未提供这样的功能，往往不得不将手挪到鼠标或触摸板上操作，极其不便。

主要存在两个方面的问题，一是根本无法直接通过键盘操作对话框；二是虽然可以操作，但视觉提示并不明显；三是整个应用对焦点的控制不够，容易导致成本可能极高误操作。下面先简单谈谈这几个问题，然后结合实际例子说明。

## 键盘、鼠标切换成本

先谈第一个问题。键盘、鼠标之间的切换成本应该是很高的，尤其是当应用响应与用户心理预期不符时，造成的焦虑感或挫败感很影响用户体验。

因此在使用弹出 Modal 时，需要根据业务场景，设置一个默认选项（尤其是确认、取消、提交等操作），用户通过回车键或鼠标点击就可以轻松完成任务。不过，另外一种更好的方式是提供 Tab 和 (Shift + Tab) 两种操作，通过键盘可以自由地在弹出层不同选项之间按照顺序切换。

## 明确的焦点提示

接着转到第二个，视觉提示的问题。没有明确是视觉提示，会造成用户的疑惑。

有默认选项的时候，无论是通过闪动的光标、背景色的变化，还是边框、outline 等形式，都需要明确提示用户，Modal 弹出时默认操作项是什么。而当用户使用键盘操作，焦点发生变化后，当前焦点在哪一项上，必须给出明确的视觉提示，否则极容易带来困难，甚至误操作。

## 应用对焦点的控制

第三个问题实际是第二个问题的延续。前面提到焦点的视觉提示问题，其实还有一种可能性，可能导致严重后果，这就是用户通过 Tab 操作，将焦点移动到弹出层 mask 背后的应用中。

这时候，一方面没有给出清晰的提示，一方面没有对焦点进行很好的控制，万一焦点在一个敏感位置（如一个外部跳转链接），按下回车键，这时候页面将刷新，用户此前的数据面临荡然无存的境地。脑洞再大一点，万一 mask 背后获得焦点的是巨额交易乃至核按钮（233333），那么恭喜你，攻城狮生涯就此结束。

我们知道，当网页弹出原生 alert 时，整个页面其他部分处于不可操作状态。使用类似的自定义组件替代这些功能时，纵然我们不能阻塞页面其他所有部分，但也得采取一定的控制，防止意外发生，最简便的方法便是将 Tab 的控制权掌握在开发者手中。 

当然，相比于第三点，前两点应该是必须项，第三项可以算是加分项，在一些普通应用中不实现影响也不大。


## 举栗子

我们来看下一些实现。

首先是 Github 的 Fork。如图所示：

![Github Fork](https://ogjiybger.qnssl.com/github.jpg)

首先 fork 操作不提供默认选项。但使用 Tab 和 (Shift + Tab) 时，焦点只会在整个弹出层中用紫色框线标出的四个部分中依次切换。回车键按下时，则会 fork 到相应账号，或者取消操作、关闭弹出层。

接着看 [SweetAlert](http://t4t5.github.io/sweetalert/)，以第一个 Confirm 为例：

![SweetAlert](https://ogjiybger.qnssl.com/sweet-alert.jpg)

Confirm 弹出后，默认选项是右边的 “Yes, delete it!”，点击回车键，就会产生确认反馈。通过 Tab 操作几次发现，整个页面的焦点，只能够在图中两个按钮之间切换。同时仔细观察还能，获得焦点状态（:focus）的按钮，会有一个不太容易察觉的 box-shadow。

再来看看 Vue 组件库 Element 的 [MessageBox 组件](http://element.eleme.io/#/zh-CN/component/message-box) 中的 “确认消息” Demo。

先说结果，嗯，有提供默认选项，切换到不同选项时，也会有视觉提示（“取消”按钮的颜色和边框色会变，“确认”按钮背景亮度有明显变化）。然而有两点做得还不够：第一，无法通过 Tab 轻易切换到“❎”关闭按钮；第二点，也是最致命的是，根本就没有获取到 Tab 的控制权，以至于多按几次 Tab 然后回车，页面跳到主页，而弹框依然存在（如图所示）。

![Element](https://ogjiybger.qnssl.com/element.jpg)

和 Element 类似，[Weui](https://weui.io/#dialog) 中的 Dialog 也存在类似问题，但 Weui 主要面向移动端，倒也情有可原。


## 如何实现控制

一开始我想到了 tabIndex 这个属性。但这货控制起来，十分不方便，在本文场景中使用它，简直是惹火烧身。

那么我能想到最简单的实现，莫过于手动调用 focus 事件了。[ Simple Demo](https://jsfiddle.net/wemlin/0yu2y10j/) 。代码示例如下：

```javascript
var $ = (sel) => document.querySelector(sel);

$('#js-show-alert').addEventListener('click', () => {
  $('#js-prompt').style.display = 'block';
  $('#js-confirm').focus();
});

$('#js-cancel').addEventListener('click', () => {
  if (confirm('Are your sure?')) {
    $('#js-prompt').style.display = 'none';
  }
});

$('#js-confirm').addEventListener('click', () => {
  $('#js-prompt').style.display = 'none';
  alert('Confirmed! The Prompt will disappear');
});
```

样式方面，按钮使用的是 button，整体并未 reset，所以按钮获取焦点时，是有 outline 的。这也提醒我们，可以直接通过 `:focus` 伪类来实现 tab 选中时的样式，这样做好懂又靠谱。

还存在另外一点问题，上面的代码中，`#js-confirm` 元素是默认获取焦点的。那么，假如我们不需要任何默认焦点，而又需要用户按下 Tab 时，让 `#js-prompt` 中的按钮依次获得焦点呢？

这里提一点不成熟的想法（23333333）。只要让容器元素 `#js-prompt` 获得焦点即可：`$('#js-prompt').focus();`。在控制台上打印下 `HTMLElement.prototype.focus`，就会明白我的意思了。但这么做，可能是野路子（我还没细看 HTML 中元素获得焦点相关的规范）。

但是，上面 Demo 的实现，没有考虑到 Tab 控制权的接管。要接管 Tab，就得使用事件绑定来完成。下面看下 Github 是如何实现的。

## 如何取得控制权

找到 Github 对应的[源码](https://assets-cdn.github.com/assets/github-a61b83eb9eb0770051e9a5edab1cb266b68a3dddc8ad7e1fff0cc2c5f49db9c2.js)，又通过开发者工具发现弹出层容器有个值为 `facebox` 的 id。

接下来，开始 Ctrl + F 大法。利用长久积累的火眼金睛，找到下面这样两段代码：

![Github code](https://ogjiybger.qnssl.com/github-code.jpg)

![Github code](https://ogjiybger.qnssl.com/github-code-2.jpg)

就是它了。

先看第二段，整理后如下，重点直接划在注释中：

```javascript

// 弹出层出现
document.addEventListener("facebox:reveal", function() {
  var t = document.getElementById("facebox");
  setTimeout(function() {
    e(t)
  }, 0);

  // 为 document 绑定 keydown 事件
  // 事件回调函数 n 就是第一张截图的函数
  r(document).on("keydown", n);
});

// 弹出层关闭后
document.addEventListener("facebox:afterClose", function() {
    // 移除出现时候为 document
    // 绑定的 keydown 事件
    r(document).off("keydown", n);

    // 弹出中已经获得焦点的元素
    // 强行失去焦点
    r("#facebox :focus").blur()
});

// ....

```

再来看看函数 n 做了什么。

```javascript

function n(e) {
  var t = void 0;

  // hotkey 是自定义的
  // 这里开始控制 tab 和 shift+tab 操作
  if ("tab" === (t = e.hotkey) || "shift+tab" === t) {
    // 阻止默认事件
    e.preventDefault();

    // 弹出层
    var n = r("#facebox"),

      // 变量 i 存储弹出层中可以获得焦点的、可见的、可用的
      // input, button, .btn, textarea 等元素集合
      // filter 用到的函数 o 用于过滤不可见的相关元素
      // o = require("github/visible")["default"]
      i = r(Array.from(n.find("input, button, .btn, textarea")).filter(o)).filter(function() {
          return !this.disabled
      }),

      // tab 方向
      s = "shift+tab" === e.hotkey ? -1 : 1,

      // i 集合中当前获得焦点的元素的 index
      a = i.index(i.filter(":focus")),

      // i 集合中下一个获得焦点的元素的位置
      u = a + s;
    
    // 如果下一个获得焦点的位置超出 i 集合范围
    // 或者当前没有任何元素获得焦点、并且使用的是向前的 tab 键
    // 则将焦点置于 i 集合中的第一个元素上
    if (u === i.length || -1 === a && "tab" === e.hotkey) {
      i.first().focus()
    }
    // 当前没有任何元素获得焦点
    // 并且使用 shift+tab 向前
    // 则将焦点置于 i 集合中最后一个元素
    else if（-1 === a）{
      i.last().focus();
    }
    // 正常行为
    // 将焦点置于下一个元素
    else {
      i.get(u).focus();
    }

  }
}
```

好了，本文也就结束了。

----

嗯，今天（2016-12-04）我想起来那个完全无法使用的例子了 🙂：

![实例](https://ogjiybger.qnssl.com/wx-pup.jpg)


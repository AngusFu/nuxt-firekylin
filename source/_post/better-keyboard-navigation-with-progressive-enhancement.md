---
title: 渐进增强的键盘导航
date: 2016-08-30 15:15:46
desc: better-keyboard-navigation-with-progressive-enhancement/
author: "@codepo8"
social: https://twitter.com/codepo8
from: https://www.christianheilmann.com/2016/08/15/better-keyboard-navigation-with-progressive-enhancement/
permission: 1
tags: 
    - 翻译
    - 用户体验
    - 可用性
---

创建界面时很重要的一点是，要考虑到那些只依赖键盘来使用产品的用户。这对可访问性来说是基本要求，在多数情况下，通过键盘操作访问也并非难事。这意味着首先，也是最重要的，是使用键盘可访问元素进行交互。

- 如果希望用户跳转到其他地方，使用带有有效的 href 属性的锚点连接

- 如果希望用户执行你自己的代码，并在当前文档中停留，使用按钮

![键盘](http://p2.qhimg.com/t01adc9f3ae9a586201.jpg)

通过[流动 tabIndex 技术](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)几乎可以使所有内容都能通过键盘访问，不过，既然已经有 HTML 元素可以做同样的事情，又何必再麻烦呢。

## 效果可视化

不过，使用恰当的元素并不那么简单；用户键盘在元素集合中所处的位置，也要显眼一些。给激活的元素加上轮廓（outline），浏览器解决了这个问题。这虽然超有用，但却是一些人的眼中钉，他们希望由自己控制所有交互的视觉展现。在 CSS 中将 outline 属性设置为 none，就能移除这个视觉辅助功能；不过这会带来[不小的可访问性问题](http://www.outlinenone.com/)，除非你提供一个别的替代。

使用最显眼的 HTML 元素；加上一些 CSS，确保除 hover 之外 focus 状态同样也被定义。这样就可以使用户在列表中的一个个项目间，轻松地通过 tab 来切换了。Shift + Tab 允许回退。可以看下 [demo](http://jsbin.com/ronuzis)，HTML 挺简单粗暴的。

```html
<ul>
  <li><button>1</button></li>
  <li><button>2</button></li>
  <li><button>3</button></li>
  …
  <li><button>20</button></li>
</ul> 

```

![在按钮列表中 tab 切换](http://p5.qhimg.com/t01f5cf80c24e3e5365.gif)

使用列表，为我们的元素赋予了层次结构，以及普通浏览器所没有的可访问性技术的导航方式。它还带来很多 HTML 元素，我们可以自己添加样式。通过一点样式，我们可以将其转换为网格，占用更少的垂直空间，容纳更多内容。


```css
ul, li {
  margin: 0;
  padding: 0;
  list-style: none;
}
button {
  border: none;
  display: block;
  background: goldenrod;
  color: white;
  width: 90%;
  height: 30px;  
  margin: 5%;
  transform: scale(0.8);
  transition: 300ms;
}
button:hover, button:focus {
  transform: scale(1);
  outline: none;
  background: powderblue;
  color: #333;
}

li {
  float: left;
}

/* 
  grid magic by @heydonworks 
  https://codepen.io/heydon/pen/bcdrl
*/

li {
  width: calc(100% / 4);
}
li:nth-child(4n+1):nth-last-child(1) {
  width: 100%;
}
li:nth-child(4n+1):nth-last-child(1) ~ li {
  width: 100%;
}
li:nth-child(4n+1):nth-last-child(2) {
  width: 50%;
}
li:nth-child(4n+1):nth-last-child(2) ~ li {
  width: 50%;
}
li:nth-child(4n+1):nth-last-child(3) {
  width: calc(100% / 4);
}
li:nth-child(4n+1):nth-last-child(3) ~ li {
  width: calc(100% / 4);
}
```

结果[看起来非常棒](http://output.jsbin.com/cujomeq/)，在查看列表的过程中，我们能清楚地看到自己所处的位置。

![网格中一格格地切换](http://p3.qhimg.com/t0192466c1b3d4a0744.gif)

## 键盘访问的升级 —— 提供快捷方式

不过，在访问网格时，通过键盘进行两个方向的移动会不会更好呢？

使用一点 JavaScript 做渐进增强，[我们做到了](http://jsbin.com/mafeko/)，可以使用鼠标或方向键访问网格。

![使用鼠标控制方向切换网格访问](http://p9.qhimg.com/t0108c1e3e1785dfe95.gif)

不过记着，这仅仅只是一个**增强**。假设 JavaScript 因为各种可能的原因执行失败，依然可以通过 tab 来访问列表，我们失去的只是便利，但至少还有可用的界面。

我将这个打包成了一个小巧、无依赖的开源 JavaScript 项目 [gridnav](https://github.com/codepo8/gridnav)，可以在 [GitHub](https://codepo8.github.io/gridnav) 上获取代码。你要做的就是调用脚本，传给它一个选择器以获取元素列表。

```html
<ul id="links" data-amount="5" data-element="a">
  <li><a href="#">1</a></li>
  <li><a href="#">2</a></li>
  …
  <li><a href="#">25</a></li>
</ul>

<script src="gridnav.js"></script>
<script>
  var linklist = new Gridnav('#links');
</script> 

```

通过列表元素的 data- 属性，可以自己定义每行元素的数量以及键盘可访问的元素。这些是可选的，但设置之后会让代码更快，出错可能性更小。[README](https://github.com/codepo8/gridnav/blob/master/README.md) 文件更详细地解释了如何使用。

## 工作原理

开始考虑如何做的时候，像任何开发者一样，抓到了最复杂的方式。我以为，需要对父节点、兄弟节点的大量定位比较，使用上 [getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)，进行大量的 DOM 访问。

之后我往回走了一步，意识到如何展示列表并不重要。最终不过是一个列表，我们要访问它而已。甚至不需要访问 DOM，因为我们所做的不过是从一堆按钮或锚点连接中的一个切换到另一个。我们要做的就是：

1. 找到当前所在元素（[event.target](https://developer.mozilla.org/en-US/docs/Web/API/Event/target)）。

2. 获取按下的键。

3. 根据键向前向后移动，或跳过一些元素到下一行。

就像这样（[点击这里试试看](https://codepo8.github.io/gridnav/tutorialfiles/demo-to-inline.html)）：


![网格中移动和在坐标系中移动一样](http://p8.qhimg.com/t01fd0f3a12ee84c71c.gif)

我们需要跳过的元素数量是由每行的元素数量决定的。向上等同于向前 n 个元素，向下相当于向后 n 个元素。

![网格移动图解](http://p6.qhimg.com/t017ff0dbc0bb99bb24.png)

使用一些小技巧，完整代码非常简短：

```javascript
(function(){
  var list = document.querySelector('ul');
  var items = list.querySelectorAll('button');
  var amount = Math.floor(
    list.offsetWidth / list.firstElementChild.offsetWidth
  );
  var codes = {
    38: -amount,
    40: amount,
    39: 1,
    37: -1
  };
  for (var i = 0; i < items.length; i++) {
    items[i].index = i;
  }
  function handlekeys(ev) {
    var keycode = ev.keyCode;
    if (codes[keycode]) {
      var t = ev.target;
      if (t.index !== undefined) {
        if (items[t.index + codes[keycode]]) {
          items[t.index + codes[keycode]].focus();
        }
      }
    }
  }
  list.addEventListener('keyup', handlekeys);
})();
```

这里发生了什么？

首先我们获取到了列表元素，并缓存所有可通过键盘访问的元素：

```javascript
  var list = document.querySelector('ul');
  var items = list.querySelectorAll('button');
```

计算每次上下移动需要跳过的元素数量，将列表的宽度除以列表第一个子元素（本例中是 LI）的宽度即可：

```javascript
  var amount = Math.floor(
    list.offsetWidth / list.firstElementChild.offsetWidth
  );
```

相较于 switch 语句或者大量的 if 判断，我更乐意使用查找表。在本例总共，查找表名字是 codes。向上键值为 38，向下 40，向左 37，向右 39。假如我们拿到了 codes[37]，值为 -1，也就是我们要在列表中移动的数量：

```javascript
  var codes = {
    38: -amount,
    40: amount,
    39: 1,
    37: -1
  };
```

可以使用 event.target 获取按下键盘时列表中的选中元素，但我们不知道它在列表中的位置。为避免重复遍历列表，一次性遍历所有按钮，将它们在列表中的索引存储在按钮自身的 index 属性中。

```javascript
  for (var i = 0; i < items.length; i++) {
    items[i].index = i;
  }
```

handlekeys() 完成剩余工作。读取所按按键的键值，然后到 codes 中查找。所以，我们只针对方向键做出响应。接着获取当前的元素，检查其是否有 index 属性。如果有，则检查我们将要移到的位置是否有元素存在。如果元素存在，则获得焦点。

```javascript
  function handlekeys(ev) {
    var keycode = ev.keyCode;
    if (codes[keycode]) {
      var t = ev.target;
      if (t.index !== undefined) {
        if (items[t.index + codes[keycode]]) {
          items[t.index + codes[keycode]].focus();
        }
      }
    }
  }
```

给列表绑定一个 keyup 事件监听器，搞定 :)

```javascript
  list.addEventListener('keyup', handlekeys);
```

如果你想看真实效果，这有一个[讲述各个细节的快速视频教程](https://www.youtube.com/watch?v=zc420bXDqWk)。

视频在最后的代码部分有点 bug，因为我没将 count 属性和 undefined 对比，所以在第一个元素上，键盘功能没法正常工作（0 是 falsy）。

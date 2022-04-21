(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{186:function(e,t,v){"use strict";v.r(t);var r={computed:{data:function(){return{title:"[译] 手把手教你写一个 Javascript 框架：使用 ES6 Proxy 实现数据绑定",description:"手把手教你写一个 Javascript 框架：使用 ES6 Proxy 实现数据绑定",keywords:"翻译,ES6,数据绑定",pathname:"es6-proxy-data-binding",translation:{author:"Bertalan Miklos",social:"https://blog.risingstack.com/author/bertalan/",from:"https://blog.risingstack.com/writing-a-javascript-framework-data-binding-es6-proxy/"},create_time:"2016-11-14",prev:{title:"[译] 手把手教你写一个 Javascript 框架：数据绑定",pathname:"data-bind-dirty-checking"},next:{title:"笔记：IE 下透明度问题",pathname:"ie-filter"}}}}},n=v(3),component=Object(n.a)(r,function(){var e=this,t=e.$createElement,v=e._self._c||t;return v("post",{attrs:{data:e.data}},[v("p",[v("strong",[e._v("本文是“编写 JavaScript 框架”系列的第五章。在本章中，我将介绍如何使用 ES6 Proxy 实现简单、强大的数据绑定。")])]),e._v(" "),v("p",[e._v("本系列主要是如何开发一个开源的客户端框架，框架名为 NX。我将在本系列中分享框架编写过程中如何克服遇到的主要困难。对 NX 感兴趣的朋友可以点击 NX 项目"),v("a",{attrs:{href:"http://nx-framework.com",target:"_blank"}},[e._v("主页")]),e._v("查看。")]),e._v(" "),v("p",[e._v("本系列章节如下：")]),e._v(" "),v("ul",[v("li",[v("a",{attrs:{href:"/post/nx-project-structure/"}},[e._v("项目结构（Project structuring）")])]),e._v(" "),v("li",[v("a",{attrs:{href:"/post/execution-timing/"}},[e._v("执行调度（Execution timing）")])]),e._v(" "),v("li",[v("a",{attrs:{href:"/post/sandbox-code-evaluation/"}},[e._v("沙箱求值（Sandboxed code evaluation）")])]),e._v(" "),v("li",[v("a",{attrs:{href:"/post/data-bind-dirty-checking"}},[e._v("数据绑定简介")])]),e._v(" "),v("li",[e._v("ES6 Proxy 实现数据绑定 (本文)")]),e._v(" "),v("li",[e._v("自定义元素 ")]),e._v(" "),v("li",[e._v("客户端路由")])]),e._v(" "),v("h2",{attrs:{id:"-"}},[e._v("知识回顾")]),e._v(" "),v("p",[e._v("ES6 让 JavaScript 变得更加优雅，但多数新特性不过是语法糖罢了。Proxy 是少数几个无法 polyfill 的新增特性。如果还不太熟悉 Proxy，请先看一眼 "),v("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy",target:"_blank"}},[e._v("MDN 上的 Proxy 文档")]),e._v("。")]),e._v(" "),v("p",[e._v("如果对 ES6 中的 "),v("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect",target:"_blank"}},[e._v("Reflection API")]),e._v("、"),v("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set",target:"_blank"}},[e._v("Set")]),e._v("、 "),v("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",target:"_blank"}},[e._v("Map")]),e._v(" 以及 "),v("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap",target:"_blank"}},[e._v("WeakMap")]),e._v(" 有所了解，那便是极好的。")]),e._v(" "),v("h2",{attrs:{id:"nx-observe"}},[e._v("nx-observe")]),e._v(" "),v("p",[v("a",{attrs:{href:"https://github.com/RisingStack/nx-observe",target:"_blank"}},[e._v("nx-observe")]),e._v(" 是一个不到 140 行代码的数据绑定方案。对外暴露的 "),v("code",[e._v("observable(obj)")]),e._v(" 、"),v("code",[e._v("observe(fn)")]),e._v("二者分别用于创建 observable 和 observer 函数。当使用到的 observable 对象发生属性变化时，observer 函数将自动执行。示例如下：")]),e._v(" "),v("pre",[v("code",{staticClass:"hljs lang-javascript"},[v("span",{staticClass:"hljs-comment"},[e._v("// 这是一个 observable object")]),e._v("\n"),v("span",{staticClass:"hljs-keyword"},[e._v("const")]),e._v(" person = observable({"),v("span",{staticClass:"hljs-attr"},[e._v("name")]),e._v(": "),v("span",{staticClass:"hljs-string"},[e._v("'John'")]),e._v(", "),v("span",{staticClass:"hljs-attr"},[e._v("age")]),e._v(": "),v("span",{staticClass:"hljs-number"},[e._v("20")]),e._v("})\n\n"),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-keyword"},[e._v("function")]),e._v(" "),v("span",{staticClass:"hljs-title"},[e._v("print")]),e._v(" ("),v("span",{staticClass:"hljs-params"}),e._v(") ")]),e._v("{\n  "),v("span",{staticClass:"hljs-built_in"},[e._v("console")]),e._v(".log("),v("span",{staticClass:"hljs-string"},[e._v("`"),v("span",{staticClass:"hljs-subst"},[e._v("${person.name}")]),e._v(", "),v("span",{staticClass:"hljs-subst"},[e._v("${person.age}")]),e._v("`")]),e._v(")\n}\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("// 创建一个 observer 函数")]),e._v("\n"),v("span",{staticClass:"hljs-comment"},[e._v("// 控制台打印出 'John, 20'")]),e._v("\nobserve(print)\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("// 控制台打印出 'Dave, 20'")]),e._v("\nsetTimeout("),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-params"},[e._v("()")]),e._v(" =>")]),e._v(" person.name = "),v("span",{staticClass:"hljs-string"},[e._v("'Dave'")]),e._v(", "),v("span",{staticClass:"hljs-number"},[e._v("100")]),e._v(")\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("// 控制台打印出 'Dave, 22'")]),e._v("\nsetTimeout("),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-params"},[e._v("()")]),e._v(" =>")]),e._v(" person.age = "),v("span",{staticClass:"hljs-number"},[e._v("22")]),e._v(", "),v("span",{staticClass:"hljs-number"},[e._v("200")]),e._v(")")])]),v("p",[e._v("每当 "),v("code",[e._v("person.name")]),e._v(" 或 "),v("code",[e._v("person.age")]),e._v(" 发生变化，传给 "),v("code",[e._v("observe()")]),e._v(" 的 "),v("code",[e._v("print")]),e._v(" 函数就会重新运行。在这里，"),v("code",[e._v("print")]),e._v(" 被称为 observer 函数。")]),e._v(" "),v("p",[e._v("如果对更多例子感兴趣，可以点开 "),v("a",{attrs:{href:"https://github.com/RisingStack/nx-observe#example",target:"_blank"}},[e._v("GitHub readme")]),e._v(" 或 "),v("a",{attrs:{href:"http://nx-framework.com/docs/spa/observer",target:"_blank"}},[e._v("NX 主页")]),e._v("，看看更逼真的场景。")]),e._v(" "),v("h2",{attrs:{id:"-observable"}},[e._v("实现简单的 observable")]),e._v(" "),v("p",[e._v("接下来的小节解释 nx-observe 底层发生了什么。首先介绍 observable 对象的属性变化是如何被侦测到的，又是如何匹配 observer 的。然后再展示怎样运行这些由变化触发的 observer 函数。")]),e._v(" "),v("h3",{attrs:{id:"-"}},[e._v("注册变化")]),e._v(" "),v("p",[e._v("变化是通过由 ES6 Proxy 包装后的 observable 对象注册的。在 "),v("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect",target:"_blank"}},[e._v("Reflection API")]),e._v(" 的协助下，这些 proxy 能够完美拦截 get 和 set 操作。")]),e._v(" "),v("p",[e._v("下面代码中使用的 "),v("code",[e._v("currentObserver")]),e._v(" 和 "),v("code",[e._v("queueObserver()")]),e._v(" 会在下一节中解释。目前只需要知道，"),v("code",[e._v("currentObserver")]),e._v(" 总是指向当前执行的 observer 函数，"),v("code",[e._v("queueObserver()")]),e._v(" 把即将执行的 observer 加入队列。")]),e._v(" "),v("pre",[v("code",{staticClass:"hljs lang-javascript"},[e._v("\n"),v("span",{staticClass:"hljs-comment"},[e._v("/* 将 observable 对象的属性映射到\n   那些使用了这些属性的 observer 函数集合中 */")]),e._v("\n"),v("span",{staticClass:"hljs-keyword"},[e._v("const")]),e._v(" observers = "),v("span",{staticClass:"hljs-keyword"},[e._v("new")]),e._v(" "),v("span",{staticClass:"hljs-built_in"},[e._v("WeakMap")]),e._v("()\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("/* 指向当前正在执行的 observer 函数，\n   也可能是 undefined */")]),e._v("\n"),v("span",{staticClass:"hljs-keyword"},[e._v("let")]),e._v(" currentObserver\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("/* 将对象包装成 proxy，从而将其转换为 observable 对象，\n   还为 observers 添加了一个空 Map，\n   用于保存 property-observer 组合 */")]),e._v("\n"),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-keyword"},[e._v("function")]),e._v(" "),v("span",{staticClass:"hljs-title"},[e._v("observable")]),e._v(" ("),v("span",{staticClass:"hljs-params"},[e._v("obj")]),e._v(") ")]),e._v("{\n  observers.set(obj, "),v("span",{staticClass:"hljs-keyword"},[e._v("new")]),e._v(" "),v("span",{staticClass:"hljs-built_in"},[e._v("Map")]),e._v("())\n  "),v("span",{staticClass:"hljs-keyword"},[e._v("return")]),e._v(" "),v("span",{staticClass:"hljs-keyword"},[e._v("new")]),e._v(" "),v("span",{staticClass:"hljs-built_in"},[e._v("Proxy")]),e._v("(obj, {get, set})\n}\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("/* 拦截 get 操作，若当前没有正在\n   执行的 observer，则不会做任何事 */")]),e._v("\n"),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-keyword"},[e._v("function")]),e._v(" "),v("span",{staticClass:"hljs-title"},[e._v("get")]),e._v(" ("),v("span",{staticClass:"hljs-params"},[e._v("target, key, receiver")]),e._v(") ")]),e._v("{\n  "),v("span",{staticClass:"hljs-keyword"},[e._v("const")]),e._v(" result = "),v("span",{staticClass:"hljs-built_in"},[e._v("Reflect")]),e._v(".get(target, key, receiver)\n   "),v("span",{staticClass:"hljs-keyword"},[e._v("if")]),e._v(" (currentObserver) {\n     registerObserver(target, key, currentObserver)\n   }\n  "),v("span",{staticClass:"hljs-keyword"},[e._v("return")]),e._v(" result\n}\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("/* 若当前有 observer 函数正在运行，\n   本函数会将该 observer 函数与\n   当前取到的 observable 对象的属性进行配对，\n   并将它们保存到 observers Map 中 */")]),e._v("\n"),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-keyword"},[e._v("function")]),e._v(" "),v("span",{staticClass:"hljs-title"},[e._v("registerObserver")]),e._v(" ("),v("span",{staticClass:"hljs-params"},[e._v("target, key, observer")]),e._v(") ")]),e._v("{\n  "),v("span",{staticClass:"hljs-keyword"},[e._v("let")]),e._v(" observersForKey = observers.get(target).get(key)\n  "),v("span",{staticClass:"hljs-keyword"},[e._v("if")]),e._v(" (!observersForKey) {\n    observersForKey = "),v("span",{staticClass:"hljs-keyword"},[e._v("new")]),e._v(" "),v("span",{staticClass:"hljs-built_in"},[e._v("Set")]),e._v("()\n    observers.get(target).set(key, observersForKey)\n  }\n  observersForKey.add(observer)\n}\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("/* 拦截 set 操作，与当前设置的属性相关联的\n   所有 observer 加入执行队列 */")]),e._v("\n"),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-keyword"},[e._v("function")]),e._v(" "),v("span",{staticClass:"hljs-title"},[e._v("set")]),e._v(" ("),v("span",{staticClass:"hljs-params"},[e._v("target, key, value, receiver")]),e._v(") ")]),e._v("{\n  "),v("span",{staticClass:"hljs-keyword"},[e._v("const")]),e._v(" observersForKey = observers.get(target).get(key)\n  "),v("span",{staticClass:"hljs-keyword"},[e._v("if")]),e._v(" (observersForKey) {\n    observersForKey.forEach(queueObserver)\n  }\n  "),v("span",{staticClass:"hljs-keyword"},[e._v("return")]),e._v(" "),v("span",{staticClass:"hljs-built_in"},[e._v("Reflect")]),e._v(".set(target, key, value, receiver)\n}")])]),v("p",[e._v("尚未设置 "),v("code",[e._v("currentObserver")]),e._v(" 时，"),v("code",[e._v("get")]),e._v(" 不会做任何事情。否则，"),v("code",[e._v("get")]),e._v(" 操作会将拿到的 observable 对象属性与当前运行的 observer 函数组合（pair）在一起，保存到 "),v("code",[e._v("observers")]),e._v(" WeakMap 中。对于 observable 对象的每个属性，observer 函数都保存在一个 "),v("code",[e._v("Set")]),e._v(" 中。这样可以保证不会出现重复。")]),e._v(" "),v("p",[v("code",[e._v("set")]),e._v(" 会检索所有与 observable 对象变动的属性相关的 observer，并将它们加入稍后执行的队列。")]),e._v(" "),v("p",[e._v("下图展示了前面的例子的执行步骤。")]),e._v(" "),v("p",[v("img",{directives:[{name:"lazy",rawName:"v-lazy",value:"https://blog-assets.risingstack.com/2016/11/writing-a-javascript-framework-data-binding-with-es6-proxy-observables-code.png",expression:"`https://blog-assets.risingstack.com/2016/11/writing-a-javascript-framework-data-binding-with-es6-proxy-observables-code.png`"}],attrs:{alt:"JavaScript data binding with es6 proxy - observable code sample"}})]),e._v(" "),v("ol",[v("li",[e._v("创建 observable 对象 "),v("code",[e._v("person")]),e._v("；")]),e._v(" "),v("li",[v("code",[e._v("currentObserver")]),e._v(" 被设为 "),v("code",[e._v("print")]),e._v("；")]),e._v(" "),v("li",[v("code",[e._v("print")]),e._v(" 开始执行；")]),e._v(" "),v("li",[e._v("在 "),v("code",[e._v("print")]),e._v(" 内部检索到 "),v("code",[e._v("person.name")]),e._v("；")]),e._v(" "),v("li",[e._v("在 "),v("code",[e._v("person")]),e._v(" 上触发 "),v("code",[e._v("get")]),e._v("；")]),e._v(" "),v("li",[v("code",[e._v("observers.get(person).get('name')")]),e._v(" 检索到 "),v("code",[e._v("(person, name)")]),e._v(" 组合的 observer Set；")]),e._v(" "),v("li",[v("code",[e._v("currentObserver")]),e._v(" (print) 被添加到 observer Set 中；")]),e._v(" "),v("li",[e._v("对 "),v("code",[e._v("person.age")]),e._v("，同理，执行前面 4-7 步；")]),e._v(" "),v("li",[v("code",[e._v("${person.name}, ${person.age}")]),e._v(" 打印出来；")]),e._v(" "),v("li",[v("code",[e._v("print")]),e._v(" 函数执行结束；")]),e._v(" "),v("li",[v("code",[e._v("currentObserver")]),e._v(" 变为 undefined；")]),e._v(" "),v("li",[e._v("其他代码开始运行；")]),e._v(" "),v("li",[e._v("设置 "),v("code",[e._v("person.age")]),e._v(" 为新的值（22）；")]),e._v(" "),v("li",[v("code",[e._v("person")]),e._v(" 上触发 "),v("code",[e._v("set")]),e._v("；")]),e._v(" "),v("li",[v("code",[e._v("observers.get(person).get('age')")]),e._v(" 检索到 "),v("code",[e._v("(person, age)")]),e._v(" 组合的 observer Set，")]),e._v(" "),v("li",[e._v("observer Set 中的 observer（包括 "),v("code",[e._v("print")]),e._v("）入队准备执行；")]),e._v(" "),v("li",[e._v("再次执行 "),v("code",[e._v("print")]),e._v("。")])]),e._v(" "),v("h3",{attrs:{id:"observer-"}},[e._v("observer 执行")]),e._v(" "),v("p",[e._v("队列中的 observer 是分批异步执行的，因此性能很好。注册期间，这些 observer 被异步地添加到 "),v("code",[e._v("queuedObservers")]),e._v(" "),v("code",[e._v("Set")]),e._v(" 中。"),v("code",[e._v("Set")]),e._v(" 中不会包含重复元素，所以多次加入同一个 observer 也不会导致重复执行。如果该 "),v("code",[e._v("Set")]),e._v(" 之前是空的，则会加入新的任务，在一段时间后迭代执行队列中所有的 observer。")]),e._v(" "),v("pre",[v("code",{staticClass:"hljs lang-javascript"},[v("span",{staticClass:"hljs-comment"},[e._v("/* 包含触发的将要执行的 observer 函数 */")]),e._v("\n"),v("span",{staticClass:"hljs-keyword"},[e._v("const")]),e._v(" queuedObservers = "),v("span",{staticClass:"hljs-keyword"},[e._v("new")]),e._v(" "),v("span",{staticClass:"hljs-built_in"},[e._v("Set")]),e._v("()\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("/* 指向当前正在执行的 observer 函数，\n   也可能是 undefined */")]),e._v("\n"),v("span",{staticClass:"hljs-keyword"},[e._v("let")]),e._v(" currentObserver\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("/* 暴露的 observe 函数 */")]),e._v("\n"),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-keyword"},[e._v("function")]),e._v(" "),v("span",{staticClass:"hljs-title"},[e._v("observe")]),e._v(" ("),v("span",{staticClass:"hljs-params"},[e._v("fn")]),e._v(") ")]),e._v("{\n  queueObserver(fn)\n}\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("/* 将 observer 添加到队列中，\n   并确保队列会尽快执行 */")]),e._v("\n"),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-keyword"},[e._v("function")]),e._v(" "),v("span",{staticClass:"hljs-title"},[e._v("queueObserver")]),e._v(" ("),v("span",{staticClass:"hljs-params"},[e._v("observer")]),e._v(") ")]),e._v("{\n  "),v("span",{staticClass:"hljs-keyword"},[e._v("if")]),e._v(" (queuedObservers.size === "),v("span",{staticClass:"hljs-number"},[e._v("0")]),e._v(") {\n    "),v("span",{staticClass:"hljs-built_in"},[e._v("Promise")]),e._v(".resolve().then(runObservers)\n  }\n  queuedObservers.add(observer)\n}\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("/* 执行队列中的 observer，\n   完成后 currentObserver 置为 undefined */")]),e._v("\n"),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-keyword"},[e._v("function")]),e._v(" "),v("span",{staticClass:"hljs-title"},[e._v("runObservers")]),e._v(" ("),v("span",{staticClass:"hljs-params"}),e._v(") ")]),e._v("{\n  "),v("span",{staticClass:"hljs-keyword"},[e._v("try")]),e._v(" {\n    queuedObservers.forEach(runObserver)\n  } "),v("span",{staticClass:"hljs-keyword"},[e._v("finally")]),e._v(" {\n    currentObserver = "),v("span",{staticClass:"hljs-literal"},[e._v("undefined")]),e._v("\n    queuedObservers.clear()\n  }\n}\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("/* 将全局的 currentObserver 变量\n  指向 observer 并执行 */")]),e._v("\n"),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-keyword"},[e._v("function")]),e._v(" "),v("span",{staticClass:"hljs-title"},[e._v("runObserver")]),e._v(" ("),v("span",{staticClass:"hljs-params"},[e._v("observer")]),e._v(") ")]),e._v("{\n  currentObserver = observer\n  observer()\n}")])]),v("p",[e._v("执行某一个 observer 时，上面的代码确保全局变量 "),v("code",[e._v("currentObserver")]),e._v(" 指向该 observer。设置  "),v("code",[e._v("currentObserver")]),e._v("，会启用 "),v("code",[e._v("get")]),e._v("，监听、匹配执行时用到的 observable 对象的所有属性。")]),e._v(" "),v("h2",{attrs:{id:"-observable-tree"}},[e._v("建立动态 observable tree")]),e._v(" "),v("p",[e._v("到目前为止，模型结合单层数据结构使用起来还挺好，但还需要用 observable 手动包装那些值是对象的属性。比如，下面的代码就没法达到预期：")]),e._v(" "),v("pre",[v("code",{staticClass:"hljs lang-javascript"},[v("span",{staticClass:"hljs-keyword"},[e._v("const")]),e._v(" person = observable({"),v("span",{staticClass:"hljs-attr"},[e._v("data")]),e._v(": {"),v("span",{staticClass:"hljs-attr"},[e._v("name")]),e._v(": "),v("span",{staticClass:"hljs-string"},[e._v("'John'")]),e._v("}})\n\n"),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-keyword"},[e._v("function")]),e._v(" "),v("span",{staticClass:"hljs-title"},[e._v("print")]),e._v(" ("),v("span",{staticClass:"hljs-params"}),e._v(") ")]),e._v("{\n  "),v("span",{staticClass:"hljs-built_in"},[e._v("console")]),e._v(".log(person.data.name)\n}\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("// 控制台打印出 'John'")]),e._v("\nobserve(print)\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("// does nothing")]),e._v("\nsetTimeout("),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-params"},[e._v("()")]),e._v(" =>")]),e._v(" person.data.name = "),v("span",{staticClass:"hljs-string"},[e._v("'Dave'")]),e._v(", "),v("span",{staticClass:"hljs-number"},[e._v("100")]),e._v(")")])]),v("p",[e._v("为了让代码正常工作，还需要将 "),v("code",[e._v("observable({data: {name: 'John'}})")]),e._v(" 替换成 "),v("code",[e._v("observable({data: observable({name: 'John'})})")]),e._v("。幸运的是，稍微修改一下 "),v("code",[e._v("get")]),e._v(" 就能解决问题。")]),e._v(" "),v("pre",[v("code",{staticClass:"hljs lang-javascript"},[v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-keyword"},[e._v("function")]),e._v(" "),v("span",{staticClass:"hljs-title"},[e._v("get")]),e._v(" ("),v("span",{staticClass:"hljs-params"},[e._v("target, key, receiver")]),e._v(") ")]),e._v("{\n  "),v("span",{staticClass:"hljs-keyword"},[e._v("const")]),e._v(" result = "),v("span",{staticClass:"hljs-built_in"},[e._v("Reflect")]),e._v(".get(target, key, receiver)\n  "),v("span",{staticClass:"hljs-keyword"},[e._v("if")]),e._v(" (currentObserver) {\n    registerObserver(target, key, currentObserver)\n    "),v("span",{staticClass:"hljs-keyword"},[e._v("if")]),e._v(" ("),v("span",{staticClass:"hljs-keyword"},[e._v("typeof")]),e._v(" result === "),v("span",{staticClass:"hljs-string"},[e._v("'object'")]),e._v(") {\n      "),v("span",{staticClass:"hljs-keyword"},[e._v("const")]),e._v(" observableResult = observable(result)\n      "),v("span",{staticClass:"hljs-built_in"},[e._v("Reflect")]),e._v(".set(target, key, observableResult, receiver)\n      "),v("span",{staticClass:"hljs-keyword"},[e._v("return")]),e._v(" observableResult\n    }\n  }\n  "),v("span",{staticClass:"hljs-keyword"},[e._v("return")]),e._v(" result\n}")])]),v("p",[e._v("如果要返回的值是对象，那么在返回之前，"),v("code",[e._v("get")]),e._v(" 会将其包装成 observable 对象。从性能方面来看也很完美，只会在需要的时候才会创建 observable 对象。")]),e._v(" "),v("h2",{attrs:{id:"-es5-"}},[e._v("与 ES5 对比")]),e._v(" "),v("p",[e._v("利用 ES5 的属性访问器（getter/setter）也能实现类似的数据绑定。很多流行的框架/库都在使用，如 "),v("a",{attrs:{href:"https://mobxjs.github.io/mobx/",target:"_blank"}},[e._v("MobX")]),e._v(" 和 "),v("a",{attrs:{href:"https://vuejs.org/",target:"_blank"}},[e._v("Vue")]),e._v("。相较于访问器，使用 Proxy 有两大优势，也有一点不足之处。")]),e._v(" "),v("h3",{attrs:{id:"-"}},[e._v("扩展属性")]),e._v(" "),v("p",[e._v("在 JavaScript 中，扩展属性（Expando properties） 是指动态添加的属性。ES5 技术不支持扩展属性，每个属性的访问器都必须预先定义才能实现拦截操作。这也是为何当今预定义的键值集合成为趋势的原因。")]),e._v(" "),v("p",[e._v("而 Proxy 技术可以真正支持扩展属性，因为 Proxy 是按照单个对象定义的，对象的所有属性操作都可以拦截。")]),e._v(" "),v("p",[e._v("扩展属性很重要，典型例子就是数组。离开添加、删除功能，JavaScript 数组几乎毫无用处。针对此问题，ES5 数据绑定技术通常自定义数组方法，或者干脆重写。")]),e._v(" "),v("h3",{attrs:{id:"getter-setter"}},[e._v("getter 和 setter")]),e._v(" "),v("p",[e._v("通过某些特殊的语法，一些使用 ES5 方法的框架/库提供 "),v("code",[e._v("computed")]),e._v(" 绑定属性。这些属性都有相应的原生实现，即 getter 和 setter。因为内部使用 getter 和 setter 实现数据绑定逻辑，那么也就无法再利用属性访问器了。")]),e._v(" "),v("p",[e._v("而 Proxy 可以拦截包括 getter 和 setter 在内的所有类型的属性访问和变动，所以这对 ES6 方法来说不构成问题。")]),e._v(" "),v("h3",{attrs:{id:"-"}},[e._v("不足之处")]),e._v(" "),v("p",[e._v("使用 Proxy 最大的不足还是在于浏览器支持。只有"),v("a",{attrs:{href:"http://caniuse.com/#feat=proxy",target:"_blank"}},[e._v("比较新的浏览器")]),e._v("才支持，而 Proxy API 最精华的部分却无法通过 polyfill 实现。")]),e._v(" "),v("h2",{attrs:{id:"-"}},[e._v("一点笔记")]),e._v(" "),v("p",[e._v("上面介绍的数据绑定方法能够工作，但为了更容易理解，我进行了一些简化处理。下面会提到一些之前没有提到的问题。")]),e._v(" "),v("h3",{attrs:{id:"-"}},[e._v("垃圾清理")]),e._v(" "),v("p",[e._v("内存泄漏比较恶心。前面的代码在某种意义上来说有所避免，因为使用了 "),v("code",[e._v("WeakMap")]),e._v(" 保存 observer。因此，observable  对象及与其关联的 observer 也会同时被回收。")]),e._v(" "),v("p",[e._v("不过，实际使用场景常常是中心化、持久化的存储，伴随着频繁的 DOM 变动。这种情况下，DOM 在垃圾回收之前，必须释放所有为其注册的 observer。前面的例子并没有实现该功能，但可以在 "),v("a",{attrs:{href:"https://github.com/RisingStack/nx-observe/blob/master/observer.js",target:"_blank"}},[e._v("nx-observe 的代码")]),e._v(" 中可以看到 "),v("code",[e._v("unobserve()")]),e._v(" 方法如何实现。")]),e._v(" "),v("h3",{attrs:{id:"-"}},[e._v("多次包装")]),e._v(" "),v("p",[e._v("Proxy 是透明的，没有分辨 Proxy 和普通对象的原生方法。此外，它们还能无限嵌套，若不进行必要的预防，最终可能导致不停地对 observable 对象进行包装。")]),e._v(" "),v("p",[e._v("分辨 Proxy 与普通对象的办法有很多，例子中没有提到。其中一种办法是设置一个名为 "),v("code",[e._v("proxies")]),e._v(" 的 "),v("code",[e._v("WeakSet")]),e._v(" 对象，之后检查该 WeakSet 中是否存在某个 Proxy 对象即可。如果对 nx-observe 中的 "),v("code",[e._v("isObservable()")]),e._v(" 方法感兴趣，可以去看"),v("a",{attrs:{href:"https://github.com/RisingStack/nx-observe/blob/master/observer.js",target:"_blank"}},[e._v("代码")]),e._v("。")]),e._v(" "),v("h3",{attrs:{id:"-"}},[e._v("继承")]),e._v(" "),v("p",[e._v("nx-observe 还能与原型继承搭配工作。请看示例：")]),e._v(" "),v("pre",[v("code",{staticClass:"hljs lang-javascript"},[v("span",{staticClass:"hljs-keyword"},[e._v("const")]),e._v(" parent = observable({"),v("span",{staticClass:"hljs-attr"},[e._v("greeting")]),e._v(": "),v("span",{staticClass:"hljs-string"},[e._v("'Hello'")]),e._v("})\n"),v("span",{staticClass:"hljs-keyword"},[e._v("const")]),e._v(" child = observable({"),v("span",{staticClass:"hljs-attr"},[e._v("subject")]),e._v(": "),v("span",{staticClass:"hljs-string"},[e._v("'World!'")]),e._v("})\n"),v("span",{staticClass:"hljs-built_in"},[e._v("Object")]),e._v(".setPrototypeOf(child, parent)\n\n"),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-keyword"},[e._v("function")]),e._v(" "),v("span",{staticClass:"hljs-title"},[e._v("print")]),e._v(" ("),v("span",{staticClass:"hljs-params"}),e._v(") ")]),e._v("{\n  "),v("span",{staticClass:"hljs-built_in"},[e._v("console")]),e._v(".log("),v("span",{staticClass:"hljs-string"},[e._v("`"),v("span",{staticClass:"hljs-subst"},[e._v("${child.greeting}")]),e._v(" "),v("span",{staticClass:"hljs-subst"},[e._v("${child.subject}")]),e._v("`")]),e._v(")\n}\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("// 控制台打印出 'Hello World!'")]),e._v("\nobserve(print)\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("// 控制台打印出 'Hello There!'")]),e._v("\nsetTimeout("),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-params"},[e._v("()")]),e._v(" =>")]),e._v(" child.subject = "),v("span",{staticClass:"hljs-string"},[e._v("'There!'")]),e._v(")\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("// 控制台打印出 'Hey There!'")]),e._v("\nsetTimeout("),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-params"},[e._v("()")]),e._v(" =>")]),e._v(" parent.greeting = "),v("span",{staticClass:"hljs-string"},[e._v("'Hey'")]),e._v(", "),v("span",{staticClass:"hljs-number"},[e._v("100")]),e._v(")\n\n"),v("span",{staticClass:"hljs-comment"},[e._v("// 控制台打印出 'Look There!'")]),e._v("\nsetTimeout("),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-params"},[e._v("()")]),e._v(" =>")]),e._v(" child.greeting = "),v("span",{staticClass:"hljs-string"},[e._v("'Look'")]),e._v(", "),v("span",{staticClass:"hljs-number"},[e._v("200")]),e._v(")")])]),v("p",[e._v("沿着原型链中的每个对象都会触发 "),v("code",[e._v("get")]),e._v(" 操作，直到找到属性，因此在所有可能需要的地方都会注册 observer。")]),e._v(" "),v("p",[e._v("还有一个鲜为人知事情，"),v("code",[e._v("set")]),e._v(" 操作同样会（偷偷摸摸地）沿着原型链进行。有些极端情况就是因此造成的，这里略过不谈。")]),e._v(" "),v("h3",{attrs:{id:"-"}},[e._v("内部属性")]),e._v(" "),v("p",[e._v("Proxy 还能拦截“内部属性访问”。你的代码中可能会使用许多通常基本都不考虑的内部属性。这样一些属性，通常会使用如 "),v("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol",target:"_blank"}},[e._v("Symbol")]),e._v(" 这样的值作为 key。这些属性也通常也能被 Proxy 拦截到，不过也也会有一些出现 bug 的情况。")]),e._v(" "),v("h3",{attrs:{id:"-"}},[e._v("异步特性")]),e._v(" "),v("p",[e._v("拦截到 "),v("code",[e._v("set")]),e._v("  操作时，observer 可以同步运行。这样有一些优势，比如减低复杂度，时序也可预测，堆栈跟踪更优雅。但某些场景下也会造成混乱。")]),e._v(" "),v("p",[e._v("想象一下，在单个循环中向6一个 observable 数组中添加 1000 项。数组长度会变化一千次，关联的 observer 也会在接连执行一千次。这恐怕不是什么好事。")]),e._v(" "),v("p",[e._v("另一个场景是双向观测。如若 observer 同步执行，下面的代码会造成无限循环。")]),e._v(" "),v("pre",[v("code",{staticClass:"hljs lang-javascript"},[v("span",{staticClass:"hljs-keyword"},[e._v("const")]),e._v(" observable1 = observable({"),v("span",{staticClass:"hljs-attr"},[e._v("prop")]),e._v(": "),v("span",{staticClass:"hljs-string"},[e._v("'value1'")]),e._v("})\n"),v("span",{staticClass:"hljs-keyword"},[e._v("const")]),e._v(" observable2 = observable({"),v("span",{staticClass:"hljs-attr"},[e._v("prop")]),e._v(": "),v("span",{staticClass:"hljs-string"},[e._v("'value2'")]),e._v("})\n\nobserve("),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-params"},[e._v("()")]),e._v(" =>")]),e._v(" observable1.prop = observable2.prop)\nobserve("),v("span",{staticClass:"hljs-function"},[v("span",{staticClass:"hljs-params"},[e._v("()")]),e._v(" =>")]),e._v(" observable2.prop = observable1.prop)")])]),v("p",[e._v("鉴于这些，nx-observe 将 observer 添加到不允许重复的队列中一起执行，以避免"),v("a",{attrs:{href:"https://en.wikipedia.org/wiki/Flash_of_unstyled_content",target:"_blank"}},[e._v("无样式内容闪动")]),e._v("。如果你对 microtask 的概念还不熟悉，请查看我之前关于浏览器时间控制的"),v("a",{attrs:{href:"https://blog.risingstack.com/writing-a-javascript-framework-execution-timing-beyond-settimeout/",target:"_blank"}},[e._v("文章")]),e._v("。")]),e._v(" "),v("h2",{attrs:{id:"-"}},[e._v("写在最后")]),e._v(" "),v("p",[e._v("如果对 NX 框架感兴趣，请访问 "),v("a",{attrs:{href:"http://nx-framework.com",target:"_blank"}},[e._v("主页")]),e._v("。胆大的读者还可以在Github 上查看 "),v("a",{attrs:{href:"https://github.com/RisingStack/nx-framework",target:"_blank"}},[e._v("NX 源码")]),e._v(" 和 "),v("a",{attrs:{href:"https://github.com/RisingStack/nx-observe",target:"_blank"}},[e._v("nx-observe 源码")]),e._v("。 ")]),e._v(" "),v("p",[e._v("希望你喜欢这篇文章，下一章我们将讨论自定义 HTML 元素。")]),e._v(" "),v("h2",{attrs:{id:"-"}},[e._v("译者补记")]),e._v(" "),v("p",[e._v("关于 Proxy，可以参阅：")]),e._v(" "),v("ul",[v("li",[v("p",[v("a",{attrs:{href:"http://es6.ruanyifeng.com/#docs/proxy",target:"_blank"}},[e._v("ECMAScript 6 入门")])])]),e._v(" "),v("li",[v("p",[v("a",{attrs:{href:"http://exploringjs.com/es6/ch_proxies.html",target:"_blank"}},[e._v("Metaprogramming with proxies")])])]),e._v(" "),v("li",[v("p",[v("a",{attrs:{href:"http://www.2ality.com/2016/11/proxying-builtins.html",target:"_blank"}},[e._v("Pitfall: not all objects can be proxied transparently")])])]),e._v(" "),v("li",[v("p",[v("a",{attrs:{href:"http://pinggod.com/2016/%E5%AE%9E%E4%BE%8B%E8%A7%A3%E6%9E%90-ES6-Proxy-%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF/",target:"_blank"}},[e._v("实例解析 ES6 Proxy 使用场景")])])]),e._v(" "),v("li",[v("p",[v("a",{attrs:{href:"http://www.cnblogs.com/ziyunfei/p/3187867.html",target:"_blank"}},[e._v("ES6中的代理对象")])])])])])},[],!1,null,null,null);t.default=component.exports}}]);
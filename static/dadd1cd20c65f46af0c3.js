(window.webpackJsonp=window.webpackJsonp||[]).push([[104],{256:function(t,l,n){"use strict";n.r(l);var v={computed:{data:function(){return{title:"某易 2014 校招面试总结",keywords:"原创,面试",pathname:"xease-campus-2014-note",translation:null,create_time:"2014-09-24",prev:{title:"记一种水平垂直居中的办法",pathname:"vh-center-layout"},next:{title:"某度 2014 年秋招前端笔试",pathname:"xdu-campus-recruitment-2014"}}}}},_=n(3),component=Object(_.a)(v,function(){var t=this,l=t.$createElement,n=t._self._c||l;return n("post",{attrs:{data:t.data}},[n("p",[t._v("今天参加了某易的前端开发工程师一面。")]),t._v(" "),n("p",[t._v("算是离“前端”这两个字又近了一步吧——好吧，虽然我一面就跪了。")]),t._v(" "),n("p",[t._v("其实只是压根儿就没做面试的准备，因为对博主这种“技术爱好者”来说，某易的前端笔试题比某度变态 N 倍（仔细想想其实还是某度的笔试比较有质量），前 22 道选择基本靠蒙，最后居然接到面试通知了。")]),t._v(" "),n("p",[t._v("面试问了很多基本的问题。直到面试结束，博主才发现自己为自己挖了无数的坑。唉，都是泪。")]),t._v(" "),n("p",[t._v("初次面试的压力之下，面试有一些基本的问题没有被我解决或者答错了。下面依次来说说看。")]),t._v(" "),n("p",[t._v("第一题，10个 div，点击任意一个后打印出点击的的index。")]),t._v(" "),n("p",[t._v("so easy，果断用了 "),n("code",[t._v("aLi[i].index = i")]),t._v(" 的方法。面试官复又问道闭包如何实现。")]),t._v(" "),n("p",[t._v("压力之下，博主竟然木有答粗来！！！现在再想想，真是自杀的心都有了！！！")]),t._v(" "),n("p",[t._v("回来之后想到的两种方法如下：")]),t._v(" "),n("pre",[n("code",{staticClass:"hljs lang-javascript"},[n("span",{staticClass:"hljs-keyword"},[t._v("var")]),t._v(" oUl = "),n("span",{staticClass:"hljs-built_in"},[t._v("document")]),t._v(".getElementsByTagName("),n("span",{staticClass:"hljs-string"},[t._v('"ul"')]),t._v(")["),n("span",{staticClass:"hljs-number"},[t._v("0")]),t._v("];\n"),n("span",{staticClass:"hljs-keyword"},[t._v("var")]),t._v(" aLi = oUl.children;\n\n"),n("span",{staticClass:"hljs-comment"},[t._v("//常规方法")]),t._v("\n"),n("span",{staticClass:"hljs-keyword"},[t._v("for")]),t._v("("),n("span",{staticClass:"hljs-keyword"},[t._v("var")]),t._v(" i="),n("span",{staticClass:"hljs-number"},[t._v("0")]),t._v("; i<aLi.length; i++){\n    aLi[i].index = i;\n    aLi[i].onclick = "),n("span",{staticClass:"hljs-function"},[n("span",{staticClass:"hljs-keyword"},[t._v("function")]),t._v("("),n("span",{staticClass:"hljs-params"}),t._v(")")]),t._v("{\n        "),n("span",{staticClass:"hljs-built_in"},[t._v("console")]),t._v(".log("),n("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".index);\n    };\n}\n\n"),n("span",{staticClass:"hljs-comment"},[t._v("//方法1")]),t._v("\n"),n("span",{staticClass:"hljs-keyword"},[t._v("for")]),t._v("("),n("span",{staticClass:"hljs-keyword"},[t._v("var")]),t._v(" i="),n("span",{staticClass:"hljs-number"},[t._v("0")]),t._v("; i<aLi.length; i++){\n    ("),n("span",{staticClass:"hljs-function"},[n("span",{staticClass:"hljs-keyword"},[t._v("function")]),t._v(" ("),n("span",{staticClass:"hljs-params"},[t._v("idx")]),t._v(")")]),t._v("{\n        aLi[idx].onclick = "),n("span",{staticClass:"hljs-function"},[n("span",{staticClass:"hljs-keyword"},[t._v("function")]),t._v("("),n("span",{staticClass:"hljs-params"}),t._v(")")]),t._v("{\n            "),n("span",{staticClass:"hljs-built_in"},[t._v("console")]),t._v(".log(idx);\n        };\n    })(i);\n}\n\n"),n("span",{staticClass:"hljs-comment"},[t._v("//方法2")]),t._v("\n"),n("span",{staticClass:"hljs-keyword"},[t._v("for")]),t._v("("),n("span",{staticClass:"hljs-keyword"},[t._v("var")]),t._v(" i="),n("span",{staticClass:"hljs-number"},[t._v("0")]),t._v("; i<aLi.length; i++){\n    aLi[i].onclick = "),n("span",{staticClass:"hljs-function"},[n("span",{staticClass:"hljs-keyword"},[t._v("function")]),t._v("("),n("span",{staticClass:"hljs-params"}),t._v(")")]),t._v("{\n        "),n("span",{staticClass:"hljs-keyword"},[t._v("var")]),t._v(" j = i;\n        "),n("span",{staticClass:"hljs-keyword"},[t._v("return")]),t._v("  "),n("span",{staticClass:"hljs-function"},[n("span",{staticClass:"hljs-keyword"},[t._v("function")]),t._v("("),n("span",{staticClass:"hljs-params"}),t._v(")")]),t._v("{\n            "),n("span",{staticClass:"hljs-built_in"},[t._v("console")]),t._v(".log(j);\n        };\n    }();\n}")])]),n("p",[t._v("第二个问题， CSS 实现首尾高度固定、中间高度自适应的 DIV 布局，没回答清楚。")]),t._v(" "),n("p",[t._v("最后百度了一番，看到"),n("a",{attrs:{href:"http://www.cnblogs.com/ckmouse/archive/2012/02/14/2351043.html",target:"_blank"}},[t._v("一篇文章")]),t._v(" 。问题基本被解决了。只能怪自己基础不牢。")]),t._v(" "),n("p",[t._v("码基本参考前引文章，感谢作者解惑。")]),t._v(" "),n("pre",[n("code",{staticClass:"hljs lang-html"},[n("span",{staticClass:"hljs-meta"},[t._v("<!doctype html>")]),t._v("\n"),n("span",{staticClass:"hljs-tag"},[t._v("<"),n("span",{staticClass:"hljs-name"},[t._v("html")]),t._v(" "),n("span",{staticClass:"hljs-attr"},[t._v("lang")]),t._v("="),n("span",{staticClass:"hljs-string"},[t._v('"zh-CN"')]),t._v(">")]),t._v("\n"),n("span",{staticClass:"hljs-tag"},[t._v("<"),n("span",{staticClass:"hljs-name"},[t._v("head")]),t._v(">")]),t._v("\n    "),n("span",{staticClass:"hljs-tag"},[t._v("<"),n("span",{staticClass:"hljs-name"},[t._v("meta")]),t._v(" "),n("span",{staticClass:"hljs-attr"},[t._v("charset")]),t._v("="),n("span",{staticClass:"hljs-string"},[t._v('"utf-8"')]),t._v(">")]),t._v("\n    "),n("span",{staticClass:"hljs-tag"},[t._v("<"),n("span",{staticClass:"hljs-name"},[t._v("title")]),t._v(">")]),t._v("Document"),n("span",{staticClass:"hljs-tag"},[t._v("</"),n("span",{staticClass:"hljs-name"},[t._v("title")]),t._v(">")]),t._v("\n"),n("span",{staticClass:"hljs-tag"},[t._v("</"),n("span",{staticClass:"hljs-name"},[t._v("head")]),t._v(">")]),t._v("\n"),n("span",{staticClass:"hljs-tag"},[t._v("<"),n("span",{staticClass:"hljs-name"},[t._v("body")]),t._v(">")]),t._v("\n    "),n("span",{staticClass:"hljs-tag"},[t._v("<"),n("span",{staticClass:"hljs-name"},[t._v("div")]),t._v(" "),n("span",{staticClass:"hljs-attr"},[t._v("class")]),t._v("="),n("span",{staticClass:"hljs-string"},[t._v('"con"')]),t._v(">")]),t._v("\n        "),n("span",{staticClass:"hljs-tag"},[t._v("<"),n("span",{staticClass:"hljs-name"},[t._v("div")]),t._v(" "),n("span",{staticClass:"hljs-attr"},[t._v("class")]),t._v("="),n("span",{staticClass:"hljs-string"},[t._v('"top"')]),t._v(">")]),n("span",{staticClass:"hljs-tag"},[t._v("</"),n("span",{staticClass:"hljs-name"},[t._v("div")]),t._v(">")]),t._v("\n        "),n("span",{staticClass:"hljs-tag"},[t._v("<"),n("span",{staticClass:"hljs-name"},[t._v("div")]),t._v(" "),n("span",{staticClass:"hljs-attr"},[t._v("class")]),t._v("="),n("span",{staticClass:"hljs-string"},[t._v('"md"')]),t._v(">")]),n("span",{staticClass:"hljs-tag"},[t._v("</"),n("span",{staticClass:"hljs-name"},[t._v("div")]),t._v(">")]),t._v("\n        "),n("span",{staticClass:"hljs-tag"},[t._v("<"),n("span",{staticClass:"hljs-name"},[t._v("div")]),t._v(" "),n("span",{staticClass:"hljs-attr"},[t._v("class")]),t._v("="),n("span",{staticClass:"hljs-string"},[t._v('"bottom"')]),t._v(">")]),n("span",{staticClass:"hljs-tag"},[t._v("</"),n("span",{staticClass:"hljs-name"},[t._v("div")]),t._v(">")]),t._v("\n    "),n("span",{staticClass:"hljs-tag"},[t._v("</"),n("span",{staticClass:"hljs-name"},[t._v("div")]),t._v(">")]),t._v("\n\n    "),n("span",{staticClass:"hljs-tag"},[t._v("<"),n("span",{staticClass:"hljs-name"},[t._v("style")]),t._v(">")]),n("span",{staticClass:"css"},[t._v("\n        *{"),n("span",{staticClass:"hljs-attribute"},[t._v("margin")]),t._v(":"),n("span",{staticClass:"hljs-number"},[t._v("0")]),t._v("; "),n("span",{staticClass:"hljs-attribute"},[t._v("padding")]),t._v(":"),n("span",{staticClass:"hljs-number"},[t._v("0")]),t._v(";}\n        "),n("span",{staticClass:"hljs-selector-tag"},[t._v("html")]),t._v(","),n("span",{staticClass:"hljs-selector-tag"},[t._v("body")]),t._v(","),n("span",{staticClass:"hljs-selector-class"},[t._v(".con")]),t._v("{"),n("span",{staticClass:"hljs-attribute"},[t._v("height")]),t._v(":"),n("span",{staticClass:"hljs-number"},[t._v("100%")]),t._v(";"),n("span",{staticClass:"hljs-attribute"},[t._v("width")]),t._v(":"),n("span",{staticClass:"hljs-number"},[t._v("100%")]),t._v(";"),n("span",{staticClass:"hljs-attribute"},[t._v("height")]),t._v(":"),n("span",{staticClass:"hljs-number"},[t._v("100%")]),t._v(";"),n("span",{staticClass:"hljs-attribute"},[t._v("width")]),t._v(":"),n("span",{staticClass:"hljs-number"},[t._v("100%")]),t._v(";}            \n        "),n("span",{staticClass:"hljs-selector-tag"},[t._v("div")]),t._v("{"),n("span",{staticClass:"hljs-attribute"},[t._v("position")]),t._v(":absolute;}\n        "),n("span",{staticClass:"hljs-selector-class"},[t._v(".top")]),t._v(","),n("span",{staticClass:"hljs-selector-class"},[t._v(".bottom")]),t._v("{"),n("span",{staticClass:"hljs-attribute"},[t._v("width")]),t._v(":"),n("span",{staticClass:"hljs-number"},[t._v("100%")]),t._v(";"),n("span",{staticClass:"hljs-attribute"},[t._v("height")]),t._v(":"),n("span",{staticClass:"hljs-number"},[t._v("100px")]),t._v(";"),n("span",{staticClass:"hljs-attribute"},[t._v("z-index")]),t._v(":"),n("span",{staticClass:"hljs-number"},[t._v("5")]),t._v(";}\n        "),n("span",{staticClass:"hljs-selector-class"},[t._v(".top")]),t._v("{"),n("span",{staticClass:"hljs-attribute"},[t._v("background")]),t._v(":red;"),n("span",{staticClass:"hljs-attribute"},[t._v("top")]),t._v(":"),n("span",{staticClass:"hljs-number"},[t._v("0")]),t._v(";}\n        "),n("span",{staticClass:"hljs-selector-class"},[t._v(".bottom")]),t._v("{"),n("span",{staticClass:"hljs-attribute"},[t._v("background")]),t._v(":black;"),n("span",{staticClass:"hljs-attribute"},[t._v("bottom")]),t._v(":"),n("span",{staticClass:"hljs-number"},[t._v("0")]),t._v(";}\n        "),n("span",{staticClass:"hljs-selector-class"},[t._v(".md")]),t._v("{\n            "),n("span",{staticClass:"hljs-attribute"},[t._v("width")]),t._v(": "),n("span",{staticClass:"hljs-number"},[t._v("100%")]),t._v(";\n            "),n("span",{staticClass:"hljs-attribute"},[t._v("background")]),t._v(": "),n("span",{staticClass:"hljs-number"},[t._v("#a7fad7")]),t._v(";\n            "),n("span",{staticClass:"hljs-attribute"},[t._v("overflow")]),t._v(": auto;\n            "),n("span",{staticClass:"hljs-attribute"},[t._v("top")]),t._v(": "),n("span",{staticClass:"hljs-number"},[t._v("100px")]),t._v(";\n            "),n("span",{staticClass:"hljs-attribute"},[t._v("bottom")]),t._v(": "),n("span",{staticClass:"hljs-number"},[t._v("100px")]),t._v(";\n            "),n("span",{staticClass:"hljs-attribute"},[t._v("position")]),t._v(": absolute;\n            "),n("span",{staticClass:"hljs-attribute"},[t._v("_height")]),t._v(": "),n("span",{staticClass:"hljs-number"},[t._v("100%")]),t._v(";\n            "),n("span",{staticClass:"hljs-attribute"},[t._v("_border-top")]),t._v(": -"),n("span",{staticClass:"hljs-number"},[t._v("100px")]),t._v(" solid "),n("span",{staticClass:"hljs-number"},[t._v("#eee")]),t._v(";\n            "),n("span",{staticClass:"hljs-attribute"},[t._v("_border-bottom")]),t._v(": -"),n("span",{staticClass:"hljs-number"},[t._v("100px")]),t._v(" solid "),n("span",{staticClass:"hljs-number"},[t._v("#eee")]),t._v(";\n            "),n("span",{staticClass:"hljs-attribute"},[t._v("_top")]),t._v(": "),n("span",{staticClass:"hljs-number"},[t._v("0")]),t._v(";"),n("span",{staticClass:"hljs-comment"},[t._v("/*http://www.cnblogs.com/ckmouse/archive/2012/02/14/2351043.html*/")]),t._v("\n        }\n    ")]),n("span",{staticClass:"hljs-tag"},[t._v("</"),n("span",{staticClass:"hljs-name"},[t._v("style")]),t._v(">")]),t._v("\n"),n("span",{staticClass:"hljs-tag"},[t._v("</"),n("span",{staticClass:"hljs-name"},[t._v("body")]),t._v(">")]),t._v("\n"),n("span",{staticClass:"hljs-tag"},[t._v("</"),n("span",{staticClass:"hljs-name"},[t._v("html")]),t._v(">")])])]),n("p",[t._v("重点有二。")]),t._v(" "),n("p",[t._v("其一是 absolute 定位的 div 的宽高可以由设置 top、right、bottom、left 等属性来控制，如此一来自适应的问题得到解决；")]),t._v(" "),n("p",[t._v("其二是 IE6 特殊的盒模型（width、height 将 border 包含在内），所以用一个 css hack 将其上下 border 设置为负数，高度设为百分之百）：")]),t._v(" "),n("p",[t._v("最后，还有一个基础问题。且mark之。  ")]),t._v(" "),n("pre",[n("code",{staticClass:"hljs lang-html"},[n("span",{staticClass:"hljs-tag"},[t._v("<"),n("span",{staticClass:"hljs-name"},[t._v("div")]),t._v(" "),n("span",{staticClass:"hljs-attr"},[t._v("style")]),t._v("="),n("span",{staticClass:"hljs-string"},[t._v('"font:100px/200px Microsoft Yahei;width:660px;height:200px;text-overflow:ellipsis;"')]),t._v(">")]),t._v("\n    天地玄黄宇,宙洪荒日月。\n"),n("span",{staticClass:"hljs-tag"},[t._v("</"),n("span",{staticClass:"hljs-name"},[t._v("div")]),t._v(">")]),t._v("\n"),n("span",{staticClass:"hljs-tag"},[t._v("<"),n("span",{staticClass:"hljs-name"},[t._v("style")]),t._v(">")]),n("span",{staticClass:"css"},[t._v("\n    "),n("span",{staticClass:"hljs-selector-tag"},[t._v("div")]),t._v(" {\n        "),n("span",{staticClass:"hljs-comment"},[t._v("/*超出宽度的不可见*/")]),t._v("\n        "),n("span",{staticClass:"hljs-attribute"},[t._v("overflow")]),t._v(": hidden;\n        "),n("span",{staticClass:"hljs-comment"},[t._v('/*不换行（除非遇到"<br>"）*/')]),t._v("\n        "),n("span",{staticClass:"hljs-attribute"},[t._v("white-space")]),t._v(": nowrap;\n        "),n("span",{staticClass:"hljs-comment"},[t._v("/*以“...”方式表示文本隐藏。*/")]),t._v("\n        "),n("span",{staticClass:"hljs-comment"},[t._v("/*博主当时很肯定地说用这就够了，完全把上面两行忘得干干净净*/")]),t._v("\n        "),n("span",{staticClass:"hljs-attribute"},[t._v("text-overflow")]),t._v(": ellipsis;\n    } \n")]),n("span",{staticClass:"hljs-tag"},[t._v("</"),n("span",{staticClass:"hljs-name"},[t._v("style")]),t._v(">")])])]),n("p",[t._v("最后，以一句诗结束博主失败的面试：我本将心向明月，奈何明月照沟渠。")])])},[],!1,null,null,null);l.default=component.exports}}]);
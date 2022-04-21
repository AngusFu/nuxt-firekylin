(window.webpackJsonp=window.webpackJsonp||[]).push([[69],{221:function(t,e,n){"use strict";n.r(e);var v={computed:{data:function(){return{title:"[译] yarn 和 npm 命令行小抄",description:"yarn 和 npm 命令行小抄",keywords:"翻译,NPM,Node.js",pathname:"npm-vs-yarn-cheat-sheet",translation:{author:"@Gant Laborde",social:"https://shift.infinite.red/@gantlaborde",from:"https://shift.infinite.red/npm-vs-yarn-cheat-sheet-8755b092e5cc#.6tkj2w3rn"},create_time:"2016-10-19",prev:{title:"JavaScript Weekly 306 阅读笔记",pathname:"javascript-weekly-306-notes"},next:{title:"[译] 函数式 TypeScript",pathname:"functional-refactor-typescript"}}}}},r=n(3),component=Object(r.a)(v,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("post",{attrs:{data:t.data}},[n("p",[n("img",{directives:[{name:"lazy",rawName:"v-lazy",value:"https://p.ssl.qhimg.com/t0149afb99874e3c348.png",expression:"`https://p.ssl.qhimg.com/t0149afb99874e3c348.png`"}],attrs:{alt:""}})]),t._v(" "),n("p",[t._v("好，想必你对新的 JavaScript 包管理工具 "),n("a",{attrs:{href:"https://github.com/yarnpkg/yarn",target:"_blank"}},[t._v("yarn")]),t._v(" 已经有所耳闻，并已通过 "),n("code",[t._v("npm i -g yarn")]),t._v(" 进行了安装，现在想知道怎么样使用吗？如果你了解 npm，你已经会很大一部分啦！")]),t._v(" "),n("p",[t._v("下面是我从 npm 切换到 yarn 的一些笔记。")]),t._v(" "),n("p",[n("strong",[t._v("请收藏本文，本文会随着 yarn 的升级而更新。")])]),t._v(" "),n("h2",{attrs:{id:"-"}},[t._v("需要了解的命令")]),t._v(" "),n("ul",[n("li",[n("p",[n("code",[t._v("npm install")]),t._v(" === "),n("code",[t._v("yarn")]),t._v(" —— install 安装是默认行为。")])]),t._v(" "),n("li",[n("p",[n("code",[t._v("npm install taco --save")]),t._v(" === "),n("code",[t._v("yarn add taco")]),t._v(" —— taco 包立即被保存到 "),n("code",[t._v("package.json")]),t._v(" 中。")])]),t._v(" "),n("li",[n("p",[n("code",[t._v("npm uninstall taco --save")]),t._v(" === "),n("code",[t._v("yarn remove taco")])]),t._v(" "),n("p",[t._v(" 在 npm 中，可以使用 "),n("code",[t._v("npm config set save true")]),t._v(" 设置 "),n("code",[t._v("—-save")]),t._v(" 为默认行为，但这对多数开发者而言并非显而易见的。在 yarn 中，在"),n("code",[t._v("package.json")]),t._v(" 中添加（add）和移除（remove）等行为是默认的。")])]),t._v(" "),n("li",[n("p",[n("code",[t._v("npm install taco --save-dev")]),t._v(" === "),n("code",[t._v("yarn add taco --dev")])])]),t._v(" "),n("li",[n("p",[n("code",[t._v("npm update --save")]),t._v(" === "),n("code",[t._v("yarn upgrade")])]),t._v(" "),n("p",[t._v(" update（更新） vs upgrade（升级）， 赞！upgrade 才是实际做的事！版本号提升时，发生的正是upgrade！")]),t._v(" "),n("p",[n("a",{attrs:{href:"https://github.com/npm/npm/issues/13555",target:"_blank"}},[n("strong",[t._v("注意")])]),t._v("： "),n("code",[t._v("npm update --save")]),t._v(" "),n("a",{attrs:{href:"https://github.com/npm/npm/issues/13555",target:"_blank"}},[t._v("在版本 3.11 中似乎有点问题")]),t._v("。")])]),t._v(" "),n("li",[n("p",[n("code",[t._v("npm install taco@latest --save")]),t._v(" === "),n("code",[t._v("yarn add taco")])])]),t._v(" "),n("li",[n("p",[n("code",[t._v("npm install taco --global")]),t._v(" === "),n("code",[t._v("yarn global add taco")]),t._v(" —— 一如既往，请谨慎使用 global 标记。")])])]),t._v(" "),n("h2",{attrs:{id:"-"}},[t._v("已知悉的命令")]),t._v(" "),n("p",[t._v("包和 npm registry 上是一样的。大致而言，Yarn 只是一个新的安装工具，npm 结构和 registry 还是一样的。")]),t._v(" "),n("ul",[n("li",[n("code",[t._v("npm init")]),t._v(" === "),n("code",[t._v("yarn init")])]),t._v(" "),n("li",[n("code",[t._v("npm link")]),t._v(" === "),n("code",[t._v("yarn link")])]),t._v(" "),n("li",[n("code",[t._v("npm outdated")]),t._v(" === "),n("code",[t._v("yarn outdated")])]),t._v(" "),n("li",[n("code",[t._v("npm publish")]),t._v(" === "),n("code",[t._v("yarn publish")])]),t._v(" "),n("li",[n("code",[t._v("npm run")]),t._v(" === "),n("code",[t._v("yarn run")])]),t._v(" "),n("li",[n("code",[t._v("npm cache clean")]),t._v(" === "),n("code",[t._v("yarn cache clean")])]),t._v(" "),n("li",[n("code",[t._v("npm login")]),t._v(" === "),n("code",[t._v("yarn login")]),t._v(" (logout 同理)")]),t._v(" "),n("li",[n("code",[t._v("npm test")]),t._v(" === "),n("code",[t._v("yarn test")])])]),t._v(" "),n("h2",{attrs:{id:"yarn-"}},[t._v("Yarn 独有的命令")]),t._v(" "),n("p",[t._v("我跳过了一些提醒我们不要使用的内容，如  "),n("a",{attrs:{href:"https://yarnpkg.com/en/docs/cli/clean",target:"_blank"}},[t._v("yarn clean")]),t._v("。")]),t._v(" "),n("ul",[n("li",[n("p",[n("code",[t._v("yarn licenses ls")]),t._v("  —— 允许你检查依赖的许可信息。")])]),t._v(" "),n("li",[n("p",[n("code",[t._v("yarn licenses generate")]),t._v(" —— 自动创建依赖免责声明 license。")])]),t._v(" "),n("li",[n("p",[n("code",[t._v("yarn why taco")]),t._v(" —— 检查为什么会安装 taco，详细列出依赖它的其他包（鸣谢 "),n("a",{attrs:{href:"https://medium.com/u/5ae4b2205cba",target:"_blank"}},[t._v("Olivier Combe")]),t._v("）。")])]),t._v(" "),n("li",[n("p",[t._v("Emojis")])]),t._v(" "),n("li",[n("p",[n("a",{attrs:{href:"https://yarnpkg.com/en/compare",target:"_blank"}},[t._v("速度")])])]),t._v(" "),n("li",[n("p",[t._v("通过 yarn lockfile 自动实现 shrinkwrap 功能")])]),t._v(" "),n("li",[n("p",[t._v("以安全为中心的设计")])])]),t._v(" "),n("h2",{attrs:{id:"npm-"}},[t._v("Npm 独有的命令")]),t._v(" "),n("ul",[n("li",[n("code",[t._v("npm xmas")]),t._v(" === "),n("strong",[t._v("NO EQUIVALENT")])]),t._v(" "),n("li",[n("code",[t._v("npm visnup")]),t._v(" === "),n("strong",[t._v("NO EQUIVALENT")])])]),t._v(" "),n("p",[t._v("笔者写作本文时， yarn 的 "),n("code",[t._v("run")]),t._v(" 命令似乎出了点问题，应该会在 "),n("code",[t._v("0.15.2")]),t._v(" 中修复。在这一点上， npm 好多了。感谢 "),n("a",{attrs:{href:"https://medium.com/u/5563771fbaad",target:"_blank"}},[t._v("Zachary")]),t._v(" 的研究！")]),t._v(" "),n("h2",{attrs:{id:"-"}},[t._v("还有更多呢!")]),t._v(" "),n("h3",{attrs:{id:"-"}},[t._v("值得一看")]),t._v(" "),n("ul",[n("li",[n("p",[n("strong",[t._v("Yehuda Katz using Yarn")]),t._v(" — "),n("a",{attrs:{href:"http://yehudakatz.com/2016/10/11/im-excited-to-work-on-yarn-the-new-js-package-manager-2/",target:"_blank"}},[t._v("http://yehudakatz.com/2016/10/11/im-excited-to-work-on-yarn-the-new-js-package-manager-2/")])])]),t._v(" "),n("li",[n("p",[n("strong",[t._v("Facebook Announce")]),t._v(" — "),n("a",{attrs:{href:"https://code.facebook.com/posts/1840075619545360",target:"_blank"}},[t._v("https://code.facebook.com/posts/1840075619545360")])])]),t._v(" "),n("li",[n("p",[n("strong",[t._v("News")]),t._v(" — "),n("a",{attrs:{href:"http://thenextweb.com/dd/2016/10/12/facebook-launches-yarn-a-faster-npm-client/",target:"_blank"}},[t._v("http://thenextweb.com/dd/2016/10/12/facebook-launches-yarn-a-faster-npm-client/")])])]),t._v(" "),n("li",[n("p",[n("strong",[t._v("Benchmarking")]),t._v(" — "),n("a",{attrs:{href:"https://www.berriart.com/blog/2016/10/npm-yarn-benchmark/",target:"_blank"}},[t._v("https://www.berriart.com/blog/2016/10/npm-yarn-benchmark/")])])])]),t._v(" "),n("h3",{attrs:{id:"-"}},[t._v("进阶阅读")]),t._v(" "),n("ul",[n("li",[n("p",[n("a",{attrs:{href:"https://yarnpkg.com/en/docs/",target:"_blank"}},[t._v("https://yarnpkg.com/en/docs/")])])]),t._v(" "),n("li",[n("p",[n("a",{attrs:{href:"https://twitter.com/yarnpkg",target:"_blank"}},[t._v("https://twitter.com/yarnpkg")])])]),t._v(" "),n("li",[n("p",[n("a",{attrs:{href:"https://github.com/yarnpkg/yarn",target:"_blank"}},[t._v("https://github.com/yarnpkg/yarn")])])]),t._v(" "),n("li",[n("p",[n("a",{attrs:{href:"https://yarnpkg.com/en/docs/migrating-from-npm#toc-cli-commands-comparison",target:"_blank"}},[t._v("https://yarnpkg.com/en/docs/migrating-from-npm")])])])])])},[],!1,null,null,null);e.default=component.exports}}]);
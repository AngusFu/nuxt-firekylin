(window.webpackJsonp=window.webpackJsonp||[]).push([[59],{210:function(t,n,l){"use strict";l.r(n);var e={computed:{data:function(){return{title:"JavaScript Weekly 306 阅读笔记",description:" JavaScript Weekly 306 阅读笔记",keywords:"原创,阅读笔记,Angular 2",pathname:"javascript-weekly-306-notes",translation:null,create_time:"2016-10-21",prev:{title:"关于前端常见算法面试题的一些思考",pathname:"front-end-interview-algo-questions"},next:{title:"[译] yarn 和 npm 命令行小抄",pathname:"npm-vs-yarn-cheat-sheet"}}}}},v=l(3),component=Object(v.a)(e,function(){var t=this,n=t.$createElement,l=t._self._c||n;return l("post",{attrs:{data:t.data}},[l("h2",{attrs:{id:"-document-ready-"}},[l("code",[t._v("$(document).ready")]),t._v(" 方法")]),t._v(" "),l("ul",[l("li",[l("p",[t._v("jQuery 3 中"),l("code",[t._v("$(document).ready(handler)")]),t._v(" 等方法被 deprecated，仅保留 "),l("code",[t._v("$(handler)")])])]),t._v(" "),l("li",[l("p",[l("code",[t._v("$('img').ready")]),t._v(" 这种方式，和 "),l("code",[t._v("$(document).ready")]),t._v(" 没有任何区别")])]),t._v(" "),l("li",[l("p",[l("code",[t._v("$(selector).ready(handler)")]),t._v(" 这种是低效的，且会造成不必要的误解")])]),t._v(" "),l("li",[l("p",[t._v("脚本放在 "),l("code",[t._v("<body>")]),t._v(" 最底部的话，完全不需要 ready；")])])]),t._v(" "),l("p",[t._v("原生代码实现：")]),t._v(" "),l("pre",[l("code",{staticClass:"hljs lang-javascript"},[l("span",{staticClass:"hljs-keyword"},[t._v("var")]),t._v(" callback = "),l("span",{staticClass:"hljs-function"},[l("span",{staticClass:"hljs-keyword"},[t._v("function")]),t._v("("),l("span",{staticClass:"hljs-params"}),t._v(")")]),t._v("{\n  "),l("span",{staticClass:"hljs-comment"},[t._v("// Handler when the DOM is fully loaded")]),t._v("\n};\n\n"),l("span",{staticClass:"hljs-keyword"},[t._v("if")]),t._v(" (\n    "),l("span",{staticClass:"hljs-built_in"},[t._v("document")]),t._v(".readyState === "),l("span",{staticClass:"hljs-string"},[t._v('"complete"')]),t._v(" ||\n    ("),l("span",{staticClass:"hljs-built_in"},[t._v("document")]),t._v(".readyState !== "),l("span",{staticClass:"hljs-string"},[t._v('"loading"')]),t._v(" && !"),l("span",{staticClass:"hljs-built_in"},[t._v("document")]),t._v(".documentElement.doScroll)\n) {\n  callback();\n} "),l("span",{staticClass:"hljs-keyword"},[t._v("else")]),t._v(" {\n  "),l("span",{staticClass:"hljs-built_in"},[t._v("document")]),t._v(".addEventListener("),l("span",{staticClass:"hljs-string"},[t._v('"DOMContentLoaded"')]),t._v(", callback);\n}\n\n"),l("span",{staticClass:"hljs-comment"},[t._v("// IE <= 8 ")]),t._v("\n"),l("span",{staticClass:"hljs-built_in"},[t._v("document")]),t._v(".attachEvent("),l("span",{staticClass:"hljs-string"},[t._v('"onreadystatechange"')]),t._v(", "),l("span",{staticClass:"hljs-function"},[l("span",{staticClass:"hljs-keyword"},[t._v("function")]),t._v("("),l("span",{staticClass:"hljs-params"}),t._v(")")]),t._v("{\n  "),l("span",{staticClass:"hljs-comment"},[t._v("// check if the DOM is fully loaded")]),t._v("\n  "),l("span",{staticClass:"hljs-keyword"},[t._v("if")]),t._v("("),l("span",{staticClass:"hljs-built_in"},[t._v("document")]),t._v(".readyState === "),l("span",{staticClass:"hljs-string"},[t._v('"complete"')]),t._v("){\n    "),l("span",{staticClass:"hljs-comment"},[t._v("// remove the listener, to make sure it isn't fired in future")]),t._v("\n    "),l("span",{staticClass:"hljs-built_in"},[t._v("document")]),t._v(".detachEvent("),l("span",{staticClass:"hljs-string"},[t._v('"onreadystatechange"')]),t._v(", "),l("span",{staticClass:"hljs-built_in"},[t._v("arguments")]),t._v(".callee);\n    "),l("span",{staticClass:"hljs-comment"},[t._v("// The actual handler...")]),t._v("\n  }\n});")])]),l("p",[l("small",[t._v("原文："),l("a",{attrs:{href:"https://www.sitepoint.com/jquery-document-ready-plain-javascript/",target:"_blank"}},[t._v("Quick Tip: Replace jQuery’s Ready() with Plain JavaScript")])])]),t._v(" "),l("h2",{attrs:{id:"yarn-vs-npm"}},[t._v("Yarn vs NPM")]),t._v(" "),l("ul",[l("li",[l("p",[t._v("shrinkwrap ")]),t._v(" "),l("ul",[l("li",[t._v("yarn 会自动更新 yarn.lock 文件，npm 需要手动维护")]),t._v(" "),l("li",[l("a",{attrs:{href:"https://yarnpkg.com/en/docs/configuration#toc-use-yarn-lock-to-pin-your-dependencies",target:"_blank"}},[t._v("yarn.lock 文档")])]),t._v(" "),l("li",[l("a",{attrs:{href:"https://docs.npmjs.com/cli/shrinkwrap",target:"_blank"}},[t._v("npm shrinkwrap 文档")])])])]),t._v(" "),l("li",[l("p",[t._v("yarn 并行安装；npm 串行安装")])]),t._v(" "),l("li",[l("p",[t._v("命令行差异：见原文，也可参见"),l("a",{attrs:{href:"http://www.wemlion.com/2016/npm-vs-yarn-cheat-sheet/",target:"_blank"}},[t._v("Yarn 和 Npm 命令行小抄")]),t._v("译文")])])]),t._v(" "),l("h2",{attrs:{id:"angular-2-reactive-forms"}},[t._v("Angular 2 Reactive Forms")]),t._v(" "),l("ul",[l("li",[l("p",[l("a",{attrs:{href:"https://toddmotto.com/angular-2-forms-reactive",target:"_blank"}},[l("strong",[t._v("reactive")])]),t._v(" ==> "),l("strong",[t._v("ReactiveFormsModule")])])]),t._v(" "),l("li",[l("p",[l("a",{attrs:{href:"https://toddmotto.com/angular-2-forms-template-driven",target:"_blank"}},[l("strong",[t._v("template-driven")])]),t._v(" ==> "),l("strong",[t._v("FormsModule")])])]),t._v(" "),l("li",[l("p",[l("code",[t._v("import { ReactiveFormsModule } from '@angular/forms';")])])]),t._v(" "),l("li",[l("p",[l("code",[t._v("import { FormControl, FormGroup, Validators } from '@angular/forms';")])])])]),t._v(" "),l("pre",[l("code",{staticClass:"hljs lang-javascript"},[l("span",{staticClass:"hljs-keyword"},[t._v("export")]),t._v(" "),l("span",{staticClass:"hljs-class"},[l("span",{staticClass:"hljs-keyword"},[t._v("class")]),t._v(" "),l("span",{staticClass:"hljs-title"},[t._v("SignupFormComponent")]),t._v(" "),l("span",{staticClass:"hljs-title"},[t._v("implements")]),t._v(" "),l("span",{staticClass:"hljs-title"},[t._v("OnInit")]),t._v(" ")]),t._v("{\n  user: FormGroup;\n  "),l("span",{staticClass:"hljs-keyword"},[t._v("constructor")]),t._v("() {}\n  ngOnInit() {\n    "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".user = "),l("span",{staticClass:"hljs-keyword"},[t._v("new")]),t._v(" FormGroup({\n      "),l("span",{staticClass:"hljs-attr"},[t._v("name")]),t._v(": "),l("span",{staticClass:"hljs-keyword"},[t._v("new")]),t._v(" FormControl("),l("span",{staticClass:"hljs-string"},[t._v("''")]),t._v(", [Validators.required, Validators.minLength("),l("span",{staticClass:"hljs-number"},[t._v("2")]),t._v(")]),\n      "),l("span",{staticClass:"hljs-attr"},[t._v("account")]),t._v(": "),l("span",{staticClass:"hljs-keyword"},[t._v("new")]),t._v(" FormGroup({\n    "),l("span",{staticClass:"hljs-attr"},[t._v("email")]),t._v(": "),l("span",{staticClass:"hljs-keyword"},[t._v("new")]),t._v(" FormControl("),l("span",{staticClass:"hljs-string"},[t._v("''")]),t._v(", Validators.required),\n    "),l("span",{staticClass:"hljs-attr"},[t._v("confirm")]),t._v(": "),l("span",{staticClass:"hljs-keyword"},[t._v("new")]),t._v(" FormControl("),l("span",{staticClass:"hljs-string"},[t._v("''")]),t._v(", Validators.required)\n      })\n    });\n  }\n  onSubmit({ value, valid }: { "),l("span",{staticClass:"hljs-attr"},[t._v("value")]),t._v(": User, "),l("span",{staticClass:"hljs-attr"},[t._v("valid")]),t._v(": boolean }) {\n    "),l("span",{staticClass:"hljs-built_in"},[t._v("console")]),t._v(".log(value, valid);\n  }\n}")])]),l("ul",[l("li",[l("code",[t._v("import { FormBuilder, FormGroup, Validators } from '@angular/forms';")])])]),t._v(" "),l("pre",[l("code",{staticClass:"hljs lang-javascript"},[t._v("@Component({...})\n"),l("span",{staticClass:"hljs-keyword"},[t._v("export")]),t._v(" "),l("span",{staticClass:"hljs-class"},[l("span",{staticClass:"hljs-keyword"},[t._v("class")]),t._v(" "),l("span",{staticClass:"hljs-title"},[t._v("SignupFormComponent")]),t._v(" "),l("span",{staticClass:"hljs-title"},[t._v("implements")]),t._v(" "),l("span",{staticClass:"hljs-title"},[t._v("OnInit")]),t._v(" ")]),t._v("{\n  user: FormGroup;\n  "),l("span",{staticClass:"hljs-keyword"},[t._v("constructor")]),t._v("(private fb: FormBuilder) {}\n  ngOnInit() {\n    "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".user = "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".fb.group({\n      "),l("span",{staticClass:"hljs-attr"},[t._v("name")]),t._v(": ["),l("span",{staticClass:"hljs-string"},[t._v("''")]),t._v(", [Validators.required, Validators.minLength("),l("span",{staticClass:"hljs-number"},[t._v("2")]),t._v(")]],\n      "),l("span",{staticClass:"hljs-attr"},[t._v("account")]),t._v(": "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".fb.group({\n    "),l("span",{staticClass:"hljs-attr"},[t._v("email")]),t._v(": ["),l("span",{staticClass:"hljs-string"},[t._v("''")]),t._v(", Validators.required],\n    "),l("span",{staticClass:"hljs-attr"},[t._v("confirm")]),t._v(": ["),l("span",{staticClass:"hljs-string"},[t._v("''")]),t._v(", Validators.required]\n      })\n    });\n  }\n  onSubmit({ value, valid }: { "),l("span",{staticClass:"hljs-attr"},[t._v("value")]),t._v(": User, "),l("span",{staticClass:"hljs-attr"},[t._v("valid")]),t._v(": boolean }) {\n    "),l("span",{staticClass:"hljs-built_in"},[t._v("console")]),t._v(".log(value, valid);\n  }\n}")])]),l("ul",[l("li",[t._v("FormBuilder 和 FormControl 对比")])]),t._v(" "),l("pre",[l("code",{staticClass:"hljs lang-javascript"},[l("span",{staticClass:"hljs-comment"},[t._v("// before")]),t._v("\nngOnInit() {\n  "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".user = "),l("span",{staticClass:"hljs-keyword"},[t._v("new")]),t._v(" FormGroup({\n    "),l("span",{staticClass:"hljs-attr"},[t._v("name")]),t._v(": "),l("span",{staticClass:"hljs-keyword"},[t._v("new")]),t._v(" FormControl("),l("span",{staticClass:"hljs-string"},[t._v("''")]),t._v(", [Validators.required, Validators.minLength("),l("span",{staticClass:"hljs-number"},[t._v("2")]),t._v(")]),\n    "),l("span",{staticClass:"hljs-attr"},[t._v("account")]),t._v(": "),l("span",{staticClass:"hljs-keyword"},[t._v("new")]),t._v(" FormGroup({\n      "),l("span",{staticClass:"hljs-attr"},[t._v("email")]),t._v(": "),l("span",{staticClass:"hljs-keyword"},[t._v("new")]),t._v(" FormControl("),l("span",{staticClass:"hljs-string"},[t._v("''")]),t._v(", Validators.required),\n      "),l("span",{staticClass:"hljs-attr"},[t._v("confirm")]),t._v(": "),l("span",{staticClass:"hljs-keyword"},[t._v("new")]),t._v(" FormControl("),l("span",{staticClass:"hljs-string"},[t._v("''")]),t._v(", Validators.required)\n    })\n  });\n}\n\n"),l("span",{staticClass:"hljs-comment"},[t._v("// after")]),t._v("\nngOnInit() {\n  "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".user = "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".fb.group({\n    "),l("span",{staticClass:"hljs-attr"},[t._v("name")]),t._v(": ["),l("span",{staticClass:"hljs-string"},[t._v("''")]),t._v(", [Validators.required, Validators.minLength("),l("span",{staticClass:"hljs-number"},[t._v("2")]),t._v(")]],\n    "),l("span",{staticClass:"hljs-attr"},[t._v("account")]),t._v(": "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".fb.group({\n      "),l("span",{staticClass:"hljs-attr"},[t._v("email")]),t._v(": ["),l("span",{staticClass:"hljs-string"},[t._v("''")]),t._v(", Validators.required],\n      "),l("span",{staticClass:"hljs-attr"},[t._v("confirm")]),t._v(": ["),l("span",{staticClass:"hljs-string"},[t._v("''")]),t._v(", Validators.required]\n    })\n  });\n}")])]),l("p",[l("small",[t._v("原文："),l("a",{attrs:{href:"https://toddmotto.com/angular-2-forms-reactive",target:"_blank"}},[t._v("Angular 2 form fundamentals: reactive forms")])])]),t._v(" "),l("h2",{attrs:{id:"es2016-strict-mode"}},[t._v("ES2016 Strict Mode")]),t._v(" "),l("ul",[l("li",[t._v("以下情况下，函数体内不能使用 "),l("code",[t._v('"use strict"')]),t._v("："),l("ul",[l("li",[t._v("参数有默认值")]),t._v(" "),l("li",[t._v("参数解构")]),t._v(" "),l("li",[t._v("rest 参数")])])])]),t._v(" "),l("pre",[l("code",{staticClass:"hljs lang-javascript"},[l("span",{staticClass:"hljs-comment"},[t._v("// syntax error in ECMAScript 2016")]),t._v("\n"),l("span",{staticClass:"hljs-function"},[l("span",{staticClass:"hljs-keyword"},[t._v("function")]),t._v(" "),l("span",{staticClass:"hljs-title"},[t._v("doSomething")]),t._v("("),l("span",{staticClass:"hljs-params"},[t._v("a, b=a")]),t._v(") ")]),t._v("{\n"),l("span",{staticClass:"hljs-meta"},[t._v('    "use strict"')]),t._v(";\n    "),l("span",{staticClass:"hljs-comment"},[t._v("// code")]),t._v("\n}\n\n"),l("span",{staticClass:"hljs-comment"},[t._v("// syntax error in ECMAScript 2016")]),t._v("\n"),l("span",{staticClass:"hljs-keyword"},[t._v("const")]),t._v(" doSomething = "),l("span",{staticClass:"hljs-function"},[l("span",{staticClass:"hljs-keyword"},[t._v("function")]),t._v("("),l("span",{staticClass:"hljs-params"},[t._v("{a, b}")]),t._v(") ")]),t._v("{\n"),l("span",{staticClass:"hljs-meta"},[t._v('    "use strict"')]),t._v(";\n    "),l("span",{staticClass:"hljs-comment"},[t._v("// code")]),t._v("\n};\n\n"),l("span",{staticClass:"hljs-comment"},[t._v("// syntax error in ECMAScript 2016")]),t._v("\n"),l("span",{staticClass:"hljs-keyword"},[t._v("const")]),t._v(" doSomething = "),l("span",{staticClass:"hljs-function"},[t._v("("),l("span",{staticClass:"hljs-params"},[t._v("...a")]),t._v(") =>")]),t._v(" {\n    "),l("span",{staticClass:"hljs-string"},[t._v('"use strict"')]),t._v(";\n    "),l("span",{staticClass:"hljs-comment"},[t._v("// code")]),t._v("\n};")])]),l("blockquote",[l("p",[t._v("the specification indicated that "),l("strong",[t._v("parameter lists should be parsed in the same mode as the function body")]),t._v(' (which means the "use strict" directive in the function body must trigger strict mode).')])]),t._v(" "),l("p",[l("small",[t._v("原文："),l("a",{attrs:{href:"https://www.nczonline.net/blog/2016/10/the-ecmascript-2016-change-you-probably-dont-know/",target:"_blank"}},[t._v("The ECMAScript 2016 change you probably don't know")])])]),t._v(" "),l("h2",{attrs:{id:"asynchronous-iteration"}},[t._v("Asynchronous Iteration")]),t._v(" "),l("ul",[l("li",[t._v("参见原文")]),t._v(" "),l("li",[t._v("Alternative 1:  Communicating Sequential Processes (CSP), "),l("a",{attrs:{href:"https://github.com/ubolonton/js-csp",target:"_blank"}},[t._v("js-csp")])]),t._v(" "),l("li",[t._v("Alternative 2: Reactive Programming")])]),t._v(" "),l("p",[l("small",[t._v("原文："),l("a",{attrs:{href:"https://www.nczonline.net/blog/2016/10/the-ecmascript-2016-change-you-probably-dont-know/",target:"_blank"}},[t._v("The ECMAScript 2016 change you probably don't know")])])]),t._v(" "),l("h2",{attrs:{id:"angular-2-"}},[t._v("Angular 2 变化")]),t._v(" "),l("p",[t._v("其实我就看上了 "),l("a",{attrs:{href:"https://plnkr.co/edit/oydh0yvV27hlQPA8wEYP?p=preview",target:"_blank"}},[t._v("Demo")]),t._v(" 中的两段代码，很有启发：")]),t._v(" "),l("pre",[l("code",{staticClass:"hljs lang-javascript"},[l("span",{staticClass:"hljs-comment"},[t._v("//our root app component")]),t._v("\n"),l("span",{staticClass:"hljs-keyword"},[t._v("import")]),t._v(" {Component, NgModule, Input, trigger, state, animate, transition, style, HostListener } "),l("span",{staticClass:"hljs-keyword"},[t._v("from")]),t._v(" "),l("span",{staticClass:"hljs-string"},[t._v("'@angular/core'")]),t._v("\n"),l("span",{staticClass:"hljs-keyword"},[t._v("import")]),t._v(" {BrowserModule} "),l("span",{staticClass:"hljs-keyword"},[t._v("from")]),t._v(" "),l("span",{staticClass:"hljs-string"},[t._v("'@angular/platform-browser'")]),t._v("\n"),l("span",{staticClass:"hljs-keyword"},[t._v("import")]),t._v(" {Tooltip} "),l("span",{staticClass:"hljs-keyword"},[t._v("from")]),t._v(" "),l("span",{staticClass:"hljs-string"},[t._v("'./tooltip.directive'")]),t._v(";\n\n@Component({\n  "),l("span",{staticClass:"hljs-attr"},[t._v("selector")]),t._v(" : "),l("span",{staticClass:"hljs-string"},[t._v("'toggle'")]),t._v(",\n  "),l("span",{staticClass:"hljs-attr"},[t._v("animations")]),t._v(": [\n    trigger("),l("span",{staticClass:"hljs-string"},[t._v("'toggle'")]),t._v(", [\n      state("),l("span",{staticClass:"hljs-string"},[t._v("'true'")]),t._v(", style({ "),l("span",{staticClass:"hljs-attr"},[t._v("opacity")]),t._v(": "),l("span",{staticClass:"hljs-number"},[t._v("1")]),t._v("; color: "),l("span",{staticClass:"hljs-string"},[t._v("'red'")]),t._v(" })),\n      state("),l("span",{staticClass:"hljs-string"},[t._v("'void'")]),t._v(", style({ "),l("span",{staticClass:"hljs-attr"},[t._v("opacity")]),t._v(": "),l("span",{staticClass:"hljs-number"},[t._v("0")]),t._v("; color: "),l("span",{staticClass:"hljs-string"},[t._v("'blue'")]),t._v(" })),\n      transition("),l("span",{staticClass:"hljs-string"},[t._v("':enter'")]),t._v(", animate("),l("span",{staticClass:"hljs-string"},[t._v("'500ms ease-in-out'")]),t._v(")),\n      transition("),l("span",{staticClass:"hljs-string"},[t._v("':leave'")]),t._v(", animate("),l("span",{staticClass:"hljs-string"},[t._v("'500ms ease-in-out'")]),t._v("))\n    ])\n  ],\n  "),l("span",{staticClass:"hljs-attr"},[t._v("template")]),t._v(": "),l("span",{staticClass:"hljs-string"},[t._v('`\n  <div class="toggle" [@toggle]="show" *ngIf="show">\n    <ng-content></ng-content>\n  </div>`')]),t._v("\n})\n"),l("span",{staticClass:"hljs-keyword"},[t._v("export")]),t._v(" "),l("span",{staticClass:"hljs-class"},[l("span",{staticClass:"hljs-keyword"},[t._v("class")]),t._v(" "),l("span",{staticClass:"hljs-title"},[t._v("Toggle")]),t._v(" ")]),t._v("{\n  @Input() show:boolean = "),l("span",{staticClass:"hljs-literal"},[t._v("true")]),t._v(";\n  @HostListener("),l("span",{staticClass:"hljs-string"},[t._v("'document:click'")]),t._v(")\n  onClick(){\n    "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".show=!"),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".show;\n  }\n}\n\n@Component({\n  "),l("span",{staticClass:"hljs-attr"},[t._v("selector")]),t._v(": "),l("span",{staticClass:"hljs-string"},[t._v("'my-app'")]),t._v(",\n  "),l("span",{staticClass:"hljs-attr"},[t._v("template")]),t._v(": "),l("span",{staticClass:"hljs-string"},[t._v("`\n    <div>\n      <div tooltip>Click to toggle animations</div>\n      <h2>Hello "+t._s(t.name)+"</h2>\n      <toggle>Hey!</toggle>\n    </div>\n  `")]),t._v(",\n})\n"),l("span",{staticClass:"hljs-keyword"},[t._v("export")]),t._v(" "),l("span",{staticClass:"hljs-class"},[l("span",{staticClass:"hljs-keyword"},[t._v("class")]),t._v(" "),l("span",{staticClass:"hljs-title"},[t._v("App")]),t._v(" ")]),t._v("{\n  name:string;\n  "),l("span",{staticClass:"hljs-keyword"},[t._v("constructor")]),t._v("() {\n    "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".name = "),l("span",{staticClass:"hljs-string"},[t._v("'Angular 2.1'")]),t._v("\n  }\n}\n\n@NgModule({\n  "),l("span",{staticClass:"hljs-attr"},[t._v("imports")]),t._v(": [ BrowserModule ],\n  "),l("span",{staticClass:"hljs-attr"},[t._v("declarations")]),t._v(": [ App, Toggle, Tooltip ],\n  "),l("span",{staticClass:"hljs-attr"},[t._v("bootstrap")]),t._v(": [ App ]\n})\n"),l("span",{staticClass:"hljs-keyword"},[t._v("export")]),t._v(" "),l("span",{staticClass:"hljs-class"},[l("span",{staticClass:"hljs-keyword"},[t._v("class")]),t._v(" "),l("span",{staticClass:"hljs-title"},[t._v("AppModule")]),t._v(" ")]),t._v("{}")])]),l("pre",[l("code",{staticClass:"hljs lang-javascript"},[l("span",{staticClass:"hljs-comment"},[t._v("// tooltip.directive.ts")]),t._v("\n"),l("span",{staticClass:"hljs-keyword"},[t._v("import")]),t._v(" {Directive, ElementRef, HostListener} "),l("span",{staticClass:"hljs-keyword"},[t._v("from")]),t._v(" "),l("span",{staticClass:"hljs-string"},[t._v('"@angular/core"')]),t._v(";\n\n@Directive({\n  "),l("span",{staticClass:"hljs-attr"},[t._v("selector")]),t._v(": "),l("span",{staticClass:"hljs-string"},[t._v("'[tooltip]'")]),t._v(",\n  "),l("span",{staticClass:"hljs-attr"},[t._v("host")]),t._v(": {\n    "),l("span",{staticClass:"hljs-string"},[t._v("'[class.tooltip]'")]),t._v(": "),l("span",{staticClass:"hljs-string"},[t._v('"true"')]),t._v(",\n  }\n})\n"),l("span",{staticClass:"hljs-keyword"},[t._v("export")]),t._v(" "),l("span",{staticClass:"hljs-class"},[l("span",{staticClass:"hljs-keyword"},[t._v("class")]),t._v(" "),l("span",{staticClass:"hljs-title"},[t._v("Tooltip")]),t._v(" ")]),t._v("{\n  "),l("span",{staticClass:"hljs-keyword"},[t._v("constructor")]),t._v("(private div: ElementRef) { }\n\n  @HostListener("),l("span",{staticClass:"hljs-string"},[t._v("'document:mousemove'")]),t._v(", ["),l("span",{staticClass:"hljs-string"},[t._v("'$event'")]),t._v("])\n  mousemove(e: MouseEvent){\n    "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".div.nativeElement.style.display = "),l("span",{staticClass:"hljs-string"},[t._v('"block"')]),t._v(";\n    "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".div.nativeElement.style.top = e.pageY + "),l("span",{staticClass:"hljs-number"},[t._v("15")]),t._v(" + "),l("span",{staticClass:"hljs-string"},[t._v('"px"')]),t._v(";\n    "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".div.nativeElement.style.left = e.pageX + "),l("span",{staticClass:"hljs-number"},[t._v("10")]),t._v(" + "),l("span",{staticClass:"hljs-string"},[t._v('"px"')]),t._v(";\n  }\n\n  @HostListener("),l("span",{staticClass:"hljs-string"},[t._v("'document:mouseout'")]),t._v(", ["),l("span",{staticClass:"hljs-string"},[t._v("'$event'")]),t._v("])\n  mouseout(e: MouseEvent){\n    "),l("span",{staticClass:"hljs-keyword"},[t._v("var")]),t._v(" "),l("span",{staticClass:"hljs-keyword"},[t._v("from")]),t._v(" = e.relatedTarget || e.toElement;\n    "),l("span",{staticClass:"hljs-keyword"},[t._v("if")]),t._v(" (!"),l("span",{staticClass:"hljs-keyword"},[t._v("from")]),t._v(" || "),l("span",{staticClass:"hljs-keyword"},[t._v("from")]),t._v(".nodeName == "),l("span",{staticClass:"hljs-string"},[t._v('"HTML"')]),t._v(") {\n      "),l("span",{staticClass:"hljs-keyword"},[t._v("this")]),t._v(".div.nativeElement.style.display = "),l("span",{staticClass:"hljs-string"},[t._v('"none"')]),t._v(";\n    }\n  }\n}")])]),l("p",[l("small",[t._v("原文："),l("a",{attrs:{href:"https://medium.com/google-developer-experts/angular-2-new-features-in-angular-2-1-94132b1888f0#.wegekey62",target:"_blank"}},[t._v("Angular 2 — New features in Angular 2.1")])])]),t._v(" "),l("h2",{attrs:{id:"-d-ts"}},[t._v("编写自己的 .d.ts")]),t._v(" "),l("p",[t._v("写得挺详细，需要的时候可以参阅")]),t._v(" "),l("p",[l("small",[t._v("原文："),l("a",{attrs:{href:"http://blog.wolksoftware.com/contributing-to-definitelytyped",target:"_blank"}},[t._v("How to Create Your Own TypeScript Type Definition Files (.d.ts)")])])]),t._v(" "),l("h2",{attrs:{id:"-"}},[t._v("更多")]),t._v(" "),l("p",[t._v("see "),l("a",{attrs:{href:"http://javascriptweekly.com/issues/306",target:"_blank"}},[t._v("http://javascriptweekly.com/issues/306")])])])},[],!1,null,null,null);n.default=component.exports}}]);
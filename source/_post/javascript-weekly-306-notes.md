---
title: 'JavaScript Weekly 306 阅读笔记'
desc: ' JavaScript Weekly 306 阅读笔记'
date: 2016-10-21
tags:
  - 原创
  - 阅读笔记
  - Angular 2
---

## `$(document).ready` 方法

- jQuery 3 中`$(document).ready(handler)` 等方法被 deprecated，仅保留 `$(handler)` 

- `$('img').ready` 这种方式，和 `$(document).ready` 没有任何区别

- `$(selector).ready(handler)` 这种是低效的，且会造成不必要的误解

- 脚本放在 `<body>` 最底部的话，完全不需要 ready；

原生代码实现：

```javascript
var callback = function(){
  // Handler when the DOM is fully loaded
};

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  callback();
} else {
  document.addEventListener("DOMContentLoaded", callback);
}

// IE <= 8 
document.attachEvent("onreadystatechange", function(){
  // check if the DOM is fully loaded
  if(document.readyState === "complete"){
    // remove the listener, to make sure it isn't fired in future
    document.detachEvent("onreadystatechange", arguments.callee);
    // The actual handler...
  }
});
```

<small>原文：[Quick Tip: Replace jQuery’s Ready() with Plain JavaScript](https://www.sitepoint.com/jquery-document-ready-plain-javascript/)</small>

## Yarn vs NPM

- shrinkwrap 
  - yarn 会自动更新 yarn.lock 文件，npm 需要手动维护
  - [yarn.lock 文档](https://yarnpkg.com/en/docs/configuration#toc-use-yarn-lock-to-pin-your-dependencies)
  - [npm shrinkwrap 文档](https://docs.npmjs.com/cli/shrinkwrap)

- yarn 并行安装；npm 串行安装

- 命令行差异：见原文，也可参见[Yarn 和 Npm 命令行小抄](http://www.wemlion.com/2016/npm-vs-yarn-cheat-sheet/)译文

## Angular 2 Reactive Forms

- [**reactive**](https://toddmotto.com/angular-2-forms-reactive) ==> **ReactiveFormsModule** 

- [**template-driven**](https://toddmotto.com/angular-2-forms-template-driven) ==> **FormsModule**

- `import { ReactiveFormsModule } from '@angular/forms';`

- `import { FormControl, FormGroup, Validators } from '@angular/forms';`

```javascript
export class SignupFormComponent implements OnInit {
  user: FormGroup;
  constructor() {}
  ngOnInit() {
    this.user = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      account: new FormGroup({
	email: new FormControl('', Validators.required),
	confirm: new FormControl('', Validators.required)
      })
    });
  }
  onSubmit({ value, valid }: { value: User, valid: boolean }) {
    console.log(value, valid);
  }
}
```

- `import { FormBuilder, FormGroup, Validators } from '@angular/forms';`

```javascript
@Component({...})
export class SignupFormComponent implements OnInit {
  user: FormGroup;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.user = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      account: this.fb.group({
	email: ['', Validators.required],
	confirm: ['', Validators.required]
      })
    });
  }
  onSubmit({ value, valid }: { value: User, valid: boolean }) {
    console.log(value, valid);
  }
}
```

- FormBuilder 和 FormControl 对比

```javascript
// before
ngOnInit() {
  this.user = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    account: new FormGroup({
      email: new FormControl('', Validators.required),
      confirm: new FormControl('', Validators.required)
    })
  });
}

// after
ngOnInit() {
  this.user = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    account: this.fb.group({
      email: ['', Validators.required],
      confirm: ['', Validators.required]
    })
  });
}
```

<small>原文：[Angular 2 form fundamentals: reactive forms](https://toddmotto.com/angular-2-forms-reactive)</small>


## ES2016 Strict Mode

- 以下情况下，函数体内不能使用 `"use strict"`：
  - 参数有默认值
  - 参数解构
  - rest 参数

```javascript
// syntax error in ECMAScript 2016
function doSomething(a, b=a) {
    "use strict";
    // code
}

// syntax error in ECMAScript 2016
const doSomething = function({a, b}) {
    "use strict";
    // code
};

// syntax error in ECMAScript 2016
const doSomething = (...a) => {
    "use strict";
    // code
};
```

> the specification indicated that **parameter lists should be parsed in the same mode as the function body** (which means the "use strict" directive in the function body must trigger strict mode).

<small>原文：[The ECMAScript 2016 change you probably don't know](https://www.nczonline.net/blog/2016/10/the-ecmascript-2016-change-you-probably-dont-know/)</small>


##  Asynchronous Iteration

- 参见原文
- Alternative 1:  Communicating Sequential Processes (CSP), [js-csp](https://github.com/ubolonton/js-csp)
- Alternative 2: Reactive Programming

<small>原文：[The ECMAScript 2016 change you probably don't know](https://www.nczonline.net/blog/2016/10/the-ecmascript-2016-change-you-probably-dont-know/)</small>

## Angular 2 变化

其实我就看上了 [Demo](https://plnkr.co/edit/oydh0yvV27hlQPA8wEYP?p=preview) 中的两段代码，很有启发：

```javascript
//our root app component
import {Component, NgModule, Input, trigger, state, animate, transition, style, HostListener } from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Tooltip} from './tooltip.directive';

@Component({
  selector : 'toggle',
  animations: [
    trigger('toggle', [
      state('true', style({ opacity: 1; color: 'red' })),
      state('void', style({ opacity: 0; color: 'blue' })),
      transition(':enter', animate('500ms ease-in-out')),
      transition(':leave', animate('500ms ease-in-out'))
    ])
  ],
  template: `
  <div class="toggle" [@toggle]="show" *ngIf="show">
    <ng-content></ng-content>
  </div>`
})
export class Toggle {
  @Input() show:boolean = true;
  @HostListener('document:click')
  onClick(){
    this.show=!this.show;
  }
}

@Component({
  selector: 'my-app',
  template: `
    <div>
      <div tooltip>Click to toggle animations</div>
      <h2>Hello {{name}}</h2>
      <toggle>Hey!</toggle>
    </div>
  `,
})
export class App {
  name:string;
  constructor() {
    this.name = 'Angular 2.1'
  }
}

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ App, Toggle, Tooltip ],
  bootstrap: [ App ]
})
export class AppModule {}
```

```javascript
// tooltip.directive.ts
import {Directive, ElementRef, HostListener} from "@angular/core";

@Directive({
  selector: '[tooltip]',
  host: {
    '[class.tooltip]': "true",
  }
})
export class Tooltip {
  constructor(private div: ElementRef) { }
  
  @HostListener('document:mousemove', ['$event'])
  mousemove(e: MouseEvent){
    this.div.nativeElement.style.display = "block";
    this.div.nativeElement.style.top = e.pageY + 15 + "px";
    this.div.nativeElement.style.left = e.pageX + 10 + "px";
  }
  
  @HostListener('document:mouseout', ['$event'])
  mouseout(e: MouseEvent){
    var from = e.relatedTarget || e.toElement;
    if (!from || from.nodeName == "HTML") {
      this.div.nativeElement.style.display = "none";
    }
  }
}
```
<small>原文：[Angular 2 — New features in Angular 2.1](https://medium.com/google-developer-experts/angular-2-new-features-in-angular-2-1-94132b1888f0#.wegekey62)</small>

## 编写自己的 .d.ts

写得挺详细，需要的时候可以参阅

<small>原文：[How to Create Your Own TypeScript Type Definition Files (.d.ts)](http://blog.wolksoftware.com/contributing-to-definitelytyped)</small>

## 更多

see [http://javascriptweekly.com/issues/306](http://javascriptweekly.com/issues/306)

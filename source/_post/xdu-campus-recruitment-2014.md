---
title: 某度 2014 年秋招前端笔试
tags:
  - 原创
  - 面试
date: 2014-09-21
desc:
---

今晚跑去华工参加百度 Web 前端的笔试，做完之后交卷，本来感觉是“为之四顾，为之踌躇满志”的。然而……

其中一道题目是关于数组的，回来在电脑上面一敲，顿时为自己的智商和知识羞愧了。

多话不说，直接上题目吧。大概是酱紫的：

代码如下，请写出输出的结果。 

```javascript
var str = 'john';
var str2 = 'angus';

var arr1 = str.split('');
var arr2 = arr1.reverse();
var arr = str2.split('');
var arr3 = arr2.push(arr);

console.log(arr1.length, arr1.slice(-1));
console.log(arr3.length, arr3.slice(-1));
```

先说答案：第一次打印，`5, [ Array[5] ]`；第二次不仅没有结果，还报错了。

你，猜到了吗？博主没有猜到两点：

1.第一次显示 arr1 的 length 是 “5”；

2.第二次居然没有任何输出，还报错，博主试了 N++ 次都不敢相信。

下面解释下这些问题。

第一个问题，见博客园中的[这篇博文](http://www.cnblogs.com/0banana0/archive/2011/11/17/2252639.html)：

>结论:js数组是引用类型,它只允许通过索引来获取或改变数组的值。引用类型的东西都是不能通过(它赋值过的外部变量)所改变的。也就是(它赋值过的外部变量)这个值改变了原数组不会有任何变化。

所以虽然我们是在arr3上应用push()方法，但最终影响的还是arr1、arr2、arr3共同指向的数组。

上述博文一楼评论说得很明白：

<blockquote>
JS 中没有指针，只有传值（value)与传址（reference引用）的区别。

```javascript
var a = [1,2,3,4] // a 不仅是数组，还是个对象，实际上 a 就是对 [1,2,3,4] 的引用
var b = a
var c = a
// 以上两条赋值语句建立了 b 与 c 对 a 即 [1,2,3,4] 的引用
// 无论改变 a 还是 b 抑或 c 都是对 [1,2,3,4] 的操作
// 这就是传址(堆中操作)

// 把 a[1] 的值"1"传递给 d
// 对 d 的改变则不会影响 a[1]
// 即所谓的传值(栈中操作)
var d = a[1]
```
</blockquote>

第二个问题是第11行代码报错的问题。这涉及到 Array 的可变方法不可变方法。

- `unshift()` 方法可向数组的开头添加一个或更多元素，并返回新的长度;
- `push()` 方法可向数组的末尾添加一个或多个元素，并返回新的长度;
- `pop()` 方法用于删除并返回数组的最后一个元素;
- `shift()` 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。

So，一定一定要记住，这四个方法是有返回值的。

另外，array.splice() 方法也是有返回值的，返回的含有被删除的元素的数组（如果木有元素被删除，辣么返回空数组）。

```javascript
var str = 'john';
var str2 = 'angus';
var a = str.split('');
var b = str2.split('');
var c = a.splice(2,1,"test");

console.log(a); // Array [ "j", "o", "test", "n" ] 
console.log(b); // Array [ "a", "n", "g", "u", "s" ] 
console.log(c); // Array [ "h" ]
```

还得提到 reverse()、sort() 这两个操作是会影响到原来的数组的：

```javascript
var str = 'john';
var a = str.split('');
var c = a.sort();

console.log(c); // Array [ "h", "j", "n", "o" ]
console.log(a); // Array [ "h", "j", "n", "o" ]
```

而 concat()、slice() 操作则对数组都不影响。。。。

说到concat()方法，想到了昨天看到的**高效复制数组**的方法：

```javascript
var newArr = rr.slice(0)
// or
var newArr = arr.concat()
```

记下来备用吧。。。

这是作为前端新手的第一篇博文。继续加油~


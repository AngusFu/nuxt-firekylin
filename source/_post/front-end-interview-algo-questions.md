---
title: 关于前端常见算法面试题的一些思考
desc: 关于前端常见算法面试题的一些思考
date: 2016-10-26
tags:
  - 算法
  - JavaScript
  - 原创
---

今天上班时间，读了 [@JackPu](http://www.jackpu.com/) 的新文章[《前端面试中的常见的算法问题》](http://www.jackpu.com/qian-duan-mian-shi-zhong-de-chang-jian-de-suan-fa-wen-ti/)。内容虽然看起挺基础，但可以有不少思考，同时也是一次挺好的复习。

其中，有几个问题，想出了一些不同的解决办法，做了下笔记，并且进行了简单的性能测试。关于排序，这次没有深看。接下来有空时，再研究一番。

## 判断回文(Palindromic Words)

结果是，使用循环来判断，性能远高于数组方法。接下来，在其他一些例子中也能看到，借用数组方法，往往很耗性能。

```javascript

// Array methods
const isPalindromicA = w => w === w.split('').reverse().join('');

// while loop
const isPalindromicB = (w) => {
    
    let len = w.length;
    // 感谢 @拉比克魔王 的指点
    let start = Math.ceil(len / 2);
    while (start < len) {
      if (w[start] !== w[len - start - 1]) {
            return false;
       }
       start++;
    }
    return true;
};

// -------------------------------------------------
// perf test
// first let's generate a fake word with, say 20 chars
var word = (function () {
    var len = 20;
    var arr = [];
    while (len--) {
        arr.push(97 + ((Math.random()* 26) | 0));
    }
    return String.fromCharCode.apply(String, arr);
})();

// times
var t = 2e4;
var i = 0;

console.time('Array method');
while (i < t) {
    isPalindromicA(word);
    i++;
}
console.timeEnd('Array method');

i = 0;
console.time('Loop');
while (i < t) {
    isPalindromicB(word);
    i++;
}
console.timeEnd('Loop');

```


## 数组去重

ES 5 方法性能更好，高一倍以上。不过笔试、面试时，附上 `Set` 的办法，肯定会更好。

```javascript

// ES 5
const uniqueES5 = (arr) => {
    var cache = {};
    return arr.filter((item) => {
        return cache[item] ? false : (cache[item] = true);
    });
};

// ES6 method
// 为啥用了 Array.from 呢，保持类型一致啊
const uniqueES6 = (arr) => Array.from(new Set(arr));


// -------------------------------------------------
// perf test

// times
var t = 2e4;
var i;
var array = [1, 2, 3, 3, 2, 4, 5, 4];

i = 0;
console.time('ES5 filter + cache');
while (i < t) {
    uniqueES5(array);
    i++;
}
console.timeEnd('ES5 filter + cache');

i = 0;
console.time('ES6 Set');
while (i < t) {
    uniqueES6(array);
    i++;
}
console.timeEnd('ES6 Set');

```



## 统计一个字符串出现最多的字母

正则表达式的办法，临时想起来的，运行起来还是要慢，至少慢了一半。所以有时候还是要老老实实写代码，奇淫巧技少用。

```javascript

// 黑科技
const findMaxDuplicateCharRegex = (chars) => {
    // 先对字符进行排序
    chars = chars.split('').sort().join('');
    // 获取相同字符序列
    let regex = /(.)(\1)+/g;

    let temp = null;
    let max = 0;
    let char = '';

    while (temp = regex.exec(chars)) {
        if (temp[0].length > max) {
            char = temp[1];
            max = temp[0].length;
        }
    }
    return char;
};

// see http://www.jackpu.com/qian-duan-mian-shi-zhong-de-chang-jian-de-suan-fa-wen-ti/
var findMaxDuplicateCharNormal = function(str) {
    if (str.length == 1) {
        return str;
    }
    let charObj = {};
    for (let i = 0; i < str.length; i++) {
        if (!charObj[str.charAt(i)]) {
            charObj[str.charAt(i)] = 1;
        } else {
            charObj[str.charAt(i)] += 1;
        }
    }
    let maxChar = '',
        maxValue = 1;
    for (var k in charObj) {
        if (charObj[k] >= maxValue) {
            maxChar = k;
            maxValue = charObj[k];
        }
    }
    return maxChar;
};


// -------------------------------------------------
// perf test

// first let's generate a random string with 30 chars
var chars = (function () {
    var len = 30;
    var arr = [];
    while (len--) {
        arr.push(97 + ((Math.random()* 26) | 0));
    }
    return String.fromCharCode.apply(String, arr);
})();

// times
var t = 2e4;
var i;

i = 0;
console.time('正常方法');
while (i < t) {
    findMaxDuplicateCharNormal(chars);
    i++;
}
console.timeEnd('正常方法');

i = 0;
console.time('正则方法');
while (i < t) {
    findMaxDuplicateCharRegex(chars);
    i++;
}
console.timeEnd('正则方法');

```



## 不借助临时变量，进行两个整数的交换

三种方式均可。没有做性能测试。


```javascript

let a = 1;
let b = 2;

// ES 6
[a, b] = [b, a];

// 加减法
a = a - b;
b = b + a;
a = b - a;

// 异或
a = a ^ b;
b = a ^ b;
a = b ^ a;

```



## 斐波那契数列

联想到了三种方式：动态规划；[尾递归](http://es6.ruanyifeng.com/#docs/function#尾递归)；generator（算不上一个解决方案，只是临时想到的）。

上述三种方式中，动态规划最快，计算 fib(1000) 20000 次耗时 170 ms；尾递归耗时 200 ms 左右，generator 耗时 2800 ms 左右。

```javascript

// 动态规划
const fibonacciDynamic = function (n) {
    let array = [0, 1];

    for(let i = 2; i < n + 1; i++){
        array[i] = array[i - 1] + array[i - 2];
    }

    return array[n];
};

// 尾递归
const fibonacciTailCall = function (n , ac1 = 1 , ac2 = 1) {
    if( n <= 1 ) {
        return ac2
    }
    return fibonacciTailCall(n - 1, ac2, ac1 + ac2);
};

// generator
const fibonacciGenerator = (function () {
    function *fib() {
        let a = 0, b = 1, sum = 0;

        while (true) {
            sum = a + b;
            b = a;
            a = sum;
            yield sum;
        }
    }
    
    return function (n) {
        var iterator = fib();
        let result = 0;

        while (n--) {
            result = iterator.next();
        }
        return result.value;
    };
}());


// -------------------------------------------------
// perf test
// calculate fib(1000) 20000 times

var t = 2e4;
var n = 1000;
var i;

i = 0;
console.time('动态规划');
while (i < t) {
    fibonacciDynamic(n);
    i++;
}
console.timeEnd('动态规划');


i = 0;
console.time('尾递归');
while (i < t) {
    fibonacciTailCall(n);
    i++;
}
console.timeEnd('尾递归');


i = 0;
console.time('generator');
while (i < t) {
    fibonacciGenerator(n);
    i++;
}
console.timeEnd('generator');

```



## 正数组的最大差值

出乎意料地，这次 Math 方法竟然败给看 for 循环。不用说，reduce 超级慢，比 Math 还慢近十倍。

声明：Math 只是在本案例中比 for 循环慢，实际上如果只是单独取数组中的最大值或最小值，Math 还是很厉害的。实测：随机生成一个长度为 20 的数组（100 以内的正整数），寻找最大值，运行 10^6 次，Math 完胜，不到 1s 搞定，for 循环直接卡死。所以还是得看具体情况。

```javascript

// 使用 Math 
const getMaxGap = (array) => Math.max.apply(Math, array) - Math.min.apply(Math, array);

// 使用 reduce
const getMaxDiff = (array) => {
    if (array.length < 1) return arrary[0];

    array = array.reduce(([max, min], el) => {
       max = el > max ? el : max;
       min = el < min ? el : min;
       return [max, min];
    }, array);

    return array[0] - array[1];
};

// see http://www.jackpu.com/qian-duan-mian-shi-zhong-de-chang-jian-de-suan-fa-wen-ti/
function getMaxProfit(arr) {
    var minPrice = arr[0];
    var maxProfit = 0;

    for (var i = 0; i < arr.length; i++) {
        var currentPrice = arr[i];

        minPrice = Math.min(minPrice, currentPrice);

        var potentialProfit = currentPrice - minPrice;

        maxProfit = Math.max(maxProfit, potentialProfit);
    }

    return maxProfit;
}


// -------------------------------------------------
// perf test
// 2000000 times: Math ~= 100ms; Reduce ~= 1100ms; Normal ~= 25ms

let array = [10,5,11,7,8,9];

var t = 2e6;
var n = 1000;
var i;

i = 0;
console.time('Math');
while (i < t) {
    getMaxGap(array);
    i++;
}
console.timeEnd('Math');

i = 0;
console.time('Reduce');
while (i < t) {
    getMaxDiff(array);
    i++;
}
console.timeEnd('Reduce');


i = 0;
console.time('Normal');
while (i < t) {
    getMaxProfit(array);
    i++;
}
console.timeEnd('Normal');

```

对算法的了解还十分浅薄，错误肯定有，希望读者指教。还需要钻研更多。感谢 [@JackPu](http://www.jackpu.com/) 的文章带来的启发和思考。

<div class="tip">
补注：<br>
本文在描述测试结果会进行一些对比，也会使用一些“失败”“不如”等字眼，但测试比较主要是满足好奇心。实际工作中，多数人应该不会碰到那么大的计算量，因此几乎不用担心（多数情况下），多关注其他方面的优化吧。<br>
另外，请不要对某些说法（正数组的差值例子中所说 Math 败给 for 循环）产生刻板印象（我自己就是，这次之后总感觉 Math 是不是不给力。被自己误会到了囧），具体情况具体分析，另外，多操作，多做实验。<br>
如果本文一些不严谨的说法给您的学习、工作造成负面影响，还请谅解。如有问题，欢迎随时和我联系。
</div>

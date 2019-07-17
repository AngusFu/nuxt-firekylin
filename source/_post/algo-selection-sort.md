---
title: "算法学习：选择排序"
desc: "算法学习：选择排序"
date: 2016-11-06
tags:
  - 原创
  - JavaScript
  - 算法
---

所谓“选择排序”，基本思路就是不断从数组中选择出最小的数。

还是以扑克牌为例。假设有 N 张扑克牌，记扑克牌集合为 cards，则我们的基本操作如下：

首先，从手中拿出左侧第 0 张牌 cardA；

第二步，将 cardA 向右**依次**与剩下的  (N - 1) 张牌进行对比，找出最小的那张牌所在的位置 minIndex；

第三步，对比完成后，若 minIndex 不等于 1，则说明 cardA 不是最小的，将 cards[minIndex] 与 cardA 进行位置交换。

第四步，从第二张牌开始，重复前面的步骤……

……

最后得到的数组即是排序好的。

实现如下：

```javascript
// 选择排序
function selectionSort(cards) {
  cards = cards.slice(0);
  var len = cards.length;
  var i = 0;
  var j = 0;
  var minIndex = 0;
  var temp = 0;

  for (i = 0; i < len - 1; i++) {
    // 将当前的数字与后面子序列中最小数进行换位
    // 这样每次拿到前面的都是最小的数字
    minIndex = i;

    // 寻找子序列中最小数的索引
    // 每一轮得比较 n - i 次
    for (j = i + 1; j < len; j++) {
      if (cards[j] < cards[minIndex]) {
        minIndex = j;
      }
    }

    // 如果当前数比后面子序列最小元素大
    // 则进行换位处理
    if (minIndex !== i) {
      temp = cards[i];
      cards[i] = cards[minIndex];
      cards[minIndex] = temp;
    }
  }
  return cards;
}
```

来粗略看下时间复杂度的问题。

实际上，这个算法，**不存在最好的情况和最坏的情况**。因为每次通过比较寻找最小数时，必须将所有剩余数字对比个遍。

第一次需要与 (N - 1) 个数进行对比；第二次需要与 (N - 2 个数) 对比，直到最后。总的计算次数为 `(N - 1) + (N - 2) + ... + 1 + 0 = N * (N - 1) / 2`。不难看出，**时间复杂度是 `O(n^n)`**。

在 JavaScript 中，与[插入排序](../algo-insertion-sort/)比较，感觉选择排序比较好的一点是，没有频繁的元素位置调换，每次只会进行一次交换这一点上，性能应该会好很多（尤其是数组较大的情况下）。可以参考 [测试Demo](https://jsfiddle.net/wemlin/hf4bz4mc/)。

每次使用的数组都长度为 1000、元素为在 (0, 10000) 区间中的整数的随机数组，每种方法分别测试 10000次，最终取计算时间平均值。结果插入排序每次时间大约在 0.9 毫秒左右，而选择排序在 0.6 毫秒左右，但注意，这里的时间**包含**生成随机数组的时间。

也可以用 node 来测试（排序函数代码略）：

```javascript
var times = 10000;

var t = times;
console.time('selectionSort');
while (t--) {
    selectionSort(getRandArray(1000));
}
console.timeEnd('selectionSort');


t = times;
console.time('insertionSort');
while (t--) {
  insertionSort(getRandArray(1000));
}
console.timeEnd('insertionSort');

// 获取指定长度的元素大小在 0 到 10000 之间的随机数组
function getRandArray(len) {
  return (new Array(len)).fill(0).map((i) => Math.random() * 10000 | 0);
}
```





 

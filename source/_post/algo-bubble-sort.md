---
 title:  "算法学习：冒泡排序"
 desc:  "算法学习：冒泡排序"
 date: 2016-11-09
 tags:
     - 原创
     - JavaScript
     - 算法
    
---

从基础入手。前面学习了[插入排序](../algo-insertion-sort/)和[选择排序](../algo-selection-sort)。

接下来看冒泡排序。

依然假设手上有 N 张扑克牌，记作 cards。

第一步，先比较第 1 张与第 2 张，如果第 1 张比第 2 张大，则将两者调换位置；

第二步，重复上面的方法，比较第 2 张、第 3 张；

……

第 (n - 1) 步，比较第 (n - 1) 张、第 n 张，若第 (n - 1) 张比第 n 张大，则将两者调换位置。

仔细想下，发现没有？这样 (n - 1) 个步骤下来，整个数组中最大数已经被顺利推到最右侧啦！也就是说，现在第 n 个数已经是最大的。这就是冒泡排序叫“冒泡”的原因。

那么接下来，我们只需要对前面的 (n - 1) 个数再进行同样的 (n - 2) 次操作，找到第二大的数放在第 (n - 1) 个位置上。

最后的实现如下：

```javascript
const bubbleSort = (cards) => {
  cards = cards.slice(0);

  let len = cards.length;
  let temp = 0;

  for (let i = len - 1; i >= 0; i--) {

    for (let j = 0; j < len - i; j++) {

      if (cards[j] > cards[j + 1]) {
        temp = cards[j + 1];
        cards[j + 1] = cards[j];
        cards[j] = temp;
      }
    }
  }

  return cards;
};
```

仅仅看循环次数，评估下冒泡排序的复杂度。很简单，因为每次需要 (i - 1) 步的两两对比，因此总的时间是：

```javascript
(n - 1) + (n - 2) + ... + (2 - 1) + (1 - 1) = n * (n - 1) / 2
```

复杂度为 O(n^n)。不过，在最坏的情况下，交换操作也是 O(n^n)，这对数组来说，还是有些可怕。

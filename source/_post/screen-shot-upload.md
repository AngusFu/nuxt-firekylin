---
title: Chrome和Firefox下的网页截图
date: 2016-03-11
desc: Chrome和Firefox下的网页截图
tags: 
    - 原创
    - JavaScript
    - Angular.js
    - 网页截图
---

最近在实现一个功能，需求如下：
   
- 前提：当前页面无弹窗
- 页面任意位置执行粘贴
- 读取剪切板中的截屏数据
- 上传截图

首先还是从网上找相关的例子。

找到了SF上的专栏文章《[js获取剪切板内容，js控制图片粘贴](https://segmentfault.com/a/1190000004288686)》。

于是基于这个，做出了第一版的截图上传功能。

由于项目使用的是angularjs，事先已经封装好一套上传图片的办法，只需要调用 `$scope.image = blob`，自动就会发送、上传该文件。


我是半路介入项目的。原来为数不多的几个js文件实在太大，一个 `apiService.js`就累积了三四千行，各种服务都在这个文件里，主视图就一个mainController，也是三四千行。

说实话，我真的惊呆了。

所以还是尽量避免修改原来的代码。

按照我自己习惯，把功能封装成 `directive`，独立建一个文件。

**代码如下**：（特别鸣谢[本期节目](https://segmentfault.com/u/weil)的文章）

```javascript
/**
 * @description: 截屏上传
 * @author:      angusfu1126@qq.com
 * @date:        2016-03-03 20:59:09
 */
app.directive('screenshotOrDragUpload', /*ngInject*/ function($filter) {
    return {
        restrict: 'A'
        link: function($scope, iElm, iAttrs, controller) {

            var imageRegex = /^image\//i;

            // 粘贴截图事件
            document.addEventListener('paste', onPasteHandler, false);

            // 作用域销毁的时候解除事件绑定
            $scope.$on('$destroy', function() {
                document.removeEventListener('paste', onPasteHandler);
            });

            /**
             * 全局蒙版显示的时候
             * 不执行粘贴或者拖拽功能
             * 避免和各种弹层ng-show条件太耦合
             * 此处使用DOM方法判断
             */
            function isMaskShown() {
                // 项目依赖于jquery
                return angular.element('.global-mask').is(':visible');
            }

            /**
             * 根据时间戳命名
             */
            function generateFileName(user) {
                return $filter('date')(new Date(), 'yyyyMMdd_HH:MM:ss');
            }

            /**
             * 处理 `ctrl + v` 截图粘贴事件
             */
            function onPasteHandler(e) {
                if (isMaskShown()) return;

                var clipboardData = e.clipboardData;
                var ua = window.navigator.userAgent;

                // 如果无法获取剪贴板则返回
                if (!clipboardData || !clipboardData.items) {
                    return;
                }

                // Mac平台下Chrome49版本以下
                // 复制Finder中的文件的Bug Hack掉
                // see: https://segmentfault.com/a/1190000004288686
                if (clipboardData.items
                        && clipboardData.items.length === 2
                        && clipboardData.items[0].kind === "string"
                        && clipboardData.items[1].kind === "file"
                        && clipboardData.types
                        && clipboardData.types.length === 2
                        && clipboardData.types[0] === "text/plain"
                        && clipboardData.types[1] === "Files"
                        && ua.match(/Macintosh/i)
                        && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49
                 ) {
                    return;
                }

                var len = clipboardData.items.length,
                    item = null,
                    blob = null;

                while (len--) {

                    item = clipboardData.items[len];

                    if (item.kind == "file") {

                        blob = item.getAsFile();

                        if (imageRegex.test(blob.type) && blob.size > 0) {
                            blob.name = generateFileName();

                            // 调用上传
                            $scope.image = blob;
                            break;
                        }
                    }
                }
            }


        }
    };
});
```

当然，文章不可能就此结束。。。

分割线休息片刻

==============================================================


上述功能只有在 Chrome 和 Safari 中有效，但到火狐上面就挂掉了啊。。。

测试一下，给 document 绑定 paste 事件，粘贴的时候压根就读不到数据。

火狐下面，并没有 `clipboardData.items` 这一项。

o(╯□╰)o

那怎么办呢？

只能退而求其次。放弃，或者寻求降级的办法。

就在我觉得无路可走的时候，火狐的一个特点让我眼前一亮。。。

分别用 chrome 和 firefox 打开这个 [demo](http://sandbox.runjs.cn/show/xjhkfcr2)试试看，试着用 qq 截个图或者在文件夹中复制一张图片，粘贴在红色框框里。

有没有发现，只有在火狐下能把图粘贴进来？

嗯，解决办法就在这里了。

其实，demo 中的红色框框是一个有 `contenteditable` 属性的 `div`。

关于 `contenteditable`，此处有张鑫旭大神的博文两篇，且记在此处备忘：

- [小tip: 如何让contenteditable元素只能输入纯文本](http://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/)

- [div模拟textarea文本域轻松实现高度自适应](http://www.zhangxinxu.com/wordpress/2010/12/div-textarea-height-auto/)

firefox 下面，是可以把剪切板中的图片数据粘贴进去的，而 chrome 下面则不行了。

而项目的输入框，正好是一个 `pre` 标签加上 `contenteditable` 属性模拟出来的。完美~~~（此处应有金星老师表情包）

好了，在火狐中粘贴截图之后，右键查看一下，是不是像下图酱紫的？

![图片描述][1]

有木有看到醒目的 `img` 标签？

有木有看到醒目的 `data:image/png;base64,`？

办法有了。解决方案如下：

- 监听 `keydown` 事件

- 检测输入框是否为空
    - 非空：不允许粘贴图片（但我们不能事先判断数据类型，只能迅速remove掉img元素）
    - 空的：获取img元素及其src数据，然后迅速移除元素

当然，此处是有坑的。。。

具体坑在哪里呢？看代码吧。其实我觉得我可能没完全解决。

```javascript
if (/firefox/i.test(navigator.userAgent)) {
    var URL = (window.URL || window.mozURL),

        supportTransform = URL && window.Blob && window.atob && window.ArrayBuffer && window.Uint8Array,

        // see http://jsperf.com/blob-base64-conversion
        convertBase64UrlToBlob = function(urlData) {
            //去掉url的头，并转换为byte
            var bytes = window.atob(urlData.split(',')[1]);

            //处理异常,将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }
            return new Blob([ab], {
                type: 'image/png'
            });
        };

    $('pre').on('keydown', function(e) {

        var isCtrlV = (e.ctrlKey && e.keyCode == '86');

        if (!supportTransform || !isCtrlV) return;

        var $this = $(this),
            html = $this.html(),
            canPasteImage = false;

        // Notice
        // 火狐的坑在这里啊啊啊啊
        // 只有空的时候才能粘贴图片
        if (!html || html === '<br>') {
            canPasteImage = true;
        }

        setTimeout(function() {
            var $imgs = $this.find('img').remove(),
                data = $imgs.eq(0).attr('src');

            if (canPasteImage && data) {
                var blob = convertBase64UrlToBlob(data);
                blob.name = generateFileName();
                // 调用上传
                $scope.image = blob;
            }
        }, 0);

    });
}
```

做个笔记： Blob对象和base64字符串的转换, http://jsperf.com/blob-base64-conversion

目前还没在IE上测试过，不知道结果如何。  



  [1]: https://segmentfault.com/img/bVtoBY
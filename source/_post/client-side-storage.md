---
title: 客户端存储
date: 2016-06-25
desc: 客户端存储
author: Michael Mahemoff
social: http://twitter.com/mahemoff
permission: 0
from: http://www.html5rocks.com/en/tutorials/offline/storage/
tags: 
    - 翻译
    - JavaScript
    - 缓存
    - Client-Side Storage
---


## 介绍

本文是关于客户端存储（client-side storage）的。这是一个通用术语，包含几个独立但相关的 API： Web Storage、Web SQL Database、Indexed Database 和 File Access。每种技术都提供了在用户硬盘上 —— 而非通常存储数据的服务器 —— 存储数据的独特方式。这么做主要基于以下两点理由：（a）使 web app 离线可用； （b）改善性能。对于客户端存储使用情况的详细阐述，请看 HTML5Rocks 上的文章 《["离线": 这是什么意思？我为何要关心?](http://www.html5rocks.com/tutorials/offline/whats-offline/)》。

这些 API 有着类似的作用范围和规则。因此，在去看细节之前，我们先了解他们的共同之处吧。

## 共同特点

### 基于客户端的存储

实际上，“客户端时间存储”的意思是，数据传给了浏览器的存储 API，它将数据存在本地设备中的一块区域，该区域同样也是它存储其他用户特定信息如个人偏好、缓存的地方。除了存储数据，这些 API 可以用来检索数据，且在某些情况下还能执行搜索和批处理操作。

### 置于沙盒中的

所有这四个存储 API 都将数据绑到一个单独的“源”（origin）上。例如，若 http://abc.example.com 保存了一些数据，那以后浏览器就只会允许 http://abc.example.com 获取这些数据。当我们谈论“源”（origin）的时候，这意味着域（domain）必须完全相同，所以 http://example.com 和 http://def.example.com 都不行。端口（port）也必须匹配，因此 http://abc.example.com:123 也是不能访问到 http://abc.example.com （端口默认为80）存储的数据。同样，协议也必须一样（像http vs https 等等）。

### 空间限制（Quotas）

你能想象，如果任何网站都被允许往毫不知情的硬盘里填充以千兆字节计的数据，该有多混乱。因此，浏览器对存储容量施加了限制。若你的应用试图超出限制，浏览器通常会显示一个对话框，让用户确认增加。您可能以为浏览器对单个源（origin）可使用的所有存储都加以同一单独的限制，但多数存储机制都是单独加以限制的。若 [Quota API](http://www.w3.org/TR/quota-api/) 被采纳，这种情况可能会改变。但就现在来说，把浏览器当作一个二维矩阵，其维度分别是“源”（origin）和“存储”（storage）。例如， "http://abc.example.com" 可能会允许最多存 5MB 的 Web Storage， 25MB 的 Web SQL 数据库，但因用户拒绝访问被禁止使用 Indexed DataBase。 Quota API 将问题放到一起来看，让您查询还有多少可用空间，有多少空间正在使用。

有些情况下，用户也能先看到有多少存储将被使用，例如，当用户在 Chrome 应用商店中安装一个应用时，他们将被提示预先接受其权限，其中包括存储限制。（而该应用的）manifest 中的可能有个值是 “unlimited_storage” （无限制存储）。

### 数据库处理（Transactions）

两个 “数据库” 的存储格式支持数据处理。目的和通常的关系型数据库使用数据处理是一样的：保证数据库完整。数据库处理（Transactions）防止 “竞争条件”（race conditions） —— 这种情况是：当两个操作序列在同一时间被应用到数据库中， 导致操作结果都无法被预测，而数据库也处于可疑的准确性（dubious accuracy）状态。

### 同步和异步模式（Synchronous and Asynchronous Modes）

多数存储格式都支持同步和异步模式。同步模式是阻塞的，意味着下一行 js 代码执行之前，存储操作会被完整执行。异步模式会使得后面的 js 代码在数据库操作完成之前执行。存储操作会背景环境中执行，当操作完成的时候，应用会以回调函数被调用这种形式接收通知，这个函数须在调用的时候被指定。

应当尽量避免使用同步模式，它虽然看起来比较简单，但操作完成时它会阻塞页面渲染，在某些情况下甚至会冻结整个浏览器。你可能注意到网站乃至是应用出现这种情况，点击一个按钮，结果所有东西都用不了，当你还在想是不是崩溃了？结果一切又突然恢复正常了。

某些 API 没有异步模式，如 “localStorage”， 使用这些API时，应当仔细做好性能监测，并随时准备切换到一个异步API，如果它造成了问题。

## API 概述及比较

### Web Storage

[Web Storage](http://dev.w3.org/html5/webstorage/) 是一个叫做 ``localStorage`` 的持久对象。可以使用 ``localStorage.foo = "bar"`` 保存值，之后可以使用 ``localStorage.foo`` 获取到 —— 甚至是浏览器关闭之后重新打开。还可以使用一个叫做 ``sessionStorage`` 的对象，工作方式一样，只是当窗口关闭之后会被清除掉。

Web Storage 是 [NoSQL 键值对储存（NoSQL key-value store）](http://en.wikipedia.org/wiki/NoSQL#Key-value_store)的一种.

######   Web Storage 的优点

1.  数年以来，被所有现代浏览器支持， iOS 和 Android 系统下也支持（IE 从 IE8 开始支持 ）。
2.  简单的API签名。
3.  同步 API，调用简单。
4.  语义事件可保持其他标签和窗口同步。

######    Web Storage 的弱点

1.  使用同步 API（这是得到最广泛支持的模式）存储大量的或者复杂的数据时性能差。
2.  缺少索引导致检索大量的或复杂的数据时性能差。（搜索操作需要手动遍历所有项。）
3.  存储或读取大量的或复杂的数据结构时性能差，因为需要手动序序列化成字符串或将字符串反序列化。主要的浏览器实现只支持字符串（尽管规范没这么说的）。
4.  需要保证数据的持续性和完整性，因为数据是有效非结构化（effectively unstructured）的。

### Web SQL Database

[Web SQL Database](http://www.w3.org/TR/webdatabase/) 是一个结构化的数据库，具备典型 [SQL驱动的关系数据库（SQL-powered relational database）](http://en.wikipedia.org/wiki/Structured_Query_Language)的所有功能和复杂度。Indexed Database 在两者之间。[Web SQL Database](http://www.w3.org/TR/webdatabase/) 有自由形式的密钥值对，有点像 Web Storage，但也有能力从这些值来索引字段，所以搜索速度要快得多。

######  Web SQL Database 的优点
1.  被主要的移动浏览器（Android Browser, Mobile Safari, Opera Mobile）以及一些 PC 浏览器（Chrome, Safari, Opera） 支持。
2.  作为异步 API， 总体而言性能很好。数据库交互不会锁定用户界面。（同步API也可用于 WebWorkers。）
3.  良好的搜索性能，因为数据可以根据搜索键进行索引。
4.  强大，因为它支持[事务性数据库模型（transactional database model）](http://en.wikipedia.org/wiki/Database_transaction)。
5.  刚性的数据结构更容易保持数据的完整性。

######  Web SQL Database 的弱点
1.  过时，不会被 IE 或 Firefox 支持，在某些阶段可能会被从其他浏览器淘汰。
2.  学习曲线陡峭，要求掌握关系数据库和SQL的知识。
3.  [对象-关系阻抗失配（object-relational impedance mismatch）](http://en.wikipedia.org/wiki/Object-relational_impedance_mismatch).
4.  降低敏捷性，因为数据库模式必须预先定义，与表中的所有记录必须匹配相同的结构。

### Indexed Database (IndexedDB)

到目前为止，我们已经看到，Web Storage 和 Web SQL Database 都有各种的优势和弱点。 [Indexed Database](http://www.w3.org/TR/IndexedDB/) 产生于这两个早期 API 的经验，可以看作是一种结合两者优点而不招致其劣势得到尝试。

Indexed Database 是一个 “对象存储” （object stores） 的集合，可以直接把对象放进去。这个存储有点像 SQL 表，但在这种情况下，对象的结构没有约束，所以不需要预先定义什么。所以这和 Web Storage 有点像，拥有多个数据库、每个数据库又有多个存储（store）的特点。但不像 Web Storage那样， 还拥有重要的性能优势： 异步接口，可以在存储上创建索引，以提高搜索速度。

######  IndexedDB 的优点
1.  作为异步API总体表现良好。数据库交互不会锁定用户界面。（同步 API 也可用于 WebWorkers。）
2.  良好的搜索性能，因为数据可以根据搜索键进行索引。
3.  支持版本控制。
4.  强大，因为它支持[事务性数据库模型（transactional database model）](http://en.wikipedia.org/wiki/Database_transaction)。
5.  因为数据模型简单，学习曲线也相当简单。
6.  良好的浏览器支持: Chrome, Firefox, mobile FF, IE10.

######   IndexedDB 的弱点

1.  非常复杂的API，导致大量的嵌套回调。

### FileSystem

上面的 API 都是适用于文本和结构化数据，但涉及到大文件和二进制内容时，我们需要一些其他的东西。幸运的是，我们现在有了[文件系统 API 标准（FileSystem API standard）](http://dev.w3.org/2009/dap/file-system/file-dir-sys.html)。它给每个域一个完整的层次化的文件系统，至少在 Chrome 下面，这些都是用户的硬盘上的真正的文件。就单个文件的读写而言， API 建立在现有的 [File API](http://www.w3.org/TR/FileAPI/)之上。

######  FileSystem（文件系统） API 的有点
1.  可以存储大量的内容和二进制文件，很适合图像，音频，视频，PDF，等。
2.  作为异步 API， 性能良好。

######  FileSystem API 的弱点
1.  很早的标准，只有 Chrome 和 Opera 支持。
2.  没有事务（transaction）支持。
3.  没有内建的搜索/索引支持。


## 来看代码

本部分比较不同的 API 如何解决同一个问题。这个例子是一个 “地理情绪”（geo-mood） 签到系统，在那里你可以记录你在时间和地点的情绪。接口可让你在数据库类型之间切换。当然，在现实情况中，这可能显得有点作（contrived），数据库类型肯定比其他的更有意义，文件系统 API 根本不适用于这种应用！但为了演示的目的，如果我们能看到使用不同方式达到同样的结果，这还是有帮助的。还得注意，为了保值可读性，一些代码片段是经过重构的。

[现在可以来试试我们的“地理情绪”（geo-mood）应用。](http://www.html5rocks.com/en/tutorials/offline/storage/demo.html)

为了让 Demo 更有意思，我们将数据存储单独拿出来，使用[标准的面向对象的设计技术（standard object-oriented design techniques）](http://en.wikipedia.org/wiki/Polymorphism_in_object-oriented_programming)。 UI 逻辑只知道有一个 store；它无需知道 store 是如何实现的，因为每个 store 的方法是一样的。因此 UI 层代码可以称为 ``store.setup()``，``store.count()`` 等等。实际上，我们的 store 有四种实现，每种对应一种存储类型。应用启动的时候，检查 URL 并实例化对应的 store。

为了保持 API 的一致性，所有的方法都是异步的，即它们将结果返回给调用方。Web Storage 的实现甚至也是这样的，其底层实现是本地的。

在下面的演示中，我们将跳过 UI 和定位逻辑，聚焦于存储技术。

### 建立 Store

对 **localStorage**，我们做个简单的检验看存储是否存在。如果不存在，则新建一个数组，并将其存储在  localStorage 的 checkins（签到） 键下面。首先，我们使用 JSON 对象将结构序列化为字符串，因为大多数浏览器只支持字符串存储。

```javascript
if  (!localStorage.checkins) localStorage.checkins = JSON.stringify([]);
```

对 **Web SQL Database**，数据库结构如果不存在的话，我们需要先创建。幸运的是，如果数据库不存在，``openDatabase`` 方法会自动创建数据库；同样，使用 SQL 句 “if not exists” 可以确保新的 checkins 表 如果已经存在的话不会被重写。我们需要预先定义好数据结构，也就是， checkins 表每列的名称和类型。每一行数据代表一次签到。

```javascript
this.db = openDatabase('geomood', '1.0', 'Geo-Mood Checkins', 8192);
this.db.transaction(function(tx) {
    tx.executeSql(
        "create table if not exists "
            + "checkins(id integer primary key asc, time integer, latitude float,"
            + "longitude float, mood string)",
         [], function() {
            console.log("siucc"); 
        }
    );
});
```

**Indexed Database** 启动需要一些工作，因为它需要启用一个数据库版本系统。当我们连接数据库的时候要明确我们需要那个版本，如果当前数据库使用的是之前的版本或者还尚未被创建，会触发 ``onupgradeneeded`` 事件，当升级完成后 ``onsuccess`` 事件会被触发。如果无需升级，``onsuccess`` 事件马上就会触发。

另外一件事就是创建 “mood” 索引，以便之后能很快地查询到匹配的情绪。

```javascript
var db;
var version = 1;
window.indexedStore = {};
window.indexedStore.setup = function(handler) { // attempt to open the database
    var request = indexedDB.open("geomood", version);  // upgrade/create the database if needed
    request.onupgradeneeded =  function(event)  {
        var db = request.result;
        if  (event.oldVersion <  1)  { // Version 1 is the first version of the database.
            var checkinsStore = db.createObjectStore("checkins",  { keyPath:  "time"  });
            checkinsStore.createIndex("moodIndex",  "mood",  { unique:  false  });
        }
        if  (event.oldVersion <  2)  {
            // In future versions we'd upgrade our database here. 
            // This will never run here, because we're version 1.
        }
        db = request.result;
    };
    request.onsuccess =  function(ev)  {  // assign the database for access outside
        db = request.result; handler();
        db.onerror =  function(ev)  {
            console.log("db error", arguments);
        };
    };
};
```

最后，启动 **FileSystem**。我们会把每种签到 JSON 编码后放在单独的文件中，它们都在 “checkins/” 目录下面。同样这并非 FileSystem API 最合适的用途，但对演示来说还挺好。

启动在整个文件系统中拿到一个控制手柄（handle），用来检查 “checkins/” 目录。如果目录不存在，使用 ``getDirectory`` 创建。

```javascript
setup:  function(handler)  {
    requestFileSystem(
        window.PERSISTENT,
        1024*1024,
        function(fs)  {
            fs.root.getDirectory(
                "checkins",
                {},  // no "create" option, so this is a read op
                function(dir)  {
                    checkinsDir = dir;
                    handler();
                }, 
                function()  {
                    fs.root.getDirectory( "checkins",  {create:  true},  function(dir)  { checkinsDir = dir;
                        handler();
                    }, onError );
                }
            );
        },
        function(e)  {
            console.log("error "+e.code+"initialising - see http://goo.gl/YW0TI");
        }  
    );
}
```

### 保存一次签到 （Check-in）

使用 localStorage，我们只需要拿出 check-in 数组，在尾部添加一个，然后重新保存就行。我们还需要使用 JSON 对象的方法将其以字符串的方式存起来。

```javascript
var checkins = JSON.parse(localStorage["checkins"]);
checkins.push(checkin);
localStorage["checkins"] = JSON.stringify(checkins);
```

使用 Web SQL Database，所有的事情都在 transaction 中进行。我们要在 checkins 表 创建新的一行，这是一个简单的 SQL 调用，我们使用 “?” 语法，而不是把所有的签到数据都放到 “insert” 命令中，这样更整洁，也更安全。真正的数据——我们要保存的四个值——被放到第二行。“?” 元素会被这些值（``checkin.time``，``checkin.latitude``等等）替换掉。接下来的两个参数是操作完成之后被调用的函数，分别在成功和失败后调用。在这个应用中，我们对所有操作使用相同的通用错误处理程序。这样，成功回调函数就是我们传给搜索函数的句柄——确保句柄在成功的时候被调用，以便操作完成之后 UI 能接到通知（比如，更新目前为止的签到数量）。

```javascript
store.db.transaction(function(tx) {
    tx.executeSql(
        "insert into checkins " + "(time, latitude, longitude, mood) values (?,?,?,?);", 
        [checkin.time, checkin.latitude, checkin.longitude, checkin.mood],
        handler, 
        store.onError
    ); 
});
```

一旦存储建立起来，将其存储到 IndexedDB 中就像 Web Storage 差不多简单，还有异步工作的优点。

```javascript
var transaction = db.transaction("checkins",  'readwrite'); 
transaction.objectStore("checkins").put(checkin); 
transaction.oncomplete = handler;
```


使用 FileSystem API，新建文件并拿到相应的句柄，可以用 [FileWriter API](http://www.w3.org/TR/file-writer-api/) 进行填充。

```javascript
fs.root.getFile(
    "checkins/" + checkin.time,
    { create: true, exclusive: true }, 
    function(file) {
        file.createWriter(function(writer) {
            writer.onerror = fileStore.onError;
            var bb = new WebKitBlobBuilder;
            bb.append(JSON.stringify(checkin));
            writer.write(bb.getBlob("text/plain"));
            handler(); }, fileStore.onError);
    },
    fileStore.onError
);
```

### 搜索匹配项

接下来的函数找到所有匹配特定情绪的签到，例如，用户能看到他们在最近何时何地过得很开心。使用 localStorage， 我们必须手动遍历每次签到并将其与搜索的情绪对比，建立一个匹配列表。比较好的实践是返回存储数据的克隆，而不是实际的对象，因为搜索应该是一个只读的操作；所以我们将每个匹配的签到对象传递给通用的 ``clone()`` 方法进行操作。

```javascript
var allCheckins = JSON.parse(localStorage["checkins"]);
var matchingCheckins = [];
allCheckins.forEach(function(checkin) {
    if (checkin.mood == moodQuery) {
        matchingCheckins.push(clone(checkin));
    } 
});
handler(matchingCheckins);
```

使用  Web SQL Database，我们执行一次查询，只返回我们需要的行。但我们仍需要手动遍历来累计签到数据，因为数据库 API 返回的是数据库行，而不是一个数组。（对大的结果集来说这是好事，但就现在而言这增加了我们需要的工作！）

```javascript
var matchingCheckins = [];
store.db.transaction(function(tx) {
    tx.executeSql(
        "select * from checkins where mood=?",
        [moodQuery],
        function(tx, results) {
            for (var i = 0; i < results.rows.length; i++) {
                matchingCheckins.push(clone(results.rows.item(i)));
            }
            handler(matchingCheckins); 
        },
        store.onError
    );
});
```

当然，在 IndexedDB 解决方案使用索引，我们先前在 “mood” 表中创建的索引，称为“moodindex”。我们用一个指针遍历每次签到以匹配查询。注意这个指针模式也可以用于整个存储；因此，使用索引就像我们在商店里的一个窗口前，只能看到匹配的对象（类似于在传统数据库中的“视图”）。

```javascript
var store = db.transaction("checkins", 'readonly').objectStore("checkins");
var request = moodQuery ? store.index("moodIndex").openCursor(new IDBKeyRange.only(moodQuery)) : store.openCursor();
request.onsuccess = function(ev) {
    var cursor = request.result;
    if (cursor) {
        handler(cursor.value);
        cursor["continue"]();
    } 
};
```

与许多传统的文件系统一样，FileSystem API 没有索引，所以搜索算法（如 Unix中的 “grep” 命令）必须遍历每个文件。我们从 “checkins/” 目录中拿到 [Reader](http://www.w3.org/TR/FileAPI/#dfn-filereader) API ，通过 ``readentries()`` 。对于每个文件，再使用一个 reader，使用 ``readastext()`` 方法检查其内容。这些操作都是异步的，我们需要使用 ``readnext()`` 将调用连在一起。

```javascript
checkinsDir.createReader().readEntries(function(files) {
    var reader, fileCount = 0,
        checkins = [];
    var readNextFile = function() {
        reader = new FileReader();
        if (fileCount == files.length) return;
        reader.onload = function(e) {
            var checkin = JSON.parse(this.result);
            if (moodQuery == checkin.mood || !moodQuery) handler(checkin);
            readNextFile();
        };

        files[fileCount++].file(function(file) {
            reader.readAsText(file);
        });
    };
    readNextFile();
});
```

### 匹配计数

最后，我们需要给所有签到计数。

对localStorage，我们简单的反序列化签到数组，读取其长度。
```javascript
handler(JSON.parse(localStorage["checkins"]).length);
```
对 Web SQL Database，可以检索数据库中的每一行（``select * from checkins``），看结果集的长度。但如果我们知道我们在 SQL 中，有更容易和更快的方式 —— 我们可以执行一个特殊的 select 语句来检索计数。它将返回一行，其中一列包含计数。

```javascript
store.db.transaction(function(tx) {
    tx.executeSql("select count(*) from checkins;", [], function(tx, results) {
        handler(results.rows.item(0)["count(*)"]);
    }, store.onError);
});
```

不幸的是， IndexedDB 不提供任何计算方法，所以我们只能自己遍历。

```javascript
var count = 0;
var request = db.transaction(["checkins"], 'readonly').objectStore("checkins").openCursor();
request.onsuccess = function(ev) {
    var cursor = request.result;
    cursor ? ++count && cursor["continue"]() : handler(count);
};
```

对于文件系统， directory reader 的 ``readentries()`` 方法提供一个文件列表，所以我们返回该列表的长度就好。

```javascript
checkinsDir.createReader().readEntries(function(files)  {
    handler(files.length);
});
```

## 总结
本文从较高层次的角度，讲述了现代客户端存储技术。你也可以看看 [《离线应用概述》（overview on offline apps）](http://www.html5rocks.com/en/tutorials/offline/whats-offline)这篇文章。
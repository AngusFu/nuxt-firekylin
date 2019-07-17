---
title: 测试驱动开发：使用 Node.js 和 MongoDB 构建 Todo API
date: 2016-07-04
desc: 测试驱动开发：使用 Node.js 和 MongoDB 构建 Todo API
author: Raja Sekar
social: http://rajasekarm.com/
permission: 0
from: https://semaphoreci.com/community/tutorials/a-tdd-approach-to-building-a-todo-api-using-node-js-and-mongodb
tags: 
    - 翻译
    - Node.js
    - 测试
    - 单元测试
---


学习如何使用测试驱动开发的方式，用 Node.js、MongoDB、Mocha 和 Sinon.js 开发 Todo API。

## 简介

测试是软件开发过程中的一个完整部分，它帮助我们提升软件品质。有很多种测试方法，如手动测试，集成测试，功能测试，负载测试，单元测试等等。在本文中，我们将会遵循测试驱动开发的规则编写代码。


### 单元测试是什么？

Martin Fowler 将单元测试定义如下：

* 首先一个概念，单元测试是低层次的，专注于软件系统的一小部分；

* 其次，单元测试通常是由程序员使用常规工具自己编写的 —— 唯一的区别是使用某种单元测试框架；

* 再次，单元测试预计比其他类型的测试显著地更快。

在本教程中，我们将会使用 Node.js 和 MongoDB 构建一个 Todo API。我们首先会给生产代码写单元测试，然后才会真正写生产代码。

## 环境

*   Express.js
*   MongoDB
*   Mocha
*   Chai
*   Sinon.js

## 项目设置

在我们真正开发 API 之前，我们必须设置文件夹和端点（end point）。

在软件项目中，没有最好的应用架构。本教程使用的文件结构，请看该 [GitHub](https://github.com/rajzshkr/todoapi) 仓库。

现在来创建端点（endpoints）：

![table](http://p9.qhimg.com/t019ce24b482a7f3229.png)

## 安装依赖

Node.js 有自己的包管理工具 [NPM](https://www.npmjs.com/)。要学习更多关于 NPM 的知识，可以看我们的另一篇教程，[《Node.js Package Manager tutorial》](https://semaphoreci.com/community/tutorials/npm-node-js-package-manager)。

好，我们来安装项目依赖。

```
npm install express mongoose method-override morgan body-parser cors —save-dev
```

## 定义 Schema

我们会使用 Mongoose 作为 Node.js 中的对象文档模型（Object Document Model），它工作起来和典型的 ORM一样，就像 Rails 中用 ActiveRecord一样。Mongoose 帮我们更方便地访问 MongoDB 命令。首先我们为 Todo API 定义 schema。

```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Defining schema for our Todo API
var TodoSchema = Schema({
  todo: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  },
  created_by: {
    type: Date,
    default: Date.now
  }
});
//Exporting our model
var TodoModel = mongoose.model('Todo', TodoSchema);

module.exports = TodoModel;

```

Mongoose 中的一切都是从 schema 开始。每个 schema 对应一个 MongoDB 集合，它定义了集合中文档的形状。

在上面的 todo schema 中，我们创建了三个字段来存储 todo 描述、状态和创建日期。该 schema 帮助 Node.js 应用理解如何将 MongoDB 中的数据映射成 JavaScript 对象。

## 搭建 Express Server

我们将使用 Express 来搭建服务器，它是一个小型 Node.js web 框架，提供了一个强大的功能集，用于开发Web应用程序。

我们继续，搭建 Express server。

首先，我们要按下面这样引入项目依赖：

```javascript
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();
var config = require('./app/config/config');
```

接着，配置 Express 中间件：

```javascript
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

```

### 管理 Mongoose 连接

使用`mongoose.connect`将 MongoDB 和应用连接，这会和数据库建立连接。这就是连接 todoapi 数据库的最小操作，数据库跑在本地，默认端口是 27017。如果本地连接失败，试试将 localhost 换成 127.0.0.1。

有时候本地主机名改变时会出现一些问题。

```javascript
//Connecting MongoDB using mongoose to our application
mongoose.connect(config.db);

//This callback will be triggered once the connection is successfully established to MongoDB
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + config.db);
});

//Express application will listen to port mentioned in our configuration
app.listen(config.port, function(err){
  if(err) throw err;
  console.log("App listening on port "+config.port);
});

```

使用下面的命令启动服务器：

``` bash
//starting our node server
> node server.js
App listening on port 2000
```

## 为 API 编写测试用例

在 TDD（测试驱动开发）中，将所有可能的输入、输出以及错误纳入考虑，然后开始编写测试用例。来给我们的 Todo API 编写测试用例吧。

### 搭建测试环境

之前提到过，我们会使用 Mocha 作为测试运行器，Chai 作为断言库，用 Sinon.js 模拟 Todo model。首先安装单元测试环境：

```bash
> npm install mocha chai sinon sinon-mongoose --save
```

使用 `sinon-mongoose` 模块来模拟 Mongoose 定义的 MongoDB 模型。

现在，引入测试的依赖：

```javascript
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var mongoose = require('mongoose');
require('sinon-mongoose');

//Importing our todo model for our unit testing.
var Todo = require('../../app/models/todo.model');

```

### Todo API 的测试用例

编写单元测试时，需要同时考虑成功和出错的场景。

对我们的 Todo API 来说，我们要给新建、删除、更新、查询 API 同时编写成功和出错的测试用例。我们使用 Mocha, Chai 和 Sinon.js 来编写测试。

#### 获取所有 Todo

本小节，我们来编写从数据库获取所有 todo 的测试用例。需要同时为成功、出错场景编写，以确保代码在生产中的各种环境下都能正常工作。

我们不会使用真实数据库来跑测试用例，而是用 `sinon.mock` 给 Todo schema 建立假数据模型，然后再测试期望的结果。

来使用 `sinon.mock` 给 Todo model 据，然后使用 `find` 方法获取数据库中存储的所有 todo。

```javascript
    describe("Get all todos", function(){
         // Test will pass if we get all todos
        it("should return all todos", function(done){
            var TodoMock = sinon.mock(Todo);
            var expectedResult = {status: true, todo: []};
            TodoMock.expects('find').yields(null, expectedResult);
            Todo.find(function (err, result) {
                TodoMock.verify();
                TodoMock.restore();
                expect(result.status).to.be.true;
                done();
            });
        });

        // Test will pass if we fail to get a todo
        it("should return error", function(done){
            var TodoMock = sinon.mock(Todo);
            var expectedResult = {status: false, error: "Something went wrong"};
            TodoMock.expects('find').yields(expectedResult, null);
            Todo.find(function (err, result) {
                TodoMock.verify();
                TodoMock.restore();
                expect(err.status).to.not.be.true;
                done();
            });
        });
    });

```

#### 保存 New Todo

保存一个新的 todo，需要用一个示例任务来模拟 Todo model。使用我们创建的Todo model来检验 mongoose 的save 方法保存 todo 到数据库的结果。

```javascript
    // Test will pass if the todo is saved
    describe("Post a new todo", function(){
        it("should create new post", function(done){
            var TodoMock = sinon.mock(new Todo({ todo: 'Save new todo from mock'}));
            var todo = TodoMock.object;
            var expectedResult = { status: true };
            TodoMock.expects('save').yields(null, expectedResult);
            todo.save(function (err, result) {
                TodoMock.verify();
                TodoMock.restore();
                expect(result.status).to.be.true;
                done();
            });
        });
        // Test will pass if the todo is not saved
        it("should return error, if post not saved", function(done){
            var TodoMock = sinon.mock(new Todo({ todo: 'Save new todo from mock'}));
            var todo = TodoMock.object;
            var expectedResult = { status: false };
            TodoMock.expects('save').yields(expectedResult, null);
            todo.save(function (err, result) {
                TodoMock.verify();
                TodoMock.restore();
                expect(err.status).to.not.be.true;
                done();
            });
        });
    });

```

#### 根据 ID 更新 Todo

本节我们来检验 API 的 update 功能。这和上面的例子很类似，除了我们要使用`withArgs`方法，模拟带有参数 ID 的 Todo model。

```javascript
  // Test will pass if the todo is updated based on an ID
  describe("Update a new todo by id", function(){
    it("should updated a todo by id", function(done){
      var TodoMock = sinon.mock(new Todo({ completed: true}));
      var todo = TodoMock.object;
      var expectedResult = { status: true };
      TodoMock.expects('save').withArgs({_id: 12345}).yields(null, expectedResult);
      todo.save(function (err, result) {
        TodoMock.verify();
        TodoMock.restore();
        expect(result.status).to.be.true;
        done();
      });
    });
    // Test will pass if the todo is not updated based on an ID
    it("should return error if update action is failed", function(done){
      var TodoMock = sinon.mock(new Todo({ completed: true}));
      var todo = TodoMock.object;
      var expectedResult = { status: false };
      TodoMock.expects('save').withArgs({_id: 12345}).yields(expectedResult, null);
      todo.save(function (err, result) {
        TodoMock.verify();
        TodoMock.restore();
        expect(err.status).to.not.be.true;
        done();
      });
    });
  });

```

#### 根据 ID 删除 Todo

这是 Todo API 单元测试的最后一小节。本节我们将基于给定的 ID ，使用 mongoose 的 remove 方法，测试 API 的 delete 功能。

```javascript
    // Test will pass if the todo is deleted based on an ID
    describe("Delete a todo by id", function(){
        it("should delete a todo by id", function(done){
            var TodoMock = sinon.mock(Todo);
            var expectedResult = { status: true };
            TodoMock.expects('remove').withArgs({_id: 12345}).yields(null, expectedResult);
            Todo.remove({_id: 12345}, function (err, result) {
                TodoMock.verify();
                TodoMock.restore();
                expect(result.status).to.be.true;
                done();
            });
        });
        // Test will pass if the todo is not deleted based on an ID
        it("should return error if delete action is failed", function(done){
            var TodoMock = sinon.mock(Todo);
            var expectedResult = { status: false };
            TodoMock.expects('remove').withArgs({_id: 12345}).yields(expectedResult, null);
            Todo.remove({_id: 12345}, function (err, result) {
                TodoMock.verify();
                TodoMock.restore();
                expect(err.status).to.not.be.true;
                done();
            });
        });
    });

```

每次我们都要还原（restore） Todomock，确保下次它还能正常工作。

每次运行测试用例的时候，所有的都会失败，因为我们的生产代码还没写好呢。我们会运行自动化测试，直至所有单元测试都通过。

```bash
> npm test

  Unit test for Todo API
    Get all todo
      1) should return all todo
      2) should return error
    Post a new todo
      3) should create new post
      4) should return error, if post not saved
    Update a new todo by id
      5) should updated a todo by id
      6) should return error if update action is failed
    Delete a todo by id
      7) should delete a todo by id
      8) should return error if delete action is failed

  0 passing (17ms)
  8 failing

```

你在命令行终端上运行`npm test`的时候，会得到上面的输出信息，所有的测试用例都失败了。需要根据需求和单元测试用例来编写应用逻辑，使我们的程序更加稳定。

## 编写应用逻辑

下一步就是为 Todo API 编写真正的应用代码。我们会运行自动测试用例，一直重构，直到所有单元测试都通过。

## 配置路由

对客户端和服务端的 web 应用来说，路由配置是最重要的一部分。在我们的应用中，使用 Express Router 的实例来处理所有路由。来给我们的应用创建路由。

```javascript
var express = require('express');
var router = express.Router();

var Todo = require('../models/todo.model');
var TodoController = require('../controllers/todo.controller')(Todo);

// Get all Todo
router.get('/todo', TodoController.GetTodo);

// Create new Todo
router.post('/todo', TodoController.PostTodo);

// Delete a todo based on :id
router.delete('/todo/:id', TodoController.DeleteTodo);

// Update a todo based on :id
router.put('/todo/:id', TodoController.UpdateTodo);

module.exports = router;

```

### Controller（控制器）

现在我们差不多在教程的最后阶段了，开始来写控制器代码。在典型的 web 应用里，controller 控制着保存、检索数据的主要逻辑，还要做验证。来写Todo API 真正的控制器，运行自动化单元测试直至测试用例全部通过。

```javascript
    var Todo = require('../models/todo.model');

    var TodoCtrl = {
        // Get all todos from the Database
        GetTodo: function(req, res){
            Todo.find({}, function(err, todos){
              if(err) {
                res.json({status: false, error: "Something went wrong"});
                return;
              }
              res.json({status: true, todo: todos});
            });
        },
        //Post a todo into Database
        PostTodo: function(req, res){
            var todo = new Todo(req.body);
            todo.save(function(err, todo){
              if(err) {
                res.json({status: false, error: "Something went wrong"});
                return;
              }
              res.json({status: true, message: "Todo Saved!!"});
            });
        },
        //Updating a todo status based on an ID
        UpdateTodo: function(req, res){
            var completed = req.body.completed;
            Todo.findById(req.params.id, function(err, todo){
            todo.completed = completed;
            todo.save(function(err, todo){
              if(err) {
                res.json({status: false, error: "Status not updated"});
              }
              res.json({status: true, message: "Status updated successfully"});
            });
            });
        },
        // Deleting a todo baed on an ID
        DeleteTodo: function(req, res){
          Todo.remove({_id: req.params.id}, function(err, todos){
            if(err) {
              res.json({status: false, error: "Deleting todo is not successfull"});
              return;
            }
            res.json({status: true, message: "Todo deleted successfully!!"});
          });
        }
    }

module.exports = TodoCtrl;

```

## 运行测试用例

现在我们完成了应用的测试用例和控制器逻辑两部分。来跑一下测试，看看最终结果：

```bash
> npm test
  Unit test for Todo API
    Get all todo
      ✓ should return all todo
      ✓ should return error
    Post a new todo
      ✓ should create new post
      ✓ should return error, if post not saved
    Update a new todo by id
      ✓ should updated a todo by id
      ✓ should return error if update action is failed
    Delete a todo by id
      ✓ should delete a todo by id
      ✓ should return error if delete action is failed

  8 passing (34ms) 
```

最终结果显示，我们所有的测试用例都通过了。接下来的步骤应该是 API 重构，这包含着重复本教程提到的相同过程。

## 结论

通过本教程，我们学习了如果使用测试驱动开发的办法，用 Node.js and MongoDB 设计 API。尽管 TDD （测试驱动开发）给开发过程带来了额外复杂度，它能帮我们建立更稳定的、错误更少的应用。就算你不想实践 TDD， 至少也应该编写覆盖应用所有功能点的测试。

如果你有任何问题或想法，请不吝留言。
---
title: GraphQL 的庐山真面目
date: 2017-05-13
desc: GraphQL 的庐山真面目
author: "@Sacha Greif"
social: https://medium.freecodecamp.com/@sachagreif
permission: 0
from: https://medium.freecodecamp.com/so-whats-this-graphql-thing-i-keep-hearing-about-baf4d36c20cf
tags: 
    - 翻译
    - GraphQL
---

## 译者注

试用了众成翻译正在内测的新版翻译工具，借助谷歌翻译 API，速度比以前快多了。但也有一些缺憾，较以往逐句手动翻译字斟句酌不同，往往会迁就自动翻译结果，时间都花在调整工作上了。

以下为正文：

> 本文转载自：[众成翻译](http://www.zcfy.cc)
> 译者：[文蔺](http://www.zcfy.cc/@wemlin)
> 链接：[http://www.zcfy.cc/article/2719](http://www.zcfy.cc/article/2719)
> 原文：[https://medium.freecodecamp.com/so-whats-this-graphql-thing-i-keep-hearing-about-baf4d36c20cf](https://medium.freecodecamp.com/so-whats-this-graphql-thing-i-keep-hearing-about-baf4d36c20cf)

如果你像我一样，在听到一个新技术的时候，可能会经历三个阶段：

### 1.不予理会

> 又来一个 JavaScript 库？jQuery 在手，天下我有！

### 2.兴趣初起

> 嗯，要不还是去看看这个久闻大名的东西吧...

### 3.恐惧症爆发

> 救命啊！我必须**立马**学会它，否则就要死在沙滩上了！

身处这个快节奏时代，保持理智需要一定的诀窍：处于第二、三阶段之间，兴趣刚刚激发，趁着仍在时代前列，开始学习新东西吧。

所以，现在正是学习 GraphQL的好时机。

## 基础知识

简而言之，GraphQL 是一种**描述如何请求数据的语法**，通常用于客户端向服务器请求数据。GraphQL 有三个主要特点：

*   允许客户端精确指定所需数据。
*   可以更容易地从多个数据源聚合数据。
*   使用类型系统描述数据。

那么如何开始学习 GraphQL 呢？它在实践中长什么样子？怎么开始使用它？请继续阅读，寻找答案吧！

![](http://p0.qhimg.com/t012685a3ad904a9c5f.png)

## 提出问题

GraphQL 起源于又大又老的 Facebook 应用。不过，即便是更简单的应用程序，也经常受到传统 REST API 的限制。

举个栗子，假设你需要展示帖子列表，每个帖子下面展示一个带有用户名和头像的点赞列表。很简单，调整 API，加入一个点赞用户数组：

![](http://p0.qhimg.com/t01c62e2c165c8a2f93.png)

然而，我们要做移动 APP 了，结果你会发现，加载额外数据拉低了整体速度。所以这时候需要两个端点（endpoints），一个包含点赞信息，一个不含点赞信息。

看热闹不嫌事大，再添加一个因素：帖子存储在 MySQL 数据库中，点赞数据存储在 Redis 中！现在该怎么办呢？

将这种情况推广到管理大量数据源、 API 客户端的 Facebook 身上，也就不难想象，为什么老式 REST API 开始捉襟见肘了。

## 解决方案

Facebook 提出的解决方案在概念上非常简单：不再使用多个“愚蠢”端点，而是使用可以处理复杂查询、根据客户端需求拼合数据的单个“智能”端点。

实际上，GraphQL 层位于客户端和一个或多个数据源之间，按照你的指示接收客户端请求，然后获取必要的数据。困惑不解？下面打打比方！

旧式 REST 模型就好像先订购比萨饼，然后请商店送货上门，接着再打电话给干衣店上门取衣服。三个店铺，三个电话。

![](http://p0.qhimg.com/t0164fdd55ba842dff5.png)

而 GraphQL 就像一个私人助理。只需要给出三个地方的地址，然后告诉 Ta 你想要什么（“衣服要干洗，一个大比萨饼，两打鸡蛋” ），然后就可以坐等结果了。

![](http://p0.qhimg.com/t01f3812c6c3eece0ba.png)

换言之，GraphQL 建立了一套用来与神通广大的个人助理交流的标准语言。

![](http://p0.qhimg.com/t01f0cf41ee0df4105c.png)

Google 图片的结果显示，典型的个人助理是八臂金刚。

在实践中，GraphQL API 围绕三个主要构建块组织：**模式（schema）、查询（query）、解析器（resolver）**。

## 查询

你对 GraphQL 个人助理的发出的请求就是查询，如下所示：

```
query {
  stuff
}
```

通过`query`关键字声明新查询，然后请求一个名为`stuff`的字段。GraphQL 查询的好处是支持嵌套字段，所以我们可以更进一步：

```
query {
  stuff {
    eggs
    shirt
    pizza
  }
}
```

如你所见，查询的客户端无需关心数据来自哪个“店铺”。按需请求，让 GraphQL 服务器负责其余的事。

值得注意的是，查询字段也可以指向数组。例如，下面是查询帖子列表时的一种常见模式：

```
query {
  posts { _# this is an array_
    title
    body
    author { _# we can go deeper!_
      name
      avatarUrl
      profileUrl
    }
  }
}
```

查询字段也支持参数。如果想显示某个特定帖子，可以在`post`字段中添加一个`id`参数：

```
query {
  post(id: "123foo"){
    title
    body
    author{
      name
      avatarUrl
      profileUrl
    }
  }
}
```

最后，如果想使该`id`参数动态化，可以定义一个**变量**，然后在查询中重用它（请注意，我们也在这里**命名**了查询）：

```
query getMyPost($id: String) {
  post(id: $id){
    title
    body
    author{
      name
      avatarUrl
      profileUrl
    }
  }
}
```

使用 GitHub 的 GraphQL API Explorer 可以很好地实践前面的例子。尝试以下查询：

```
query {
  repository(owner: "graphql", name: "graphql-js"){
    name
    description
  }
}
```

![](http://p0.qhimg.com/t01c93357a8f0c51329.gif)

GraphQL 自动补全功能

请注意，当我们尝试在描述下面输入新的字段名称时，IDE 将通过 GraphQL API 自动补全字段名称。漂亮！

[![](http://p0.qhimg.com/t017e65fab413aa1b0d.png)](https://dev-blog.apollodata.com/the-anatomy-of-a-graphql-query-6dffa9e9e747)[The Anatomy of a GraphQL Query](https://dev-blog.apollodata.com/the-anatomy-of-a-graphql-query-6dffa9e9e747)

你可以在 《[解析 GraphQL Query](https://dev-blog.apollodata.com/the-anatomy-of-a-graphql-query-6dffa9e9e747)》 这篇优秀文章中了解有关GraphQL 查询的更多信息。

## 解析器

如果没有干洗店的地址，即使是世界上最好的个人助理也无法完成干洗的任务。

同样，GraphQL 服务器也不会知道如何处理传入的查询，除非我们使用解析器来告诉它怎么做。

解析器告诉 GraphQL 如何获取、在哪里获取与给定字段相对应的数据。例如，前面的`post`字段的解析器可能看起来像下面这样（使用Apollo 的 [GraphQL-Tools](https://github.com/apollographql/graphql-tools) 模式生成器）：

```
  Query: {
    post(root, args) {
      return Posts.find({ id: args.id });
    }
  }
```

我们将解析器放在 Query 上，因为我们希望直接在 root 级别查询帖子。但也可以使用子字段的解析器，例如帖子的`author`字段：

```
Query: {
  post(root, args) {
    return Posts.find({ id: args.id });
  }
},
Post: {
  author(post) {
    return Users.find({ id: post.authorId})
  }
}
```

还需要注意，解析器不限于返回数据库文档。例如，也许你想添加一个`commentsCount`字段：

```
Post: {
  author(post) {
    return Users.find({ id: post.authorId})
  },
  commentsCount(post) {
    return Comments.find({ postId: post.id}).count() 
  }
}
```

在这里，关键概念是通过使用 GraphQL，API schema、数据库schema 被解耦。换言之，数据库中可能没有任何`author`或`commentsCount`字段，但我们可以通过解析器的力量来“模拟”它们。

如你所见，我们可以在解析器中编写所需的任意代码。这就是为什么你也可以让它们_修改_数据库的原因，在这种情况下，它们被称为**突变**（mutation）解析器。

## Schema（模式）

所有这些好东西都可以通过 GraphQL 的类型化架构系统实现。我今天的目标是给读者一个简短的概述，而不是详尽的介绍，所以我不会在这里涉及任何细节内容。

话虽如此，如果你想了解更多，建议查看 [GraphQL 文档](http://graphql.org/learn/schema/)。

![](http://p0.qhimg.com/t01eb0c899333f2b4d2.png)

## 常见问题

休息一下，回答几个常见问题。

那位朋友，后面的观众！对，就是你。貌似你想问一些事情。来吧，别害羞！

### GraphQL 和图形数据库（graph databases）之间有什么关系？

没太多关系，真的，GraphQL 与 Neo4j 等图形数据库没有任何关系。“Graph” 来源于通过使用字段、子字段爬取 API 图形的想法；而“QL”则代表“查询语言”。

### 我对 REST 很满意，为什么要切换到 GraphQL？

如果你还没有碰到 GraphQL 所着力解决的 REST 痛点，那么我会说这是一件好事！

在 REST 上使用 GraphQL 可能不会影响应用程序的整体用户体验，所以切换到它并非生死攸关的问题。话虽如此，我还得建议你，在有机会的时候，可以在一个小型项目上尝试使用 GraphQL。

### 我可以在没有 React / Relay / insert library 的情况下使用 GraphQL 吗？

是的，你可以！GraphQL 只是一个规范，你可以将其与任何平台上的任何库、客户端（例如，Apollo拥有WebQL的GraphQL客户端，iOS，Angular等）一起使用，也可以自己调用 GraphQL 服务器。

### GraphQL 是由 Facebook 出品的，我不信任 Facebook

再次声明，GraphQL 只是一个规范，这意味着你可以使用 GraphQL 实现，而不运行任何由 Facebook 编写的代码。

而 Facebook 的支持，对 GraphQL 生态系统肯定是加分项，在这一点上，我相信社区足够大，即使 Facebook 停止使用，GraphQL也将蓬勃发展。

### “让客户请求他们需要的数据”这样的业务感觉似乎不是很安全

解析器是我们自己编写的，所以可以解决该级别的任何安全问题。

例如，如果让客户端指定`limit`参数来控制它接收到的文档数量，那么您可能希望对该号码加以限制以避免 DoS 攻击，以免客户端会一遍又一遍地请求数百万个文档。

### 那么起步需要些什么呢？

一般来说，至少需要两个组件来运行 GraphQL 驱动的应用程序：

*   提供 API 的 **GraphQL 服务器**。
*   连接端点的 **GraphQL 客户端**。

请继续阅读，了解更多相关信息。

![](http://p0.qhimg.com/t014136a6390600c091.png)

现在，我们对 GraphQL 的工作有了很好的了解，再来谈谈这个领域的一些主要玩家。

## GraphQL 服务器

我们需要的第一块砖是 GraphQL 服务器。GraphQL 只是一个规范，所以这为一些相互竞争的实现敞开了大门。

### [GraphQL-JS](https://github.com/graphql/graphql-js)（Node）

这是 GraphQL 的原始参考实现。可以与 [express-graphql](https://github.com/graphql/express-graphql) 一起用来[创建 API 服务器](http://graphql.org/graphql-js/running-an-express-graphql-server/)。

### [GraphQL-Server](http://dev.apollodata.com/tools/graphql-server/)（Node）

[Apollo](http://apollostack.com/) 团队还拥有自己的一体化 GraphQL 服务器实现。它不像原始实现那样广为流传，但有着很好的文档、支持，并且迅速获得成功。

### [其他平台](http://graphql.org/code/)

GraphQL.org 上有各种其他平台（PHP，Ruby 等）的 [GraphQL 实现列表](http://graphql.org/code/)。

## GraphQL客户端

在技术上，虽然可以直接查询 GraphQL API，而无需专门的客户端库，但它[绝对可以让你的生活更轻松](http://www.example.com)。

### [Relay](https://facebook.github.io/relay/)

Relay 是 Facebook 的 GraphQL 工具包。我没有用过，但是据悉它主要是针对 Facebook 自己的需求量身定制的，并且可能对于大多数使用场景来说有些过度设计。

### [Apollo Client](http://www.apollodata.com/)

[Apollo](http://apollostack.com/) 是后来居上者。典型的 Apollo 客户端主包括以下两部分：

*   [Apollo-client](http://dev.apollodata.com/core/) 客户端允许我们在浏览器中运行 GraphQL 查询并存储其数据（并且还具有自己的 devtools 扩展）。
*   前端框架（[React-Apollo](http://dev.apollodata.com/react/)，[Angular-Apollo](http://dev.apollodata.com/angular2/)等）连接件。

请注意，在默认情况下，Apollo-client 使用 Redux 存储其数据，这是非常好的，因为 Redux 本身是一个拥有丰富生态系统的非常成熟的状态管理库。

[![](http://p0.qhimg.com/t01b303c0e84b7d56a9.png)](https://github.com/apollographql/apollo-client-devtools)

Apollo Devtools Chrome 扩展

## 开源应用程序

尽管 GraphQL 相当新颖，但已经有一些前景看好的开源应用程序可以利用。

### [VulcanJS](http://vulcanjs.org)

[![](http://p0.qhimg.com/t01779c5a01eccf26e7.png)](http://vulcanjs.org)

首先是免责声明：我是 VulcanJS 的主要维护者。我创建了 VulcanJS，让人们可以利用 React / GraphQL 技术栈的优势，而无需编写太多的样板。你可以将其视为“现代网络生态系统的 Rails”，因为它可以在几个小时内构建 CRUD 应用程序（如 Instagram 克隆）。

### [Gatsby](https://www.gatsbyjs.org/docs/)

Gatsby 是一个 React 静态站点生成器，目前由 [GraphQL 1.0](https://www.gatsbyjs.org/docs/) 驱动。这个乍看奇怪的组合，实际上是相当强大的。在构建过程中，Gatsby 可以从多个 GraphQL API 获取数据，然后使用它们创建一个完全静态的客户端 React 应用程序。

## 其他 GraphQL 工具

### [GraphiQL](https://github.com/graphql/graphiql)

GraphiQL 是用于查询 GraphQL 端点的非常方便的浏览器端 IDE。

[![](http://p0.qhimg.com/t0154a7c6ba8564233e.png)](https://github.com/graphql/graphiql)

GraphiQL

### [DataLoader](https://github.com/facebook/dataloader)

由于 GraphQL 查询的嵌套特性，单个查询可以轻松触发数十个数据库调用。为了避免发生性能问题，我们可以使用由 Facebook 开发的批处理和缓存库，如 DataLoader。

### [Create GraphQL Server](https://blog.hichroma.com/create-graphql-server-instantly-scaffold-a-graphql-server-1ebad1e71840)

Create GraphQL Server 是一个命令行实用程序，可以轻松快速构建由 Node 服务器和 Mongo 数据库驱动的 GraphQL 服务器。

### [GraphQL-up](https://www.graph.cool/graphql-up/)

与 Create GraphQL Server 类似，GraphQL-up 可以让我们快速启动由 [GraphCool](https://www.graph.cool/) 服务驱动的 GraphQL 后端。

## GraphQL 服务

最后，还有一些 “提供 GraphQL 后端服务” 的公司为我们处理整个服务器端的事情，这可能是试水 GraphQL 生态系统的好方法。

### [Graphcool](http://graph.cool)

结合 GraphQL 和 AWS Lambda 的灵活的后端平台，提供免费开发者计划。

### [Scaphold](https://scaphold.io/)

另一个 GraphQL 后端服务，也有免费计划。它提供了与 Graphcool 大量相同的功能。

![](http://p0.qhimg.com/t017006906307aa2279.png)

已经有很多地方可以学习 GraphQL 了。

### [GraphQL.org](http://graphql.org/learn/)

GraphQL 官方网站有一些很好的起步文档。

### [LearnGraphQL](https://learngraphql.com/)

LearnGraphQL 是由 [Kadira](https://kadira.io/) 的同学创建的互动课程。

### [LearnApollo](https://www.learnapollo.com/)

LearnApollo 是由Graphcool 制作的免费课程，LearnGraphQL 的接力者。

### [The Apollo Blog](https://dev-blog.apollodata.com/)

Apollo 博客中有大量关于 Apollo 和 GraphQL 的详细的、写得很好的帖子。

### [GraphQL Weekly](https://graphqlweekly.com/)

关于 Graphcool 团队策划的 GraphQL 简报。

### [Hashbang Weekly](http://hashbangweekly.okgrow.com/)

另一个很好的简报，除了 GraphQL 之外，它还提供 React 和 Meteor 的消息。

### [Freecom](https://www.graph.cool/freecom/)

一个教程系列，教你如何使用 GraphQL 构建对讲机。

### [Awesome GraphQL](https://github.com/chentsulin/awesome-graphql)

GraphQL 链接、资源的详尽列表。

![](http://p0.qhimg.com/t011ca6af993813702b.png)

那么如何将新获得的 GraphQL 知识付诸实践呢？可以试试下面这些：

### [Apollo + Graphcool + Next.js](https://github.com/zeit/next.js/tree/master/examples/with-apollo)

如果你已经熟悉 Next.js 和 React，这个[示例](https://github.com/zeit/next.js/tree/master/examples/with-apollo)将允许你使用Graphcool 设置 GraphQL 端点，然后使用 Apollo 进行查询。

### [VulcanJS](http://docs.vulcanjs.org/)

[Vulcan 教程](http://docs.vulcanjs.org/)将带你在服务器和客户端上设置一个简单的 GraphQL 数据层。由于 Vulcan 是一个一体化平台，因此无需任何设置即可开始使用。如果需要帮助，请不要犹豫，来访问我们的 [Slack 频道](http://slack.vulcanjs.org/)！

### [GraphQL & React Tutorial](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858#.o54ygcruh)

Chroma 博客有一个构建遵循组件驱动的开发方法的 React / GraphQL 应用程序的[六部分教程](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858#.o54ygcruh)。

![](http://p0.qhimg.com/t01eb0c899333f2b4d2.png)

## 小结

乍看 GraphQL 可能很复杂，因为它是一种跨领域技术。但是，如果你花时间了解基础概念，我想你会发现很多东西只是有意义的。

所以无论你是否真的使用它，我相信值得花时间熟悉 GraphQL。越来越多的公司和框架正在采用它，并且在未来几年内可能最终成为网络的关键组成部分之一。

同意？不同意？有问题吗？在评论中告诉我。如果你喜欢这篇文章，请考虑分享它！

感谢 [Tom Coleman](https://medium.com/@tmeasday?source=post_page) 和 [Jonas Helfer](https://medium.com/@helfer?source=post_page)。

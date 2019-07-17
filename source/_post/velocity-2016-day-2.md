---
title: "笔记：velocity 2016 第二天"
tags:
  - 原创
  - 笔记
date: 2016-12-02 19:53:51
desc: "笔记：velocity 2016 第二天"
---

有幸得到 Velocity 2016 大会门票，屁颠屁颠跑去听分享。

下面是第二天的笔记。记得比较简略，凑合看吧。

[PPT 下载通道](http://velocity.oreilly.com.cn/2016/index.php?func=slidesvideos)已经放出来了，感兴趣的可以自己跟踪一下。

# 阿里应用运维体系演变

> 分享者：阿里，毕玄

## 工作范围

- 日常运维操作
  - 变更
  - 环境维护（OS 升级）
- 容量管理
  - 如何分布机器
- 稳定性
  - 监控、报警
  - 故障处理

## 脚本化

- 单机脚本
- 批量操作脚本
- 主要问题
  - 复杂变更逻辑不好实现
- 发布到哪里了？运维自己都不知道

## 工具化

- 编写软件系统
  - 工具、运维团队
  - 合并各工具团队
  - 工具团队同时兼 OPS 工作
- 感受
  - 实现了大量工具系统，然而并没有更幸福
  - 成就感不足，很难得到认可
- 可能原因：工具质量不够高
- 主要问题：
  - 推进落地难度
    - 思想转变，时间保障
  - 软件质量
    - 成功率
    - 稳定性
    - 性能
  - 标准化

## DevOps

- 借助 DevOps 推进工具化有效实现
  - 《SRE：Google 运维解密》
- 运维团队交还给研发团队，日常运维逐步交给研发自行完成
  - 挑战：工具化程度
- 借助 Docker，将 DevOps 思想落地
  - Dockerfile

## 自动化

- 参与多个环节 => 无人值守（需要架构级的支撑，eg 机房流量一键切换）
- 主要问题
  - 成功率：需要非常高，失败就需要人介入
  - 架构支撑能力

## 智能化

- 根据系统行为反馈，自动进行处理
  - 大量的数据收集
  - 大量经验收集
  - eg. 单机房故障自动切换
- 主要问题
  - 数据准确性
  - 经验格式化收集
  - 机器学习介入，特征提取

## Summary

- DevOps 是大方向，需要机制保障
- 自动化里程碑...
- ….



# 衡量服务的可运维性 

> 分享者：来自 LinkedIn 的 李虓(xiao1)

## 服务可靠性 vs 可运维性

- 可靠性
  - 高可用性
  - 平均故障修复时间
- 可运维性
  - 定义：保持服务运行在指定 SLA 所需要的运维人力时间成本
  - 平均无故障工作时间（Mean Time Between Failures）
  - 影响因素
    - 变更
    - 系统级软件
    - 硬件、基础软件
    - 依赖关系
    - 扩容
- 可靠性 vs 可运维性
  - 每年半天 or 每小时 5s
  - 相关但不是因果关系
  - “维护税”
  - 运维团队可持续发展
  - 运维功能不可避免



## Service Score Card(服务记分卡)

- 发布相关
  - 发布频率
  - 发布速度 —— 代码提交到进入生产环境的时间
  - 发布成功率 —— 成功/回滚
  - 回滚速度
- 生产环境相关
  - 是否 rack diversified
  - 是否支持 ipv6
  - 可否热重启
- 架构相关
  - 是否部署在多个数据中心
  - 是否在多数据中心同时运行
  - 是否支持热重启
  - ...
- 对每项指标加权打分
- 打分汇总，A-F
- 根据开发、运维团队负责汇总

## 方法

- 文化
  - 得到开发团队支持
  - 健康竞争机制，排行榜
  - 鼓励运维团队提供解决方案
- 技术
  - 数据收集
    - 发布系统
    - 监控系统
    - ...
  - 文档和自动化工具

## Summary

- 关注可运维指标
- 关键指标的选择
- 数据驱动提高
- 提高可维护性，降低运维成本，有助于提供系统可用性。



# Data Integrity in Stateful Services

> 分享者： Laine Campbell

- Physical Integrity

- Logical Integrity

- Goals

  - Elimination
    - Eliminate Potential for Corruption and Data LOSS
  - Empowerment
    - Recover rapidly from mistakes
    - don't trust destructive requests
  - Detection
    - early detection of corruption
    - unit and regresion testing
    - data validation pipelines
    - tools for investigation
  - Flexibility
    - Tiered Storage
    - Replication and Data Portability

- What could go wrong

  - Planned Recovery
    - production deployments
    - environment duplication
    - Downstream services
      - analytics
      - compliance
    - ...
  - Unplanned Recovery
    - Category
    - ...
  - Operation ERRORS
    - Data DELETION
    - Data Corruption
    - Relaxed Constraint
    - Storage removal
  - Application ERRORS
    - removing...
    - character set multilation
    - ...

  …….此处省略很多很多



# Polymer at Youtube

> 分享者：来自 Youtube 的 Mikhail Sychev, TL  of next generation Youtube.com

## Intro

- 1 billion users

## Techs before

- Spitfire templates
- Google Closure for JS
- SPF for page transitions
- Custom layout framework

## Forward

- Performance
- Focus on Future
- Productivity
- Shared plateform
- Shared visual design

## New Stack

- Polymer for templating
- … core styling
- Closure for JS compilation
- A bit of Spitfire for bootstrap

## Web  Components

- demo: `<search-icon>`etc..
- Custom Elements、templates、Shadow DOM ...

## Beyond  Spec

- `polymer-project.org`
- A *opinionated* **library**
- Sugars for Web Components
- Encapsulated Reusable elems
- 500+ Google projects

## Provided by Framework

- Template data bindings
- Attribute handling
- Polyfills
- Flexbox based styling primitives
- Components library

## Component organization

- HTML： `dom-module > template`

  - 内部的 template： `dom-if` `dom-repeat`
  - id => local to components

- JS

  ```js
  {
  	is: ID
    properties: {
      [key]: {type, sobserver, } | 'any direct value'
    },
    someMethod
  }
  ```

- CSS

  - shadow DOM, shady(?) DOM
  - scoped styles
  - polymer will do the polyfill
  - Flexbox

- Unit tests + data

  - low level

- Fn test + data

  - changes: predictable 

## Engineering Productivity

- faster interaction cycle
  - better code organization
  - per comp testing
  - instant reload dev env
  - pre-made comps
    - about Material Design

##  Perforamance

- Rule of one second


- Rendering control
  - comp reuse & in place update
    - no new DOM created, no DOM removed
    - update orders and values
  - FPS locking
    - every time new item injected, look up the time
  - Application Serving
    - chunking
- Challenges
  - Browser support & detection
  - Bots, Extensions, search engines
  - Modularization
  - Bleeding edge
- Mobile Challenges
  - Browser support
  - Performance



#  React 可视化开发框架

> 分享者：Accenture 的 Jeff Catania
>
> 声音有点小，对这方面兴趣有限，所以笔记做得不多。

## RCDF(Aardvark)

- Tools

  - Manual Tools
  - Aided
  - Programmatic

- D3 + React => Aardvark standards

  ​

# QQ 空间 Web 架构

> 分享者：QQ 刁维康
>
> 相对来说还是很传统的 hybrid 模式。说句实话，我总觉得这次分享的内容，我似乎在哪里看到过。应该是印象中的 QQ 的同学写的那些文章吧，有关于 QQ 空间 Hybrid 优化的，有手Q React 实践的，但我一时半会儿也找不到原文了。
>
> 总之就是充分利用缓存，充分利用 WebView 初始化的那段时间，然后就 socket 和 HTTP/CDN 之间如何选择的问题。嗯，还是非常棒的。
>
> 所以我一直在听，顺便做点其他的工作，木有做笔记。

（略...）


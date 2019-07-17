---
title: "笔记：velocity 2016 第一天"
tags:
  - 原创
  - 笔记
date: 2016-12-01 22:11:38
desc: velocity 2016 笔记
---

有幸得到老大给的 Velocity 大会门票，屁颠屁颠跑去听分享。下面是今天（第一天）的笔记。记得比较简略，凑合看吧。[PPT 下载通道](http://velocity.oreilly.com.cn/2016/index.php?func=slidesvideos)已经放出来了，感兴趣的可以自己跟踪一下。

## UseThePlatform —— Web 组件介绍

> 分析者：来自 Youtube 的 Mikhail Sychev
>
> 感觉就是对 Polymer 和 Web Components 的科普。期待明天更详细的分享。
>
> 其实关于 Polymer，打开 Chrome 的 `chrome://downloads/` 查看源码，就能学到不少东西：CSS 变量、Shadow DOM、Polymer 等等。之前打算就这个写篇博客，一直没动手。

(略….)

-------

## 搜索引擎性能优化的未来 —— 搜索极速浏览框架

> 分享者：来自百度的陶清乾
>
> 听到最后才发现，原来是搞了套自己的后端工具，你“打开”的页面，可能只是百度缓存、处理过的。（免责声明：理解可能有偏差）还提了下使用的 工具 MIP。

### 全流程优化

- 展现交互
- 加载策略
- 页面渲染

### 框架解决问题

- 创建容器视图，提升交互体验
- 异步加载渲染，提升页面渲染速度
- prefetch 实例，优化网络、服务开销
- 优化机制，优化细粒度模块速度

### 感知交互时间

点击搜索结果 => 页面响应

### 加速原理

#### 传统页面

点击。连接。响应。基础渲染。内容渲染。组件加载。

#### 加速

点击 

​	A => 交互响应。基础渲染。。。。

​        B => 连接。响应。 。。。

。。。。内容渲染、组件加载



## 应用性能数据可视化

> 分享者：来自 mmTrix 的朱建锋
>
> 先是对可视化、性能等做了一些介绍，之后讲数据处理，科普了几种平均数，之后科普了各种常用的图（如雷达图、南丁格尔玫瑰图 etc.）。

### 前面

- 尽量使用抗干扰性更好的方法计算性能数据
- 标准差衡量性能标准

### 可视化是一个编码过程

- 基本的简单的图。
- 目的：表达数据。

### 请求理想时间小于 1s

- DNS: 50ms
- TCP shakes: 100ms
- SSL(https): 300ms
- Waiting for Response: 250ms（网络请求 => First Byte）
- 接收 Data: 300ms

-------

## Hulu 的 React / Redux 构架实践 

> 分享者：来自“美国的爱奇艺” Hulu 的程墨
>
> 较基础，但对于 Constraints vs Conventions 相关的内容非常不错，很值得思考。

### Challenges

- System Complexity
  - Legacy code in jQuery & Backbone
  - UI non-predictable
  - Lack of component isolation
- Performance Bottleneck
  - Initial AJAX roundtrip

### Tech Stack

- **Before**: jQuery + Backbone + Ruby on Rails


- **After**: React + Redux + Node & Express

### Other Notes

- `React APP = Keep Rndering`
- `UI = f(state)`
- Constraints vs Conventions

--------

## 数亿级用户规模下的 React Native 应用实践

> 分享者：来自百度的雷志兴
>
> 做过一段时间的 RN，所以基本能听懂。
>
> 其他的内容，个人感觉可算干货满满。没提到热更新。
>
> 结合此前 58 同城 RN、携程 RN 等文章一起看，会更好的哈哈

### 手机百度

- 迭代周期： 4周
- 主要 features：数十个
- 开发工时：数千人时
- 跨部门，沟通成本高
- 业务种类多，集成成本高
- 过去的解耦方案
  - APK 插件 / SDK
  - Hybrid
- 迭代速度：native 的 5-8 倍

### RN 工程实践

- 与现有业务融合
  - Android 4.1 以上
  - v0.32 以上不支持 iOS 7
  - **降级兼容**：随时回撤；AB Test
  - **性能方面**: 空间换时间，便利性换性能；减少重绘，减少通讯
  - 统一交互协议：RN 和 Native 相互之间的调用
- 融入迭代流程
  - 首先，前提是业务方明确提出 RN 产品需求，明确哪些能够做到
  - 容灾方案：报错率较高怎么办？
  - 开发
  - 发布：打包、测试后由 PM 从平台发布
  - **监控**：一定要能够监控到 RN 层，尤其是 js 层的报错信息（Note：坑！！！！！！！！）
- 性能优化
  - 通讯频繁 by design： js 足够的灵活性
  - 易导致卡顿
    - 事件频率高
    - js 运行时间长
    - UI 绘制频繁
  - 初始化成本高
    - 生成模块配置表
  - ListView 优化
    - View 无法复用，内存紧张
    - DOM diff： 大量重新渲染
    - 业务层优化：预留空白单元；大量内容时重新渲染
    - **解决 1**：删除非可视区 View
    - **解决 2**：模板复用（item 可能跳动、闪烁）
    - 建议：产品进行限制，超过一定数量时重新刷新
  - 动画
    - 16ms，容易丢帧
    - 实验特性 userNativeDriver: true —— 将动画数据算好全部发给 Native，减少通讯
  - 启动速度优化
    - 预初始化：APP 启动后，立即 instance Init，用户点击的时候，就可以直接开始 js 业务
    - 首页业务多，instance 初始化过多，开销太大。
    - 单 Instance 多业务：Component 方法加载业务，无法使用 global
    - 按需加载：公用部分在初始化时加载，业务部分在交互时才开始加载
  - 延迟加载、渲染
- 跨端方案对比
  - RN 适用场景
    - 超级 APP
    - 体验平台级 APP
  - Hybrid：...
  - APK 插件：...
- Summary
  - 发版周期、开发成本和使用体验之间找到平衡
  - 系统性工程：有机融入 APP
  - ...

### Q&A

- h5 和 RN 迭代的问题：两端齐头并进，各自开发
- Native Module 问题上报：....
- 非结构化 ListView 优化：RN 做的话，很难解决，结构样式尽量简单一些
- RN 版本升级应对：RN 的 持续交付。。。

----------

## 双十一 Weex 会场极致性能优化

> 分享者：阿里的冯成晓、周婷婷
>
> 终于面对面接触到 Weex 分享了。很久之前逢阿里面试官必问 Weex，想必他们烦极了。
>
> 和百度同学关于 RN 的分享两场一起听下来，真的收获多多。
>
> 印象非常好的一点是，分享过程中，反复提到 W3C 标准，提到希望补齐和 W3C 性能优化相关的 feature。这种思路应该是非常棒的。

- `f(HTML/CSS/JS) = Native UI`
- DSL(HTML/CSS/JS) -> Virtual DOM -> Renderer -> UI
- Transformer: DSL -> JS Bundle
- JSFramework: DOM Tree
  - 模板编译，数据绑定
- Render：参照 Webkit
  - Build Tree
  - Compute Style
  - CSS Layout  (… Reflow, Relayout)
  - Create View
  - Update Frame
  - Set View Props (… RePaint)
  - Native View

### 优化

- 下载 js： 预加载
- 执行 js：单 context 共享
- 解析 DOM： Node & Tree 解析结合
- 渲染 UI： List & 异步渲染（内存复用，只会渲染可见部分）
- 全局污染治理 + JSCore 内存管理

### 性能优化指标

- 秒开率：加载时间+首屏时间 < 1s
  - 加载时间：js bundle 加载时间
  - ...
- Weex 会场页面数：1700+，占比 99.6%
- 主会场 FPS：低端机 53， 高端机58
- 动画、视频、直播、全景图都是 Weex

### 实战部分

- 列表过长，WebView 内存不好控制，容易 crash 
- 加载 js bundle：本地 IO 最快
  - APP 启动，预先下载 js
  - 长连接通道 Push
  - 全量/增量，被动/强制更新结合
- 预加载使用策略
  - 根据业务特性斟酌
  - 1700 个页面，由相同模板自由组合变成的
  - 模块化，小粒度缓存
  - 原来：1600 * 55 = 93 M
  - 模块 + 配置：1700 * 5 + 30 * 10 = 8.8 M
  - 但是模块 +配置这样的秒开率低了 10%
  - 业务个性化预加载，根据进入场景下载：类似 <link preload>
  - preload & prerender：
    - dns-prefetch
    - preconnect（DNS + TCP connect）
    - prefetch
    - subresources（depreciated）
    - preload
    - prerender
- js 执行
  - 安卓下 V8 解析 js 耗时
  - 减少 bundle size：去重，分离，通用组件内置
  - 减少 VDOM 更新
    - shouldComponentUpdate
    - pureRenderMixin
- 动态数据并行预加载
  - 点击时直接请求，然后存储在 storage 中（文蔺注：这块儿好像可以参考手机 QQ 家校 or 兴趣部落 React 的优化的文章）
  - storage LRU 策略
  - 首屏数据请求参数不固定？。。。
  - jsbundle 走本地，效果如何？。。。
  - 优化效果 80% 以上
- 首屏 UI 渲染
  - 使用 list 代替 scroller
  - 尽量减少布局嵌套
  - 首屏以外的模板延迟初始化
  - 新方案：requestIdleCallback
- 最佳实践
  - 尽量 prefetch
  - use list
  - cell 细粒度拆分
  - 减少首次加载内容
  - 减少 js 大小
- 工具
  - Xcode simulator
  - Safari 10 Remote Inspector
- 性能指标优化流程（图）
  - 发布基线
  - 预发检测
  - 线上监控
  - 生成报表 <=== 业务达标基线
  - 问题分析
  - 开发修复
  - 预发检测
  - 。。。。
- Week 下一阶段
  - W3C 性能优化 feature 补齐
  - 性能 profile
  - 完整开发模式
  - 更丰富的交互体验
  - 更丰富的 module 和 component




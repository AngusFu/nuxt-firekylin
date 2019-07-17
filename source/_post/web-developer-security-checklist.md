---
title: Web 安全清单
date: 2017-05-22
desc: Web 安全清单
author: "Michael O'Brien"
social: https://www.sensedeep.com/
permission: 0
from: https://simplesecurity.sensedeep.com/web-developer-security-checklist-f2e4f43c9c56
tags: 
    - 翻译
    - 安全
---

在云上开发安全、健壮的 Web 应用**特别特别难**。如果你并不赞同这种说法，那也许你有着比人类还高级的生命形式，也可能是痛苦的觉醒正在前方等你。

若你已潜心皈依 [MVP](https://en.wikipedia.org/wiki/Minimum_viable_product)，并坚信在一个月的时间足以完成一个能够创造价值且达到安全要求的产品 —— 听我一句劝，三思而行，不要急着做“产品原型”。也许在阅读完本文列出的清单之后，你会承认确实忽略了很多关键的安全问题。至少不要欺骗那些潜在用户，让他们知道眼下的产品并不完整，而只是一个并非绝对安全的原型。

这个清单很简单，远远谈不上完备。我开发安全 Web 应用的经验已逾 14 年，在这段时间中也曾遭遇痛苦。痛定思痛，也学到不少东西，这份清单就包括了其中一些问题。创建 Web 应用程序时，望你认真思考。

如果你也有一些可以添加到本清单中的内容，请在评论区留言告知。

### 数据库

*   对用于识别用户身份的数据、其他敏感数据（如访问令牌、邮箱地址或订单详情等）进行加密处理。

*   若数据库支持低成本空闲加密（如 [AWS Aurora](https://aws.amazon.com/about-aws/whats-new/2015/12/amazon-aurora-now-supports-encryption-at-rest/)），请启动加密，保护磁盘数据。确保所有备份都已加密。

*   对数据库访问用户帐户使用最小权限。不要使用数据库 root 帐户。

*   用专门的密码存储方式保存密钥。不要使用硬编码。

*   只使用 SQL 预处理语句，严防 SQL 注入。举例来讲，请使用 npm-mysql2 替代 npm-mysql。

### 开发

*   请确保生产环境中的所有版本的软件的所有部件都经过漏洞扫描。包括 O/S，库，包。这应该在 [CI-CD](https://en.wikipedia.org/wiki/CI/CD) 过程中自动化。

*   开发环境的安全，与生产环境同等重要。在安全的隔离的开发环境中构建软件。

### 认证

*   务必使用合适的加密工具（如 [bcrypt](https://en.wikipedia.org/wiki/Bcrypt)）对所有密码进行 hash 处理。千万不要自己编写加密算法，使用合适的随机数据对加密方法进行初始化。

*   使用简单而恰当的密码规则，鼓励用户使用较长的随机密码。

*   对所有服务提供商的登录，使用多因素身份验证。

### DOS 保护

*   确保针对 API 的 DOS 攻击不会使网站瘫痪。至少限制对那些较慢 API （如登录、令牌生成等）的请求频率。

*   对于由用户提交的数据、请求等，强制进行大小、结构等方面的合理限制。

*   对于 [DDOS](https://en.wikipedia.org/wiki/Denial-of-service_attack)， 使用全局缓存代理服务（如 [CloudFlare](https://www.cloudflare.com/)）减灾。遭遇 DDOS 攻击后即启用，而在平时则可用于 DNS 查询。

### 网络流量

*   全站使用 TLS。不要局限于登录表单。

*   对 cookie 设置 httpOnly 和 secure，并使用 path 和 domain 进行限定。

*   使用 [CSP](https://en.wikipedia.org/wiki/Content_Security_Policy)，避免 unsafe-* 之类的后门。配置过程虽痛苦，但相当划算。

*   在客户端响应中使用 [X-Frame-Option](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/X-Frame-Options)、[X-XSS-Protection](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-XSS-Protection) 响应头。

*   使用 [HSTS](https://imququ.com/post/sth-about-switch-to-https.html#toc-2-1) 响应，强制只允许 TLS 访问。将所有 HTTP 请求重定向到 HTTPS。

*   所有表单使用 CSRF token；并使用 [SameSite Cookie](https://scotthelme.co.uk/csrf-is-dead/) 为新浏览器一次性解决 CSRF 问题。

### API

*   确保公开 API 中没有可枚举资源。

*   确保用户在使用 API 前已通过认证、授权。

### 校验

*   验证客户端输入，为用户提供快速反馈，但不要信任用户输入的内容。

*   使用服务器上的白名单验证用户输入的最后一位。绝对不要直接将用户内容注入到响应中。切勿在 SQL 语句中直接使用用户输入的数据。

### 云配置

*   确保打开所有服务的最小端口（minimum ports）。尽管采用模糊策略实现安全等于没有保护，但非标准端口将增加攻击难度。

*   后端数据库和服务交由私有 VPC 托管，任何公共网络都不可见。配置 AWS 安全组、对等连接 VPC 时，要格外小心，服务可能在无意中被 VPC 公开。

*   从单独的 VPC 和对等连接 VPC 中独立出逻辑服务，以提供业务间通信。

*   确保所有服务只接收来自一组最小 IP 地址集合的数据。

*   限制出站 IP 和端口流量，尽可能减小 APT 和 botification。

*   始终使用 AWS IAM role，不要使用 root 凭证。

*   对运维、开发只开放最小访问权限。

*   定期修改密码和访问密钥。

### 基础架构

*   确保能够进行热升级。确保可以完全自动化快速更新软件。

*   使用 Terraform 之类的工具创建所有基础设施，而不是通过云端控制台。基础设施应该被定义为“代码”，并能通过按钮来重建。对于任何在云中手动创建的资源保持零容忍 —— Terraform 可以对配置进行核查。

*   对所有服务使用集中式日志记录。无需通过 SSH 访问或检索日志。

*   除一次性诊断外，不要通过 SSH 进入服务。使用 SSH，通常意味着没有将重要任务自动化处理。

*   不要永远在任何 AWS 服务组上开放 22 端口。

*   创建[immutable hosts](http://chadfowler.com/2013/06/23/immutable-deployments.html)，而不是那些需要不断修补、升级的长寿命服务器。(见[Immutable Infrastructure Can Be More Secure](https://simplesecurity.sensedeep.com/immutable-infrastructure-can-be-dramatically-more-secure-238f297eca49)).

*   使用[入侵检测系统](https://en.wikipedia.org/wiki/Intrusion_detection_system)来最大限度地减少 [APT](https://en.wikipedia.org/wiki/Advanced_persistent_threat)。

### 操作

*   关闭未使用的服务和服务器。最安全的服务器就是断电的那台。

### 测试

*   对设计、实现进行核查。

*   进行渗透测试 —— 自己尝试黑掉自己的程序，同时也有他人在进行测试。

### 最后，制定计划

*   构建威胁防御模型。列出可能的威胁与对手，并按照优先次序排列。

*   进行安全事故演练。也许有一天能派上用场。

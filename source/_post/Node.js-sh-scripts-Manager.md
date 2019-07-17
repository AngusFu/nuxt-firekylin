---
title: Node.js .sh scripts Manager
date: 2016-07-12
desc: 【nshm】 Node.js .sh scripts Manager
tags: 
    - 原创
    - Node.js
    - 命令行工具
---
 
## 命令行也有苦恼

不知身为前端er的你是不是还在使用 Windows 开发？反正我是。使用 Git？使用 npm scripts？好吧，命令行是少不了的吧？想必很多同学和我一样，使用 Git Bash 作为命令行终端吧。

可是每次都要敲，累不累？想想一次简单的 Git 提交需要几个步骤？

```bash
$ git add -A
$ git commit -m 'commit'
$ git push
```
图简便的你可能会在 package.json 中这样配置：

```javascript
{
    // ...
    "scripts": {
       // ...
       "push": "git add -A && git commit -m 'commit' && git push"
    }
}
// ...
```
然后再敲 `npm run push`。啊啊心好累。


用过 `browser-sync cli` 吗？反正为了图简便，我是经常用的。敲过最变态的是下面这一行：

```bash
browser-sync start --server --files "dist/*"\
    --index "dist/index.html"\
    --open "external"\
    --reload-debounce --no-notify
```

## .bat/.sh 的故事

敲过一次之后，发誓再也不这么玩了。索性在桌面保存了一个 `bs.bat` 文件，把上面的内容放进去。每次都从桌面 copy 到工作目录中去，双击完事。

后来玩 github 稍微勤了一些，commit、pull 的时候，命令行敲起来固然爽得不行，可是累啊。在上一家公司做 react-native 应用的时候，对 `react-native run start` `cd android && ./gradlew assembleRelease` 也是深恶痛绝。最后无不以 bat、sh文件收尾。

## nshm 的由来

前些时间接触到一个管理 `npm registry` 的 package，叫 `nrm`，用起来真是爽。`nrm use taobao` `nrm add xx url`简单就能解决问题。这让我萌生一个想法：能不能不要每次都从桌面 copy 那些简单的脚本啊，来个简单的命令行自己把文件写目录不就 OK 了吗？

酝酿了一段时间。迟迟不肯动手。今天中午下楼抽烟，灵机一动，思路来了，花了半下午时间，边写边重构，最终做出来一个略嫌简陋但还能凑合用的工具，名之曰 “nshm”，取 “Node.js .sh scripts Manager” 的缩写，放在 Github 上了，[https://github.com/AngusFu/nshm](https://github.com/AngusFu/nshm)。

使用起来很简单，看文档就行。

## 安装

```bash

$ npm install nshm -g

$ nshm <command> [args...]

```

## 添加一条自定义命令

```bash
$ nshm add <command_name> -[t|f] [text|path]

# add file content
$ nshm add commit --file ./my-commit.sh
# or
$ nshm add commit -f ./my-commit.sh

# add text content
$ nshm add pull --text "git pull"
# or
$ nshm add pull -t "git pull"
```

## 多个命令合并成一条命令

```bash
$ nshm co <command_name> [command|text] [command|text] [command|text] [...]

$ nshm co git commit pull "git status"
```

## 删除缓存的命令

```bash
$ nshm rm <command_name> <command_name> <...> 

$ nshm rm commit pull git
```

## 清除所有缓存的命令

```bash
$ nshm clean
```

## 列出现有的命令

```bash
# view all names
$ nshm ls

# view all details
$ nshm ls -a
```

## Example 01

```bash
$ nshm add add -t "git add -A"
$ nshm add commit -t "git commit -m 'push'"
$ nshm add pull -t "git push"

$ nshm co git add commit pull

# init my directory
# then we'll get `add.sh` `commit.sh` `pull.sh`
$ nshm git 
```

## Example 02

```bash
# browserSync cli 
# here we use `${}` as placeholders
# for necessary params
$ nshm add bs -t "browser-sync start --server --files \"${files}\" --index \"${index}\" --open \"external\" --reload-debounce --no-notify"

# now we get the `bs.sh` file under our working directory
$ nshm bs --file '**' --index 'index.html'
```

## 结尾

工具默认自带了 Git 相关的 `commit` `pull` 及集成两者的 `git` 命令，还有上面提到的 `browser-sync` 的命令（简称作`bs`）。也可以使用 `nshm add` 的形式自己添加。

微不足道的工具，自娱自乐一下，虽然显得 low 了点，也能解决自己的一点问题。

That's all。

PS: 今晚开始看 WebRTC 的内容，小有收获，学习的生活捡起来！





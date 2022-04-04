---
title: Linux注册便捷命令
date: 2021-10-14 12:57:30
tags: Linux
top: 0
---

# Linux注册便捷命令

Linux 可以创建自定义命令，一般使用`alias`命令或编辑`bashrc`文件实现。达到固定沉长命令简化执行的效果。

## alias命令

🪄临时生效，仅在当前终端、当前登录用户下生效，切换用户或切换终端失效

语法

```bash
alias [别名]=[指令名称]
```

<!--more-->

使用

```bash
# 直接在终端使用命令
alias ls='top'

# 取消自定命令
unalias ls
```

## bashrc文件

🪄永久生效，作用于当前登录用户或全部用户

```bash
# 1. 打开bashrc文件
    # 当前用户
    vim ~/.bashrc
    # 全部用户
    vim /etc/bashrc

# 2. 追加自定义命令
	alias ls='top'
	
# 3. 使文件生效
	source ~/.bashrc
```




---
title: Sublime扩展推荐
date: 2021-10-23 20:10:59 
tags: Tool
top: 0
---

# Sublime常用插件安装及优化配置

为提升开发效率，推荐安装插件

官网推荐：

[Sublime Text 中文网 - 为国内开发者提供最好的服务](http://www.sublimetext.cn/)

[Package Control 中文镜像 - the Sublime Text package manager](http://packagecontrol.cn/)

<!--more-->

## 配置

### tab自动转化为4个空格

```json
//settings
{
    // 注意只有一个大括号，如果之前有属性，如在之前的属性前确保有 ，(逗号)
    "tab_size": 4,
    "translate_tabs_to_spaces": true,
    //若要在保存时自动把tab 转换成空格，请把下面一行设置成 true，如不需要: 设置成 false
    "expand_tabs_on_save": true
}
```

### 设置默认编码为utf-8无bom格式

```json
//settings
{
    "default_encoding": "UTF-8"
}
```

### 显示空格或tab

```json
//settings
{
    "draw_white_space": "all"
}
```

### 自动保存

```json
//settings
{
    "save_on_focus_lost": true,
    //双击打开文件，避免刷掉以保存文件
    "preview_on_click": false,
}
```

### PEP8编码规范配置

首选项 -> 设置-特定语法

```json
{
    "tab_size": 4, 
    "translate_tabs_to_spaces": true,
    "trim_trailing_white_space_on_save": true, 
    "ensure_newline_at_eof_on_save": true,
    "rulers": [ 
        80
    ],
    "word_wrap": true,
    "wrap_width": 80
}
```

## 插件

**1、插件管理工具安装**

- 通过控制台安装插件代码，通过 ctrl*+*` 或 View *>* Show Console打开控制台，将Python代码粘贴到控制台，回车。

```python
import urllib.request,os,hashlib; h = '6f4c264a24d933ce70df5dedcf1dcaee' + 'ebe013ee18cced0ef93d5f746d80ef60'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.cn/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```

- 修改Sublime Text插件channels，方法如下：

首选项 -> package settings -> package control -> settings里添加

```json
{
    "channels": [ "http://packagecontrol.cn/channel_v3.json" ]
}
```

> 插件安装步骤
>
> 使用快捷键 Ctrl+Alt+p , 输入：install 
>
> 选中 Package Control:Install Package回车
>
> 然后输入插件名称，回车

**2、配置中文[ChineseLocalizations](https://packagecontrol.io/packages/ChineseLocalizations)**

**3、代码规范提示[SublimeLinter](https://packagecontrol.io/packages/SublimeLinter)**

- 安装Flake8

```bash
# 安装
pip install flake8

# 更新
pip install --upgrade flake8
```

- sublime安装`SublimeLinter` + `SublimeLinter-flake8`

- 配置文件内设置

```json
// 将提示信息改为波浪线
{
    "mark_style": "squiggly_underline"
}
```

**4、代码自动补全[Anaconda](https://packagecontrol.io/packages/Anaconda)**

- 若已使用flake8，需额外配置，取消冲突功能

```json
{
    "anaconda_linting": false,
    "pep8": false
}
```

**5、文件差异工具[FileDiffs](https://packagecontrol.io/packages/FileDiffs)**

**6、Markdown[MarkdownEditing](https://packagecontrol.io/packages/MarkdownEditing)**

**7、匹配括号[BracketHighlighter](https://packagecontrol.io/packages/BracketHighlighter)**

**8、文件图标[AFileIcon](https://packagecontrol.io/packages/AFileIcon)**

**9、扩展右键功能[SideBarEnhancements](http://packagecontrol.cn/packages/SideBarEnhancements)**

**10、格式化json[PrettyJSON](http://packagecontrol.cn/packages/PrettyJSON)**

**11、SFTP工具[SFTP](https://packagecontrol.io/packages/SFTP)**

**12、SVN插件[SVN](http://packagecontrol.cn/packages/SVN)**

**13、GIT插件[Git](http://packagecontrol.cn/packages/Git)**




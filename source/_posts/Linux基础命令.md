---
title: Linux基础命令
date: 2019-12-02 16:12:41
tags: Linux
top: 0
---

# Linux常用命令总结

## 操作系统

- 作用: 整合系统硬件资源,支持软件的运行.

- 常见操作系统:

  - windows
  - Linux
  - Unix

  <!-- more -->

  - MacOS
  - iOS
  - 安卓

- 虚拟机：用来模拟一台电脑

- Linux 内核和发行版:

  - 内核：Linux系统的核心代码, Linux kernal 4.4.0.12....
  - 发行版：在内核的基础上,根据不同的应用需求添加额外的应用套件.
    - RedHat    rpm包
    - CentOS
    - Debian    dpg包
    - Ubuntu

- Linux文件系统结构 

  - 顶层目录  /
  - 普通用户家目录  /home
  - 可执行程序目录  /bin   /sbin
  - 配置文件目录    /etc

## 运行模式

运行模式也叫运行级别。在Linux进入系统时会运行第一个程序，这个程序运行时会从5种模式中选择一种运行，这5种模式，就是运行模式

第一支程序说明：

Centos6：systemV

Centos7：systemd

### 运行级别说明

| centos6     | centos7                             | 含义         |
| ----------- | ----------------------------------- | ------------ |
| init0       | systemctl poweroff                  | 关机         |
| init1       | systemctl rescue                    | 单用户模式   |
| init[2,3,4] | systemctl isolate multi-user.target | 命令行模式   |
| init5       | systemctl isolate graphical.target  | 图形界面模式 |
| init6       | systemctl reboot                    | 重启         |

### 运行模式管理

1. 获取当前运行模式

   ```bash
   systermctl get-default
   ```

2. 临时设置运行模式

   ```bash
   # 临时设定为命令行模式
   systemctl isolate multi-user.target
   
   init 3
   ```

3. 设定系统默认运行模式

   ```bash
   # 设定默认为命令行模式
   systemctl set-default multi-user.target
   ```

## 计划任务

指定时间或周期性运行脚本或命令

### at一次性计划任务

在centos中默认安装且启动

1. atd管理

   ```bash
   systemctl status|start|stop|restart atd
   ```

2. at语法

   | 命令           | 作用                       |
   | -------------- | -------------------------- |
   | at [选项] 时间 | 在指定的时间执行特定的任务 |

   | 选项 | 作用                      |
   | ---- | ------------------------- |
   | -l   | 列出该用户所有任务，同atq |
   | -d   | 删除一个任务，同atrm      |

   | 时间格式                              | 含义                     |
   | ------------------------------------- | ------------------------ |
   | HH:MM                                 | 在指定之间执行任务       |
   | HH:MM YYYY-MM-DD                      | 指定年月日               |
   | HH:MM + [minutes\|hours\|days\|weeks] | 某个时刻后某个时间点执行 |

3. 案例

   ```bash
   # 1.一分钟后，将执行任务时间点写入文件
   at now + 1minutes
   date > time.txt
   # ctrl + d 退出at
   
   # 2.指定2021-06-30 00:00关闭服务器
   at 00:00 2021-06-30
   # 将内存中数据存储到硬盘中
   /bin/sync
   shutdown -h now
   ```

### cron周期性计划任务

cron服务是由crond系统任务来控制的，可以用来循环执行任务。

cron使用crontab指令建立计划任务之后，该工作会记录到`/var/spool/cron/`中

cron的日志文件：`/var/log/cron`

1. crontab命令

   | 命令           | 作用                         |
   | -------------- | ---------------------------- |
   | crontab [选项] | 为每个用户维护周期的计划任务 |

   | 选项        | 含义                                          |
   | ----------- | --------------------------------------------- |
   | -u username | 指定用户管理计划任务，只有root可使用          |
   | -e          | 编辑crontab任务                               |
   | -l          | 查看crontab任务                               |
   | -r          | 移除全部crontab任务，若仅移除一项，使用-e编辑 |

2. crontab语法

   ```bash
   cat /etc/crontab
   ```

   [在线Cron表达式生成器 - 码工具 (matools.com)](https://www.matools.com/cron/)

## 日志管理

### Linux系统日志类型

1. 内核信息
2. 系统信息
3. 应用程序信息

### rsyslog

rsyslog是Linux中实现日志功能的服务，在cent5之前使用的syslog

1. rsyslog管理

   ```bash
   systemctl status|start|stop|restart rsyslog
   ```

2. 配置文件

   `/etc/rsyslog.conf`


## Linux基础命令

- Linux命令格式：命令   选项   参数

- 获取命令**帮助**:

  - 命令 --help
  - man 命令

- **查看命令所在位置**：`which (选项) (参数)`

- **自动补全**:tab 键
  1. 提高输入速度
  2. 降低输入错误率
  3. 可以提示命令,也可以提示路径

- **路径**:
  - 绝对路径: 以 根目录 / 开始的路径,称为绝对路径
  - 相对路径: 除绝对路径以外的路径都相对路径

- **查看文件内容**命令:  ls   -> list
  - ls -a  查看所有文件
  - linux当中的隐藏文件是以.开头的 ,   .a.txt
  - ls -l  查看文件的详细信息
  - ls -lh 以计算后的单位形式显示 详细信息

```bash
ls -alh   默认参数是当前目录
```

- **切换目录**命令   cd   -> change directory
  - cd 路径
  - .  当前目录
  - .. 当前目录的上一级目录
  - ~  当前用户的家目录

- **查看当前工作目录**命令  
  - pwd   -> print work directory

- **清屏命令**   clear   -> 快捷键  Ctrl + l

- **创建空文件**  touch 文件名 ....

- **创建空目录**  mkdir   make directory  
  - mkdir 目录名 ....      # 如果如果创建多个同级目录,目录之间需要空格分隔
  - mkdir -p 目录名/目录名/....

- **删除目录** rmdir  了解  只能删除空目录

- 删除文件或目录的命令  rm   -> remove
  rm 默认删除文件,如果是目录需使用选项

```bash
rm -r 目录名  删除目录级目录下的内容
rm -i 文件名  删除前询问
rm -f 文件名  强制删除不询问

常用删除操作
rm -rf *  删除所有文件不询问
```

- **查看当前目录大小**：`du -sh`

- **查看文件指定行内容**：`sed -n 'x,yp' filename`

- **复制文件或目录**：`cp  -> copy`
  - 默认只能复制文件,要复制目录需使用选项 -r

```bash
cp -r 源文件路径  目录文件位置或名
```

- **移动命令**：`mv   -> move`
  - mv 源文件 目标文件
  - 移动操作不考虑文件类型,移动可以兼具改名的功能

- **查看文件内容**
  - cat 文件名 ...   适合查看比较小的文本文件
  - more  文件名 ...  适合查看比较大的文本文件,可以分屏显示 

- **重定向**  >   >>
  - stdin  标准输入文件   键盘
  - stdout 标准输出文件   屏幕
  - stderr 标准错误输出文件  屏幕


```bash
ls -l > log.txt  文件不存在则创建,存在则覆盖
ls -l >> log.txt  文件不存在则创建,存在则追加到文件最后
```

- **管道** `|`
  - 作用是用来连接两个命令
  - 将左侧命令的执行结果 连接给 右侧的命令做为数据源

```bash
ps aux | grep xxx
ls -l | more
```

- **文本内容查找**   `grep`

```bash
grep -i '查找内容' 被查找的文件     # 忽略大小写搜索
grep -n '查找内容' 被查找的文件     # 查找结果显示 行号
grep -v '查找内容' 被查找的文件     # 结果取反

带正则表达式使用
grep -in '^查找内容' 被查找的文件     # 严格的开始
grep -in '查找内容$' 被查找的文件     # 严格的结束
grep -in '.' 被查找的文件            # 匹配一个非换行符之外的字符
```

- 查找文件 `find` 
  - find 查找路径 -name 文件名


```bash
find 查找路径 -name '文件名*'
find 查找路径 -name '文件名?'
```

- **链接命令**  `ln  link`

  - 软链接: 符号链接  
    - ln -s 源文件 目标连接位置   相当于**快捷方式**
  - 硬链接: 
  - ln    源文件 目标连接位置     类似于**源文件的一个别名** 

- **区别:**

  - 软链接 可以连接目录,硬连接不可以
  - 软连接相当于快捷方式,不占储存空间,硬连接占用空间
  - 硬连接会改变文件连接数,软连接不会
  - 硬连接不能跨分区.

- **打包压缩**

  ```bash
  # .zip格式
  压缩：zip -r [目标文件名].zip [原文件/目录名]
  解压：unzip [原文件名].zip
  注：-r参数代表递归

  # .tar格式（不压缩）
  打包：tar -cvf [目标文件名].tar [原文件名/目录名]
  解包：tar -xvf [原文件名].tar
  注：c参数代表create（创建），x参数代表extract（解包），v参数代表verbose（详细信息），f 参数代表filename（文件名），所以f后必须接文件名。

  # gz格式
  方式一：
    基于tar文件操作
      压缩：gzip [原文件名].tar
      解压：gunzip [原文件名].tar.gz
  
  方式二：
    一次性打包压缩
      压缩： tar -zcvf [目标文件名].tar.gz [原文件名/目录名]
      解压： tar -zxvf [原文件名].tar.gz
      z代表用gzip算法来压缩/解压。
  
  # .bz2格式
  方式一：
    基于tar文件操作
      压缩：bzip2 [原文件名].tar
      解压：bunzip2 [原文件名].tar.bz2

  方式二：
    一次性打包压缩
      压缩：tar -jcvf [目标文件名].tar.bz2 [原文件名/目录名]
      解压：tar -jxvf [原文件名].tar.bz2
      注：小写j代表用bzip2算法来压缩/解压。
  
  # .xz格式
  方式一：
    基于tar文件操作
      压缩：xz [原文件名].tar
      解压：unxz [原文件名].tar.xz

  方式二：
    一次性打包压缩
      压缩：tar -Jcvf [目标文件名].tar.xz [原文件名/目录名]
      解压：tar -Jxvf [原文件名].tar.xz
      注：大写J代表用xz算法来压缩/解压。
  
  # .jar格式
  压缩：jar -cvf [目标文件名].jar [原文件名/目录名]
  解压：jar -xvf [原文件名].jar

  注：如果是打包的是Java类库，并且该类库中存在主类，那么需要写一个META-INF/MANIFEST.MF配置文件
  然后运行打包命令
    jar -cvfm [目标文件名].jar META-INF/MANIFEST.MF [原文件名/目录名]
  
  # .7z格式
  压缩：7z a [目标文件名].7z [原文件名/目录名]
  解压：7z x [原文件名].7z 
  
  注：这个7z解压命令支持rar格式，即： 7z x [原文件名].rar
  ```

- **权限管理**

  - 三类用户:
    - 文件所有者   user  u
    - 所有者同组用户   group   g
    - 其它用户    other  o
    - 全部用户     all  a
  - 权限:
    - 读取权限    r
    - 写入权限    w
    - 执行权限    x

  <img src="https://tupian-1300728887.cos.ap-chengdu.myqcloud.com/Xnip2019-08-05_11-15-00.png" style="zoom:100%;" />


  ```bash
  chmod 用户角色 +/-/= 权限 文件  # 字母法
  
  chmod 777  文件 # 数字法
  ```

  - 切换用户身份
    - 临时借用root权限 
      - sudo 命令
    - 切换到root用户环境中
      - sudo -s

  ```bash
  su 用户名  # 普通用户间切的
  exit  # 退出当前用户环境
  whoami  # 查看当用用户是谁
  who   # 查看所有登陆用户
  which  命令   # 查看命令位置
  ```

  - **用户管理**

    - 添加用户组
      - group  add 组名
      - /etc/group
    - 删除组
      - group  del 组名
      - 注意: 如果该组是用户的主组时,不能删除,需要先删除用户,再删除组
    - 添加用户
      - useradd  -m -g 组id 用户名
        - -m 指定创建家目录,与用户名同名
        - -g 用来指定用户所在的组

  - **用户文件目录**

    - /etc/passwd  保存用户信息
    - /etc/shadow  保存用户的密码信息
    - /etc/group   默认在创建用户时,会同创建一个同名的组 

  - **修改密码命令**

    - 为当前用户改密码
      - passwd
    - 为指定用户改密码,但是只能由root执行
      - passwd 用户名

  - **远程登陆**

    - 需要先安装  openssh-server 软件包
    - ssh 用户名@ip地址 

  - **远程传输**:

    | 选项 | 作用                 |
    | ---- | -------------------- |
    | -P   | 指定远程主机sshd端口 |
    | -r   | 传输文件夹           |

    - 上传:
      - `scp 本地文件 user@IP:/路径`
    - 下载:
      - `scp user@ip:/资源位置   本地位置`

  - **ubantu软件安装和卸载**

    - 离线:
      - 安装  `dpkg -i xxx.deb`
      - 卸载    `dpkg -r xxx`
    - 在线:
      1. 首要配置数据源    `/etc/apt/source.list`
         2. 更新数据源    `sudo apt-get update`
         3. 安装    `sudo apt-get install 软件名`
         4. 卸载    `sudo apt-get remove 软件名`

- ssh

  ssh配置文件：`/etc/ssh/sshd_config`

  1. 查看ssh服务是否正常开启：`systemctl status sshd`
  2. 重启ssh服务：`systemctl status sshd`
  3. 查看ssh开放端口：`netstat -tnlp |grep ssh`

## 网络相关

在centos7中，默认的网络服务由NetworkManager提供。可以有两种工具管理网络，命令行工具`nmcli`和图形化配置工具`nmtui`，配置文件：`/etc/sysconfig/network-scripts/`

1. 重启网卡：`systemctl restart network`
2. 查看本机网关：`route -n`
3. 查看DNS：`cat /etc/resolv.conf`

---

1. nmcli语法

   ```
   nmcli --help
   ```

2. 查看设备信息

   ```bash
   # 简单信息查看
   nmcli device status
   
   # 详细信息查看
   nmcli device show
   
   # 某个设备的详细信息查看
   nmcli device show interface-name
   ```

3. 查看连接信息

   ```bash
   # 简单连接信息
   nmcli connection show
   
   # 某个连接的详细信息
   nmcli connection show id
   ```

### 配置网络

| 配置项                           | 含义                     |
| -------------------------------- | ------------------------ |
| connection.autoconnect [yes\|no] | 是否开机时启动网络       |
| ipv4.method [auto\|manual]       | 自动还是手动设定网络参数 |
| ipv4.dns                         | dns地址                  |
| ipv4.addresses                   | ip地址                   |

1. nmcli

   ```bash
   # 查看当前网卡数据
   nmcli device show interface-name
   
   # 配置操作
   nmcli connection modify interface-name \
   
   # 是配置生效
   nmcli connection up interface-name
   ```

2. nmtui

3. 修改配置文件（不建议）

---

## vim

- 编辑模式    `i 从命令变成编辑模式`
- 命令模式    `esc 键  退回到命令模式`
- 末行模式
  - :wq  保存退出    :wq!
  - :w   保存不退出   :w!
  - :q   退出不保存   :q!
  - :x   保存退出     :x!
- 配置文件设置（没有该文件则新建）
  - `/etc/vimrc` 是系统范围的初始化配置
  - `～/.vimrc` 是个人的vim初始化配置

```bash
:set nu  设置行号
:set nonu  取消行号 

:syntax on  开启语法高亮
:syntax off 关闭语法
```

- 命令模式操作


  ```bash
光标移动:
hjkl  -> 左下上右
0   回到行首
$   跳到行尾
gg  到首行
G   到末行
nG  到第n行
M   到屏幕中间
w   跳到下一个单词

dd  剪贴
5dd 剪贴5行
yy  复制当前光标行
5yy 从当前光标开始向下复制5行
p   在当前光标下一行粘贴
5p  粘贴5次

yG 复制到末行
ygg 复制到首行

x 向后删除一个字符
X 向前删除一个字符

>>  向前缩进
<<  向前缩进

查找内容：
/自上而下
?自下而上

n 向下跳到搜索内容
N 反向跳

u  撤消
ctrl + r  反撤消
  ```

### 异常退出

已修改文件在未保存情况下，非正常退出终端

1. 删除交换文件`.swp`
2. 选择`d`删除交换文件
   - `o`：只读方式打开
   - `e`：直接编辑
   - `r`：恢复
   - `a`：终止
   - `d`：删除交换文件

## 软件管理

### RPM

**RPM常用命令**

| 命令              | 作用                    |
| ----------------- | ----------------------- |
| rpm -ivh filename | 安装                    |
| rpm -Uvh filename | 升级                    |
| rpm -e filename   | 卸载                    |
| rpm -qpi filename | 查询软件的描述信息      |
| rpm -qa           | 查询系统中所有的rpm软件 |

包依赖关系不好维护

### yum

**yum常用命令**

| 命令                 | 作用                   |
| -------------------- | ---------------------- |
| yum install filename | 安装，-y：无需手动确认 |
| yum update filename  | 升级                   |
| yum remove filename  | 卸载                   |
| yum list installed   | 查询已安装软件包       |

## Xshell快捷键

1. 上传：rz
2. 下载：sz

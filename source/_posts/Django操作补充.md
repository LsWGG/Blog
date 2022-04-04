---
title: Django补充
date: 2020-09-30 11:40:58
tags: Django
top: 0
---

## 静态化与缓存的主要区别

- 静态化：将数据静态化到页面，客户端访问时不查询数据库，存储与硬盘
- 缓存：将数据存储于服务器内存

<!--more-->

## 定时任务的原理

- 由**crond守护进程**和**crontab文件（任务表）**组成

- 守护进程在系统启动时由init进程启动，受init监视，如果它挂了，init会重启它守护进程每分钟唤醒一次，通过检查crontab文件判断需要做什么

  ```bash
  # 添加定时任务到系统中
  $ python manage.py crontab add
  
  # 显示已激活的定时任务
  $ python manage.py crontab show
  
  # 移除定时任务
  $ python manage.py crontab remove
  ```

## 支付宝接入

- Python支付宝SDK：https://github.com/fzlee/alipay/blob/master/README.zh-hans.md 
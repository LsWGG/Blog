---
title: 安装M2Crypto模块踩坑记录
date: 2020-09-30 11:26:15
tags: Python
top: 0
---

# 安装M2Crypto

用于RSA公私钥加解密，需安装依赖openssl，CentOS用yum安装即可

## 在线安装

1. 安装pip

   `curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py`

   运行

   `python get-pip.py`

   <!-- more -->

2. 安装依赖

   `yum install libssl-dev swig`

   可能会报错

   ![image-20201221103032227](https://tupian-1300728887.cos.ap-chengdu.myqcloud.com/error_no_openssl.png)

   安装openssl-devel解决：`yum install openssl-devel`

   参考：https://blog.csdn.net/blueheart20/article/details/65653670/

3. 安装M2Crypto

   `pip install M2Crypto`



rpm包下载网站：

http://rpmfind.net/linux/RPM/index.html

https://vault.centos.org/
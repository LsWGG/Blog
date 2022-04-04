---
title: Docker基础操作
date: 2020-09-30 11:36:28
tags: Tool
top: 0
---

# Docker

**开源的软件部署解决方案、轻量级的应用容器框架，采用C/S架构，其可以轻松的为任何应用创建一个轻量级的、可移植的、自给自足的容器。**

> 是一种快速解决生产问题的一种技术手段。

<!--more-->

优缺点：

- 优：
  - 多： 适用场景多
  - 快： 环境部署快、更新快
  - 好： 好多人在用，东西好
  - 省： 省钱省力省人工(123原则)
- 缺：
  - 太腻歪人： 依赖操作系统
  - 不善于沟通：依赖网络
  - 不善理财： 银行U盾等场景不能用

**镜像**

- 类似虚拟机的镜像，可以创建新的容器

```dockerfile
# 镜像
docker search [image_name]			# 搜索镜像
docker pull [image_name]			# 获取镜像
docker images						# 查看镜像
docker history [image_name]			# 查看镜像历史
docker tag [old_image]:[old_version]	# 重命名
docker rm [image_name]				# 删除
docker save -o [包文件] [镜像]		# 导出镜像
docker load -i [image.tar_name]		# 导入镜像
```

**容器**

- 由镜像创建的运行实例，类似虚拟机

```dockerfile
# 容器
docker ps								# 查看容器
docker start [container_id]				# 启动已终止的容器
docker stop [container_id]				# 关闭
docker rm [container_id]				# 删除
		-f		# 强制删除
docker run [docker_image] /bin/bash
		--name	# 给容器定义一个名称
		-i 		# 让容器的标准输入保持打开。
		-t		# 分配一个伪终端,并绑定到容器的标准输入上
		-d 		# 守护进程开启
		-v		# 本地:容器 --映射
		-p  	# 端口映射
docker exec -it 容器id /bin/bash			# 进入后台运行容器
docker commit [container_id] [new_image:tag]	# 基于容器创建镜像
		-m 		# '改动信息' 
		-a 		# "作者信息"
docker logs [容器id]					# 查看运行日志
docker inspect  [容器id]				# 查看详细信息
```

**仓库（公有、私有、本地）**

- 托管镜像

# dockerflie

 Dockerfile类似于我们学习过的脚本，将我们在上面学到的镜像，使用自动化的方式实现出来。

```dockerfile
# 基础指令
FROM <image>					# 第一条指令（除首行注释外）
MAINTAINER <name>				# 作者信息
RUN <command>					# 镜像构建时候运行的命令
EXPOSE <port>					# 对外开发端口
ENTRYPOINT python3 manage.py runserver 0.0.0.0:8000
								# 运行Django项目，只能有一个

# 文件编辑指令
ADD <src>... <dest>		# 将指定的 <src> 文件复制到容器文件系统中的 <dest>
COPY <src>... <dest>			# 复制文件

# 环境指令
ENV <key> <value>				# 设置环境变量
WORKDIR /path/to/workdir		# 切换目录
```

> 参考文档：
>
> 1.  [中文社区](http://www.docker.org.cn/index.html)
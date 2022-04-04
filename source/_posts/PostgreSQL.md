---
title: PgSQL
date: 2020-12-23 10:26:13
tags: SQL
top: 0
---

# 一、PostgreSQL

- 安装

  下载地址：https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

# 二、命令行操作

登录：`psql -U postgres`

<!--more-->

### 1. 数据库操作

#### 1.1 创建数据库

1. `CREATE DATABASE	`SQL语句创建

   ```sql
   CREATE DATABASE runoobdb
   ```

2. `createdb`创建

   ```bash
   createdb [option...] [dbname [description]]
   
   - dbname:要创建的数据库名
   - description:新创建的数据库相关说明
   - options:可选参数
   	-D:指定数据库默认表空间
   	-e:将 createdb 生成的命令发送到服务端。
   	-E:指定数据库编码
   	-l:指定数据库语言环境
   	--help:显示 createdb 命令的帮助信息。
   	-h:指定服务器主机名
   	-p:指定服务器监听的端口
   	-U:连接数据库用户名
   	-w:忽略输入密码
   	-W:强制要求输入密码
   	
   创建runoobdb数据库，端口为5432，用户postgres
   > createdb -h localhost -p 5432 -U postgres runoobdb
   ```

3. `pgAdmin`工具

#### 1.2 删除数据库

1. 使用 **DROP DATABASE** SQL 语句来删除。

   ```sql
   DROP DATABASE runoobdb;
   ```

2. 使用 **dropdb** 命令来删除。

   ```pgdql
   dropdb [connection-option...] [option...] dbname
   ```

   **参数说明：**

   **dbname**：要删除的数据库名。

   **options**：参数可选项

3. 使用 **pgAdmin** 工具。

### 2. 命令窗口

查看已存在数据库：`\l`

进入数据库：`\c dbname`

连接数据库时选择：`psql -h locahost -p 5432 -U postgres dbname`

启动sql服务：`pg_ctl start -D pg安装目录`
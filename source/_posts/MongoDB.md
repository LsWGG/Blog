---
title: MongDB
date: 2020-05-03 10:51:33
tags: NoSQL
top: 0
---

# 一、MongoDB简介

​		**MongoDB 是由C++语言编写的，是一个基于分布式文件存储的开源数据库系统。**将数据存储为一个文档，数据结构由键值对组成，文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。

**特点：**

- 面向文档存储的数据库，操作简单
- 可设置任何属性的索引，实现快速排序
- 可通过本地或者网络创建数据镜像

<!--more-->

## 1. 安装MangoDB

官网下载地址：https://www.mongodb.com/download-center/community

**配置：**

1. 创建D:\mongodb\data\log目录，用来存放日志文件；
2. 在D:\mongodb\data\log目录里新建mongodb.log，用来存放日志信息；
3. 创建D:\mongodb\data\db目录，用来存放数据库数据，
4. 并在D:\mongodb目录下创建mongo.config，在文件内部复制如下文本：

```bash
# 数据文件  此处=后对应到数据所存放的目录
dbpath=d:\mongodb\data\db
# 日志文件  此处=后对应到日志文件所在路径
logpath=d:\mongodb\data\log\mongodb.log
# 错误日志采用追加模式，配置这个选项后mongodb的日志会追加到现有的日志文件，而不是从新创建一个新文件
logappend=true 
#启用日志文件，默认启用
journal=true 
#这个选项可以过滤掉一些无用的日志信息，若需要调试使用请设置为false
quiet=true 
#端口号 默认为27017
port=27017
```

**测试是否安装成功**

- 进入\MongoDB\Server\3.4\bin文件夹下，点击mongod.exe，如果闪一下退出，说明安装正常

  ![](https://tupian-1300728887.cos.ap-chengdu.myqcloud.com/MangoDB%E6%88%90%E5%8A%9F.png)

**安装MongoDB服务**

- 执行mongod.exe，使用--install选项来安装服务，使用--config选项来指定之前创建的配置文件。

  ```
  C:\mongodb\bin\mongod.exe --config "C:\mongodb\mongod.cfg" --install
  ```

**终端操作（管理员）**

- 启动MongoDB服务

  `net start MongoDB`

- 关闭MongoDB服务

  `net stop MongoDB`

- 移除 MongoDB 服务

  `**\mongodb\bin\mongod.exe --remove`

## 2. 概念

| SQL术语/概念 | MongoDB术语/概念 |              解释/说明              |
| :----------: | :--------------: | :---------------------------------: |
|   database   |     database     |               数据库                |
|    table     |    collection    |            数据库表/集合            |
|     row      |     document     |           数据记录行/文档           |
|    column    |      field       |             数据字段/域             |
|    index     |      index       |                索引                 |
| table joins  |                  |        表连接,MongoDB不支持         |
| primary key  |   primary key    | 主键,MongoDB自动将_id字段设置为主键 |

### 2.1 数据库

MongoDB的默认数据库为"db"，该数据库存储在data目录中。

MongoDB的单个实例可以容纳多个独立的数据库，每一个都有自己的集合和权限，不同的数据库也放置在不同的文件中。

1. 显示所有数据的列表：`show dbs`

2. 显示当前数据库对象或集合:`db`

3. 连接到一个指定的数据库:`use`


**自带特殊数据库：**

- **admin**： 从权限的角度来看，这是"root"数据库。要是将一个用户添加到这个数据库，这个用户自动继承所有数据库的权限。一些特定的服务器端命令也只能从这个数据库运行，比如列出所有的数据库或者关闭服务器。
- **local:** 这个数据永远不会被复制，可以用来存储限于本地单台服务器的任意集合
- **config**: 当Mongo用于分片设置时，config数据库在内部使用，用于保存分片的相关信息。

### 2.2 文档

​		文档是一组键值(key-value)对(即 BSON)。MongoDB 的文档不需要设置相同的字段，并且相同的字段不需要相同的数据类型

| RDBMS  |              MongoDB              |
| :----: | :-------------------------------: |
| 数据库 |              数据库               |
|  表格  |               集合                |
|   行   |               文档                |
|   列   |               字段                |
| 表联合 |             嵌入文档              |
|  主键  | 主键 (MongoDB 提供了 key 为 _id ) |

1. 文档中的键/值对是有序的。
2. 文档中的值不仅可以是在双引号里面的字符串，还可以是其他几种数据类型（甚至可以是整个嵌入的文档)。
3. MongoDB区分类型和大小写。
4. MongoDB的文档不能有重复的键。
5. 文档的键是字符串。除了少数例外情况，键可以使用任意UTF-8字符。

文档键命名规范：

- 键不能含有\0 (空字符)。这个字符用来表示键的结尾。
- $有特别的意义，只有在特定环境下才能使用。
- 以下划线"_"开头的键是保留的(不是严格要求的)。

### 2.3 集合

​		MongoDB文档组，相比于表格

集合命名规范：

- 集合名不能是空字符串""。
- 集合名不能含有\0字符（空字符)，这个字符表示集合名的结尾。
- 集合名不能以"system."开头，这是为系统集合保留的前缀。
- 用户创建的集合名字不能含有保留字符。有些驱动程序的确支持在集合名里面包含，这是因为某些系统生成的集合中包含该字符。除非你要访问这种系统创建的集合，否则千万不要在名字里出现$。　

### 2.4 元数据

​		存储数据库信息集合

|       集合命名空间       |                   描述                    |
| :----------------------: | :---------------------------------------: |
| dbname.system.namespaces |            列出所有名字空间。             |
|  dbname.system.indexes   |              列出所有索引。               |
|  dbname.system.profile   |       包含数据库概要(profile)信息。       |
|   dbname.system.users    |       列出所有可访问数据库的用户。        |
|   dbname.local.sources   | 包含复制对端（slave）的服务器信息和状态。 |

- 在indexes中插入数据，可创建索引
- users是可以修改的
- profile是可以删除的

### 2.5 MongoDB数据类型

|       String       | 字符串。存储数据常用的数据类型。在 MongoDB 中，UTF-8 编码的字符串才是合法的。 |
| :----------------: | :----------------------------------------------------------- |
|      Integer       | 整型数值。用于存储数值。根据你所采用的服务器，可分为 32 位或 64 位。 |
|      Boolean       | 布尔值。用于存储布尔值（真/假）。                            |
|       Double       | 双精度浮点值。用于存储浮点值。                               |
|    Min/Max keys    | 将一个值与 BSON（二进制的 JSON）元素的最低值和最高值相对比。 |
|       Array        | 用于将数组或列表或多个值存储为一个键。                       |
|     Timestamp      | 时间戳。记录文档修改或添加的具体时间。                       |
|       Object       | 用于内嵌文档。                                               |
|        Null        | 用于创建空值。                                               |
|       Symbol       | 符号。该数据类型基本上等同于字符串类型，但不同的是，它一般用于采用特殊符号类型的语言。 |
|        Date        | 日期时间。用 UNIX 时间格式来存储当前日期或时间。你可以指定自己的日期时间：创建 Date 对象，传入年月日信息。 |
|     Object ID      | 对象 ID。用于创建文档的 ID。                                 |
|    Binary Data     | 二进制数据。用于存储二进制数据。                             |
|        Code        | 代码类型。用于在文档中存储 JavaScript 代码。                 |
| Regular expression | 正则表达式类型。用于存储正则表达式。                         |

**ObjectId 类似唯一主键，可以很快的去生成和排序，**包含 12 bytes，含义是：

- 前 4 个字节表示创建 **unix** 时间戳,格林尼治时间 **UTC** 时间，比北京时间晚了 8 个小时

- 接下来的 3 个字节是机器标识码
- 紧接的两个字节由进程 id 组成 PID
- 最后三个字节是随机数

![img](https://www.runoob.com/wp-content/uploads/2013/10/2875754375-5a19268f0fd9b_articlex.jpeg)

​		MongoDB 中存储的文档必须有一个 _id 键。这个键的值可以是任何类型的，默认是个 ObjectId 对象

由于 ObjectId 中保存了创建的时间戳，可以通过 getTimestamp 函数来获取文档的创建时间:

```bash
newObject = ObjectId()
newObject.getTimestamp()
ISODate("2017-11-25T07:21:10Z")
# ObjectId转字符串
str_objectid = ObjectId().str
typeof str_objectid
string
```

# 二、MongoDB操作

## 1. 数据库操作

创建数据库：`use DATABASE_NAME`

查看所有数据库：`show dbs`

删除数据库：`db.dropDatabase()`

>  集合（数据表）在插入数据后才会被创建

## 2. 集合操作

创建集合：`db.createCollection(name, options)`

- name：集合名称

- options：可选参数，指定内存大小及索引

  1. capped（布尔）：如果为 true，则创建固定集合。
     - 固定集合是指有着固定大小的集合，当达到最大值时，它会自动覆盖最早的文档。
       **当该值为 true 时，必须指定 size 参数。**

  2. autolndexld（布尔）：如为 true，自动在 _id 字段创建索引。默认为 false。

  3. size：为固定集合指定一个最大值，以千字节计（KB）

  4. max：指定固定集合中包含文档的最大数量。

> 在插入文档时，MongoDB 首先检查固定集合的 size 字段，然后检查 max 字段。

查看已有集合：`show collections && show tables`

删除集合：`db.collection.drop()`

## 3. 文档操作

**插入文档**：`db.COLLECTION_NAME.insert(document) && **save(document)`

查看已插入的文档：	`db.COLLECTION_NAME.find()`

**更新文档**

1. update()

   **更新符合条件的文档**

   ```bash
   db.collection.update(
      <query>,			# 查询条件，≈where后面的
      <update>,		# update的对象和一些更新的操作符（如$,$set...）
      {
        upsert: <boolean>,	# 如果不存在update的记录，是否插入objNew
        multi: <boolean>,	# 只更新找到的第一条记录，若为真全部更新
        writeConcern: <document>	# 异常级别
      }
   )
   ```

2. save()

   **传入文档替换已有文档（_id一样）**

   ```bash
   db.collection.save(
      <document>,	# 文档数据
      {
        writeConcern: <document>	# 异常级别
      }
   )
   ```

**删除文档**：`db.COLLECTION_NAME.deleteOne() && **.deleteMany()`

**查询文档**：`db.collection.find(query, projection)`

- **query** ：可选，使用查询操作符指定查询条件
- **projection** ：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）

用格式化的方式显示所有文档：`db.collection_name.find().pretty()`

**MongoDB的条件操作符**

|    操作    |          格式          |                   范例                    |   RDBMS中的类似语句   |
| :--------: | :--------------------: | :---------------------------------------: | :-------------------: |
|    等于    |    {<key>:<value>}     |  db.col.find({"by":"菜鸟教程"}).pretty()  | where by = '菜鸟教程' |
|    小于    | {<key>:{$lt:<value>}}  | db.col.find({"likes":{$lt:50}}).pretty()  |   where likes < 50    |
| 小于或等于 | {<key>:{$lte:<value>}} | db.col.find({"likes":{$lte:50}}).pretty() |   where likes <= 50   |
|    大于    | {<key>:{$gt:<value>}}  | db.col.find({"likes":{$gt:50}}).pretty()  |   where likes > 50    |
| 大于或等于 | {<key>:{$gte:<value>}} | db.col.find({"likes":{$gte:50}}).pretty() |   where likes >= 50   |
|   不等于   | {<key>:{$ne:<value>}}  | db.col.find({"likes":{$ne:50}}).pretty()  |   where likes != 50   |

and条件查询：`db.collection_name.find({key1:value1, key2:value2}).pretty()`

or条件查询：`db.collection_name.find({$or:[{key1:value1}, {key2:value2}]}).pretty()`

**模糊查询**

- 查询 title 包含"教"字的文档：`db.col.find({"title":/教/})`

- 查询 title 字段以"教"字开头的文档：`db.col.find({"title":/^教/})`

- 查询 title字段以"教"字结尾的文档：`db.col.find({"title":/教$/})`

**$type操作符**

获取集合中 title 为 String 的数据：`db.col.find({"title": {$type: 'string'}})`

**指定显示数量：**`db.collection_name.find().limit(number)`

>  如果没有指定limit()方法中的参数则显示集合中的所有数据

**跳过指定显示数量**：`db.collection_name.find().skip(number)`

> skip默认参数为0，效率差，遍历出来的

例：想要读取从 10 条记录后 100 条记录，相当于 sql 中limit (10,100)。

​		`db.COLLECTION_NAME.find().skip(10).limit(100)`

**排序**：`db.COLLECTION_NAME.find().sort({KEY:1})`

> 执行顺序：sort()  -->  skip()  -->  limit()

## 4. 索引

创建：`db.collection.createindex(keys, options)`

创建数组索引：`db.collection.ensureIndex()`

为子文档创建索引：`db.users.ensureIndex({"address.city":1,"address.state":1,"address.pincode":1})`

- keys：创建索引的字段，可有多个，1为升序反之倒序
- options：可选参数
  1. background：建索会阻塞其它数据库操作，True为后台建索
  2. unique：建立的索引是否唯一，默认false，指定true创建唯一索引
  3. name：索引名称，未指定自动生成（字段名＋排序顺序）
  4. sparse：对文档中不存在的字段数据不启用索引
  5. weights：索引权重值

查看集合索引：`db.col.getIndexes()`

查看集合索引大小：`db.col.totalIndexSize()`

删除集合所有索引：`db.col.dropIndexes()`

删除集合指定索引：`db.col.dropIndex("索引名称")`

**定期删除**

数据记录中createDate为时间类型时：设置时间180秒后自动删除

`db.col.createIndex({"createDate": 1},{expireAfterSeconds: 180})`

**定时删除**

A记录中需添加 "ClearUpDate": new Date('Jan 22, 2019 23:00:00')

`db.col.createIndex({"ClearUpDate": 1},{expireAfterSeconds: 0})`

- 索引关键字段必须是 Date 类型。
- 非立即执行：扫描 Document 过期数据并删除是独立线程执行，默认 60s 扫描一次，删除也不一定是立即删除成功

**查询限制**

索引不能被以下的查询使用：

- 正则表达式及非操作符，如 $nin, $not, 等。
- 算术运算符，如 $mod, 等。
- $where 子句

索引限制：

如果现有的索引字段的值超过索引键的限制，MongoDB中不会创建索引。

如果文档的索引字段值超过了索引键的限制，MongoDB不会将任何文档转换成索引的集合。

最大范围：

- 集合中索引不能超过64个
- 索引名的长度不能超过128个字符
- 一个复合索引最多可以有31个字段

## 5. 聚合

aggregate()方法：`db.collection_name(aggregate_opeation)`

| 表达式    | 描述                                           | 实例                                                         |
| :-------- | :--------------------------------------------- | :----------------------------------------------------------- |
| $sum      | 计算总和。                                     | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : "$likes"}}}]) |
| $avg      | 计算平均值                                     | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}]) |
| $min      | 获取集合中所有文档对应值得最小值。             | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$min : "$likes"}}}]) |
| $max      | 获取集合中所有文档对应值得最大值。             | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$max : "$likes"}}}]) |
| $push     | 在结果文档中插入值到一个数组中。               | db.mycol.aggregate([{$group : {_id : "$by_user", url : {$push: "$url"}}}]) |
| $addToSet | 在结果文档中插入值到一个数组中，但不创建副本。 | db.mycol.aggregate([{$group : {_id : "$by_user", url : {$addToSet : "$url"}}}]) |
| $first    | 根据资源文档的排序获取第一个文档数据。         | db.mycol.aggregate([{$group : {_id : "$by_user", first_url : {$first : "$url"}}}]) |
| $last     | 根据资源文档的排序获取最后一个文档数据         | db.mycol.aggregate([{$group : {_id : "$by_user", last_url : {$last : "$url"}}}]) |

> 例：通过以上集合计算每个作者所写的文章数
>
> `db.mycol.aggregate({$group : {_id : "$by_user", num_tutorial : {$sum : 1}}})`
>
> 相比于SQL语句：
>
> `select by_user as _id, count(*) as num_tutorial from mycol group by by_user`

## 6. 管道

MongoDB的聚合管道将MongoDB文档在一个管道处理完毕后将结果传递给下一个管道处理

**$project**：修改文档将结构

> `db.clo.aggregate({$project: {title: 1, author:1}})`
>
> 同
>
> `db.col.find({}, {title： 1, author:1})`

**$match**：过滤数据

> 例：将分数大于70小于或等于90记录，然后将符合条件的记录送到下一阶段$group管道操作符进行处理
>
> ```
> db.articles.aggregate([
> 	{ $match : { score : { $gt : 70, $lte : 90 } } },
> 	{ $group: { _id: null, count: { $sum: 1 } } }
> ]);
> ```

**当match和group同时存在时， 顺序会影响检索结果，必须先写 match 在前面**

# 三、MongoDB优化

## 1. 副本集

​		将数据同步在多个服务器的过程，提高了数据的可用性， 并可以保证数据的安全性。具有自动灾难恢复。没有固定的主节点

**副本集设置**

1. 创建一个cluster文件夹，放node1，node2，node3三个子文件夹

   ```
   节点1：
   HOST：localhost:10001
   Data File：F:\MongoDB\node1
   
   节点2：
   HOST：localhost:10002
   Data File：F:\MongoDB\node2
   
   节点3：
   HOST：localhost:10003
   Data File：F:\MongoDB\node3
   ```

2. 指定 --replSet 选项来启动mongoDB：

   `mongod --port 端口 --dbpath 文件夹位置 --replSet 副本集名称`

   - 启动一个新的副本集(初始化操作)：

     ```
     rs.initiate({
     	"_id":"shinelon",
     	"members":[ 
     		{"_id":1,"host":"localhost:10001"},
     		{"_id":2,"host":"localhost:10002"},
     		{"_id":3,"host":"localhost:10003"} 
     			]
     	})
     ```

   - 查看副本集的配置：`rs.conf()`

   - 查看副本集状态： `rs.status() `

   - 副本集添加成员：`rs.add(HOST_NAME:POST)`

## 2. 分片

​		指将数据拆分，将其分散存在不同的机器上的过程，不需要功能强大的大型计算机就可以储存更多的数据，处理更多的负载

**片键**：从集合里面选一个键，用该键的值作为数据拆分的依据

**分片设置**

1. 启动Shard Server（用于存储实际的数据块）

   ```bash
   HOST：localhost:27020
   Data File：F:\MongoDB\shard\s0
   
   HOST：localhost:27021
   Data File：F:\MongoDB\shard\s1
   ...\s3
   Data File：F:\MongoDB\shard\log
   
   > mongod --port 27020 --dbpath=F:\MongoDB\shard\s0 --logpath=F:\MongoDB\shard\log\s0.log --logappend --fork
   ...
   ```

2. 启动Config Server（mongodb实例）

   ```
   HOST：localhost:27100
   Data File：F:\MongoDB\shard\config
   
   > mongod --port 27100 --dbpath=F:\MongoDB\shard\config --logpath=F:\MongoDB\shard\log\config.log --logappend --fork
   ```

3. 启动Route Process（mongos路由进程：应用连接它来发送请求，知道数据在分片中的位置，收集返回数据）

   ```
   > mongos --port 40000 --configdb localhost:27100 --fork --logpath=F:\MongoDB\shard\log\route.log --chunkSize 500
   ```

   > chunkSize这一项是用来指定chunk的大小的，单位是MB，默认大小为200MB.

4. 配置Sharding

   ```bash
   mongo admin --port 40000
   db.runCommand({ addshard:"localhost:27020" })
   ...
   db.runCommand({ enablesharding:"test" }) #设置分片存储的数据库
   # 指定片键 user.name
   db.runCommand({ shardcollection: 'test.user', key: {name: 1}})
   ```

可参考：https://blog.csdn.net/qq_37142346/java/article/details/82824132

## 3. 备份与恢复

数据备份：`mongodump -h dbhost -d dbname -o dbdirectory`

- -h：MongoDB所在服务器地址，默认为： localhost:27017
- -d：需要备份的数据库实例，例如：test
- -o：备份的数据存放位置，例如：c:\data\dump

mongodump 命令可选参数列表如下所示：

| 语法                                              | 描述                           | 实例                                             |
| :------------------------------------------------ | :----------------------------- | :----------------------------------------------- |
| mongodump --host HOST_NAME --port PORT_NUMBER     | 该命令将备份所有MongoDB数据    | mongodump --host runoob.com --port 27017         |
| mongodump --dbpath DB_PATH --out BACKUP_DIRECTORY |                                | mongodump --dbpath /data/db/ --out /data/backup/ |
| mongodump --collection COLLECTION --db DB_NAME    | 该命令将备份指定数据库的集合。 | mongodump --collection mycol --db test           |

数据恢复：`mongorestore -h <hostname><:port> -d dbname <path>`

- --host <:port>, -h <:port>：MongoDB所在服务器地址

- --db , -d ：需要恢复的数据库实例，例如：test

- --drop：恢复的时候，先删除当前数据，然后恢复备份的数据。

- <path>：mongorestore 最后的一个参数，设置备份数据所在位置

  > 例：c:\data\dump\test

- --dir：指定备份的目录

  > 不能同时指定 <path> 和 --dir 选项。

## 4. 监控

**mongostat命令**

获取mongoDB的运行状态：mongostat

**mongotop命令**

跟踪一个MongoDB的实例，查看哪些读取和写入数据在花费大量的时间：mongotop <sleeptime>

- 等待时间长度，以秒为单位

# 四、MongoDB高级

## 1. MongoDB关系

​		MongoDB的关系表示多个文档之间在逻辑上的相互关系，文档间可以通过**嵌入**和**引用**来建立联系。

- 一对一
- 一对多
- 多对一
- 多对多

**嵌入式关系**：把用户地址嵌入到用户的文档中（一张表，数据量大的话，影响性能）

> 查询用户地址：`db.users.findOne({"name":"Tom Benzamin"},{"address":1})`

**引用式关系**：通过引用文档的 **id** 字段来建立关系，外键

1. 查询用户地址对象id

   `var result = db.users.findOne({"name":"Tom Benzamin"},{"address_ids":1})`

2. 通过查询的id获取用户的详细地址信息

   `var addresses = db.address.find({"_id":{"$in":result["address_ids"]}})`

> findOne不能写成find，find返回的是数组，findOne返回的是对象

## 2. 引用操作

MongoDB引用有两种：手动引用（Manual References）和DBRefs

**DBRefs**

形式：`{$ref : , $id : , $db : }`

- $ref：集合名称
- $id：引用的id
- $db:数据库名称，可选参数

**覆盖查询：**

- 所有的查询字段是索引的一部分
- 所有的查询返回字段在同一个索引中

> 1. 在 users 集合中创建联合索引，字段为 gender 和 user_name :
>
>    `db.users.ensureIndex({gender:1,user_name:1})`
>
> 2. 该索引会覆盖以下查询：
>
>    `db.users.find({gender:"M"},{user_name:1,_id:0})`
>
> 3. 没有排除_id，查询就不会被覆盖
>
>    `db.users.find({gender:"M"},{user_name:1})`

**查询分析：**可以确保建立的索引是否有效，是查询语句性能分析的重要工具。

1. explain()：查询信息，使用索引及查询统计等

   `db.users.find({gender:"M"},{user_name:1,_id:0}).explain()`

2. hint()：指定使用某个索引字段来查询

   `db.users.find({gender:"M"},{user_name:1,_id:0}).hint({gender:1,user_name:1})`

## 3. 原子操作

​		mongodb不支持事务，但是mongodb提供了许多原子操作，比如文档的保存，修改，删除等，都是原子操作。要么成功要么失败，达到数据完整性

### 3.1 原子操作常用命令

**$set：**用来指定一个键并更新键值，若键不存在并创建。

`{ $set :{ field : value}}`

> 例：`db.col.update({"gender":"M"},{$set:{"gender": "A"}})`

**$unset：**用来删除一个键

`{ $unset : { field : 1} }`

> 例：`db.col.update({"gender":"A"},{$unset:{"gender": 1}})`

**$inc：**对文档的某个值为数字型（只能为满足要求的数字）的键进行增减的操作。

`{ $inc : { field : value } }`

> 例：`db.col.update({},{$inc:{"num": 10}})`

**$push：**把value追加到field里面去，field一定要是数组类型才行

`{ $push : { field : value } }`

> 例：`db.col.update({"_id": 1},{$push:{age:22}})`
>
> 添加多个字段到数组
>
> 例：`db.col.update({"_id": 1},{$push:{age: {$each: [1,2,3]}}})`

**$pull：**从数组field内删除一个等于value值

`{ $pull: { <field1>: <value|condition>, <field2>: <value|condition>, ... } }`

> 例：`db.col.update({}, {$pull:{age:24}})`

**$pop：**删除数组的第一个（-1）或最后一个（1）元素

`{ $pop : { field : 1 } }`

> 例：`db.col.update({}, {$pop:{"age":1}})`

**$rename:**修改字段名称

`{ $rename : { old_field_name : new_field_name } }`

> 例：`db.col.update({}, {$rename: {"age":"age1"}})`

## 4. Map-Reduce

​		Map-Reduce是一种计算模型，将大批量的工作（数据）分解（MAP）执行，然后再将结果合并成最终结果（REDUCE）

```javascript
db.collection.mapReduce(
   function() {emit(key,value);},  // map 函数
   function(key,values) {return reduceFunction},   // reduce 函数
   {
      out: collection,
      query: document,
      sort: document,
      limit: number
   }
)
```

> 使用 MapReduce 要实现两个函数： Map 函数和 Reduce 函数。
>
> Map 函数调用 emit(key, value), 遍历 collection 中所有的记录, 将 key 与 value 传递给 Reduce 函数进行处理。

**Map 函数必须调用 emit(key, value) 返回键值对。**

参数说明:

- **map** ：映射函数 (生成键值对序列,作为 reduce 函数参数)。
- **reduce** 统计函数，reduce函数的任务就是将key-values变成key-value，也就是把values数组变成一个单一的值value。
- **out** 统计结果存放集合 (不指定则使用临时集合,在客户端断开后自动删除)。
  - 可选参数：inline	`out: {inline: 1}`
  - 不会创建集合，整个操作都在内存里运行==（结果集单个文档大小<16MB）==
- **query** 一个筛选条件，只有满足条件的文档才会调用map函数。（query。limit，sort可以随意组合）
- **sort** 和limit结合的sort排序参数（也是在发往map函数前给文档排序），可以优化分组机制
- **limit** 发往map函数的文档数量的上限（要是没有limit，单独使用sort的用处不大）

> 例：将在 posts 集合中使用 mapReduce 函数来选取已发布的文章(status:"active")，并通过user_name分组，计算每个用户的文章数：
>
> ```javascript
> db.posts.mapReduce( 
>    function() { emit(this.user_name,1); }, 	// map
>    function(key, values) {return Array.sum(values)},  // Arraty：将数组或列表或多个值存储为一个键	reduce
>       {  
>          query:{status:"active"},  	// quert：筛选条件
>          out:"post_total" 			// out：结果存储集合
>       }
> ).find()
> ```

## 5. 全文检索

​		对每一个词建立一个索引，指明该词在文章中出现的次数和位置，当用户查询时，检索程序就根据事先建立的索引进行查找，并将查找的结果反馈给用户的检索方式。

1. **启动**

   2.6版本后默认开启，小于2.6版本启动命令:

   `db.adminCommand({setParameter:true,textSearchEnabled:true})` 

   &&

    `mongod --setParameter textSearchEnabled=true`

2. **创建**

   > 创建posts集合文档数据，包含文章内容（post_text）及标签(tags)：
   >
   > ```
   > {
   >    "post_text": "enjoy the mongodb articles on Runoob",
   >    "tags": [
   >       "mongodb",
   >       "runoob"
   >    ]
   > }
   > ```
   >
   > 

   对post_text字段建立全文索引：`db.posts.ensureIndex({post_text:"text"})`

3. 使用

   搜索文章中的关键词 runoob：`db.posts.find({$text:{$search:"runoob"}})`

   > 使用全文检索可以提高查询效率

4. 删除

   `db.posts.dropIndex("post_text_text")`

## 6. 正则表达式

**使用：$regex**

`db.posts.find({post_text:{$regex:"runoob"}})`

&&

`db.posts.find({post_text:/runoob/})`

不区分大小写：`db.posts.find({post_text:{$regex:"runoob",$options:"$i"}})`

**数组元素使用正则表达式**

> 例：查找run 开头的标签数据(ru 或 run 或 runoob)
>
> `db.posts.find({tags:{$regex:"run"}})`

### 6.1 优化

- 索引字段查询速度高于正则匹配

- 如果正则表达式是前缀表达式，所有匹配的数据将以指定的前缀字符串为开始

  > 例：^tut		匹配以tut为开头的字符串

- 正则表达式中使用变量。一定要使用eval将组合的字符串进行转换，不能直接将字符串拼接后传入给表达式。否则没有报错信息，只是结果为空！

  > 例：`name=eval("/" + 变量值key +"/i"); `
  >
  > 例：模糊查询包含title关键词, 且不区分大小写`title:eval("/"+title+"/i")`    
  >
  > - 同：`title:{$regex:title,$Option:"$i"}   `

## 7. GridFS

​		GridFS 用于存储和恢复那些超过16M（BSON文件限制）的文件(如：图片、音频、视频等)。也是文件存储的一种方式，但是它是存储在MonoDB的集合中。将大文件对象分割成多个小的chunk(文件片段),一般为256k/个,每个chunk将作为MongoDB的一个文档(document)被存储在chunks集合中。

- 用两个集合来存储一个文件

  **fs.files：**每个文件的实际内容被存在chunks(二进制数据)中

  **fs.chunks：**和文件有关的meta数据(filename,content_type,还有用户自定义的属性)将会被存在files集合中。

**GridFS添加文件**

> 例：添加mp3文件
>
> `mongofiles.exe -d gridfs put song.mp3`
>
> `-d gridfs`：指定存储文件的数据库名称，未指定会自动创建

查看数据库中文件的文档：`db.fs.files.find()`

根据 _id 获取区块(chunk)的数据：

`db.fs.chunks.find({files_id:ObjectId('534a811bf8b4aa4d33fdf94d')})`

## 8. 固定集合

​		固定长度，当集合空间用完后，再插入的元素就会覆盖最初始的头部的元素！可以插入及更新，但不能更新超出collection的大小，不允许删除，但是可以调用drop()删除集合中的所有行，drop后需要显式地重建集合。

- 对固定集合进行插入速度极快
- 按照插入顺序的查询输出速度极快
- 能够在插入最新数据时,淘汰最早的数据

**创建**

`db.createCollection("cappedLogCollection",{capped:true,size:10000})`

指定文档个数

`db.createCollection("cappedLogCollection",{capped:true,size:10000,max:1000})`

- **size(KB)：**整个集合空间的大小
- **max(个)：**文档数上限

判断集合是否为固定集合

`db.cappedLogCollection.isCapped()`

将已存在的集合转为固定集合

`db.runCommand({"convertToCapped":"posts", size:10000})`

> 将已存在的posts集合转为固定集合

**查询**

​		固定集合文档按照插入顺序储存的,默认情况下查询就是按照插入顺序返回的,也可以使用$natural调整返回顺序。

`db.cappedLogCollection.find().sort({$natural:-1})`

**用法：**存储日志信息、缓存一些少量的文档
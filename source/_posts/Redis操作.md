---
title: Redis操作
date: 2020-09-30 11:23:28
tags: NoSQL
top: 0
---

# 一、Redis概括

### 1  [Redis特点](https://handout-1300728887.cos.ap-beijing.myqcloud.com/%E8%AE%B2%E4%B9%89/%E9%BB%91%E9%A9%AC%E5%A4%B4%E6%9D%A1%E9%A1%B9%E7%9B%AE%E8%AF%BE%E4%BB%B6/C02-Database/Redis.html)

1. 速度快：C语言实现，存储在内存中以键值对形式保存
2. **持久化:**
   
   - redis可以将数据写入到磁盘中，在停机后，再次启动redis时，将磁盘中的备份数据加载到redis中
   
   - 两种机制：
     
     1. RDB快照持久化（默认开启）
        - 将内存中的数据存入磁盘
        - 缺点：一旦数据库出现问题，rdb文件数据不是全新的
        
        <!--more-->
     2. AOF追加文件持久化
        
        - 文件会变大，自动压缩
3. 多种数据结构：string  hash  list  set  zset
4. 支持多种编程语言
5. 支持事务、流水线、消息队列
6. [主从复制](https://handout-1300728887.cos.ap-beijing.myqcloud.com/%E8%AE%B2%E4%B9%89/redis%E8%AE%B2%E4%B9%89/redis%E8%AE%B2%E4%B9%89/redis/da-jian-zhu-cong.html)
7. 高可用、分布式

### 2  redis宕机

- slave从宕机

  - 重启后会自动加入到主从架构中，完成数据同步

- master主宕机（主从都没持久化）

  1. 不要立马重启服务
  2. slave执行`SLAVEOF ON ONE`断开主从关系并升级为主库
  3. 重启主，`SLAVEOF`设为从

  可使用简单方法：**哨兵**

### 3  redis高可用

**提供了主从同步＋哨兵机制（ Sentinel ）**

- 哨兵机制：实现故障转移，当检测到主服务器发生故障时，把从服务器升级为主，保证数据正常使用
  - 原理：心跳机制＋投票裁决＋故障转移
    - 定时给master/slave发送消息，若指定时间内无响应（主观宕机 SDOWN）
    - Sentinel群都报告某一master无响应（客观宕机 SDOWN）
    - 通过一定vote算法，将从升为主

### 4  为什么Redis比MySQL快

|            |     Redis      |          MySQL           |
| :--------: | :------------: | :----------------------: |
|  数据格式  |      k-v       |          B+TREE          |
| 时间复杂度 | 0(1)（常数阶） |    0(logn)（对数阶）     |
|  存储位置  | 从内存直接取出 | 磁盘表（全局扫或索引查） |

Redis是单线程的多路复用IO，单线程避免线程切换开销；多路复用避免IO等待开销；多核处理器下对数据进行分区，各处理器处理不同的数据（分着干）

# 二、Redis缓存

### 1  有效期TTL（Time to live）

- 作用：
  - 节省空间
  - 做到数据有效性，失效后，做到数据一致性

#### 1.1  过期策略

- 定时过期：时间一到立即清除，对内存友好，但会占用大量CPU资源
- 惰性过期：当访问时才去判断是否过期，节省CPU，占用内存
- 定期过期：每隔一段时间，随机清除

 **Redis中同时使用了惰性过期和定期过期两种过期策略。** 

#### 1.2  缓存淘汰 （eviction）

-  LRU（Least recently used，最近最少使用）
   -  新数据插入到表头部
   -  缓存命中时，将其移到头部
   -  缓存满的时候将尾部的数据丢掉
-  LFU（Least Frequently Used 最近最少使用算法）
   -  如果数据在一段时间内使用次数很少，那么将来也会很少

### 2  缓存模式

- **先更新数据库，再删除缓存** 

#### 2.1  缓存穿透

- 频繁请求缓存中不存在的数据，增大数据库压力

  - 解决方案：
    1. 返回缓存伪造数据
    2. 限制请求参数
    3. 借助第三方过滤器：布隆过滤器...

- 布隆过滤器

  本质上是一种**概率型数据结构， 由一个很长的bit数组和一系列哈希函数组成的 **

  特点：**高效地插入和查询**

  算法的核心： **某样东西一定不存在或者可能存在**

  缺点：**数据只能插入不能删除**

  - 存储原理：经过多次不同维度的hash计算，将数据映射到二进制向量里
  - 服务流程：
    1. 当用户访问时，去布隆过滤器中判断key值是否存在，否则直接返回
    2. 如果key值存在，则访问redis，由于存在误判率，redis中也可能不存在
    3. 再访问数据库，若也不存在，直接返回空

![](https://img-blog.csdnimg.cn/20190306043938625.?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0lUX3Rvd25sZXQ=,size_16,color_FFFFFF,t_70)

#### 2.2  缓存雪崩

- 同一时间内，大量缓存失效，造成数据库压力剧增
  - 解决方案：
    1. 设置不同的有效期值
    2. 采用多级缓存
    3. 利用加锁或者队列

# 三、Redis操作

## 1. 键操作

键的判断和操作方法

| 方法               | 作用                                         | 参数说明                   | 示例                             | 示例说明                     | 示例结果  |
| ------------------ | -------------------------------------------- | -------------------------- | -------------------------------- | ---------------------------- | --------- |
| exists(name)       | 判断一个键是否存在                           | name：键名                 | redis.exists('name')             | 是否存在name这个键           | True      |
| delete(name)       | 删除一个键                                   | name：键名                 | redis.delete('name')             | 删除name这个键               | 1         |
| type(name)         | 判断键类型                                   | name：键名                 | redis.type('name')               | 判断name这个键类型           | b'string' |
| keys(pattern)      | 获取所有符合规则的键                         | pattern：匹配规则          | redis.keys('n*')                 | 获取所有以n开头的键          | [b'name'] |
| randomkey()        | 获取随机的一个键                             |                            | randomkey()                      | 获取随机的一个键             | b'name'   |
| rename(src, dst)   | 重命名键                                     | src：原键名；dst：新键名   | redis.rename('name', 'nickname') | 将name重命名为nickname       | True      |
| dbsize()           | 获取当前数据库中键的数目                     |                            | dbsize()                         | 获取当前数据库中键的数目     | 100       |
| expire(name, time) | 设定键的过期时间，单位为秒                   | name：键名；time：秒数     | redis.expire('name', 2)          | 将name键的过期时间设置为2秒  | True      |
| ttl(name)          | 获取键的过期时间，单位为秒，-1表示永久不过期 | name：键名                 | redis.ttl('name')                | 获取name这个键的过期时间     | -1        |
| move(name, db)     | 将键移动到其他数据库                         | name：键名；db：数据库代号 | move('name', 2)                  | 将name移动到2号数据库        | True      |
| flushdb()          | 删除当前选择数据库中的所有键                 |                            | flushdb()                        | 删除当前选择数据库中的所有键 | True      |
| flushall()         | 删除所有数据库中的所有键                     |                            | flushall()                       | 删除所有数据库中的所有键     | True      |

## 2. 字符串操作

Redis支持最基本的键值对形式存储，用法总结如下表所示。

| 方法                          | 作用                                                         | 参数说明                                                     | 示例                                                         | 示例说明                                         | 示例结果                                    |
| ----------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------- |
| set(name, value)              | 给数据库中键为name的string赋予值value                        | name: 键名；value: 值                                        | redis.set('name', 'Bob')                                     | 给name这个键的value赋值为Bob                     | True                                        |
| get(name)                     | 返回数据库中键为name的string的value                          | name：键名                                                   | redis.get('name')                                            | 返回name这个键的value                            | b'Bob'                                      |
| getset(name, value)           | 给数据库中键为name的string赋予值value并返回上次的value       | name：键名；value：新值                                      | redis.getset('name', 'Mike')                                 | 赋值name为Mike并得到上次的value                  | b'Bob'                                      |
| mget(keys, *args)             | 返回多个键对应的value                                        | keys：键的列表                                               | redis.mget(['name', 'nickname'])                             | 返回name和nickname的value                        | [b'Mike', b'Miker']                         |
| setnx(name, value)            | 如果不存在这个键值对，则更新value，否则不变                  | name：键名                                                   | redis.setnx('newname', 'James')                              | 如果newname这个键不存在，则设置值为James         | 第一次运行结果是True，第二次运行结果是False |
| setex(name, time, value)      | 设置可以对应的值为string类型的value，并指定此键值对应的有效期 | name: 键名；time: 有效期； value：值                         | redis.setex('name', 1, 'James')                              | 将name这个键的值设为James，有效期为1秒           | True                                        |
| setrange(name, offset, value) | 设置指定键的value值的子字符串                                | name：键名；offset：偏移量；value：值                        | redis.set('name', 'Hello') redis.setrange('name', 6, 'World') | 设置name为Hello字符串，并在index为6的位置补World | 11，修改后的字符串长度                      |
| mset(mapping)                 | 批量赋值                                                     | mapping：字典                                                | redis.mset({'name1': 'Durant', 'name2': 'James'})            | 将name1设为Durant，name2设为James                | True                                        |
| msetnx(mapping)               | 键均不存在时才批量赋值                                       | mapping：字典                                                | redis.msetnx({'name3': 'Smith', 'name4': 'Curry'})           | 在name3和name4均不存在的情况下才设置二者值       | True                                        |
| incr(name, amount=1)          | 键为name的value增值操作，默认为1，键不存在则被创建并设为amount | name：键名；amount：增长的值                                 | redis.incr('age', 1)                                         | age对应的值增1，若不存在，则会创建并设置为1      | 1，即修改后的值                             |
| decr(name, amount=1)          | 键为name的value减值操作，默认为1，键不存在则被创建并将value设置为-amount | name：键名； amount：减少的值                                | redis.decr('age', 1)                                         | age对应的值减1，若不存在，则会创建并设置为-1     | -1，即修改后的值                            |
| append(key, value)            | 键为name的string的值附加value                                | key：键名                                                    | redis.append('nickname', 'OK')                               | 向键为nickname的值后追加OK                       | 13，即修改后的字符串长度                    |
| substr(name, start, end=-1)   | 返回键为name的string的子串                                   | name：键名；start：起始索引；end：终止索引，默认为-1，表示截取到末尾 | redis.substr('name', 1, 4)                                   | 返回键为name的值的字符串，截取索引为1~4的字符    | b'ello'                                     |
| getrange(key, start, end)     | 获取键的value值从start到end的子字符串                        | key：键名；start：起始索引；end：终止索引                    | redis.getrange('name', 1, 4)                                 | 返回键为name的值的字符串，截取索引为1~4的字符    | b'ello'                                     |

## 3. 列表操作

Redis还提供了列表存储，列表内的元素可以重复，而且可以从两端存储，用法如下表所示。

| 方法                     | 作用                                                         | 参数说明                                          | 示例                             | 示例说明                                                     | 示例结果           |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------- | -------------------------------- | ------------------------------------------------------------ | ------------------ |
| rpush(name, *values)     | 在键为name的列表末尾添加值为value的元素，可以传多个          | name：键名；values：值                            | redis.rpush('list', 1, 2, 3)     | 向键为list的列表尾添加1、2、3                                | 3，列表大小        |
| lpush(name, *values)     | 在键为name的列表头添加值为value的元素，可以传多个            | name：键名；values：值                            | redis.lpush('list', 0)           | 向键为list的列表头部添加0                                    | 4，列表大小        |
| llen(name)               | 返回键为name的列表的长度                                     | name：键名                                        | redis.llen('list')               | 返回键为list的列表的长度                                     | 4                  |
| lrange(name, start, end) | 返回键为name的列表中start至end之间的元素                     | name：键名；start：起始索引；end：终止索引        | redis.lrange('list', 1, 3)       | 返回起始索引为1终止索引为3的索引范围对应的列表               | [b'3', b'2', b'1'] |
| ltrim(name, start, end)  | 截取键为name的列表，保留索引为start到end的内容               | name：键名；start：起始索引；end：终止索引        | ltrim('list', 1, 3)              | 保留键为list的索引为1到3的元素                               | True               |
| lindex(name, index)      | 返回键为name的列表中index位置的元素                          | name：键名；index：索引                           | redis.lindex('list', 1)          | 返回键为list的列表索引为1的元素                              | b’2’               |
| lset(name, index, value) | 给键为name的列表中index位置的元素赋值，越界则报错            | name：键名；index：索引位置；value：值            | redis.lset('list', 1, 5)         | 将键为list的列表中索引为1的位置赋值为5                       | True               |
| lrem(name, count, value) | 删除count个键的列表中值为value的元素                         | name：键名；count：删除个数；value：值            | redis.lrem('list', 2, 3)         | 将键为list的列表删除两个3                                    | 1，即删除的个数    |
| lpop(name)               | 返回并删除键为name的列表中的首元素                           | name：键名                                        | redis.lpop('list')               | 返回并删除名为list的列表中的第一个元素                       | b'5'               |
| rpop(name)               | 返回并删除键为name的列表中的尾元素                           | name：键名                                        | redis.rpop('list')               | 返回并删除名为list的列表中的最后一个元素                     | b'2'               |
| blpop(keys, timeout=0)   | 返回并删除名称在keys中的list中的首个元素，如果列表为空，则会一直阻塞等待 | keys：键列表；timeout： 超时等待时间，0为一直等待 | redis.blpop('list')              | 返回并删除键为list的列表中的第一个元素                       | [b'5']             |
| brpop(keys, timeout=0)   | 返回并删除键为name的列表中的尾元素，如果list为空，则会一直阻塞等待 | keys：键列表；timeout：超时等待时间，0为一直等待  | redis.brpop('list')              | 返回并删除名为list的列表中的最后一个元素                     | [b'2']             |
| rpoplpush(src, dst)      | 返回并删除名称为src的列表的尾元素，并将该元素添加到名称为dst的列表头部 | src：源列表的键；dst：目标列表的key               | redis.rpoplpush('list', 'list2') | 将键为list的列表尾元素删除并将其添加到键为list2的列表头部，然后返回 | b'2'               |

## 4. 集合操作

Redis还提供了集合存储，集合中的元素都是不重复的，用法如下表所示。

| 方法                           | 作用                                                 | 参数说明                                  | 示例                                           | 示例说明                                                    | 示例结果                     |
| ------------------------------ | ---------------------------------------------------- | ----------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------- | ---------------------------- |
| sadd(name, *values)            | 向键为name的集合中添加元素                           | name：键名；values：值，可为多个          | redis.sadd('tags', 'Book', 'Tea', 'Coffee')    | 向键为tags的集合中添加Book、Tea和Coffee这3个内容            | 3，即插入的数据个数          |
| srem(name, *values)            | 从键为name的集合中删除元素                           | name：键名；values：值，可为多个          | redis.srem('tags', 'Book')                     | 从键为tags的集合中删除Book                                  | 1，即删除的数据个数          |
| spop(name)                     | 随机返回并删除键为name的集合中的一个元素             | name：键名                                | redis.spop('tags')                             | 从键为tags的集合中随机删除并返回该元素                      | b'Tea'                       |
| smove(src, dst, value)         | 从src对应的集合中移除元素并将其添加到dst对应的集合中 | src：源集合；dst：目标集合；value：元素值 | redis.smove('tags', 'tags2', 'Coffee')         | 从键为tags的集合中删除元素Coffee并将其添加到键为tags2的集合 | True                         |
| scard(name)                    | 返回键为name的集合的元素个数                         | name：键名                                | redis.scard('tags')                            | 获取键为tags的集合中的元素个数                              | 3                            |
| sismember(name, value)         | 测试member是否是键为name的集合的元素                 | name：键值                                | redis.sismember('tags', 'Book')                | 判断Book是否是键为tags的集合元素                            | True                         |
| sinter(keys, *args)            | 返回所有给定键的集合的交集                           | keys：键列表                              | redis.sinter(['tags', 'tags2'])                | 返回键为tags的集合和键为tags2的集合的交集                   | {b'Coffee'}                  |
| sinterstore(dest, keys, *args) | 求交集并将交集保存到dest的集合                       | dest：结果集合；keys：键列表              | redis.sinterstore('inttag', ['tags', 'tags2']) | 求键为tags的集合和键为tags2的集合的交集并将其保存为inttag   | 1                            |
| sunion(keys, *args)            | 返回所有给定键的集合的并集                           | keys：键列表                              | redis.sunion(['tags', 'tags2'])                | 返回键为tags的集合和键为tags2的集合的并集                   | {b'Coffee', b'Book', b'Pen'} |
| sunionstore(dest, keys, *args) | 求并集并将并集保存到dest的集合                       | dest：结果集合；keys：键列表              | redis.sunionstore('inttag', ['tags', 'tags2']) | 求键为tags的集合和键为tags2的集合的并集并将其保存为inttag   | 3                            |
| sdiff(keys, *args)             | 返回所有给定键的集合的差集                           | keys：键列表                              | redis.sdiff(['tags', 'tags2'])                 | 返回键为tags的集合和键为tags2的集合的差集                   | {b'Book', b'Pen'}            |
| sdiffstore(dest, keys, *args)  | 求差集并将差集保存到dest集合                         | dest：结果集合；keys：键列表              | redis.sdiffstore('inttag', ['tags', 'tags2'])  | 求键为tags的集合和键为tags2的集合的差集并将其保存为inttag`  | 3                            |
| smembers(name)                 | 返回键为name的集合的所有元素                         | name：键名                                | redis.smembers('tags')                         | 返回键为tags的集合的所有元素                                | {b'Pen', b'Book', b'Coffee'} |
| srandmember(name)              | 随机返回键为name的集合中的一个元素，但不删除元素     | name：键值                                | redis.srandmember('tags')                      | 随机返回键为tags的集合中的一个元素                          |                              |

## 5. 有序集合操作

有序集合比集合多了一个分数字段，利用它可以对集合中的数据进行排序，其用法总结如下表所示。

| 方法                                                         | 作用                                                         | 参数说明                                                     | 示例                                        | 示例说明                                                     | 示例结果                            |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------ | ----------------------------------- |
| zadd(name, *args, **kwargs)                                  | 向键为name的zset中添加元素member，score用于排序。如果该元素存在，则更新其顺序 | name： 键名；args：可变参数                                  | redis.zadd('grade', 100, 'Bob', 98, 'Mike') | 向键为grade的zset中添加Bob（其score为100），并添加Mike（其score为98） | 2，即添加的元素个数                 |
| zrem(name, *values)                                          | 删除键为name的zset中的元素                                   | name：键名；values：元素                                     | redis.zrem('grade', 'Mike')                 | 从键为grade的zset中删除Mike                                  | 1，即删除的元素个数                 |
| zincrby(name, value, amount=1)                               | 如果在键为name的zset中已经存在元素value，则将该元素的score增加amount；否则向该集合中添加该元素，其score的值为amount | name：key名；value：元素；amount：增长的score值              | redis.zincrby('grade', 'Bob', -2)           | 键为grade的zset中Bob的score减2                               | 98.0，即修改后的值                  |
| zrank(name, value)                                           | 返回键为name的zset中元素的排名，按score从小到大排序，即名次  | name：键名；value：元素值                                    | redis.zrank('grade', 'Amy')                 | 得到键为grade的zset中Amy的排名                               | 1                                   |
| zrevrank(name, value)                                        | 返回键为name的zset中元素的倒数排名（按score从大到小排序），即名次 | name：键名；value：元素值                                    | redis.zrevrank('grade', 'Amy')              | 得到键为grade的zset中Amy的倒数排名                           | 2                                   |
| zrevrange(name, start, end, withscores=False)                | 返回键为name的zset（按score从大到小排序）中index从start到end的所有元素 | name：键值；start：开始索引；end：结束索引；withscores：是否带score | redis.zrevrange('grade', 0, 3)              | 返回键为grade的zset中前四名元素                              | [b'Bob', b'Mike', b'Amy', b'James'] |
| zrangebyscore(name, min, max, start=None, num=None, withscores=False) | 返回键为name的zset中score在给定区间的元素                    | name：键名；min：最低score；max：最高score； start：起始索引；num：个数；withscores：是否带score | redis.zrangebyscore('grade', 80, 95)        | 返回键为grade的zset中score在80和95之间的元素                 | [b'Bob', b'Mike', b'Amy', b'James'] |
| zcount(name, min, max)                                       | 返回键为name的zset中score在给定区间的数量                    | name：键名；min：最低score；max：最高score                   | redis.zcount('grade', 80, 95)               | 返回键为grade的zset中score在80到95的元素个数                 | 2                                   |
| zcard(name)                                                  | 返回键为name的zset的元素个数                                 | name：键名                                                   | redis.zcard('grade')                        | 获取键为grade的zset中元素的个数                              | 3                                   |
| zremrangebyrank(name, min, max)                              | 删除键为name的zset中排名在给定区间的元素                     | name：键名；min：最低位次；max：最高位次                     | redis.zremrangebyrank('grade', 0, 0)        | 删除键为grade的zset中排名第一的元素                          | 1，即删除的元素个数                 |
| zremrangebyscore(name, min, max)                             | 删除键为name的zset中score在给定区间的元素                    | name：键名；min：最低score；max：最高score                   | redis.zremrangebyscore('grade', 80, 90)     | 删除score在80到90之间的元素                                  | 1，即删除的元素个数                 |

## 6. 散列操作

Redis还提供了散列表的数据结构，我们可以用`name`指定一个散列表的名称，表内存储了各个键值对，用法总结如下表所示。

| 方法                         | 作用                                               | 参数说明                                   | 示例                                           | 示例说明                                       | 示例结果                                                     |
| ---------------------------- | -------------------------------------------------- | ------------------------------------------ | ---------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| hset(name, key, value)       | 向键为name的散列表中添加映射                       | name：键名；key：映射键名；value：映射键值 | hset('price', 'cake', 5)                       | 向键为price的散列表中添加映射关系，cake的值为5 | 1，即添加的映射个数                                          |
| hsetnx(name, key, value)     | 如果映射键名不存在，则向键为name的散列表中添加映射 | name：键名；key：映射键名；value：映射键值 | hsetnx('price', 'book', 6)                     | 向键为price的散列表中添加映射关系，book的值为6 | 1，即添加的映射个数                                          |
| hget(name, key)              | 返回键为name的散列表中key对应的值                  | name：键名；key：映射键名                  | redis.hget('price', 'cake')                    | 获取键为price的散列表中键名为cake的值          | 5                                                            |
| hmget(name, keys, *args)     | 返回键为name的散列表中各个键对应的值               | name：键名；keys：映射键名列表             | redis.hmget('price', ['apple', 'orange'])      | 获取键为price的散列表中apple和orange的值       | [b'3', b'7']                                                 |
| hmset(name, mapping)         | 向键为name的散列表中批量添加映射                   | name：键名；mapping：映射字典              | redis.hmset('price', {'banana': 2, 'pear': 6}) | 向键为price的散列表中批量添加映射              | True                                                         |
| hincrby(name, key, amount=1) | 将键为name的散列表中映射的值增加amount             | name：键名；key：映射键名；amount：增长量  | redis.hincrby('price', 'apple', 3)             | key为price的散列表中apple的值增加3             | 6，修改后的值                                                |
| hexists(name, key)           | 键为name的散列表中是否存在键名为键的映射           | name：键名；key：映射键名                  | redis.hexists('price', 'banana')               | 键为price的散列表中banana的值是否存在          | True                                                         |
| hdel(name, *keys)            | 在键为name的散列表中，删除键名为键的映射           | name：键名；keys：映射键名                 | redis.hdel('price', 'banana')                  | 从键为price的散列表中删除键名为banana的映射    | True                                                         |
| hlen(name)                   | 从键为name的散列表中获取映射个数                   | name： 键名                                | redis.hlen('price')                            | 从键为price的散列表中获取映射个数              | 6                                                            |
| hkeys(name)                  | 从键为name的散列表中获取所有映射键名               | name：键名                                 | redis.hkeys('price')                           | 从键为price的散列表中获取所有映射键名          | [b'cake', b'book', b'banana', b'pear']                       |
| hvals(name)                  | 从键为name的散列表中获取所有映射键值               | name：键名                                 | redis.hvals('price')                           | 从键为price的散列表中获取所有映射键值          | [b'5', b'6', b'2', b'6']                                     |
| hgetall(name)                | 从键为name的散列表中获取所有映射键值对             | name：键名                                 | redis.hgetall('price')                         | 从键为price的散列表中获取所有映射键值对        | {b'cake': b'5', b'book': b'6', b'orange': b'7', b'pear': b'6'} |

> 具体操作参考官方文档：
>
> 1. http://doc.redisfans.com/
> 2. http://redis.cn/
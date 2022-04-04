---
title: Kafka基础及使用
date: 2020-11-10 18:02:44
tags: Python
top: 0
---

# Kafka介绍

**Kafka是一个分布式流处理平台**

流处理平台三大特性：

1. 可以让你发布和订阅流式的记录。这一方面与消息队列或者企业消息系统类似。
2. 可以储存流式的记录，并且有较好的容错性。
3. 可以在流式记录产生时就进行处理。

<!--more-->

Kafka的适用场景：

1. 构造实时流数据管道，它可以在系统或应用之间可靠地获取数据。 (相当于message queue)
2. 构建实时流式应用程序，对这些流数据进行转换或者影响。 (就是流处理，通过kafka stream topic和topic之间内部进行变化)

概念：

- Kafka作为一个集群，运行在一台或者多台服务器上.
- Kafka 通过 *topic* 对存储的流数据进行分类。
- 每条记录中包含一个key，一个value和一个timestamp（时间戳）。

四个核心的API：

- The [Producer API](https://kafka.apachecn.org/documentation.html#producerapi) 允许一个应用程序发布一串流式的数据到一个或者多个Kafka topic。
- The [Consumer API](https://kafka.apachecn.org/documentation.html#consumerapi) 允许一个应用程序订阅一个或多个 topic ，并且对发布给他们的流式数据进行处理。
- The [Streams API](https://kafka.apachecn.org/documentation/streams) 允许一个应用程序作为一个*流处理器*，消费一个或者多个topic产生的输入流，然后生产一个输出流到一个或多个topic中去，在输入输出流中进行有效的转换。
- The [Connector API](https://kafka.apachecn.org/documentation.html#connect) 允许构建并运行可重用的生产者或者消费者，将Kafka topics连接到已存在的应用程序或者数据系统。比如，连接到一个关系型数据库，捕捉表（table）的所有变更内容。

> Kafka官方文档：
>
> https://kafka.apachecn.org/documentation.html

# Kafka命令行操作

## Topic

1. 查看当前服务器中的所有topic

   `bin/kafka-topics.sh --zookeeper 127.0.0.1:2181 --list`

2. 创建topic

   `bin/kafka-topics.sh --zookeeper 127.0.0.1:2181 --create --replication-factor 3 --partitions 1 --topic test`

   - topic 定义topic名
- replication-factor 定义副本数
   - partitions 定义分区数
   
3. 删除topic

   `bin/kafka-topics.sh --zookeeper 127.0.0.1:2181 --delete --topic test`

4. 查看某个Topic的详情

   `bin/kafka-topics.sh --zookeeper 127.0.0.1:2181 --describe --topic test`

## 消费者

1. 消费消息

   `bin/kafka-console-consumer.sh --bootstrap-server 127.0.0.1:9092 --from-beginning --topic test`

   - from-beginning：会把first主题中以往所有的数据都读取出来。根据业务场景选择是否增加该配置。
   - bootstrap-server：生产消息的服务器

2. 查看消费组

   `bin/kafka-consumer-groups.sh --bootstrap-server 127.0.0.1:9092 --list`

3. 查看某个消费组的详情

   `bin/kafka-consumer-groups.sh --bootstrap-server 127.0.0.1:9092  --group test-consumer-group --describe`

   - 查看组名为test-consumer-group的消费组的情况。

## 生产者

1. 发送消息

   `bin/kafka-console-producer.sh --broker-list 127.0.0.1:9092 --topic test`
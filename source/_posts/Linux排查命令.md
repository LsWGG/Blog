---
title: Linux排查命令
date: 2021-02-23 11:28:31
tags: Linux
top: 0
---

# ES相关

_cat命令是系统信息查询相关的，下面分成好几个子命令分类。
curl -XGET http://ip/port

1. 查看ES节点是否正常：curl http://ip:port
2. 查看集群健康状态：curl http://ip:port/_cat/health?v
3. 查看全部索引：curl http://ip:port/_cat/indices?v
4. 查看索引详情：curl -GET http://ip:port/index_name/_settings?pretty
5. 查看索引大小及状态等：curl -XGET http://ip:port/_cat/indices
6. 查看索引冷热状态（true表示冷；false表示热）：curl 'http://ip:port/_cat/indices/*?v&h=index,sth&format=json'?
<!--more-->
7. 创建索引：curl -X PUT http://ip:port/my_new_index
8. 删除索引：curl -X DELETE http://ip:port/index_name
9. 插入数据：curl -X PUT http://127.0.0.1:9200/my_new_index/user/1?pretty -d  '{"name":"张三","age":"23"}'
10. 更新数据
```bash
curl -X POST http://127.0.0.1:9200/index_name/_doc/doc_id/_update -d 
'{
  "script": {
    "source": "ctx._source.字段名称= params.字段名称",
    "params": {
      "字段名称": "值"
    }
  }
}'
```
11. 批量更新数据
```bash
curl -X POST http://127.0.0.1:9200/index_name/_doc/doc_id/_update_by_query -d 
'{
  "script": {
    "source": "ctx._source.字段名称= params.字段名称",
    "params": {
      "字段名称": "值"
    },
    "query":{...}
  }
}'
```
12. 仅查询热索引：curl http://ip:port/index_name/_search -d 'dsl_sql'
13. 冷热索引都查：curl http://ip:port/index_name/_search?ignore_throttled -d 'dsl_sql'
14. 查询所有条数：curl http://ip:port/index_name/_search -d '{"track_total_hits":"true"}'


> 各版本命令稍有不同，实际以ES版本为准，详见官方文档（以7.4为例）：
> https://www.elastic.co/guide/en/elasticsearch/reference/7.14/rest-apis.html

# Kafka相关

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
   

# 网络相关

## SSH
1. 查看ssh服务是否正常开启：systemctl status sshd
2. 重启ssh服务：systemctl status sshd
3. 查看ssh开放端口：netstat -tnlp |grep ssh

## 网卡
1. 重启网卡：systemctl restart network
2. 查看本机网关：route -n
3. 查看DNS：cat /etc/resolv.conf

## 进程、端口
1. 对外开放tcp端口：iptables -I INPUT -p tcp --dport port -j ACCEPT
2. 查看防火墙开放的端口：firewall-cmd --zone=public --list-ports
3. 关闭防火墙：systemctl stop firewalld.service
4. 查看防火墙状态： firewall-cmd --state
5. 查看监听的端口：netstat -lnpt

## TCP/IP抓包

`tcpdump`命令是一款sniffer工具，是linux上的抓包工具，嗅探器；它可以打印出所有经过网络接口的数据包的头信息。

### 命令格式

```bash
tcpdump [ -DenNqvX ] [ -c count ] [ -F file ] [ -i interface ] [ -r file ]
        [ -s snaplen ] [ -w file ] [ expression ]
```

### 命令参数：

| -a                 | 尝试将网络和广播地址转换成名称                               |
| ------------------ | ------------------------------------------------------------ |
| -c<数据包数目>     | 收到指定的数据包数目后，就停止进行倾倒操作                   |
| -d                 | 把编译过的数据包编码转换成可阅读的格式，并倾倒到标准输出     |
| -dd                | 把编译过的数据包编码转换成C语言的格式，并倾倒到标准输出      |
| -ddd               | 把编译过的数据包编码转换成十进制数字的格式，并倾倒到标准输出 |
| -e                 | 输出的每行中都将包括数据链路层头部信息，例如源MAC和目标MAC。 |
| -f                 | 用数字显示网际网络地址                                       |
| -F<表达文件>       | 指定内含表达方式的文件                                       |
| -i                 | 指定tcpdump需要监听的接口。默认会抓取第一个网络接口          |
| -l                 | 使用标准输出列的缓冲区                                       |
| -n                 | 对地址以数字方式显式，否则显式为主机名                       |
| **-nn**            | **除了-n的作用外，还把端口显示为数值，否则显示端口服务名。** |
| -N                 | 不列出域名                                                   |
| -O                 | 不将数据包编码最佳化                                         |
| -p                 | 不让网络界面进入混杂模式                                     |
| -q                 | 快速输出，仅列出少数的传输协议信息                           |
| -r<数据包文件>     | 从指定的文件读取数据包数据                                   |
| -s len             | 设置数据包抓取长度为len，如果不设置默认将会是65535字节       |
| -S                 | 用绝对而非相对数值列出TCP关联数                              |
| -t                 | 在每列倾倒资料上不显示时间戳记                               |
| -tt                | 在每列倾倒资料上显示未经格式化的时间戳记                     |
| -T<数据包类型>     | 强制将表达方式所指定的数据包转译成设置的数据包类型           |
| -v                 | 详细显示指令执行过程                                         |
| -vv                | 更详细显示指令执行过程                                       |
| -x                 | 用十六进制字码列出数据包资料                                 |
| **-w<数据包文件>** | **把数据包数据写入指定的文件**                               |

### expression表达式

- 类型 type

  host、net、port、portrange

  例如：host 192.168.201.128 , net 128.3, port 20, portrange 6000-6008

- 目标 dir

  源-src、目的-dst

- 协议 proto

  tcp、udp、icmp

  为给定协议类型，则匹配所有可能的类型

### 示例

1. 监视指定主机的数据包

   tcpdump -i ens33 host node1

2. 抓取到本机22端口包

   tcpdump -c 10 -nn -i ens33 tcp dst port 22

3. 抓取指定主机端口数据到文件

   tcpdump -i any -nn host 172.24.128.5 and port 19091 -s 0 -w cap.cap

> 详见：
>
> https://www.linuxcool.com/tcpdump
>
> https://www.jianshu.com/p/d9162722f189

# 硬件相关

1. 查看物理CPU个数

    `cat /proc/cpuinfo| grep "physical id"| sort| uniq| wc -l`

2. 查看硬盘：df -h
3. 查看内存：free -g

# Python相关

1. 编译pyc:python -m py_compile test.py
2. 批量编译pyc:python -m compileall C:\Users\abc\Desktop\release_project
3. 快速启动web服务:python -m SimpleHTTPServer
4. 安装pip命令:curl https://bootstrap.pypa.io/pip/2.7/get-pip.py -o get-pip.py
5. 下载pip包到指定目录:pip download xxx -d ./temp

# 安全日志

1. 成功登录用户：/var/log/wtmp
2. 尝试登录信息：/var/log/btmp
3. 显示最近登录信息：/var/log/lastlog

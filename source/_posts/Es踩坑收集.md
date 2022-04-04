---
title: Es踩坑收集
date: 2021-12-28 17:15:38
tags: ES
top: 0
---

# ES踩坑收集

​		收集工作过程中遇到的ES相关问题及解决方案。

<!--more-->

## 查询相关

### data too large

现象：

![image-20211228172119853](/Users/shunli/Library/Application Support/typora-user-images/image-20211228172119853.png)

原因：

`field data`的缓存区不够用，太频繁的查询、太大的DSL语句、查询时间范围太大

>  ES缓冲区概述：
>
> 首先简单描述一下ES的缓存机制。ES在查询时，会将索引数据缓存在内存（JVM）中： 
>
> 驱逐线 和 断路器。当缓存数据到达驱逐线时，会自动驱逐掉部分数据，把缓存保持在安全的范围内。当用户准备执行某个查询操作时，断路器就起作用了，缓存数据+当前查询需要缓存的数据量到达断路器限制时，会返回Data too large错误，阻止用户进行这个查询操作。ES把缓存数据分成两类，FieldData和其他数据，我们接下来详细看FieldData，它是造成我们这次异常的“元凶”。
>
> ES配置中提到的FieldData指的是字段数据。当排序（sort），统计（aggs）时，ES把涉及到的字段数据全部读取到内存（JVM Heap）中进行操作。相当于进行了数据缓存，提升查询效率。
>
> 
>
> 关于FieldData的配置在elasticsearch.yml中，也可以通过调用setting接口来修改。API文档里的介绍如下：
>
> **indices.fielddata.cache.size**：配置fieldData的Cache大小，可以配百分比也可以配一个准确的数值。cache到达约定的内存大小时会自动清理，驱逐一部分FieldData数据以便容纳新数据。默认值为unbounded无限。 
>
> **indices.fielddata.cache.expire**：  用于约定多久没有访问到的数据会被驱逐，默认值为-1，即无限。expire配置不推荐使用，按时间驱逐数据会大量消耗性能。而且这个设置在不久之后的版本中将会废弃。
> 看来，Data too large异常就是由于fielddata.cache的默认值为unbounded导致的了。
>
> 
>
> `断路器`
>
> fieldData的缓存配置中，fielddata的大小是在数据被加载之后才校验的。假如下一个查询准备加载进来的fieldData让缓存区超过可用堆大小会发生什么？很遗憾的是，它将产生一个OOM异常。
>
> 断路器就是用来控制cache加载的，它预估当前查询申请使用内存的量，并加以限制。断路器的配置如下：
>
> **indices.breaker.fielddata.limit** 
> 这个 fielddata 断路器限制fielddata的大小，默认情况下为堆大小的60%。
>
> **indices.breaker.request.limit** 
> 这个 request 断路器估算完成查询的其他部分要求的结构的大小， 默认情况下限制它们到堆大小的40%。
>
> **indices.breaker.total.limit** 
> 这个 total 断路器封装了 request 和 fielddata 断路器去确保默认情况下这2个部分使用的总内存不超过堆大小的70%。
>
> 当缓存区大小到达断路器所配置的大小时会发生什么事呢？
>
> 答案是：会返回开头我们说的Data too large异常。这个设定是希望引起用户对ES服务的反思，我们的配置有问题吗？是不是查询语句的形式不对，一条查询语句需要使用这么多缓存吗？

解决方案：

1. 设置相应FieldData配置项（线上环境不建议）
2. 优化查询DSL语句，分批查询；减少查询时间范围；增加前置过滤条件


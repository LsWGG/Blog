---
title: Python多任务编程
date: 2020-09-30 11:29:59
tags: Python
top: 0
---

# Python多任务编程

## CPU密集型和I/O密集型

### CPU密集型（CPU- bound）

​		CPU密集型：指在程序运行过程中，大部分时间用于CPU计算和处理，特点是CPU占用率高；

​		🌰：压缩解压缩、加解密算法、正则搜索等；

### I/O密集型（I/O- bound）

​		I/O密集型：指在程序运行过程中，大部分时间用于I/O（硬盘/内存）的读写操作，而CPU占用率比较低；

​		🌰：文件处理、网络爬虫、读写数据库等；



## 进程、线程、协程

### 三者的关系

![](/Users/shunli/Documents/Home/BLOG/source/xmind/进程、线程、协程.png)

### 进程

### 线程

#### GIL

​		全局解释器锁，是计算机程序设计语言解释器用于同步线程的一种机制，Python设计初期，为了避免并发问题引入了GIL，它使得任何时刻只有一个线程在执行，即便在多核处理器上；

#### 基本应用

```python
#!/usr/bin/env python3
import time
import requests
import threading

urls = [
    f"https://elasticsearch.cn/category-2__day-0__is_recommend-0__page-{page}"
    for page in range(0, 5 + 1)
]


def craw(url):
    r = requests.get(url)
    return len(r.text)


def single_thread():
    for url in urls:
        print(craw(url))


def multi_thread():
    threads = list()

    for url in urls:
        threads.append(threading.Thread(target=craw, args=(url,)))

    for t in threads:
        t.start()

    for t in threads:
        t.join()


if __name__ == '__main__':
    s_time = time.time()
    single_thread()
    e_time = time.time()
    # 1.6100640296936035
    print(e_time - s_time)

    s_time = time.time()
    multi_thread()
    e_time = time.time()
    # 0.3724527359008789
    print(e_time - s_time)

```

#### 线程池

​		新建线程需要系统需要分配资源，销毁线程系统需要回收资源。线程池通过任务队列和可重复利用的线程来达到减去分配，回收资源开销的目的；

使用线程池的好处：

1. 提升性能：减少了创建和回收资源的开销，重用了线程资源
2. 使用场景：适合处理突发性大量请求或需要大量线程完成任务、但实际任务处理时间较短
3. 防御功能：有效避免系统因为创建线程过多，而导致系统负荷过大相应变慢等问题
4. 代码优势：使用线程池的语法比自己新建线程更简洁

```python
#!/usr/bin/env python3
import concurrent.futures

from es_spider import craw, urls

# 方法一，多次参数一次性传入 map
with concurrent.futures.ThreadPoolExecutor() as pool:
    htmls = pool.map(craw, urls)
    for html in htmls:
        for url, title in html:
            print(url, title)


# 方法二，多次参数分批传入 submit
with concurrent.futures.ThreadPoolExecutor() as pool:
    futures = dict()
    for url in urls:
        future = pool.submit(craw, url)
        futures[future] = url
        for u, title in future.result():
            print(url, u, title)

    # as_completed，优先返回已结束线程数据
    for future in concurrent.futures.as_completed(futures):
        url = futures[future]
        print(url, future)

```

### 协程


## Q&F

### 1  消息队列的理解

**消息队列**：保存消息的容器

消息:传输的数据单位

消息源与目标间的中间人，主要目的是**提供路由保证消息的传递**，

### 2  为什么使用消息队列

在高并发情况下，来不及同步处理，请求会发生堵塞。通过消息队列，可以异步处理请求，缓解系统压力

应用场景：

- 异步处理、应用解耦、流量削锋和消息通讯等  

**使用消息队列，把不是必须的业务逻辑，异步处理**

消息队列的缺点：

- 系统可用性降低
- 系统复杂性提高
- 一致性问题

### 3  多线程在web中的使用

一般在使用IO操作时

使用场景：

- 需要并行操作几个文件的读写，同步不能异步的情况下
- 视图中需要多个第三方接口
- 订单提交后，修改库存销量

### 4  为什么使用celery而不使用线程发送耗时任务

因为并发量较大的时候，线程切换会有开销时间，也会降低并发的数量、共享数据维护麻烦

celery是通过消息队列进行异步任务处理，不用担心并发量高是负载过大，也可以处理复杂系统性能问题，相对灵活

### 5 什么是乐观锁

每次拿数据的时候都认为别人不会修改，所以不会上锁

在更新的时候判断此时的库存是否是之前查询出的库存，如果相同，表示没人修改，可以更新库存，否则表示别人抢过资源，不再执行库存更新

**实现方式：**利用时间戳、数据版本version字段，数据被修改＋1

使用场景：高并发，减少数据冲突，保证数据一致性

### 6 高并发与分布式的应用场景

处理网站并发量

1. 减少数据库访问次数
2. 文件和数据库分离（静态化页面）
3. 大数据分布式存储（主从配置读写分离）
4. 服务器集群，负载均衡
5. 页面缓存的使用
6. 内存数据库代替关系型数据库

例子：省市区三级联动、首页部分数据（广告）局部缓存

分布式案例

1. MySQL主从配置读写分离

### 7  处理抢购高并发

1. 将请求尽量拦截在上游
2. 充分利用缓存

前端方面：

- 把详情页部署到CDN节点上，做页面静态化处理
  - CDN：内容分发网络，将源站内容分发到离用户最近的节点，提高访问速度
- 禁止重复提交请求、对用户请求限流

后端方面：

- 根据用户id限制访问频率
- 缓存的应用

### 8  如何解决celery队列阻塞问题

- 队列阻塞的原因：

  1. 队列中有耗时任务，且任务量大于celery并发数（Celery没有足够的worker去执行耗时任务）
  2. 队列中有耗时任务，且Celery启动了**预取机制**
     - 任务会有指定的worker去执行，就算其worker是空闲状态，也不会执行其它任务

- 解决：

  - **指定进程数**

    `celery -A project worker --concurrency=4`

  - **改变进程池方式为协程方式**

    `pip install eventlet `

    `celery -A project worker -P eventlet -c 1000`

  - **增加并发数**

  `celery -A project worker -n 进程名字 --concurrencu=并发数 -l info`

  - **取消预取机制**

    ```python
    # 任务发送完成时是否需要确认，对性能会稍有影响
    celery_app.conf.CELERY_LATE = True
    # Celery worker每次去队列取任务的数量，默认值为4
    celery_app.conf.CELERY_PREFETCH_MULTIPLIER = 1
    ```

    `celery -A project worker -n 进程名字 -Ofair -l info`

  - **错误重试机制**

    ```python
    # 重连时间间隔
    @celery_app.task(bind=True, retry_backoff=3)
    try:
        ...
    except Exception as e:
        # 有异常自动重连三次
        raise self.retry(exc=e, max_retries=3)
    ```

### 9  进程和线程的对比

[参考文档](https://handout-1300728887.cos.ap-beijing.myqcloud.com/%E8%AE%B2%E4%B9%89/python-web%E5%9F%BA%E7%A1%80(5.1.2%E7%89%88%E6%9C%AC)/multitasking/%E8%BF%9B%E7%A8%8B%E5%92%8C%E7%BA%BF%E7%A8%8B%E5%AF%B9%E6%AF%94.html)

进程：CPU的一种执行单元

- 密集CPU任务（大量并行计算）

线程：进程执行程序的最小调度单位

- 密集I/O任务

协程：微线程，可以在单线程上执行多个任务，用函数切换，开销极小

关系对比

1. 线程是依附在进程里面的，没有进程就没有线程
2. 一个进程默认提供一条线程，进程可以创建多个线程

区别对比

1. 进程之间不共享全局变量
2. 线程之间共享全局变量，但是要注意资源竞争的问题，解决办法: 互斥锁或者线程同步
3. 创建进程的资源开销要比创建线程的资源开销要大
4. 进程是操作系统资源分配的基本单位，线程是CPU调度的基本单位
5. 线程不能够独立执行，必须依存在进程中
6. 多进程开发比单进程多线程开发稳定性要强

优缺点

- 进程优缺点:
  - 优点：可以用多核
  - 缺点：资源开销大
- 线程优缺点:
  - 优点：资源开销小
  - 缺点：不能使用多核做到高并行

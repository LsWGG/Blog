---
title: Flask和Django
date: 2020-09-30 11:21:03
tags: Web
top: 0
---

# Flask和Django

- **轻量、简洁、扩展性强，原生不支持数据库**
- 核心：werkzeug和jinja2

<!--more-->
## 1. Flask与Django对比

- 与Django对比
  - 不同点：
    1. Django：支持 ORM、认证、CSRF/模板、后台管理等。 
    2. Flask：自带jinja2模板，实现其它功能需要调用扩展包
  - 相同点：
    1.  性能都不⾼，都是单进程服务器。 

## 2. MVT设计模式

设计模式：解决一类问题而总结出来的经验和套路

**MVC：**核心思想：分工、解耦，让不同代码之间降低耦合，增强代码的可扩展性和可移植性

**MVT：**

- M：模型 Model
- V：视图 View
- T：模板 Template

## 3. Django信号

**Django 提供一个“信号分发器”，允许解耦的应用在框架的其它地方发生操作时会被通知到。信号允许特定的sender（发送者）通知一组receiver（接收者）某些操作已经发生。**

信号遵守的设计模式：**观察者设计模式（通知机制、监听机制）**

- [使用](https://handout-1300728887.cos.ap-beijing.myqcloud.com/%E8%AE%B2%E4%B9%89/%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE/Django%E4%BF%A1%E5%8F%B7.jpg)

## 4. Django项目中的社会化分享

结合项目中使用：

- MobTech平台创建应用：https://www.mob.com/

  1. 注册登录
  2. 产品中心 --> 开发者平台
  3. 创建应用并添加产品和SDK
  4. 进入到<应用管理>查看App Key和App Secret

- 创建Django项目

- 根据开发文档集成ShareSDK

  - 进入文档中心，打开web集成文档

    https://www.mob.com/wiki/list

  - 根据开发文档集成ShareSDK，实现社会化分享功能

## 5. ORM(object-relation-mapping)

[参考文档](https://handout-1300728887.cos.ap-beijing.myqcloud.com/%E8%AE%B2%E4%B9%89/%E9%BB%91%E9%A9%AC%E5%A4%B4%E6%9D%A1%E9%A1%B9%E7%9B%AE%E8%AF%BE%E4%BB%B6/C02-Database/ORM.html)


- 对象关系映射 本质上就是将数据从一种形式转换到另外一种形式，定义的类相当于数据库中的表，在类中的定义的属性相当于是表中的字段，实例化的每一个对象，相当于的每一条数据。
  - 类 -> 表
  - 类属性 -> 字段
  - 类对象 -> 数据

- 作用：

  1. 省去编写sql语句，提⾼开发效率；

  2. 防注⼊攻击

  3. 适配不同的数据库。
- 缺点：查询效率较低，需要手动的优化。
- 操作方式：

  1. 先创建模型类，再迁移到数据库中：不能对数据库表的字段的定义，实现精确控制。 
  2. 使⽤sql创建数据库的表，定义模型类，通过模型类，实现ORM操作。 
## 6. 中间件的定义方式、结构

```python
def middleware_name(get_response):
    # 这个节点表示请求初始化：在最开始的时候补充额外逻辑
    def middleware(request):
        # 这个节点表示请求被执行前：在请求执行的时候补充额外逻辑
        response = get_response(request)
        # z这个节点表示响应之前：在响应之前补充额外逻辑
        return response
    return middleware
```

# Q&F

## 1. 前后端不分离的区别

前后端不分离：

- 页面的控制和渲染是由后端实现的
  - 优点：页面展示无延迟，因为响应给用户的就是页面；方便实现搜索引擎排名，帮助爬虫服务器更高效率的爬取数据，即SEO
  - 缺点：对后端程序员要求高

前后端分离：

- 页面的控制和渲染是由前端实现的
  - 优点：后端程序员只需专注数据和业务即可
  - 缺点：有延迟，先加载页面 -- 发请求获取数据 -- 渲染
- 补充：前后端不分离，一般不做页面静态化，因为用户先拿到的就是静态页面

## 2. Django自带的缓存cache和redis的区别

cache是python实现缓存的一种工具

redis是一种存放缓存数据的数据库

可以使用cache这个缓存工具，将缓存数据缓存到redis数据库

## 3. 如何对Django框架进行二次开发，增大并发数

可能造成并发降低的原因：

1. 数据库操作变慢
2. python语言执行速度变慢

Django二次开发方向：

- 扩展Django Models使其支持Sharding（一种数据库分片技术）
- 手动关闭GC（垃圾回收）
- **把那些稳定且对性能最敏感的组件，使用c或c++来重写**
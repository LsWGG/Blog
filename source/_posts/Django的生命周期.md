---
title: Django的生命周期
date: 2022-01-13 10:28:41
tags: Django
top: 0
---

# Django生命周期

## 请求流程

1. 用户打开浏览器，输入URL，发起请求
2. 网络分发策略，DNS > Nginx
3. WSGI创建socket服务端，接收请求（HttpRequest）Wsgiref模块
4. Django中间件处理请求（process request）
5. 路由匹配规则模块（dispatch处理请求匹配到对应view视图）
6. view视图，处理相应业务处理（ORM处理获取数据到视图；视图将数据渲染到template）
7. Django中间件处理响应（process response）
8. WSGI返回响应（HttpResponse）
9. 浏览器渲染

<!--more-->

图解

![](/Users/shunli/Documents/Home/BLOG/source/xmind/Django生命周期.png)

## 中间件

### 什么是中间件

​		中间件是一个用来处理Django的请求和响应的框架级别的钩子。它是一个轻量、低级别的插件系统，用于在全局范围内改变Django的输入和输出。每个中间件组件负责做一些特定的功能。

### 中间件的五种方法

#### process_request

- 执行时间：在视图函数之前，在路由匹配之前

- 参数：

  request：请求对象，与视图中用到的request参数是同一个对象

- 返回值：

  None：按照正常的流程走

  HttpResponse：接着倒序执行当前中间件的以及之前执行过的中间件的process_response方法，不再执行其它的所有方法

- 执行顺序：按照MIDDLEWARE中的注册的顺序执行，也就是此列表的索引值

#### process_response

- 执行时间：最后执行

- 参数：

  request：请求对象，与视图中用到的request参数是同一个对象

  response：响应对象，与视图中返回的response是同一个对象

- 返回值：

  response：必须返回此对象，按照正常的流程走

- 执行顺序：按照注册的顺序倒序执行

#### process_view

- 执行时间：在process_request方法及路由匹配之后，视图之前

- 参数：
  request：请求对象，与视图中用到的request参数是同一个对象
  view_func：将要执行的视图函数（它是实际的函数对象，而不是函数的名称作为字符串）
  view_args：url路径中将传递给视图的位置参数的元组
  view_kwargs：url路径中将传递给视图的关键值参数的字典

- 返回值：
  None：按照正常的流程走
  HttpResponse：它之后的中间件的process_view，及视图不执行，执行所有中间件的process_response方法

- 执行顺序：按照注册的顺序执行

#### process_template_response

​		此方法必须在视图函数返回的对象有一个render()方法（或者表明该对象是一个TemplateResponse对象或等价方法）时，才被执行

- 执行时间：视图之后，process_exception之前

- 参数：
  request：请求对象，与视图中用到的request参数是同一个对象
  response：是TemplateResponse对象（由视图函数或者中间件产生）

- 返回值：
  response：必须返回此对象，按照正常的流程走

- 执行顺序：按照注册的顺序倒序执行

#### process_exception

​		此方法只在视图中触发异常时才被执行

- 执行时间：视图之后，process_response之前

- 参数：
  request：请求对象，与视图中用到的request参数是同一个对象
  exception：视图函数异常产生的Exception对象

- 返回值：
  None：按照正常的流程走
  HttpResponse对象：不再执行后面的process_exception方法

- 执行顺序：按照注册的顺序倒序执行

### 中间件的执行流程

![](/Users/shunli/Documents/Home/BLOG/source/xmind/中间件的执行顺序.png)

### 中间件的执行顺序

![](/Users/shunli/Documents/Home/BLOG/source/xmind/中间件的执行流程.png)

## FBV和CBV

### FBV

​		在视图里使用函数处理请求。



请求过程：

​		用户发送url请求，Django会依次遍历路由映射表中的所有记录，一旦路由映射表其中的一条匹配成功了，就执行视图函数中对应的函数名。

### CBV

​		在视图里使用类处理请求。



请求过程：

​		当服务端使用cbv模式的时候，用户发给服务端的请求包含url和method，这两个信息都是字符串类型；

​		服务端通过路由映射表匹配成功后会自动去找dispatch方法，然后Django会通过dispatch反射的方式找到类中对应的方法并执行；

​		类中的方法执行完毕之后，会把客户端想要的数据返回给dispatch方法，由dispatch方法把数据返回经客户端。


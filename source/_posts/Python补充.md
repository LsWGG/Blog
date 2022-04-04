---
title: Python补充
date: 2020-09-30 16:14:15
tags: Python
top: 0
---

## python中的魔法方法

```python
__init__(self)	# 在创建一个对象是默认被调用，不需要手动调用
__str__(self)	# 用来显示信息，需要return一个数据
__del__(self)	# 当删除对象时，默认被调用
__new__(self)	# 才是实例化对象调用的第一个方法，它只取下 cls 参数，并把 其他参数传给 __init__
__call__(self)	# 允许一个类的实例像函数一样被调用 。
__getitem__(self)		# 定义获取容器中指定元素的行为，相当于 self[key] 。
__getattr__(self) 	# 定义当用户试图访问一个不存在属性的时候的行为 。
__setattr__(self) 	# 定义当一个属性被设置的时候的行为 。
__getattribute__(self) 	# 定义当一个属性被访问的时候的行为 。
```

<!--more-->

## 可变与不可变类型

- **指内存中的那块内容（value）是否可以发生改变**
- 可变类型：不需要申请新内存，在原有基础上改变
- 不可变类型：必须在内存中新申请一块区域

## 冒泡排序

```python
def bubble_sort(alist):
    for j in range(len(alist)-1, 0, -1):
        for i in range(j):
            if alist[i] > alist[i+1]:
                alist[i], alist[i+1] = alist[i+1], alist[i]
```

## is和==的区别

-  都是对对象进行比较判断作用的
-  ==（比较运算法），用来判断两个对象的value值
-  is（同一性运算符），用来判断两个对象的唯一身份标识，id地址

只有**数值型（-5~256）和字符串**型的情况下，a is b才为True，当a和b是**tuple，list，dict**或**set**型时，a is b为False。 

## python默认递归限制1000or998

- 修改限制

  ```python
  import sys
  sys.setrecursionlimit(1500)
  ```

## 数据量大情况下Paginator的缺点

- 查询效率慢的问题
- **PageHelper的分页功能是通过Limit拼接SQL实现的** 

## 装饰器

作用：在不改变已有函数源代码及调用方式的前提下，对已有函数进行功能的扩展

```python
# 不改变原有函数__name__\备注信息
from functools import wraps
def check(fu):  # fu:目标函数
    
    @wraps(fu)
    def inner():
        '''执行函数之前'''
        fu()
        '''执行函数之后'''
    return inner

# 语法糖写法
@check
def comment():
    print('发表评论')
    
comment()
# check等价与  comment = check(comment)
```

## python列表中的字典按某个字段排序

```python
# healths列表名，sort是字段名
health = sorted(healths, key=lambda k: k['sort'])
```
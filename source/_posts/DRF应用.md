---
title: DRF应用
date: 2022-01-05 14:55:14
tags: Django
top: 0
---
# DRF应用

## 小技巧
1. 使用serializer对象获取模型类verbose_name说明，可用于系列化时规范化相应值
    `serializer.Meta.model._meta.get_field_by_name(k)[0].verbose_name`

<!--more-->
---
title: DRF实现子查询递归嵌套
date: 2022-01-10 16:50:38
tags: Django
top: 0
---

# DRF系列化实现子查询递归嵌套
    用于自关联深层嵌套，递归获取子节点全部内容场景下；如评论系统、拓扑图渲染

<!--more-->

`model.py`
```python
class AreaModel(BaseModel):
    area_name = models.CharField(max_length=255, verbose_name="区域名称", unique=True)
    parent_id = models.ForeignKey('self', verbose_name="父区域id", db_column="parent_id", related_name="children", to_field="id", null=True)

    class Meta:
        db_table = 'internal_app_peafowls\".\"tb_area'
        verbose_name = "区域信息表"

    def __str__(self):
        return self.area_name
```

ForeignKey部分参数解析：
    verbose_name：该字段的说明信息
    db_column：指定的数据库字段列名，未指定则使用字段名
    related_name：目标模型中反向过滤器的名称。如果设置了，它默认为 related_name 或 default_related_name 的值，否则默认为模型的名称
    to_field：关联对象的字段。默认情况下，Django 使用相关对象的主键。如果你引用了一个不同的字段，这个字段必须有 unique=True。

具体参考：https://docs.djangoproject.com/zh-hans/3.1/ref/models/fields/#django.db.models.ForeignKey

### 方案一，使用RecursiveField
具体参考：https://github.com/heywbj/django-rest-framework-recursive

Serializer类
```python
from rest_framework.serializers import ModelSerializer

class AreaSerializer(ModelSerializer):
    # children由模型类related_name指定
    children = RecursiveField(required=False, allow_null=True, many=True)

    class Meta:
        model = AreaModel
        fields = ("id", "area_name", "parent_id", "children")
```

### 方案二，使用SerializerMethodField
Serializer类
```python
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

# https://www.django-rest-framework.org/community/3.0-announcement/#optional-argument-to-serializermethodfield
# 指定返回需要的字段信息，不受模型类名影响，由自定义函数控制，函数名需为`get_<字段名>`
class AreaSerializer(ModelSerializer):
    # children由模型类related_name指定
    children = serializers.SerializerMethodField()

    class Meta:
        model = AreaModel
        fields = ("id", "area_name", "parent_id", "children")

    def get_children(self, obj):
        if obj.children:
            return AreaSerializer(obj.children, many=True).data
        else:
            return None
```

接口返回数据：
```json
{
    "data": [
        {
            "id": 2,
            "area_name": "区域A",
            "parent_id": null,
            "children": [
                {
                    "id": 3,
                    "area_name": "区域B",
                    "parent_id": 2,
                    "children": []
                },
                {
                    "id": 4,
                    "area_name": "区域C",
                    "parent_id": 2,
                    "children": [
                        {
                            "id": 5,
                            "area_name": "区域D",
                            "parent_id": 4,
                            "children": []
                        }
                    ]
                }
            ]
        }
    ]
}
```

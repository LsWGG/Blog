---
title: ES之DSL库使用
date: 2021-02-24 16:15:34
tags: ES
top: 1
---

# 什么是elasticsearch_dsl

JSON DSL缺点：字段冗长，容易出现语法错误，如不正确的嵌套，难以修改（如添加另一个过滤器）

摒弃传统的JSON DSL语句，将其封装为python类。提供了更方便的方式，来编写和操作查询，[Elasticsearch DSL — Elasticsearch DSL 7.2.0 documentation (elasticsearch-dsl.readthedocs.io)](https://elasticsearch-dsl.readthedocs.io/en/latest/)

<!--more-->

## 创建连接

```python
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search

es = Elasticsearch(hosts="127.0.0.1:9200")
s = Search(using=es, index="teset_index")
```

## 基本查询（Q方法）

### query

```python
# 空查询
s = Search().query(Q())

# 基于字典生成Search对象
s = Search.from_dict({"track_total_hits": True}).query(Q())

# 实例化对象略
s = s.query("multi_match", query='python django', fields=['title', 'body'])

# 等价于
from elasticsearch_dsl import Search, Q
q = Q("multi_match", query='python django', fields=['title', 'body'])
res = s.query(q)

# 查询结果，转为dict
data = res.execute().to_dict()
# 删除符合条件的文档
response = res.delete()

# JSON DSL
{
  "query": {
    "multi_match": {
      "query": "python django", 
      "fields": [
        "title", 
        "body"
      ]
    }
  }
}
```

### 组合查询

```python
Q("match", title='python') | Q("match", title='django')
# {"bool": {"should": [...]}}

Q("match", title='python') & Q("match", title='django')
# {"bool": {"must": [...]}}

~Q("match", title="python")
# {"bool": {"must_not": [...]}}
```

### filter

```python
# 实例化对象略
s = s.filter('terms', tags=['search', 'python'])

# 等价于
s = s.query('bool', filter=[Q('terms', tags=['search', 'python'])])

# 等价于（调用Q方法）
from elasticsearch_dsl import Search, Q
q = Q('terms', tags=['search', 'python'])
s = s.filter(q)

# JSON DSL
{
  "query": {
    "bool": {
      "filter": [
        {
          "terms": {
            "tags": [
              "search", 
              "python"
            ]
          }
        }
      ]
    }
  }
}
```

### 分页

```python
# 实例化对象略
s = s[0: 10]

# JSON DSL
{
    "from": 0, 
    "size": 10
}
```

### 排序

位置参数（-）：表示按该字段降序

```python
# 实例化对象略
s = s.sort('-start_time')

# JSON DSL
{
  "sort": [
    {
      "start_time": {
        "order": "desc"
      }
    }
  ]
}
```

### 限制返回字段

```python
# 指定字段
s = s.source(["title", "body"])

# 模糊查询
s = s.source(include=["title"], exclude=["user.*"])

# 使用dict序列化一个查询
s = Search.from_dict({"query": {"match": {"title": "python"}}})

# 修改已经存在的查询
s.update_from_dict({"query": {"match": {"title": "python"}}, "size": 42})
```

### 复杂类型字段查询

```python
# q方法
q = Q('nested', path='source.ip', query=Q('terms', **{'source.ip': ['1.1.1.1', '2.2.2.2']}))

# dsl
{
    "query": {
        "bool": {
            "filter": [
                {
                    "nested": {
                        "path": "source.ip", 
                        "query": {
                            "terms": {
                                "source.ip": [
                                    "0.0.0.0", 
                                    "1.1.1.1"
                                ]
                            }
                        }
                    }
                }
            ]
        }
    }
}
```

## 聚合查询（A方法）

### 桶（bucket）

```python
from elasticsearch_dsl import A

# 实例化对象略
a = A('terms', field='category')
s.aggs.bucket('category_terms', a)

# 等价于
s.aggs.bucker('category_terms', 'terms', field='category')

# JSON DSL
{
  "aggs": {
    "category_terms": {
      "terms": {
        "field": "category"
      }
    }
  }
}

# =======聚合嵌套=======
s.aggs.bucket("groupDate", "date_histogram", field="update_time", interval="1d", format="yyyy-MM-dd")\
    .bucket("op_agg", "terms", field="op_state")

# JSON DSL
{
"aggs": {
    "groupDate": {
      "date_histogram": {
        "field": "update_time", 
        "interval": "1d", 
        "format": "yyyy-MM-dd"
      }, 
      "aggs": {
        "op_agg": {
          "terms": {
            "field": "op_state"
          }
        }
      }
    }
}
```

### 指标（metric）

```python
# 实例化对象略
s.aggs.bucket("price", "terms", field = "price").metric("avg_price", "avg", field = "price")

# JSON DSL
{
  "aggs": {
    "price": {
      "terms": {
        "field": "price"
      }, 
      "aggs": {
        "avg_price": {
          "avg": {
            "field": "price"
          }
        }
      }
    }
  }
}
```




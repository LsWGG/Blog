---
title: Linux火焰图性能分析
date: 2021-03-02 17:24:45
tags: Linux
top: 0
---

# Linux火焰图

火焰图为CPU消耗可视化，常用于排查代码性能调优

官方地址为：http://www.brendangregg.com/flamegraphs.html

<!--more-->

## 生成器

Brendan D. Gregg 的 Flame Graph 工程实现了一套生成火焰图的脚本.
Flame Graph 项目位于 GitHub上

https://github.com/brendangregg/FlameGraph.git

git clone 到本地

创建步骤为：

**perf 采集数据**

`perf record -F 99 -p 3887 -g -- sleep 30`

- -F 99 表示每秒 99 次
- -p 13204 是进程号, 即对哪个进程进行分析
- -g 表示记录调用栈
- sleep 30 则是持续 30 秒

**生成火焰图**

- 首先用 perf script 工具对 perf.data 进行解析
  `perf script -i perf.data &> perf.unfold`
- 将解析出来的信息存下来, 供生成火焰图
  用 stackcollapse-perf.pl将 perf 解析出的内容 perf.unfold 中的符号进行折叠 :
   `./stackcollapse-perf.pl perf.unfold &> perf.folded`
- 最后生成 svg 图
  `./flamegraph.pl perf.folded > perf.svg`

**我们可以使用管道将上面的流程简化为一条命令**
`perf script | FlameGraph/stackcollapse-perf.pl | FlameGraph/flamegraph.pl > process.svg`

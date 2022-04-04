---
title: Python操作Excel文件
date: 2020-07-11 11:15:21
tags: Python
top: 0
---

# python操作excel文件

### 一、xlrd和xlwt读写

**常用单元格中的数据类型：**

- **0. empty（空的）,1 string（text）, 2 number, 3 date, 4 boolean, 5 error， 6 blank（空白表格）**

#### 1. 安装

```bash
pip install xlrd	# 读取
pip install xlwt	# 写入
```

<!--more-->

#### 2. 读取（xlrd）

- 导入模块

  `import xlrd`

- 打开Excel文件

  `workbook = xlrd.open_workbook('file_path')`

- 使用

  - 获取工作表

    ```python
    sheet = workbook.sheets()[0]					# 通过索引顺序获取
    sheet = workbook.sheet_by_index(0)				# 通过索引顺序获取
    sheet = workbook.sheet_by_name(u'sheet_name')	# 通过名称获取
    ```

  -  获取整行和整列的值（数组）

    ```python
    # i：数值 读取哪行或哪列
    sheet.row_values(i)
    sheet.col_values(i)
    ```

  - 读取行数和列数

    ```python
    nrows = sheet.nrows
    ncols = sheet.ncols
    ```

  - 读取行列数据类型

    ```python
    # slice返回：[类型:值]
    row_type = sheet.row_slice(0)
    col_type = sheet.col_slice(0)
    
    # types返回对应类型列表：[1, 1, 1]
    row_type = sheet.row_types(0)
    col_type = sheet.col_types(0)
    ```

  - 读取单元格

    ```python
    # 先行后列
    A1 = sheet.cell(0,0).value
    C4 = sheet.cell(3,2).value
    
    A1 = sheet.cell_value(0,0)
    C4 = sheet.cell_value(3,2)
    
    # 使用行列索引
    A1 = sheet.row(0)[0].value	# 一行一列
    C4 = sheet.row(3)[2].value	# 四行三列
    C4 = sheet.col(2)[3].value	# 三列四行
    ```

> test.xlsx文件
>
> ![image-20200712113803995](https://tupian-1300728887.cos.ap-chengdu.myqcloud.com/excel.png)
>
> demo代码块
>
> ```python
> # python2.7
> # -*- coding:utf-8 -*-
> import sys
> import xlwt
> 
> # 修改编译格式（防乱码）
> default_encoding = 'utf-8'
> if sys.getdefaultencoding() != default_encoding:
>     reload(sys)
>     sys.setdefaultencoding(default_encoding)
> 
> def read_excel(sheet_name):
>     # 打开文件 file_path：文件路径
>     workbook = xlrd.open_workbook('test.xlsx', formatting_info=False)
>     # formatting_info默认为True，指定False可读取.xlsx文件
>     sheet = workbook.sheet_by_name('Sheet1')	# 指定读取sheet
> 
>     # 行列数据
>     print '第一行：', sheet.row_values(0)
>     # 第一行： ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'...]
>     print '第一列：', sheet.col_values(0)
>     # 第一列： ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'...]
> 
>     # 行列数
>     print '行数：', sheet.nrows	# 行数： 17
>     print '列数：', sheet.ncols	# 列数： 9
>     
>     # 行列类型
>     print sheet.row_slice(0)	# [text:'A1', text:'B1', text:'C1'...]
>     print sheet.col_slice(0)
>     
>     print sheet.row_types(0)	# [1, 1, 1, 1, 1...]
>     print sheet.col_types(0)
>     
>     # 单元格
>     print sheet.cell(0,0).value		# A1
>     print sheet.cell(3,2).value		# C4
>     
>     print sheet.cell_value(0,0)		# A1
>     print sheet.cell_value(3,2)		# C4
>     
>     print sheet.row(0)[0].value	# 一行一列	A1
>     print sheet.row(3)[2].value	# 四行三列	C4
>     print sheet.col(2)[3].value	# 三列四行	C4
> 
> read_excel()
> ```



#### 3. 写入（xlwt）

> 注：xlwt不支持xlsx

- 导入模块

  `import xlwt`

- 打开Excel文件

  `book = xlwt.Workbook(encoding='utf-8')`

- 使用

  - 设置字体

    ```python
    font = xlwt.Font()			# 为样式创建字体
    font.bold = True 			# 粗体
    font.italic = True 			# 斜体
    font.underline = 10 		# 下划线(其中当值为9，整行的填充色为蓝色)
    font.struck_out = True 		# 删除线
    font.name = u'微软雅黑'		 # 字体
    font.color = 'black'		# 颜色
    font.height= 220 			#字体大小，220就是11号字体，大概就是11*20得来的吧
    ```

  - 居中

    ```python
    alignment = xlwt.Alignment()				# 设置字体在单元格的位置
    alignment.horz = xlwt.Alignment.HORZ_CENTER # 水平方向
    alignment.vert = xlwt.Alignment.VERT_TOP  	# 垂直方向
    ```

  - 背景颜色

    ```python
    pattern = xlwt.Pattern()
    pattern.pattern = xlwt.Pattern.SOLID_PATTERN
    pattern.pattern_fore_colour = i					# i:可选值
    ```

    - 可选参数：

      ![](https://tupian-1300728887.cos.ap-chengdu.myqcloud.com/%E9%A2%9C%E8%89%B2%E5%AF%B9%E7%85%A7%E8%A1%A8.png)

  - 设置边框

    - 细实线:1，小粗实线:2，细虚线:3，中细虚线:4，大粗实线:5，双线:6，细点虚线:7

      大粗虚线:8，细点划线:9，粗点划线:10，细双点划线:11，粗双点划线:12，斜点划线:13

    ```python
    border = xlwt.Borders() 				# 给单元格加框线, 1:细实线
    border.left = 1
    border.top = 1
    border.right =1
    border.bottom = 1
    
    border.left_colour = 0 					#设置框线颜色，0:黑色
    border.right_colour = 0
    border.top_colour = 0
    border.bottom_colour = 0
    ```

  - 加超链接

    ```python
    # 输出文本百度，为超链接第一行第一列
    sheet.write(0, 0, xlwt.Formula('HYPERLINK("https://www.baidu.com";"百度")'))
    ```

> demo代码块
>
> ```python
> # python2.7
> # -*- coding:utf-8 -*-
> import sys
> import xlwt
> 
> # 修改编译格式（防乱码）
> default_encoding = 'utf-8'
> if sys.getdefaultencoding() != default_encoding:
>     reload(sys)
>     sys.setdefaultencoding(default_encoding)
>     
> def write_excel():
>     data_list = [['姓名', '性别', '年龄'],
>                  ['张三', '男', 18],
>                  ['李雷', '女', 22],
>                  ['韩梅梅', '女', 20]]
>     try:
>         book = xlwt.Workbook(encoding='utf-8')
> 
>         # 设置字体
>         font = xlwt.Font()
>         font.bold = True
> 
>         # 设置居中
>         alignment = xlwt.Alignment()
>         alignment.horz = xlwt.Alignment.HORZ_CENTER  # 水平方向
>         alignment.vert = xlwt.Alignment.VERT_TOP  # 垂直方向
> 
>         # 设置背景颜色
>         pattern = xlwt.Pattern()
>         pattern.pattern = xlwt.Pattern.SOLID_PATTERN
>         pattern.pattern_fore_colour = 22  # 背景颜色
> 
>         # 设置边框
>         borders = xlwt.Borders()
>         borders.left = xlwt.Borders.THIN
>         borders.right = xlwt.Borders.THIN
>         borders.top = xlwt.Borders.THIN
>         borders.bottom = xlwt.Borders.THIN
>         
>         borders.left_colour = 0 				#设置框线颜色
>         borders.right_colour = 0
>         borders.top_colour = 0
>         borders.bottom_colour = 0
> 
>         # 定义不同的excel style
>         style1 = xlwt.XFStyle()	# 初始化样式
>         style1.font = font
>         style1.alignment = alignment
>         style1.pattern = pattern
>         style1.borders = borders
> 
>         style2 = xlwt.XFStyle()
>         style2.alignment = alignment
>         style2.borders = borders
>         
>         # 指定sheet
>         sheet = book.add_sheet('人员添加')
>         # 列宽自适应
>         set_width(sheet, data_list)
>         # 写入数据
>         for row in range(len(data_list)):
>             for col in range(len(data_list[row])):
>                 # 标题格式
>                 if row == 0:
>                     sheet.write(row, col, data_list[row][col], style=style1)
>                 else:
>                     sheet.write(row, col, data_list[row][col], style=style2)
>         sheet.write(0, 0, xlwt.Formula('HYPERLINK("https://www.baidu.com";"百度")')) 
>         # 输出文本百度，为超链接第一行第一列
>         book.save('test.xls'.decode('utf-8'))
>     except Exception, e:
>         print e
> 
> # 获取字符串长度，一个中文的长度为2
> def len_byte(value):
>     length = len(value)
>     utf8_length = len(value.encode('utf-8'))
>     length = (utf8_length - length) / 2 + length
>     return int(length)
> 
> def set_width(sheet, data_list):
>     # 确定栏位宽度
>     col_width = []
>     for i in range(len(data_list)):
>         for j in range(len(data_list[i])):
>             if i == 0:
>                 col_width.append(len_byte(data_list[i][j]))
>             else:
>                 if col_width[j] < len_byte(str(data_list[i][j])):
>                     col_width[j] = len_byte(data_list[i][j])
> 
>     # 设置栏位宽度，栏位宽度小于10时候采用默认宽度
>     for i in range(len(col_width)):
>         if col_width[i] > 10:
>             sheet.col(i).width = 256 * (col_width[i] + 1)
>             
> write_excel()
> ```
>
> 运行效果
>
> ![image-20200712162231433](https://tupian-1300728887.cos.ap-chengdu.myqcloud.com/image-20200712162231433.png)






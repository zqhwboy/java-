# 表的创建(建表DDL)

* 建表的语法格式(建表属于DDL语句,DDL包括(create drop alter)

```sql
create table 表名(
    字段名1 数据类型,
    字段名2 数据类型, 
    .., ..);
```

表明:建议以t_ 或者tb1_开始,可读性强.

字段名:见名知意.

表名和字段名都属于标识符.

* 关于mysql中的数据类型?

很多数据类型,我们只需要掌握一些常见的数据类型即可.

```sql
varchar (最长255)
可变长度的字符串 比较智能,会根据实际的数据长度动态分配空间
优点:节省空间
缺点:需要动态分配空间,速度慢

char(最长255)
定长字符串 不管实际的数据长度是多少,分配固定的长度去存储数据,使用不恰当的时候,可能会导致空间的浪费
优点:不需要动态分配空间,速度快
缺点:使用不当会导致空间的浪费
varchar和char我们应该怎么选择?
	性别字段你选什么? 因为性别是固定长度的字符串,所以选择char
	姓名字段你选什么? 每一个人的名字长度不同,所以选择varchar

int (最长11)
数字中的整数型,等同于java中的int  默认长为11个长度 ,
当你创建的时候定义为3个长度,写了5个长度也不会报错,这个只是建议长度.
bigint
数字中的长整形,等同于javca中的long
float
单精度浮点型数据
double
双精度浮点型数据
data
短日期类型
datetime
长日期类型
clob
字符大对象,最多可以存储4个G的字符串
比如:存储一篇文章,存储一个说明
超过255个字符的都要采用clob字符大对象来存储.
Character Large Object: CLOB

blob
二进制大对象
BInary Large Object
专门用来存储图片、声音、视频等流媒体数据
往BLOB类型的字段上插入数据的时候,例如插入一个图片、视频等,你需要使用IO流才行
```

* 创造学生表

```sql
 CREATE TABLE t_student(
	NO INT,
	NAME VARCHAR(32),
	sex CHAR(1),
	age INT(3),
	email VARCHAR(255)
);

DESC t_student;
```

* 删除表

```sql
drop table t_student ;//当这张表不存在的时候会报错
DROP TABLE IF EXISTS t_student;//如果这张表存在的话,删除  建议这样用
```

#  插入数据insert(DML)

```sql
insert into 表名(字段名1,字段名2,字段名3...)values
(值1,值2,值3);
注意:字段名和只要一一对应,什么是一一对应?
数量要对应.数据类型要对应.
INSERT INTO t_student (NO,NAME, sex,age,email) 
VALUES(1,'zhangsan','m','20','zhangsan@qq.com');
注意:insert语句但凡执行成功了,那么必然会多一条记录.没有给其他字段指定值的话,默认值是NULL
```

# 创建的时候就给默认值

```sql
DROP TABLE IF EXISTS t_student;
CREATE TABLE t_student(
	NO INT,
	NAME VARCHAR(32),
	sex CHAR(1) DEFAULT 'm',
	age INT(3),
	email VARCHAR(32)
);
```

* insert语句中字段名可以省略么? 可以

注意:前面字段名省略的话,等于都写上了! 所以值也要都写上,还不能颠倒顺序

* 数字格式化:format

```sql
SELECT ename,FORMAT(sal,'&999,999') AS sal FROM emp;
```



* str_to_date:将字符串转换成date类型

```sql
CREATE TABLE t_user(
	id INT,
	NAME VARCHAR(32),
	birth DATE
);
DESC t_user;

INSERT INTO t_user(id,NAME,birth) 
VALUES(1,'zhagnsan','01-10-1990');  //数据类型不匹配
怎么办? 可以使用str_to_date将字符串转换为成日期类型date?

mysql的日期格式:(这个要严格遵守大小写)
%Y 年
%m 月
%d 日
%h 时
%i 分
%s 秒

INSERT INTO t_user(id,NAME,birth) 
VALUES(1,'zhagnsan',STR_TO_DATE('01-10-1990','%d-%m-%Y'));  

好消息?
如果你提供的日期字符串是这个格式,str_to_date函数就不需要了!!!  %Y-%m-%d
INSERT INTO t_user(id,NAME,birth) 
VALUES(1,'zhagnsan','2001-11-01');  

```

* date_format:将date类型转换为具有一定格式的varchar字符串类型

  查询的时候可以以某个特定日期格式展示么?

  ```sql
  SELECT id ,NAME,DATE_FORMAT(birth,'%d/%m/%Y') AS birth   
  FROM t_user;  //格式可以自己制定格式
  ```

* 数据库默认的日期格式化

```sql
SELECT id ,NAME,birth AS birth 
FROM t_user;
以上SQL语句实际上是进行了默认的日期格式化,自动将数据库中的date类型转换为varchar类型.并且采用的格式是mysql默认的日期格式:'%Y-%m-%d'
```

* date和datetime两个类型的区别

```sql
DROP TABLE IF EXISTS t_user;
CREATE TABLE t_user(
	id INT,
	NAME VARCHAR(32),
	birth DATE,
	create_time DATETIME
);

mysql短日期默认格式: %Y-%m-%d
mysql长日期默认格式:%Y-%m-%d %h:%i:%s
```



```sql
INSERT INTO t_user (id,NAME,birth,create_time) VALUES (1,'zhagnsan','1990-10-01','2020-03-18 15:49:50');
```

* 在mysql当中怎么获取系统当前时间?

 now()函数

```sql
INSERT INTO t_user (id,NAME,birth,create_time) VALUES (
2,'lisi','1990-10-01',NOW()); 并且获取的时间带有:时分秒信息!!!是datetime类型
```

# 修改update(DML)

```sql
语法格式:
update 表名 set 字段名1=值1,字段名2=值2,字段名3=值3...where 条件;
注意:没有条件限制会导致所有数据全部更新
```

```sql
UPDATE t_user SET NAME='mark',birth='2000-10-11' WHERE id=2;

//不加where的时候全部都改了
UPDATE t_user SET NAME='abc';
```

# 删除数据delete(DML)

```sql
DELETE FROM t_user WHERE id=2;
delete from t_user; //这样整个表数据都会被清空
```

* 注意:没有条件整张表的数据会全部删除

# insert(DML)

* insert语句可以一次插入多条记录么?

```sql
INSERT INTO t_user (id,NAME,birth,create_time)
 VALUES (1,'zhagnsan','1990-10-01',NOW()),
 (2,'lisi','2000-10-01',NOW()),
 (4,'wangwu','2010-10-01',NOW());
```



# 快速建表

```sql
create table emp2 as select * from emp;
```

原理:将一个查询结果当做一张表新建!!!

这个可以完成表的快速复制!!表创建出来,同时表中的数据也存在.

* 也可以将查询结果插入某个表中// 很少用,学个乐,结果必须符合结构

# 快速删除表的数据?

```sql
delete from dept_bak; //可以,但是比较慢
delete删除数据原理? (delete属于DML)
	表中数据被删除了,但是这个数据在硬盘上的真实存储空间不会被释放!!这种删除缺点是:删除效率比较低
这种删除优点是:支持回滚,后悔了可以恢复数据
```

```sql
truncate语句删除数据的原理?
这种删除效率比较高,表被一次截断,物理删除.
这种表删除缺点:不支持回滚
这种删除优点:快速
用法: TRUNCATE TABLE emp2;(这种操作属于DDL操作)
```

大表非常大,上亿条记录??

```sql
删除使用delete,也许需要执行1个小时,效率低,可以选择用truncate删除表中的数据,只需要不到一秒钟的时间,但是使用前要询问客户是否真的要删除,并警告删除之后不可恢复
```

删除表操作?

drop table 表名; //这不是删除表中的数据,这是把表删除

# 对表结构的增删改 (alter DDL)

开发中很少用,因为成本高,因为要修改java代码






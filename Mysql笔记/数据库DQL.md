```java
source D:\QQ\zhushou\bjpowernode.sql ;  导入sql文件,这是创建的表
```



# 简单查询

## 查询一个字段?

```sql
-- 字段名和表名都是标识符
select 字段名 from 表名;  -- slect 和from都是关键字
```

* **强调**

对于所有SQL语句来说是通用的

所有的SQL语句都是以分号结尾

另外SQL语句不区分大小写  (但是一些操作系统是区分大小写的,比如Linux)

```java
https://www.cnblogs.com/zyzcj/p/6766962.html 出处地址
Linux下的MySQL默认是区分表名大小写的，通过如下设置，可以让MySQL不区分表名大小写：
1、用root登录，                   修改 /etc/my.cnf；
2、在[mysqld]节点下，加入一行： lower_case_table_names=1
3、重启MySQL即可；

其中 lower_case_table_names=1 参数缺省地在 Windows 中这个选项为 1 ，在 Unix 中为 0，因此在window中不会遇到的问题，

linux下就要设置一下。
```

## 查询两个字段,或者多个字段怎么办?

使用逗号隔开就行

```sql
select deptno, dname from dept;
```

## 查询所有字段

```sql
select * from dept;
```

这种方式的缺点:

1. 效率低
2. 可读性差

在实际开发中不建议,可以自己玩没问题,因为* 他会变成字段需要一些时间

## 给查询的列起别名

```sql
SELECT deptno,dname AS deptname FROM dept;
```

使用as关键字起别名.

注意:只是将显示的查询结果列名显示为deptname,原表列名还是叫:dname;

记住:select语句永远都不会进行

* as起别名可以省略,不报错

* 别名可不可以有空格?

不可以直接用空格隔开,但是可以用单双引号去引别名,这时候可以有空格

```java
SELECT deptno,dname AS 'dept n ame' FROM dept;
```

* 注意:在所有的数据库当中 ,字符串统一使用单引号括起来,单引号是标准,

双引号在oracle数据库中用不了,但是在mysql中可以使用.

* 再次强调:数据库中的字符串都是采用单引号括起来,这是标准的,双引号不标准

* 如果别名是中文的话,用单引号括起来.

# 条件查询

都有哪些条件

```sql
=等于
SELECT empno,ename FROM emp WHERE sal =800;
<>或!= 不等于
SELECT empno,ename FROM emp WHERE sal <>800;
<小于
<= 小于等于
>大于
>=大于等于

between...and 两个值之间,等同于 >= and <= 
SELECT * FROM emp  WHERE sal BETWEEN 2450 AND 3000;
* 注意左小右大  是闭区间,包含两端的值

null
查询哪些员工津贴/补助是null的
SELECT * FROM emp  WHERE comm =NULL;  不可以这样是不行的
SELECT * FROM emp  WHERE comm IS NULL;  这样可以
* 注意:在数据库当中null不能使用等号进行衡量,需要使用is null因为数据库中null代表什么也没有,他不是一个值,所以不能使用等号衡量.

not null
SELECT * FROM emp  WHERE comm IS NOT NULL;

and 并且
or 或者

and和or同时出现的话,有优先级问题么?
and优先级较高,如果想要or先执行,可以加小括号.

in 包含,相当于多个or(not in 不在这个范围中)
SELECT * FROM emp  WHERE job IN('Manager' ,'Salesman');
注意:in不是一个区间,in后面跟的是具体的值

not in不在这几个值里面的数据

like 模糊查询,支持%或下划线匹配
%任意多个字符
下划线,任意一个字符
(% 一个特殊的符号,_也是一个特殊符号)
找出名字中含有o的
SELECT * FROM emp  WHERE ename LIKE '%O%';
找出名字以t结尾的
SELECT * FROM emp  WHERE ename LIKE '%t';
找出名字以k开头的
SELECT * FROM emp  WHERE ename LIKE 'k%';
找出第二个字母是A的
SELECT * FROM emp  WHERE ename LIKE '_A%';
找出第三个字母是R的
SELECT * FROM emp  WHERE ename LIKE '__r%';
找出名字中有下划线的
SELECT * FROM emp  WHERE ename LIKE '%_%';  //这样不行,加个\转义
SELECT * FROM emp  WHERE ename LIKE '%\_%';//  \转义字符 
```

排序

```sql
升序
SELECT * FROM emp ORDER BY sal;  //默认是升序
指定降序
SELECT * FROM emp ORDER BY sal desc;  //降序
指定升序
SELECT * FROM emp ORDER BY sal ASC;
可以两个字段排序么?或者说多个字段排序?
查询员工名字和薪资,要去按照薪资升序,如果薪资一样的话,在按照名字升序排列.
SELECT * FROM emp ORDER BY sal ASC,ename ASC;  //sal在前,只有sal相等的时候,才会考虑启用ename排序

根据字段位置也可以排序
SELECT ename,sal FROM emp ORDER BY 2;  //根据结果的第二列进行排序
了解一下,不建议在开发中这样写,因为不健壮.

找出工资在1250到3000之间的员工信息,要求按照薪资降序排列.
SELECT * FROM emp WHERE sal BETWEEN 1250 AND 3000 ORDER BY sal DESC;   
以上语句执行顺序: from where select order by(排序总是在最后执行)

```

# 数据处理函数

数据处理函数又被称为单行处理函数

单行处理函数: 一个输入对应一个输出

多行处理函数: 多个输入对应一个输出

## 常见的单行处理函数有哪些?

lower 转换小写

```sql
SELECT job,LOWER(ename) AS ename FROM emp;
```

upper 转换大写

```sql
SELECT job,upper(ename) AS ename FROM emp;
```

substr 取子串 (被截取的字符串,起始下标,截取的长度)

```sql
SELECT SUBSTR(ename,1,2) AS ename FROM emp;
注意:起始下标是从1开始,没有0
```

找出员工名字第一个字母是A的员工信息?

```sql
第一种方式模糊查询
第二种substr
SELECT * FROM emp WHERE SUBSTR(ename ,1,1)='A';
```

把首字母大写

```sql
select concat(upper(substr(name,1,1),substr(name,2,length(name)-1))) as result from t_student;
concat是进行字符串拼接的
```



length 取长度

```sql
SELECT LENGTH(ename) FROM emp;
```

trim 去空格

```sql
SELECT * FROM emp WHERE ename =TRIM(' smith');
```

str_to_date 将字符串转换成日期

data_format 格式化日期

format 设置千分位



round 四舍五入

```sql
SELECT 'abc' AS bleming FROM emp;
结果:
bleming
abc
abc
abc
abc
结论:select后面可以跟某个表的字段名(可以等同看作变量名),也可以跟字面量/字面值(数据).

SELECT ROUND(1236.567,0) AS result FROM emp;
查询出来的是1237,表有多少行,这个1237就有多少,0代表保留小数的位数
SELECT ROUND(1236.567,-1) AS result FROM emp;  结果:1240 保留到10位
```

rand() 生成随机数

```sql
SELECT RAND()*100 FROM emp; //100以内的随机数
SELECT ROUND(RAND()*100,0) FROM emp; 100以内的随机数,且是整数
```

ifnull可以将null转换成一个具体值

ifnull是空处理函数,专门处理空的.

在所有数据当中,只要有null参与的数学运算,最终结果就是null

计算每个员工的年薪?

年薪=(月薪+月补助)*12

```sql
SELECT ename,(sal+comm)*12 AS yearsal FROM emp;  补助有个空,那么他们运算后结果就是null
SELECT ename,(sal+IFNULL(comm,0))*12 AS yearsal FROM emp; //
津贴是null的话就把他当做0,也可以在sal上加ifnull()函数
```

case..when..then..when..then..else..end

需求:当员工的工作岗位是manager的时候,工资上调10%,当工作岗位是salesman的时候,工资上调50%(注意:不修改数据库,只是将查询结果显示为工资上调)

```sql
SELECT ename,JOB,
(CASE job WHEN 'manager' THEN sal*1.1 WHEN 'salesman' THEN
sal*1.5
ELSE sal END) AS newsal FROM emp;


SELECT ename,JOB,sal oldsal,
(CASE job WHEN 'manager' THEN sal*1.1 
ELSE sal END) AS newsal FROM emp;   when then也可以一个  end这个关键字必须由,else没有的时候其他默认为null.
```



#  分组函数

分组处理函数的特点:输入多行,最终输出一行

5个:

count:技术

sum:求和

avg:平均值

max :最大值

min:最小值

注意:分组函数在使用的时候必须进行分组,然后才能用,如果你没有对数据进行分组,整个表默认为一组

找出最高工资.

```sql
 SELECT MAX(sal) FROM emp;
```

计算工资和

```sql
 SELECT SUM(sal) FROM emp;
```

计算平均工资

```sql
SELECT SUM(sal) FROM emp;
```

计算员工数量?

```sql
SELECT COUNT(sal) FROM emp;
```

分组函数在使用的时候需要注意哪些?

>第一点:分组函数自动忽略null,你不需要提前对null进行处理,统计数量的时候不统计上.null不是一个值,是什么也没有
>
>第二点:分组函数中count(*) 和cont(具体字段)有什么区别?
>
>cont(具体字段):表示统计该字段下不为null的元素的总数
>
>count(*) :统计表当中的总行数,只要有一行数据,count总++,因为每一行记录不可能都是null,一行数据中有一列不为null,则这行数据都是有效的.
>
>第三点:分组函数不能够直接使用在where子句中,找出比最低工资高的员工信息.
>
> SELECT ename,sal FROM emp WHERE sal>MIN(sal);  //报错:无效的使用了分组函数  说完分组查询之后就明白了
>
>第四点:所有的分组函数可以组合起来一起用.
>
>select sum(sal),min(sal),max(sal),avg(sal),count(*) from emp;

# 分组查询

* 什么是分组查询?

在实际的应用中,可能有这样的需求,需要先进行分组,然后对每一组的数据进行操作,这个时候我们需要使用分组查询.怎么进行分组查询呢?

将之前的关键字组合在一起,来看一下他们的执行顺序?

```sql
select ... from ... where ... group by ... order by ...
以上关键字的顺序不能颠倒,需要记忆.
执行顺序是什么呢?
from ->where ->group by->select->order by
```

* 为什么分组函数不能直接使用在where后面?

```sql
 SELECT ename,sal FROM emp WHERE sal>MIN(sal); //报错
 因为分组函数在使用的时候必须先分组之后才能使用.where执行的时候,还没有分组,所以where后面不能出现分组函数
 
 select sum(sal) from emp;//这个没有分组,为什么可以用呢?
 因为select在group by后面执行,这时候没写group by他会默认分成一组
```

* 找出每个工作岗位的工资和?

```sql
 SELECT job,SUM(sal)
 FROM emp
 GROUP BY
 job;
 以上语句的执行顺序?
 先从emp表中查询数据,根据job字段进行分组,然后对每一组的数据进行sum(sal)
 SELECT ename,job,SUM(sal)   //ename差的毫无意义
 FROM emp
 GROUP BY
 job;
 以上语句可以在mysql中执行,但是毫无意义,
 以上语句在oracle中执行报错
 oracle的语法比mysql的语法严格.(mysql的语法相对松散一些.           
```

* 找出每个部门,不同工作岗位的最高薪资?

```sql
SELECT deptno,job,MAX(sal)
FROM emp GROUP BY deptno,job;
```



* 技巧:两个字段联合成一个字段看.(两个字段联合分组)

```sql
SELECT deptno,job,MAX(sal)
FROM emp GROUP BY deptno,job;
```

* 找出每个部门的最高薪资,要求显示最高工资大于3000的

```sql
使用having可以对分完组之后的数据进一步过滤,having不能单独使用,having不能代替where,having必须和group by联合使用

SELECT deptno, MAX(sal) FROM emp  GROUP BY deptno HAVING MAX(sal)>3000;  //执行效率低

SELECT deptno, MAX(sal)FROM emp WHERE sal>3000 GROUP BY deptno;//实际上可以先将大于3000的都找出来,再分组;

优化策略:where和having,优先选择where,where实在完成不来,再选择having
```

* where没办法的??找出每个部门的平均薪资,要求显示平均薪资高于2500的.

```sql
SELECT deptno,AVG(sal) FROM emp GROUP BY deptno HAVING AVG(sal)>2500;
```



* 重点结论:

在一条select语句当中,如果有group by语句的话,select后面只能跟:参加分组的字段,以及分组函数,其他的一律不能跟.跟一些其他的字段就变得没意义,在oracle中还会报错.



* 大总结

```sql
select
...
from 
...
where
...
group by
...
order by
...
以上关键字只能按照这个顺序来,不能颠倒
从某张表中查询,先经过where条件筛选出有价值的数据,对这些数据进行分组,分组之后可以使用having继续筛选,select查询出来,然后排序输出
执行顺序?
1.from
2.where
3.group by
4.having
5.select
6.order by
```

* 综合案例

找出每个岗位的平均薪资,要求显示平均薪资大于1500的,除manager之外,要求按照平均薪资降序排列.

```sql
 SELECT job,AVG(sal) AS avgsal FROM emp WHERE job <> 'Manager' GROUP BY job HAVING AVG(sal)>1500
 ORDER BY avgsal DESC;
```

* distinct关键字

注意:原表数据不会被修改,只是查询结果去重. 去重需要使用一个关键字:distinct

```sql
SELECT DISTINCT job FROM emp;
 
SELECT ename,DISTINCT job FROM emp; //这样编写是错误的,语法错误
  distinct只能出现在所有字段的最前方
  
SELECT DISTINCT job,deptno FROM emp; //两个字段之前,表示两个字段联合起来去重.
```

统计一下工作岗位的数量

```sql
select count(distinct job) from emp;
```

# 连接查询

* 什么是连接查询?

从一张表单独查询,称为单表查询,emp表和dept表联合起来查询数据,从emp表中取员工名字,从dept表中取部门名字.这种跨表查询,多张表联合起来查询数据,被称为连接查询.

* 连接查询的分类?

SQL92:1992年的时候出现的语法

SQL99:1999年的时候出现的语法

我们这里重点学习SQL99.(这个过程中演示一个SQL92的例子)



* 根据表连接的方式分类:

1. 内连接:

   * 等值连接

   * 非等值连接

   * 自连接

2. 外连接

   * 左外连接(左连接)
   * 右外连接(右连接)

3. 全连接(不讲)



* 两张表连接没有任何限制:

```sql
SELECT ename,dname FROM emp,dept;
```



当两张表进行连接查询,没有任何条件限制的时候,最终查询结果条数,是两张表条数的乘积,这种现象被称为:笛卡尔积线程.(笛卡尔发现的,一个数学现象)



* 怎么避免笛卡尔积现象?

连接时加条件,满足这个条件的记录被筛选出来!

```sql
SELECT emp.ename,dept.dname FROM emp,dept WHERE emp.deptno=dept.deptno;

SELECT e.ename,d.dname FROM emp e,dept d WHERE e.deptno=d.deptno;  //这样提高效率  这个是92语法
```

最终的查询结果是变成了14条(emp有14条),但是匹配过程中,匹配的次数减少了么?    没有,只不过进行了选择.



* 注意:通过笛卡尔积现象得出,表的连接次数越多效率越低,尽量避免表的连接次数



## 内连接

###  **等值连接**

查询每个员工所在的部门名称,显示员工和部门名?

```sql
SQL92语法
SELECT e.ename ,d.dname FROM emp e,dept d WHERE e.`DEPTNO`=d.`DEPTNO`;

sql92的缺点:结构不清晰,表的连接条件,和后期进一步筛选的条件,都放到了where后面

SQL99语法
SELECT e.ename ,d.dname FROM emp e JOIN dept d ON e.`DEPTNO`=d.`DEPTNO`;
SELECT e.ename ,d.dname FROM emp e INNER JOIN dept d ON e.`DEPTNO`=d.`DEPTNO`;  //inner可以省略,带着inner可读性更好,一眼能看出是内连接,条件是等量关系,所以被称为等值连接
sql99优点:表连接的条件是独立的,连接之后,如果还需进一步筛选,再往后继续添加where
sql99语法:
select ... from a join b on  a和b连接条件 where 筛选条件
```

### 非等值连接

案列:找出每个员工的薪资登记,要求显示员工名、薪资、薪资等级?

```sql
select e.ename,e.sal,s.grade from emp e inner join salgrade s on e.sal between s.losal and s.hisal;  //条件不是一个等量关系,称为非等值连接  inner可以省略
```



### 内连接之自连接

案列:查询员工的上级领导,要求显示员工名和对应的领导名?

技巧:一张表看成两张表. emp a员工表 emp b领导表

```sql
SELECT a.mgr ,a.ename, b.ename FROM emp a JOIN  emp b WHERE a.mgr=b.empno;  
```

以上就是内连接中的:自连接:一张表看做两张表

## 外连接

内连接的特点:完成能够匹配上这个条件的数据查询出来(A和B连接,AB两张表没有主次关系,平等的)

外连接:两张表连接,产生了主次关系

* 带有right的是右外连接,又叫做右连接
* 带有left的是左外连接,又叫做左连接

任何一个右连接都有左连接的写法,任何一个左连接都有右连接的写法

```sql
SELECT e.ename,d.dname FROM emp e RIGHT outer JOIN dept d
ON e.deptno =d.deptno;  //outer可以省略,带着可读性强
```

right代表什么:表示将join关键字右边这张表看成主表,主要是为了将这张表的数据全部查询出来,稍带关联查询左边表

思考:外连接的查询结果跳数一定是>=内连接的查询结果跳数?

正确;查询每个员工的上级领导,要求显示所有员工的名字和领导名?

```sql
SELECT a.`ename`,a.`MGR`,b.`ENAME` FROM emp a LEFT JOIN emp b ON a.`MGR`=b.`EMPNO`
```

* 三张表,四张表怎么连接?

语法:

```sql
select...from a 
join b on a和b的连接条件 
join c on a和c的连接条件
join d on a和d的连接条件
一条SQL中内连接和外连接可以混合,都可以出现!
```

案列:找出每个员工的部门名以及工资登记,要求显示员工名、部门名、薪资、薪资等级

```sql
SELECT e.ename,e.sal,d.dname,s.grade 
FROM emp e JOIN dept d
ON e.deptno=d.deptno
JOIN salgrade s
ON e.sal BETWEEN s.losal AND s.hisal;
```

案列:找出每个员工的部门名以及工资登记,还有上级领导,要求显示员工名、领导名、部门名、薪资、薪资等级

```sql
SELECT e.ename,e.sal,d.dname,s.grade ,l.`ENAME`
FROM emp e JOIN dept d
ON e.deptno=d.deptno
JOIN salgrade s
ON e.sal BETWEEN s.losal AND s.hisal
LEFT JOIN emp l
ON e.mgr=l.`EMPNO`;
```

# 子查询

* 什么是子查询?

select语句中嵌套select语句,被嵌套的select语句称为子查询.

* 子查询都可以出现在哪里呢?

```sql
select
	...(select).
from 
	...(select).
where
	...(select).
```

## where子句中的查询

案列:找出比最低工资高的员工姓名和工资?

```sql
SELECT ename,sal FROM emp WHERE sal>(SELECT MIN(sal) FROM emp);
```



## from子句中的子查询

注意:from后面的子查询,可以将子查询的查询结果当做一张临时表.(技巧)

案列:找出每个岗位的平均工资的薪资等级?

```sql
第一步:
 SELECT job,AVG(sal) FROM emp GROUP BY job; 拿到每个部门的平均工资和工作
第二步:克服心里障碍,把以上的查询结果当做一张真实存在的表t
 SELECT t.*,s.grade
 FROM (SELECT job,AVG(sal) avgsal FROM emp GROUP BY job) t
 JOIN salgrade s 
 ON t.avgsal BETWEEN s.`LOSAL` AND s.`HISAL`;
```

## select后面出现的子查询

案列:找出每个员工的部门名称,要求显示员工名部门名?

```sql
 SELECT e.ename,e.deptno,(SELECT dname FROM dept d WHERE 
 e.deptno=d.deptno) AS dname 
 FROM emp e;
 注意:对于select语句后面的子查询来说,这个子查询只能返回一条结果,多余一条,就报错了.!
```

# union合并查询结果集

案例:查询工作岗位是manager和salesman的员工?

```sql
 SELECT ename ,job FROM emp WHERE job= 'manager' OR job ='salesman';
 
 
SELECT ename ,job FROM emp WHERE job= 'manager'
UNION 
SELECT ename ,job FROM emp WHERE job ='salesman';
```



对于表连接来说(两个表以上用union效率),没连接一次新表,则匹配的次数就满足笛卡尔积,成倍的翻...但是union可以减少匹配的次数,在减少匹配的次数的情况下,还可以完成两个结果集的拼接.



```sql
a连接b连接c
a 10条记录
b 10条记录
c 10条记录
匹配次数是:1000

a连接b一个结果:10*10->100次
a连接c一个结果:10*10->100次
使用union的话是:100次+100次=200次.(union把乘法变成了加法)
```

* union的注意事项?

1. union进行结果集合并的时候,要求两个结果集的列数相同.
2. Mysql中结果集合并时列的类型不一样不会报错,但是oracle会报错

```sql
SELECT ename ,job FROM emp WHERE job= 'manager'
UNION 
SELECT ename ,sal FROM emp WHERE job ='salesman';
```

# limit(非常重要)

* limit作用:将查询结果集的一部分取出来.通常使用在分页查询当中.

百度默认:一页显示10条记录.

分页作用时为了提高用户的体验,因为一次全部都查出来,用户体验差.可以一页一页翻页看.

* limit 怎么用呢?

```sql
limit startIndex,length
startIndex是起始下标,length是长度
起始下标从0开始
缺省用法:limit 5;这是取前5;
```

* 注意:mysql当中limit在order by之后执行!!!!
* 取出工资排名在3-5名的员工?

```sql
SELECT ename,sal
FROM emp 
ORDER BY sal DESC 
LIMIT 2,3;
```

* 取出工资排名在[5-9]名的员工

```sql
select ename, sal from emp
order by sal desc 
limit 4,5;
```

* 分页

```sql
每页显示3条记录
第一页: limit 0,3
第二页: limit 3,3
第三页: limit 6,3
第四页: limit 9,3
每页显示pageSize条记录
第pageNo页: limit pageSize* (pageNo-1),pageSize
```

# 关于DQL语句的大总结

```sql
select
	...
from
	...
where
	...
group by
	...
having 
	...
order by
	...
limit
	...
执行顺序 from ->where->group by->having->select->order by->limit 
```


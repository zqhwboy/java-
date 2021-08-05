笔记:B站狂神学习记得 ,直接搜 redis播放量最高的那个

# Nosql概述

## 为什么要用Nosql

我们现在处于什么年代2020年,大数据时代;

压力一定会越来越大,适者生存! 一定要逼着自己学习,这是在这个社会生存的唯一法则!

> 1. 单机MySQL的年代!

APP --->DAL--->Mysql

90年代,一个基本的网站访问量一般不会太大,单个数据库完全足够!

那个时候,更多的去使用静态网页Html~服务器根本没有太大的压力!

思考一下,这种情况下:整个网站的瓶颈是什么?

1. 数据量如果太大,一个机器放不下
2. 数据的索引(B+Tree),一个机器内存也放不下
3. 访问量(读写混合),一个服务器承受不了

只要你开始出现以上的三种情况之一,那么你就必须要晋级!

> 2. Memocache(缓存) +Mysql+ 垂直拆分(读写分离)

网站80%的情况都是在读,每次都要去查询数据库的话就非常麻烦!所以说我们希望减轻数据的压力,我们可以使用缓存来保证效率!

发展过程: 优化数据结构和索引-->文件缓存(IO)-->Memocached(当时最热门的技术!)

不缺人,你们的竞争对手并不是人才,而是那些图安稳又踏实(老实人)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\QQ截图20210624121020.png)

 

> 3. 分库分表 + 水平拆分 + MySQL集群

技术和业务的发展的同时,对人的要求也越来越高了

本质:数据库(读、写)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\QQ截图20210624124140.png)

> 4. 如今最近的年代

2010-2020 十年之间,世界已经发生了翻天覆地的变化;(定位,也是一种数据,音乐,热榜)

MySQL等关系型数据库就不够用了!数据量很多,变换很快~!

MySQL有的使用他来存储一些比较大的文件,博客,图片! 数据表很大,效率低了!如果有一种数据库来专门处理这种数据,MySQL压力就变得非常小(研究如何处理这些问题!) 大数据的IO压力下,表几乎没法更大!

> 目前一个基本的互联网项目!

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210625110405.png)

## 为什么要用NoSQL!

用户的个人信息,社交网络,地理位置,用户自己产生的数据,用户日志等等爆发式增长!

这时候我们就需要用NoSQL数据库的,Nosql可以很好的处理以上的情况

## 什么是NoSQL

关系型数据库:表格 行 列

> NoSQL

NoSQL=Not Only SQL (不仅仅是SQL)

泛指非关系型数据库的,随着web2.0互联网的诞生!传统的关系型数据库很难对付web2.0时代,尤其是超大规模的高并发的社区! 暴露出来很多难以克服的问题,NoSQL在当今大数据环境下发展的非常迅速,Redis是发展最快的,是我们当下必须要掌握的技术!

很多的数据类型用户的个人信息,社交网络,地理位置,这些数据类型的存储不需要一个固定的格式!不许多月的操作就可以横向扩展的! Map<String,Object> 使用键值对来控制!



> NoSQL特点

1. 方便扩展(数据之间没有关系,很好扩展)
2. 大数据量高性能(Redis一秒写8万次,读取11万,NoSQL缓存记录级,是一种细粒度的缓存,性能比较高)
3. 数据类型是多样型的!(不需要事先设计数据库!随取随用!如果是数据库量非常大的的表,很多人就无法设计了!)
4. 传统的RDBMS和NoSQL(安装数据库安装一天!)

> 传统的RDBMS
>
> - 结构化组织
> - SQL
> - 数据和关系都存在单独的表中 row col
> - 操作数据,数据定义语言
> - 严格的一致性
> - 基础的事物
> - ......

```java
Nosql
   - 不仅仅是数据
   - 没有固定的查询语言
   - 键值对存储,列存储,文档存储,图形数据库(社交关系)
   - 最终一致性
   - CAP定理和BASE (异地多活) 初级架构师!
   - 高性能 高可用  高可扩
```

> 了解 3V+3高

大数据时代的3V:主要描述问题的

1. 海量Volume
2. 多样Variety
3. 实时Velocity

大数据时代的3高:主要是对程序的要求

1. 高并发
2. 高可扩 (随时水平拆分,及其不够了)
3. 高性能 (保证用户体验和性能)

真正在公司中的时间:NoSQL+RDBMS一起使用才是最强的,阿里巴巴的架构演进

## 阿里巴巴演进分析

思考问题!这个么多东西都是在一个数据库中的么?

开源才是技术的王道

**任何一家互联网公司,都不可能只是简简单单让用户能用就好了**

大量公司都是做的相同的业务;(竞品协议)

随着这样的竞争,业务是越来越完善,然后对于开发者要求也是越来越高!

如果你未来想当一个架构师:没有什么是加一层解决不了的!

```bash
# 1 商品的基本信息
名称 、价格、商品信息:
关系型数据库就可以解决了! MySQL/Oracle(淘宝早年就去IOE呢 阿里云的这群疯子:40分钟)
淘宝内部的MySQL不是大家用的MySQL

# 2 商品的描述、评论(文字比较多)
文档型数据库中 MongoDB

# 3. 图片
-分布式文件系统 FastDFS
- 淘宝自己的TFS
-Hadoop HDFS
-阿里云的  oss

# 4 商品的关键字(搜索)
	- 搜索引擎solr elasticsearch
	- Isearch: 多隆(多去了解这些技术大佬!)
	所有牛逼的人都有那一段苦逼的岁月!但是你只要想SB一样的去坚持,终将牛逼!
	
# 5 商品热门的波段信息
	- 内存数据库
	- Redis Tail Memache...
# 6.商品的交易,外部的支付接口
	- 三方应用
```

要知道,一个简单网页背后的技术一定不是大家所想的name简单!

* 数据类型太多了
* 数据源太多了,经常重构!
* 数据要改造,大面积改动

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210625120642.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210625120745.png)

这里以上都是NoSQL入门概述,不进能提高大家的知识,还可以帮助了解大厂工作内容

## NoSQL的四大分类

**KV键值对:**

	* 新浪:Redis
	* 美团:Redis + Tair
	* 阿里、百度:Redis + memecache

**文档型数据库:(bson格式,和json一样):**

 * MongoDB(一般必须要掌握)
   	* MongoDB 是一个基于分布式文件存储的数据库,C++编写,主要用于处理大量文档!
      	* MongoDB 是一个介于关系型数据和非关系型数据库中间的产品!  MongoDB是非关系型数据库中最丰富,最像关系型数据库的!
* ConthDB

**列存储数据库**

* HBase
* 分布式文件系统

**图形关系数据库**

* 他不是存图形的,放的是关系,比如:朋友圈社交网络,广告推荐的
* Neo4j , InfoGrdid;



![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210625121805.png)



# Redis入门

## 概述

> Redis是什么?

Redis(**Re**moto   **Di**ctionary**S**erver) ,即远程字典服务

是一个开源的使用ANSI C语言编写、支持网络、可基于内容亦可持久化的日志型、Key-Value数据库,并提供多种语言API

redis会周期性的把更新的数据写入磁盘或者修改操作写入追加的记录文件,并且在此基础上实现了master-slave(主从)同步

免费和开源!是当下热门的NoSQL技术之一! 也被人们称为结构化数据库



> Redis能干嘛

1. 内存存储、持久化,内存是断电即失的,所以说持久化是很重要的(rdb、aof)
2. 效率高,可以用于高速缓冲
3. 发布订阅系统
4. 地图信息分写
5. 计时器、计数器(浏览量!)
6. ....

> 特性

1. 多样的数据类型
2. 持久化
3. 集群
4. 事务

....

> 配置

1. 狂神的公众号
2. Redis官网
3. Redis中文网
4. 下载地址:通过官网即可  windos在github下载,停更很久了,Redis推荐都是在Linux服务器上搭建的,我们是基于Linux学习

## Windos安装

1. 下载安装包:
2. 下载完毕并得到安装包
3. 解压到自己电脑上的环境目录下就可以的! Redis非常的小,只有5M
4. 开启Redis,双击运行服务即可

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210625130613.png)

5. 使用redis客户端来连接redis

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210625131039.png)

ping 测试连接

set name kuangshen  set 基本知识key value

get name   get key获取值



记住一句话,Window下使用确实简单,但是Redis推荐我们使用Linux开发

## Linux安装

1. 下载安装包
2. 解压Redis安装包!
3. 进入解压后的文件,可以看到我们redis的配置文件

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210625141820.png)

4. 基本的环境安装

```bash
yum install gcc-c++
make
make install
```

5. redis的默认安装路径 usr/local/bin

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\QQ截图20210625142919.png)



7.redis默认不是后台启动的,修改配置文件!

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\QQ截图20210625143940.png)

8.启动redis服务

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\QQ截图20210625150219.png)

9测试连接b

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\QQ截图20210625150822.png)

10 查看redis进程是否开启

```bash
Last login: Fri Jun 25 14:09:32 2021 from 192.168.175.1
-bash: /opt/rh/devtoolset-9/enable: 没有那个文件或目录
[root@localhost ~]# ps -ef|grep redis
root     15416     1  0 14:43 ?        00:00:01 redis-server 127.0.0.1:6379
root     16864  4601  0 15:07 pts/1    00:00:00 redis-cli -p 6379
root     17059 16991  0 15:09 pts/2    00:00:00 grep --color=auto redis
[root@localhost ~]# 

```

11. 如何关闭Redis服务呢

```bash
127.0.0.1:6379> shutdown   关闭redis
not connected> exit   退出
[root@localhost bin]# 

```

12 再次查看进程是否存在

```bash
[root@localhost ~]# ps -ef|grep redis
root     17141 16991  0 15:11 pts/2    00:00:00 grep --color=auto redis
[root@localhost ~]# 

```

13.后面我们会使用单机多Redis启动集群测试

## 测试性能

**redis-benchmark**是一个压力测试工具!

官方自带的性能测试工具

redis-benchmark 命令参数



我们来简单测试下

```bash
# 测试:100个并发连接  100000请求
redis-benchmark -h localhost -p 6379 -c 100 -n 100000
```



```bash
[root@localhost ~]# cd /usr/local
[root@localhost local]# cd bin
[root@localhost bin]# ls
dump.rdb  redis-benchmark  redis-check-rdb  redis-sentinel
kconfig   redis-check-aof  redis-cli        redis-server
[root@localhost bin]# clear
[root@localhost bin]# ls
dump.rdb  redis-benchmark  redis-check-rdb  redis-sentinel
kconfig   redis-check-aof  redis-cli        redis-server
[root@localhost bin]# redis-benchmark -h localhost -p 6379 -c 100 -n 100000
====== PING_INLINE ======                                                   
  100000 requests completed in 1.46 seconds   对我们的10我个请求进行写入测试
  100 parallel clients  100个开发客户端
  3 bytes payload  每次写入三个字节
  keep alive: 1 只有一台服务器处理请求,单机性能
  host configuration "save": 3600 1 300 100 60 10000
  host configuration "a
```

## 基础的知识

redis默认有16个数据库

```bash
databases 16

# By default Redis shows an ASCII art logo only when started to log to the
# standard output and if the standard output is a TTY and syslog logging is
# disabled. Basically this means that normally a logo is displayed only in
# interactive sessions.

```

默认使用的是第0个,可以使用select进行切换

```bash
127.0.0.1:6379> select 3  # 切换数据库
OKkey
127.0.0.1:6379[3]> ping
PONG
127.0.0.1:6379[3]> dbsize  # 查看DB大小
(integer) 0
127.0.0.1:6379[3]> 
```



```bash
127.0.0.1:6379> keys *  # 查看数据库所有的key
1) "name"
```

清除当前数据库flushdb

```bash
127.0.0.1:6379[3]> flushdb
OK
127.0.0.1:6379[3]> dbsize
(integer) 0
```

清除所有数据库flushall

```bash
127.0.0.1:6379[3]> flushall
OK
127.0.0.1:6379[3]> key *
(error) ERR unknown command `key`, with args beginning with: `*`, 
127.0.0.1:6379[3]> keys * 
(empty array)
127.0.0.1:6379[3]> 
```

> Redis是单线程的!

明白Redis是很快的,官方表示,Redis是基于内存操作,CPU不是Redis性能瓶颈,Redis的瓶颈是根据机器的内存和网络带宽,既然可以使用单线程来处理,就使用单线程了!所以使用了单线程了!



Redis是c语言写的,官方提供的数据为100000+ 的QPS,完全不比同样是使用key-value的Memecache差!

**Redis为什么单线程还那么快?**

1. 误区1:高性能的服务器一定是多线程的
2. 误区2:多线程(CPU上下文切换)一定比单线程高

CPU>内存>硬盘的速度要有所了解!

核心:redis是将所有的数据全放在内存中的,所以说使用单线程去操作效率是最高的,多线程(CPU上下文会切换:耗时操作),对于内存系统来说,如果没有上下文切换,效率就是最高的!多次读写都是在一个CPU上的,在内存的情况下,这个就是最佳的方案!

# 五大数据类型

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\QQ截图20210625160043.png)

> 我们现在讲解的所有的命令大家一定要记住,后面我们使用SpringBoot,Jedis,所有的方法就是这些命令!
>
> 单点登录

## Redis-key

```bash
127.0.0.1:6379> exists name  看是否存在name
(integer) 1 
127.0.0.1:6379> exists name1  看是否存在name1
(integer) 0
127.0.0.1:6379> move name 1 移除当前的key
(integer) 1
127.0.0.1:6379> keys *
1) "age"
127.0.0.1:6379> set name ksd
OK
127.0.0.1:6379> move name 3
(integer) 1
127.0.0.1:6379> keys *
1) "age"
127.0.0.1:6379> set name qinjiang
OK
127.0.0.1:6379> get name
"qinjiang"
127.0.0.1:6379> EXPIRE name 10   设置过期时间,单位是秒
(integer) 1
127.0.0.1:6379> ttl
(error) ERR wrong number of arguments for 'ttl' command
127.0.0.1:6379> ttl name  # 查看当前key的剩余时间
(integer) -2
127.0.0.1:6379> ttl name
(integer) -2
127.0.0.1:6379> get name
(nil)
127.0.0.1:6379> 

```



```bash
127.0.0.1:6379> type name   查看当前key的类型
string
127.0.0.1:6379> type age
string

```

如果后面遇到不会的命令,我们可以在官网查看帮助文档



## String(字符串)

90%的java程序员使用redis只会使用一个String类型!

```bash
###############################################
127.0.0.1:6379> clear
127.0.0.1:6379> keys *  获取所有key
1) "age"
2) "name"
127.0.0.1:6379> type name  获取值类型
string
127.0.0.1:6379> type age
string
127.0.0.1:6379> set key1 v1  设置值
OK
127.0.0.1:6379> get key1
"v1"
127.0.0.1:6379> keys *
1) "key1"
2) "age"
3) "name"
127.0.0.1:6379> type key1
string
127.0.0.1:6379> exists key1   判断某个key是否存在
(integer) 1
127.0.0.1:6379> append key1 "hello"   追加一个字符串  如果不存在,就相当于setkey
(integer) 7
127.0.0.1:6379> get key1
"v1hello"
127.0.0.1:6379> strlen key1  获取字符串的长度
(integer) 7
127.0.0.1:6379> append key1 ",kuangshen"
(integer) 17
127.0.0.1:6379> get key1
"v1hello,kuangshen"
127.0.0.1:6379> 
#############################################
127.0.0.1:6379> set views 0
OK
127.0.0.1:6379> get views  
"0"  # 初始浏览量为0
127.0.0.1:6379> incr views  # 自增1
(integer) 1
127.0.0.1:6379> get views
"1"
127.0.0.1:6379> decr views  # 自减1
(integer) 0
127.0.0.1:6379> get views
"0"  
127.0.0.1:6379> incrby views 10  #  可以设置步长,指定增量
(integer) 10
127.0.0.1:6379> decrBy views 5
(integer) 5
##########################
字符串范围
127.0.0.1:6379> set key1 hello,kuangshen  # 设置key1的值
OK
127.0.0.1:6379> getrange key1 0  3  # 截取字符串[0,3]
"hell"
127.0.0.1:6379> getrange key1 0  -1   # 获取全部的字符串 和get key是一样的
"hello,kuangshen"
127.0.0.1:6379> 

# 替换
127.0.0.1:6379> set key2 abcdefg
OK
127.0.0.1:6379> get key2
"abcdefg"
127.0.0.1:6379> setrange key2 1 xxx  从1位置替换
(integer) 7
127.0.0.1:6379> get key2
"axxxefg"
##################################
# setex(set with expire) # 设置过期时间
# setnx (set if not exist) # 不存在在设置
127.0.0.1:6379> setex key3 key3 "hello"
(error) ERR value is not an integer or out of range
127.0.0.1:6379> setex key3 30 "hello"  # 设置key3的值为hello,30s后过期
OK
127.0.0.1:6379> ttl key3
(integer) 23
127.0.0.1:6379> get key3
"hello"
127.0.0.1:6379> setnx mykey "redis" # 如果mykey不存在,创建mykey,存在 创建失败
(integer) 1
127.0.0.1:6379> keys *
1) "key1"
2) "mykey"
3) "key2"
127.0.0.1:6379> ttl key3
(integer) -2
127.0.0.1:6379> setnx mykey "MongoDB"
(integer) 0
127.0.0.1:6379> get mykey
"redis"
##################################

127.0.0.1:6379> mset k1 b1 k2 v2 k3 v3  # 同时设置多个值
OK
127.0.0.1:6379> keys *
1) "k1"
2) "k3"
3) "k2"
127.0.0.1:6379> mget k1 k3 k2  # 同时获得多个值
1) "b1"
2) "v3"
3) "v2"
127.0.0.1:6379> msetnx k1 bb k4 v4  # msetnx是原子性的操作,要么一起成功要么一起失败
(integer) 0
127.0.0.1:6379> get k4
(nil)

# 对象
set user:1 {name:zhangsan,age:3} # 设置一个user:1 对象,值为json字符来保存一个对象!
# 这里的key是一个巧妙的设计: user:{id}:{filed}   如此设置在Redis中是ok的
127.0.0.1:6379> mset user:1:name zhangsan  user:1:age 2
OK
127.0.0.1:6379> mget user:1:name user:1:age
1) "zhangsan"
2) "2"
127.0.0.1:6379> mget user:1:name user:2:age   # 空的时候什么也取不出来
1) "zhangsan"
2) (nil)

###################################
getset # 先get后set 
127.0.0.1:6379> getset db redis # 如果不存在值就返回nil,存在值
(nil)
127.0.0.1:6379> get db
"redis"
127.0.0.1:6379> getset db mongodb # 如果存在值,获取原来的值,并设置新的值
"redis"
127.0.0.1:6379> get db
"mongodb"
127.0.0.1:6379> 



```

数据结构是相同的,未来的话,jedis ,rtabng

String类似的使用场景:value除了是我们的字符串还可以是我们的数字!

* 计数器
* 统计多单位的数量 uid:45656:follow 0
* 粉丝数
* 对象缓存存储

## List(列表)

基本的数据类型、列表

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210630114004.png)

在redis里面,我们可以把list完成,栈、队列、阻塞队列

所有list命令都是用l开头的,Redis是不区分大小写命令

```redis
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> LPUsh list one #  将一个值或者多个值,插入到列表头部(左)
(integer) 1
127.0.0.1:6379> LPUsh list two
(integer) 2
127.0.0.1:6379> LPUsh list three
(integer) 3
127.0.0.1:6379> lRange list 0 -1 # 获取list中的值
1) "three"
2) "two"
3) "one"
127.0.0.1:6379> lrange list 0 1  # 通过区间获取具体的值
1) "three"
2) "two"
127.0.0.1:6379> Rpush list righr #  将一个值或者多个值,插入到列表尾部(右)
(integer) 4
127.0.0.1:6379> lange list 0 1
(error) ERR unknown command `lange`, with args beginning with: `list`, `0`, `1`, 
127.0.0.1:6379> lrange list 0 1
1) "three"
2) "two"
127.0.0.1:6379> lrange list 0 -1
1) "three"
2) "two"
3) "one"
4) "righr"

######################
LPOP
RPOP
1) "three"
2) "two"
3) "one"
4) "righr"
127.0.0.1:6379> LPop list  # 移除左边的元素
"three"
127.0.0.1:6379> Rpop list  # 移除右边的元素
"righr"
127.0.0.1:6379> lrange list 0 -1  
1) "two"
2) "one"

############################
Lindex
127.0.0.1:6379> lrange list 0 -1
1) "two"
2) "one"
127.0.0.1:6379> lindex list 1  #通过下标获取list中的某个值
"one"
127.0.0.1:6379> lindex list 0
"two"

###############################
Llen

127.0.0.1:6379> Lpush list one
(integer) 1
127.0.0.1:6379> Lpush list two
(integer) 2
127.0.0.1:6379> Lpush list three
(integer) 3
127.0.0.1:6379> llen list   # 返回列表的长度
(integer) 3
################################
移除指定的值
取关 uid  
lrem

127.0.0.1:6379> lrem list 1 one # 移除集合中指定个数的value,精确匹配
(integer) 1
127.0.0.1:6379> lrange list 0 -1
1) "three"
2) "three"
3) "two"
127.0.0.1:6379> lrem list 1 three
(integer) 1
127.0.0.1:6379> lrange list 0 -1
1) "three"
2) "two"
127.0.0.1:6379> lrem list  three
(error) ERR wrong number of arguments for 'lrem' command
127.0.0.1:6379> lrem list 1  three
(integer) 1
127.0.0.1:6379> lpush list three
(integer) 2
127.0.0.1:6379> lpush list three
(integer) 3
127.0.0.1:6379> lrange list 0 -1
1) "three"
2) "three"
3) "two"
127.0.0.1:6379> lrem list 2 three
(integer) 2
127.0.0.1:6379> lrange list 0 -1
1) "two"
127.0.0.1:6379> 

#########################################################
trim  修剪  :list

127.0.0.1:6379> keys *
(empty array)
127.0.0.1:6379> Rpush mylist "hello"
(integer) 1
127.0.0.1:6379> Rpush mylist "hello1"
(integer) 2
127.0.0.1:6379> Rpush mylist "hello2"
(integer) 3
127.0.0.1:6379> Rpush mylist "hello3"
(integer) 4
127.0.0.1:6379> ltrim mylist 1 2 # 通过下标截取指定的长度,这个list已经被改变了,截断了只剩下截取的元素了
OK
127.0.0.1:6379> lrange mylist 0 -1
1) "hello1"
2) "hello2"

######################################################
rpoplpush  # 移除列表的最后一个元素,将他移动的新的列表中

127.0.0.1:6379> rpush mylist "hello"
(integer) 1
127.0.0.1:6379> rpush mylist "hello1"
(integer) 2
127.0.0.1:6379> rpush mylist "hello2"
(integer) 3
127.0.0.1:6379> rpoplpush mylist myohterlist  # 移除列表的最后一个元素,将他移动的新的列表中
"hello2"
127.0.0.1:6379> lrange mylist 0 -1 # 查看原来的列表
1) "hello"
2) "hello1"
127.0.0.1:6379> lrange myohterlist 0 -1  # 查看新的列表,确实存在该值
1) "hello2"

#######################################
lset将列表中执行下标的值替换为另外一个值,更新操作
127.0.0.1:6379> exists list  # 判断列表是否存在
(integer) 0
127.0.0.1:6379> lset list 0 item #如果不存在列表我们去更新会报错
(error) ERR no such key
127.0.0.1:6379> lpush list value1
(integer) 1
127.0.0.1:6379> lrange list 0 0
1) "value1"
127.0.0.1:6379> lset list 0 item # 如果存在会更新当前下标的值
OK
127.0.0.1:6379> lrange list 0 0
1) "item"
127.0.0.1:6379> lset list 1 other  # 如果不存在 会报错
(error) ERR index out of range

#########################################################linsert  # 将某一个具体的value插入到列表中某个元素的前面或者后面
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> rpush mylist "hello"
(integer) 1
127.0.0.1:6379> rpush mylist "world"
(integer) 2
127.0.0.1:6379> linsert mylist before world other
(integer) 3
127.0.0.1:6379> lrange mulist 0 -1
(empty array)
127.0.0.1:6379> lrange mylist 0 -1
1) "hello"
2) "other"
3) "world"
127.0.0.1:6379> linsert mylist after world new
(integer) 4
127.0.0.1:6379> lrange mylist 0 -1
1) "hello"
2) "other"
3) "world"
4) "new"
```

> 小结

* 他实际上是一个链表,before Node after ,left right 都可以插入值

* 如果key存在,创建新的链表

* 如果key存在,新增内容

* 如果移除了所有值,空链表,也代表了不存在!

* 在两边插入或者改动值的时候效率最高! 中间元素,相对来说,效率会偏低

消息队列! 消息队列(LPush Rpop),栈(Lpush pop)

## Set(集合)

set中的值是不能重读的!

```java
####################################################
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> sadd mysete "hello" # set集合中添加元素
(integer) 1
127.0.0.1:6379> sadd mysete "kuangshen"
(integer) 1
127.0.0.1:6379> sadd mysete "lovekuangshen"
(integer) 1
127.0.0.1:6379> smembers mysete  # 查看指定set的所有值
1) "hello"
2) "lovekuangshen"
3) "kuangshen"
127.0.0.1:6379> sismember mysete hello # 判断某一个元素是否在set集合中
(integer) 1
127.0.0.1:6379> sismember mysete world   # 0
####################################################
127.0.0.1:6379> scard mysete  # 获取set集合中的内容元素个数
(integer) 3
###################################################
srem
127.0.0.1:6379> srem mysete hello # 移除set集合中的指定元素
(integer) 1
127.0.0.1:6379> srem mysete hellos
(integer) 0
127.0.0.1:6379> scard mysete
(integer) 2
127.0.0.1:6379> smembers myset
(empty array)
127.0.0.1:6379> smembers mysete
1) "lovekuangshen"
2) "kuangshen"
###################################################
set 无序不重复集合,抽随机
127.0.0.1:6379> smembers mysete
1) "lovekuangshen"
2) "kuangshen"
127.0.0.1:6379> sadd mysete "lovekuangshen2"
(integer) 1 
127.0.0.1:6379> srandmember mysete   # 随机抽选出一个元素
"lovekuangshen2"
127.0.0.1:6379> srandmember mysete 
"lovekuangshen2"
127.0.0.1:6379> srandmember mysete 
"lovekuangshen2"
127.0.0.1:6379> srandmember mysete 
"lovekuangshen"
127.0.0.1:6379> srandmember mysete 2 # 随机抽选出指定个数的元素
1) "lovekuangshen2"
2) "lovekuangshen"
127.0.0.1:6379> 
###################################################
移除指定的key,随机删除一个key
127.0.0.1:6379> smembers mysete
1) "lovekuangshen2"
2) "lovekuangshen"
3) "kuangshen"
127.0.0.1:6379> spop mysete  # 随机移除一些set集合中的元素
"kuangshen"
127.0.0.1:6379> spop mysete
"lovekuangshen2"
127.0.0.1:6379> smembers mysete
1) "lovekuangshen"
###################################################
将一个集合中的值,移动到另外一个set集合!
127.0.0.1:6379> sadd myset hello
(integer) 1
127.0.0.1:6379> sadd myset world
(integer) 1
127.0.0.1:6379> sadd myset kuangshen
(integer) 1
127.0.0.1:6379> sadd myset2 set2
(integer) 1
127.0.0.1:6379> smove myset myset2 kuangshen  # 将一个集合中的值,移动到另外一个set集合中
(integer) 1
127.0.0.1:6379> smembers myset
1) "hello"
2) "world"
127.0.0.1:6379> smembers myset2
1) "set2"
2) "kuangshen"
    
#################################################
微博 B站 共同关注(并集)
数字集合类:
	- 差集:sdiff
    - 交集:sinter
    - 并集:sunion
127.0.0.1:6379> sadd key1 a
(integer) 1
127.0.0.1:6379> sadd key1 b
(integer) 1
127.0.0.1:6379> sadd key1 c
(integer) 1
127.0.0.1:6379> sadd key1 c
(integer) 0
127.0.0.1:6379> sadd key2 d
(integer) 1
127.0.0.1:6379> sadd key2 e
(integer) 1
127.0.0.1:6379> sadd key2 c
(integer) 1
127.0.0.1:6379> sdiff key1 key2
1) "a"
2) "b"
127.0.0.1:6379> sinter key1 key2
1) "c"
127.0.0.1:6379> sunion key1 key2
1) "c"
2) "a"
3) "b"
4) "e"
5) "d"
127.0.0.1:6379> 
```

微博,A用户将所有关注的人放在一个set集合中!将它的粉丝也放在一个集合中

共同关注, 共同爱好,二度好友,推荐好友!(六度分割理论)

## Hash(哈希)

Map集合,key-Map集合! 时候这个值是一个map集合! 本质和String类型没有太大的区别,还是一个简单的key-value!

set myhash field kuangshen

```bash
127.0.0.1:6379> hset myhash field1 kuangshen # set一个具体的key-value
(integer) 1
127.0.0.1:6379> hget myhash field1 # 获取一个字段值
"kuangshen"
127.0.0.1:6379> hmset myhash field1 hello fields2 world # set多个具体的key-value
OK
127.0.0.1:6379> hmget myhash field1 fields2 # 获取多个字段值
1) "hello"
2) "world"
127.0.0.1:6379> hgetall myhash # 获取全部的数据
1) "field1"
2) "hello"
3) "fields2"
4) "world"
127.0.0.1:6379> 

127.0.0.1:6379> hdel myhash field1 # 删除hash指定的key字段! 对应的value值也就消失了!
(integer) 1
127.0.0.1:6379> hgetall myhash
1) "fields2"
2) "world"
127.0.0.1:6379> 
#################################################
hlen
127.0.0.1:6379> hmset myhash field1 hello field2 world
OK
127.0.0.1:6379> hgetall myhash  
1) "fields2"
2) "world"
3) "field1"
4) "hello"
5) "field2"
6) "world"
127.0.0.1:6379> hlen myhash # 获取哈希表的字段数量!
(integer) 3
127.0.0.1:6379> 
#################################################
127.0.0.1:6379> hexists myhash field1 # 判断hash中指定字段是否存在!
(integer) 1
127.0.0.1:6379> hexists myhash field3
(integer) 0

#################################################
# 只获得所有的field
# 只获取所有的value

127.0.0.1:6379> hkeys myhash  # 只获得所有field
1) "fields2"
2) "field1"
3) "field2"
127.0.0.1:6379> hvals myhash # 只获得所有value
1) "world"
2) "hello"
3) "world"

#################################################
incr decr

127.0.0.1:6379> hset myhash field3 5
(integer) 1
127.0.0.1:6379> hincrby myhash field3 1 # 增1
(integer) 6
127.0.0.1:6379> hincrby myhash field3 -2 # 减2
(integer) 4
127.0.0.1:6379> hsetnx myhash fields4 hello # 如果不存在则可以设置
(integer) 1
127.0.0.1:6379> hsetnx myhash fields4 world # 如果存在则不可以设置
(integer) 0
127.0.0.1:6379> 
```

hash变更的数据 user name age,尤其是用户信息之类的,经常变动的信息!

hash更适合对象的存储,String更适合字符串的存储

## Zset(有序集合)

在set基础,增加了一个值,set k1 v1     zset k1 score v1

```bash
127.0.0.1:6379> zadd myset 1 one # 添加一个值
(integer) 1
127.0.0.1:6379> zadd myset 2 two 3 three #添加多个值
(integer) 2
127.0.0.1:6379> zrange myset 0 -1
1) "one"
2) "two"
3) "three"

#################################################
排序如何实现
127.0.0.1:6379> zadd salary 2500 xiaohong # 添加三个用户
(integer) 1
127.0.0.1:6379> zadd salary 5000 zhangsan
(integer) 1
127.0.0.1:6379> zadd salary 500 kuangshen
(integer) 1
127.0.0.1:6379> zrangebyscore salary -inf +inf # 显示全部用户 从小到大
1) "kuangshen"
2) "xiaohong"
3) "zhangsan"

127.0.0.1:6379> zrevrange salary 0 -1 # 从大到小进行排序!
1) "zhangsan"
2) "kuangshen"


127.0.0.1:6379> zrangebyscore salary -inf +inf withscores # 显示全部用户 并且附带成绩
1) "kuangshen"
2) "500"
3) "xiaohong"
4) "2500"
5) "zhangsan"
6) "5000"
127.0.0.1:6379> zrangebyscore salary -inf 2500 withscores # 显示工资小于2500员工的升序排序
1) "kuangshen"
2) "500"
3) "xiaohong"
4) "2500"

127.0.0.1:6379> zrevrange salary 0 -1 # 
1) "zhangsan"
2) "kuangshen"

########################################################
移除rem中的元素
127.0.0.1:6379> zrange salary 0 -1
1) "kuangshen"
2) "xiaohong"
3) "zhangsan"
127.0.0.1:6379> zrem salary xiaohong # 移除有序集合中指定元素
(integer) 1
127.0.0.1:6379> zrange salary 0 -1
1) "kuangshen"
2) "zhangsan"
127.0.0.1:6379> 

127.0.0.1:6379> zcard salary  # 获取有序集合中的个数
(integer) 2

######################################################

127.0.0.1:6379> zadd myset 1 hello
(integer) 1
127.0.0.1:6379> zadd myset 2 world 3 kuangshen
(integer) 2
127.0.0.1:6379> zcount myset 1 3
(integer) 3
127.0.0.1:6379> zcount myset 1 2  # 获取指定区间的成员数量
(integer) 2
127.0.0.1:6379> 
```

其余一些API,通过我们的学习,你们剩下的工作中有需要,这个时候你可以查看官方文档

案列思路:set排序  存储班级成绩表 工资表排序! 

普通消息,1 重要消息 2;  带权重进行判断!

排行榜应用实现,取Top N测试!



# 三种特殊数据类型

## geospatial地理位置

朋友的定位,附近的人,打车距离计算?

Redis的Geo在Redis3.2版本就推出了  ! 这个功能可以推算地理位置的信息,两地之间的距离,方圆几里的人!

可以查询一些测试数据

* 只有六个命令

> Geoadd

```bash
# geoadd 添加地理位置
# 规则: 两级无法直接添加,我们一般会下载城市数据,直接通过java程序一次导入!
#有效的纬度从-85.05112878到85.05112878
#当坐标位置超出上述指定范围时,该命令将会返回一个错误.


# 参数key 值(纬度 经度 名称)
127.0.0.1:6379> geoadd china:city 116.40 .9.90 beijing
(error) ERR value is not a valid float
127.0.0.1:6379> geoadd china:city 116.40 39.90 beijing
(integer) 1
127.0.0.1:6379> geoadd china:city 121.47 31.23 shanghai
(integer) 1
127.0.0.1:6379> geoadd china:city 106.50 29.533333333 chongqing
(integer) 1
127.0.0.1:6379> geoadd china:city 114.05 22.52 shenzhen
(integer) 1
127.0.0.1:6379> geoadd china:city 120.16 30.24 hangzhou 108.96 34.26 xian
(integer) 2

```

> geopos

获得当前的定位:一定是一个坐标值

```bash
127.0.0.1:6379> geopos china:city beijing # 获取指定城市的经度和纬度
1) 1) "116.39999896287918091"
   2) "39.90000009167092543"
127.0.0.1:6379> geopos china:city beijing chongqing
1) 1) "116.39999896287918091"
   2) "39.90000009167092543"
2) 1) "106.49999767541885376"
   2) "29.53333273733112208"

```

> GEODISTt

两人之间的距离!

单位:

	* m表示单位为米
	* km表示单位为千米
	* mi表示单位为英里
	* ft表示单位为英尺

```bash
127.0.0.1:6379> geoDist china:city beijing shanghai  # 查看上海到北京的直线距离
"1067378.7564"
127.0.0.1:6379> geoDist china:city beijing shanghai km
"1067.3788"
127.0.0.1:6379> geoDist china:city beijing chongqing km  # 查看重庆到北京的直线距离
"1463.7686"

```



>georadius 以给定的经纬度为中心,找出某一半径内的元素

我附近的人?(获取所有附近的人的地址,定位!) 通过半径来查询

所有的数据应该都录入:china:city ,才会让结果更加清晰

```bash
127.0.0.1:6379> GEORADIUS china:city 110 30 1000 km  # 以110 30 这个经纬度为中心,寻找方圆1000km内的城市
1) "chongqing"
2) "xian"
3) "shenzhen"
4) "hangzhou"
127.0.0.1:6379> GEORADIUS china:city 110 30 500 km
1) "chongqing"
2) "xian"
127.0.0.1:6379> GEORADIUS china:city 110 30 500 km withdist  # 显示到中间距离的位置 
1) 1) "chongqing"
   2) "341.8754"
2) 1) "xian"
   2) "483.8340"
127.0.0.1:6379> GEORADIUS china:city 110 30 500 km withcoord  # 显示他人的定位信息
1) 1) "chongqing"
   2) 1) "106.49999767541885376"
      2) "29.53333273733112208"
2) 1) "xian"
   2) 1) "108.96000176668167114"
      2) "34.25999964418929977"
127.0.0.1:6379> GEORADIUS china:city 110 30 500 km withcoord withdist count 1 # 筛选出指定的结果! 同时指定查询的数量
1) 1) "chongqing"
   2) "341.8754"
   3) 1) "106.49999767541885376"
      2) "29.53333273733112208"
127.0.0.1:6379> GEORADIUS china:city 110 30 500 km withcoord withdist count 2
1) 1) "chongqing"
   2) "341.8754"
   3) 1) "106.49999767541885376"
      2) "29.53333273733112208"
2) 1) "xian"
   2) "483.8340"
   3) 1) "108.96000176668167114"
      2) "34.25999964418929977"

```

> georadiusbymember

```ba
# 找出位于指定元素周围的其他元素!
127.0.0.1:6379> georadiusbymember china:city beijing 1000km
(error) ERR wrong number of arguments for 'georadiusbymember' command
127.0.0.1:6379> georadiusbymember china:city beijing 1000 km
1) "beijing"
2) "xian"
127.0.0.1:6379> georadiusbymember china:city shanghai 400 km
1) "hangzhou"
2) "shanghai"

```

> geohash命令-返回一个或多个位置元素Geohash表示

该命令将返回11个字符的Geohash字符串!

```bash
# 将二维的经纬度转换为一维的字符串,如果两个字符串越接近,那么距离越近!
127.0.0.1:6379> geohash china:city beijing chongqing
1) "wx4fbxxfke0"
2) "wm78p2quju0"

```

> GEO底层的实现原理其实是Zset! 我们可以使用Zset命令来操作geo!

```bash
127.0.0.1:6379> zrange china:city 0 -1 # 查看地图中全部元素
1) "chongqing"
2) "xian"
3) "shenzhen"
4) "hangzhou"
5) "shanghai"
6) "beijing"
127.0.0.1:6379> zrem china:city beijing # 移除指定元素!
(integer) 1
127.0.0.1:6379> zrange china:city 0 -1
1) "chongqing"
2) "xian"
3) "shenzhen"
4) "hangzhou"
5) "shanghai"

```

授人以渔

## Hyperloglog

> 什么是基数?

A{1,3,5,7,8,9}

B{1,3,5,7,8}

基数(不重复的元素)=5,可以接受误差!

> 简介

Redis2.8.9版本更新了Hyperloglog数据结构!

Redis Hyperloglog 基数统计的算法

有点:占用的内存是固定的,2^64不同的元素的技术,只需要12kb内存!如果要从内存角度来比较的话,Hyperloglog首选!



**网页的UV(一个人访问一个网站多次,但还是算作一个人!)**

传统的方式,set保存用户的id,然后就可以统计set中元素数量作为标准判断!

这个方式如果保存大量用户id,就会比较麻烦! 我们的目的是为了技术,而不是保存用户id;

0.81%错误率! 统计UV任务,可以忽略不记的!

>测试使用

```bash
127.0.0.1:6379> pfadd mykey a b c d e f g h i j  # 创建第一组元素 mykey
(integer) 1
127.0.0.1:6379> pfadd mykey2 i j z x c v b n m
(integer) 1
127.0.0.1:6379> pfcount mykey  # 统计mykey元素的基数数量
(integer) 10
127.0.0.1:6379> pfcount mykey2
(integer) 9
127.0.0.1:6379> pfmerge mykey3 mykey mykey2 # 合并过两组元素 mykey mykey2 = > mykey3 并集
OK
127.0.0.1:6379> pfcount mykey3  # 查看并集的数量
(integer) 15
```

如果允许容错,那么一定可以使用Hyperloglog

如果不允许容错,就是用set或者自己的数据类型即可!

## Bitmap

为什么其他教程都不喜欢讲这些? 这些在生活中,开发中,都有十分多的应用场景,学习了,就是多一个思路. 只要学不死,就往死里学,学习又累不死人

> 位存储

统计疫情感染人数:0 1 0 1 0

统计用户信息,活跃,不活跃、未登录! 打卡,365打卡! 两个状态的都可以使用Bitmaps!

Bitmaps位图,数据结构!  都是操作二进制位来进行记录,就只有0 和 1两个状态!

365天=365bit  1字节=8bit  46个字节左右!

> 测试

使用bitmap来记录 周一到周日的打卡

周一: 1 周二: 0 周三 : 0 周四: 1...

```bash
127.0.0.1:6379> setbit sign 0 1
(integer) 0
127.0.0.1:6379> setbit sign 1 0
(integer) 0
127.0.0.1:6379> setbit sign 2 0
(integer) 0
127.0.0.1:6379> setbit sign 3 1
(integer) 0
127.0.0.1:6379> setbit sign 4 1
(integer) 0
127.0.0.1:6379> setbit sign 5 0
(integer) 0
127.0.0.1:6379> setbit sign 6 0
(integer) 0
```

查看某一天事都有打卡! 

```bash
127.0.0.1:6379> getbit sign 3 # 查看
(integer) 1
127.0.0.1:6379> getbit sign 2
(integer) 0
```

统计操作,统计,打卡的天数!

```bash
127.0.0.1:6379> setbit sign 2 1  # 修改某天的值
(integer) 0
127.0.0.1:6379> bitcount sign  # 统计value=1数量 这周打卡记录,就可以看到是否有全勤
(integer) 4
```

# 事务

MYSQL:ACID



Redis事务本质:一组命令的集合! 一个事务中所有命令都会被序列化,在事务执行的过程中,会按照顺序执行!

一次性、顺序性、排他性! 执行一系列的命令!

```bash
----- 队列 set set set 执行 ---------
```

**Redis事务没有隔离级别的概念**

所有的命令在事务中,并没有被直接执行!只有发起执行命令的时候才会执行! Exec

**Redis单条命令是保证原子性的,但是事务不保证原子性!**

redis的事物:

* 开启事务(multi)
* 命令入队(...)
* 执行事务(exec)

> 正常执行事务!

```bash
127.0.0.1:6379> multi  # 开启事务
OK
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> set k2 v2  
QUEUED
127.0.0.1:6379(TX)> get k2
QUEUED
127.0.0.1:6379(TX)> set k3 v3
QUEUED
127.0.0.1:6379(TX)> exec  # 执行事务
1) OK
2) OK
3) "v2"
4) OK

```

> 放弃事务

```bash
127.0.0.1:6379> multi # 开启事务
OK
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> set k2 v2
QUEUED
127.0.0.1:6379(TX)> set k4 v4
QUEUED
127.0.0.1:6379(TX)> discard # 取消事务
OK
127.0.0.1:6379> get k4 3 事务队列中命令都不会被执行
(nil)
```

> 编译型异常(代码有问题! 命令有错!) ,事务中所有的命令都不会被执行

```bash
127.0.0.1:6379> mylti
(error) ERR unknown command `mylti`, with args beginning with: 
127.0.0.1:6379> set k1 v1
OK
127.0.0.1:6379> set k2 v2
OK
127.0.0.1:6379> set k3 v3
OK
127.0.0.1:6379> getset key3  # 错误的命令
(error) ERR wrong number of arguments for 'getset' command
127.0.0.1:6379> set k4 v4
OK
127.0.0.1:6379> set k5 v5 
OK
127.0.0.1:6379> exec  # 执行事务的时候也报错!
(error) ERR EXEC without MULTI
127.0.0.1:6379> get k5  # 所有的命令都不会被执行
"v5"
```



> 运行时异常(1/0) ,如果队列中存在语法性错误,那么执行命令的时候,其他命令是可以正常执行的, 错误的命令会抛出异常

```bash
127.0.0.1:6379> set k1 "v1"
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> incr k1  # 会执行的时候失败
QUEUED
127.0.0.1:6379(TX)> set k2 v2
QUEUED
127.0.0.1:6379(TX)> set k9 v9
QUEUED
127.0.0.1:6379(TX)> get k9
QUEUED
127.0.0.1:6379(TX)> exec
1) (error) ERR value is not an integer or out of range # 虽然第一条命令报错了,但是依旧正常执行成功了! 
2) OK
3) OK
4) "v9"
127.0.0.1:6379> get k9
"v9"
```

> 监控! Watch  (面试常问!)

**悲观锁:**

* 很悲观,什么时候都会出问题,无论做什么都会加锁!

**乐观锁:**

* 很乐观,认为什么时候都不会出问题,无论做什么都不会上锁! 更新数据的时候去判断一下,在此期间是否有人修改过这个数据
* 获取version
* 更新的时候比较version

> Redis测监视测试

正常执行成功!

```bash
127.0.0.1:6379> set money 100
OK
127.0.0.1:6379> set out 0
OK
127.0.0.1:6379> watch money  # 监视money对象
OK
127.0.0.1:6379> multi  # 事务正常结束,数据期间没有发生变动,这个时候就正常执行成功!
OK
127.0.0.1:6379(TX)> decrby money 20
QUEUED
127.0.0.1:6379(TX)> incrby out 20
QUEUED
127.0.0.1:6379(TX)> exec
1) (integer) 80
2) (integer) 20
```

测试多线程修改值,使用watch可以当做redis的乐观锁来操作!

```bash
127.0.0.1:6379> watch money # 监视money
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> decrby money 10
QUEUED
127.0.0.1:6379(TX)> incrby out 10
QUEUED
127.0.0.1:6379(TX)> exec  # 执行之前,另外一个线程修改了我们的值,这个时候会导致事务执行失败
(nil)


127.0.0.1:6379> get money
"990"
127.0.0.1:6379> set money 500
OK

```

如果修改失败,获取最新的值就好

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210701111727.png)

锁:Redis可以实现乐观锁



# Jedis

我们要使用java来操作Redis   知其然并知其所以然,授人以鱼! 学习不能急躁,慢慢来会很快!

> 什么是jredis是Redis官方推荐的java连接开发工具! 使用java操作Redis中间件! 如果你要使用java操作redis,那么一定要对redis十分的熟悉

> 测试

1. 导入对应的依赖

```xml
<!--导入jedis的包-->
    <dependencies>
        <dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
            <version>3.2.0</version>
        </dependency>
        <!--fastjson-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.75</version>
        </dependency>

    </dependencies>
```

2. 编码测试:

* 连接数据库
* 操作命令
* 断开连接!

```java
package com.kuang;

import redis.clients.jedis.Jedis;

public class TestPing {
    public static void main(String[] args) {
        //1. new Jedis对象即可
        Jedis jedis = new Jedis("127.0.0.1",6379);
        //jedis所有的命令就是我们之前学习的所有指令!所以之前指令的学习很重要
        System.out.println(jedis.ping());
    }

}

```

输出:

```java
PONG
```

## 常用的API

String

List

Set

Hash

Zset



## java操作redis

```java
package com.kuang;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Transaction;

public class TextTX {
    public static void main(String[] args) {
        Jedis jedis = new Jedis("127.0.0.1", 6379);

        jedis.flushDB();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("hello","world");
        jsonObject.put("name","kuangshen");


        //开启事务
        Transaction multi = jedis.multi();
        String result = jsonObject.toJSONString();
        //jedis.watch(result);

        try {
            multi.set("user1", result);
            multi.set("user2", result);
            int i=1/0; //代码抛出异常,执行失败
            multi.exec();
        }catch (Exception e){
            multi.discard();//放弃事务
            e.printStackTrace();
        }finally{
            System.out.println(jedis.get("user1"));
            System.out.println(jedis.get("user2"));
            jedis.close(); //关闭连接
        }

    }
}

```



## springboot整合

SpringBoot操作数据:spring-data jpa jdbc mongodb redis!

SpringData也是和SpringBoot齐名的项目

说名:在springboo51之后,原来使用的jedis别替换为lettuce?

jedis采用的直连,多个线程操作的话,是不安全的,如果想要避免不安全,使用jedis pool  连接池,更像BIO模式

lettuce:采用netty,实例可以在多个线程中享,不存在线程不安全的情况,减少线程数量,更像NIO模式



源码分析:

```java
   @ConditionalOnSingleCandidate(RedisConnectionFactory.class) //我们可以自己自定义一个redisTemplate来替换这个默认的!
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        // 默认的RedisTemplate 没有过多的设置,redis对象都是需要序列化!
        //两个泛型都是object ,object的类型,我们后使用都需要强转<String,object>
        RedisTemplate<Object, Object> template = new RedisTemplate();
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }

    @Bean
    @ConditionalOnMissingBean //由于String 是redis中最常使用的类型,所以说单独提出来了一个bean!
    @ConditionalOnSingleCandidate(RedisConnectionFactory.class)
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        StringRedisTemplate template = new StringRedisTemplate();
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }
```



> 整合测试下

1. 导入依赖

```xml
<!--操作redis-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```



2. 配置连接

```java
spring.redis.host=127.0.0.1
spring.redis.port=6379
spring.redis.database=0
```



3. 测试!

```java
package redis02springboot;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisTemplate;

@SpringBootTest
class Redis02SpringbootApplicationTests {

    @Autowired
    private RedisTemplate redisTemplate;


    @Test
    void contextLoads() {

        //redisTemplate  操作不同的数据类型  api和我们的指令是一样的
        //opsForValue 操作字符串 类似String
        //opsForList 操作字符串 类似List
        //opsForSet
        //opsForHash
        //opsForZSet
        //opsForGeo
        //opsForHyperLoglog

        //除了基本的操作,我们常用的方法都可以直接redisTemplate来操作,比如事务和基本的CRUD
//        获取redis的连接对象
//        RedisConnection connection = redisTemplate.getConnectionFactory().getConnection();
//        connection.flushDb();
//        connection.flushAll();

        redisTemplate.opsForValue();
        redisTemplate.opsForValue().set("mykey","狂神说java");
        System.out.println(redisTemplate.opsForValue().get("mykey"));

    }

}

```

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210703175608.png)

```java
  boolean defaultUsed = false;
        if (this.defaultSerializer == null) {
            // 默认的序列化方式是JDK序列化, 我们可能会使用Json来序列化
            this.defaultSerializer = new JdkSerializationRedisSerializer(this.classLoader != null ? this.classLoader : this.getClass().getClassLoader());
        }
```

关于对象的保存:

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210703182145.png)

我们编写一个自己的RedisTemplate

```java
package redis02springboot.config;


import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.autoconfigure.condition.ConditionalOnSingleCandidate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    //这是我给大家写好的一个固定模板,大家在企业中,拿去就可以直接使用!
    //编写我们自己的redisTemplate
    @Bean
    @SuppressWarnings("all")
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        //我们为了自己开发方便,一般直接使用<String,Object>类型
        RedisTemplate<String, Object> template = new RedisTemplate();
        template.setConnectionFactory(redisConnectionFactory);


        //Json序列化配置
        Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<Object>(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        //String的序列化
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();


        //key采用String的序列化方式
        template.setKeySerializer(stringRedisSerializer);
        //hash的key也采用String的序列化方式
        template.setHashKeySerializer(stringRedisSerializer);
        //value的序列化方式采用jackson
        template.setValueSerializer(jackson2JsonRedisSerializer);
        //hash的value序列化方式采用jackson
        template.setHashKeySerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();

        //配置具体的序列化方式
        return template;
    }
}

```

所有的redis操作,其实对于java开发人员来说,十分的简单,更重要是要去理解redis的思想和每一种数据结构的用处和作用场景

## Redis.conf详解

启动的时候,就通过配置文件来启动!

工作中,一些小小的配置,可以让你脱颖而出!

行家有没有,出手就知道

1. 配置文件unit单位对大小写不敏感!

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704084806.png)



![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704084603.png)

就是好比我们学习Spring  import include

> 网络

```bash
bind 127.0.0.1 -::1  # 绑定的ip
protected-mode yes # 保护模式
port 6379  # 端口设置
```

> 通用GENERAL

```bash
daemonize yes # 以守护进程的方式运行,默认是no,我们需要自己开启为yes(代表以后台的方式运行)

pidfile /var/run/redis_6379.pid  # 如果以后台的方式运行,我们就需要指定一个pid文件

# 日志
# Specify the server verbosity level.
# This can be one of:
# debug (a lot of information, useful for development/testing)
# verbose (many rarely useful info, but not a mess like the debug level)
# notice (moderately verbose, what you want in production probably) # 生产环境
# warning (only very important / critical messages are logged)
loglevel notice

logfile "" # 日志的文件位置名

databases 16 # 数据库数量 默认是16个

always-show-logo no # 是否总是显示logo


```

> 快照

持久化,在规定的时间内,执行了多少次操作,则会持久化到文件  .rdb .aof

redis是内存数据库,如果没有持久化,那么数据断电及失!

```bash
# save 3600 1   # 如果3600s内,至少有一个key进行了修改,我们就进行持久化操作
# save 300 100   # 如果300s内,至少有100个key进行了修改,我们就进行持久化操作
# save 60 10000  # 如果60s内,至少有10000个key进行了修改,我们就进行持久化操作
# 我们之后学习持久化,会自己定义这个测试!

stop-writes-on-bgsave-error yes # 持久化如果出错,是否还需要继续工作!

rdbcompression yes  # 是否压缩rdb文件  ,需要消耗cpu资源

rdbchecksum yes # 保存rdb文件的时候,进行错误的检查校验!

dir ./ # rdb 文件保存的目录
```

> REPLICATION  复制,我们后面讲解主从复制的,时候再进行讲解

> SECURITY

可以在这里设置redis的密码,默认是没有密码!

```bash
127.0.0.1:6379> config get requirepass # 获取redis密码
1) "requirepass"
2) ""
127.0.0.1:6379> config set requirepass "123456" # 设置redis密码
OK
127.0.0.1:6379> ping  # 发现所有的命令不能使用,有可能本次连接还可以用,但是下次一定不行
(error) NOAUTH Authentication required.
127.0.0.1:6379> auth 123456  # 使用密码进行登录
OK

```

> 限制 ClIENTS

```bash
maxclients 10000  #设置连接上redis的最大客户端数量
```

> 内存

```bash
maxmemory <bytes> # redis配置最大的内存容量
maxmemory-policy noeviction # 内存达到上限之后的处理策略
    1、volatile-lru：只对设置了过期时间的key进行LRU（默认值） 
    2、allkeys-lru ： 删除lru算法的key   
    3、volatile-random：随机删除即将过期key   
    4、allkeys-random：随机删除   
    5、volatile-ttl ： 删除即将过期的   
    6、noeviction ： 永不过期，返回错误
```

> APPEND ONLY 模式  aof配置

```bash
appendonly no # 默认是不开启aof默认,默认使用rdb方式持久化,在大部分的情况下,rdb完全够用!
appendfilename "appendonly.aof" # 持久化的文件的名字

# appendfsync always # 每次修改都会sync 消耗性能
appendfsync everysec # 每秒执行一次 sync ,可能丢失这1s的数据
# appendfsync no     # 不执行sync ,这个时候操作系统自己同步数据,速度最快!
```

具体的配置,我们在Redis持久化中去给大家详细的讲解!

## Redis持久化

面试和工作,持久化都是重点!

Redis是内存数据库,如果不将内存中的数据库保存到磁盘,那么一旦服务器进程退出,服务器中的数据库状态也会消失.所以Redis提供了持久化功能! 

### RDB(Redis DataBase)

在主从复制中,rdb就是备用了! 从机上面!

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704100709.png)

在指定的时间间隔内将内存中的数据写入磁盘,也是行话讲的Snapshot快照,他恢复时是将快照文件直接读到内存里.

Redis会单独创建(fork) 一个子进程来进行持久化,会先将数据写入到一个临时文件中,待持久化过程都结束了,再用这个临时文件替换上次持久化好的文件.整个过程中,主进程是不进行任何IO操作的,这就确保了极高的性能,如果需要进行大规模数据的恢复,且对于数据恢复的完整性不是非常敏感,那么RDB方式要比AOF方式更加的高效,RDB的缺点是最后一次持久化后的数据可能丢失.我们默认的就是RDB,一般情况下不需要修改这个配置!

有时候在生产环境,我们会将这个文件进行备份!



**rdb保存的文件是dump.rdb**  都是在我们的配置文件中快照中进行配置的!

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704101930.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704102246.png)

> 触发机制

1. save的规则满足的情况下,会自动触发rdb规则
2. 执行flushall命令,也会触发我们的rdb规则
3. 退出redis,也会产生rdb文件!

备份就自动生成一个dump.rdb文件

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704103217.png)

> 如何会发rdb文件!

1. 只需要将rdb文件放在我们redis的启动目录中就可以了,redis启动的时候会自动检查dump.rdb文件 恢复其中的数据
2. 查看需要存在的位置

```bash
127.0.0.1:6379> config get dir
1) "dir"
2) "/usr/local/bin"  # 如果这个目录下存在 dump.rdb文件,启动就会自动恢复其中的数据
```

> 几乎就他自己的默认配置就够用了,但是我们还是需要学习!

**优点:**

1. 适合大规模的数据恢复!
2. 对数据的完整性不高!

**缺点:**

1. 需要一定的时间间隔进行操作
2. fork进程的时候,会占用一定的内存空间!!





### AOF(Append Only File)

将我们的所有命令都记录下来,history ,恢复的时候就把这个文件全部在执行一遍

> 是什么

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704111145.png)

以日志的形式来记录每个写操作,将Redis执行过的所有指令记录下来(读操作不记录),只许追加文件但不可改写文件,redis启动之初会读取该文件重新构建数据,换言之,redis重启的话就根据日志文件的内容将写指令从前到后执行一次以完成数据的恢复工作

**Aof保存的是appendonly.aof文件**

> append

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704113141.png)

默认是不开启的,我们需要手动进行配置! 我们只需要将appendonly该为yes就开启了aof !

重启,redis就可以生效了! 



如果这个aof文件有错位,这时候redis是启动不起来的,我们需要修复这个文件,redis给我们提供了一个工具  **'redis-check-rdb  --fix'**

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704120843.png)

如果文件正常,重启就可以恢复了!

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704121024.png)

> 重写规则

aof默认的就是无限追加,文件会越来越大! 

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704121755.png)

如果aof文件大于64m,太大了! fork一个新的进程来将我们的文件进行重写!

> 优点和缺点

```bash
appendonly no # 默认是不开启aof默认,默认使用rdb方式持久化,在大部分的情况下,rdb完全够用!
appendfilename "appendonly.aof" # 持久化的文件的名字

# appendfsync always # 每次修改都会sync 消耗性能
appendfsync everysec # 每秒执行一次 sync ,可能丢失这1s的数据
# appendfsync no     # 不执行sync ,这个时候操作系统自己同步数据,速度最快!

# rewrite 重写

```

**优点:**

1. 每一次修改都同步,文件的完整性
2. 每秒同步一次,可能会丢失一秒的数据
3. 从不同步,效率最高

**缺点**

1. 相对于数据文件来说,aof远远大于rdb,修复的速度也比rdb慢
2. Aof运行效率也要比rdb慢,所以我们默认的配置就是rdb持久化

**扩展**:

1. RDB持久化方式能够在指定的时间间隔内对你的数据进行快照存储
2. AOF持久化方式记录每次对服务器写的操作,当服务器重启的时候会重新执行这些命令来恢复原始的数据,AOF命令以Redis协议追加保存每次写的操作到文件末尾,Redis还能对AOF文件进行后台重写,使的AOF文件的体积不至于过大
3. 只做缓存,如果你只希望你的数据在服务器运行的时候存在,你也可以不使用任何持久化
4. 同时开启两种持久化方式
   * 在这种情况下,当redis重启的时候会优先载入AOF文件来恢复原始的数据,因为在通常情况下AOF文件保存的数据集要比RDB文件保存的数据要完整
   * RDB数据不实时,同时使用两者时服务器重启也只会找aof文件,那要不要只使用aof呢?作者建议不要,因为RDB更适合用于备份数据库(AOF在不断变换不好备份),快速重启,而且不会有AOF可能潜在的Bug,留着作为一个万一的手段.
   * ![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704124802.png)

## Redis发布订阅

Redis发布订阅(pub/sub)是一种**消息通信模式**:发送者(pub)发送消息,订阅者(sub)接受消息,微信、微博、关注系统!

Redis客户端可以订阅任意数量的频道

订阅/发布消息图:

第一个:消息发送者,第二个:频道,第三个:消息订阅者

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704130127.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704130319.png)

> 命令

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704130443.png)



> 测试

订阅端

```bash
[root@localhost bin]# redis-server kconfig/redis.conf 
[root@localhost bin]# redis-cli -p 6379
127.0.0.1:6379> subscribe kuangshenshuo   #订阅一个频道 kuangshenshuo
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "kuangshenshuo"
3) (integer) 1
# 等待读取推送的信息
1) "message"  # 消息
2) "kuangshenshuo"  # 哪个频道的消息
3) "hello,kuangshen"  # 消息的具体内容
1) "message"
2) "kuangshenshuo"
3) "hello,redis"
```

发送端

```bash
[root@localhost ~]# cd /usr/local/bin
[root@localhost bin]# redis-cli -p 6379
127.0.0.1:6379> ping
PONG
127.0.0.1:6379> publish kuangshenshuo "hello,kuangshen"  # 发布者发送消息到频道
(integer) 1
127.0.0.1:6379> publish kuangshenshuo "hello,redis"   # 发布者发送消息到频道
(integer) 1
127.0.0.1:6379> 

```

> 原理

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704131903.png)         

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704132003.png)

使用场景:

1. 实时消息系统!
2. 实时聊天系统!(频道当做聊天室,将信息回显给所有人即可)
3. 订阅,关注系统都是可以的!

稍微复杂的场景我们会使用消息中间件MQ()

## Redis主从复制



![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704133631.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704133215.png)

主从复制,读写分离! 80%的情况下都是在进行读操作! 减缓服务器的压力! 架构中经常使用! 一主二从!

只要在公司中,主从复制就是必须要使用的,因为在真实的项目中不可能单机使用Redis!



### 环境配置

只配置从库,不配置主库

```bash
127.0.0.1:6379> info replication  # 查看当前库的信息
# Replication
role:master # 角色master
connected_slaves:0  # 没有从机
master_failover_state:no-failover
master_replid:31869e4ceb11d812696c7d3441c054688fe48201
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
```

复制三个配置文件,然后修改对应的信息

1. 端口号
2. pid 名字
3. log 文件名字
4. dump.rdb名字

修改完毕之后,启动我们的三个redis服务器,可以通过进程信息查看!

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704141643.png)

### 一主二从

**默认情况下,每台Redis服务器都是主节点** 我们一般情况下,只需要配置从机就好了!

认老大! 一主(79) 二从(80 81)

```bash
127.0.0.1:6380> slaveof 127.0.0.1 6379 # SLAVEOF host 6379 找谁当自己老大
OK
127.0.0.1:6380> info replication
# Replication
role:slave  # 当前角色是从机
master_host:127.0.0.1  # 可以的看到主机信息  
master_port:6379
master_link_status:up
master_last_io_seconds_ago:4
master_sync_in_progress:0
slave_repl_offset:0
slave_priority:100
slave_read_only:1
replica_announced:1
connected_slaves:0
master_failover_state:no-failover
master_replid:3197fd773e2dbe9495217f982d85fd8f598c6d6b
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:0
127.0.0.1:6380>

# 在主机中进行查看
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:1  # 多了从机的配置
slave0:ip=127.0.0.1,port=6380,state=online,offset=42,lag=0  # 从机的配置
master_failover_state:no-failover
master_replid:3197fd773e2dbe9495217f982d85fd8f598c6d6b
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:42
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:42

```

如果两个都配置完了,是有两个从机的

```bash
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:1
slave0:ip=127.0.0.1,port=6380,state=online,offset=42,lag=0
master_failover_state:no-failover
master_replid:3197fd773e2dbe9495217f982d85fd8f598c6d6b
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:42
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:42
```

真实的主从配置应该在配置文件中配置,这样的话是永久的,我们这里使用的是命令,暂时的!

> 细节

主机可以写,从机不能写只能读! 主机中的所有信息和数据,都会自动被从机保存

主机写:

```bash
[root@localhost bin]# redis-server kconfig/redis79.conf
[root@localhost bin]# redis-cli -p 6379
127.0.0.1:6379> keys *
(empty array)
127.0.0.1:6379> set k1 v1
OK
```

从机只能读取内容!

```bash
127.0.0.1:6380> keys *
(empty array)
127.0.0.1:6380> keys *
1) "k1"
127.0.0.1:6380> get k1
"v1"
127.0.0.1:6380> set k2 v2
(error) READONLY You can't write against a read only replica.
127.0.0.1:6380> 
```

测试: 主机断开连接,从机依旧连接到主机的,但是没有写操作的,这个时候,主机如果回来了,从机依旧可以直接获取主机写的信息!

如果是使用命令行,来配置的主从,这个时候如果重启了,就会变回主机!  只要变回从机,立马就会从主机中获取值!

> 复制原理

Slave启动成功连接到master后会发送一个syn同步c命令

Master接到命令,启动后台的存盘进程,同时收集所有接受到的用于修改数据集的命令,在后台进程执行完毕之后,**mster将传送整个数据文件到slave,并完成一次完全同步.**

**全量复制**:而slave服务在接受到数据文件数据后,将其存盘并加载到内存中

**增量复制:** Master继续将新的所有收集到的修改命令一次传给slave,完成同步

但是只要重新连接master,一次完全同步(全量复制)将被自动执行!我们的数据一定可以在从机中看到

> 层层链路

上一个M连接下一个S!

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704162449.png)

这个时候也可以完成我们主从复制

> 如果没有老大,这个时候能不能选择一个老大出来呢? 手动!

**谋朝篡位**

如果主机断开了连接,我们可以使用 slaveof  no one 让自己变成主机! 其他的结点就可以手动连接到最新的这个主节点(手动)! 如果这个时候老大修复了,只能重新配置连接才行,要不他只是个主节点 没有从节点

### 哨兵模式(自动选举老大的模式)

> 概述

主从切换技术的方法是:当主服务器宕机后,需要手动把一台从服务器切换为主服务器,这就需要人工干预,费时费力,还会造成一段时间内服务不可用,这不是一种推荐的方式,更多的时候,我们优先考虑哨兵模式,Redis从2.8开始正式提供了Sentinel(哨兵)架构来解决这个问题

谋朝篡位的自动版,能够后台监控主机是否故障,如果故障了根据投票数**自动将从库转为主库**

哨兵模式是一种特殊的模式,首先Redis提供了哨兵的命令,哨兵是一个独立的进程,他会独立运行,其原理是哨兵通过发送命令,等待Redis服务器响应,从而监控运行多个Redis实例.

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704193450.png)

这里哨兵有两个作用

* 通过发送命令,让Redis服务器返回监控器运行状态,包括主服务器和从服务器
* 当哨兵检测到master宕机,会自动将slave切换为master,然后通过**发布订阅模式**通知其他的从服务器,修改配置文件,让他们切换主机,
* 然而一个哨兵进程对Redis服务器进行监控,可能会出现问题,为此,我们可以使用多个哨兵进行监控,各个哨兵之间还会进行监控,这样就形成了多哨兵模式.

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704194235.png)



> 测试!

我们目前的状态是一主二从!

1. 配置哨兵配置文件sentinel.conf

```bash
# sentinel monitor 被监控的名称 host port 1  
sentinel monitor myredis 127.0.0.1 6379 1
```

后面这个数字1 ,代表主机挂了,slave投票看让谁替换成为主机,票数最多的,就会称为主机!

  

2.  启动哨兵

```bash
[root@localhost ~]# cd /usr/local/bin
[root@localhost bin]# redis-sentinel kconfig/sentinel.conf 
8487:X 04 Jul 2021 20:20:27.356 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
8487:X 04 Jul 2021 20:20:27.356 # Redis version=6.2.4, bits=64, commit=00000000, modified=0, pid=8487, just started
8487:X 04 Jul 2021 20:20:27.356 # Configuration loaded
8487:X 04 Jul 2021 20:20:27.357 * Increased maximum number of open files to 10032 (it was originally set to 1024).
8487:X 04 Jul 2021 20:20:27.357 * monotonic clock: POSIX clock_gettime
                _._                                                  
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 6.2.4 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                  
 (    '      ,       .-`  | `,    )     Running in sentinel mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 26379
 |    `-._   `._    /     _.-'    |     PID: 8487
  `-._    `-._  `-./  _.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           https://redis.io       
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                                               

8487:X 04 Jul 2021 20:20:27.358 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
8487:X 04 Jul 2021 20:20:27.358 # Sentinel ID is bc32282662c10df5e616660de487c0e2febd3465
8487:X 04 Jul 2021 20:20:27.358 # +monitor master myredis 127.0.0.1 6379 quorum 1
8487:X 04 Jul 2021 20:20:27.362 * +slave slave 127.0.0.1:6380 127.0.0.1 6380 @ myredis 127.0.0.1 6379
8487:X 04 Jul 2021 20:20:27.364 * +slave slave 127.0.0.1:6381 127.0.0.1 6381 @ myredis 127.0.0.1 6379
8487:X 04 Jul 2021 20:22:04.234 # +sdown slave 127.0.0.1:6380 127.0.0.1 6380 @ myredis 127.0.0.1 6379
8487:X 04 Jul 2021 20:22:47.068 * +reboot slave 127.0.0.1:6380 127.0.0.1 6380 @ myredis 127.0.0.1 6379
8487:X 04 Jul 2021 20:22:47.127 # -sdown slave 127.0.0.1:6380 127.0.0.1 6380 @ myredis 127.0.0.1 6379
8487:X 04 Jul 2021 20:22:57.097 * +convert-to-slave slave 127.0.0.1:6380 127.0.0.1 6380 @ myredis 127.0.0.1 6379
```

如果Master节点断开了,这个时候就会从随机选择服务器! (这里面有一个投票算法)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704202706.png)

如果主机此时回来了,只能归并到新的主机下,当做从机,这就是哨兵模式的规则!

> 哨兵模式

优点:

1. 哨兵集群,基于主从复制模式,所有的主从配置优点,它全有
2. 主从可以切换,故障可以转移,系统的可用性就会更好
3. 哨兵模式就是主从模式的升级,手动到自动,更加健壮!

缺点:

1. Redis不好在线扩容,集群容量一旦达到上限,在线扩容就十分麻烦!
2. 实现哨兵模式的配置其实是很麻烦的,里面有很多选择!

> 哨兵模式的全部配置

```bash
# Example sentinel.conf
 
# 哨兵sentinel实例运行的端口 默认26379
port 26379
 
# 哨兵sentinel的工作目录
dir /tmp
 
# 哨兵sentinel监控的redis主节点的 ip port 
# master-name  可以自己命名的主节点名字 只能由字母A-z、数字0-9 、这三个字符".-_"组成。
# quorum 当这些quorum个数sentinel哨兵认为master主节点失联 那么这时 客观上认为主节点失联了
# sentinel monitor <master-name> <ip> <redis-port> <quorum>
sentinel monitor mymaster 127.0.0.1 6379 1
 
# 当在Redis实例中开启了requirepass foobared 授权密码 这样所有连接Redis实例的客户端都要提供密码
# 设置哨兵sentinel 连接主从的密码 注意必须为主从设置一样的验证密码
# sentinel auth-pass <master-name> <password>
sentinel auth-pass mymaster MySUPER--secret-0123passw0rd
 
 
# 指定多少毫秒之后 主节点没有应答哨兵sentinel 此时 哨兵主观上认为主节点下线 默认30秒
# sentinel down-after-milliseconds <master-name> <milliseconds>
sentinel down-after-milliseconds mymaster 30000
 
# 这个配置项指定了在发生failover主备切换时最多可以有多少个slave同时对新的master进行 同步，
# 这个数字越小，完成failover所需的时间就越长，
# 但是如果这个数字越大，就意味着越 多的slave因为replication而不可用。
# 可以通过将这个值设为 1 来保证每次只有一个slave 处于不能处理命令请求的状态。
# sentinel parallel-syncs <master-name> <numslaves>
sentinel parallel-syncs mymaster 1
 
 
 
# 故障转移的超时时间 failover-timeout 可以用在以下这些方面： 
#1. 同一个sentinel对同一个master两次failover之间的间隔时间。
#2. 当一个slave从一个错误的master那里同步数据开始计算时间。直到slave被纠正为向正确的master那里同步数据时。
#3.当想要取消一个正在进行的failover所需要的时间。  
#4.当进行failover时，配置所有slaves指向新的master所需的最大时间。不过，即使过了这个超时，slaves依然会被正确配置为指向master，但是就不按parallel-syncs所配置的规则来了
# 默认三分钟
# sentinel failover-timeout <master-name> <milliseconds>
sentinel failover-timeout mymaster 180000
 
# SCRIPTS EXECUTION
 
#配置当某一事件发生时所需要执行的脚本，可以通过脚本来通知管理员，例如当系统运行不正常时发邮件通知相关人员。
#对于脚本的运行结果有以下规则：
#若脚本执行后返回1，那么该脚本稍后将会被再次执行，重复次数目前默认为10
#若脚本执行后返回2，或者比2更高的一个返回值，脚本将不会重复执行。
#如果脚本在执行过程中由于收到系统中断信号被终止了，则同返回值为1时的行为相同。
#一个脚本的最大执行时间为60s，如果超过这个时间，脚本将会被一个SIGKILL信号终止，之后重新执行。
 
#通知型脚本:当sentinel有任何警告级别的事件发生时（比如说redis实例的主观失效和客观失效等等），将会去调用这个脚本，
#这时这个脚本应该通过邮件，SMS等方式去通知系统管理员关于系统不正常运行的信息。调用该脚本时，将传给脚本两个参数，
#一个是事件的类型，
#一个是事件的描述。
#如果sentinel.conf配置文件中配置了这个脚本路径，那么必须保证这个脚本存在于这个路径，并且是可执行的，否则sentinel无法正常启动成功。
#通知脚本
# sentinel notification-script <master-name> <script-path>
  sentinel notification-script mymaster /var/redis/notify.sh
 
# 客户端重新配置主节点参数脚本
# 当一个master由于failover而发生改变时，这个脚本将会被调用，通知相关的客户端关于master地址已经发生改变的信息。
# 以下参数将会在调用脚本时传给脚本:
# <master-name> <role> <state> <from-ip> <from-port> <to-ip> <to-port>
# 目前<state>总是“failover”,
# <role>是“leader”或者“observer”中的一个。 
# 参数 from-ip, from-port, to-ip, to-port是用来和旧的master和新的master(即旧的slave)通信的
# 这个脚本应该是通用的，能被多次调用，不是针对性的。
# sentinel client-reconfig-script <master-name> <script-path>
sentinel client-reconfig-script mymaster /var/redis/reconfig.sh # 一般都是由运维来配置
```

社会目前程序员饱和(初级和中级)、高级程序员重金难求! (提升自己)

## Redis缓存穿透和雪崩(面试高频,工作常用)

> 服务的高可用问题

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704205946.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704205913.png)

#### 缓存穿透

> 概念

缓存穿透概念很简单,用户想要查询一个数据,发现redis内存数据库没有,也就是缓存没有命中,于是向持久层数据查询,发现也没有,于是本次查询失败,当用户很多的时候,缓存都没有命中(秒杀!),于是都去请求了持久层数据库,这会个持久层数据库造成很大的压力,这时候就相当于出现了缓存穿透

> 解决方案

**布隆过滤器**

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704211303.png)

**缓存空对象**
![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210704211341.png)

但是这种方法会存在两个问题:

1. 如果空值能够被缓存起来,这就意味着缓存需要更多的空间存储更多的键,因为这当中可能会有很多的空值的键;
2. 即使对空值设置了过期时间,还是会存在缓存层和存储层的的数据会有一段时间窗口不一致,这对于需要保持一致性的业务会有影响.

### 缓存击穿(量太大,缓存过期)

> 概述

这里需要注意和缓存穿透的区别,缓存击穿,是指一个key非常热点,在不停的扛着大并发,大并发集中对着一个点进行访问,当这个key在失效的瞬间,持续的大并发就穿透缓存,直接请求数据库,就像在一个屏障上凿开一个洞.

当某个key在过期的瞬间,有大量的请求并发访问,这类数据一般是热点数据,由于缓存过期,会同时访问数据库来查询最新数据,并且回写缓存,会导致数据库瞬间压力过大.

> 解决方案

**设置热点数据永不过期**

从缓存层面来看,没有设置过期时间,所以不会出现热点key过期后产生的问题

**加互斥锁**

分布式锁:使用分布式锁,保证对于每个key同时只有一个线程去查询后端服务,其他线程没有获得分布式锁的权限,因此只需要等待即可.这种方式将高并发压力转移到了分布式锁,因此对分布式锁的考验很大.

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\1\QQ截图20210705085807.png)

**异步构建缓存**(下面的解释和图片来自链接:https://blog.csdn.net/hu19930613/article/details/114372248)

当缓存失效时，不是立刻去查询数据库，而是先创建缓存更新的异步任务，然后直接返回空值。这种做法不会阻塞当前线程，并且对于数据库的压力基本可控，但牺牲了整体数据的一致性。从实际的使用看，这种方法对于性能非常友好，唯一不足的就是构建缓存时候，所有查询返回的内容均为空值，但是对于一致性要求不高的互联网功能来说这个还是可以忍受。

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210707184510.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\微信截图_20210707184523.png)

### 缓存雪崩

> 概念

缓存雪崩,是指在某一个时间段,缓存集中过期失效 .Redis宕机

产生雪崩的原因之一,比如在写文本的时候,马上就要到双十二零点,很快就会迎来一波抢购,这波商品时间比较集中放入了缓存,假设缓存一个小时,那么到了凌晨一点钟的时候,这批商品的缓存就都过期了.而对这批商品的访问查询,都落到了数据库上,对于数据库而言,就会产生周期性压力波峰.于是所有的请求都会达到存储层,存储层的调用量会暴增,造成存储层也会挂掉的情况.

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Redis笔记\图片\1\QQ截图20210705090719.png)

其实集中过期,倒不是非常致命,比较致命的缓存雪崩,是缓存服务器某个结点宕机或断网,因为自然而然形成的雪崩,一定是在某个时间段集中创建缓存,这个时候,数库据可也是可以顶住压力的,无非就是对数据库产生周期性压力而已(对集中过期的解释).而缓存服务器节点的宕机,对数据库服务器造成的压力是不可预知的,很有可能瞬间就把数据库压垮(对缓存服务器某个结点宕机或断网的解释).

双十一:停掉一些服务(保证主要的服务可用)

> 解决方案

**redis高可用**

这个思想的含义是,既然redis有可能挂掉,那我多增设几台redis,这样一台挂掉之后其他的还可以继续工作,其实就是搭建的集群.(异地多活!)

**限流降级**(在SpringCloud讲解过)

这个解决方案的思想是:在缓存失效后,通过加锁或者队列来控制读数据库写缓存的线程数量,比如对某个key值允许一个线程查询数据和写缓存,其他线程等待.

**数据预热**

数据加热的含义就是在正式部署之前,我先把可能的数据线预先访问一遍,这样部分可能大量访问的数据就会加载到缓存中,在即将发生大并发访问前手动触发加载缓存不同的key,设置不同的过期时间,让缓存失效的时间尽量均匀.

> 小结

资料如何获取:狂神说公众号 :Redis

所有看狂神视频学习的小伙伴,分享或者写笔记的时候,可以带上我的视频连接,表示尊重!



后面课程安排:哔哩哔哩免费直播
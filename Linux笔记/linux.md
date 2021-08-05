* 虚拟机连不上网解决办法

```linux
临时关闭
systemctl stop NetworkManager
永久关闭
systemctl disable NetworkManager
重启
systemctl restart network
```

# 环境搭建

> 安装CentOS(在本地安装,这个不太建议,如果没经济来源,可以考虑本地搭建)

* VMware的使用方式:

# 一切皆文件

* 目录结构

```linux
/bin:bin是Binary的缩写,这个目录存放着最经常使用的命令
/etc:这个目录用来存放所有的系统管理所需要的配置文件和子目录
/home:用户的主目录,在Linux中,每个用户都有一个自己的目录,一般该目录名是以用户的账号命名的
/lib:这个目录是存放系统最初的动态连接共享库,其作用类似于Windows里的DLL文件
/opt:这是给主机额外安装所摆放的目录,比如你安装一个ORACLE数据库则可以放在这个目录
/usr:这是一个非常重要的目录,用户很多应用程序和文件都放在这个目录下,类似于windows下的program files目录
/tmp:这个目录是用来存放一个临时文件的,用完即丢的文件,可以放在这个目录下
```



```linux
创造文件夹 名为:狂神
mkdir kuangshen
移动jdk到狂神目录下
mv jdk-8u221-linux-x64.rpm kuangshen


```

# 常用的基本命令

```linux
cd :切换目录命令!
./:当前目录
cd.. :返回上一级目录
```

* ls

```linux
ls(列出目录)
	-a 参数:all,查看全部的文件,包括隐藏文件
	-l 参数 列出所有的文件,包含文件的属性和权限,没有隐藏we年
	所有Linux命令可以组合使用
```

* cd

```linux
cd../usr  相对路径进入到usr ,比如你在home位置
cd /   以绝对路径回到根目录下
cd /home/xxx 绝对路径跳转
cd ~回到当前的用户目录
```

* pwd :显示当前用户所在的目录
* mkdir

```linux
mkdir 创建文件夹
mkdir test1 创建文件夹1
mkdir -p test2/test3/test4  创建多级目录

```

* rmdir移除项目

```linux
rmdir 仅能删除空的目录,如果下面存在文件,需要先删除文件,
递归删除多个目录-p参数即可
```

* cp(复制文件或者目录)

```linux
cp 原来的地方  要放的地方   如果文件重复,就选择覆盖或者放弃
```

* rm (移除文件或者目录)

```linux
-f 忽略不存在的文件,不会出现警告,强制删除
-r 递归删除目录
-i 互动,删除询问是否删除
参数可以组合

rm -rf / # 系统中所有的文件都被删除了,删库跑路都是这样操作的
```

* mv 移动文件

```java
-f 强制移动
-u 只替换已经更新过的文件

mv  原文件名字 新文文件名字
mv  原文件名字  新文件目录
```

# 基本属性

> 10个字母 第一个代表类型

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\Linux笔记\QQ截图20210621172422.png)

```linux
ls -ll
 显示的d 则是目录
 显示- 则是文件
 显示l 则为连接文档
 显示b 则表示为装置文件里面的可供存储的接口设备
 显示c 则表示为装置文件粒粒面的串行端口设备,列如键盘、鼠标
  接下里9位
  1 4 7代表读权限
  2 5 8代表写权限
  3 6 9位表示可执行权限,如果"x"字符表示,则有执行权限,如果用"-"字符表示,则没有执行权限
  
```

> 修改文件属性

```linux
1.chgrp: 更改文件属组 文件名
chgrp -R root www  把root改为www

chown:更改文件属主,也可以同时更改文件属组
2.chown -R  属主名:属组名 文件名  

```

* **chmod** 

```linux
r:4  	w:2     x:1
可读可写不可执行 rw- 6
可读可写不可执行 rwx 7


chomd 777文件赋予所有用户可读可执行!
```

# 文件内容查看

Linux系统中是用一下命令来查看文件的内容

* cat由第一行开始显示文件内容  用来读文章,或者读取配置文件,都适用cat
* tac从最后一行开始显示,可以看出tac是cat是倒着写 是最后一行变为第一行这种倒着
* nl 显示的时候,顺道输出行号   !  看代码的时候,希望显示行号
* more  一页一页的显示文件内容   (空格代表翻页,enter代表向下看一行)
* less 与more类似,但是比more更好的是,他可以往前翻页! (空格翻页,上下键代表翻动页面                  退出q  ,查找字符号/要查询的字符向下查询,向上查询使用?要查询的字符串 n继续搜寻下一个,N向上寻找)
* head只看头几行 通过-n参数来控制显示几行
* tail只看尾巴几行  -n参数,要查看几行

你可以使用man[命令] 来查看各个命令的使用文档 ,如:man cp

```linux
网络配置目录 cd /etc/sysconfig/network-scripts
ifconfig 查看网络配置 
```

# Linux的连接分为两种:硬链接、软链接

**硬链接:**

>A...B 假设B是A的硬链接,那么他们两个指向了同一个文件!允许一个文件拥有多个路径,用户可以通过这种机制建立硬链接到一些重要文件上,防止误删!

**软链接**:

> 类似Window下的快捷方式,删除的源文件,快捷方式也访问不了!创建连接ln命令!

touch命令创建文件!

```java
echo "i love kuangshen" >>f1把文件输入到f1中去
```



echo输入字符串

```linux
ln f1 f2创建硬链接 f2是f1的硬链接
ln -s f1 f3 创建软链接 f3是f1的软链接
```

```java
总用量 16
-rw-r--r--.  3 root       root         17 6月  21 19:43 f1
-rw-r--r--.  3 root       root         17 6月  21 19:43 f2
-rw-r--r--.  3 root       root         17 6月  21 19:43 f3
lrwxrwxrwx.  1 root       root          2 6月  21 19:42 f4 -> f1
drwx------. 15 guojingwei guojingwei 4096 6月  21 12:34 guojingwei
drwxr-xr-x.  3 root       root         19 6月  21 16:57 kuangshen
drwxr-xr-x.  2 root       root          6 6月  21 16:44 test1
[root@localhost home]# cat f1
i love kuangshen
[root@localhost home]# cat f2
i love kuangshen
[root@localhost home]# cat f4
i love kuangshen
[root@localhost home]# cat f3
i love kuangshen
[root@localhost home]# ^C
    
    
[root@localhost home]# rm -rf f1  //删除f1之后
[root@localhost home]# ls
f2  f3  f4  guojingwei  kuangshen  test1
[root@localhost home]# cat f2  //f2还在
i love kuangshen
[root@localhost home]# cat f4  //f4(软链接、符号链接)快捷方式小时了  不能查看了,这个是软链接
cat: f4: 没有那个文件或目录
[root@localhost home]# 

```



# Vim编辑器

> 什么是Vim编辑器?
>
> Vim通过一些插件可以实现IDE一样的功能!
>
> Vim是从vi发展出来的一个文本编辑器,代码补完、 编译及错误跳转等方便编程的功能特别丰富,在程序员中被广泛使用,尤其是Linux中,必须要会使用Vim(查看内容,编辑内容,保存内容)
>
> Vim是一个程序开发工具,而不是文字处理软件





# 命令模式

i切换到输入模式,以输入字符

x删除当前光标所在出的字符

:切换到底线命令模式,以在最底一行输入命令,如果是编辑模式,需要先退出编辑模式!esc

# 底线命令模式

在命令模式下按下:(英文冒号)就进入了底线命令模式,光标就移动了最底下,就可以在这里输入一些底线命令了!

基本命令有

> q退出程序
>
> w保存文件
>
> wq保存并退出

按esc键即可随和是退出底线命令模式

```linux
vim kuangstudy.txt 如果这个文件存在,就修改这个文件,如果不存在,那就回新建立这个文件
```

* 完整的演示说明

> 新建或者编辑文件,按i进入编辑模式,编写内容,编写完成后退出编辑模式,esc,退出之后进入底线命令模式:wq保存退出!

* 一些命令

>:set nu显示行号
>
>数字<space>横向归移动光标
>
>数字<Enter>竖向移动光标n行
>
>/word 向光标之下寻找一个名称为word的字符串,例如要在档案内搜寻vbird这个字符串,就输入/vbird即可!(常用)
>
>大小写N 这个是英文按键, n为反向进行前一个搜寻动作,例如/vbird后,按下N则表示想上搜寻vbird
>
>u复原前一个动作



# 账户管理学习

> useradd 命令 添加用户

useradd -选项 用户名

```linux
-m:自动动创建这个用户的主目录 /home
-G:给用户分配组!
```

```linux
guojingwei  kuangshen  test1
[root@localhost home]# useradd -m qinjiang  创建一个用户!
ls
[root@localhost home]# ls
guojingwei  kuangshen  qinjiang  test1

```

理解一些本质:Linux中一切皆文件,这里的添加用户说白了就是往某一个文件中写入用户的信息了!/etc/passwd

> 删除用户 userdel

```linux
userdel -r qinjiang 删除用户的时候将他的目录页一并删掉
```

> 修改用户 usermod

修改用户 usermod对应修改的内容

```linux
[root@localhost home]# ls
guojingwei  kuangshen  qinjiang  test1
[root@localhost home]# usermod -d /home/233 qinjiang   修改用户
[root@localhost home]# ls
guojingwei  kuangshen  qinjiang  test1
[root@localhost home]# cat /etc/passwd  查看配置文件

```

>切换用户

1. 切换用户的命令为: su username [username是你的用户名]
2. 从普通用户切换到root用户,还可以使用:sudo su
3. 在终端输入exit或logout或使用快捷方式ctrl+d,可以退回到原来用户,其实crtl+d也是执行exit命令
4. 在切换用户时,如果想在切换用户之后使用新用户的工作环境,可以在su和usernae之间加-,例如:[su -root]

主机名的修改

> hostname             查看当前的用户名
>
> hostname  名字 修改主机名
>
> 修改完毕后,重新连接即可

用户的密码设置

> 我们一般通过root创建用户的时候!要配置密码
>
> Linux输入密码是不会显示的,你正常输入就可以,并不是系统问题

在公司中,你们一般拿不到公司服务器的root权限,都是一些账号

> 如果是超级用户的电话:
>
> passwd userrname:
>
> new password:
>
> re password:

如果是普通用户

> passwd
>
> UNIX password:
>
> new password: # 密码不能过于简单
>
> re password:

锁定账户:

> 比如张三辞职了,冻结这个账号,一旦冻结,这个人就登录不上系统了
>
> passwd -l guojingwei # 锁定这个用户就不能登录了
>
> passwd -d guojingwei 

公司中,你一般触及不到root用户! 作为一个开发一般你拿不到!

这以上的基本命令,大家必须要掌握!自己玩的时候可以使用来学习!Linux是一个多用户的系统

# 用户组管理

属主、属组

> 每个用户都有一个用户组,系统可以对一个用户组中所有用户进行集中管理(开发、测试、运维、root),不同Linux系统对用户组的规定有所不同,如Linux下的用户属于与它同名的用户组,这个用户组创建时同时创建
>
> 用户组的管理涉及用户组的添加、删除和修改.  组的增加,删除和修改实际上就是对/etc/group文件的更新

* 创建一个用户组groupadd

>groupadd kuangshen
>
>cat /etc/group

创建用户组后可以得到一个组的id,这个id是可以指定的! -g 520  如果不指定就是自增

> groupadd -g 520 kuangshen2   

* 删除用户组groupdel

>[root@localhost /]# groupdel kuangshen2
>[root@localhost /]# cat /etc/group.

* 修改用户组的权限信息和名字 groupmod

> groupmod -g -n
>
> groupmod -g 666 -n newkuangshen kuangshen
>
>  					端口号		新的名字			原来的名字

> 用户如果要切换用户组怎么办?

```linux
# 登录当前用户 qinjiang
$ newgrp root
```

* 拓展:文件的查看!(了解即可)

/etc/passwd

> 用户名:口令(登录密码,我们不可见):用户标识号:注释性描述:主目录:登录shell

这个文件中的每一行都代表这一个用户,我们可以从这里看出这个用户的主目录在哪里? 可以看到属于那一个组!

  登录口令:把真正加密后的用户口令放到/etc/shadow文件中,保证我们密码的安全性!

# 磁盘管理

> df(列出文件系统中磁盘使用量) du(检查当前磁盘空间使用量!)

```linux
[root@localhost home]# df
文件系统                   1K-块    已用     可用 已用% 挂载点
devtmpfs                  919436       0   919436    0% /dev
tmpfs                     936380       0   936380    0% /dev/shm
tmpfs                     936380   10392   925988    2% /run
tmpfs                     936380       0   936380    0% /sys/fs/cgroup
/dev/mapper/centos-root 17811456 4883176 12928280   28% /
/dev/sda1                1038336  171608   866728   17% /boot
tmpfs                     187280      32   187248    1% /run/user/0
/dev/sr0                  996038  996038        0  100% /run/media/root/CentOS 7 x86_64
tmpfs                     187280       0   187280    0% /run/user/1000
[root@localhost home]# df -h
文件系统                 容量  已用  可用 已用% 挂载点
devtmpfs                 898M     0  898M    0% /dev
tmpfs                    915M     0  915M    0% /dev/shm
tmpfs                    915M   11M  905M    2% /run
tmpfs                    915M     0  915M    0% /sys/fs/cgroup
/dev/mapper/centos-root   17G  4.7G   13G   28% /
/dev/sda1               1014M  168M  847M   17% /boot
tmpfs                    183M   32K  183M    1% /run/user/0
/dev/sr0                 973M  973M     0  100% /run/media/root/CentOS 7 x86_64
tmpfs                    183M     0  183M    0% /run/user/1000
[root@localhost home]# 
```

```linux
du -a可以加参数
[root@localhost home]# cd /bin 
[root@localhost bin]# du
149092	.

Try 'du --help' for more information.
[root@localhost home]# du -sm /*   查看根目录下每个目录占用的容量
0	/bin
136	/boot
0	/dev
42	/etc
177	/home
0	/lib
0	/lib64
0	/media
0	/mnt
0	/opt
du: 无法访问"/proc/9213/task/9213/fd/3": 没有那个文件或目录
du: 无法访问"/proc/9213/task/9213/fdinfo/3": 没有那个文件或目录
du: 无法访问"/proc/9213/fd/3": 没有那个文件或目录
du: 无法访问"/proc/9213/fdinfo/3": 没有那个文件或目录
0	/proc
41	/root
1042	/run
0	/sbin
0	/srv
0	/sys
1	/tmp
3829	/usr  # 系统初期最大的就是我们的用户目录,因为很多文件和程序都在这里面
582	/var
[root@localhost home]# 

```

> Mac或者想使用Linux挂载我们的一些本地磁盘或者文件!

挂载:mount

```linux
mount /dev/kuangshen/mnt/kuangshen
将外部设备kuangshen  挂载到mnt目录,来实现访问
```

卸载:umount -f[名字] 强制卸载 



# 进程管理

Linux中一切皆文件(文件:读写执行(增删改查编辑复制),权限(用户、用户组).系统:(磁盘、进程、图形化操作))

对于我们开发人员来说,其实Linux更多偏向使用即可!



> 基本概念

1. 在linux中,每一个程序都有一个进程,每一个进程都有一个id号
2. 每一个进程,都有一个父进程!
3. 进程可以有两种存在方式,一种是前台,后台运行
4. 一般的话服务就是后台运行的,基本的程序都是前台运行

> 命令

ps 查看当前系统正在执行的各种进程的信息!

```linux
ps -xx:
	-a:显示当前终端运行的所有继承信息(当前进程一个)
	-u:以用户的信息显示进程
	-x 显示后台运行进程的参数!
```

> ps -aux 查看所有的进程
>
> ps -aux|  grep mysql
>
> ps -aux|  grep java 
>
> #|在Linux这个叫做管道符 A|B
>
> #grep查找文件中符合条件的字符串

对于我们来说,这里目前主需要记住一个即可 ps -xx|grep 进程名字!过来进程信息

ps -ef:可以查看父进程的信息

> ps -ef|group root  # 看父进程我们一般可以通过目录数查看!



# 

> 进程数
>
> pstree -pu  
>
> ​	-p 显示父id
>
> ​	-u 显示用户组 



结束进程:杀掉进程,等价于window结束任务!

> kill -9 进程的id
>
> 但是啊,我们平时写的一个java死循环了,可以选择结束进程!杀进程

表示强制结束该进程!

 将java程序打包发的时候讲解! nohup,代表后台执行程序

# 环境安装

安装软件一般有三种方式:

* rpm (jdk:在线发布一个springBoot项目)
* 解压缩  (tomcat,启动并通过外网访问,发布网站)
*  yum在线安装(docker:直接安装运行跑起来docker就可以!)

# JDK安装

我们开发java程序必须要的环境!

安装java环境

```linux
# 检测当前系统是否存在java环境! java -version
# 如果有的话就需要卸载
# rpm -qa|grep jdk #检查jdk版本信息
# rpm -e --nodeps jdk_

# 卸载完毕后安装jdk
# rpm -ivk rpm包
# 配置环境变量!
```

环境变量配置:/etc/profile在文件的最后面增加java配置和window 安装环境变量一样!

```linux
JAVA_HOME=/usr/java/jdk1.8.0_221-amd64
CLASSPATH=%JAVA_HOME%/lib:%JAVA_HOME%/jre/lib
PATH=$PATH:$JAVA_HOME/bin:$JAVA_HOME/jre/bin
export PATH CLASSPATH JAVA_HOME
```

* 防火墙的一些设置 看公众号

# Tomcat安装

ssm war 就需要放到tomcat中运行!

1.下载tomcal ,官网下载tomcat9 apache-tomcat-9.0.22.tar.gz

2.解压这个文件

> tar -zxvf apache-tomcat-9.0.22.tar.gz

3. 启动tomcat

> ./xxx.sh  脚本即可运行

```linux
# 执行: ./startup.sh
# 停止: ./shutdown.sh
```

# Docket安装

1. 检测CentOs 7

2. 安装我们的准备环境

```linux
yum -y install 包名  # yum install 安装命令 -y 所有的提示都为y
yum -y install gcc 
yum -y install gcc-c++
```

3. 清楚以前的版本  ! 根据网站安装即可,不需要在这里写了





# 基本命令失效的时候

1. 可能配置环境变量的时候出现了问题

```java
PATH=/bin:/usr/bin  命令中输这句话就行
```

1、下载JDK rpm。

> rpm -ivh 包名   安装
>
> 配置环境变量  /etc/profile
>
> JAVA_HOME=/usr/javak1.8.0_221-amd64
>
> CLASSPATH=%JAVA_HOME%b:%JAVA_HOME%/jreb
>
> PATH=$PATH:$JAVA_HOME/bin:$JAVA_HOME/jre/bin    ($代表取值)**不能省略$PATH否则系统命令会被覆盖，在/root/.bash_profile**
>
> export PATH CLASSPATH JAVA_HOME
>
> source /etc/profile   让配置生效

如果写错的解决办法  **进到/usr/bin目录下,然后使用./sudo su命令**

**注意在部署项目时要将项目使用的端口打开**
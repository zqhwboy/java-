# JDBC概述

* JDBC是什么?

Java DataBase Connectivity(Java语言连接数据库)

* JDBC本质是什么?

JDBC是SUN公司制定的一套**接口(interface)**

java.sql.*;(这个软件包下有很多接口)

**接口都有调用者和实现者.**

面向接口调用、面向接口写实现类,这都属于面向接口编程

* 为什么要面向接口编程?

**解耦合:降低程序的耦合度,提高程序的扩展力**

多态机制就是非常典型的:面向抽象编程.(不要面向具体编程)

* 思考:为什么SUN指定一套JDBC接口呢?

>因为每一个数据库的底层实现原理都不一样.
>
>Oracle数据库有自己的原理
>
>Mysql数据库也有自己的原理
>
>...
>
>每一个数据库产品都有自己独特的实现原理

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\jdbc笔记\图片\QQ截图20210605105835.png)

* JDBC开发前的准备工作,先从官网下载对应的驱动jar包,然后将其配置到环境变量classpath中

> classPath=.; D:......\mysql-connector-java-5.1.37.jar

以上的配置是针对于文本编辑器的方式开发,使用idea工具的时候,不需要配置以上环境变量

# **JDBC编程六步(需要背会)**

1. 第一步:注册驱动(告诉Java程序,即将要连接的是哪个品牌的数据库)
2. 第二步:获取连接(表示JVM的进程和数据库进程之间通道打开了,这属于进程之间的通信,重量级的,使用完之后一定要关闭通道)
3. 第三步:获取数据库操作对象(专门执行sql语句的对象)
4. 第四步:执行SQL语句(DQL、DML..)
5. 处理查询结果集(只有当第四步执行的select语句的时候,才有第五步处理查询结果集)
6. 释放资源(使用完资源之后一定要关闭资源.Java和数据库属于进程间的通信,开启之后一定要关闭.) 

# 练习

* 练习JDBC插入(在记事本中写的,没运行,有可能有错)  下面这中注册驱动方式不是常用的

```java
public class JDBCTest01{
	public static void main(String[] args){
		Connection conn=null;
		Statement stmt=null;
		try{
				//1.注册驱动
				Driver driver=new com.mysql.jdbc.Driver();//多态,父类型引用指向子类型对象
				DriverManager.registerDrivver(driver);

				//2.获取连接
				String url="jdbc.mysql://127.0.0.1:3306/db1;
				String user="root";
				String password="mima";
				conn=DriverManager.getConnection(url,user,password);
				//3.获取数据库操作对象(Statement专门执行sql语句的)
				stmt = conn.createStatement();
				//4.执行sql
				String sql="insert into dept(deptno,dname,loc) values(x,x,x)"
				//专门执行DML语句的
				//返回值是"影响数据库中的记录条数"
				int count=stmt.executeUpdate(Sql);
				//5.处理查询结果集
		}cathch(Exception e){
			e.printStackTrace();
		}finally{
			//6.释放资源
			//为了保证资源一定释放,在finally语句块中关闭资源
			//并且要遵循从小到大一次关闭
			//分别对其try-catch
			try{
				if(stmt!=null)
					stmt.close();
			}catch{SqlException e}{
				e.pringStackTrace();
			}
			try{
				if(conn!=null)
					conn.close();
			}catch(SqlException e){
				e.pringStackTrace();
			}
			
		}
	}
	
} 
```

* **常用的注册驱动的方式**(重点)

```java
1.注册驱动
 class.forName("com.mysql.jdbc.Driver"); //这个方法的执行会导致后面类的加载,类加载的时候静态代码块会执行,静态代码块里刚好有
```

* mysql下的Driver类静态代码块里有注册驱动,所以我们只需要通过反射让类加载,然后静态代码快会执行

```java
public class Driver extends NonRegisteringDriver implements java.sql.Driver {
    //
    // Register ourselves with the DriverManager
    //
    static {
        try {
            java.sql.DriverManager.registerDriver(new Driver());
        } catch (SQLException E) {
            throw new RuntimeException("Can't register driver!");
        }
    }
```

* 通过绑定配置文件实现

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\jdbc笔记\图片\微信截图_20210605155718.png)

```java
public class JDBCTest01{
	public static void main(String[] args){
		Connection conn=null;
		Statement stmt=null;
		ResultSet rs=null;
		try{
				//1.注册驱动
				class.froName("com.mysql.jdbc.Driver");
				//2.获取连接
				String url="jdbc.mysql://127.0.0.1:3306/db1;
				String user="root";
				String password="mima";
				conn=DriverManager.getConnection(url,user,password);
				//3.获取数据库操作对象(Statement专门执行sql语句的)
				stmt = conn.createStatement();
				//4.执行sql
				String sql="select name as a,password,id  from emp;"
				//专门执行DQL语句的
				rs=stmt.executeQuery(Sql);
				//5.处理查询结果集re.next()返回true代表有数据
				while(rs.next()){  //get(1) 2 3 代表的是第几列数据,也可以通过列名去查
					//String name=rs.getString(1);
					String name=rs.getString("a"); //最终查询结果的列名称,如果有别名,那么他查的列名就是别名
					//还可以以数据类型调用数据
					String password=rs.getDouble(2);
					String password=rs.getDouble("password");
					String password=rs.getString(2);
					
					String id=rs.getString(3);
				}
		}cathch(Exception e){
			e.printStackTrace();
		}finally{
			//6.释放资源
			//为了保证资源一定释放,在finally语句块中关闭资源
			//并且要遵循从小到大一次关闭
			//分别对其try-catch
			try{
				if(rs!=null)
					rs.close();
			}catch{SqlException e}{
				e.pringStackTrace();
			}
			try{
				if(stmt!=null)
					stmt.close();
			}catch{SqlException e}{
				e.pringStackTrace();
			}
			try{
				if(conn!=null)
					conn.close();
			}catch(SqlException e){
				e.pringStackTrace();
			}
			
		}
	}
	
}
```

# 完成一个业务

```
/*1.模拟用户登录功能的实现.
* 2.业务描述:
*   程序运行的时候,提供一个输入的入口,可以用来输入用户名和密码
*   用户输入用户名和密码之后,提交信息,Java程序收集到用户信息
*   Java程序连接数据库验证用户名和密码是否合法
*   合法:显示登陆成功
*   不合法:显示登陆失败
* 3.数据的准备
*   在实际开发中,表的设计会使用专业的建模工具,我们这里安装一个建模工具
*   PowerDesigner 使用PD工具来进行数据库表的设计
* 4.当前存在的问题sql注入(黑科经常使用)
* 5.导致sql注入根本原因:
*   用户输入的信息中含有sql语句的关键字,并且这些关键字参与了sql语句的编译过程
*   导致sql语句愿意被扭曲了,进而达到了sql注入.
*       */
```

* 数据库建表

```sql
drop table t_user;
create table t_user(
	id bigint auto_increment,
	login_name varchar(255),
	login_pwd VARCHAR(255),
	real_name VARCHAR(255),
	PRIMARY key (id)
);
insert into t_user(login_name,login_pwd,real_name) values("zhangsan",'123',"张三");
insert into t_user(login_name,login_pwd,real_name)  values("jack",'123',"杰克");

select * from t_user;
```

* 代码(存在sql注入的问题)

```java
/*1.模拟用户登录功能的实现.
* 2.业务描述:
*   程序运行的时候,提供一个输入的入口,可以用来输入用户名和密码
*   用户输入用户名和密码之后,提交信息,Java程序收集到用户信息
*   Java程序连接数据库验证用户名和密码是否合法
*   合法:显示登陆成功
*   不合法:显示登陆失败
* 3.数据的准备
*   在实际开发中,表的设计会使用专业的建模工具,我们这里安装一个建模工具
*   PowerDesigner 使用PD工具来进行数据库表的设计
* 4.当前存在的问题sql注入(黑科经常使用)
* 5.导致sql注入根本原因:
*   用户输入的信息中含有sql语句的关键字,并且这些关键字参与了sql语句的编译过程
*   导致sql语句愿意被扭曲了,进而达到了sql注入.
*       */

import java.sql.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class JDBCTest06 {
    public static void main(String[] args) {
        //初始化一个界面
        Map<String,String> userLoginInfo = initUI();
        //验证用户名和密码
        boolean loginSuccess = login(userLoginInfo);
        //输出结果
        System.out.println(loginSuccess?"登录成功":"登录失败");
    }
    /**
     * 用户登录
     * userLoginInfo 用户登录信息
     * false:表示失败:true表示成功
     */

    private static boolean login(Map<String, String> userLoginInfo) {
        //JDBC代码
        Connection conn=null;
        Statement stmt=null;
        ResultSet rs=null;
        //自定义变量
        String loginName=userLoginInfo.get("loginName");
        String loginPwd=userLoginInfo.get("loginPwd");
        boolean loginFlag=false;

        try {
            //1. 注册驱动
            Class.forName("com.mysql.jdbc.Driver");
            //2. 获取连接
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/db2", "root", "root");
            //3. 获取操作数据库对象
             stmt= conn.createStatement();
            //4. 执行sql
            String sql="select * from t_user where login_name='"+loginName+"' and login_pwd='"+loginPwd+"';";
            //以上正好完成了sql语句的拼接,一下代码的含义是,发送sql语句给DBMS,DBMS进行sql编译
            //正好将用户提供的"非法信息"编译进去,导致了原sql语句的含义被扭曲了.
            rs = stmt.executeQuery(sql);
            //5. 处理结果集
            if(rs.next()){
               loginFlag=true;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            //6. 释放资源
            if(rs!=null){
                try {
                    rs.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if(stmt!=null){
                try {
                    stmt.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if(conn!=null){
                try {
                    conn.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
        }
        return loginFlag;
    }

    /*
    * 初始化用户界面
    * 用户输入用户名和密码登录信息*/
    private static Map<String, String> initUI() {
        Scanner sc = new Scanner(System.in);
        System.out.println("用户名:");
        String loginName = sc.nextLine();
        System.out.println("密码");
        String loginPwd = sc.nextLine();
        HashMap<String, String> map = new HashMap<>();
        map.put("loginName",loginName);
        map.put("loginPwd",loginPwd);
        return map;
    }


}

```

* 解决sql注入问题?

  >只要用户提供的信息不参与SQL语句的编译过程,问题就解决了
  >
  >即使用户提供的信息中含有SQL语句的关键字,但是没有参与编译,不起作用
  >
  >要想用户信息不参与SQL语句的编译,那么必须使用java.sql.PreparedStatement继承了java.sql.Statement
  >
  >PreparedStatement:属于预编译的操作数据库对象
  >
  >PreparedStatement的原理是:预先对SQL语句的框架进行编译,然后在给SQL语句传"值",
  >
  >
  >
  >222' or '1'='1
  >登录失败

```java


import java.sql.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class JDBCTest06 {
    public static void main(String[] args) {
        //初始化一个界面
        Map<String,String> userLoginInfo = initUI();
        //验证用户名和密码
        boolean loginSuccess = login(userLoginInfo);
        //输出结果
        System.out.println(loginSuccess?"登录成功":"登录失败");
    }
    /**
     * 用户登录
     * userLoginInfo 用户登录信息
     * false:表示失败:true表示成功
     */

    private static boolean login(Map<String, String> userLoginInfo) {
        //JDBC代码
        Connection conn=null;
        PreparedStatement ps=null;  //这里是预编译的数据库操作对象
        ResultSet rs=null;
        //自定义变量
        String loginName=userLoginInfo.get("loginName");
        String loginPwd=userLoginInfo.get("loginPwd");
        boolean loginFlag=false;

        try {
            //1. 注册驱动
            Class.forName("com.mysql.jdbc.Driver");
            //2. 获取连接
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/db2", "root", "root");
            //3. 获取预编译的数据库操作对象
            //SQL语句的框架,其中一个?,表示一个占位符,将来接收一个"值",注意:占位符不能使用单引号括起来.
            String sql="select * from t_user where login_name=? and login_pwd=?"; //sql语句框架
            //程序执行到此处,会发送sql语句的框子给DBMS,然后DBMS进行sql语句的预先编译
            ps= conn.prepareStatement(sql);
            //给占位符?传值(第一个问题下标是1,第二个问号下标是2,JDBC中所有下标从1开始)
            ps.setString(1,loginName);
            ps.setString(2,loginPwd);
            //4. 执行sql
            rs = ps.executeQuery();
            //5. 处理结果集
            if(rs.next()){
               loginFlag=true;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            //6. 释放资源
            if(rs!=null){
                try {
                    rs.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if(ps!=null){
                try {
                    ps.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if(conn!=null){
                try {
                    conn.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
        }
        return loginFlag;
    }

    /*
    * 初始化用户界面
    * 用户输入用户名和密码登录信息*/
    private static Map<String, String> initUI() {
        Scanner sc = new Scanner(System.in);
        System.out.println("用户名:");
        String loginName = sc.nextLine();
        System.out.println("密码");
        String loginPwd = sc.nextLine();
        HashMap<String, String> map = new HashMap<>();
        map.put("loginName",loginName);
        map.put("loginPwd",loginPwd);
        return map;
    }


}

```

* 对比Statement和PrepareStatement

1. Statement有sql注入问题     编译一次执行一次

2. PrepareStatement解决了sql注入问题    编译一次可以执行多次

3. PrepareStatement会在编译时候做类型的安全检查

综上所述:PrepareStatement使用较多,只有极少数的情况下需要使用Statement



* 什么情况下必须使用Statement

业务方面要求必须执行SQL注入的时候

Statement支出SQL注入,凡是业务方面要求进行sql语句拼接的时候,必须使用Statement

比如排序的时候一会要求desc ,一会要变asc,当然不能用PrepareStatement,没法把字母传过去,传字符么会自动加个'',传数字的话没'',但是要的是字母不是数字

* 演示Statement的用途,PrepareStatement确办不到

```java
import java.sql.*;
import java.util.Scanner;

public class JDBCTest08 {
    public static void main(String[] args) {
        //用户控制台输入desc就是降序,输入asc就是升序
        Scanner sc = new Scanner(System.in);
        System.out.println("请输入desc或asc,desc:降序,asc:升序");
        String keyWords = sc.nextLine();

        //执行sql
        Connection conn=null;
        Statement stmt=null;
        ResultSet rs=null;


        try {
            //1.注册驱动
            Class.forName("com.mysql.jdbc.Driver");
            //2.获取连接
            conn= DriverManager.getConnection("jdbc:mysql://localhost:3306/db2","root","root");
            //获取数据库操作对象
            stmt=conn.createStatement();
            //执行sql
            String sql="select * from emp order by id "+keyWords;
            rs = stmt.executeQuery(sql);
            while (rs.next()){
                System.out.println(rs.getString("id"));
            }



        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            //6. 释放资源
            if(rs!=null){
                try {
                    rs.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if(stmt!=null){
                try {
                    stmt.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if(conn!=null){
                try {
                    conn.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
        }
    }
}

```



# JDBC事务机制

1. JDBC中的事物是自动提交的,什么是自动提交?

   只要执行任意一条DML语句,则自动提交一次,这是JDBC默认的事务行为,但是实际的业务当中,通常都是N条DML语句共同联合才能完成的,必须保证他们这些DML语句在同一个事务中同时成功或者同时失败.

2. 以下程序来验证JDBC的事务是否是自动提交机制!

测试结果:JDBC只要执行任意一条DML语句,就提交一次

```java
import java.sql.*;

public class JDBCTest08 {
    public static void main(String[] args) {

        //执行sql
        Connection conn=null;
        PreparedStatement ps=null;
        ResultSet rs=null;


        try {
            //1.注册驱动
            Class.forName("com.mysql.jdbc.Driver");
            //2.获取连接
            conn= DriverManager.getConnection("jdbc:mysql://localhost:3306/db2","root","root");
            //获取预编译的数据库操作对象
            String sql="update t_user set login_name=? where id= ?";
            ps=conn.prepareStatement(sql);
            //指定第一条sql语句
            ps.setString(1,"z");
            ps.setInt(2,1);
            int count = ps.executeUpdate();
            System.out.println(count);
            //重新给占位符传值
            ps.setString(1,"y");
            ps.setInt(2,2);
            count = ps.executeUpdate();
            System.out.println(count);

            //执行sql


            while (rs.next()){
                System.out.println(rs.getString("id"));
            }



        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            //6. 释放资源
            if(rs!=null){
                try {
                    rs.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if(ps!=null){
                try {
                    ps.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if(conn!=null){
                try {
                    conn.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
        }
    }
}

```



* 用事务解决

```
conn.setAutoCommit(false);    //开启事务
conn.commit();     //提交事务     
conn.rollback();    //回滚事务    
```

```java
import java.sql.*;
/*
*
* sdfasdjk
* asdjhf
* */
public class JDBCTest08 {
    public static void main(String[] args) {




        //执行sql
        Connection conn=null;
        PreparedStatement ps=null;
        ResultSet rs=null;


        try {
            //1.注册驱动
            Class.forName("com.mysql.jdbc.Driver");
            //2.获取连接
            conn= DriverManager.getConnection("jdbc:mysql://localhost:3306/db2","root","root");
            //将自动提交机制修改为手动提交
            conn.setAutoCommit(false);    //开启事务

            //获取数据库操作对象
            String sql="update t_user set login_name=? where id= ?";
            ps=conn.prepareStatement(sql);
            //指定第一条sql语句
            ps.setString(1,"1000");
            ps.setInt(2,1);
            int count = ps.executeUpdate();
            System.out.println(count);

//            String s=null; //制造空指针异常
//            s.toString();

            //重新给占位符传值
            ps.setString(1,"500");
            ps.setInt(2,2);
            count += ps.executeUpdate();
            System.out.println(count==2?"转账成功":"转账失败");   
            conn.commit();     //提交事务

        } catch (Exception e) {
            if(conn!=null) {
                try {
                    conn.rollback();    //回滚事务
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            e.printStackTrace();
        }finally {
            //6. 释放资源
            if(rs!=null){
                try {
                    rs.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if(ps!=null){
                try {
                    ps.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if(conn!=null){
                try {
                    conn.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
        }
    }
}
```

# JDBC工具类的封装

>工具类中的构造方法都是私有的
>
>因为工具类中当中的方法都是静态的,不需要new对象,直接采用类名调用



```java
import java.sql.*;

public class DBUtil {
    private DBUtil(){}
    //静态代码块在类加载时执行,并且只执行一次
    static {
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }


    //获取数据库连接对象,返回连接对象
    public static Connection getConnection()throws SQLException{
        return DriverManager.getConnection("jdbc:mysql://localhost:3306/db2");
    }

    //关闭资源  conn:连接对象  ps:数据库操作对象  rs:结果集对象
    public static void close(Connection conn, Statement ps, ResultSet rs){
        if(rs!=null){
            try {
                rs.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if(ps!=null){
            try {
                ps.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if(conn!=null){
            try {
                conn.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }



}
```

# JDBC模糊查询

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class JDBCTest11 {

    public static void main(String[] args) {
        Connection conn=null;
        PreparedStatement ps=null;
        ResultSet rs=null;
        try{
            //获取连接
            conn=DBUtil.getConnection(); //DBUtil加载时静态代码块执行自动注册驱动
            //获取预编译的数据库操作对象
            //不能写成  _?%
            String sql="select * from t_user where real_name like ?";
            ps=conn.prepareStatement(sql);
            ps.setString(1,"_三%");
            rs=ps.executeQuery();
            while (rs.next()){
                System.out.println(rs.getString("id"));
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally{
            DBUtil.close(conn,ps,rs);
        }
    }
}
```

# 行级锁(悲观锁)

**(行级锁:在select 后面的语句添加for update就行了)**

**悲观锁:事务必须排队执行,数据锁住了,不运行并发.**

```sql
select ename from emp where sex='男' for update;
那么emp表中性别为男的每个记录(不单是ename被锁住了,是整个行都被锁住了)都被锁住了,
```

**乐观锁:支持并发,事务也需要排队,只不过需要一个版本号.**

>事务1-->读取到版本号1.1
>
>事务2-->读取到版本号1.1
>
>其中事务1先修改了,修改之后看了眼版本号是1.1,于是提交修改的 数据,将版本号修改为1.2
>
>其中事务2后修改的,修改之后准备提交数据的时候,发现版本号是1.2,和它最初读的版本号是不一致的,回滚



* **这个程序开启一个事务,这个事务专门进行查询,并且使用行级锁/悲观锁,锁住相关记录**

```
/*
* 这个程序开启一个事务,这个事物专门进行查询,并且使用行级锁/悲观锁,锁住相关记录*/

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class JDBCTest13 {
    public static void main(String[] args) {
        Connection conn=null;
        PreparedStatement ps=null;
        ResultSet rs=null;
        try {
            conn=DBUtil.getConnection();
            //开启事务
            conn.setAutoCommit(false);
            String sql="select * from t_user where real_name = ? for update";
            ps=conn.prepareStatement(sql);
            ps.setString(1,"张三");
            rs=ps.executeQuery();
            while(rs.next()){
                System.out.println(rs.getString(1));
            }
            //提交事务 (事务结束)
            conn.commit();  //在这里打断点,然后运行下面那个类,下面类一直执行不了,只要这个类让他运行完,那么下面那个类就会成功运行结束
        } catch (SQLException throwables) {
            if(conn!=null){
                try {
                    //回滚事务(事务结束)
                    conn.rollback();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            throwables.printStackTrace();
        }finally {
            DBUtil.close(conn,ps,rs);
        }

    }
}
```

* **这个程序负责修改被锁定的记录** 

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class JDBCTest14 {
    public static void main(String[] args) {
        Connection conn=null;
        PreparedStatement ps=null;

        try {
            conn=DBUtil.getConnection();
            conn.setAutoCommit(false);
            String sql="update t_user set login_name='哈哈' where real_name =? ";
            ps=conn.prepareStatement(sql);
            ps.setString(1,"张三");
            int count = ps.executeUpdate();
            System.out.println(count);
            conn.commit();
        } catch (SQLException throwables) {
            if(conn!=null){
                try {
                    conn.rollback();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            throwables.printStackTrace();
        }finally {
            DBUtil.close(conn,ps,null);
        }
    }
}
```


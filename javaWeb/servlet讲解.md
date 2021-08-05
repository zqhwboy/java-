# servlet

servlet接口Sun公司有两个默认的实现类HttpServlet、

# Maven环境优化

1.  修改web.xml为最新的

```java
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
          http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0"
          metadata-complete="true">
</web-app>
```

# 编写一个Servlet程序

1. 编写一个普通类
2. 实现Servlet接口,我们直接继承HttpServlet

```java
package com.kuang.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class HelloServlet extends HttpServlet {
    //由于get或者post只是请求实现的不同的方式,可以相互调用,业务逻辑都一样
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        PrintWriter writer = resp.getWriter();//响应流
        writer.print("hello,Servlet啊");

    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}

```





# 编写Servlet映射

为什么需要映射,我们写的是Java程序,但是通过浏览器访问,而浏览器需要连接web服务器,所以我们需要再往web服务中注册我们写的Servlet,还需给他一个浏览器能够访问的路径;

web.xml配置

```xml
 <!--注册Servlet-->
    <servlet>
        <servlet-name>hello</servlet-name>
        <servlet-class>com.kuang.servlet.HelloServlet</servlet-class>
    </servlet>
    <!--Servlet的请求路径-->
    <servlet-mapping>
        <servlet-name>hello</servlet-name>
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>
```

# 配置Tomcat

# 启动测试OK



# Servlet原理

Servlet原理是Web服务器调用,web服务器在收到浏览器请求之后,会:

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\servlet笔记\图片\QQ截图20210607142152.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\servlet笔记\图片\QQ截图20210607142445.png)

## Mapping问题

1. 一个Servlet可以指定一个映射路径

```xml
 <!--注册Servlet-->
    <servlet>
        <servlet-name>hello</servlet-name>
        <servlet-class>com.kuang.servlet.HelloServlet</servlet-class>
    </servlet>
    <!--Servlet的请求路径-->
    <servlet-mapping>
        <servlet-name>hello</servlet-name>
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>
```

1. 一个Servlet可以指定多个映射路径

```xml
 <servlet>
        <servlet-name>hello</servlet-name>
        <servlet-class>com.kuang.servlet.HelloServlet</servlet-class>
    </servlet>
    <!--Servlet的请求路径-->
    <servlet-mapping>
        <servlet-name>hello</servlet-name>
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>
  <servlet-mapping>
        <servlet-name>hello</servlet-name>
        <url-pattern>/hello2</url-pattern>
    </servlet-mapping>
```



1. 一个Servlet可以指定通用映射路径

```xml
 <!--注册Servlet-->
    <servlet>
        <servlet-name>hello</servlet-name>
        <servlet-class>com.kuang.servlet.HelloServlet</servlet-class>
    </servlet>
    <!--Servlet的请求路径-->
    <servlet-mapping>
        <servlet-name>hello</servlet-name>
        <url-pattern>/hello/*</url-pattern>  
    </servlet-mapping>
```

默认请求路径

```xml
 <!--注册Servlet-->
    <servlet>
        <servlet-name>hello</servlet-name>
        <servlet-class>com.kuang.servlet.HelloServlet</servlet-class>
    </servlet>
    <!--Servlet的请求路径-->
    <servlet-mapping>
        <servlet-name>hello</servlet-name>
        <url-pattern>/*</url-pattern>   //回复过tmcat自带的首页干掉
    </servlet-mapping>
```

1. 指定一些后缀或者前缀等等..

```xml
//*前面不能加项目映射路径   
<servlet-mapping>
        <servlet-name>hello</servlet-name>
        <url-pattern>*.qinjiang</url-pattern>   //回复过tmcat自带的
    </servlet-mapping>
```

**优先级问题**

**指定了固有的映射路径优先级最高,如果找不到就会走默认的处理请求**

# ServletContext

web容器在启动的时候,它会为每个web程序都创建一个对应的ServletContext对象,他代表了当前的web应用

* **共享数据**
* **获取初始化参数**
* **请求转发**
* **读取资源文件**

我在这个Servlet中保存的数据,可以在另外一个servlet中拿到

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\servlet笔记\图片\QQ截图20210607150432.png)

```java
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //this.getInitParameter()  //初始化参数
        //this.getServletConfig(); //Servlet配置
        this.getServletContext() ;//Servlet上下文
        ServletContext context = this.getServletContext();
        String username="琴江";
        context.setAttribute("username",username); //将一个数据保存在ServletContext中,名字为username 值为username
        System.out.println("hello");;

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
```

* 读取的类

```java
 @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletContext context = this.getServletContext();//这个context全局唯一
        String username = (String) context.getAttribute("username");

        resp.setContentType("text/html");
        resp.setCharacterEncoding("utf-8");
        System.out.println(username);
        resp.getWriter().print("名字"+username);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
```

```xml
 <!--注册Servlet-->
    <servlet>
        <servlet-name>hello</servlet-name>
        <servlet-class>com.kuang.servlet.HelloServlet</servlet-class>
    </servlet>
    <!--Servlet的请求路径-->
    <servlet-mapping>
        <servlet-name>hello</servlet-name>
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>getc</servlet-name>
        <servlet-class>com.kuang.servlet.GetServlet</servlet-class>
    </servlet>
    <!--Servlet的请求路径-->
    <servlet-mapping>
        <servlet-name>getc</servlet-name>
        <url-pattern>/getc</url-pattern>
    </servlet-mapping>
```

* 测试访问

## 读取资源文件

Properties

* 在java目录下新建properties
* 在resource目录下新建properties

发现:都被打包到了同一个路径下:classes,我们俗称这个路径为classpath

思路:需要一个文件流;

# HttpServletResponse

web服务器接收到哭护短的http请求,针对这个请求,分别创建一个代表请求的HttpServletRequest对象,代表响应一个HttpServletRequest

* 如果要获取客户端传过来的参数,找HttpServletRequest
* 如果要给客户端响应一些信息:找HttpServletRequest

# request应用

获取前端参数

请求转发

转发时候第一个/代表当前的web应用,不加其实默认就是当前目录
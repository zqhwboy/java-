* cookie

客户端技术

```java

//保存用户上一次访问的时间
public class CookieDemo1 extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //服务器,告诉你,你来的时间,把这个时间封装成一个信件,你下次带来
         req.setCharacterEncoding("UTF-8");
         resp.setCharacterEncoding("sessiontest");

        PrintWriter out = resp.getWriter();
        //cookide服务器端从客户端获取
        Cookie[] cookies = req.getCookies();//这里返回数组,说明cookie可能存在多个
        //判断cookie是否存在
        if(cookies!=null){
            //如果存在怎么办
            out.write("你上一次访问的时间是");
            for (int i = 0; i < cookies.length; i++) {
                //获取cookie的名字
                if(cookies[i].getName().equals("lastLoinTime")){
                    //获取cooked中的值
                    long lastLoinTime = Long.parseLong(cookies[i].getValue());
                    Date date = new Date(lastLoinTime);
                    out.write(date.toLocaleString());
                }
            }
        }else{
            out.write("这是您第一次访问");
        }
        //服务器给客户端响应一个cookie
        Cookie cookie = new Cookie("lastLoinTime", System.currentTimeMillis()+"");
        resp.addCookie(cookie);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }
}

```



# session(重点)

服务器端计划

* 什么是Session:

>服务器会给每一个用户(浏览器)创建一个Session对象;
>
>一个Session独占一个浏览器,只要浏览器关闭,这个Session就存在
>
>用户登录之后,整个网站它都可以访问啊!-->保存购物车的信息

Session和Cookie的区别:

1. Cookie是把用户的数据写给用户的浏览器,浏览器保存(可以保存多个)

2. Session把用户的数据写到用户独占Session中,服务器端保存

(保存重要的信息,减少服务器资源)



* 使用场景

> 保存一个登录用户的细腻
>
> 购物车信息
>
> 在整个网站中经常会使用的数据,我们将他保存在Session中

使用Session

```java
package com.kuang.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;

public class SessionDemo1 extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //解决乱码问题
        resp.setCharacterEncoding("UTF-8");
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        //得到Session
        HttpSession session = req.getSession();


        //给Session中存东西  值可以存对象
        session.setAttribute("name",123456);

        //获取Session的ID
        String id = session.getId();

        //判断Session是不是新的
        if(session.isNew()){
            resp.getWriter().write("创建成功,ID"+id);
        }else{
            resp.getWriter().write("session已经在服务器中存在了,ID"+id);
        }
        //给Session中存东西

        //Session创建的时候做了什么
//        Cookie jsessionid = new Cookie("JSESSIONID", id);
//        resp.addCookie(jsessionid);


    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}

```

```java
package com.kuang.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

public class SessionDemo2 extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //解决乱码问题
        resp.setCharacterEncoding("UTF-8");
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");

        //得到Session
        HttpSession session = req.getSession();
        Object name = session.getAttribute("name");
        System.out.println(name);

        //手动注销Session
        session.invalidate();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
```

会话自动过期:web.xml配置
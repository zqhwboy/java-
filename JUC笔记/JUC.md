# 多线程进阶->JUC并发编程

## 1.什么是JUC

**源码+官方文档** 面试高频问

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210710094610.png)

java.util 工具包、包、分类

**业务：普通的线程代码** **Thread**

**Runnable** 没有返回值、效率相比入 Callable 相对较低！



## 2.线程和进程

> 线程、进程，如果不能使用一句话说出来的技术，不扎实！

进程：一个程序，QQ.exe Music.exe 程序的集合；

一个进程往往可以包含多个线程，至少包含一个！

Java默认有几个线程？ 2 个 mian、GC

线程：开了一个进程 Typora，写字，自动保存（线程负责的）

对于Java而言：Thread、Runnable、Callable

**Java** **真的可以开启线程吗？** 开不了

```java
 public synchronized void start() {
        /**
         * This method is not invoked for the main method thread or "system"
         * group threads created/set up by the VM. Any new functionality added
         * to this method in the future may have to also be added to the VM.
         *
         * A zero status value corresponds to state "NEW".
         */
        if (threadStatus != 0)
            throw new IllegalThreadStateException();

        /* Notify the group that this thread is about to be started
         * so that it can be added to the group's list of threads
         * and the group's unstarted count can be decremented. */
        group.add(this);

        boolean started = false;
        try {
            start0();
            started = true;
        } finally {
            try {
                if (!started) {
                    group.threadStartFailed(this);
                }
            } catch (Throwable ignore) {
                /* do nothing. If start0 threw a Throwable then
                  it will be passed up the call stack */
            }
        }
    }
	//本地方法,底层的C++, Java无法直接操作硬件
    private native void start0();
```



> 并发、并行

并发编程：并发、并行

并发（多线程操作同一个资源）

* CPU 一核 ，模拟出来多条线程，天下武功，唯快不破，快速交替

并行（多个人一起行走）

* CPU 多核 ，多个线程可以同时执行； 线程池

```java
public class Test1 {
    public static void main(String[] args) {
        //获取cpu的核数
        //CPU IO密集型
        System.out.println(Runtime.getRuntime().availableProcessors());
    }
}
```

并发编程的本质:**充分利用CPU的资源**

所有的公司都很看重！

企业，挣钱=> 提高效率，裁员，找一个厉害的人顶替三个不怎么样的人；

人员（减） 、技术成本（高）

> 线程有几个状态

```java
  		 
		//新生
		NEW,

        //运行
        RUNNABLE,

        //阻塞
        BLOCKED,

        //等待  死死的等
        WAITING,

        //超时等待
        TIMED_WAITING,

        //终止
        TERMINATED;
```



> wait/sleep

1. **来自不同的类**

   wait=>Object

   sleep=>Thread

2. **关于锁的释放**

wait会释放锁,sleep睡觉了,抱着锁睡觉,不会释放

3.  **使用的范围是不同的**

wait

```java
wait必须在同步代码块中
```

sleep可以在任何地方睡

4.**是否需要捕获异常**

wait 不需要捕获异常 (需要捕获中断异常,只要线程都会有中断异常)

sleep 需要捕获异常

## 3.Lock锁(重点)

> 传统:Synchronized

```java
/*
* 真正的多线程开发,公司中的开发 降低耦合性
* 线程就是一个单独的资源类,没有任何附属的操作!
* 1.属性、方法*/
public class SaleTicketDemo01 {
    public static void main(String[] args) {
        //并发,多线程操作同一个资源类 把资源类丢入线程
        Ticket ticket=new Ticket();

        // @FunctionalInterface 函数式接口，jdk1.8 lambda表达式 (参数)->{ 代码 }
        new Thread(()->{
            for (int i = 0; i < 60; i++) {
                ticket.sale();
            }

        },"A").start();
        new Thread(()->{
            for (int i = 0; i < 60; i++) {
                ticket.sale();
            }
        },"B").start();
        new Thread(()->{
            for (int i = 0; i < 60; i++) {
                ticket.sale();
            }
        },"C").start();

    }
}
//资源类 OOP
class Ticket{
    private int number=50;

    //卖票的方式
    //synchronized 本质:队列,锁
    public synchronized void sale(){
        if(number>0){
            System.out.println(Thread.currentThread().getName()+"卖出了第"+
                    (number--)
                    + "票, 剩余:"+number);
        }
    }
}
```

> Lock接口

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210710104429.png)



![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210710104354.png)



```java
    public ReentrantLock() {
        sync = new NonfairSync();   //非公平锁
    }

    /**
     * Creates an instance of {@code ReentrantLock} with the
     * given fairness policy.
     *
     * @param fair {@code true} if this lock should use a fair ordering policy
     */
    public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
    }
```

公平锁：十分公平：可以先来后到

**非公平锁：十分不公平：可以插队 （默认）**

```java
package com.kuang.demo01;


import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/*
* 真正的多线程开发,公司中的开发 降低耦合性
* 线程就是一个单独的资源类,没有任何附属的操作!
* 1.属性、方法*/
public class SaleTicketDemo02 {
    public static void main(String[] args) {
        //并发,多线程操作同一个资源类 把资源类丢入线程
        Ticket2 ticket=new Ticket2();

        // @FunctionalInterface 函数式接口，jdk1.8 lambda表达式 (参数)->{ 代码 }
        new Thread(()->{ for (int i = 0; i < 40; i++) ticket.sale(); },"A").start();
        new Thread(()->{ for (int i = 0; i < 40; i++) ticket.sale(); },"B").start();
        new Thread(()->{ for (int i = 0; i < 40; i++) ticket.sale(); },"C").start();


    }
}
//Lock 三部曲
//1.   new ReentrantLock();
//2.   lock.lock();//加锁
//3.   lock.unlock(); //解锁
class Ticket2{
    private int number=50;

    Lock lock = new ReentrantLock();

    public void sale(){
        lock.lock();//加锁

        try {
            //业务代码
            if(number>0){
                System.out.println(Thread.currentThread().getName()+"卖出了第"+
                        (number--)
                        + "票, 剩余:"+number);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock(); //解锁
        }
    }
}
```

> Synchronized 和Lock区别

1. Synchronized  内置java关键字,Lock是一个Java类
2. Synchronized 无法判断获取锁的状态,Lock可以判断是否获取到了锁

3. Synchronized 会自动释放锁,lock必须要手动释放锁! 如果不释放锁,**死锁**
4. Synchronized 线程1(获得锁、阻塞)、线程2(等待,傻傻的等);Lock锁就不一定会等待下去;

5. Synchronized 可重入锁,不可以中断的,非公平;Lock:可重入锁,可以判断锁、非公平(可以自己设置)
6. Synchronized 适合锁少量的代码同步问题,Lock适合锁大量的同步代码!

> 锁是什么 如何判断锁的是谁!

## 4. 生产者和消费者问题

面试的:单例模式、排序问题  生产者和消费者问题 死锁问题

> 生产者和消费者问题 Synchronized 版

```java
package com.kuang.pc;


/*
* 线程之间的通信问题:生产者和消费者问题! 等待唤醒,通知唤醒
* 线程交替执行 A B 操作同一个变量 num=0
* A num+1
* B num-1
*
* */
public class A {
    public static void main(String[] args) {
        Data data = new Data();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.increment();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"A").start();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.decrement();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"B").start();
    }
}

//判断等待 业务 通知
class Data{  //数字 资源类
    private int number=0;
    //+1
    public synchronized void increment() throws InterruptedException {
        if(number!=0){ //0
            //等待
            this.wait();
        }
        number++;
        System.out.println(Thread.currentThread().getName()+"===>"+number);
        //通知其他线程 我+1完成了
        this.notifyAll();
    }
    //-1
    public synchronized void decrement() throws InterruptedException {
        if(number==0){ //1
            this.wait();
        }
        number--;
        System.out.println(Thread.currentThread().getName()+"===>"+number);
        //通知其他线程 我-1完成了
        this.notifyAll();
    }
}
```

> 问题存在 A B C D 4个线程  存在虚假唤醒

```java

/*
* 线程之间的通信问题:生产者和消费者问题! 等待唤醒,通知唤醒
* 线程交替执行 A B 操作同一个变量 num=0
* A num+1
* B num-1
*
* */
public class A {
    public static void main(String[] args) {
        Data data = new Data();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.increment();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"A").start();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.decrement();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"B").start();

        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.increment();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"C").start();

        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.decrement();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"D").start();
    }
}

//判断等待 业务 通知
class Data{  //数字 资源类
    private int number=0;
    //+1
    public synchronized void increment() throws InterruptedException {
        if (number!=0){ //0
            //等待
            this.wait();
        }
        number++;
        System.out.println(Thread.currentThread().getName()+"===>"+number);
        //通知其他线程 我+1完成了
        this.notifyAll();
    }
    //-1
    public synchronized void decrement() throws InterruptedException {
        if (number==0){ //1
            this.wait();
        }
        number--;
        System.out.println(Thread.currentThread().getName()+"===>"+number);
        //通知其他线程 我-1完成了
        this.notifyAll();
    }
}

```

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210710120852.png)

* **把if改成while**

```java
package com.kuang.pc;


/*
* 线程之间的通信问题:生产者和消费者问题! 等待唤醒,通知唤醒
* 线程交替执行 A B 操作同一个变量 num=0
* A num+1
* B num-1
*
* */
public class A {
    public static void main(String[] args) {
        Data data = new Data();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.increment();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"A").start();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.decrement();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"B").start();

        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.increment();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"C").start();

        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.decrement();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"D").start();
    }
}

//判断等待 业务 通知
class Data{  //数字 资源类
    private int number=0;
    //+1
    public synchronized void increment() throws InterruptedException {
        while (number!=0){ //0
            //等待
            this.wait();
        }
        number++;
        System.out.println(Thread.currentThread().getName()+"===>"+number);
        //通知其他线程 我+1完成了
        this.notifyAll();
    }
    //-1
    public synchronized void decrement() throws InterruptedException {
        while (number==0){ //1
            this.wait();
        }
        number--;
        System.out.println(Thread.currentThread().getName()+"===>"+number);
        //通知其他线程 我-1完成了
        this.notifyAll();
    }
}

```

> JUC版的生产者和消费者问题

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210710121320.png)

通过Lock 找到 Condition

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210710121331.png)

代码实现:

```java
package com.kuang.pc;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class B{
    public static void main(String[] args) {
        Data2 data = new Data2();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.increment();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"A").start();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.decrement();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"B").start();

        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.increment();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"C").start();

        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    data.decrement();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"D").start();
    }
}


//判断等待 业务 通知
class Data2{  //数字 资源类
    private int number=0;
    Lock lock =new ReentrantLock(); //等待
    Condition condition = lock.newCondition();  //唤醒全部
    //condition.await();//等待
    //condition.signalAll();//唤醒全部
    //+1
    public  void increment() throws InterruptedException {

        lock.lock();
        try {
            //业务代码
            while (number!=0){ //0
                //等待
                condition.await();//等待
            }
            number++;
            System.out.println(Thread.currentThread().getName()+"===>"+number);
            //通知其他线程 我+1完成了
            condition.signalAll();//唤醒全部
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }

    }
    //-1
    public synchronized void decrement() throws InterruptedException {
        lock.lock();
        try {
            while (number==0){ //1
                //等待
                condition.await();//等待
            }
            number--;
            System.out.println(Thread.currentThread().getName()+"===>"+number);
            //通知其他线程 我-1完成了
            condition.signalAll();//唤醒全部
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }

    }
}
问题,随机的状态
A===>1
B===>0
C===>1
B===>0
A===>1
B===>0
A===>1
D===>0
A===>1
D===>0
A===>1
D===>0
A===>1
D===>0
A===>1
...
```

任何一个新的技术,绝对不是仅仅只是覆盖了原本的技术,优势和补充!

> Condition 精准的通知和唤醒线程

代码测试:

```java
package com.kuang.pc;


import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/***
 * A 执行完调用B  B执行完调用C  C执行完调用A
 */
public class C {
    public static void main(String[] args) {
        Data3 data3 = new Data3();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                data3.printA();
            }
        },"A").start();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                data3.printB();
            }
        },"B").start();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                data3.printC();
            }
        },"C").start();



    }
}
class Data3{  //资源类 Lock
    private Lock lock = new ReentrantLock();
    private Condition condition1 = lock.newCondition();
    private Condition condition2 = lock.newCondition();
    private Condition condition3 = lock.newCondition();
    private int number=1;  //1A 2B 3C
    public void printA(){
        lock.lock();
        try {
            //业务 判断->执行->通知
            while (number!=1){
                //等待
                condition1.await();
            }
            System.out.println(Thread.currentThread().getName()+"AAAAAAA");
            number=2;
            condition2.signal();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
    public void printB(){
        lock.lock();
        try {
            //业务 判断->执行->通知
            while (number!=2){
                condition2.await();
            }
            System.out.println(Thread.currentThread().getName()+"BBBBBBBB");
            number=3;
            condition3.signal();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
    public void printC(){
        lock.lock();
        try {
            //业务 判断->执行->通知
            while (number!=3){
                condition3.await();
            }
            System.out.println(Thread.currentThread().getName()+"CCCCC");
            //唤醒,唤醒指定的人 c
            number=1;
            condition1.signal();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
    //生产线:下单->支付->交易->物流

}
```

## 5.8锁现象

如何判断锁的是谁! 永远的知道什么是锁,锁到底锁的是谁!

**深刻理解我们的锁**

对象、Class

* 1 2两问

```java
package com.kuang.lock8;


import java.util.concurrent.TimeUnit;

/*
 * 8锁就是关于所的8个问题
 * 1. 标准情况下,两个线程先打印,发短信还是打电话 ?  1.发短信 2 打电话
 * 2. sendSms标准情况下,两个线程先打印,发短信还是打电话  1.发短信 2 打电话
 */
public class Test1 {
    public static void main(String[] args) {
        Phone phone = new Phone();

        new Thread(()->{
            phone.senSms();
        },"A").start();

        //捕获
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }


        new Thread(()->{
            phone.call();
        },"b").start();
    }
}
class Phone{
    //synchronized 锁的对象是方法的调用者!
    //两个方法用的是同一个锁,谁先拿到谁先执行
    public synchronized void senSms(){

        try {
            TimeUnit.SECONDS.sleep(4);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }
    public synchronized void call(){
        System.out.println("打电话");
    }

}

```

* 3 4 两问

```java
package com.kuang.lock8;

import java.util.concurrent.TimeUnit;

/*
* 3.增加了一个普通方法后,先执行发短信还是Hello  普通方法先执行,  因为发短信延迟时间太长,而且普通方法不受锁的影响
* 4. 两个对象,两个同步方法, 先发短信还是打电话 ?  //打电话
* */
public class Test2{
    public static void main(String[] args) {
        //两个对象,两个调用者 两把锁
        Phone2 phone1 = new Phone2();
        Phone2 phone2 = new Phone2();

        new Thread(()->{
            phone1.senSms();
        },"A").start();

        //捕获
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }


        new Thread(()->{
            phone2.call();
        },"b").start();
    }
}
class Phone2{
    //synchronized 锁的对象是方法的调用者!
    //两个方法用的是同一个锁,谁先拿到谁先执行
    public synchronized void senSms(){

        try {
            TimeUnit.SECONDS.sleep(4);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }
    public synchronized void call(){
        System.out.println("打电话");
    }

   //这里没有锁! 不是同步方法,不受锁的影响
    public void hello(){
        System.out.println("hello");
    }
}
```

* 5 6

```java
package com.kuang.lock8;

import java.util.concurrent.TimeUnit;
/*
* 5. 增加两个静态的同步方法 只有一个对象,先打印发短息 还是打电话  发短信
* 6. 两个对象! 增加两个静态的同步方法,先打印 发短信 还是打电话? */
public class Test3 {
    public static void main(String[] args) {
        //两个对象的Class模板只有一个,static,锁的是Class
        Phone3 phone1 = new Phone3();
        Phone3 phone2 = new Phone3();

        new Thread(()->{
            phone1.senSms();
        },"A").start();

        //捕获
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }


        new Thread(()->{
            phone2.call();
        },"b").start();
    }
}

//Phone3
class Phone3{
    //synchronized 锁的对象是方法的调用者!
    //static 静态方法
    //类一加载就有了 锁的是Class
    public static synchronized void senSms(){

        try {
            TimeUnit.SECONDS.sleep(4);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }
    public static synchronized void call(){
        System.out.println("打电话");
    }


}
```



* 7

```java
package com.kuang.lock8;

import java.util.concurrent.TimeUnit;

/*1.一个静态的同步方法,1个普通的同步方法,一个对象,先打印发短息还是打电话呢?  打电话*/
public class Test4 {
    public static void main(String[] args) {
        //两个对象的Class模板只有一个,static,锁的是Class
        Phone4 phone = new Phone4();

        new Thread(()->{
            phone.senSms();
        },"A").start();

        //捕获
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }


        new Thread(()->{
            phone.call();
        },"b").start();
    }
}

//Phone4
class Phone4{

    //静态的同步方法  锁的是Class 类模板
    public static synchronized void senSms(){

        try {
            TimeUnit.SECONDS.sleep(4);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }
    //普通同步方法  锁的是调用者
    public synchronized   void call(){
        System.out.println("打电话");
    }


}
```

* 8

```java
package com.kuang.lock8;

import java.util.concurrent.TimeUnit;


/*1.一个静态的同步方法,1个普通的同步方法,两个对象,先打印发短息还是打电话呢?  打电话*/
public class Test4 {
    public static void main(String[] args) {
        //两个对象的Class模板只有一个,static,锁的是Class
        Phone4 phone1= new Phone4();
        Phone4 phone2= new Phone4();

        new Thread(()->{
            phone1.senSms();
        },"A").start();

        //捕获
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }


        new Thread(()->{
            phone2.call();
        },"b").start();
    }
}

//Phone4
class Phone4{

    //静态的同步方法  锁的是Class 类模板
    public static synchronized void senSms(){

        try {
            TimeUnit.SECONDS.sleep(4);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }
    //普通同步方法  锁的是调用者
    public synchronized   void call(){
        System.out.println("打电话");
    }


}
```

> 小结

new this 具体的一个手机

static Class  唯一的一个模板

## 6.集合类不安全

> List 不安全

```java
package com.kuang.unsafe;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

//java.util.ConcurrentModificationException
public class ListTest {
    public static void main(String[] args) {
        // 并发下 ArrayList 不安全的
        /*
        * 解决方案:
        * 1.List<String> list = new Vector<>();
        * 2.List<String> list = Collections.synchronizedList(new ArrayList<>());
        * 3.List<String> list = new CopyOnWriteArrayList<>();*/
        //CopyOnWrite 写入时赋值 COW 计算机程序设计的一种优化策略:
        //多个线程调用的时候,list,读取的时候,固定的,写入(覆盖)
        //在写入的时候避免覆盖,造成数据问题

        //读写发力  MyCat
        //CopyOnWriteArrayList 比 Vector Nb在哪里?
       List<String> list = new CopyOnWriteArrayList<>();
        for (int i = 0; i < 10; i++) {
            new Thread(()->{
                list.add(UUID.randomUUID().toString().substring(0,5));
                System.out.println(list);
            },String.valueOf(i)).start();
        }
    }
}

```

小狂神学习方法推荐:1.先会用 2.货比三家,寻找其他解决方案4,分析源码!

> Set不安全

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210710150144.png)

```java
package com.kuang.unsafe;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArraySet;

/*同理可证:java.util.ConcurrentModificationException
* 解决方案
* 1.Set<String> set = Collections.synchronizedSet(new HashSet<>());
* 2.CopyOnWriteArraySet<Object> set = new CopyOnWriteArraySet<>();
*/
public class SetTest {
    public static void main(String[] args) {
//        HashSet<Object> set = new HashSet<>();
        //Set<String> set = Collections.synchronizedSet(new HashSet<>());

        CopyOnWriteArraySet<Object> set = new CopyOnWriteArraySet<>();


        for (int i = 0; i < 30; i++) {
            new Thread(()->{
                set.add(UUID.randomUUID().toString().substring(0,5));
                System.out.println(set);
            },String.valueOf(i)).start();
        }
    }
}
```

hashSet底层是什么? hashmap

```java
public HashSet() {
    map = new HashMap<>();
}
//add set本质就是map key是无法重复的
public boolean add(E e) {
        return map.put(e, PRESENT)==null;
}

    // Dummy value to associate with an Object in the backing Map
private static final Object PRESENT = new Object();  //不变的值
```

> HashMap 不安全

回顾Map的基本操作

```java
package com.kuang.unsafe;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;


/*
*java.util.ConcurrentModificationException
* 1.Map<Object, Object> map = Collections.synchronizedMap(new HashMap<>());
* 2.Map<String, Object> map = new ConcurrentHashMap<>();
*
* */
public class MapTest {
    public static void main(String[] args) {
        //map是这样用的么? 不是 工作中不用HashMap
        //  new HashMap<>();默认等价于什么new HashMap<String, Object>(16, 0.75F);
        //  Map<String, Object> map = new HashMap<String, Object>();
        //唯一一个家庭作业:研究ConcurrentHashMap原理  (答案在API中)
        Map<String, Object> map = new ConcurrentHashMap<>();
        for (int i = 0; i < 30; i++) {
            new Thread(()->{
                map.put(Thread.currentThread().getName(), UUID.randomUUID().toString().substring(0,5));
                System.out.println(map);
            },String.valueOf(i)).start();
        }
    }
}
```

## 7.Callable(简单)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210710180903.png)

1. 可以有返回值
2. 可以抛出异常
3. 方法不同,run()/ call()

> 代码测试

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210710181756.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210710181951.png)

```java
package com.kuang.callable;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

/*
* 1.探究原理
* 2.觉得自己会用*/

public class CallableTest {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        //new Thread(new Runnable()).start();
        //new Thread(new FutureTask<V>()).start();
        //new Thread(new FutureTask<V>(Callable)).start();

        new Thread().start();//怎么启动Callable

        MyThread thread = new MyThread();

        FutureTask futureTask = new FutureTask<>(thread);  //适配类
        new Thread(futureTask,"A").start();

        Integer o = (Integer)futureTask.get();
        System.out.println(o);

    }
}

class MyThread implements Callable<Integer>{

    @Override
    public Integer call() throws Exception {
        System.out.println("call方法");
        return 1024;
    }
}

```

没有实战!

细节:

1. 有缓存
2. 结果可能需要等待,会阻塞!

```java
package com.kuang.callable;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

/*
* 1.探究原理
* 2.觉得自己会用*/

public class CallableTest {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        //new Thread(new Runnable()).start();
        //new Thread(new FutureTask<V>()).start();
        //new Thread(new FutureTask<V>(Callable)).start();

        new Thread().start();//怎么启动Callable

        MyThread thread = new MyThread();

        FutureTask futureTask = new FutureTask<>(thread);  //适配类
        new Thread(futureTask,"A").start();
        new Thread(futureTask,"B").start();  //结果会被缓存.效率高

        Integer o = (Integer)futureTask.get(); //这个get方法可能会产生阻塞 把他放在最后一行  或者使用异步通信
        System.out.println(o);

    }
}

class MyThread implements Callable<Integer>{

    @Override
    public Integer call() throws Exception {
        System.out.println("call方法");
        return 1024;
    }
}
```

## 8.常用的辅助类

### 8.1 CountDownLatch

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210710184959.png)

```java
package com.kuang.add;

import java.util.concurrent.CountDownLatch;

//计数器
public class CountDownLatchDemo {
    public static void main(String[] args) throws InterruptedException {
        //总数是6 必须要执行任务的时候 再使用
        CountDownLatch countDownLatch = new CountDownLatch(6);
        for (int i = 1; i <= 6; i++) {
            new Thread(()->{
                System.out.println(Thread.currentThread().getName()+"Go Out");
                countDownLatch.countDown();//数量减一

            },String.valueOf(i)).start();
        }

        countDownLatch.await();//等待计数器归零 然后再向下执行

        System.out.println("Close Door");





    }
}
```

  **countDownLatch.countDown();数量减一**

**countDownLatch.await();//等待计数器归零 然后再向下执行**

每次有线程调用countDown()数量-1,假设计数器变为0,countDownLatch()就会被唤醒,继续执行!

### 8.2 CyclicBarrier

```java
package com.kuang.add;

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

public class CycliBarrierDemo {
    public static void main(String[] args) {
        /*集齐七颗龙珠召唤神龙*/

        //召唤龙珠的线程
        CyclicBarrier cyclicBarrier = new CyclicBarrier(7,()->{
            System.out.println("召唤神龙成功");
        });


        for (int i = 1; i <= 7; i++) {
            final int temp=i;
            new Thread(()->{
                System.out.println(Thread.currentThread().getName()+"收集了"+temp+"个龙珠");
                try {
                    cyclicBarrier.await(); //等待
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}

```



### 8.3 Semaphore

Semaphore:信号量

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210710191437.png)

```java
package com.kuang.add;

import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

public class SemaphoreDemo {
    public static void main(String[] args) {
        //线程数量:停车位! 限流!
        Semaphore semaphore = new Semaphore(3);

        for (int i = 0; i < 6; i++) {
            new Thread(()->{
                //acquire() 得到
                try {
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName()+"抢到车位");
                    TimeUnit.SECONDS.sleep(2);
                    System.out.println(Thread.currentThread().getName()+"离开车位");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }finally {
                    semaphore.release();
                }
                //release() 释放

            },String.valueOf(i)).start();
        }

    }
}
```

原理:

1. semaphore.acquire(); 获得,(剩余车位数量减1),假设已经满了,等待被释放为止再获得该车位!

2. semaphore.release(); 释放,会将当前的信号量释放+1(剩余车位数量加1),然后唤醒等待的线程!

作用:多个共享资源互斥的使用! 并发限流,控制最大的线程数!

## 9.读写锁

ReadWriteLock

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210711134955.png)

```java
package com.kuang.rw;


import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/*
* 独占锁(写锁)
* 共享锁(读锁)
*
*ReadWriteLock
* 读-读  可以共存
* 读-写  不可以共存
* 写-写  不可以共存*/
public class ReadWriteLockDemo {

    public static void main(String[] args) {
//        MyCache myCache = new MyCache();
        MyCacheLock myCache = new MyCacheLock();

        //写入
        for (int i = 0; i < 5; i++) {
            int temp=i;
            new Thread(()->{
                myCache.put(temp+"",temp+"");
            },String.valueOf(i)).start();
        }


        //读取
        for (int i = 0; i < 5; i++) {
            int temp=i;
            new Thread(()->{
                myCache.get(temp+"");
            },String.valueOf(i)).start();
        }

    }
}


/*
 * 加锁的
 * */
class MyCacheLock{
    private volatile Map<String,Object> map=new HashMap<>();
    //读写锁:更加细粒度的控制
    private ReadWriteLock readWriteLock=new ReentrantReadWriteLock();


    //存,写的过程 只希望同时只有一个线程写
    public void put(String key,Object value){
        readWriteLock.writeLock().lock();

        try {
            System.out.println(Thread.currentThread().getName()+"写入"+key);
            map.put(key,value);
            System.out.println(Thread.currentThread().getName()+"写入OK");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            readWriteLock.writeLock().unlock();
        }

    }

    //取,读的过程 所有人都可以读!
    public void get(String key){
        readWriteLock.readLock().lock();


        try {
            System.out.println(Thread.currentThread().getName()+"读取"+key);
            map.get(key);
            System.out.println(Thread.currentThread().getName()+"读取OK");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            readWriteLock.readLock().unlock();
        }

    }
}

/*
* 自定义缓存
* */
class MyCache{
    private volatile Map<String,Object> map=new HashMap<>();

    //存,写的过程
    public void put(String key,Object value){
        System.out.println(Thread.currentThread().getName()+"写入"+key);
        map.put(key,value);
        System.out.println(Thread.currentThread().getName()+"写入OK");
    }

    //取,读的过程
    public void get(String key){
        System.out.println(Thread.currentThread().getName()+"读取"+key);
        map.get(key);
        System.out.println(Thread.currentThread().getName()+"读取OK");
    }
}

```

## 10 阻塞队列

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210711145631.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210711145852.png)



<img src="D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210711151542.png" style="zoom:67%;" />



![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210711151904.png)

**BlockingQueue** 不是新的东西
什么情况下我们会使用阻塞队列:多线程并发处理,线程池!

**学会使用队列**

添加、移除

**四组API**

| 方式       | 抛出异常 | 有返回值 ,不抛出异常 | 阻塞等待 | 超时等待  |
| ---------- | -------- | -------------------- | -------- | --------- |
| 添加       | add      | offer()              | put      | offer(,,) |
| 移除       | remove   | poll()               | take     | poll(,)   |
| 判断队列首 | element  |                      |          |           |

```java
   /*
    * 抛出异常*/
    public static void test1(){
        //队列的大小
        ArrayBlockingQueue<Object> blockingQueue = new ArrayBlockingQueue<>(3);
        System.out.println(blockingQueue.add("a"));
        System.out.println(blockingQueue.add("b"));
        System.out.println(blockingQueue.add("c"));

        //IllegalStateException:Queue full  抛出异常
        //System.out.println(blockingQueue.add("d"));
        System.out.println("=========================");
        
        System.out.println(blockingQueue.element()); //查看队首元素是谁
        
        System.out.println(blockingQueue.remove());
        System.out.println(blockingQueue.remove());
        System.out.println(blockingQueue.remove());

        //java.util.NoSuchElementException 抛出异常
        //System.out.println(blockingQueue.remove());

    }
```

```java
 /*有返回值,没有异常*/
    public static void test2(){
        ArrayBlockingQueue<Object> blockingQueue = new ArrayBlockingQueue<>(3);

        System.out.println(blockingQueue.offer("a"));
        System.out.println(blockingQueue.offer("b"));
        System.out.println(blockingQueue.offer("c"));
        System.out.println(blockingQueue.offer("d")); //false 不抛出异常


        System.out.println("==========================");
        System.out.println(blockingQueue.peek());
        
        
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());  //null 也不抛出异常


    }
```

```java
  /*等待,阻塞(一直阻塞)*/
    public static void test3() throws InterruptedException {
        ArrayBlockingQueue<Object> blockingQueue = new ArrayBlockingQueue<>(3);

        blockingQueue.put("a");
        blockingQueue.put("b");
        blockingQueue.put("c");
        //blockingQueue.put("d"); //队列没有位置  ,一直阻塞

        System.out.println("==========================");
        
        System.out.println(blockingQueue.take());
        System.out.println(blockingQueue.take());
        System.out.println(blockingQueue.take());
        System.out.println(blockingQueue.take()); //没有这个元素,一直阻塞
    }
```



```java
  /*等待,阻塞(等待、超时)*/
    public static void test4() throws InterruptedException {
        ArrayBlockingQueue<Object> blockingQueue = new ArrayBlockingQueue<>(3);
        blockingQueue.offer("a");
        blockingQueue.offer("b");
        blockingQueue.offer("c");
        blockingQueue.offer("s",2, TimeUnit.SECONDS); //等待炒股2s就退出

        System.out.println("==================");
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll(2,TimeUnit.SECONDS));
    }
```

> SynchronousQueue 同步队列

没有容量,进去一个元素,必须等待取出来之后,才能再往里面放一个元素!

put、take

```java
package com.kuang.bq;


import java.util.concurrent.BlockingQueue;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.TimeUnit;

/*
* 同步队列
* 和其他的blockingQueue 不一样,SynchronousQueue 不存储元素
* put了一个元素,必须从里面先take取出来,否则不能再put进去值*/
public class SynchronousQueueDemo {
    public static void main(String[] args) {
        BlockingQueue<String> blockingQueue = new SynchronousQueue<>();

        new Thread(()->{
            try {
                System.out.println(Thread.currentThread().getName()+"put 1");
                blockingQueue.put("1");
                System.out.println(Thread.currentThread().getName()+"put 2");
                blockingQueue.put("2");
                System.out.println(Thread.currentThread().getName()+"put 3");
                blockingQueue.put("3");
            }catch (Exception e){
                e.printStackTrace();
            }


        },"T1").start();
        new Thread(()->{
            try {
                TimeUnit.SECONDS.sleep(3);
                System.out.println(Thread.currentThread().getName()+"=>"+blockingQueue.take());
                TimeUnit.SECONDS.sleep(3);
                System.out.println(Thread.currentThread().getName()+"=>"+blockingQueue.take());
                TimeUnit.SECONDS.sleep(3);
                System.out.println(Thread.currentThread().getName()+"=>"+blockingQueue.take());
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

        },"T2").start();


    }
}


```

**学了技术不会用,看的少!**

## 11. 线程池（重点） 

线程池:三大方法、7大参数、4种拒绝策略

> 池化技术

程序的运行，本质：占用系统的资源！优化资源的使用！=》池化技术

线程池、连接池、内存池、对象池 //. 创建、销毁,十分浪费资源

池化技术:事先准备好一些资源,有人要用,就来我这里拿,用完之后就还给我.

**线程池的好处:**

1. 降低资源的消耗
2. 提高响应的速度
3. 方便管理

**线程复用、可以控制最大并行数、管理线程**

> 线程池 三大方法

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210714180741.png)

```java
package com.kuang.pool;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Demo01 {
    public static void main(String[] args) {
        //ExecutorService threadPool = Executors.newSingleThreadExecutor(); //单个线程
        //ExecutorService threadPool = Executors.newFixedThreadPool(5); //创建一个固定的线程池大小
        ExecutorService threadPool = Executors.newCachedThreadPool(); //可伸缩的,遇强则强,遇弱则弱
        try {
            for (int i = 0; i < 10; i++) {
                threadPool.execute(()->{
                    System.out.println(Thread.currentThread().getName()+"ok");
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            //线程池用完,程序借宿,关闭线程池
            threadPool.shutdown();
        }
    }
}
```

> 七大参数

源码分析

```java
public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>()));
    }

public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>());
    }

 public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE, //21亿 oom
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>());
    }

//本质:ThreadPoolExecutor()
    public ThreadPoolExecutor(int corePoolSize, //核心线程池大小
                              int maximumPoolSize, //最大核心线程池大小
                              long keepAliveTime, //超时没有人调用会释放
                              TimeUnit unit,  //超时单位
                              BlockingQueue<Runnable> workQueue, //阻塞队列
                              ThreadFactory threadFactory,  //线程工厂,创建线程的,一般不用动
                              RejectedExecutionHandler handler //拒绝策略) {
        if (corePoolSize < 0 ||
            maximumPoolSize <= 0 ||
            maximumPoolSize < corePoolSize ||
            keepAliveTime < 0)
            throw new IllegalArgumentException();
        if (workQueue == null || threadFactory == null || handler == null)
            throw new NullPointerException();
        this.acc = System.getSecurityManager() == null ?
                null :
                AccessController.getContext();
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.workQueue = workQueue;
        this.keepAliveTime = unit.toNanos(keepAliveTime);
        this.threadFactory = threadFactory;
        this.handler = handler;
    }

```

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210714182640.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210714183044.png)

> 手动创建一个线程池

```java
package com.kuang.pool;

import java.util.concurrent.*;
// new ThreadPoolExecutor.AbortPolicy() //银行满了,还有人进来,不处理这个人,抛出异常
//   new ThreadPoolExecutor.CallerRunsPolicy() //满了以后,哪来的去哪里,哪里来的就用那个线程执行!  该任务被线程池拒绝，由调用 execute方法的线程执行该任务。
//     new ThreadPoolExecutor.DiscardPolicy() //度列满了 丢掉任务,不会抛出异常
//new ThreadPoolExecutor.DiscardOldestPolicy() //抛弃队列最前面的任务，然后重新尝试执行任务。
public class Demo01 {
    public static void main(String[] args) {

      //自定义线程池! 工作 ThreadPoolExecutor
      ExecutorService threadPool = new ThreadPoolExecutor(
              2,
              5,
              3,
              TimeUnit.SECONDS,
              new LinkedBlockingQueue<>(3),
              Executors.defaultThreadFactory(),

              );

        try {
            //最大承载:  队列+max的值
            //超过 RejectedExecutionException
            for (int i = 0; i < 9; i++) {
                threadPool.execute(()->{
                    System.out.println(Thread.currentThread().getName()+"ok");
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            //线程池用完,程序借宿,关闭线程池
            threadPool.shutdown();
        }
    }
}

```



> 四种拒绝策略

```JAVA
// new ThreadPoolExecutor.AbortPolicy() //银行满了,还有人进来,不处理这个人,抛出异常
//   new ThreadPoolExecutor.CallerRunsPolicy() //满了以后,哪来的去哪里,哪里来的就用那个线程执行!  该任务被线程池拒绝，由调用 execute方法的线程执行该任务。
//     new ThreadPoolExecutor.DiscardPolicy() //度列满了 丢掉任务,不会抛出异常
//new ThreadPoolExecutor.DiscardOldestPolicy() //抛弃队列最前面的任务，然后重新尝试执行任务。
```

> 小结和拓展

池的最大的大小如何去设置!

了解:IO密集型,CPU密集型:(调优)

```java
package com.kuang.pool;

import java.util.concurrent.*;

public class Demo01 {
    public static void main(String[] args) {

          //自定义线程池! 工作 ThreadPoolExecutor

            //最大线程到底该如何定义
            //1.CPU密集型  几核,就是几,可以报出Cpu的效率最高!
            //2.IO密集型   > 判断你程序十分耗IO的线程
            //      程序  15个大型任务 io十分占用资源!


        //获取Cpu的核数
        System.out.println(Runtime.getRuntime().availableProcessors());
        ExecutorService threadPool = new ThreadPoolExecutor(
                  2,
                  5,
                  3,
                  TimeUnit.SECONDS,
                  new LinkedBlockingQueue<>(3),
                  Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.DiscardOldestPolicy()
                  );

                try {
                    //最大承载:  队列+max的值
                    //超过 RejectedExecutionException
                    for (int i = 0; i < 9; i++) {
                        threadPool.execute(()->{
                            System.out.println(Thread.currentThread().getName()+"ok");
                        });
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    //线程池用完,程序借宿,关闭线程池
                    threadPool.shutdown();
                }
    }
}

```

## 12. 四大函数式接口(必须掌握)

新时代程序员:lambda表达式、链式编程、函数式接口、Stream流式计算

> 函数式接口:只有一个方法的接口

```java
@FunctionalInterface
public interface Runnable {
  
    public abstract void run();
}

//泛型、枚举、反射
//lambda表达式、链式编程、函数式接口、Stream流式计算

//超级多@FunctionalInterface
//简化编程模型,在新版本的框架底层大量应用!
//foreach(消费者的函数式接口)
```

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210714193154.png)

**代码测试:**

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210714193414.png)



> Function函数式接口

```java
package com.kuang.function;

import java.util.function.Function;


/*Function 函数式接口,有一个输入参数,有一个输出
* 只要有 函数式接口 可以用 lambda表达式简化*/
public class Demo01 {
    public static void main(String[] args) {
//        Function function = new Function<String,String>() {
//           //工具类  输出输入的值
//            @Override
//            public String apply(String str) {
//                return str;
//            }
//        };

        // Function<String,String> function = str->{return new String("sdf");};
        Function<String,String> function = str->{return str;};
        System.out.println(function.apply("asd"));
    }
}
```

> 断定型接口 有一个输入参数,返回值只能是 布尔值

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210714195948.png)

```java
package com.kuang.function;

import java.util.function.Predicate;
/*
* 断定型接口:有一个输入参数,返回值只能是 布尔值*/
public class demo02 {
    public static void main(String[] args) {
        //判断字符串是否为空
//        Predicate<String> predicate = new Predicate<String>() {
//            @Override
//            public boolean test(String str) {
//                return str.isEmpty();
//            }
//        };
        Predicate<String> predicate=(str)->{return str.isEmpty();};
        System.out.println(predicate.test(""));
    }
}

```

> Consumer 消费型接口

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210714200241.png)

```java
package com.kuang.function;

import java.util.function.Consumer;
/*
*   Consumer 消费型接口: 只有输入 没有返回值*/
public class Demo03 {
    public static void main(String[] args) {
//        Consumer<String> consumer = new Consumer<String>() {
//            @Override
//            public void accept(String str) {
//                System.out.println(str);
//            }
//        };
        Consumer<String> consumer =(str)->{
//            System.out.println(str);
        return;
        };


        consumer.accept("asd");
    }
}
```

> Supplier 供给型接口

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210714201200.png)

```java
package com.kuang.function;

import java.util.function.Supplier;


/*
* supplier 供给型接口 没有参数 只有返回值*/
public class Demo04 {
    public static void main(String[] args) {
//        Supplier supplier = new Supplier<Integer>() {
//            @Override
//            public Integer get() {
//                System.out.println("get()");
//                return 1024;
//            }
//        };

        Supplier supplier=()->{
//            System.out.println("get()");
            return 1024;};

        System.out.println(supplier.get());
    }
}
```

## 13、Stream 流式计算

> 什么是Stream 流式计算

大数据: 存储+计算

存储:集合、Mysql 本质就是存储东西的

计算都应该交给流来操作!

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210714201950.png)

```java
package com.kuang.stream;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

/*
* 题目要求:一分钟内完成此题,只能用一行代码实现!
* 现在有5个用户! 筛选:
* 1. ID必须是偶数
* 2.年龄必须大于23岁
* 3.用户名转为大写字母
* 4.用户名字母倒着排序
* 5.只输出一个用户*/
public class Test {
    public static void main(String[] args) {

        User u1 = new User(1, "a", 21);
        User u2 = new User(2, "b", 22);
        User u3 = new User(3, "c", 23);
        User u4 = new User(4, "d", 24);
        User u5 = new User(6, "e", 25);


        //集合就是存储
        List<User> list = Arrays.asList(u1, u2, u3, u4, u5);

        //计算交给Stream流
        //lambda表达式、链式编程、函数式接口、Stream流式计算
        list.stream()
                .filter(u->{return u.getId()%2==0;})
                .filter(u->{return u.getAge()>23;})
                .map(u->{return u.getName().toUpperCase();})
                .sorted((uu1,uu2)->{return uu2.compareTo(uu1);})
                .limit(1)
                .forEach(System.out::println);


    }
}
```

## 14 .ForkJoin

> 什么是ForkJoin

ForkJoin 在JDK1.7 ,并行执行任务! 提高效率,大数据量!

大数据:Map Reduce(把大任务拆分成小任务)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715085844.png)

> Forkjoin特点:工作窃取

这里面维护的都是双端队列

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715090132.png)

> ForkJoin

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715091444.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715091413.png)



```java
package com.kuang.forkjoin;

import java.util.concurrent.RecursiveTask;

/*
* 求和计算任务
* 3000 6000(ForkJoin) 9000(Stream并行刘)
*
*  //如何是哟红forkJoin
* //1.forkJoinPool 通过他来执行
* //2.计算任务forkJoinPool.execute(ForkJoinTask<?> task)
* //3.计算类要继承ForkJoinTask
* */
public class ForkJoinDemo extends RecursiveTask<Long> {

    private long start;
    private long end;

    //临界值
    private Long temp=10000L;

    public ForkJoinDemo(Long start,Long end){
        this.start=start;
        this.end=end;
    }
  


    //计算方法
    @Override
    protected Long compute() {
        if((end-start)<temp){
            //分支合并计算
            long sum=0L;
            for (Long i=start ; i <= end; i++) {
                sum+=i;
            }
            return sum;
        }else{ //forkJoin  递归
            long middle=(start+end)/2; //中间值
            ForkJoinDemo task1 = new ForkJoinDemo(start, middle);

            task1.fork();//拆分任务,把任务压入线程队列

            ForkJoinDemo task2 = new ForkJoinDemo(middle+1, end);
            task2.fork();//拆分任务,把任务压入线程队列

            return task1.join()+task2.join();

        }
    }
}

```





测试类

```java
package com.kuang.forkjoin;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ForkJoinTask;
import java.util.stream.LongStream;



/*同一个任务,别人效率高几十倍*/
public class Test {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
         //test1();// sum=500000000500000000时间  5682
        // test2(); //sum=500000000500000000时间  4259
        test3(); //sum=500000000500000000时间  180
    }

    //普通程序员
    public static void test1(){
        long sum=0L;
        long start = System.currentTimeMillis();

        for (Long i=1L; i <= 10_0000_0000; i++) {
            sum+=i;
        }
        long end=System.currentTimeMillis();
        System.out.println("sum="+sum+"时间  "+(end-start));
    }

    //会使用ForkJoin
    public static void test2() throws ExecutionException, InterruptedException {
        long start = System.currentTimeMillis();
        ForkJoinPool forkJoinPool = new ForkJoinPool();
        ForkJoinTask<Long> task = new ForkJoinDemo(0L, 10_0000_0000L);
        ForkJoinTask<Long> submit = forkJoinPool.submit(task); //提交任务
        Long sum = submit.get();
        long end=System.currentTimeMillis();
        System.out.println("sum="+sum+"时间  "+(end-start));
    }
    public static void test3(){
        long start = System.currentTimeMillis();

        //stream并行流() (]
        long sum = LongStream.rangeClosed(0L, 10_0000_0000).parallel().reduce(0, Long::sum);

        long end=System.currentTimeMillis();
        System.out.println("sum="+sum+"时间  "+(end-start));
    }
}
```

## 15.异步回调

> Future设计的初衷:对将来的某个事件的结果进行建模

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715125827.png)

```java
package com.kuang.future;


import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

/*异步调用: CompletableFuture
*  //异步执行
*  //成功回调
*  //失败回调
* */
public class Demo01 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        //没有返回值的runAsync 异步回调
//        CompletableFuture<Void> completableFuture = CompletableFuture.runAsync(()->{
//            try {
//                TimeUnit.SECONDS.sleep(2);
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
//            System.out.println(Thread.currentThread().getName()+"runAsync=>void");
//        });
//
//        System.out.println("1111");
//        completableFuture.get(); //获取执行结果

        //有返回值的 supplyAsync 异步回调
        //ajax  成功和失败的回调
        //返回的是错误信息
        CompletableFuture<Integer> completableFuture= CompletableFuture.supplyAsync(()->{
            System.out.println(Thread.currentThread().getName() + "supplyAsync=>Integer");
            int i=10/0;
            return 1024;
        });
        System.out.println(completableFuture.whenComplete((t, u) -> {
            System.out.println("t=>" + t);  //正常的返回结果
            System.out.println("u=>" + u);  // 错误信息:java.util.concurrent.CompletionException: java.lang.ArithmeticException: / by zero
        }).exceptionally((e) -> {
            System.out.println(e.getMessage());
            return 233; //可以获取到错误的返回结果
        }).get());

        /*
        * succes Code 200
        * error Code 4004 500*/
    }
}

```

## 16. JMM

> 请你谈谈对Volatile理解

Volatile是Java虚拟机提供**轻量级的同步机制**

1. 保证可见性
2. **不保证原子性**
3. 禁止指令重排

> 什么是JMM

JMM:Java是内存模型,不存在的东西,概念!约定!

**关于JMM的一些同步的约定**

1. 线程解锁前,必须把共享变量刷会主存.
2. 线程加锁前,必须读取主存中最新值到工作内存中!
3. 加锁和解锁是同一把锁

线程 **工作内存、主内存**

**8种操作:**

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715141634.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715141919.png)

**内存交互操作有*8*种，虚拟机实现必须保证每一个操作都是原子的，不可在分的（对于double和long类型的变量来说，load、store、read和write操作在某些平台上允许例外）**

* lock （锁定）：作用于主内存的变量，把一个变量标识为线程独占状态

* unlock （解锁）：作用于主内存的变量，它把一个处于锁定状态的变量释放出来，释放后的变量才可以被其他线程锁定

* read （读取）：作用于主内存变量，它把一个变量的值从主内存传输到线程的工作内存中，以便随后的load动作使用

* load （载入）：作用于工作内存的变量，它把read操作从主存中变量放入工作内存中

* use （使用）：作用于工作内存中的变量，它把工作内存中的变量传输给执行引擎，每当虚拟机遇到一个需要使用到变量的值，就会使用到这个指令

* assign （赋值）：作用于工作内存中的变量，它把一个从执行引擎中接受到的值放入工作内存的变量副本中

* store （存储）：作用于主内存中的变量，它把一个从工作内存中一个变量的值传送到主内存中，以便后续的write使用

* write （写入）：作用于主内存中的变量，它把store操作从工作内存中得到的变量的值放入主内

  存的变量中

**JMM对这八种指令的使用，制定了如下规则：**

* 不允许read和load、store和write操作之一单独出现。即使用了read必须load，使用了store必须write

* 不允许线程丢弃他最近的assign操作，即工作变量的数据改变了之后，必须告知主存

* 不允许一个线程将没有assign的数据从工作内存同步回主内存

* 一个新的变量必须在主内存中诞生，不允许工作内存直接使用一个未被初始化的变量。就是对变量实施use、store操作之前，必须经过assign和load操作

* 一个变量同一时间只有一个线程能对其进行lock。多次lock后，必须执行相同次数的unlock才能解锁

* 如果对一个变量进行lock操作，会清空所有工作内存中此变量的值，在执行引擎使用这个变量前，必须重新load或assign操作初始化变量的值

* 如果一个变量没有被lock，就不能对其进行unlock操作。也不能unlock一个被其他线程锁住的变量

* 对一个变量进行unlock操作之前，必须把此变量同步回主内存



问题:程序不知道主内存的值已经被修改过了

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715153322.png)



## 17. Volatile

> 1.保证可见性

```java
package com.kuang.tvoliatile;

import java.util.concurrent.TimeUnit;

public class JMMDemo {
    private volatile static int num=0;

    //不加volatile程序就会死循环
    //加volatile 可以保证可见性
    public static void main(String[] args) {
        new Thread(()->{  //线程1 对主内存的变化是不知道的
            while (num==0){

            }
        }).start();


        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        num=1;
        System.out.println(num);
    }
}
```

> 2.不保证原子性

原子性:不可分割

线程A在执行任务的时候,不能被打扰的,也不能被分割的,要么同时成功,要么同时失败

```java
package com.kuang.tvoliatile;

//volatile 不保证原子性
public class VDemo02 {

    //volatile 不保证原子性
    private volatile static int num=0;

    //加synchronized 可以解决
    public  static void add(){
        num++;
    }

    public static void main(String[] args){

        //理论上num结果应该为2万
        for (int i = 1; i <= 20; i++) {
            new Thread(()->{
                for (int j = 0; j < 1000; j++) {
                    add();
                }
            }).start();
        }
        while(Thread.activeCount()>2){//main gc
            Thread.yield();
        }

        System.out.println(Thread.currentThread().getName()+" "+num);
    }
}
```

**如果不加lock和synchronized,怎么样保证原子性**

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715162840.png)

使用原子类、解决原子性问题

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715163650.png)

```java
package com.kuang.tvoliatile;

import java.util.concurrent.atomic.AtomicInteger;

//volatile 不保证原子性
public class VDemo02 {

    //volatile 不保证原子性
    //原子类的 Integer
    private volatile static AtomicInteger num=new AtomicInteger();

    //加synchronized 可以解决
    public  static void add(){
        //num++; //不是一个原子性操作
        num.getAndIncrement(); //AtomicInteger +1方法, CAS
    }

    public static void main(String[] args){

        //理论上num结果应该为2万
        for (int i = 1; i <= 20; i++) {
            new Thread(()->{
                for (int j = 0; j < 1000; j++) {
                    add();
                }
            }).start();
        }
        while(Thread.activeCount()>2){//main gc
            Thread.yield();
        }

        System.out.println(Thread.currentThread().getName()+" "+num);
    }
}
```

这些类的底层都直接和操作系统挂钩! 在内存中修改值! Unsafe类是一个很特殊的存在!

> 指令重排

什么是指令重排: **你写的程序,计算机并不是按照你写的那样去执行的.**

源代码-->编译器优化的重排-->指令并行也可能会重排--->内存系统也会重排---->   执行

**处理器在进行指令重排的时候,考虑:数据之间的依赖性!**

```java
int x=1; //1
int x=2; //2
x=x+5;   //3
y=x*x;   //4
我们所期望的 : 1234   但是可能执行的时候变成2134  1324
可不可能是  4123
```

可能造成影响的结果 a b x y 这四个值默认都是0:

| 线程A | 线程B |
| ----- | ----- |
| X=a   | y=b   |
| b=1   | a=2   |

正常的结果: x= 0; y =0;

| 线程A | 线程B |
| ----- | ----- |
| b=1   | a=2   |
| x=a   | y=b   |

指令重排导致的诡异结果:x=2 ;y=1;

> 非计算机专业

volatile可以避免指令重排

内存屏障, CPU指令,作用:

1. 保证特定的操作的执行顺序
2. 可以保证某些变量的内存可见性(利用这些特性olatile实现了可见性)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715172847.png)

Volatile是可以保持可见性,不能保证原子性,由于内存屏障,可以保证避免指令重排的现象产生! 

哪里用到 :单例模式

## 18. 彻底玩转单例模式

饿汉式、 DCL懒汉式



> 饿汉式

```java
package com.kuang.single;


//饿汉式单例
public class Hungry {

    //可能会浪费空间
    private byte[] data1 = new byte[1024*1024];
    private byte[] data2 = new byte[1024*1024];
    private byte[] data3 = new byte[1024*1024];
    private byte[] data4 = new byte[1024*1024];
    private Hungry(){

    }

    private final static Hungry HUGRY = new Hungry();

    public static Hungry getInstance(){
        return HUGRY;
    }

}
```

> DCL懒汉式

```java
package com.kuang.single;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

//懒汉式单例
//到搞一次 魔高一丈
public class LazyMan {
    private static boolean qinjiang =false;
    public LazyMan() {
        if(qinjiang==false){
            qinjiang=true;
        }else{
            throw new RuntimeException("不要试图运用反射去破坏异常");
        }

//        synchronized (LazyMan.class){
//            if (lazyMan!=null){
//                throw new RuntimeException("不要试图运用反射去破坏异常");
//            }
//        }
        System.out.println(Thread.currentThread().getName()+"okk");
    }

    private volatile static LazyMan lazyMan;

    //双重检测模式的 懒汉式单例 DCL懒汉式
    public static LazyMan getInstance(){
        if(lazyMan==null){
            synchronized (LazyMan.class){
                if(lazyMan==null){
                    lazyMan=new LazyMan();  //不是原子性操作
                    /*
                    * 1.分配内存空间
                    * 2.执行构造方法,初始化对象
                    * 3.把这个对象指向这个空间
                    *
                    * 123
                    * 132 A
                    *       B //此时lazyMan还没有完成构造*/
                }
            }
        }

        return lazyMan;
    }
    
    //多线程并发
//    public static void main(String[] args) {
//        for (int i = 0; i < 10; i++) {
//            new Thread(()->{
//                LazyMan.getInstance();
//            }).start();
//        }
//    }

    //反射!
    public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        //LazyMan instance = LazyMan.getInstance();
        Constructor<LazyMan> declaredConstructor = LazyMan.class.getDeclaredConstructor(null);
        declaredConstructor.setAccessible(true);
        LazyMan instance = declaredConstructor.newInstance();
        LazyMan instance2 = declaredConstructor.newInstance();
        System.out.println(instance==instance2);


    }

}

```

> 静态内部类的

```java
package com.kuang.single;

//静态内部类
public class Holder {
    private Holder() {
    }


    public static class InnerClass{
        private static final Holder HOLDER = new Holder();
    }
}

```

> 单例不安全,反射

> 枚举

```java
package com.kuang.single;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

//enum是一个什么?  本身也是一个class类
public enum EnumSingle {

    INSTANCE;
    public EnumSingle getInstance(){
        return INSTANCE;
    }
}
class Test{
    public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        EnumSingle instance = EnumSingle.INSTANCE;
        //这个出现NoSuchMethodException  : com.kuang.single.EnumSingle.<init>()
//       Constructor<EnumSingle> declaredConstructor = EnumSingle.class.getDeclaredConstructor(null);

        //用这个才会出现 Cannot reflectively create enum objects
        // at java.lang.reflect.Constructor.newInstance(Constructor.java:417)
        // at com.kuang.single.Test.main(EnumSingle.java:20)
        Constructor<EnumSingle> declaredConstructor = EnumSingle.class.getDeclaredConstructor(String.class,int.class);
        declaredConstructor.setAccessible(true);
        EnumSingle instance2 = declaredConstructor.newInstance();

        System.out.println(instance);
        System.out.println(instance2);
    }
}
```

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715185928.png)

枚举类型的最终反编译源码:

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715190816.png)

## 19. 深入理解CAS

> 什么是CAS

大厂你必须要深入研究底层! 有所突破!  **修内功,操作系统,计算机网络原理**

```java
package com.kuang.cas;

import java.util.concurrent.atomic.AtomicInteger;

public class CASDemo {


    //CAS
    public static void main(String[] args){
        AtomicInteger atomicInteger = new AtomicInteger(2020);

        //期望、更新
        // public final boolean compareAndSet(int expect, int update)
        //如果我期望的值达到了,那么就更新,否则,就不更新,CAS 是CPU的并发原理
        System.out.println(atomicInteger.compareAndSet(2020, 2021));
        System.out.println(atomicInteger.get());
        atomicInteger.getAndIncrement();

        System.out.println(atomicInteger.compareAndSet(2020, 2022));
        System.out.println(atomicInteger.get());
    }
}
```

> Unsafe类

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715192106.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715192337.png)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715192443.png)

CAS: 比较当前工作内存中的值和主内存中的值,如果这个值是期望的,那么则执行操作! 如果不是,就一直循环

**缺点**:

1. 循环会耗时
2. 一次性只能能保证一个共享变量的原子性
3. 会存在ABA问题

> CAS:ABA问题(狸猫换太子)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715193051.png)

```java
package com.kuang.cas;

import java.util.concurrent.atomic.AtomicInteger;

public class CASDemo {


    //CAS
    public static void main(String[] args){
        AtomicInteger atomicInteger = new AtomicInteger(2020);

        //期望、更新
        // public final boolean compareAndSet(int expect, int update)
        //如果我期望的值达到了,那么就更新,否则,就不更新,CAS 是CPU的并发原理

          //对于我们平时写的SQL: 乐观锁!
        
        
        // ===============捣乱的线程===============
        System.out.println(atomicInteger.compareAndSet(2020, 2021));
        System.out.println(atomicInteger.get());
        System.out.println(atomicInteger.compareAndSet(2021, 2020));
        System.out.println(atomicInteger.get());

        atomicInteger.getAndIncrement();
        // ===============期望的线程===============
        System.out.println(atomicInteger.compareAndSet(2020, 6666));
        System.out.println(atomicInteger.get());
    }
}
```

## 20.原子引用

> 解决ABA问题,引入原子引用! 对应的思想 :乐观锁!

带版本号的原子操作!

**注意:**

**Integer使用了对象缓存机制,默认范围-128~127 ,推荐使用静态工厂方法valueOf获取对象实例,而不是new 因为ValueOf使用缓存,而new 一定会创建新的对象分配新的内存空间**

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715200705.png)

```java
package com.kuang.cas;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicStampedReference;

public class CASDemo {


    //CAS
    public static void main(String[] args){

        //AtomicStampedReference 注意,如果泛型是一个包装类,注意对象的引用问题
        //正常在业务操作,这里面比较的都是一个个对象
        AtomicStampedReference<Integer> atomicStampedReference = new AtomicStampedReference<>(1,1);

        new Thread(()->{
            int stamp = atomicStampedReference.getStamp(); //获得版本号
            System.out.println("a1=>"+atomicStampedReference.getStamp());

            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            System.out.println(atomicStampedReference.compareAndSet(1, 2,
                    atomicStampedReference.getStamp(), atomicStampedReference.getStamp() + 1));
            System.out.println("a2=>"+atomicStampedReference.getStamp());

            System.out.println(atomicStampedReference.compareAndSet(2, 1,
                    atomicStampedReference.getStamp(), atomicStampedReference.getStamp() + 1));
            System.out.println("a3=>"+atomicStampedReference.getStamp());




        },"a").start();

        //乐观锁原理相同
        new Thread(()->{
            int stamp = atomicStampedReference.getStamp(); //获得版本号
            System.out.println("b1=>"+atomicStampedReference.getStamp());
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            System.out.println(atomicStampedReference.compareAndSet(1, 6,
                    stamp, stamp + 1));
            System.out.println("b2=>"+atomicStampedReference.getStamp());
        },"b").start();
    }
}
```

## 21. 各种锁的理解

### 1. 公平锁

公平锁:非常公平,不能够插队,必须先来后到

非公平锁:非常不公平,可以插队,3s  3h(默认都是非公平的)

```java
public ReentrantLock() {
    sync = new NonfairSync();
}
public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync();
}
```

### 2.可重入锁

可重入锁!(递归锁)

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715201518.png)

> Synchronized

```java
package com.kuang.lock;


import java.util.concurrent.TimeUnit;

//Synchronized
public class Demo01 {
    public static void main(String[] args) {
        Phone phone = new Phone();
        new Thread(()->{
            try {
                phone.sms();  //当其拿到sms的锁的时候,里面call的锁也拿到了,必须等最后一起释放锁,call方法结束不放锁,除非整个sms
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"A").start();

        new Thread(()->{
            phone.call();
        },"B").start();

    }
}
class Phone{
    public synchronized void sms() throws InterruptedException {
        System.out.println(Thread.currentThread().getName()+"sms");
        call(); //这里也有锁
        TimeUnit.SECONDS.sleep(12);
        System.out.println("2222");
    }
    public synchronized void call(){
        System.out.println(Thread.currentThread().getName()+"call");
    }
}
```

> Lock版本

```java
package com.kuang.lock;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Demo02 {
    public static void main(String[] args) {
        Phone2 phone = new Phone2();
        new Thread(()->{
            phone.sms();
        },"A").start();

        new Thread(()->{
            phone.sms();
        },"B").start();

    }
}
class Phone2{
    Lock lock = new ReentrantLock();

    public void sms(){
        lock.lock(); //细节问题:  lock.lock() ;lock.unlock(); //Lock锁必须配对,否则就会死在里面
        //lock锁必须配对,否则就会死在里面
        lock.lock();
        try {
            System.out.println(Thread.currentThread().getName()+"sms");
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            lock.unlock();
            lock.unlock();
        }
        call(); //这里也有锁
    }
    public  void call(){
        lock.lock();

        try {
            System.out.println(Thread.currentThread().getName()+"call");
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }
}
```

### 3. 自旋锁

spinlock

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715204623.png)

> 我们自定义一个锁测试

```java
package com.kuang.lock;


import java.util.concurrent.atomic.AtomicReference;

/**
 * 自旋锁
 */
public class SpinlockDemo {

    // int   0
    // Thread  null
    AtomicReference<Thread> atomicReference = new AtomicReference<>();

    // 加锁
    public void myLock(){
        Thread thread = Thread.currentThread();
        System.out.println(Thread.currentThread().getName() + "==> mylock");

        // 自旋锁
        while (!atomicReference.compareAndSet(null,thread)){

        }
    }


    // 解锁
    public void myUnLock(){
        Thread thread = Thread.currentThread();
        System.out.println(Thread.currentThread().getName() + "==> myUnlock");
        atomicReference.compareAndSet(thread,null);
    }



}
```

> 测试

```java
package com.kuang.lock;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class TestSpinLock {
    public static void main(String[] args) throws InterruptedException {
//        ReentrantLock reentrantLock = new ReentrantLock();
//        reentrantLock.lock();
//        reentrantLock.unlock();

        // 底层使用的自旋锁CAS
        SpinlockDemo lock = new SpinlockDemo();


        new Thread(()-> {
            lock.myLock();

            try {
                TimeUnit.SECONDS.sleep(5);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.myUnLock();
            }

        },"T1").start();

        TimeUnit.SECONDS.sleep(1);

        new Thread(()-> {
            lock.myLock();

            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.myUnLock();
            }

        },"T2").start();

    }
}
```

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715210234.png)

### 4.死锁

> 死锁是什么?

![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715210349.png)

死锁测试,怎么排除死锁:

```java
package com.kuang.lock;

import com.sun.org.apache.xpath.internal.SourceTree;

import java.util.concurrent.TimeUnit;

public class DeadLockDemo {
    public static void main(String[] args) {

        String lockA = "lockA";
        String lockB = "lockB";

        new Thread(new MyThread(lockA, lockB), "T1").start();
        new Thread(new MyThread(lockB, lockA), "T2").start();

    }
}


class MyThread implements Runnable{

    private String lockA;
    private String lockB;

    public MyThread(String lockA, String lockB) {
        this.lockA = lockA;
        this.lockB = lockB;
    }

    @Override
    public void run() {
        synchronized (lockA){
            System.out.println(Thread.currentThread().getName() + "lock:"+lockA+"=>get"+lockB);

            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            synchronized (lockB){
                System.out.println(Thread.currentThread().getName() + "lock:"+lockB+"=>get"+lockA);
            }

        }
    }
}
```

> 解决问题

1. 使用**jps-l**定位进程号

   ![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715211025.png)

   

2. 使用**jstack进程号**找到死锁问题
3. ![](D:\app\学习笔记\java基础重新来\java面试总结\java-\JUC笔记\图片\微信截图_20210715211314.png)

面试,工作中! 排查问题:

1. 日志
2. 堆栈信息
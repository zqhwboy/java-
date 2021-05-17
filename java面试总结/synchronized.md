# synchronized详解

对象分代年龄

JVM将java堆划分为新生代和老年代（为了更好管理对象）

对于新生代gc频率较高，老年代则较低

1、标记清除算法

首先标记出所有需要被清理的对象，然后再一次性清除

缺点：效率不高，产生大量的空间碎片。没有比较大的可使用的连续的空间。



2、复制算法

概念就是，将内存分成两块，将需要回收的对象同一复制到其中一块内存中，然后同一清理，这样就保证有一块大的连续空间。



新生代的内存划分，由于新生代98%对象都是需要清理的所以，内存划分并不需要1（清理）：1（保留）

| Eden | Survior From | Survior To |
| ---- | ------------ | ---------- |
| 8    | 1            | 1          |

按照上述比例划分9（清理）：1（保留）

当Eden区满的时候，会触发第一次Minor gc（清理），把还活着的对象移动到Survior From中。如果Eden再次区满，第二次触发Minor gc时（开始清理），然后会扫描Eden From和Survior From中还活着的对象，然后将它们移动到Survior To中

后续再发生Minor gc 时会扫描To和Eden然后将他们移动到From中，每个对象在From和To移动一次，它们的分代年龄+1，最大15（4bit）。（移动到老年代的条件）当年龄大于15或者满足相同年龄的对象占所处区的一半内存，就会将等于大于该年龄放进老年代。



注意：如果初始创建的对象比较大，超过了Eden那么直接将其放入老年代。不会执行Minor gc



标记整理算法（老年代回收算法）

由于老年代存活率较高，所以如果采用复制算法会将某些对象重复复制很多次。

当老年代的空间被用满时会触发full gc 然后将存活下来的对象移动到边界，这样就会留出一段比较大的连续的空间。   

full gc 效率比Minor gc 慢很多。













Java对象头与Monitor

在JVM中对象在内存中的布局分为三块区域：对象头、实例数据，对齐填充

![](C:\Users\50213\Pictures\20170603163237166.png)

实例变量：存放属性的数据（包括父类属性信息）

填充数据：因为JVM要求对象的大小必须是8字节的整数倍，用来填充数据没有实际意义。

对象头一般采用2个字来存储，如果对象是数组则会分配3个字，多余的那个字存储数组长度。

| 头对象结构             | 说明                                                   |
| ---------------------- | ------------------------------------------------------ |
| Mark Word              | 存储对象的hashCode、锁信息、GC标志                     |
| Class Metadata Address | 类型指针指向对象类元数据（用于确定该对象是哪个类实例） |

Mark Word 结构

| 锁状态   | 25bit    | 4bit         | 1bit是否偏向锁 | 2bit锁标志位 |
| -------- | -------- | ------------ | -------------- | ------------ |
| 无锁状态 | hashcode | 对象分代年龄 | 0              | 01           |

在JVM中Mark Word的结构并不是固定的

![](C:\Users\50213\Pictures\20170603172215966.png)

重量级锁：

锁标记位10，其中指针指向的是monitor对象的起始地址。java中每个对象都存在这一个monitor与之关联（关联方式有多种可以与对象同生共死，或者当线程试图获取对象锁时自动生成）。在JVM中monitor是由ObjectMonitor类实现

```java
ObjectMonitor() {
    _header       = NULL;
    _count        = 0; //记录个数
    _waiters      = 0,
    _recursions   = 0;
    _object       = NULL;
    _owner        = NULL; //指向持有ObjectMinitor对象的线程
    _WaitSet      = NULL; //处于wait状态的线程，会被加入到_WaitSet队列
    _WaitSetLock  = 0 ;
    _Responsible  = NULL ;
    _succ         = NULL ;
    _cxq          = NULL ;
    FreeNext      = NULL ;
    _EntryList    = NULL ; //处于等待锁block状态的线程，会被加入到该队列
    _SpinFreq     = 0 ;
    _SpinClock    = 0 ;
    OwnerIsThread = 0 ;
  }
```

所有等待锁的线程都会封装成ObjectWaiter对象。当多个线程同时访问一段同步代码时，首先会进入EntryList中，当线程进入owner中，会将count加1，然后将_owner指向该线程。

如果该线程调用wait，或者该线程执行完毕那么count减一，_owner=null。

![](C:\Users\50213\Pictures\20170604114223462.png)

总结：对象头中有指向monitor对象的指针。实际上由monitor来控制只允许一个线程同时执行某段代码。

这也是为什么wait、notifyAll、notify方法存在于Object中

当
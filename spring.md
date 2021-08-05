# spring

# 用在属性上的注解

```
@Autowired
先根据类型去匹配,多个类型的时候会再通过名字匹配

说明:即使你名字给装配对象的名字一样,但是你不是同个类型的照样不可以
```

```java
@Qualifier 不能单独使用
@Autowired是根据类型自动装配的，加上@Qualifier则可以根据byName的方式自动装配     可以指定名字了而已,相当于Autowired用名字装配的时候可以根据指定名字装配了而已
```

```java
@Resource如有指定的name属性，先按该属性进行byName方式查找装配；
其次再进行默认的byName方式进行装配；
如果以上都不成功，则按byType的方式自动装配。
```

# 用在类上的注解

```
@Component
dao    @Repository
service  @Service
controller @Controller
```

# 动态代理


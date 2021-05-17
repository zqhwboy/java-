# 字符串转数组

```java
 		 String s="12345";
         //字符串转数组
    char[] chars = s.toCharArray();
```

# 数组转list

```
String s="12345";
//字符串转数组
 char[] chars = s.toCharArray();
 System.out.println(chars);
 //数组转list
 List<char[]> list = Arrays.asList(chars);
```

# list转字符串

```
//list转为字符串
StringBuffer sb = new StringBuffer();
for (int i = 0; i <list.size() ; i++) {
    sb.append(list.get(i));
    System.out.println(list.get(i));
}
System.out.println(sb.charAt(1));  //取出指定位置元素
sb.deleteCharAt(2);  //删除指定位置元素
System.out.println(sb.toString());  //StringBuffer转字符串
```


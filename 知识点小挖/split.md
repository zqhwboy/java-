# split小挖

```
@Test
public void test2(){
    char [] chars =new char[8];
    chars[0]=' ';
    chars[1]=' ';
    chars[2]='2';
    chars[3]='3';
    chars[5]='4';
    chars[7]=' ';
    System.out.println(chars[4]==0); //true
    String string = new String(chars);
    System.out.println(string); //空格空格234空格   中间没有赋初始值的都不显示
    String[] split = string.split("\\s+");
    System.out.println(split[1]);//234 chars[4]=0不显示
    System.out.println(split[1].length()); //5  到达下一个个split截断前停止,如果后面没有截断的name直接到达末尾
}
```

* 默认值你需要知道
* 打印时候字符没赋值的不打
* split计算长度的时候是到下一个分割点停止,如果没有直接到达末尾.
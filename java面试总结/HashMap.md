# HashMap

```java
  16  * HashMap是常用的Java集合之一，是基于哈希表的Map接口的实现。与HashTable主要区别为不支持同步和允许null作为key和value。
  17  * HashMap非线程安全，即任一时刻可以有多个线程同时写HashMap，可能会导致数据的不一致。
  18  * 如果需要满足线程安全，可以用 Collections的synchronizedMap方法使HashMap具有线程安全的能力，或者使用ConcurrentHashMap。
  19  * 在JDK1.6中，HashMap采用数组+链表实现，即使用链表处理冲突，同一hash值的链表都存储在一个链表里。
  20  * 但是当位于一个数组中的元素较多，即hash值相等的元素较多时，通过key值依次查找的效率较低。
  21  * 而JDK1.8中，HashMap采用数组+链表+红黑树实现，当链表长度超过阈值8时，将链表转换为红黑树，这样大大减少了查找时间。
  22  * 原本Map.Entry接口的实现类Entry改名为了Node。转化为红黑树时改用另一种实现TreeNode。
  23  */
  24 public class HashMap<K, V> extends AbstractMap<K, V>
  25         implements Map<K, V>, Cloneable, Serializable {
  26 
  27     private static final long serialVersionUID = 362498820763181265L;
  
  29 
  30     /**
  31      * 默认的初始容量（容量为HashMap中槽的数目）是16，且实际容量必须是2的整数次幂。
  32      */
  33     static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16
  34 
  35     /**
  36      * 最大容量（必须是2的幂且小于2的30次方，传入容量过大将被这个值替换）
  37      */
  38     static final int MAXIMUM_CAPACITY = 1 << 30;
  39 
  40     /**
  41      * 默认装填因子0.75，如果当前键值对个数 >= HashMap最大容量*装填因子，进行rehash操作
  42      */
  43     static final float DEFAULT_LOAD_FACTOR = 0.75f;
  44 
  45     /**
  46      * JDK1.8 新加，Entry链表最大长度，当桶中节点数目大于该长度时，将链表转成红黑树存储；
  47      */
  48     static final int TREEIFY_THRESHOLD = 8;
  49 
  50     /**
  51      * JDK1.8 新加，当桶中节点数小于该长度，将红黑树转为链表存储；
  52      */
  53     static final int UNTREEIFY_THRESHOLD = 6;
  54 
  55     /**
  56      * 桶可能被转化为树形结构的最小容量。当哈希表的大小超过这个阈值，才会把链式结构转化成树型结构，否则仅采取扩容来尝试减少冲突。
  57      * 应该至少4*TREEIFY_THRESHOLD来避免扩容和树形结构化之间的冲突。
  58      */
  59     static final int MIN_TREEIFY_CAPACITY = 64;
  60 
  61     /**
  62      * JDK1.6用Entry描述键值对，JDK1.8中用Node代替Entry
  63      */
  64     static class Node<K, V> implements Map.Entry<K, V> {
  65         // hash存储key的hashCode
  66         final int hash;
  67         // final:一个键值对的key不可改变
  68         final K key;
  69         V value;
  70         //指向下个节点的引用
  71         Node<K, V> next;
  72 
  73         //构造函数
  74         Node(int hash, K key, V value, Node<K, V> next) {
  75             this.hash = hash;
  76             this.key = key;
  77             this.value = value;
  78             this.next = next;
  79         }
  80 
  81         public final K getKey() {
  82             return key;
  83         }
  84 
  85         public final V getValue() {
  86             return value;
  87         }
  88 
  89         public final String toString() {
  90             return key + "=" + value;
  91         }
  92 
  93         public final int hashCode() {
  94             return Objects.hashCode(key) ^ Objects.hashCode(value);
  95         }
  96 
  97         public final V setValue(V newValue) {
  98             V oldValue = value;
  99             value = newValue;
 100             return oldValue;
 101         }
 102 
 103         public final boolean equals(Object o) {
 104             if (o == this)
 105                 return true;
 106             if (o instanceof Map.Entry) {
 107                 Map.Entry<?, ?> e = (Map.Entry<?, ?>) o;
 108                 if (Objects.equals(key, e.getKey()) &&
 109                         Objects.equals(value, e.getValue()))
 110                     return true;
 111             }
 112             return false;
 113         }
 114     }
 115 
 116     /* ---------------- Static utilities -------------- */
 117 
 118     /**
 119      * HashMap中键值对的存储形式为链表节点，hashCode相同的节点（位于同一个桶）用链表组织
 120      * hash方法分为三步:
 121      * 1.取key的hashCode
 122      * 2.key的hashCode高16位异或低16位
 123      * 3.将第一步和第二步得到的结果进行取模运算。
 124      */
 125     static final int hash(Object key) {
 126         int h;
 127         //计算key的hashCode, h = Objects.hashCode(key)
 128         //h >>> 16表示对h无符号右移16位，高位补0，然后h与h >>> 16按位异或
 129         return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
 130     }
 131 
 132     /**
 133      * 如果参数x实现了Comparable接口，返回参数x的类名，否则返回null
 134      */
 135     static Class<?> comparableClassFor(Object x) {
 136         if (x instanceof Comparable) {
 137             Class<?> c;
 138             Type[] ts, as;
 139             Type t;
 140             ParameterizedType p;
 141             if ((c = x.getClass()) == String.class) // bypass checks
 142                 return c;
 143             if ((ts = c.getGenericInterfaces()) != null) {
 144                 for (int i = 0; i < ts.length; ++i) {
 145                     if (((t = ts[i]) instanceof ParameterizedType) &&
 146                             ((p = (ParameterizedType) t).getRawType() ==
 147                                     Comparable.class) &&
 148                             (as = p.getActualTypeArguments()) != null &&
 149                             as.length == 1 && as[0] == c) // type arg is c
 150                         return c;
 151                 }
 152             }
 153         }
 154         return null;
 155     }
 156 
 157     /**
 158      * 如果x的类型为kc，则返回k.compareTo(x)，否则返回0
 159      */
 160     @SuppressWarnings({"rawtypes", "unchecked"}) // for cast to Comparable
 161     static int compareComparables(Class<?> kc, Object k, Object x) {
 162         return (x == null || x.getClass() != kc ? 0 :
 163                 ((Comparable) k).compareTo(x));
 164     }
 165 
 166     /**
 167      * 返回大于cap的最小2的幂    5返回8
 168      */
 169     static final int tableSizeFor(int cap) {
 171         int n = cap - 1;
     		 //这个减一使得如果输入的是2整数次幂返回的是本身，因为下面的代码会使得前面每一位得值都变为1
             //1001运行后就会变成1111
 172         n |= n >>> 1;
 173         n |= n >>> 2;
 174         n |= n >>> 4;
 175         n |= n >>> 8;
 176         n |= n >>> 16;
 177         return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
 178     }
 179 
 180     /* ---------------- Fields -------------- */
 181 
 182     /**
 183      * 哈希桶数组，分配的时候，table的长度总是2的幂
 184      */
 185     transient Node<K, V>[] table;
 186 
 187     /**
 188      * HashMap将数据转换成set的另一种存储形式，这个变量主要用于迭代功能
 189      */
 190     transient Set<Map.Entry<K, V>> entrySet;
 191 
 192     /**
 193      * 实际存储的数量，则HashMap的size()方法，实际返回的就是这个值，isEmpty()也是判断该值是否为0
 194      */
 195     transient int size;
 196 
 197     /**
 198      * hashmap结构被改变的次数，fail-fast机制
 199      */
 200     transient int modCount;
 201 
 202     /**
 203      * HashMap的扩容阈值，在HashMap中存储的Node键值对超过这个数量时，自动扩容容量为原来的二倍
 204      * 这个是节点数量
 205      * @serial
 206      */
 207     int threshold;
 208 
 209     /**
 210      * HashMap的负加载因子，可计算出当前table长度下的扩容阈值：threshold = loadFactor * table.length
 211      *
 212      * @serial
 213      */并没有初始化与DEFAULT_LOAD_FACTOR作用是相同的
 214     final float loadFactor;    
 215 
 216     /* ---------------- Public operations -------------- */
 217 
 218     /**
 219      * 使用指定的初始化容量initial capacity 和加载因子load factor构造一个空HashMap
 220      *
 221      * @param initialCapacity 初始化容量
 222      * @param loadFactor      加载因子
 223      * @throws IllegalArgumentException 如果指定的初始化容量为负数或者加载因子为非正数
 224      */
 225     public HashMap(int initialCapacity, float loadFactor) {
 226         if (initialCapacity < 0)
 227             throw new IllegalArgumentException("Illegal initial capacity: " +
 228                     initialCapacity);
 229         if (initialCapacity > MAXIMUM_CAPACITY)
 230             initialCapacity = MAXIMUM_CAPACITY;
 231         if (loadFactor <= 0 || Float.isNaN(loadFactor))
 232             throw new IllegalArgumentException("Illegal load factor: " +
 233                     loadFactor);
 234         this.loadFactor = loadFactor;
 235         this.threshold = tableSizeFor(initialCapacity);
 236     }
 237 
 238     /**
 239      * 使用指定的初始化容量initial capacity和默认加载因子DEFAULT_LOAD_FACTOR（0.75）构造一个空HashMap
 240      *
 241      * @param initialCapacity 初始化容量
 242      * @throws IllegalArgumentException 如果指定的初始化容量为负数
 243      */
 244     public HashMap(int initialCapacity) {
 245         this(initialCapacity, DEFAULT_LOAD_FACTOR);
 246     }
 247 
 248     /**
 249      * 使用指定的初始化容量（16）和默认加载因子DEFAULT_LOAD_FACTOR（0.75）构造一个空HashMap
 250      */
 251     public HashMap() {
 252         this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
 253     }
 254 
 255     /**
 256      * 使用指定Map m构造新的HashMap。使用指定的初始化容量（16）和默认加载因子DEFAULT_LOAD_FACTOR（0.75）
 257      *
 258      * @param m 指定的map
 259      * @throws NullPointerException 如果指定的map是null
 260      */
 261     public HashMap(Map<? extends K, ? extends V> m) {
 262         this.loadFactor = DEFAULT_LOAD_FACTOR;
 263         putMapEntries(m, false);
 264     }
 265 
 266     /**
 267      * Map.putAll and Map constructor的实现需要的方法
 268      * 将m的键值对插入本map中
 269      *
 270      * @param m     指定的map
 271      * @param evict 初始化map时使用false，否则使用true
 272      */
 273     final void putMapEntries(Map<? extends K, ? extends V> m, boolean evict) {
 274         int s = m.size();
 275         //如果参数map不为空
 276         if (s > 0) {
 277             // 判断table是否已经初始化
 278             if (table == null) { // pre-size
 279                 // 未初始化，s为m的实际元素个数,计算出s小于阈值的值（x*0.75==s）ft就是x的值
 280                 float ft = ((float) s / loadFactor) + 1.0F;
 281                 int t = ((ft < (float) MAXIMUM_CAPACITY) ?
 282                         (int) ft : MAXIMUM_CAPACITY);
 283                 // 计算得到的t大于阈值，则初始化阈值
 284                 if (t > threshold)
 285                     //根据容量初始化临界值2的整数次幂这是大小为什么是2的整数次幂的原因
 286                     threshold = tableSizeFor(t);
 287                 // 已初始化，并且m元素个数大于阈值，进行扩容处理
 288             } else if (s > threshold)
 289                 //扩容处理，扩展2倍符合2的整数次幂
 290                 resize();
 291             // 将m中的所有元素添加至HashMap中
 292             for (Map.Entry<? extends K, ? extends V> e : m.entrySet()) {
 293                 K key = e.getKey();
 294                 V value = e.getValue();
 295                 putVal(hash(key), key, value, false, evict);
 296             }
 297         }
 298     }
 299 
 300     /**
 301      * 返回map中键值对映射的个数
 302      *
 303      * @return map中键值对映射的个数
 304      */
 305     public int size() {
 306         return size;
 307     }
 308 
 309     /**
 310      * 如果map中没有键值对映射，返回true
 311      *
 312      * @return 如果map中没有键值对映射，返回true
 313      */
 314     public boolean isEmpty() {
 315         return size == 0;
 316     }
 317 
 318     /**
 319      * 返回指定的key映射的value，如果value为null，则返回null
 320      * get可以分为三个步骤：
 321      * 1.通过hash(Object key)方法计算key的哈希值hash。
 322      * 2.通过getNode( int hash, Object key)方法获取node。
 323      * 3.如果node为null，返回null，否则返回node.value。
 324      *
 325      * @see #put(Object, Object)
 326      */
 327     public V get(Object key) {
 328         Node<K, V> e;
 329         //根据key及其hash值查询node节点，如果存在，则返回该节点的value值
 330         return (e = getNode(hash(key), key)) == null ? null : e.value;
 331     }
 332 
 333     /**
 334      * 根据key的哈希值和key获取对应的节点
 335      * getNode可分为以下几个步骤：
 336      * 1.如果哈希表为空，或key对应的桶为空，返回null
 337      * 2.如果桶中的第一个节点就和指定参数hash和key匹配上了，返回这个节点。
 338      * 3.如果桶中的第一个节点没有匹配上，而且有后续节点
 339      * 3.1如果当前的桶采用红黑树，则调用红黑树的get方法去获取节点
 340      * 3.2如果当前的桶不采用红黑树，即桶中节点结构为链式结构，遍历链表，直到key匹配
 341      * 4.找到节点返回null，否则返回null。
 342      *
 343      * @param hash 指定参数key的哈希值
 344      * @param key  指定参数key
 345      * @return 返回node，如果没有则返回null
 346      */
 347     final Node<K, V> getNode(int hash, Object key) {
 348         Node<K, V>[] tab;
 349         Node<K, V> first, e;
 350         int n;
 351         K k;
 352         //如果哈希表不为空，而且key对应的桶上不为空
 353         if ((tab = table) != null && (n = tab.length) > 0 &&
 354                 (first = tab[(n - 1) & hash]) != null) {
 355             //如果桶中的第一个节点就和指定参数hash和key匹配上了 tab[(n - 1) & hash]暂时还没有理解
 356             if (first.hash == hash && // always check first node
 357                     ((k = first.key) == key || (key != null && key.equals(k))))
 358                 //返回桶中的第一个节点
 359                 return first;
 360             //如果桶中的第一个节点没有匹配上，而且有后续节点
 361             if ((e = first.next) != null) {
 362                 //如果当前的桶采用红黑树，则调用红黑树的get方法去获取节点
 363                 if (first instanceof TreeNode)
 364                     return ((TreeNode<K, V>) first).getTreeNode(hash, key);
 365                 //如果当前的桶不采用红黑树，即桶中节点结构为链式结构
 366                 do {
 367                     //遍历链表，直到key匹配
 368                     if (e.hash == hash &&
 369                             ((k = e.key) == key || (key != null && key.equals(k))))
 370                         return e;
 371                 } while ((e = e.next) != null);
 372             }
 373         }
 374         //如果哈希表为空，或者没有找到节点，返回null
 375         return null;
 376     }
 377 
 378     /**
 379      * 如果map中含有key为指定参数key的键值对，返回true
 380      *
 381      * @param key 指定参数key
 382      * @return 如果map中含有key为指定参数key的键值对，返回true
 383      * key.
 384      */
 385     public boolean containsKey(Object key) {
 386         return getNode(hash(key), key) != null;
 387     }
 388 
 389     /**
 390      * 将指定参数key和指定参数value插入map中，如果key已经存在，那就替换key对应的value
 391      * put(K key, V value)可以分为三个步骤：
 392      * 1.通过hash(Object key)方法计算key的哈希值。
 393      * 2.通过putVal(hash(key), key, value, false, true)方法实现功能。
 394      * 3.返回putVal方法返回的结果。
 395      *
 396      * @param key   指定key
 397      * @param value 指定value
 398      * @return 如果value被替换，则返回旧的value，否则返回null。当然，可能key对应的value就是null
 399      */
 400     public V put(K key, V value) {
 401         // 倒数第二个参数false：表示允许旧值替换
 402         // 最后一个参数true：表示HashMap不处于创建模式
 403         return putVal(hash(key), key, value, false, true);
 404     }
 405 
 406     /**
 407      * Map.put和其他相关方法的实现需要的方法
 408      * putVal方法可以分为下面的几个步骤:
 409      * 1.如果哈希表为空，调用resize()创建一个哈希表。
 410      * 2.如果指定参数hash在表中没有对应的桶，即为没有碰撞，直接将键值对插入到哈希表中即可。
 411      * 3.如果有碰撞，遍历桶，找到key映射的节点（这个意思是该桶内所有的节点都是这个哈希值，找到桶还要比较key的值）
 412      * 3.1桶中的第一个节点就匹配了，将桶中的第一个节点记录起来。
 413      * 3.2如果桶中的第一个节点没有匹配，且桶中结构为红黑树，则调用红黑树对应的方法插入键值对。
 414      * 3.3如果不是红黑树，那么就肯定是链表。遍历链表，如果找到了key映射的节点，就记录这个节点，退出循环。如果没有找到，在链表尾部插入节点。插入后，如果链的长度大于TREEIFY_THRESHOLD这个临界值，则使用treeifyBin方法把链表转为红黑树。
 415      * 4.如果找到了key映射的节点，且节点不为null
 416      * 4.1记录节点的vlaue。
 417      * 4.2如果参数onlyIfAbsent为false，或者oldValue为null，替换value，否则不替换。（既不为空也不是false就不替换了）
 418      * 4.3返回记录下来的节点的value。
 419      * 5.如果没有找到key映射的节点（2、3步中讲了，这种情况会插入到hashMap中），插入节点后size会加1，这时要检查size是否大于临界值threshold，如果大于会使用resize方法进行扩容。
 420      *
 421      * @param hash         指定参数key的哈希值
 422      * @param key          指定参数key
 423      * @param value        指定参数value
 424      * @param onlyIfAbsent 如果为true，即使指定参数key在map中已经存在，也不会替换value
 425      * @param evict        如果为false，数组table在创建模式中
 426      * @return 如果value被替换，则返回旧的value，否则返回null。当然，可能key对应的value就是null。
 427      */
 428     final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
 429                    boolean evict) {
 430         Node<K, V>[] tab;
 431         Node<K, V> p;
 432         int n, i;
 433         //如果哈希表为空，调用resize()创建一个哈希表，并用变量n记录哈希表长度
 434         if ((tab = table) == null || (n = tab.length) == 0)
 435             n = (tab = resize()).length;
 436         /**
 437          * 如果指定参数hash在表中没有对应的桶，即为没有碰撞
 438          * Hash函数，(n - 1) & hash 计算key将被放置的槽位
 439          * (n - 1) & hash 本质上是hash % n，位运算更快只有n等于二的幂次方时成立
 				也是为什么map大小为2的幂次方了
 				原理由于n是2的幂次方所有在n前面的位数相加必能整除n，所以可以(n - 1) & hash作为余数因为
 440          */
 441         if ((p = tab[i = (n - 1) & hash]) == null)
 442             //直接将键值对插入到map中即可
 443             tab[i] = newNode(hash, key, value, null);
 444         else {// 桶中已经存在元素
 445             Node<K, V> e;
 446             K k;
 447             // 比较桶中第一个元素(数组中的结点)的hash值相等，key（有可能是对象）比较内容
 448             if (p.hash == hash &&
 449                     ((k = p.key) == key || (key != null && key.equals(k))))
 450                 // 将第一个元素赋值给e，用e来记录
 451                 e = p;
 452                 // 当前桶中无该键值对，且桶是红黑树结构，按照红黑树结构插入
 453             else if (p instanceof TreeNode)
 454                 e = ((TreeNode<K, V>) p).putTreeVal(this, tab, hash, key, value);
 455                 // 当前桶中无该键值对，且桶是链表结构，按照链表结构插入到尾部
 456             else {
 457                 for (int binCount = 0; ; ++binCount) {
 458                     // 遍历到链表尾部，就插入该节点。
 459                     if ((e = p.next) == null) {
 460                         p.next = newNode(hash, key, value, null);
 461                         // 检查链表长度是否达到阈值，达到将该槽位节点组织形式转为红黑树
 462                         if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
 463                             treeifyBin(tab, hash);
 464                         break;
 465                     }
 466                     // 链表节点的<key, value>与put操作<key, value>相同时，不做重复操作，跳出循环
 467                     if (e.hash == hash &&
 468                             ((k = e.key) == key || (key != null && key.equals(k))))
 469                         break;
 470                     p = e;
 471                 }
 472             }
     			//上面部分的代码都是在找key值对应的节点。只需要替换节点的属性value的值即可
 473             // 找到或新建一个key和hashCode与插入元素相等的键值对，进行put操作
 474             if (e != null) { // existing mapping for key
 475                 // 记录e的value
 476                 V oldValue = e.value;
 477                 /**
 478                  * onlyIfAbsent为false或旧值为null时，允许替换旧值
 479                  * 否则无需替换
 480                  */
 481                 if (!onlyIfAbsent || oldValue == null)
 482                     e.value = value;
 483                 // 访问后回调
 484                 afterNodeAccess(e);
 485                 // 返回旧值
 486                 return oldValue;
 487             }
 488         }
 489         // 更新结构化修改信息
 490         ++modCount;
 491         // 键值对数目超过阈值时，进行rehash
 492         if (++size > threshold)
 493             resize();
 494         // 插入后回调，为LinkedHashMap服务的
 495         afterNodeInsertion(evict);
 496         return null;
 497     }
 498 
 499     /**
 500      * 对table进行初始化或者扩容。
 			都是先计算出table数组的长度以及阙值后再创建新的table数组
 501      * 如果table为null，则对table进行默认值的初始化。
 502      * 如果对table扩容，因为每次扩容都是翻倍，与原来计算（n-1）&hash的结果相比，节点要么就在原来的位置，要么就被分配到“原位置+旧容量”这个位置
 503      * resize的步骤总结为:
 504      * 1.计算扩容后的容量，临界值。
 505      * 2.将hashMap的临界值修改为扩容后的临界值
 506      * 3.根据扩容后的容量新建数组，然后将hashMap的table的引用指向新数组。
 507      * 4.将旧数组的元素复制到table中。
 508      *
 509      * @return the table
 510      */
 511     final Node<K, V>[] resize() {
 512         //新建oldTab数组保存扩容前的数组table
 513         Node<K, V>[] oldTab = table;
 514         //获取原来数组的长度
 515         int oldCap = (oldTab == null) ? 0 : oldTab.length;
 516         //原来数组扩容的临界值
 517         int oldThr = threshold;
 518         int newCap, newThr = 0;
 519         //如果扩容前的容量 > 0
 520         if (oldCap > 0) {
 521             //如果原来的数组长度大于最大值(2^30)
 522             if (oldCap >= MAXIMUM_CAPACITY) {
 523                 //扩容临界值提高到正无穷
 524                 threshold = Integer.MAX_VALUE;
 525                 //无法进行扩容，返回原来的数组
 526                 return oldTab;
 527                 //如果现在容量的两倍小于最大且现在的容量大于初始值
 528             } else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
 529                     oldCap >= DEFAULT_INITIAL_CAPACITY)
 530                 //临界值变为原来的2倍
 531                 newThr = oldThr << 1;
 532         } else if (oldThr > 0) //如果旧容量 <= 0，而且旧临界值 > 0
 533             //数组的新容量设置为老数组扩容的临界值
 534             newCap = oldThr;
 535         else { //如果旧容量 <= 0，且旧临界值 <= 0，新容量扩充为默认初始化容量，新临界值为DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY
 536             newCap = DEFAULT_INITIAL_CAPACITY;//新数组初始容量设置为默认值
 537             newThr = (int) (DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);//计算默认容量下的阈值
 538         }
 539         // 计算新的resize上限
 540         if (newThr == 0) {//在当上面的条件判断中，只有oldThr > 0成立时，newThr == 0，只有这一步没有对newThr进行赋值
 541             //ft为临时临界值，下面会确定这个临界值是否合法，如果合法，那就是真正的临界值
 542             float ft = (float) newCap * loadFactor;
 543             //当新容量< MAXIMUM_CAPACITY且ft < (float)MAXIMUM_CAPACITY，新的临界值为ft，否则为Integer.MAX_VALUE
 544             newThr = (newCap < MAXIMUM_CAPACITY && ft < (float) MAXIMUM_CAPACITY ?
 545                     (int) ft : Integer.MAX_VALUE);
 546         }
 547         //将扩容后hashMap的临界值设置为newThr
 548         threshold = newThr;
 549         //创建新的table，初始化容量为newCap
 550         @SuppressWarnings({"rawtypes", "unchecked"})
 551         Node<K, V>[] newTab = (Node<K, V>[]) new Node[newCap];
 552         //修改hashMap的table为新建的newTab
 553         table = newTab;
 554         //如果旧table不为空，将旧table中的元素复制到新的table中
 555         if (oldTab != null) {
 556             //遍历旧哈希表的每个桶，将旧哈希表中的桶复制到新的哈希表中
 557             for (int j = 0; j < oldCap; ++j) {
 558                 Node<K, V> e;
 559                 //如果旧桶不为null，使用e记录旧桶
 560                 if ((e = oldTab[j]) != null) {
 561                     //将旧桶置为null
 562                     oldTab[j] = null;
 563                     //如果旧桶中只有一个node
 564                     if (e.next == null)
 565                         //将e也就是oldTab[j]放入newTab中e.hash & (newCap - 1)的位置
 566                         newTab[e.hash & (newCap - 1)] = e;
 567                         //如果旧桶中的结构为红黑树
 568                     else if (e instanceof TreeNode)
 569                         //将树中的node分离
 570                         ((TreeNode<K, V>) e).split(this, newTab, j, oldCap);
 571                     else {  //如果旧桶中的结构为链表,链表重排，jdk1.8做的一系列优化
 572                         Node<K, V> loHead = null, loTail = null;
 573                         Node<K, V> hiHead = null, hiTail = null;
 574                         Node<K, V> next;
 575                         //遍历整个链表中的节点
 576                         do {
 577                             next = e.next;
 578                             // 就是区分新增的那一位是否等于0如果是就是原索引，不是就是原索引加oldcap
 579                             if ((e.hash & oldCap) == 0) {
 580                                 if (loTail == null)
 581                                     loHead = e;
 582                                 else
 583                                     loTail.next = e;
 584                                 loTail = e;
 585                             } else {// 原索引+oldCap
 586                                 if (hiTail == null)
 587                                     hiHead = e;
 588                                 else
 589                                     hiTail.next = e;
 590                                 hiTail = e;
 591                             }
 592                         } while ((e = next) != null);
 593                         // 原索引放到bucket里
 594                         if (loTail != null) {
 595                             loTail.next = null;
 596                             newTab[j] = loHead;
 597                         }
 598                         // 原索引+oldCap放到bucket里
 599                         if (hiTail != null) {
 600                             hiTail.next = null;
 601                             newTab[j + oldCap] = hiHead;
 602                         }
 603                     }
 604                 }
 605             }
 606         }
 607         return newTab;
 608     }
 609 
 610     /**
 611      * 将链表转化为红黑树
 612      */
 613     final void treeifyBin(Node<K, V>[] tab, int hash) {
 614         int n, index;
 615         Node<K, V> e;
 616         //如果桶数组table为空，或者桶数组table的长度小于MIN_TREEIFY_CAPACITY，不符合转化为红黑树的条件
 617         if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
 618             //扩容
 619             resize();
 620             //如果符合转化为红黑树的条件，而且hash对应的桶不为null
 621         else if ((e = tab[index = (n - 1) & hash]) != null) {
 622             // 红黑树的头、尾节点
 623             TreeNode<K, V> hd = null, tl = null;
 624             //遍历链表
 625             do {
 626                 //替换链表node为树node，建立双向链表
 627                 TreeNode<K, V> p = replacementTreeNode(e, null);
 628                 // 确定树头节点
 629                 if (tl == null)
 630                     hd = p;
 631                 else {
 632                     p.prev = tl;
 633                     tl.next = p;
 634                 }
 635                 tl = p;
 636             } while ((e = e.next) != null);
 637             //遍历链表插入每个节点到红黑树
 638             if ((tab[index] = hd) != null)
 639                 hd.treeify(tab);
 640         }
 641     }
 642 
 643     /**
 644      * 将参数map中的所有键值对映射插入到hashMap中，如果有碰撞，则覆盖value。
 645      *
 646      * @param m 参数map
 647      * @throws NullPointerException 如果map为null
 648      */
 649     public void putAll(Map<? extends K, ? extends V> m) {
 650         putMapEntries(m, true);
 651     }
 652 
 653     /**
 654      * 删除hashMap中key映射的node
 655      * remove方法的实现可以分为三个步骤：
 656      * 1.通过 hash(Object key)方法计算key的哈希值。
 657      * 2.通过 removeNode 方法实现功能。
 658      * 3.返回被删除的node的value。
 659      *
 660      * @param key 参数key
 661      * @return 如果没有映射到node，返回null，否则返回对应的value
 662      */
 663     public V remove(Object key) {
 664         Node<K, V> e;
 665         //根据key来删除node。removeNode方法的具体实现在下面
 666         return (e = removeNode(hash(key), key, null, false, true)) == null ?
 667                 null : e.value;
 668     }
 669 
 670     /**
 671      * Map.remove和相关方法的实现需要的方法
 672      * removeNode方法的步骤总结为:
 673      * 1.如果数组table为空或key映射到的桶为空，返回null。
 674      * 2.如果key映射到的桶上第一个node的就是要删除的node，记录下来。
 675      * 3.如果桶内不止一个node，且桶内的结构为红黑树，记录key映射到的node。
 676      * 4.桶内的结构不为红黑树，那么桶内的结构就肯定为链表，遍历链表，找到key映射到的node，记录下来。
 677      * 5.如果被记录下来的node不为null，删除node，size-1被删除。
 678      * 6.返回被删除的node。
 679      *
 680      * @param hash       key的哈希值
 681      * @param key        key的哈希值
 682      * @param value      如果 matchValue 为true，则value也作为确定被删除的node的条件之一，否则忽略
 683      * @param matchValue 如果为true，同时成立则删除
 684      * @param movable    如果为false，删除node时不会删除其他node
 685      * @return 返回被删除的node，如果没有node被删除，则返回null（针对红黑树的删除方法）
 686      */
 687     final Node<K, V> removeNode(int hash, Object key, Object value,
 688                                 boolean matchValue, boolean movable) {
 689         Node<K, V>[] tab;
 690         Node<K, V> p;
 691         int n, index;
 692         //如果数组table不为空且key映射到的桶不为空
 693         if ((tab = table) != null && (n = tab.length) > 0 &&
 694                 (p = tab[index = (n - 1) & hash]) != null) {
 695             Node<K, V> node = null, e;
 696             K k;
 697             V v;
 698             //如果桶上第一个node的就是要删除的node
 699             if (p.hash == hash &&
 700                     ((k = p.key) == key || (key != null && key.equals(k))))
 701                 //记录桶上第一个node
 702                 node = p;
 703             else if ((e = p.next) != null) {//如果桶内不止一个node
 704                 //如果桶内的结构为红黑树
 705                 if (p instanceof TreeNode)
 706                     //记录key映射到的node
 707                     node = ((TreeNode<K, V>) p).getTreeNode(hash, key);
 708                 else {//如果桶内的结构为链表
 709                     do {//遍历链表，找到key映射到的node
 710                         if (e.hash == hash &&
 711                                 ((k = e.key) == key ||
 712                                         (key != null && key.equals(k)))) {
 713                             //记录key映射到的node
 714                             node = e;
 715                             break;
 716                         }
 717                         p = e;
 718                     } while ((e = e.next) != null);
 719                 }
 720             }
 721             //如果得到的node不为null且(matchValue为false||node.value和参数value匹配)
 722             if (node != null && (!matchValue || (v = node.value) == value ||
 723                     (value != null && value.equals(v)))) {
 724                 //如果桶内的结构为红黑树
 725                 if (node instanceof TreeNode)
 726                     //使用红黑树的删除方法删除node
 727                     ((TreeNode<K, V>) node).removeTreeNode(this, tab, movable);
 728                 else if (node == p)//如果桶的第一个node的就是要删除的node
 729                     //删除node
 730                     tab[index] = node.next;
 731                 else//如果桶内的结构为链表，使用链表删除元素的方式删除node
 732                     p.next = node.next;
 733                 ++modCount;//结构性修改次数+1
 734                 --size;//哈希表大小-1
 735                 afterNodeRemoval(node);
 736                 return node;//返回被删除的node
 737             }
 738         }
 739         return null;//如果数组table为空或key映射到的桶为空，返回null。
 740     }
 741 
 742     /**
 743      * 删除map中所有的键值对
 744      */
 745     public void clear() {
 746         Node<K, V>[] tab;
 747         modCount++;
 748         if ((tab = table) != null && size > 0) {
 749             size = 0;
 750             for (int i = 0; i < tab.length; ++i)
 751                 tab[i] = null;
 752         }
 753     }
 754 
 755     /**
 756      * 如果hashMap中的键值对有一对或多对的value为参数value，返回true
 757      *
 758      * @param value 参数value
 759      * @return 如果hashMap中的键值对有一对或多对的value为参数value，返回true
 760      */
 761     public boolean containsValue(Object value) {
 762         Node<K, V>[] tab;
 763         V v;
 764         if ((tab = table) != null && size > 0) {
 765             //遍历数组table
 766             for (int i = 0; i < tab.length; ++i) {
 767                 //遍历桶中的node,每太搞懂树形结构如何遍历
 768                 for (Node<K, V> e = tab[i]; e != null; e = e.next) {
 769                     if ((v = e.value) == value ||
 770                             (value != null && value.equals(v)))
 771                         return true;
 772                 }
 773             }
 774         }
 775         return false;
 776     }
 777 
 778     /**
 779      * 返回hashMap中所有key的视图。
 780      * 改变hashMap会影响到set，反之亦然。
 781      * 如果当迭代器迭代set时，hashMap被修改(除非是迭代器自己的remove()方法)，迭代器的结果是不确定的。
 782      * set支持元素的删除，通过Iterator.remove、Set.remove、removeAll、retainAll、clear操作删除hashMap中对应的键值对。
 783      * 不支持add和addAll方法。
 784      *
 785      * @return 返回hashMap中所有key的set视图
 786      */
 787     public Set<K> keySet() {
     		//定义了一个全局变量
 788         Set<K> ks = keySet;
 789         if (ks == null) {
 790             ks = new KeySet();
 791             keySet = ks;
 792         }
 793         return ks;
 794     }
 795 
 796     /**
 797      * 内部类KeySet
 798      */
 799     final class KeySet extends AbstractSet<K> {
 800         public final int size() {
 801             return size;
 802         }
 803 
 804         public final void clear() {
 805             HashMap.this.clear();
 806         }
 807 
 808         public final Iterator<K> iterator() {
 809             return new KeyIterator();
 810         }
 811 
 812         public final boolean contains(Object o) {
 813             return containsKey(o);
 814         }
 815 
 816         public final boolean remove(Object key) {
 817             return removeNode(hash(key), key, null, false, true) != null;
 818         }
 819 
 820         public final Spliterator<K> spliterator() {
 821             return new KeySpliterator<>(HashMap.this, 0, -1, 0, 0);
 822         }
 823 
 824         public final void forEach(Consumer<? super K> action) {
 825             Node<K, V>[] tab;
 826             if (action == null)
 827                 throw new NullPointerException();
 828             if (size > 0 && (tab = table) != null) {
 829                 int mc = modCount;
 830                 for (int i = 0; i < tab.length; ++i) {
 831                     for (Node<K, V> e = tab[i]; e != null; e = e.next)
 832                         action.accept(e.key);
 833                 }
 834                 if (modCount != mc)
 835                     throw new ConcurrentModificationException();
 836             }
 837         }
 838     }
 839 
 840     /**
 841      * 返回hashMap中所有value的collection视图
 842      * 改变hashMap会改变collection，反之亦然。
 843      * 如果当迭代器迭代collection时，hashMap被修改（除非是迭代器自己的remove()方法），迭代器的结果是不确定的。
 844      * collection支持元素的删除，通过Iterator.remove、Collection.remove、removeAll、retainAll、clear操作删除hashMap中对应的键值对。
 845      * 不支持add和addAll方法。
 846      *
 847      * @return 返回hashMap中所有key的collection视图
 848      */
 849     public Collection<V> values() {
 850         Collection<V> vs = values;
 851         if (vs == null) {
 852             vs = new Values();
 853             values = vs;
 854         }
 855         return vs;
 856     }
 857 
 858     /**
 859      * 内部类Values
 860      */
 861     final class Values extends AbstractCollection<V> {
 862         public final int size() {
 863             return size;
 864         }
 865 
 866         public final void clear() {
 867             HashMap.this.clear();
 868         }
 869 
 870         public final Iterator<V> iterator() {
 871             return new ValueIterator();
 872         }
 873 
 874         public final boolean contains(Object o) {
 875             return containsValue(o);
 876         }
 877 
 878         public final Spliterator<V> spliterator() {
 879             return new ValueSpliterator<>(HashMap.this, 0, -1, 0, 0);
 880         }
 881 
 882         public final void forEach(Consumer<? super V> action) {
 883             Node<K, V>[] tab;
 884             if (action == null)
 885                 throw new NullPointerException();
 886             if (size > 0 && (tab = table) != null) {
 887                 int mc = modCount;
 888                 for (int i = 0; i < tab.length; ++i) {
 889                     for (Node<K, V> e = tab[i]; e != null; e = e.next)
 890                         action.accept(e.value);
 891                 }
 892                 if (modCount != mc)
 893                     throw new ConcurrentModificationException();
 894             }
 895         }
 896     }
 897 
 898     /**
 899      * 返回hashMap中所有键值对的set视图
 900      * 改变hashMap会影响到set，反之亦然。
 901      * 如果当迭代器迭代set时，hashMap被修改(除非是迭代器自己的remove()方法)，迭代器的结果是不确定的。
 902      * set支持元素的删除，通过Iterator.remove、Set.remove、removeAll、retainAll、clear操作删除hashMap中对应的键值对。
 903      * 不支持add和addAll方法。
 904      *
 905      * @return 返回hashMap中所有键值对的set视图
 906      */
 907     public Set<Map.Entry<K, V>> entrySet() {
 908         Set<Map.Entry<K, V>> es;
 909         return (es = entrySet) == null ? (entrySet = new EntrySet()) : es;
 910     }
 911 
 912     /**
 913      * 内部类EntrySet
 914      */
 915     final class EntrySet extends AbstractSet<Map.Entry<K, V>> {
 916         public final int size() {
 917             return size;
 918         }
 919 
 920         public final void clear() {
 921             HashMap.this.clear();
 922         }
 923 
 924         public final Iterator<Map.Entry<K, V>> iterator() {
 925             return new EntryIterator();
 926         }
 927 
 928         public final boolean contains(Object o) {
 929             if (!(o instanceof Map.Entry))
 930                 return false;
 931             Map.Entry<?, ?> e = (Map.Entry<?, ?>) o;
 932             Object key = e.getKey();
 933             Node<K, V> candidate = getNode(hash(key), key);
 934             return candidate != null && candidate.equals(e);
 935         }
 936 
 937         public final boolean remove(Object o) {
 938             if (o instanceof Map.Entry) {
 939                 Map.Entry<?, ?> e = (Map.Entry<?, ?>) o;
 940                 Object key = e.getKey();
 941                 Object value = e.getValue();
 942                 return removeNode(hash(key), key, value, true, true) != null;
 943             }
 944             return false;
 945         }
 946 
 947         public final Spliterator<Map.Entry<K, V>> spliterator() {
 948             return new EntrySpliterator<>(HashMap.this, 0, -1, 0, 0);
 949         }
 950 
 951         public final void forEach(Consumer<? super Map.Entry<K, V>> action) {
 952             Node<K, V>[] tab;
 953             if (action == null)
 954                 throw new NullPointerException();
 955             if (size > 0 && (tab = table) != null) {
 956                 int mc = modCount;
 957                 for (int i = 0; i < tab.length; ++i) {
 958                     for (Node<K, V> e = tab[i]; e != null; e = e.next)
 959                         action.accept(e);
 960                 }
 961                 if (modCount != mc)
 962                     throw new ConcurrentModificationException();
 963             }
 964         }
 965     }
 966 
 967     // JDK8重写的方法
 968 
 969     /**
 970      * 通过key映射到对应node，如果没映射到则返回默认值defaultValue
 971      *
 972      * @param key
 973      * @param defaultValue
 974      * @return key映射到对应的node，如果没映射到则返回默认值defaultValue
 975      */
 976     @Override
 977     public V getOrDefault(Object key, V defaultValue) {
 978         Node<K, V> e;
 979         return (e = getNode(hash(key), key)) == null ? defaultValue : e.value;
 980     }
 981 
 982     /**
 983      * 在hashMap中插入参数key和value组成的键值对，如果key在hashMap中已经存在，不替换value
 984      *
 985      * @param key
 986      * @param value
 987      * @return 如果key在hashMap中不存在，返回旧value
 988      */
 989     @Override
 990     public V putIfAbsent(K key, V value) {
 991         return putVal(hash(key), key, value, true, true);
 992     }
 993 
 994     /**
 995      * 删除hashMap中key为参数key，value为参数value的键值对。如果桶中结构为树，则级联删除
 996      * 链表则不会级联删除
 997      * @param key
 998      * @param value
 999      * @return 删除成功，返回true
1000      */
1001     @Override
1002     public boolean remove(Object key, Object value) {
1003         return removeNode(hash(key), key, value, true, true) != null;
1004     }
1005 
1006     /**
1007      * 使用newValue替换key和oldValue映射到的键值对中的value
1008      *
1009      * @param key
1010      * @param oldValue
1011      * @param newValue
1012      * @return 替换成功，返回true
1013      */
1014     @Override
1015     public boolean replace(K key, V oldValue, V newValue) {
1016         Node<K, V> e;
1017         V v;
1018         if ((e = getNode(hash(key), key)) != null &&
1019                 ((v = e.value) == oldValue || (v != null && v.equals(oldValue)))) {
1020             e.value = newValue;
1021             afterNodeAccess(e);
1022             return true;
1023         }
1024         return false;
1025     }
1026 
1027     /**
1028      * 使用参数value替换key映射到的键值对中的value
1029      *
1030      * @param key
1031      * @param value
1032      * @return 替换成功，返回true
1033      */
1034     @Override
1035     public V replace(K key, V value) {
1036         Node<K, V> e;
1037         if ((e = getNode(hash(key), key)) != null) {
1038             V oldValue = e.value;
1039             e.value = value;
1040             afterNodeAccess(e);
1041             return oldValue;
1042         }
1043         return null;
1044     }
1045 	//往map中添加节点，如果添加的key值已经存在，那么看old.value值是否为空，如果不为空返回old.value的值，如果为空则判断传入的value是否为空如果为空返回null，并不创建新的节点，如果value不为空并且old不为空将old.value = value,如果old为空那么就创建新的节点值为value
    ![屏幕截图 2021-05-07 171938](C:\Users\50213\Pictures\屏幕截图 2021-05-07 171938.png)
    
1046     @Override
1047     public V computeIfAbsent(K key,
1048                              Function<? super K, ? extends V> mappingFunction) {
1049         if (mappingFunction == null)
1050             throw new NullPointerException();
1051         int hash = hash(key);
1052         Node<K, V>[] tab;
1053         Node<K, V> first;
1054         int n, i;
1055         int binCount = 0;
1056         TreeNode<K, V> t = null;
1057         Node<K, V> old = null;
1058         if (size > threshold || (tab = table) == null ||
1059                 (n = tab.length) == 0)
1060             n = (tab = resize()).length;
1061         if ((first = tab[i = (n - 1) & hash]) != null) {
1062             if (first instanceof TreeNode)
1063                 old = (t = (TreeNode<K, V>) first).getTreeNode(hash, key);
1064             else {
1065                 Node<K, V> e = first;
1066                 K k;
1067                 do {
1068                     if (e.hash == hash &&
1069                             ((k = e.key) == key || (key != null && key.equals(k)))) {
1070                         old = e;
1071                         break;
1072                     }
1073                     ++binCount;
1074                 } while ((e = e.next) != null);
1075             }
1076             V oldValue;
    			//已经判断了old.value是否为空了
1077             if (old != null && (oldValue = old.value) != null) {
1078                 afterNodeAccess(old);
1079                 return oldValue;
1080             }
1081         }
1082         V v = mappingFunction.apply(key);
1083         if (v == null) {
1084             return null;
1085         } else if (old != null) {
    				//old.value一定为空
1086             old.value = v;
1087             afterNodeAccess(old);
1088             return v;
1089         } else if (t != null)
1090             t.putTreeVal(this, tab, hash, key, v);
1091         else {
1092             tab[i] = newNode(hash, key, v, first);
1093             if (binCount >= TREEIFY_THRESHOLD - 1)
1094                 treeifyBin(tab, hash);
1095         }
1096         ++modCount;
1097         ++size;
1098         afterNodeInsertion(true);
1099         return v;
1100     }
1101 	 //只有当node不为空并且old.value不为空时，才会将value赋值给old.value，并返回null，其他的返回null。当old.value==null时会将node删除，如果是数链表，其后面的也会删除。这个并不会创建节点
    //remappingFunction作用是根据node的key值以及value可以对其操作返回新的value值。
1102     public V computeIfPresent(K key,
1103                               BiFunction<? super K, ? super V, ? extends V> remappingFunction) {
1104         if (remappingFunction == null)
1105             throw new NullPointerException();
1106         Node<K, V> e;
1107         V oldValue;
1108         int hash = hash(key);
1109         if ((e = getNode(hash, key)) != null &&
1110                 (oldValue = e.value) != null) {
1111             V v = remappingFunction.apply(key, oldValue);
1112             if (v != null) {
1113                 e.value = v;
1114                 afterNodeAccess(e);
1115                 return v;
1116             } else
1117                 removeNode(hash, key, null, false, true);
1118         }
1119         return null;
1120     }
1121 //这个与上面那个不同的是，如果node不为空，V不为空那么就将node的值更新为V，V如果为空那么就将node删除，node为空且V的值不为空那么就创建新的节点。返回值为V
1122     @Override
1123     public V compute(K key,
1124                      BiFunction<? super K, ? super V, ? extends V> remappingFunction) {
1125         if (remappingFunction == null)
1126             throw new NullPointerException();
1127         int hash = hash(key);
1128         Node<K, V>[] tab;
1129         Node<K, V> first;
1130         int n, i;
1131         int binCount = 0;
1132         TreeNode<K, V> t = null;
1133         Node<K, V> old = null;
1134         if (size > threshold || (tab = table) == null ||
1135                 (n = tab.length) == 0)
1136             n = (tab = resize()).length;
1137         if ((first = tab[i = (n - 1) & hash]) != null) {
1138             if (first instanceof TreeNode)
1139                 old = (t = (TreeNode<K, V>) first).getTreeNode(hash, key);
1140             else {
1141                 Node<K, V> e = first;
1142                 K k;
1143                 do {
1144                     if (e.hash == hash &&
1145                             ((k = e.key) == key || (key != null && key.equals(k)))) {
1146                         old = e;
1147                         break;
1148                     }
1149                     ++binCount;
1150                 } while ((e = e.next) != null);
1151             }
1152         }
1153         V oldValue = (old == null) ? null : old.value;
1154         V v = remappingFunction.apply(key, oldValue);
1155         if (old != null) {
1156             if (v != null) {
1157                 old.value = v;
1158                 afterNodeAccess(old);
1159             } else
    				//给old要设置的value值如果是null那么就将old删除
1160                 removeNode(hash, key, null, false, true);
1161         } else if (v != null) {
1162             if (t != null)
1163                 t.putTreeVal(this, tab, hash, key, v);
1164             else {
1165                 tab[i] = newNode(hash, key, v, first);
1166                 if (binCount >= TREEIFY_THRESHOLD - 1)
1167                     treeifyBin(tab, hash);
1168             }
1169             ++modCount;
1170             ++size;
1171             afterNodeInsertion(true);
1172         }
1173         return v;
1174     }
1175 	//这个是操作old.value和new.value获取到新的V如果V等于null那么就删除node，否则就将V赋值给node，如果node等于null，V不为null，创建新的节点。返回值为传入的value
1176     @Override
1177     public V merge(K key, V value,
1178                    BiFunction<? super V, ? super V, ? extends V> remappingFunction) {
1179         if (value == null)
1180             throw new NullPointerException();
1181         if (remappingFunction == null)
1182             throw new NullPointerException();
1183         int hash = hash(key);
1184         Node<K, V>[] tab;
1185         Node<K, V> first;
1186         int n, i;
1187         int binCount = 0;
1188         TreeNode<K, V> t = null;
1189         Node<K, V> old = null;
1190         if (size > threshold || (tab = table) == null ||
1191                 (n = tab.length) == 0)
1192             n = (tab = resize()).length;
1193         if ((first = tab[i = (n - 1) & hash]) != null) {
1194             if (first instanceof TreeNode)
1195                 old = (t = (TreeNode<K, V>) first).getTreeNode(hash, key);
1196             else {
1197                 Node<K, V> e = first;
1198                 K k;
1199                 do {
1200                     if (e.hash == hash &&
1201                             ((k = e.key) == key || (key != null && key.equals(k)))) {
1202                         old = e;
1203                         break;
1204                     }
1205                     ++binCount;
1206                 } while ((e = e.next) != null);
1207             }
1208         }
1209         if (old != null) {
1210             V v;
1211             if (old.value != null)
1212                 v = remappingFunction.apply(old.value, value);
1213             else
1214                 v = value;
1215             if (v != null) {
1216                 old.value = v;
1217                 afterNodeAccess(old);
1218             } else
1219                 removeNode(hash, key, null, false, true);
1220             return v;
1221         }
1222         if (value != null) {
1223             if (t != null)
1224                 t.putTreeVal(this, tab, hash, key, value);
1225             else {
1226                 tab[i] = newNode(hash, key, value, first);
1227                 if (binCount >= TREEIFY_THRESHOLD - 1)
1228                     treeifyBin(tab, hash);
1229             }
1230             ++modCount;
1231             ++size;
1232             afterNodeInsertion(true);
1233         }
1234         return value;
1235     }
1236 
1237     @Override
1238     public void forEach(BiConsumer<? super K, ? super V> action) {
1239         Node<K, V>[] tab;
1240         if (action == null)
1241             throw new NullPointerException();
1242         if (size > 0 && (tab = table) != null) {
1243             int mc = modCount;
1244             for (int i = 0; i < tab.length; ++i) {
1245                 for (Node<K, V> e = tab[i]; e != null; e = e.next)
1246                     action.accept(e.key, e.value);
1247             }
1248             if (modCount != mc)
1249                 throw new ConcurrentModificationException();
1250         }
1251     }
1252 
1253     @Override
1254     public void replaceAll(BiFunction<? super K, ? super V, ? extends V> function) {
1255         Node<K, V>[] tab;
1256         if (function == null)
1257             throw new NullPointerException();
1258         if (size > 0 && (tab = table) != null) {
1259             int mc = modCount;
1260             for (int i = 0; i < tab.length; ++i) {
1261                 for (Node<K, V> e = tab[i]; e != null; e = e.next) {
1262                     e.value = function.apply(e.key, e.value);
1263                 }
1264             }
1265             if (modCount != mc)
1266                 throw new ConcurrentModificationException();
1267         }
1268     }
1269 
1270     /* ------------------------------------------------------------ */
1271     // 克隆和序列化
1272 
1273     /**
1274      * 浅拷贝。
1275      * clone方法虽然生成了新的HashMap对象，新的HashMap中的table数组虽然也是新生成的，但是数组中的元素还是引用以前的HashMap中的元素。
1276      * 这就导致在对HashMap中的元素进行修改的时候，即对数组中元素进行修改，会导致原对象和clone对象都发生改变，但进行新增或删除就不会影响对方，因为这相当于是对数组做出的改变，clone对象新生成了一个数组。
1277      *
1278      * @return hashMap的浅拷贝
1279      */
1280     @SuppressWarnings("unchecked")
1281     @Override
1282     public Object clone() {
1283         HashMap<K, V> result;
1284         try {
1285             result = (HashMap<K, V>) super.clone();
1286         } catch (CloneNotSupportedException e) {
1287             // this shouldn't happen, since we are Cloneable
1288             throw new InternalError(e);
1289         }
1290         result.reinitialize();
1291         result.putMapEntries(this, false);
1292         return result;
1293     }
1294 
1295     // These methods are also used when serializing HashSets
1296     final float loadFactor() {
1297         return loadFactor;
1298     }
1299 
1300     final int capacity() {
1301         return (table != null) ? table.length :
1302                 (threshold > 0) ? threshold :
1303                         DEFAULT_INITIAL_CAPACITY;
1304     }
1305 
1306     /**
1307      * 序列化hashMap到ObjectOutputStream中
1308      * 将hashMap的总容量capacity、实际容量size、键值对映射写入到ObjectOutputStream中。键值对映射序列化时是无序的。
1309      *
1310      * @serialData The <i>capacity</i> of the HashMap (the length of the
1311      * bucket array) is emitted (int), followed by the
1312      * <i>size</i> (an int, the number of key-value
1313      * mappings), followed by the key (Object) and value (Object)
1314      * for each key-value mapping.  The key-value mappings are
1315      * emitted in no particular order.
1316      */
1317     private void writeObject(java.io.ObjectOutputStream s)
1318             throws IOException {
1319         int buckets = capacity();
1320         // Write out the threshold, loadfactor, and any hidden stuff
1321         s.defaultWriteObject();
1322         //写入总容量
1323         s.writeInt(buckets);
1324         //写入实际容量
1325         s.writeInt(size);
1326         //写入键值对
1327         internalWriteEntries(s);
1328     }
1329 
1330     /**
1331      * 到ObjectOutputStream中读取hashMap
1332      * 将hashMap的总容量capacity、实际容量size、键值对映射读取出来
1333      */
1334     private void readObject(java.io.ObjectInputStream s)
1335             throws IOException, ClassNotFoundException {
1336         // 将hashMap的总容量capacity、实际容量size、键值对映射读取出来
1337         s.defaultReadObject();
1338         //重置hashMap
1339         reinitialize();
1340         //如果加载因子不合法，抛出异常
1341         if (loadFactor <= 0 || Float.isNaN(loadFactor))
1342             throw new InvalidObjectException("Illegal load factor: " +
1343                     loadFactor);
1344         s.readInt();                //读出桶的数量，忽略
1345         int mappings = s.readInt(); //读出实际容量size
1346         //如果读出的实际容量size小于0，抛出异常
1347         if (mappings < 0)
1348             throw new InvalidObjectException("Illegal mappings count: " +
1349                     mappings);
1350         else if (mappings > 0) { // (if zero, use defaults)
1351             // Size the table using given load factor only if within
1352             // range of 0.25...4.0
1353             //调整hashMap大小
1354             float lf = Math.min(Math.max(0.25f, loadFactor), 4.0f);            // 加载因子
1355             float fc = (float) mappings / lf + 1.0f;         //初步得到的总容量，后续还会处理
1356             //处理初步得到的容量，确认最终的总容量
1357             int cap = ((fc < DEFAULT_INITIAL_CAPACITY) ?
1358                     DEFAULT_INITIAL_CAPACITY :
1359                     (fc >= MAXIMUM_CAPACITY) ?
1360                             MAXIMUM_CAPACITY :
1361                             tableSizeFor((int) fc));
1362             //计算临界值，得到初步的临界值
1363             float ft = (float) cap * lf;
1364             //得到最终的临界值
1365             threshold = ((cap < MAXIMUM_CAPACITY && ft < MAXIMUM_CAPACITY) ?
1366                     (int) ft : Integer.MAX_VALUE);
1367 
1368             // Check Map.Entry[].class since it's the nearest public type to
1369             // what we're actually creating.
1370             SharedSecrets.getJavaOISAccess().checkArray(s, Map.Entry[].class, cap);
1371             //新建桶数组table
1372             @SuppressWarnings({"rawtypes", "unchecked"})
1373             Node<K, V>[] tab = (Node<K, V>[]) new Node[cap];
1374             table = tab;
1375 
1376             // 读出key和value，并组成键值对插入hashMap中
1377             for (int i = 0; i < mappings; i++) {
1378                 @SuppressWarnings("unchecked")
1379                 K key = (K) s.readObject();
1380                 @SuppressWarnings("unchecked")
1381                 V value = (V) s.readObject();
1382                 putVal(hash(key), key, value, false, false);
1383             }
1384         }
1385     }
1386 
1387     /* ------------------------------------------------------------ */
1388     // iterators
1389 
1390     abstract class HashIterator {
1391         Node<K, V> next;        // next entry to return
1392         Node<K, V> current;     // current entry
1393         int expectedModCount;  // for fast-fail
1394         int index;             // current slot
1395 
1396         HashIterator() {
1397             expectedModCount = modCount;
1398             Node<K, V>[] t = table;
1399             current = next = null;
1400             index = 0;
1401             if (t != null && size > 0) { // advance to first entry
1402                 do {
1403                 } while (index < t.length && (next = t[index++]) == null);
1404             }
1405         }
1406 
1407         public final boolean hasNext() {
1408             return next != null;
1409         }
1410 
1411         final Node<K, V> nextNode() {
1412             Node<K, V>[] t;
1413             Node<K, V> e = next;
1414             if (modCount != expectedModCount)
1415                 throw new ConcurrentModificationException();
1416             if (e == null)
1417                 throw new NoSuchElementException();
1418             if ((next = (current = e).next) == null && (t = table) != null) {
1419                 do {
1420                 } while (index < t.length && (next = t[index++]) == null);
1421             }
1422             return e;
1423         }
1424 
1425         public final void remove() {
1426             Node<K, V> p = current;
1427             if (p == null)
1428                 throw new IllegalStateException();
1429             if (modCount != expectedModCount)
1430                 throw new ConcurrentModificationException();
1431             current = null;
1432             K key = p.key;
1433             removeNode(hash(key), key, null, false, false);
1434             expectedModCount = modCount;
1435         }
1436     }
1437 
1438     final class KeyIterator extends HashIterator
1439             implements Iterator<K> {
1440         public final K next() {
1441             return nextNode().key;
1442         }
1443     }
1444 
1445     final class ValueIterator extends HashIterator
1446             implements Iterator<V> {
1447         public final V next() {
1448             return nextNode().value;
1449         }
1450     }
1451 
1452     final class EntryIterator extends HashIterator
1453             implements Iterator<Map.Entry<K, V>> {
1454         public final Map.Entry<K, V> next() {
1455             return nextNode();
1456         }
1457     }
1458 
1459     /* ------------------------------------------------------------ */
1460     // spliterators
1461 
1462     static class HashMapSpliterator<K, V> {
1463         final HashMap<K, V> map;
1464         Node<K, V> current;          //记录当前的节点
1465         int index;                  //当前节点的下标
1466         int fence;                  //堆大小
1467         int est;                    //估计大小
1468         int expectedModCount;       // for comodification checks
1469 
1470         HashMapSpliterator(HashMap<K, V> m, int origin,
1471                            int fence, int est,
1472                            int expectedModCount) {
1473             this.map = m;
1474             this.index = origin;
1475             this.fence = fence;
1476             this.est = est;
1477             this.expectedModCount = expectedModCount;
1478         }
1479 
1480         final int getFence() { // initialize fence and size on first use
1481             int hi;
1482             if ((hi = fence) < 0) {
1483                 HashMap<K, V> m = map;
1484                 est = m.size;
1485                 expectedModCount = m.modCount;
1486                 Node<K, V>[] tab = m.table;
1487                 hi = fence = (tab == null) ? 0 : tab.length;
1488             }
1489             return hi;
1490         }
1491 
1492         public final long estimateSize() {
1493             getFence(); // force init
1494             return (long) est;
1495         }
1496     }
1497 
1498     static final class KeySpliterator<K, V>
1499             extends HashMapSpliterator<K, V>
1500             implements Spliterator<K> {
1501         KeySpliterator(HashMap<K, V> m, int origin, int fence, int est,
1502                        int expectedModCount) {
1503             super(m, origin, fence, est, expectedModCount);
1504         }
1505 
1506         public KeySpliterator<K, V> trySplit() {
1507             int hi = getFence(), lo = index, mid = (lo + hi) >>> 1;
1508             return (lo >= mid || current != null) ? null :
1509                     new KeySpliterator<>(map, lo, index = mid, est >>>= 1,
1510                             expectedModCount);
1511         }
1512 
1513         public void forEachRemaining(Consumer<? super K> action) {
1514             int i, hi, mc;
1515             if (action == null)
1516                 throw new NullPointerException();
1517             HashMap<K, V> m = map;
1518             Node<K, V>[] tab = m.table;
1519             if ((hi = fence) < 0) {
1520                 mc = expectedModCount = m.modCount;
1521                 hi = fence = (tab == null) ? 0 : tab.length;
1522             } else
1523                 mc = expectedModCount;
1524             if (tab != null && tab.length >= hi &&
1525                     (i = index) >= 0 && (i < (index = hi) || current != null)) {
1526                 Node<K, V> p = current;
1527                 current = null;
1528                 do {
1529                     if (p == null)
1530                         p = tab[i++];
1531                     else {
1532                         action.accept(p.key);
1533                         p = p.next;
1534                     }
1535                 } while (p != null || i < hi);
1536                 if (m.modCount != mc)
1537                     throw new ConcurrentModificationException();
1538             }
1539         }
1540 
1541         public boolean tryAdvance(Consumer<? super K> action) {
1542             int hi;
1543             if (action == null)
1544                 throw new NullPointerException();
1545             Node<K, V>[] tab = map.table;
1546             if (tab != null && tab.length >= (hi = getFence()) && index >= 0) {
1547                 while (current != null || index < hi) {
1548                     if (current == null)
1549                         current = tab[index++];
1550                     else {
1551                         K k = current.key;
1552                         current = current.next;
1553                         action.accept(k);
1554                         if (map.modCount != expectedModCount)
1555                             throw new ConcurrentModificationException();
1556                         return true;
1557                     }
1558                 }
1559             }
1560             return false;
1561         }
1562 
1563         public int characteristics() {
1564             return (fence < 0 || est == map.size ? Spliterator.SIZED : 0) |
1565                     Spliterator.DISTINCT;
1566         }
1567     }
1568 
1569     static final class ValueSpliterator<K, V>
1570             extends HashMapSpliterator<K, V>
1571             implements Spliterator<V> {
1572         ValueSpliterator(HashMap<K, V> m, int origin, int fence, int est,
1573                          int expectedModCount) {
1574             super(m, origin, fence, est, expectedModCount);
1575         }
1576 
1577         public ValueSpliterator<K, V> trySplit() {
1578             int hi = getFence(), lo = index, mid = (lo + hi) >>> 1;
1579             return (lo >= mid || current != null) ? null :
1580                     new ValueSpliterator<>(map, lo, index = mid, est >>>= 1,
1581                             expectedModCount);
1582         }
1583 
1584         public void forEachRemaining(Consumer<? super V> action) {
1585             int i, hi, mc;
1586             if (action == null)
1587                 throw new NullPointerException();
1588             HashMap<K, V> m = map;
1589             Node<K, V>[] tab = m.table;
1590             if ((hi = fence) < 0) {
1591                 mc = expectedModCount = m.modCount;
1592                 hi = fence = (tab == null) ? 0 : tab.length;
1593             } else
1594                 mc = expectedModCount;
1595             if (tab != null && tab.length >= hi &&
1596                     (i = index) >= 0 && (i < (index = hi) || current != null)) {
1597                 Node<K, V> p = current;
1598                 current = null;
1599                 do {
1600                     if (p == null)
1601                         p = tab[i++];
1602                     else {
1603                         action.accept(p.value);
1604                         p = p.next;
1605                     }
1606                 } while (p != null || i < hi);
1607                 if (m.modCount != mc)
1608                     throw new ConcurrentModificationException();
1609             }
1610         }
1611 
1612         public boolean tryAdvance(Consumer<? super V> action) {
1613             int hi;
1614             if (action == null)
1615                 throw new NullPointerException();
1616             Node<K, V>[] tab = map.table;
1617             if (tab != null && tab.length >= (hi = getFence()) && index >= 0) {
1618                 while (current != null || index < hi) {
1619                     if (current == null)
1620                         current = tab[index++];
1621                     else {
1622                         V v = current.value;
1623                         current = current.next;
1624                         action.accept(v);
1625                         if (map.modCount != expectedModCount)
1626                             throw new ConcurrentModificationException();
1627                         return true;
1628                     }
1629                 }
1630             }
1631             return false;
1632         }
1633 
1634         public int characteristics() {
1635             return (fence < 0 || est == map.size ? Spliterator.SIZED : 0);
1636         }
1637     }
1638 
1639     static final class EntrySpliterator<K, V>
1640             extends HashMapSpliterator<K, V>
1641             implements Spliterator<Map.Entry<K, V>> {
1642         EntrySpliterator(HashMap<K, V> m, int origin, int fence, int est,
1643                          int expectedModCount) {
1644             super(m, origin, fence, est, expectedModCount);
1645         }
1646 
1647         public EntrySpliterator<K, V> trySplit() {
1648             int hi = getFence(), lo = index, mid = (lo + hi) >>> 1;
1649             return (lo >= mid || current != null) ? null :
1650                     new EntrySpliterator<>(map, lo, index = mid, est >>>= 1,
1651                             expectedModCount);
1652         }
1653 
1654         public void forEachRemaining(Consumer<? super Map.Entry<K, V>> action) {
1655             int i, hi, mc;
1656             if (action == null)
1657                 throw new NullPointerException();
1658             HashMap<K, V> m = map;
1659             Node<K, V>[] tab = m.table;
1660             if ((hi = fence) < 0) {
1661                 mc = expectedModCount = m.modCount;
1662                 hi = fence = (tab == null) ? 0 : tab.length;
1663             } else
1664                 mc = expectedModCount;
1665             if (tab != null && tab.length >= hi &&
1666                     (i = index) >= 0 && (i < (index = hi) || current != null)) {
1667                 Node<K, V> p = current;
1668                 current = null;
1669                 do {
1670                     if (p == null)
1671                         p = tab[i++];
1672                     else {
1673                         action.accept(p);
1674                         p = p.next;
1675                     }
1676                 } while (p != null || i < hi);
1677                 if (m.modCount != mc)
1678                     throw new ConcurrentModificationException();
1679             }
1680         }
1681 
1682         public boolean tryAdvance(Consumer<? super Map.Entry<K, V>> action) {
1683             int hi;
1684             if (action == null)
1685                 throw new NullPointerException();
1686             Node<K, V>[] tab = map.table;
1687             if (tab != null && tab.length >= (hi = getFence()) && index >= 0) {
1688                 while (current != null || index < hi) {
1689                     if (current == null)
1690                         current = tab[index++];
1691                     else {
1692                         Node<K, V> e = current;
1693                         current = current.next;
1694                         action.accept(e);
1695                         if (map.modCount != expectedModCount)
1696                             throw new ConcurrentModificationException();
1697                         return true;
1698                     }
1699                 }
1700             }
1701             return false;
1702         }
1703 
1704         public int characteristics() {
1705             return (fence < 0 || est == map.size ? Spliterator.SIZED : 0) |
1706                     Spliterator.DISTINCT;
1707         }
1708     }
1709 
1710     /* ------------------------------------------------------------ */
1711     // LinkedHashMap support
1712 
1713 
1714     /*
1715      * The following package-protected methods are designed to be
1716      * overridden by LinkedHashMap, but not by any other subclass.
1717      * Nearly all other internal methods are also package-protected
1718      * but are declared final, so can be used by LinkedHashMap, view
1719      * classes, and HashSet.
1720      */
1721 
1722     // 创建一个链表结点
1723     Node<K, V> newNode(int hash, K key, V value, Node<K, V> next) {
1724         return new Node<>(hash, key, value, next);
1725     }
1726 
1727     // 替换一个链表节点
1728     Node<K, V> replacementNode(Node<K, V> p, Node<K, V> next) {
1729         return new Node<>(p.hash, p.key, p.value, next);
1730     }
1731 
1732     // 创建一个红黑树节点
1733     TreeNode<K, V> newTreeNode(int hash, K key, V value, Node<K, V> next) {
1734         return new TreeNode<>(hash, key, value, next);
1735     }
1736 
1737     // 替换一个红黑树节点
1738     TreeNode<K, V> replacementTreeNode(Node<K, V> p, Node<K, V> next) {
1739         return new TreeNode<>(p.hash, p.key, p.value, next);
1740     }
1741 
1742     /**
1743      * Reset to initial default state.  Called by clone and readObject.
1744      */
1745     void reinitialize() {
1746         table = null;
1747         entrySet = null;
1748         keySet = null;
1749         values = null;
1750         modCount = 0;
1751         threshold = 0;
1752         size = 0;
1753     }
1754 
1755     // Callbacks to allow LinkedHashMap post-actions
1756     void afterNodeAccess(Node<K, V> p) {
1757     }
1758 
1759     void afterNodeInsertion(boolean evict) {
1760     }
1761 
1762     void afterNodeRemoval(Node<K, V> p) {
1763     }
1764 
1765     // 写入hashMap键值对到ObjectOutputStream中
1766     void internalWriteEntries(java.io.ObjectOutputStream s) throws IOException {
1767         Node<K, V>[] tab;
1768         if (size > 0 && (tab = table) != null) {
1769             for (int i = 0; i < tab.length; ++i) {
1770                 for (Node<K, V> e = tab[i]; e != null; e = e.next) {
1771                     s.writeObject(e.key);
1772                     s.writeObject(e.value);
1773                 }
1774             }
1775         }
1776     }
1777 
1778     /* ------------------------------------------------------------ */
1779     // Tree bins
1780 
1781     /**
1782      * JDK1.8新增，用来支持桶的红黑树结构实现
1783      * 性质1. 节点是红色或黑色。
1784      * 性质2. 根是黑色。
1785      * 性质3. 所有叶子都是黑色（叶子是NIL节点）。
1786      * 性质4. 每个红色节点必须有两个黑色的子节点。(从每个叶子到根的所有路径上不能有两个连续的红色节点。)
1787      * 性质5. 从任一节点到其每个叶子的所有简单路径都包含相同数目的黑色节点。
1788      */
1789 
1790     static final class TreeNode<K, V> extends LinkedHashMap.Entry<K, V> {
1791         TreeNode<K, V> parent;  //节点的父亲
1792         TreeNode<K, V> left;    //节点的左孩子
1793         TreeNode<K, V> right;   //节点的右孩子
1794         TreeNode<K, V> prev;    //节点的前一个节点
1795         boolean red;            //true表示红节点，false表示黑节点
1796 
1797         TreeNode(int hash, K key, V val, Node<K, V> next) {
1798             super(hash, key, val, next);
1799         }
1800 
1801         /**
1802          * 获取红黑树的根
1803          */
1804         final TreeNode<K, V> root() {
1805             for (TreeNode<K, V> r = this, p; ; ) {
1806                 if ((p = r.parent) == null)
1807                     return r;
1808                 r = p;
1809             }
1810         }
1811 
1812         /**
1813          * 确保root是桶中的第一个元素 ，将root移到中中的第一个
1814          */
1815         static <K, V> void moveRootToFront(Node<K, V>[] tab, TreeNode<K, V> root) {
1816             int n;
1817             if (root != null && tab != null && (n = tab.length) > 0) {
1818                 int index = (n - 1) & root.hash;
1819                 TreeNode<K, V> first = (TreeNode<K, V>) tab[index];
1820                 if (root != first) {
1821                     Node<K, V> rn;
1822                     tab[index] = root;
1823                     TreeNode<K, V> rp = root.prev;
1824                     if ((rn = root.next) != null)
1825                         ((TreeNode<K, V>) rn).prev = rp;
1826                     if (rp != null)
1827                         rp.next = rn;
1828                     if (first != null)
1829                         first.prev = root;
1830                     root.next = first;
1831                     root.prev = null;
1832                 }
1833                 assert checkInvariants(root);
1834             }
1835         }
1836 
1837         /**
1838          * 查找hash为h，key为k的节点
1839          */
1840         final TreeNode<K, V> find(int h, Object k, Class<?> kc) {
1841             TreeNode<K, V> p = this;
1842             do {
1843                 int ph, dir;
1844                 K pk;
1845                 TreeNode<K, V> pl = p.left, pr = p.right, q;
1846                 if ((ph = p.hash) > h)
1847                     p = pl;
1848                 else if (ph < h)
1849                     p = pr;
1850                 else if ((pk = p.key) == k || (k != null && k.equals(pk)))
1851                     return p;
1852                 else if (pl == null)
1853                     p = pr;
1854                 else if (pr == null)
1855                     p = pl;
1856                 else if ((kc != null ||
1857                         (kc = comparableClassFor(k)) != null) &&
1858                         (dir = compareComparables(kc, k, pk)) != 0)
1859                     p = (dir < 0) ? pl : pr;
1860                 else if ((q = pr.find(h, k, kc)) != null)
1861                     return q;
1862                 else
1863                     p = pl;
1864             } while (p != null);
1865             return null;
1866         }
1867 
1868         /**
1869          * 获取树节点，通过根节点查找
1870          */
1871         final TreeNode<K, V> getTreeNode(int h, Object k) {
1872             return ((parent != null) ? root() : this).find(h, k, null);
1873         }
1874 
1875         /**
1876          * 比较2个对象的大小
1877          */
1878         static int tieBreakOrder(Object a, Object b) {
1879             int d;
1880             if (a == null || b == null ||
1881                     (d = a.getClass().getName().
1882                             compareTo(b.getClass().getName())) == 0)
1883                 d = (System.identityHashCode(a) <= System.identityHashCode(b) ?
1884                         -1 : 1);
1885             return d;
1886         }
1887 
1888         /**
1889          * 将链表转为二叉树
1890          *
1891          * @return root of tree
1892          */
1893         final void treeify(Node<K, V>[] tab) {
1894             TreeNode<K, V> root = null;
1895             for (TreeNode<K, V> x = this, next; x != null; x = next) {
1896                 next = (TreeNode<K, V>) x.next;
1897                 x.left = x.right = null;
1898                 if (root == null) {
1899                     x.parent = null;
1900                     x.red = false;
1901                     root = x;
1902                 } else {
1903                     K k = x.key;
1904                     int h = x.hash;
1905                     Class<?> kc = null;
1906                     for (TreeNode<K, V> p = root; ; ) {
1907                         int dir, ph;
1908                         K pk = p.key;
1909                         if ((ph = p.hash) > h)
1910                             dir = -1;
1911                         else if (ph < h)
1912                             dir = 1;
1913                         else if ((kc == null &&
1914                                 (kc = comparableClassFor(k)) == null) ||
1915                                 (dir = compareComparables(kc, k, pk)) == 0)
1916                             dir = tieBreakOrder(k, pk);
1917 
1918                         TreeNode<K, V> xp = p;
1919                         if ((p = (dir <= 0) ? p.left : p.right) == null) {
1920                             x.parent = xp;
1921                             if (dir <= 0)
1922                                 xp.left = x;
1923                             else
1924                                 xp.right = x;
1925                             root = balanceInsertion(root, x);
1926                             break;
1927                         }
1928                     }
1929                 }
1930             }
1931             moveRootToFront(tab, root);
1932         }
1933 
1934         /**
1935          * 将二叉树转为链表
1936          */
1937         final Node<K, V> untreeify(HashMap<K, V> map) {
1938             Node<K, V> hd = null, tl = null;
1939             for (Node<K, V> q = this; q != null; q = q.next) {
1940                 Node<K, V> p = map.replacementNode(q, null);
1941                 if (tl == null)
1942                     hd = p;
1943                 else
1944                     tl.next = p;
1945                 tl = p;
1946             }
1947             return hd;
1948         }
1949 
1950         /**
1951          * 添加一个键值对
1952          */
1953         final TreeNode<K, V> putTreeVal(HashMap<K, V> map, Node<K, V>[] tab,
1954                                         int h, K k, V v) {
1955             Class<?> kc = null;
1956             boolean searched = false;
1957             TreeNode<K, V> root = (parent != null) ? root() : this;
1958             for (TreeNode<K, V> p = root; ; ) {
1959                 int dir, ph;
1960                 K pk;
1961                 if ((ph = p.hash) > h)
1962                     dir = -1;
1963                 else if (ph < h)
1964                     dir = 1;
1965                 else if ((pk = p.key) == k || (k != null && k.equals(pk)))
1966                     return p;
1967                 else if ((kc == null &&
1968                         (kc = comparableClassFor(k)) == null) ||
1969                         (dir = compareComparables(kc, k, pk)) == 0) {
1970                     if (!searched) {
1971                         TreeNode<K, V> q, ch;
1972                         searched = true;
1973                         if (((ch = p.left) != null &&
1974                                 (q = ch.find(h, k, kc)) != null) ||
1975                                 ((ch = p.right) != null &&
1976                                         (q = ch.find(h, k, kc)) != null))
1977                             return q;
1978                     }
1979                     dir = tieBreakOrder(k, pk);
1980                 }
1981 
1982                 TreeNode<K, V> xp = p;
1983                 if ((p = (dir <= 0) ? p.left : p.right) == null) {
1984                     Node<K, V> xpn = xp.next;
1985                     TreeNode<K, V> x = map.newTreeNode(h, k, v, xpn);
1986                     if (dir <= 0)
1987                         xp.left = x;
1988                     else
1989                         xp.right = x;
1990                     xp.next = x;
1991                     x.parent = x.prev = xp;
1992                     if (xpn != null)
1993                         ((TreeNode<K, V>) xpn).prev = x;
1994                     moveRootToFront(tab, balanceInsertion(root, x));
1995                     return null;
1996                 }
1997             }
1998         }
1999 
2000         /**
2001          * Removes the given node, that must be present before this call.
2002          * This is messier than typical red-black deletion code because we
2003          * cannot swap the contents of an interior node with a leaf
2004          * successor that is pinned by "next" pointers that are accessible
2005          * independently during traversal. So instead we swap the tree
2006          * linkages. If the current tree appears to have too few nodes,
2007          * the bin is converted back to a plain bin. (The test triggers
2008          * somewhere between 2 and 6 nodes, depending on tree structure).
2009          */
2010         final void removeTreeNode(HashMap<K, V> map, Node<K, V>[] tab,
2011                                   boolean movable) {
2012             int n;
2013             if (tab == null || (n = tab.length) == 0)
2014                 return;
2015             int index = (n - 1) & hash;
2016             TreeNode<K, V> first = (TreeNode<K, V>) tab[index], root = first, rl;
2017             TreeNode<K, V> succ = (TreeNode<K, V>) next, pred = prev;
2018             if (pred == null)
2019                 tab[index] = first = succ;
2020             else
2021                 pred.next = succ;
2022             if (succ != null)
2023                 succ.prev = pred;
2024             if (first == null)
2025                 return;
2026             if (root.parent != null)
2027                 root = root.root();
2028             if (root == null || root.right == null ||
2029                     (rl = root.left) == null || rl.left == null) {
2030                 tab[index] = first.untreeify(map);  // too small
2031                 return;
2032             }
2033             TreeNode<K, V> p = this, pl = left, pr = right, replacement;
2034             if (pl != null && pr != null) {
2035                 TreeNode<K, V> s = pr, sl;
2036                 while ((sl = s.left) != null) // find successor
2037                     s = sl;
2038                 boolean c = s.red;
2039                 s.red = p.red;
2040                 p.red = c; // swap colors
2041                 TreeNode<K, V> sr = s.right;
2042                 TreeNode<K, V> pp = p.parent;
2043                 if (s == pr) { // p was s's direct parent
2044                     p.parent = s;
2045                     s.right = p;
2046                 } else {
2047                     TreeNode<K, V> sp = s.parent;
2048                     if ((p.parent = sp) != null) {
2049                         if (s == sp.left)
2050                             sp.left = p;
2051                         else
2052                             sp.right = p;
2053                     }
2054                     if ((s.right = pr) != null)
2055                         pr.parent = s;
2056                 }
2057                 p.left = null;
2058                 if ((p.right = sr) != null)
2059                     sr.parent = p;
2060                 if ((s.left = pl) != null)
2061                     pl.parent = s;
2062                 if ((s.parent = pp) == null)
2063                     root = s;
2064                 else if (p == pp.left)
2065                     pp.left = s;
2066                 else
2067                     pp.right = s;
2068                 if (sr != null)
2069                     replacement = sr;
2070                 else
2071                     replacement = p;
2072             } else if (pl != null)
2073                 replacement = pl;
2074             else if (pr != null)
2075                 replacement = pr;
2076             else
2077                 replacement = p;
2078             if (replacement != p) {
2079                 TreeNode<K, V> pp = replacement.parent = p.parent;
2080                 if (pp == null)
2081                     root = replacement;
2082                 else if (p == pp.left)
2083                     pp.left = replacement;
2084                 else
2085                     pp.right = replacement;
2086                 p.left = p.right = p.parent = null;
2087             }
2088 
2089             TreeNode<K, V> r = p.red ? root : balanceDeletion(root, replacement);
2090 
2091             if (replacement == p) {  // detach
2092                 TreeNode<K, V> pp = p.parent;
2093                 p.parent = null;
2094                 if (pp != null) {
2095                     if (p == pp.left)
2096                         pp.left = null;
2097                     else if (p == pp.right)
2098                         pp.right = null;
2099                 }
2100             }
2101             if (movable)
2102                 moveRootToFront(tab, r);
2103         }
2104 
2105         /**
2106          * 将结点太多的桶分割
2107          *
2108          * @param map   the map
2109          * @param tab   the table for recording bin heads
2110          * @param index the index of the table being split
2111          * @param bit   the bit of hash to split on
2112          */
2113         final void split(HashMap<K, V> map, Node<K, V>[] tab, int index, int bit) {
2114             TreeNode<K, V> b = this;
2115             // Relink into lo and hi lists, preserving order
2116             TreeNode<K, V> loHead = null, loTail = null;
2117             TreeNode<K, V> hiHead = null, hiTail = null;
2118             int lc = 0, hc = 0;
2119             for (TreeNode<K, V> e = b, next; e != null; e = next) {
2120                 next = (TreeNode<K, V>) e.next;
2121                 e.next = null;
2122                 if ((e.hash & bit) == 0) {
2123                     if ((e.prev = loTail) == null)
2124                         loHead = e;
2125                     else
2126                         loTail.next = e;
2127                     loTail = e;
2128                     ++lc;
2129                 } else {
2130                     if ((e.prev = hiTail) == null)
2131                         hiHead = e;
2132                     else
2133                         hiTail.next = e;
2134                     hiTail = e;
2135                     ++hc;
2136                 }
2137             }
2138 
2139             if (loHead != null) {
2140                 if (lc <= UNTREEIFY_THRESHOLD)
2141                     tab[index] = loHead.untreeify(map);
2142                 else {
2143                     tab[index] = loHead;
2144                     if (hiHead != null) // (else is already treeified)
2145                         loHead.treeify(tab);
2146                 }
2147             }
2148             if (hiHead != null) {
2149                 if (hc <= UNTREEIFY_THRESHOLD)
2150                     tab[index + bit] = hiHead.untreeify(map);
2151                 else {
2152                     tab[index + bit] = hiHead;
2153                     if (loHead != null)
2154                         hiHead.treeify(tab);
2155                 }
2156             }
2157         }
2158 
2159         /* ------------------------------------------------------------ */
2160         // 红黑树方法，都是从CLR中修改的
2161 
2162         /**
2163          * 左旋转
2164          *
2165          * @param root
2166          * @param p
2167          * @param <K>
2168          * @param <V>
2169          * @return
2170          */
2171         static <K, V> TreeNode<K, V> rotateLeft(TreeNode<K, V> root,
2172                                                 TreeNode<K, V> p) {
2173             TreeNode<K, V> r, pp, rl;
2174             if (p != null && (r = p.right) != null) {
2175                 if ((rl = p.right = r.left) != null)
2176                     rl.parent = p;
2177                 if ((pp = r.parent = p.parent) == null)
2178                     (root = r).red = false;
2179                 else if (pp.left == p)
2180                     pp.left = r;
2181                 else
2182                     pp.right = r;
2183                 r.left = p;
2184                 p.parent = r;
2185             }
2186             return root;
2187         }
2188 
2189         /**
2190          * 右旋转
2191          *
2192          * @param root
2193          * @param p
2194          * @param <K>
2195          * @param <V>
2196          * @return
2197          */
2198         static <K, V> TreeNode<K, V> rotateRight(TreeNode<K, V> root,
2199                                                  TreeNode<K, V> p) {
2200             TreeNode<K, V> l, pp, lr;
2201             if (p != null && (l = p.left) != null) {
2202                 if ((lr = p.left = l.right) != null)
2203                     lr.parent = p;
2204                 if ((pp = l.parent = p.parent) == null)
2205                     (root = l).red = false;
2206                 else if (pp.right == p)
2207                     pp.right = l;
2208                 else
2209                     pp.left = l;
2210                 l.right = p;
2211                 p.parent = l;
2212             }
2213             return root;
2214         }
2215 
2216         /**
2217          * 保证插入后平衡
2218          *
2219          * @param root
2220          * @param x
2221          * @param <K>
2222          * @param <V>
2223          * @return
2224          */
2225         static <K, V> TreeNode<K, V> balanceInsertion(TreeNode<K, V> root,
2226                                                       TreeNode<K, V> x) {
2227             x.red = true;
2228             for (TreeNode<K, V> xp, xpp, xppl, xppr; ; ) {
2229                 if ((xp = x.parent) == null) {
2230                     x.red = false;
2231                     return x;
2232                 } else if (!xp.red || (xpp = xp.parent) == null)
2233                     return root;
2234                 if (xp == (xppl = xpp.left)) {
2235                     if ((xppr = xpp.right) != null && xppr.red) {
2236                         xppr.red = false;
2237                         xp.red = false;
2238                         xpp.red = true;
2239                         x = xpp;
2240                     } else {
2241                         if (x == xp.right) {
2242                             root = rotateLeft(root, x = xp);
2243                             xpp = (xp = x.parent) == null ? null : xp.parent;
2244                         }
2245                         if (xp != null) {
2246                             xp.red = false;
2247                             if (xpp != null) {
2248                                 xpp.red = true;
2249                                 root = rotateRight(root, xpp);
2250                             }
2251                         }
2252                     }
2253                 } else {
2254                     if (xppl != null && xppl.red) {
2255                         xppl.red = false;
2256                         xp.red = false;
2257                         xpp.red = true;
2258                         x = xpp;
2259                     } else {
2260                         if (x == xp.left) {
2261                             root = rotateRight(root, x = xp);
2262                             xpp = (xp = x.parent) == null ? null : xp.parent;
2263                         }
2264                         if (xp != null) {
2265                             xp.red = false;
2266                             if (xpp != null) {
2267                                 xpp.red = true;
2268                                 root = rotateLeft(root, xpp);
2269                             }
2270                         }
2271                     }
2272                 }
2273             }
2274         }
2275 
2276         /**
2277          * 删除后调整平衡
2278          *
2279          * @param root
2280          * @param x
2281          * @param <K>
2282          * @param <V>
2283          * @return
2284          */
2285         static <K, V> TreeNode<K, V> balanceDeletion(TreeNode<K, V> root,
2286                                                      TreeNode<K, V> x) {
2287             for (TreeNode<K, V> xp, xpl, xpr; ; ) {
2288                 if (x == null || x == root)
2289                     return root;
2290                 else if ((xp = x.parent) == null) {
2291                     x.red = false;
2292                     return x;
2293                 } else if (x.red) {
2294                     x.red = false;
2295                     return root;
2296                 } else if ((xpl = xp.left) == x) {
2297                     if ((xpr = xp.right) != null && xpr.red) {
2298                         xpr.red = false;
2299                         xp.red = true;
2300                         root = rotateLeft(root, xp);
2301                         xpr = (xp = x.parent) == null ? null : xp.right;
2302                     }
2303                     if (xpr == null)
2304                         x = xp;
2305                     else {
2306                         TreeNode<K, V> sl = xpr.left, sr = xpr.right;
2307                         if ((sr == null || !sr.red) &&
2308                                 (sl == null || !sl.red)) {
2309                             xpr.red = true;
2310                             x = xp;
2311                         } else {
2312                             if (sr == null || !sr.red) {
2313                                 if (sl != null)
2314                                     sl.red = false;
2315                                 xpr.red = true;
2316                                 root = rotateRight(root, xpr);
2317                                 xpr = (xp = x.parent) == null ?
2318                                         null : xp.right;
2319                             }
2320                             if (xpr != null) {
2321                                 xpr.red = (xp == null) ? false : xp.red;
2322                                 if ((sr = xpr.right) != null)
2323                                     sr.red = false;
2324                             }
2325                             if (xp != null) {
2326                                 xp.red = false;
2327                                 root = rotateLeft(root, xp);
2328                             }
2329                             x = root;
2330                         }
2331                     }
2332                 } else { // symmetric
2333                     if (xpl != null && xpl.red) {
2334                         xpl.red = false;
2335                         xp.red = true;
2336                         root = rotateRight(root, xp);
2337                         xpl = (xp = x.parent) == null ? null : xp.left;
2338                     }
2339                     if (xpl == null)
2340                         x = xp;
2341                     else {
2342                         TreeNode<K, V> sl = xpl.left, sr = xpl.right;
2343                         if ((sl == null || !sl.red) &&
2344                                 (sr == null || !sr.red)) {
2345                             xpl.red = true;
2346                             x = xp;
2347                         } else {
2348                             if (sl == null || !sl.red) {
2349                                 if (sr != null)
2350                                     sr.red = false;
2351                                 xpl.red = true;
2352                                 root = rotateLeft(root, xpl);
2353                                 xpl = (xp = x.parent) == null ?
2354                                         null : xp.left;
2355                             }
2356                             if (xpl != null) {
2357                                 xpl.red = (xp == null) ? false : xp.red;
2358                                 if ((sl = xpl.left) != null)
2359                                     sl.red = false;
2360                             }
2361                             if (xp != null) {
2362                                 xp.red = false;
2363                                 root = rotateRight(root, xp);
2364                             }
2365                             x = root;
2366                         }
2367                     }
2368                 }
2369             }
2370         }
2371 
2372         /**
2373          * 检测是否符合红黑树
2374          */
2375         static <K, V> boolean checkInvariants(TreeNode<K, V> t) {
2376             TreeNode<K, V> tp = t.parent, tl = t.left, tr = t.right,
2377                     tb = t.prev, tn = (TreeNode<K, V>) t.next;
2378             if (tb != null && tb.next != t)
2379                 return false;
2380             if (tn != null && tn.prev != t)
2381                 return false;
2382             if (tp != null && t != tp.left && t != tp.right)
2383                 return false;
2384             if (tl != null && (tl.parent != t || tl.hash > t.hash))
2385                 return false;
2386             if (tr != null && (tr.parent != t || tr.hash < t.hash))
2387                 return false;
2388             if (t.red && tl != null && tl.red && tr != null && tr.red)
2389                 return false;
2390             if (tl != null && !checkInvariants(tl))
2391                 return false;
2392             if (tr != null && !checkInvariants(tr))
2393                 return false;
2394             return true;
2395         }
2396     }
2397 
2398 }

```
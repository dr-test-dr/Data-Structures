# 数组
  js数组属于线性结构，几乎是万能的，它不光可以作为一个普通的数组使用，可以作为栈（先入后出）或队列（先入先出）使用 
    栈： push -> 入栈  pop -> 出栈   队列：push -> 入队   shift-> 出队
  * 数组可以存储不同类型数据：js中的数组是一个特殊的对象，所以可以存储不同类型的数据
  * 数组的存储：js存储分为fast和slow存储。fast 模式下数组在源码里面叫 FastElements ，而 slow 模式下的叫做 SlowElements 。
      快数组和慢数组转换：快数组新容量是扩容后的容量 3 倍之多时/当加入的索引值 index 比当前容量 capacity 差值大于等于 1024 时（index - capacity >= 1024） 快 -> 慢
                        当慢数组的元素可存放在快数组中且长度在 smi 之间且仅节省了50%的空间  慢 -> 快
  * 数组的动态扩容与减容：js的push操作，一旦数组内存不足便进行扩容 pop操作，会进行减容
  
  题：数组扁平化、去重、排序
  ```
    已知如下数组：var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];
    编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组
    
    var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];
    let res = [];
    let obj = {};
    function temp(arr){
      for (const key in arr) {
        if(arr[key] instanceof Array){
          //递归
          temp(arr[key])
        }else{
          if(!obj[arr[key]]){  //利用对象key唯一 去重
            obj[arr[key]] = 1;
            res.push(arr[key])
          }
        }
      }
    }
    temp(arr) //此时的res 没有排序
    res = res.sort()
    console.log(res)
  ```

### Promise 对象：  
    > es6标准提供Promise对象是对异步编程的一种解决方案  
    * promise的基本特点：  
      > Promise有3中状态：Pending(进行中)、resolved(已成功)和rejected(已失败)。一但状态改变就不可以发生变化。且只可以从 Pending->resolved 或者 Pending->rejected。  
      ```
        //创建Promise实例  Promise接收一个函数作为参数
        var promise= new Promise(function(resolve , reject) {
          if （/*异步操作成功*/）｛
          resolve(value) ;
          } else {
          reject(error);
        }) ;
        
        //then方法调用 catch
        promise.then(value=>{console.log(value)}).catch(err=>{conslole.log(err)})
        
        //实例
        let promise= new Promise(function(resolve , reject) {
        console.log ( 'Promise ');
        resolve();
        })
        promise.then(function() {
        console.log ( ' Resolved . ');
        });
        console.log ( ' Hi ! ' );
          
        // Promise  （Promise对象新建后就会执行）
        // Hi ! 
        // Resolved . （then 方法指定的回调函数将在当前脚本所有同步任务执行完成后才会执行）
      ```
      
    * Promise.prototype.then()  为Promise 实例添加状态改变时的回调函数  第一个参数是resolved 第二可选，但是一般是catch来处理。  
      > then 返回的是一个Promise实例，所以可以链式调用。  promise.then(...).then(...)  //第一个回调函数完成以后，会将返回结果作为参数传入第二个回调函数。    
    * Promise.prototype.catch() 于指定发生错误时的回调函数。  promise.then(...).catch(...) //这种方式的好处在于catch也可以捕获thrn的错误。用上面两种参数的方式则不行。  
    
    * Promise.all() 用于将多个Promise实例包装成一个新的Promise实例。  
      > var p = Promise.all([pl,p2,p3));  //p1,p2,p3全为resolved的后p才为resolved，其中一个为rejected，p为rejected。  
      ```
        var promises = [2 , 3 , 5 , 7 , 11 , 13).map ( function ( id) {
          return getJSON ('/post/' + id + '. json ');
        ) }
        Promise.all(promises).then(function (posts ) {
          //
        }).catch(function(reason) {
          //
        }) ;
        
        //实例
        const pl= new Promise((resolve , reject) => {
        resolve ('hello');
        })
        .then(result => result)
        . catch(e => e);
        const p2 =new Promise((resolve , reject) => {
        throw new Error ('报错了' );
        })
        .then(result => result)
        .catch(e => e) ;
        Promise.all([pl, p2])
        .then(result => console.log(result))
        .catch(e => console.log(e)) ;
        
        //输出
         ["hello", Error: 报错了] //因为p2有自己的catch会返回一个新的Promise实例，导致Promise.all（）方法参数里面的两个实例都会resolved。
         // 若 p2没有写catch 输出： Error ：报错了 
         
      ```
    * Promise.resolve() 将现有对象转为Promise 对象  
    * Promise.reject() 

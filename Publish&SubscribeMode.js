//发布订阅模式：发布-订阅模式其实是一种对象间一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到状态改变的通知。
//发布者：发布者发布一条信息 -> 调度中心 -> 会广播通知订阅者
//订阅者：订阅事件注册 -> 调度中心

//实现发布订阅者：
//创建一个对象，初始化一个缓存列表（调度中心）
//创建四个方法：1.on方法 -> 订阅者注册事件到调度中心  2.emit方法 -> 发布者发布事件到调度中心，调度中心处理代码  3.off方法 -> 取消订阅 4.once方法 -> 订阅一次

//发布订阅模式 类
  class EventEmitter {
    constructor() {
      //调度中心
      this.events = {}
    }

    //订阅者注册事件到调度中心
    on(type, fn) {
      if (!this.events) this.events = Object.create(null);
      if (this.events[type]) {
        this.events[type].push(fn)
      } else {
        this.events[type] = [fn]
      }
    }

    //发布者发布事件到调度中心，调度中心处理代码
    emit(type, ...argument) {
      if (!this.events[type]) return
      this.events[type].forEach(fn => fn.apply(this, argument))
    }

    //取消订阅
    off(type, fn) {
      if (!this.events[type]) return
      this.events[type] = this.events[type].filter(item => {
        return item !== fn;
      })
    }

    //订阅一次
    once(type, fn) {
      function onceFun() {
        fn.apply(this, arguments);
        this.off(type, onceFun);
      }
      this.on(type, onceFun);
    }  
  }

  const callFun = (data) => {
    if (data) {
      console.log('click:' + data);
    } else {
      console.log('click')
    }
  }

  const event = new EventEmitter()
  event.on('click', callFun)
  event.emit('click', '123')
  event.off('click', callFun)
  event.emit('click', '123')
  event.once('onceClick', callFun)
  event.emit('onceClick', '123')
  event.emit('onceClick', '123')
  event.once('onceClick', callFun)
  event.emit('onceClick')

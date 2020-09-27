  //防抖 （debounce） ：多次触发，只在最后一次触发时，执行目标函数。
  //节流（throttle）：限制目标函数调用的频率，比如：1s内不能调用2次。

  //防抖：触发事件delay后执行，期间多次触发，只最后一次delay后生效 （触发事件后必须停止触发该事件delay后才会执行）
  function debounce(fn, delay){
    let time = null;
    return function() {
      if(time) clearTimeout(time);
      time = setTimeout(fn, delay);
    }
  }

  //节流：触发事件，delay后执行一次（期间多次触发）
  function throttle(fn,delay){
    let time = null;
    return function() {
      if(!time){
        time = setTimeout(()=>{
          fn.apply(this,arguments);
          time = null;  
        },delay)
      }
    }
  }
  
  function debounceFn(){
    console.log('防抖触发一次！');
  }
  function throttleFn(){
    console.log('节流触发一次！');
  }

  window.addEventListener('scroll', debounce(debounceFn, 1000));  //不停滚动滚轮 不触发防抖  停下后 1秒触发防抖
  window.addEventListener('scroll', throttle(throttleFn, 1000));  //不停滚动滚轮 每个1秒触发一次节流 停下后 还会触发一次节流

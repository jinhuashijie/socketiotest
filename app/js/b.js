

module.exports = function() {
  // var greet =function(){
  // 	console.log("这里面放一个函数，需要执行两遍")
  // }
	//可以输出，但是也会有报错
  	// var test =console.log("直接的执行函数，只需要执行一遍")
  	// return test
  	//这样也不行，找不到id这个div；只能创建内容，不能修改
  	// var test=document.getElementById('root')
  	// document.test.style.background="red"
  	// return test
  	var test={
  		t1:function(a){
		  		document.getElementById(a).style.background="red"
		  	}
	  	}
  	return test
}

/*
最终要实现的，在一个组件里面必须可以用这些函数，以及调用很多方法
只能通过传参数的方式



*/








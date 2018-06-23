	devServer: {
	    contentBase: "./build",//本地服务器所加载的页面所在的目录
	    historyApiFallback: true,//不跳转
	    inline: true,//实时刷新
        proxy: {
            '/data/*': {
                target: 'http://localhost:9093',
                //pathRewrite: {'^/data': ''},
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true
            }
        }
	},

cnpm install express mongoose body-parser cookie-parser socket.io nodemon socket.io-client axios  --save-dev

1:并不能直接转走，无法看到列表
2：在前台引入库，然后发起请求；
3：最终是解决了，能够成功拿到数据：
	第一：前后端必须重启
	第二：路径格式必须正确：前台后台端口统一，配置文件必须加 /* 才行；
*/	第三：disableHostCheck: true  出现无效请求头报错时，跟proxy同级添加
4：aixos手机端获取数据还差一点，要把获取到的数据写到页面上面；--------小米球的网速为什么会如此慢？
5:：远程刷新页面，写入数据是成功的；看看点击写入数据是否会成功--也是成功的；
6：要通过redux，能不能写入成功呢？在axios内部修改state的数据，只能通过外部定义操作函数的方式
	在内部根本没反应，连错都不报。箭头函数都不行
7：重点还是要通过通过socketio来发消息
	手机端输入框的值，传到数据库，再传输到页面，是没有问题的，那前面为什么会出问题呢？
	socketio的使用
	Io=require("socket.io")(http) 实例化后端  前端：import io from 'socket.io-client'
	io.on  监听事件
	io.emit  触发事件
	1：服务端引入：--先安装依赖：cnpm install socket.io socket.io-client --save-dev
		const server=require("http").Server(app)
		const io=require('socket.io')(server)  //本身单独可以使用，只是需要结合express
		app.listen  改成 server.listen
		io.on('connection',function(socket){//监听连接事件
			console.log('点击监听事件')
		})
	2：前端引入：
		import io froom 'socket.io-client'  //引入库
		const socket=io("ws://localhost:9093")---不管放哪里，只要有重新渲染，哪怕是change事件都会触发
		//解决跨域的问题，这样就可以连上，后台会打印
		---我的为什么失败了呢？cmd里面没有打印出连接成功的信息？
		加上斜杠，重新打包，重启服务，是可以成功的；
	3：---广播事件：--地址，
		前端：socket.emit("sendmsg",{})//把这个放到点击函数里面，就可以点击然后广播
		后端：要在全局监听里面写
		io.on("connection",function(socket){//io是全局 ，socket是本次连接
			console.log('全局监听事件')//最终要广播到全局
			socket.on("sendmsg",function(data){//同一个地址，data就是数据
				io.emit("recvmg",data)
			})
		})
		前端也要监听，前后端都是既要监听也要广播
		socket.on("recvmg",function(data){
			console.log(data)//这个data同样是，后端广播的事件
		})
	4:问题就出在这里，手机端点击可以写入数据库，但无法传递给其他浏览器
	  手机端发不出去，也接收不到，很可能是端口的问题，但是后端cmd也能及时反应，打印出了内容
	  为什么无法发送到pc浏览器上面去呢？虽然写入数据库，但并没有触发写入时的函数事件，为啥？
	  手机端能触发写入函数事件，只是on事件没有监听到
	  首先：手机端发送给能够触发服务端写入数据库的函数事件
	  然后：在服务端写入函数内部广播，前台也是能接收到的；
	  在再套一对io监听函数的情况下，手机能够发送到pc端，但是pc端却无法发送到手机端了。
		socket.onopen = function(evt) { 
		  alert("Connection open ..."); 
		  socket.send("Hello WebSockets!");
		};
		socket.onopen()
		socket.onmessage = function() {
		  alert( "Received Message: ");
		  socket.close();
		};
		socket.onmessage()
		socket.onclose = function(evt) {
		  alert("Connection closed.");
		};  
		socket.onclose()
	  即便三步走可以通过，也只是三个事件可以在手机端弹出消息，但是发送的消息却报错
	  pc端无论如何都无法发送到手机端，
输入--                        后台已经开放端口，前台Didmount的时候建立连接，发送到后台
获取输入框的值写入state----
点击--
axios将state发送到后台--
后台端口收到写入收据库--
然后搜索返回全部内容--
发送到前台--
前台获取所有数据的最后一条--
把这条数据写入state--
state输出到页面上--

是后台最终把新的数据广播到前台--前台接收到广播之后再修改state--再反馈到页面上面
后台通过广播的方式修改，而不要通过axios的方式修改

获取输入框的值写入state----                  
点击--                                    
axios将state发送到后台--                  
后台端口收到写入收据库--                  到这里还是正常的--------远程发，本地是能够接收的
然后搜索把返回的内容通过emit广播出去--    根本没有广播出去--只广播到本地电脑--肯定已经出去了
发送到前台--                              
前台 socket.on接收所有数据筛选出最后一条--
把这条数据写入state--
state输出到页面上--     到这里都是正常的 --手机可以发送到电脑上面，pc无法发送到手机端；为啥呢？
而且手机也没有修改到自己的数据；就是没有广播出去导致的；前面可以修改也只是因为手机自己修改了自己的state

极有可能是因为端口的问题，设置统一端口转发试试看！！！
另一台电脑跟手机一样可以发送，却不能修改自己的，也不能被本地电脑修改，肯定是端口的问题了
第一步：解决路径的问题
第二步：设置中间件：--测试是完全失败的；端口可以打开，也能通过
	9093服务器端口打开的文件确实转发到了build文件夹下，但是为什么报错？
	资源都已经引用到，却报错！
************************************************
现在确定就是跨域引起的，不一定是跨域，但绝对是跟域名有关系的；
前台域名可以发出去，而且小米球是同一个域名，那肯定就是后台的问题



问题：
异步函数在react里面操作state只能通过函数套函数的方式解决--要不然this就跑了
    out(f){
		this.setState({
			data:[...this.state.data,"点击函数外部组件内部",f]
		})
		console.log(this.state)
	}
	test(){
		var x=10  //每点击一次，都会被重新定义；后面的函数又根本不会执行
		var t2=this.out
		axios.post('/data/list',{user:'前台发送'}).then((res)=>{
			console.log(res.data)
			t2(res.data)
		})
	}

8：为什么会出现延迟显示的问题？点击之后显示的上一次的数据
	find函数需要放在创建函数的内部才会显示全部数据，但是速度好慢啊。
	本地速度都这么慢，远程速度必然更慢；
9：获取target。value的值，为什么也出现了延后的情况？
	虽然打印是延后 的，但是页面输出却是同步的，奇了怪了！！！





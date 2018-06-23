const express =require('express')
const bodyParser=require("body-parser")
const cookieParser=require("cookie-parser")

const path=require('path')

const app=express()
const server=require("http").Server(app)
const io=require('socket.io')(server)  //本身单独可以使用，只是需要结合express
io.on("connection",function(socket){//io是全局 ，socket是本次连接
	console.log('全局监听事件')//最终要广播到全局
	socket.on("sendmsg",function(data){//同一个地址，data就是数据
		console.log(data,10)
		io.emit("recvmg",data)
	})
})

const mongoose =require("mongoose")
const connect="mongodb://localhost:27017/my"
mongoose.connect(connect)
mongoose.connection.on("connected",function(){
	 //console.log("连接mongoose成功")//这里在cmd会打印出来
})//连接mongoose是没问题的

app.use(cookieParser())//这两个中间件必须引入，才能完成转发端口写入数据
app.use(bodyParser.json())

const User =mongoose.model("user",new mongoose.Schema({
	user:{type:String,require:true},
	age:{type:Number,require:true}//但是只能用来查，创建就不行了，会创建出空的
}))//把原有的创建成空的也可以连接成功



// User.create({
// 	'user':"手机端测试第一轮", 
// 	age:104  
// },function(err,doc){
// 	if(!err){
// 		console.log(doc)
// 	}else{
// 		console.log(err)
// 	}
// })
app.get('/data',function(req,res){//这里是自定义端口后面的路径
	//console.log('接收到前台请求')
	User.find({},function(err,doc){//从数据库查询出数据病输出到页面上
		if(!err){
			//console.log("接收到后台数据")
			res.json(doc)
		}else{
			//console.log(err)
		}
	})
	//res.json({name:"you",home:"test"})
})
app.post('/data/list',function(req,res){
	console.log(req.body,'接收到前台发送数据')
	//io.emit("phone",req.body)
	User.create({
		'user':req.body.user, 
		age:11  
	},function(err,doc){
		if(!err){
			User.find({},function(e,d){//从数据库查询出数据并输出到页面上
				if(!e){
					//console.log("接收到后台数据")
					//res.json(d)
					io.emit("phone",d)
				}else{console.log(err)}
			})
		}else{
			// console.log(err)
		}
	})	
			// User.find({},function(err,doc){//从数据库查询出数据病输出到页面上
			// 	if(!err){
			// 		console.log("接收到后台数据")
			// 		res.json(doc)
			// 	}else{console.log(err)}
			// })
	//res.json({name:"you",home:"test"})
})

	// User.create({
	// 	'user':'first', 
	// 	age:11  
	// },function(err,doc){
	// 	if(!err){

	// 	}else{
	// 		// console.log(err)
	// 	}
	// })	
// app.use(function(req,res,next){
// 	if(req.url.startsWith('/user/')||req.url.startsWith('/static/')||req.url.startsWith('/data/')){
// 		return next        //我们是没有user，没有statec路径的
// 	}else{
// 		console.log('path',path.resolve('build/index.html'))
// 		return res.sendFile(path.resolve('build/index.html'))//修正路径的问题
// 	}
// })
// app.use('/',express.static(path.resolve('build')))

server.listen(9093,function(req,res){
	console.log("连接9093成功")
})





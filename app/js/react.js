import React, {Component} from 'react'
//import config from './config.json';
import axios from 'axios'
import io from 'socket.io-client'  //引入库
const url =window.location.hostname
console.log(url)//||io("ws://"+url+":9093")
const socket=io("ws://127.0.0.1:9093")

class Greeter extends Component{
	constructor(props){
		super(props)
		this.state={
			data:'',
			content:''
		}
		this.test=this.test.bind(this)
		this.out=this.out.bind(this)
		this.add=this.add.bind(this)
	}
	componentDidMount(){
		console.log("准备发起请求")
		socket.emit('/test',{msg:"初始化时向后台发送连接测"})
		// var t2=this.out
		// axios.get('/data').then(function(res){
		// 	console.log(res.data)
		// 	var s=res.data[res.data.length-1].user
		// 	t2(s)
		// })
		const b=this
		socket.on("/phone",(data)=>{//这里接收后端广播的事件--这里远程没有接收到
			console.log(data,38)//这个data同样是，后端广播的事件
			b.setState({
				content:data[data.length-1].user
			})
		})
		
	}
	add(event){
		this.setState({
			data:event.target.value
		})
	}
	out(f){
		this.setState({
			content:f
		})
		console.log(this.state)
		//socket.emit("sendmsg",{me:this.state.content})
	}
	test(){
		var x=10  //每点击一次，都会被重新定义；后面的函数又根本不会执行
		var a=this.state.data
		var t2=this.out
		axios.post('/data/list',{user:a}).then((res)=>{
			// console.log(res.data)
			// var s=res.data[res.data.length-1].user
			// t2(s)
		})
	}
  	render() {
	    return (
	      	<div>
		        react测试后面，测试哈希值--测试无删除情况下热刷新-正常<br/>
		        而且更好，页面都没有整个刷新，虽然速度还是慢<br/>
		        build文件被删空，但是浏览器还是可以正常显示<br/>
		        <button onClick={this.test}>测试</button>
		        <p>{this.state.content}</p>
		        <input type="text" onChange={this.add}></input>
		        <img src="./image/a.png" alt=""/>
	      	</div>
	    );
  	}
}

export default Greeter
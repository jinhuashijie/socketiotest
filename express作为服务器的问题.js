1:express本身就是一个服务器了，这个文件夹就是所谓的域名下的文件夹
	但为什么无法访问这些文件，是因为转发的问题吗？即使没有转发，下面的文件也无法访问
	只能访问实例化后 app.get开启的地址，这个地址还是虚的，根本不对应真实文件
2：答案：确实是自己的问题，在serverjs里面路径解析变成解析特定文件了，应该是文件夹才对
这样在局域网也可以正常访问本地node端口，也可以正常发消息，接收即时消息，
   只是远程依旧无法接收，仅仅可以发送；
3：本地服务器可以发送给局域网，发送给小米球本地pc端；局域网，远程，手机全都接收不到
	小米球本pc端只能发送给本地服务器，局域网本地，和远程小米球pc端都接收不到
	手机发送只能发送到本地服务器和小米球，局域网，远程都接收不到
	加上一个360浏览器也只能发送到本地互发接收，远程还是不行
4:webpack-server打开的80端口局域网无法访问的问题；需要改配置
		historyApiFallback: true,//不跳转
	    inline: true,//实时刷新
        host: '0.0.0.0',
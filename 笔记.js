
第一步：安装依赖，新建文件，init

第二步：文件中的内容

第三步：打包：webpack ./app/main.js ./public/bundle.js   --到这一步是没有使用 webpack.config.js配置文件的
	会存在的问题：
	1：重新打包的时候必须删除bundlejs里面的内容，不然会有重复内容
	2：明明打包成功，而且bundlejs里面也有打印的内容，为什么浏览器显示不出来？--不知道咋回事儿
第四步：使用配置文件
	module.exports = {
	  entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件
	  output: {
	    path: __dirname + "/public",//打包后的文件存放的地方
	    filename: "bundle.js"//打包后输出文件的文件名
	  }
	}
	配置之后，只需要 运行webpack命令即可；bundlejs不会在有重复内容
	但是，引入的依赖项，依旧只显示在bundlejs里面，页面上还是没有
第五步：要注意的是：依赖输出和导入该怎么写的格式问题，导入是require，导出是 module.exports = function() {}
	而且还要注意 1：导出去，就是return出去的函数必须执行两遍才行，
				 2：在以来模块里面是无法直接获取到页面元素的，必须传参数
				 3：要是有多个函数需要用的话，就必须用对象，一个个来
				 4：在依赖里面虽然直接console.log()能够打印，但是页面还是会有报错的。
第六步："start": "webpack"   加入到json的scripts命令里面，直接运行：npm start 就可以完成打包命令
第七步：配置编译速度和报错信息相对应的选项，打包速度越快，报错信息显示的就越模糊
    source-map   cheap-module-source-map   eval-source-map    cheap-module-eval-source-map
    越来越快，但性能也越来越差
****************************webpack打包的配置算是完成了***********************
第八步：使用webpack构建本地服务器：npm install --save-dev webpack-dev-server
	devServer: {
	    contentBase: "./public",//本地服务器所加载的页面所在的目录
	    historyApiFallback: true,//不跳转
	    inline: true//实时刷新
	} 
    在packagejson里面继续添加命令："server": "webpack-dev-server --open"
    在终端中输入npm run server即可在本地的8080端口查看结果 
    ===================到这里是完全成功的========================= 
第八步：需要使用外部插件了；loaders：
	Loaders 需要单独安装并且需要在 webpack.config.js中的modules关键字下进行配置
    test：一个用以匹配loaders所处理文件的拓展名的正则表达式（必须）
    loader：loader的名称（必须）
    include/exclude:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）
    query：为loaders提供额外的设置选项（可选）
第九步：使用babel插件
    Babel其实是一个编译JavaScript的平台，它可以编译代码帮你达到以下目的：
    编译es6：babel-env-preset  编译React的JSX ：babel-preset-react
    cnpm install babel-core babel-loader babel-preset-env babel-preset-react --save-dev 
	module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "env", "react"
                        ]
                    }
                }, 
                exclude: /node_modules/
            }
        ]
    }
// 第十步：利用插件使用react：cnpm install --save react react-dom --save-dev  webpack-cli也需要本地安装
//     从这里开始出问题：--而且也不支持热刷新，不会一保存就打包，并刷新页面；只能自己手动打包再启动服务
//     报错1：Cannot find module 'resolve-cwd'  解决：安装
//       还是不行，大量依赖丢失，删除文件夹重装；一半成功，一半失败：Error: Cant resolve 'babel-loader'
//     到这里端口是可以正常打开的，但是react的内容并没有显示出来；
//     尝试解决：npm install babel-loader  安装之后出现lockjson文件；
//     出现新的错误：Error: Cannot find module 'babel-core'  npm install  可能前面真的安装错了地方
//     cnpm install babel-core babel-loader babel-preset-env babel-preset-react --save-dev
//     继续错误：Unknown plugin "import" specified in "E:\\.babelrc" at 0 ：cnpm install import --save-dev
//     cnpm install --save react react-dom --save-dev  webpack-cli  继续重装；还行不行，改名lrc文件；不行
//     移除lrc文件--之后可以显示react内容，只是cmd报错找不到lrc文件
第十步：从新走一遍：利用插件使用react：
	cnpm install --save react react-dom --save-dev  webpack-cli
	cnpm install babel-core babel-loader babel-preset-env babel-preset-react --save-dev 
	同时移除lrc文件，即便在上一级目录
	同时新建reactjs文件，里面正常import 和export 以及react创建dom
	然后：在项目目录下创建babelrc文件加入：之后正常编译，不报错，只有警告
	{
	  "presets": ["react", "env"]
	}
第十一步：处理css样式：webpack提供两个工具处理样式表，css-loader 和 style-loader
	二者处理的任务不同，css-loader使你能够使用类似@import 和 url(...)的方法实现 require()的功能,
	style-loader将所有的计算后的样式加入页面中，二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中
	cnpm install style-loader css-loader   --save-dev
	然后在config中引入新的模块：是可以成功的，有时候会报错，找不到loader，重启之后就好了；
	,
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader"
                    }
                ]
            }
第十二步：解决热更新的问题：Hot Module Replacement  
    Babel有一个叫做react-transform-hrm的插件，可以在不对React模块进行额外的配置的前提下让HMR正常工作；
    1：在webpack配置文件中添加HMR插件；
	2：在Webpack Dev Server中添加“hot”参数；
	--------然后来添加参数
	,
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
        }),
        new webpack.HotModuleReplacementPlugin()//热加载插件，头部必须引入webpack
    ],
    cnpm install babel-plugin-react-transform react-transform-hmr --save-dev   安装插件
    babelrc也需要添加内容  "presets": ["react", "env"],  之后都是新添加的
    保存即自动打包，并刷新浏览器页面已经实现，但还是有报错：
    locals[0] does not appear to be a `module` object with Hot Module  如下解决
    事实上前面并没有自动热刷新成功，只是缓存而已：var webpack = require('webpack');
    在config的头部必须引入webpack才行；自动热刷新依旧正常
    删除start命令里面的dev后面--open之后，就不会自动打开端口了
第十四步：引入哈希值，解决缓存的问题：--确实新增哈希文件，但是老文件没删掉，已经越来愈多
	const CleanWebpackPlugin = require("clean-webpack-plugin");//只要文件内容改变，js文件就是新的
	cnpm install clean-webpack-plugin --save-dev
	output: {
        path: __dirname + "/build",
        filename: "bundle-[hash].js"
    },
    确实可以成功创建后带一大堆无规则字符的新的bundlejs文件以及对应的map文件
第十三步：还需要删除多余的哈希文件
    cnpm install clean-webpack-plugin --save-dev
    在配置文件头部引入插件：
    const CleanWebpackPlugin = require("clean-webpack-plugin");
    在下面插件中引入这个插件
    new CleanWebpackPlugin('build/*.*', {
	    root: __dirname,
	    verbose: true,
	    dry: false
	})
	但事实上，前面也并没有自动生成大量哈希文件，应该是没有引入自动创建文件夹的原因

****解决自动生成文件夹和文件的问题***
	cnpm install html-webpack-plugin --save-dev
    new HtmlWebpackPlugin({  成功在build文件夹生成indexhtml和bundlejs，非哈希
        template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
    })

最后，模板文件并没有起作用，只是build文件夹里的js文件确实在不断被删除然后又新建
    只要保存一次，就会重新发生一次
    还是要退回到public，结果indexhtml文件也会被自动删除
    运行npm run server 就会自动删除public里的所有文件，但是又不重建回来
    很可能是运行顺序的问题；
    CleanWebpackPlugin  删除这个插件之后确实不再自动清空文件夹了；但css样式也丢了
还有问题：npm run server 之后 build里的文件全被删了，没有新建，但是浏览器可以正常浏览
这个问题无法解决，只能到最后了再npm start一下；











问题：为啥
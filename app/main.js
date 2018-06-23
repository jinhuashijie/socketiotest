const greeter = require('./Greeter.js');
const a = require('./js/a.js');
const b = require('./js/b.js');

import './css/main.css';//使用require导入css文件
//console.log(a()())
a()()

console.log("在mian.js页面")
//document.querySelector("#root").appendChild(greeter());
var f=document.querySelector("#root")
//必须得执行两遍 前面return也不行
b().t1('root');


import React from 'react';
import {render} from 'react-dom';
import Greeter from './js/react';

render(<Greeter />, document.getElementById('root'));

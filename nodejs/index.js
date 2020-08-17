//引入express框架
let express = require('express')
let app = express()
//引入跨域中间件
let proxy = require('http-proxy-middleware');
let cookieParser = require('cookie-parser');


 //这段程序的作用是将我们的前端项目设置成静态资源
app.use(express.static("./index"))
app.use(cookieParser())


let domainObj = require('./domain.js')
let arr = domainObj.arr

app.all('*', function(req, res, next) {
	ServerCookie = req.headers.cookie;  // 获取到cookie的字段
	//console.log(ServerCookie);
	console.log(req.url);
	//res.cookie("ut",'e998350582ff11c0b0f50615644201646b9b5cd8211cba1e1dda5a9e43fbdee462256e659161cfd1',{maxAge: 900000, httpOnly: true});

	//需要显式设置来源,不能写*
	res.header("Access-Control-Allow-Origin", req.headers.origin);
    //res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
	res.header("Access-Control-Allow-Credentials",true);
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
});



console.log(arr);
console.log('---------------------');



Object.keys(arr).forEach(function(key){
    console.log(key,arr[key]);

	let rewriteRule = '^/'+key;
	let rewriteRulObj = {}
	rewriteRulObj[rewriteRule] = ''

	//这里要注意"^/" 是匹配的路由,它会将匹配的路由进行转发，没匹配到的就不会转发。
	app.use('/'+key, proxy({
		//目标后端服务地址
		target: arr[key],
		pathRewrite: rewriteRulObj,
		changeOrigin: true
	}))
});






app.listen(8777)
console.log('server is running!') 
var http = require("http");
var httpProxy = require('http-proxy'); 
var proxy = httpProxy.createProxyServer({});


proxy.on('error', function (err, req, res) { 
    res.writeHead(500, { 
	'Content-Type': 'text/plain' 
    }); 
    res.end('500');
})




var server = http.createServer(function(req, res) { 
    var host = req.headers.host, ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; 
	var url = req.url;
	var tmp = url.substring(1);
	console.log(tmp);

	res.header("Access-Control-Allow-Origin", "*"); // 表示任意的

	console.log(tmp.indexOf('/'));
    console.log("client ip:" + ip + ", host:" + host); 
	var tt = tmp.substring(0,tmp.indexOf('/'));
    delete req.headers.tt;
    switch(tt){
	case 'pls': 
	   //把请求url的host主机为www.mizuiren.com 80 端口的请求转发到http://fs.open.kugou.com去获取数据，可以理解为直接把请求地址 http://www.mizuiren.com替换成http://fs.open.kugou.com
	   proxy.web(req, res, {target: 'http://www.baidu.com'}); 
	   break; 
	case 'sso': 
	   proxy.web(req, res, {target: 'http://ssotest.yjt361.com'}); 
	   break;
	default: 
	      res.writeHead(200, { 
		'Content-Type': 'text/plain' 
	      }); 
	   res.end('你访问的是代理服务器，但是代理域名规则找不到你的请求!'); 
    } 
}); 
console.log("proxy listening on port 80") 
server.listen(80);
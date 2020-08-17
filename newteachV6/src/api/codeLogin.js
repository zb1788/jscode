export default {
    httpport:":8900",
    httpsport:":8901",
    errmessage:"",
    connect:null,
    connect_time:null,
    init(protocol,ssourl,showhandel,changehandel,closehandel){
        if("undefined"==typeof(protocol) || "undefined"==typeof(ssourl) ||null==protocol || null==ssourl){
            return;
        }
        if (!window.WebSocket) {
            window.WebSocket = window.MozWebSocket;
        }
        if (window.WebSocket) {
            this.connect_time=new Date().getTime();
            if(protocol.indexOf("https")>-1){
                this.connect = new WebSocket("wss://"+ssourl+this.httpsport+"/pmserver");
            }else{
                this.connect = new WebSocket("ws://"+ssourl+this.httpport+"/pmserver");
            }
            
            this.connect.onopen = (event)=>{
                console.log("open connect wss!");
                this.connect.send("11111111111111111");
                //已连接
            };
        
            this.connect.onmessage = (event)=>{
                var myjson = eval('(' +event.data+ ')');
                if(myjson.type=="getcode"){
                    //记录codeid
                    showhandel(myjson);
                }else if(myjson.type=="getstatus"){
                    //扫码状态
                    changehandel(myjson);
                }
            };
            this.connect.onclose = (event)=>{
                //连接关闭!二维码过期
                if(null==this.connect_time || (this.connect_time+5000)<new Date().getTime()){
                    closehandel();
                }else{
                    console.log("连接失败！");
                }
                this.connect_time=null;
                //codelogin.connect=null;
            };
        
        }else{
            this.errmessage="浏览器版本过低,不支持二维码方式登录!";
        }
    }
}
<template>
<div id="codeLogin" class="smLogin" style="display: none;">
    <div class="tabLogin">
        <div class="tlBg "><a href="javascript:void(0)" @click="changeLogin()"><span class="iconfont icon-erweima1"></span></a></div>
        <div class="tlBg select"><a href="javascript:void(0)"  @click="changeLogin()"><span class="iconfont icon-diannaodenglu"></span></a></div>
    </div>
    <h1>打开优教信使</h1>
    <h4>扫一扫&nbsp;&nbsp;&nbsp;快速登录</h4>
    <div  id="qrcodeCanvas" class="ma" v-show="!coverCodeImg"></div>
    <div class="ma" v-show="coverCodeImg" ><div id='flushdiv' ><a @click='createCodeImg()'>点此刷新二维码</a></div></div>
    <p class="wuJlu">{{errMessage}}</p>
</div>
</template>
<script>
import codeLogin from '../../api/codeLogin'
import QRCode from 'qrcodejs2'
export default {
    name:"codeLogin",
    components: {
        QRCode
    },
	async mounted(){
    },
    props: ['showCodeLogin'],
    data (){
        return{
            errMessage:"",
            codeid:null,
            coverCodeImg:false
        }
    },
    methods:{
        changeLogin(){
            this.$emit('changeLogin',false);
        },
        createCodeImg(){
            this.errMessage="";
            let protocol=this.$store.getters.domainConfig.LOCAL_PROTOCOL;
            let ssourl = this.$store.getters.domainConfig.SSO;
            console.log("协议："+protocol+" sso:"+ssourl);
            if("undefined"==typeof(protocol) || "undefined"==typeof(ssourl)){
                this.errMessage="内部参数错误！";
                return;
            }
            //先清空
            document.getElementById("qrcodeCanvas").innerHTML="";
            codeLogin.init(protocol,ssourl,(tjson)=>{
                //记录codeid
                this.codeid=tjson.key;
                var url=decodeURIComponent(tjson.url);
                let areacode = this.$store.getters.localAreaCode;
                console.log("areacode:"+areacode);
                //scantype=4授课标志(仅允许教师登陆),增加平台标志areacode（供手机定制地区替换logo）
                if("undefined"==typeof(areacode) || areacode==null){
                    areacode="";
                }
                if("undefined"!=typeof(url) && url!=null && url!=""){
                    if(url.indexOf("?")>-1){
                        url = url + "&scantype=4&areacode="+areacode;
                    }else{
                        url=url+"?scantype=4&areacode="+areacode;
                    }
                }
                console.log("show code url:"+url+" key:"+tjson.key);
               
                let sideLength=Math.round(document.body.clientWidth*19/100);
                let qrcode = new QRCode('qrcodeCanvas', { width: sideLength, height: sideLength, text: url, colorDark : "#000", colorLight : "#fff"})
                
            },(myjson)=>{
                if(myjson.flag=="2"){
                    console.log("myjson.flag=2-触发登陆:"+this.codeid);
                    this.errMessage="登陆中...";
                    //二维码通过
                    //key登录地址
                    this.$emit("onCodeLogin",this.codeid);
                }else if(myjson.flag=="1"){
                    //已扫描
                    this.errMessage="已扫描二维码";
                }else if(myjson.flag=="3"){
                    console.log("myjson.flag=3");
                    //二维码过期
                    this.codeid=null;
                    this.errMessage="二维码过期!";
                }
            },(myjson)=>{
                console.log("connect Close!");
                console.log(myjson);
                if(this.errMessage!="登陆中..."){
                    this.codeid=null;
                    this.errMessage="二维码过期!";
                }
            });
        }
    },watch:{
        showCodeLogin(val){
            if(val){
                this.createCodeImg();
            }
        },
        errMessage(val){
            if(val=='二维码过期!' || val=='登陆中...'){
                this.coverCodeImg=true;
            }else{
                this.coverCodeImg=false;
            }
        }
    }
}
</script>
<style scoped>

</style>

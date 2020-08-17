<template>
	<div class="contain">
    <div class="box">
        <van-image
          :src="logoImg"
        />        
    </div>
    <div class="center" style="font-size:1rem;">优教缴费系统</div>
    <div class="center">
      <van-field
        v-if="showAreaCheck"
        readonly
        clickable
        label="区域"
        :value="value"
        placeholder="选择城市"
        @click="showArea"
      />

    <van-cell-group v-show="showLogin">
      <van-field v-model="username" type="number" label="帐号" placeholder="请输入帐号" />
      <van-field v-model="password" type="password" label="密码" placeholder="请输入密码"/>
      <van-field
        v-model="validateCode"
        center
        clearable
        type="number"
        label="验证码"
        placeholder="请输入验证码"
      >
        <template #button>
          <van-image          
          width="2rem"
          height="1rem"
          :src="imgUrl"
          @click="changeImg"
        />
        </template>
      </van-field>

    </van-cell-group>      
    </div>
    <div class="center" v-show="showLogin">
      <van-button size="normal" type="info" id="login" @click="submit" :loading="buttonLoading" loading-text="加载中...">登录</van-button>
    </div>

    <!-- 区域弹窗 -->
    <van-popup v-model="showPicker" position="bottom" :style="{ height: '30%' }">
      <van-picker 
      show-toolbar 
      title="选择区域" 
      value-key="name"  
      :columns="areaList"  
      @change="onChange" 
      @cancel="onCancel" 
      @confirm="onAreaConfirm" 
      />
    </van-popup>

    <!-- 选择孩子 -->
    <van-popup v-model="showChild" position="bottom" :style="{ height: '30%' }">
      <van-picker 
      show-toolbar 
      title="选择学生" 
      value-key="role"  
      :columns="childList"        
      @cancel="onChildCancel" 
      @confirm="onChildConfirm" 
      />
    </van-popup>
    <van-popup v-model="loading">
      <van-loading size="24px" vertical>加载中...</van-loading>
    </van-popup>    
  </div>
</template>

<script>
import axios from 'axios'
import { Col, Row,Image,Picker,Popup,Field,CellGroup,Cell,Button,Dialog,Loading } from 'vant';

import { init } from './util/fontSizeUtil';
let Base64 = require('js-base64').Base64;

function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(decodeURIComponent(unescape(r[2])));
  return null;
}

var from = '';//from 1:扫码 2：公众号

var domain = GetQueryString("domain");
if(typeof domain == 'undefined'|| domain == null){
  domain = '';
  from = 2;
}else{
  from = 1;
  domain = Base64.decode(domain);
}

var debug = GetQueryString("debug");
if(typeof debug == 'undefined'|| debug == null){
  debug = false;
}else{
  debug = true;
}

var payUrl = 'http://pay.czbanbantong.com';
var jykUrl = 'https://jyk.czbanbantong.com';
if(debug){
  payUrl = 'https://paynat.yjt361.com';
  jykUrl = 'https://jyknat.yjt361.com';
}
console.log(from);



export default {
  name: 'app',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Image.name]: Image,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
    [Loading.name]:Loading
	},
  data () {
    return {
      logoImg:require('@/assets/logo.png'), //https://img.yzcdn.cn/vant/cat.jpeg
      value: '',
      showPicker: false,
      loading: false,
      username:'',
      password:'',
      imgUrl:'',
      validateCode:'',
      areaList: [{values: []}, {values: []}, {values: []}],  
      checkAll: false,
      modulus:'10001',
      publicExponent:'ca56aa9d90e438b659c4d8da8d586687eabe1ba7bd90463981ea5397aab90020387e0a541020eddaa746f982a30115c54b04d5d1f823345f8d16ebffe647c986be3692158fc08413854ab3123b48c9ff486b12905ab21dd2dcfbbab9a2afac89953d86582bd13392c8fbbba0795fb00ebfffe3b0eb6a9cc372ee84635984807f',
      showLogin:false,//显示用户名，密码输入
      showAreaCheck:true,//显示区域选择按钮
      showChild:false,//显示孩子选择弹窗
      childList:[],
      domainSso:'',
      schoolName:'',
      schoolId:'',
      className:'',
      classId:'',
      areaFullname:'',
      areaId:'',
      buttonLoading:false
    }
  },
  created(){
    init();
    if(from == 1){
      //扫码
      //隐藏区域选择
      this.showAreaCheck = false;
      this.showLogin = true;
      //展示用户名，密码，验证码
      console.log(domain)
      this.domainSso = domain;
      this.imgUrl = this.getValidateImg();
    }else{
      //公众号
      //显示区域选择，选完区域在显示用户名密码框
      this.showAreaCheck = true;
      this.showLogin = false;
    }
  },
  mounted(){
    let devWidth = (document.documentElement.clientWidth-10) + 'px';
    document.getElementById('login').style.width=devWidth;
  },
  methods:{
    changeImg(){
      this.imgUrl = this.getValidateImg();
    },
    getValidateImg(){
      return `https://${this.domainSso}/sso/radomImage?r=`+Date.parse(new Date()) / 1000
    },
    //展示区域
    showArea(){
      this.getArea(0,0);      
    },
    //登录
    submit(){
      if(from == 2){
        if(!this.checkAll){
          this.dialogMethod('请选择完整区域！');
          return false;
        }
      }
      if(this.username === ''){
        this.dialogMethod('帐号不能为空！');
        return false;
      } 
      if(this.password === ''){
        this.dialogMethod('密码不能为空！');
        return false;
      }

      if(this.validateCode === ''){
        this.dialogMethod('验证码不能为空！');
        return false;
      }

      // this.username = '18638190701'
      // this.password = '123456'
      console.log(this.username)
      console.log(this.password)

      this.buttonLoading = true;


      let pubkey = new RSAUtils.getKeyPair(this.modulus, '', this.publicExponent);
      RSAUtils.setMaxDigits(130);
      let phoneNumRSA = RSAUtils.encryptedString(pubkey, this.username);
      let pwdRSA = RSAUtils.encryptedString(pubkey, this.password);

      let url = `https://${this.domainSso}/sso/interface/queryLoginUser3.jsp`;
      let that = this;
      this.$jsonp(url,{
        callbackQuery:'jsoncallback',
        q:phoneNumRSA,
        pwdRsa:pwdRSA,
        validateCode:this.validateCode,
        loginUsertype:'student',
        timestamp:Date.parse(new Date()) / 1000
      }).then((result)=>{
          that.buttonLoading = false;
          if(result.code != '200'){
            that.changeImg();
            that.validateCode = '';
            that.dialogMethod(result.msg);            
          }else{
            if(result.data && result.data.length > 1){
                //多账号
                that.childList = [];
                result.data.forEach((item)=>{
                  that.childList.push(item);
                })
                that.showChild = true;
            }else{
              //单帐号，直接进入付款页
              //window.location.href='';
              var userinfo = result.data[0];
              window.location.href= payUrl+'/phonepay/order.html?areaname='+Base64.encode(userinfo.areaFullname)+'&username='+userinfo.username+'&truename='+Base64.encode(userinfo.role)+'&inputname='+Base64.encode(this.username)+'&areacode='+userinfo.areaId+'&classname='+Base64.encode(userinfo.className)+'&classcode='+userinfo.classId+'&schoolname='+Base64.encode(userinfo.schoolName);
            }
          }
      }).catch((error)=>{
        that.buttonLoading = false;
        that.dialogMethod(result.msg);
      })
    },
    dialogMethod(msg){
        Dialog.alert({
          message: msg,
        }).then(() => {
          // on close
        });
    },
    getArea(fid,index){
      //  let url = 'http://127.0.0.1:8777/interface/queryArea.jsp?areaFid='+fid;      
      let url = jykUrl +'/interface/queryArea.jsp?areaFid='+fid;
      let self = this;
      this.loading = true;
      axios.get(url).then(function(res){
        console.log(res);
        self.showPicker = true;
        self.loading = false;
        if(res.status === 200 && res.data.length > 0){
          if(index === 1 || index === 2){
            self.areaList[index].values =[];
          }else if(index === 0 && self.areaList[index].values.length > 0){
            return false;
          }
          self.areaList[index].values.push({name:'请选择',sso:'',code:''});
          for(let item of res.data){
            self.areaList[index].values.push({name:item.areaname,sso:item.domainSso,code:item.areaId});
          }
        }
      }).catch(function(error){
        self.loading = false;
      })
      console.log(this.loading);
    },
    onChange( picker,values,index){
      console.log(values);
      console.log(index);
      if(index < 2){
        if(values[index].code === ''){
          if(index === 0){
            this.areaList[1].values = [{name:'请选择',sso:'',code:''}]
            this.areaList[2].values = [{name:'请选择',sso:'',code:''}]
          }else if(index === 1){
            this.areaList[2].values = [{name:'请选择',sso:'',code:''}]
          }
        }else{
          this.getArea(values[index].code,index+1);
        }
      }
    },
    onCancel(){
      this.showPicker = false;
    },
    onAreaConfirm(value, index){
      console.log(value)
      console.log(index)
      this.checkAll = true;
      let areaName = [];
      for(let item of value){
        if(typeof item === 'undefined' || item.code === ''){
          this.checkAll = false;
        }else{
          areaName.push(item.name);
          if(item.sso !== ''){
            this.domainSso = item.sso;
          }
        }
      }
      this.value = areaName.join('-');
      if(!this.checkAll){
        //没有全选，给出提示
        this.dialogMethod('请选择完整区域！');        
      }else{        
        this.imgUrl = this.getValidateImg();
        this.showLogin = true;
      }
      this.showPicker = !this.checkAll;      
    },
    onChildCancel(){
      this.dialogMethod('必须选择一个学生');
    },
    onChildConfirm(value, index){
      console.log(value)
      console.log(index)
      this.showChild = false;
      //window.location.href='?'areaName=&username=value.username&truename=value.truename&inputname=this.name;            
      window.location.href= payUrl+'/phonepay/order.html?areaname='+Base64.encode(value.areaFullname)+'&username='+value.username+'&truename='+Base64.encode(value.role)+'&inputname='+Base64.encode(this.username)+'&areacode='+value.areaId+'&classname='+Base64.encode(value.className)+'&classcode='+value.classId+'&schoolname='+Base64.encode(value.schoolName);
    }
    
  }
}
</script>

<style>
* {
	box-sizing: border-box;
}

a {
	color: #000
}

input:-webkit-autofill {
	-webkit-box-shadow: 0 0 0 1000px white inset;
}

html {
	-webkit-overflow-scrolling: touch;
}

body {
	overflow-x: hidden;
	max-width: 700px;
	margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.contain{
  width: 100%;
  /* margin-top: 100px; */
  display: flex;
  flex-direction: column;
  padding: 10px 0;
}

.box{
  flex: 1;
  display: flex;
  margin: 0 auto; 
}

.center{
  margin: 10px auto;
}
.van-field__label{
  /* width: 3em!important; */
  text-align: right;
}
</style>

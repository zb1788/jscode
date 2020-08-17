<template>
<div id="loginMain" class="blueBg">
    <div id="main">
			<div class="skWrap">
				<div class="topLogo"> <span class="logoQuan"><img :src="logoImg" alt="" /></span> </div>
				<div class="leftBg"><img src="static/area/default/leftphoto-4k.png" alt="" /> </div>
				<!-- leftBgend -->

				<div class="rightLoginBox">

					<div class="ptLogin" v-show="!codeLogin">
						<div class="tabLogin">
							<div class="tlBg select"><a href="javascript:void(0)" @click="codeLogin=!codeLogin" __VCOM_ANALYTICS="tls_dl_ewm" __VCOM_ANALYTICS_CLICK><span class="iconfont icon-erweima1"></span></a></div>
							<div class="tlBg "><a href="javascript:void(0)"  @click="codeLogin=!codeLogin" ><span class="iconfont icon-diannaodenglu"></span></a></div>
						</div>
						<div class="rightLogiHead ">
							<div class="tpiconBg "><img :src="defaultPhoto"></div>
						</div>
    <el-form ref="form" :model="form" :rules="loginRules" label-position="left" label-width="0px" class="card-box login-form">
						<div class="rightLoginFill" id="divLogin">

                            <el-input id="inputname" v-model="form.username" placeholder="用户名" prefix-icon="el-icon-user" ref="$inputUserName" @click.native="handleKeyBoardCalled('userName', $event)" @keyup.enter.native="handleLogin" ></el-input>
                            
							<el-input id="inputpwd" :type="pwdType" v-model="form.password" placeholder="密码" prefix-icon="el-icon-lock" ref="$inputPwd"  @click.native="handleKeyBoardCalled('pwd', $event)" @keyup.enter.native="handleLogin" >
								<i slot="suffix" title="显示密码" @click="changePwdShow()" style="cursor:pointer;" :class="passIconClass" ></i>
							</el-input>
						</div>
						<el-checkbox v-model="savePassword">记住密码</el-checkbox>
						<el-button type="primary" id="signup_button" :loading="loading" @click.native.prevent="handleLogin" __VCOM_ANALYTICS="tls_dl_zh" __VCOM_ANALYTICS_CLICK>登 录</el-button>
    </el-form>
						<div class="teUsers">
							<div :class="{tuL:true,select:(historyStart>0)}"><a href="javascript:void(0)" @click="changeHistoryStart(-4)"><span class="iconfont icon-shousuozuobian"></span></a></div>
							<div class="tuC">
								<ul>
									<li v-for="(adata,hisindex) in historyDatas" v-show="hisindex>=historyStart && hisindex<(historyStart+4)" :key="adata.account">
										<a href="javascript:void(0);" @click="delHistoryData(hisindex)" class="del" ><span class="iconfont icon-guanbi1"></span></a>
										<a href="javascript:void(0)" @click="selectHistoryData(hisindex)">
											<img :src="adata.photo" :alt="adata.name" >
											<p>{{adata.name}}</p>
										</a>
									</li>
								</ul>
							</div>
							<div :class="{tuR:true,select:((historyStart+4)<historyDatas.length)}" ><a href="javascript:void(0)" @click="changeHistoryStart(4)"><span class="iconfont icon-shousuoyoubian"></span></a></div>
						</div>
					</div>
					<codeLogin v-show="codeLogin" :showCodeLogin="codeLogin" @changeLogin="codeLogin=false" @onCodeLogin="LoginByCode"/>


<Keyboard
    ref="$keyboardUserName"
      :elInput="$refs.$inputUserName" v-model="form.username" v-show="showUserNameKeyboard" @bkClick="showUserNameKeyboard = false" />

<Keyboard
    ref="$keyboardPwd"
      :elInput="$refs.$inputPwd" v-model="form.password" v-show="showPwdKeyboard" @bkClick="showPwdKeyboard = false" />
	  

				</div>
				<!-- rightLoginBox end -->
				<div class="closeSk" @click="closeWindow()" ><i class="el-icon-close"></i></div>
				<!-- closeSk end -->
				<div class="bottomBg">
					<div class="gongJu">
						<ul>
							<!--
							<li >
								<div class="iconBg"><span class="iconfont icon-upanshuma01"></span></div>
								<p>u盘资源</p>
							</li>
							-->
							<li >
								<div class="iconBg " @click="showSet=true;showUserNameKeyboard = false;showPwdKeyboard = false" ><i class="el-icon-setting"></i></div>
								<p>系统设置</p>
							</li>
							<li>
								<div class="iconBg" @click="openSoftKey"><span class="iconfont icon-ruanjianpan"></span></div>
								<p>软键盘</p>
							</li>
							<!-- 无存在必要
							<li>
								<div class="iconBg"><span class="iconfont icon-icon-toolkit"></span></div>
								<p>优教工具</p>
							</li>
							-->
							<li>
								<div class="iconBg"  @click="showAbout=true" ><span class="iconfont icon-bangdingshoukejiaoshi"></span></div>
								<p>关于</p>
							</li>
							<!--
							<li>
								<div class="iconBg"><span class="iconfont icon-gexinghuashezhi"></span></div>
								<p>自定义</p>
							</li>
							-->
						</ul>
					</div>

				</div>
				<!-- bottomBg end -->
				<div class="banQuan">
					<span class="bQlogo"><img :src="copyRightImg" alt=""></span>
					<span class="bQline"></span>
					<span class="bQdesc" v-html="copyRightText">
						
					</span>
				</div>
				<!-- banQuan end -->
			</div>
		</div>
<setModle :setDialogVisible="showSet" :showArea="setArea" @setClose="showSet=false" />
<aboutWindow v-if="showAbout" :setDialogVisible="showAbout" @aboutClose="showAbout=false" />
    <YjNewteachVisibilityDialog :close-on-click-modal="false" title = '修改密码'  :visible.sync="repeatPassword">     
		<div style="color:red;padding:1vh 0;background-color:#E6A23C;">
			应国家对信息系统安全监管要求，为了您的信息安全，请不要使用过于简单的密码！
		</div>
		<div>
			<el-input style="padding:1vh 0;" :type="pwdType" v-model="oldPassword" placeholder="原密码" prefix-icon="el-icon-lock"  ></el-input>			
			<el-input style="padding:1vh 0;" :type="pwdType" v-model="newPassword" placeholder="新密码" prefix-icon="el-icon-lock"></el-input>
			<el-input style="padding:1vh 0;" :type="pwdType" v-model="newPassword1" placeholder="确认新密码" prefix-icon="el-icon-lock"></el-input>
		</div>
		<div style="color:red;padding:1vh 0;background-color:#E6A23C;">
			{{changePasswordRegMsg}}
		</div>
        <div slot="footer">                        
            <YjNewteachButton @click="repeatPasswordCancel">取消</YjNewteachButton>
            <YjNewteachButton type="blue" @click="repeatPasswordSubmit">确定</YjNewteachButton>
        </div> 
      </YjNewteachVisibilityDialog>    
</div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import {AUTH_TOKEN_NAME,AUTH_TIME_NAME} from '@/api/constant'
import userHistory from '@/api/history'
import storageUtil from '@/utils/storage'
import { sendRequest, getEncryptUserName, validateUsernameAndPassword,getPasswordReg,changePassword,sendLogout} from '@/api/login'
import { getDomainConfigFromGwApi,authLogin,authCodeLogin,getSsoGrantByUt,getLocalAreaCode,getSsoEncryptInfoApi } from '@/api/interface'
import { getJWTInfo,saveAreaInfoFile,getUserInfoBySso,getShoukeDomain, getTeacherComputerMac,updateLocalAreaCode,getClientType,setDomainFile } from '@/api/init'
import { setLoginStyle, setUt} from '@/utils/auth'
import { addUb } from '@/api/interface'
import { mapGetters } from 'vuex'
import Keyboard from '../../components/Keyboard'
import codeLogin from './codeLogin'
import setModle from './sysSet'
import aboutWindow from './about'
import '../../assets/login/font/iconfont.css'
import '../../assets/login/css/master.css'
//import JsEncrypt from 'jsencrypt'

export default {
    components: {
		Keyboard,
		setModle,
		codeLogin,
		aboutWindow
	},
    computed: {
        ...mapGetters([
            'domainConfig',
            'transferProtocol',
            'teacherComputerMac'
        ])
	},
    data(){
        const validateUsername = (rule,value,callback) =>{
          if(value.length==0){
            callback(new Error('请输入正确的用户名'))
          }else{
            callback()
          }
        }
        const validatePass = (rule,value,callback) => {
          if(value.length < 1){
            callback(new Error('密码不能为空'))
          }else{
            callback()
          }
        }
        return {
            form: {
                username:'',
                password:''
            },
            loginRules: {
				username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
              	password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
			},
			historyDatas:[],//历史用户
            loading: false,//是否普通登陆中
            savePassword:false,//是否保存密码
			showPwd:false,//是否显示密码
			codeLogin:false,//是否二维码登陆
			showUserNameKeyboard:false,//是否显示账号软键盘
			showPwdKeyboard:false,//是否显示密码软键盘
			historyStart:0,//历史用户起点,
			showSet:false,//显示设置窗口
			setArea:false,//打开设置地址
			showAbout:false,//显示关于窗口
			pwdType:"password",//密码框类型
			passIconClass:"el-input__icon iconfont icon-icon-test1 el-input__clear",//密码框后缀图标
			defaultPhoto:"static/login/default.png",//登陆默认头像
			copyRightImg:"static/area/pass.gif",//版权信息图片地址
			logoImg:"static/area/pass.gif",//Logo图片地址
			copyRightText:"",//权限及400文字信息
			repeatPassword:false,
			oldPassword:'',//老秘密啊
			newPassword:'',//新密码
			newPassword1:'',//重复新密码
			changePasswordReg:'',
			changePasswordRegMsg:''
        }
	},
	async created(){
		//获得各个系统域名
		getDomainConfigFromGwApi().then((configRes)=>{
			console.log("domainConfig:");
			console.log(configRes);
			this.checkAcessProtocol(configRes.data.LOCAL_PROTOCOL);
			if(configRes.code == '200'){
				let domainObj = configRes.data
				domainObj.PORTAL = document.domain
				this.$store.dispatch('setConfig', domainObj)
				// this.$store.dispatch('setConfig',)
				this.$store.dispatch('setTransferprotocol', configRes.data.LOCAL_PROTOCOL+'://')
			}else{
				this.showErrorMessage("系统参数获取异常！");
			}
		});
	}
	,
    mounted(){		
		//获取并设置电脑mac
		window.setTimeout(()=>{
			this.$store.dispatch('setTeacherComputerMac', getTeacherComputerMac());
			//获取历史用户记录
			try{
				this.historyDatas= userHistory.getHistoryData();
			}catch(e){
				console.log("getHistoryDataError:"+e.message);
			}
			try{
				getLocalAreaCode().then((codeReq)=>{
					//手动输入地址无法获取平台地区，因此在此获取，如果均为选择可直接在选择地区是写入。
					if(typeof(codeReq)!="undefined" && "1"==codeReq.status){
						if(codeReq.localAreaCode!=null){
							updateLocalAreaCode(codeReq.localAreaCode);
							this.$store.dispatch("setLocalAreaCode",codeReq.localAreaCode);
						}
					}
				});
			}catch(e){
				console.log("getLocalAreaCodeError:"+e.message);
			}
			//当前客户端定制标记存入store
			this.$store.dispatch("setClientFlag",getClientType());
			let customData=mapClientFlag(this.$store.getters.clientFlag);
			console.log("定制数据 customData：");
			console.log(customData);
			this.logoImg=getCustomLogo(this.$store.getters.clientFlag);//Logo图片地址
			this.copyRightText=customData.copyrightText;
			this.copyRightImg=customData.url+"btlogo.png"//版权信息图片地址
			//NB用加密sso地址信息，预存入store
			getSsoEncryptInfoApi().then((res) => {
				if(res.code == 200){
					this.$store.dispatch("setDesSso",res.data)
				}				
			}).catch((e)=>{
				this.$messageteach.warning('网络异常！')
			})
		},200);
		if("undefined"!=typeof(this.$route.params) && "undefined"!=typeof(this.$route.params.loginMessage) && this.$route.params.loginMessage.length>0){
			this.showErrorMessage(this.$route.params.loginMessage)
		}
		/*
		//地区设置窗口关闭,移至index.html index.js
		window.addEventListener('onClosePage', function (e) {       
          	let robj=e.detail;
			if("setArea"==robj.type && "ok"==robj.option){
				window.close();
			}
		})
		*/
    },
    methods:{
			closeWindow(){
				sendLogout().then((res)=>{window.close()}).catch((error)=>{window.close()})
			},
			formateDate(time){
				var year=time.getFullYear();
				var month=time.getMonth()+1;
				var day=time.getDate();
				var hour=time.getHours();
				var minute=time.getMinutes();
				var second=time.getSeconds();
				if(month<10){
					month="0"+month;
				}
				if(day<10){
					day="0"+day;
				}
				if(hour<10){
					hour="0"+hour;
				}
				if(minute<10){
					minute="0"+minute;
				}
				if(second<10){
					second="0"+second;
				}
				var strTime = year+""+month+""+day+""+hour+""+minute+""+second;
				return strTime;				
			},
			async showPwdTips(){
				let res = await getPasswordReg();
				this.changePasswordRegMsg = res.tip;
				this.changePasswordReg = res.pwdreg;
			},
			repeatPasswordCancel(){
				this.repeatPassword = false;
			},
			async repeatPasswordSubmit(){
				if(this.oldPassword == ''){
					this.showErrorMessage('原密码不能为空！');
					return false;
				}
				if(this.newPassword == ''){
					this.showErrorMessage('新密码不能为空！');
					return false;
				}
				if(this.newPassword1 == ''){
					this.showErrorMessage('确认新密码不能为空！');
					return false;
				}
				if(this.newPassword != this.newPassword1){
					this.showErrorMessage('新密码和确认新密码不一致！');
					return false;
				}

				let regFlag = new RegExp(this.changePasswordReg).test(this.newPassword);
				if(!regFlag){
					this.showErrorMessage('新密码格式不符合要求');
					return false;
				}


				let modulus="10001";
				let publicExponent="ca56aa9d90e438b659c4d8da8d586687eabe1ba7bd90463981ea5397aab90020387e0a541020eddaa746f982a30115c54b04d5d1f823345f8d16ebffe647c986be3692158fc08413854ab3123b48c9ff486b12905ab21dd2dcfbbab9a2afac89953d86582bd13392c8fbbba0795fb00ebfffe3b0eb6a9cc372ee84635984807f";
				let pubkey = new RSAUtils.getKeyPair(modulus,"",publicExponent);
				RSAUtils.setMaxDigits(130);
				let oldPwdRSA = RSAUtils.encryptedString(pubkey,this.oldPassword);
				let newPwdRSA = RSAUtils.encryptedString(pubkey,this.newPassword);
				let usernamedate = this.form.username + '|' + this.formateDate(new Date())
				let usernameRSA = RSAUtils.encryptedString(pubkey,usernamedate);
				let res = await changePassword(oldPwdRSA,newPwdRSA,usernameRSA);
				if(res.opRsCode == '0'){
					this.$messageteach({type:"success",message:res.opRsInfo});
					this.repeatPassword = false;
				}else{
					this.showErrorMessage(res.opRsInfo);
				}
			},
			/**
			 * 检查用户访问协议头是否与配置匹配，如果平台为https用户以http访问，则获取当前访问地址到teachui/并替换协议头为https写入地址文件
			 */
			checkAcessProtocol(configProtocol){
				console.log(window.location.protocol+" -- "+configProtocol);
				if("https"==configProtocol){
					if(window.location.protocol=="http:" && window.location.href.indexOf("/teachui/")>1){
						let newUrl=window.location.href.substring(0,window.location.href.indexOf("/teachui/")+9).replace("http:","https:");;
						setDomainFile(newUrl);
					}
				}
			},
			changePwdShow(){
				if("text"==this.pwdType){
					this.pwdType="password";
					this.passIconClass="el-input__icon iconfont icon-icon-test1 el-input__clear";
				}else{
					this.pwdType="text";
					this.passIconClass="el-input__icon iconfont icon-icon-test el-input__clear";
				}
			},
			selectHistoryData:function(hindex){
				this.form.username=this.historyDatas[hindex].account;
				this.form.password=this.historyDatas[hindex].pwd;
				this.defaultPhoto=this.historyDatas[hindex].photo;
				if(this.historyDatas[hindex].pwd!=""){
					this.savePassword=true;
				}
			},
			delHistoryData(hindex){
				console.log("删除历史用户："+hindex);
				userHistory.delHistoryData(this.historyDatas,hindex);
				userHistory.saveHistoryData(this.historyDatas);
			},
			changeHistoryStart:function(changes){
				if( changes<0 && (this.historyStart+changes)<0){
					this.historyStart=0;
				}else if(changes>0 && ((this.historyStart+changes)>=this.historyDatas.length || (this.historyStart+changes)>=8) ){
					if(this.historyDatas.length<4){
						this.historyStart=0;
					}else{
						this.historyStart=4;
					}
				}else{
					this.historyStart=this.historyStart+changes;
				}
			},
			openSoftKey(){
				VcomDownOcx.playFile("C:\\WINDOWS\\system32\\osk.exe");
			},
			async LoginByCode(key){
				this.loading = true;
				try{
				//登录认证
				let loginResult=await authCodeLogin(key);
				console.log(loginResult,"二维码登录结果");
				if(loginResult==null || "string"!=typeof(loginResult.access_token)){
					//处理401无权限和断网情况
					this.loading = false;
					if(loginResult!=null){
						if(loginResult.readyState == 4 && loginResult.status == 0){
							this.showErrorMessage("网络异常！请检查网络是否可用！");
						}else if("undefined"!=typeof(loginResult.message) && loginResult.message!=null && loginResult.message.length>0){
							this.showErrorMessage(loginResult.message);
							if(loginResult.code == 'OAUTH-100'){
								this.showPwdTips();
								this.repeatPassword = true;
							}
						}else{
							this.showErrorMessage("认证失败！请检查用户名及密码是否正确！");
						}
					}else{
						this.showErrorMessage("认证错误，认证失败！");
					}
					return false;
				}
				this.saveLoginInfo(loginResult,"");
				
				}catch(e){
					this.loading = false;
					console.log(e);
					console.trace();
					this.showErrorMessage("认证调用失败！");
				}
			},
      handleLogin(){
        this.$refs.form.validate(async (valid) => {
        if(valid){
			//账号密码去空格
			let loops=0;
			while(this.form.username.indexOf(" ")>-1 && loops<20){
				this.form.username=this.form.username.replace(" ","");
				loops++;
			}
			this.form.password=this.form.password.trim();

			this.loading = true;
			let modulus="10001";
	    	let publicExponent="ca56aa9d90e438b659c4d8da8d586687eabe1ba7bd90463981ea5397aab90020387e0a541020eddaa746f982a30115c54b04d5d1f823345f8d16ebffe647c986be3692158fc08413854ab3123b48c9ff486b12905ab21dd2dcfbbab9a2afac89953d86582bd13392c8fbbba0795fb00ebfffe3b0eb6a9cc372ee84635984807f";
	    	let pubkey = new RSAUtils.getKeyPair(modulus,"",publicExponent);
			RSAUtils.setMaxDigits(130);
			let pwdRSA = RSAUtils.encryptedString(pubkey,this.form.password);
			let nameRSA = RSAUtils.encryptedString(pubkey,this.form.username);
			let mac=this.$store.getters.teacherComputerMac;
			console.log("mac:"+mac);
			let macRSA = "";
			if("undefined"!=typeof(mac) && mac!=null){
				macRSA=RSAUtils.encryptedString(pubkey,mac);
			}

            try{
			//登录认证
			let loginResult=await authLogin(nameRSA,pwdRSA,macRSA);
			console.log("密码登录结果");
			console.log(loginResult);
			if(loginResult==null || "string"!=typeof(loginResult.access_token)){
				//处理401无权限和断网情况
				this.loading = false;
				if(loginResult!=null){
					if(loginResult.readyState == 4 && loginResult.status == 0){
						this.showErrorMessage("网络异常！请检查网络是否可用！");
					}else if(loginResult.status == 401 && "undefined"!=typeof(loginResult.data.message) && loginResult.data.message!=null && loginResult.data.message.length>0){
						this.showErrorMessage(loginResult.data.message);
						if(loginResult.data.code == 'OAUTH-100'){
							this.showPwdTips();
							this.repeatPassword = true;
						}						
					}else{
						this.showErrorMessage("认证失败！请检查用户名及密码是否正确！");
					}
				}else{
					this.showErrorMessage("认证错误，认证失败！");
				}
				return false;
			}

			//记录历史用户
			let stpwd=(this.savePassword)?this.form.password:"";
			
			this.saveLoginInfo(loginResult,stpwd);
			  
            }catch(e){
				this.loading = false;
				console.log(e);
				console.trace();
                this.showErrorMessage("认证调用失败！");
            }
		}else{
		return false
		}
        })
	},
	async saveLoginInfo(loginResult,stpwd){
		//解析token
		let accessToken=loginResult.access_token;
		let jwtInfo=getJWTInfo(accessToken);
		if("2"!=jwtInfo.userinfo.usertype && "3"!=jwtInfo.userinfo.usertype){
			this.loading = false;
            this.showErrorMessage("用户角色错误，请用教师用户登陆！");
			return;
		}

		//写入sessionStrage共享token
		storageUtil.set(AUTH_TOKEN_NAME,encodeURIComponent(JSON.stringify(loginResult)));
		let login_time=new Date().getTime();//token获取时间
		storageUtil.set(AUTH_TIME_NAME,login_time);
		
		//根据认证结果获取用户信息
		this.$store.dispatch('setTeacherInfo', jwtInfo);
		let ssoAuthResponse = await getSsoGrantByUt();
		if(ssoAuthResponse.authFlg == 1){
		
		let nhisData={"name":ssoAuthResponse.user.truename,"inputname":this.form.username,"account":ssoAuthResponse.user.username,"pwd":stpwd,"photo":"/node/api/user/head_photo/"+ssoAuthResponse.user.username+"/100"};

		//插入或刷新当前用户
		userHistory.addHistoryData(this.historyDatas,nhisData);
		userHistory.saveHistoryData(this.historyDatas);
		/*历史用户结束 */
		
		setUt(jwtInfo.ut);
		
		//组装用户对象后,存入store
		let userObj = getUserInfoBySso(ssoAuthResponse)
		this.$store.dispatch('setTeacherInfo', userObj)
		try{
			__VAE__.login({"utm_uuid":userObj.teacherNumber,"usertype":2,"schoolid":userObj.schoolId,"platform":PV_SYS_CODE})
		}catch(e){
			console.log("统计方法异常！");
		}
		//写pcupconfig.txt&areacode=&schoolcode=
		saveAreaInfoFile(userObj.areaId,userObj.schoolId);

		//设置是授课登录还是预览 0授课，1预览
		setLoginStyle(0)
		//增加授课登录UB
		addUb('u_shoukelogin','授课端登录');
		this.$store.dispatch('setLoginStyle',0)
		this.$router.push({ path: '/main'})
		}else{
		this.showErrorMessage(ssoAuthResponse.authInfo)
		this.loading = false;               
		}
	},
			// 调用屏幕键盘
    handleKeyBoardCalled (fieldName, $input) {
		const windowWidth=document.body.clientWidth;//窗口宽
		const windowHeight=document.body.clientHeight//窗口高
		let oleft=0;//事件左边距
		
		if (fieldName === 'userName') {
			let Obj=document.getElementById("inputname");
  			for (var sumTop=0,sumLeft=0;Obj!=document.body;sumTop+=Obj.offsetTop,sumLeft+=Obj.offsetLeft, Obj=Obj.offsetParent);
  			oleft=sumLeft;
			//显示一个软键盘，屏蔽另一个
			this.showPwdKeyboard = false
			this.showUserNameKeyboard = true
		} else {
			let Obj=document.getElementById("inputpwd");
  			for (var sumTop=0,sumLeft=0;Obj!=document.body;sumTop+=Obj.offsetTop,sumLeft+=Obj.offsetLeft, Obj=Obj.offsetParent);
  			oleft=sumLeft;
			//显示一个软键盘，屏蔽另一个
			this.showUserNameKeyboard = false
			this.showPwdKeyboard = true
		}
		
      this.$nextTick(() => {
        const $loginForm = this.$el.querySelector('.ptLogin')
        const keyboarRefName = fieldName === 'userName' ? '$keyboardUserName' : '$keyboardPwd'
        const $keyboard = this.$refs[keyboarRefName].$el.querySelector('.keyboard')
		
		const keyboardWidth=710;//软键盘宽度
		const keyboardHeight=200;//软键盘高度
		const objwidth=430;//输入框宽度
		const objheight=70;//输入框高度
		//console.log($keyboard.innerHTML);
		let marginBotton=20;//距底边

		let marginLeft=oleft - ( (keyboardWidth-objwidth) / 2);
		//判断是否出窗口
		if(marginLeft+keyboardWidth>windowWidth){
			marginLeft=windowWidth-keyboardWidth-5;
		}
		if(windowHeight<800){
			marginBotton=10;
		}

        $keyboard.style.top = `${windowHeight-keyboardHeight-marginBotton}px`
		$keyboard.style.left = `${marginLeft}px`
		})
	},
	showErrorMessage(showMessage){
		this.$messageteach({type:"error",message:showMessage});
	}
    }
}
</script>

<style scope="true">
form{text-align:left}
.el-input__suffix{right:20px}
.el-input .el-input__clear{font-size:1rem}
</style>
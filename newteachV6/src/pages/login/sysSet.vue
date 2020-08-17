<template>
<div >
<YjNewteachVisibilityDialog 
		title = '密码验证'
		:visible="setDialogVisible"
		@close="setCancel"
		width="45vw" height="35vh"
		>
				<template v-slot>
					<div class="texth3">
						<el-input id="setPwd" ref="setPwdInput" lass="sn" prefix-icon="el-icon-lock" type="password" v-model="pwd" maxlength="6" @keyup.enter.native="setDialogOk" @focus="handleKeyBoardCalled('set', $event)" @click.native="handleKeyBoardCalled('set', $event)" ></el-input></div>
						<div class="texth6 versiondiv">
							<label>系统版本号：{{versionStr}}</label>
							<span>发布日期：{{versionTime}}</span>
						</div>
				</template>
				<div slot="footer">
						<yj-newteach-button size="small" @click="setCancel">取消</yj-newteach-button>
						<yj-newteach-button size="small" type="blue" @click="setDialogOk">确定</yj-newteach-button>
				</div>
</YjNewteachVisibilityDialog>
<Keyboard
    ref="$keyboardPwd"
      :elInput="$refs.setPwdInput" v-model="pwd" v-show="showPwdKeyboard" @bkClick="showPwdKeyboard = false" />
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { TEACH_PATH,VERSION,VERSION_TIME } from '@/api/constant'
import DialogNewteach from '@/components/DialogNewteach'
import Keyboard from '../../components/Keyboard'

  export default {
    name: 'setModle',
    components: {
		Keyboard
	},
	props: ['setDialogVisible'],//设置弹出框是否显示
    computed: {
        ...mapGetters([
						'password',
						'dialogFilter'
				])
    },
    data() {
      return {
		data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
		pwd:'',//用户输入密码
		tabIndex:0,//当前标签索引
		dialogVisible: false,
		input1: '',
		input2: '',
		tabPosition: 'right',
		versionStr:VERSION,
		versionTime:VERSION_TIME,
		showPwdKeyboard:false
      };
	},
	watch:{
		showArea(ifshow){
			if(ifshow){
				this.openArea();
			}
		},
		setDialogVisible(val){
			if(val){
				//this.$refs.pwdinput.$refs.focus()
				this.$nextTick(()=>{
					this.$refs.setPwdInput.focus()
				});
			}else{
				this.showPwdKeyboard=false;
			}
		}
	},
	 methods: {
			handleNodeClick(data) {
        		console.log(data);
			},
			//设置弹框关闭
			setCancel(){
				this.$emit('setClose',false)
				this.pwd = ''
			},
			setDialogOk(){
				if(this.pwd != this.password){
					this.$messageteach({type:"error",message:'密码错误'});
				}else{
					this.openArea();
				}	
			},
			//打开区域选择面板
			async openArea(){
				let confUrl=null;
				try{
					confUrl=VcomTeach.getCfgUrl();
				}catch(e){
					console.log(e,"获取地区配置地址失败！非客户端环境！");
				}
				if(confUrl!=null){
					console.log(confUrl);
					this.$emit('setClose',false)
					try{
						VcomTeach.openNewBrowser(confUrl,'xpos=-1&ypos=-1');//&width=800&height=600
					}catch(e){
						console.log(e,"打开地址配置页面失败！");
					}
				}
			},
			// 调用屏幕键盘
    handleKeyBoardCalled (fieldName, $input) {
		const windowWidth=document.body.clientWidth;//窗口宽
		const windowHeight=document.body.clientHeight//窗口高
		let oleft=0;//事件左边距
		oleft=windowWidth/2-200;
		//显示一个软键盘，屏蔽另一个
		this.showUserNameKeyboard = false
		this.showPwdKeyboard = true
		
      this.$nextTick(() => {
        const $loginForm = this.$el.querySelector('.ptLogin')
        const keyboarRefName = fieldName === 'userName' ? '$keyboardUserName' : '$keyboardPwd'
        const $keyboard = this.$refs[keyboarRefName].$el.querySelector('.keyboard')
		
		const keyboardWidth=710;//软键盘宽度
		const keyboardHeight=200;//软键盘高度
		const objwidth=430;//输入框宽度
		const objheight=70;//输入框高度
		//console.log($keyboard.innerHTML);
		let marginBotton=50;//距底边

		let marginLeft=oleft - ( (keyboardWidth-objwidth) / 2);
		//判断是否出窗口
		if(marginLeft+keyboardWidth>windowWidth){
			marginLeft=windowWidth-keyboardWidth-5;
		}
		if(windowHeight<800){
			marginBotton=20;
		}

        $keyboard.style.top = `${windowHeight-keyboardHeight-marginBotton}px`
		$keyboard.style.left = `${marginLeft}px`
		})
	}							
    },
		
  };

</script>

<style scoped>
.w60 {width: 60px;}
.img100{width:100%}

.line60{line-height: 60px;}
.pad10{padding: 10px;}
.el-button--text{color:#fff; display: block; width: 100%; height: 60px; font-size:1.1em;}
.yyList {font-size: 20px; color: #333;}
.text-center{text-align: center;}
button.yuan {width: 30px; height: 30px; background: url(../../assets/images/ico.png); border:0; margin:10px;}
button.yuan.left { background-position: -23px -231px; }
button.yuan.right { background-position: -65px -231px;}
button.yuan.left.cur {background-position: -104px -231px;}
button.yuan.right.cur {background-position: -146px -231px;}
button.yuan02 {width: 20px; height: 20px; background: url(../../assets/images/ico.png); background-position: -193px -237px;}
button.yuan02.cur {background-position: -222px -237px;}
.morebtn {background: #269bd7; color: #fff; padding: 10px; font-size: 1em;margin: 0; height: 3vh;}
.el-tag{margin: 5px; display: block;}
.fen2 {width: 50%; float:left;}
.overY {overflow-y: auto; height: 40vh;}
.clearfix {clear: both;}
.el-form-item {margin-bottom:5px;}
.formrow {margin: -20px -10px 20px; height: 85px; overflow-y: auto;}
.el-card__body {padding:10px 20px; margin-bottom: 20px;}
.dialog {margin-bottom: 0;}
.borderL {border-left: 4px solid rgb(38, 154, 215) !important;}
.textL {text-align: left;}
.el-tree-node__label{font-size: 1em;}
.mb20 {margin-bottom: 20px;}
.dressxz{background: #f5f7fa; height: 50vh; overflow-y:auto; padding:1vh; text-align: left; border:solid 1px #efefef;}
.dressxz button,.dressxz02 button {margin-bottom: 1vh; margin-left:0!important;}
.dressxz02{background: #f5f7fa; height: 24vh; overflow-y:auto; padding: 1vh; text-align: left; border:solid 1px #efefef; margin-bottom: 2vh;}
.versiondiv{margin-top:3vh}
</style>
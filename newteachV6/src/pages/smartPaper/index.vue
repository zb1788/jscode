<template>
<div class="ljzt">
	<div class="ljtop" style="padding: 0 2vh;">
		<span>状态查看</span>
		<label style="float:right;" v-if="isStart">搜索到的设备数：<font style="color:red;">{{searchDevArr.length}}</font></label>
	</div>
	<div class="ljmiddle" style="overflow-y: auto; padding:1vh 1vw">
		<yj-newteach-group	
		 v-model="checkList" 
		 :show-checkbox="showCheckbox"
		>
			<yj-newteach-group-option :class="!isShowLeft?'group-option-width':''"
			:label="stu.studentNumber"
			v-for="stu in studentList" :key="stu.studentNumber"
			:style-theme="stu.styleTheme"
			:disabled="stu.disabled"
			>
			<template slot="left" v-if="isShowLeft && smartPaperBindType == 2"><span class="smartsold">{{stu.bindNum}}</span></template>
			<template slot="left" v-if="isShowLeft && smartPaperBindType == 1 && stu.smartPaperGetNumber != ''"><span class="smartsold">{{stu.smartPaperGetNumber}}</span></template>
			
			{{stu.realname}}
			</yj-newteach-group-option>
		</yj-newteach-group>
	</div>
	<div class="ljbottom">
		<div class="ztcard">
			<!-- <label>搜索到的设备数：<font style="color:red;">{{searchDevArr.length}}</font></label> -->
			<span v-for="(item,index) in statusCountArr.filter(item=>item.isShow == true)" :key="index" >
				<i :class="item.icon"></i>{{item.name}}({{item.num}})
			</span>
		</div>
		<div class="h6vh">
	  	<el-button type="primary" v-if="!isStart&&smartPaperBindType==2" @click="startBind">开始绑定</el-button>
		<el-button type="primary" v-if="showCheckbox" @click="changePaper">更换学生书写板</el-button>
		<el-button type="primary" v-if="userType == 3&&!isStart" @click="changePaperMode">切换绑定模式</el-button>
		<el-button type="primary" v-if="userType == 3&&smartPaperBindType==1" @click="goNumperPage">进入书写板编号</el-button>
		<button class="closebtn" @click="closePage"><i class="el-icon-close" ></i></button>
		</div>
	</div>

    <YjNewteachVisibilityDialog title = '替换设备' width="50%"  :visible.sync="changeSmartPaperVisible">
		<yj-newteach-radio-group v-model="paperBackCheckRadio" style="padding:1vh;">
			<yj-newteach-radio v-for="(item,index) in smartPapersBackup" :label="item.smartPaperMac" :key="index">{{item.smartPaperNumber}}</yj-newteach-radio>
		</yj-newteach-radio-group>	
      <div>
        <div>
          <slot name="tips"></slot>
        </div>
        <div class="tcenter">
			  <el-button type="primary" @click="doChangeSmartPaper">替 换</el-button>
              <el-button type="primary" @click="changeSmartPaperCancel">关 闭</el-button>             
        </div>
      </div>           
    </YjNewteachVisibilityDialog>	


    <YjNewteachVisibilityDialog width="40%" title = '切换绑定模式'  :visible.sync="changeSmartPaperBindTypeVisible">
		<div style="padding:2vh 2vh;">
		<yj-newteach-radio-group v-model="paperBindTypeCheckRadio">
			<yj-newteach-radio  :label="1" >序号绑定</yj-newteach-radio>
			<yj-newteach-radio  :label="2" >字母绑定</yj-newteach-radio>
		</yj-newteach-radio-group>	
		</div>
      <div>
        <div>
          <slot name="tips"></slot>
        </div>
        <div class="tcenter">
			  <el-button type="primary" @click="doChangeSmartPaperType">切 换</el-button>
              <el-button type="primary" @click="changeSmartPaperTypeCancel">关 闭</el-button>              
        </div>
      </div>           
    </YjNewteachVisibilityDialog>	 
</div>

</template>

<script>
import { mapGetters } from 'vuex'
import BannerNewteach from '@/components/BannerNewteach'
import TabsNewteach from '@/components/TabsNewteachs'
import PageNewteach from '@/components/PageNewteach'
import DialogNewteach from '@/components/DialogNewteach'
import { yjNewteachRadioGroup,yjNewteachRadio} from 'newteach-ui'
import { getJxfxSubject, getJxfxWkData, getJxfxXunlianData, getJxfxRes, formatJxfxRes} from '@/api/jxfx'
import { getPadVersion, exchangeSmartPaperOrder,getStudentListByClassNew,changeSmartPaperBindTypeApi } from '@/api/interface'
import { getStudentListByClassData ,setWhiteMac ,OnGetOnlineMacs,OnGetKeys,checkStatus} from '@/api/smartPaper'
import storage from '@/utils/storage'
import commonUtils from '@/utils/common'
import {TLS_RESET_WHITE_MAC} from '@/api/constant'
export default {
	components:{
		DialogNewteach,
		yjNewteachRadioGroup,
		yjNewteachRadio		
  	},
    data(){
        return{
					type:'',//当前状态
					ut:'',
					classId:'',//班级ID
                    studentList: [],//学生名单
                    studentIndex:new Map(),//学生索引数组（根据学生帐号获取学生索引）
                    studentByKey:[],//学生字母跟账号的对应关系
                    OnlineMacArr:[],//在线平板mac
                    macIndex:{}, //mac在studentListArr中的位置
                    smartPaperBindType: 0, //当前绑定模式1 按号领取  2 绑定用户
                    smartPapersBackup:[],
                    userType:'',//用户类型 2 教师 4 学生 0 家长 3 管理员
                    baseKeyArr:[],//基础字母
                    paperKeyArray:["A","B","C","D","E","F","G"],//基础字母(手写板上的按键)
					isStart:false,//是否点击开始绑定按钮
					macChange:false, //是否更新mac
					schoolId:'', //学校ID 控件获取
					teacherComputerMac:'',//教学机mac 控件获取
					showCheckbox: false,//是否可选
					checkList:[],//当前选中的学生
					statusCountArr: [
								{id:10,name:'已连接','icon':'online',isShow:true,num:0},
								{id:1,name:'未连接','icon':'bGray',isShow:true,num:0},
								{id:3,name:'未绑定','icon':'unbind',isShow:true,num:0}],
					isShowLeft:false,
					changeSmartPaperVisible:false,//是否展示替换设备弹窗
					paperBackCheckRadio:'',//替换板子选中值
					changeSmartPaperBindTypeVisible:false,//是否展示切换模式弹窗
					paperBindTypeCheckRadio:0,//当前选择的绑定模式
					searchDevArr:[],//搜索到的设备

        		}
		},
		mounted(){
			if(storage.get(TLS_RESET_WHITE_MAC) == 'null'){
				storage.set(TLS_RESET_WHITE_MAC,0)
			}		
			try{
				//获取教学机MAC
				 this.teacherComputerMac = VcomMacIp.GetMacInfo()
				 let loginInfo = VcomTeach.getLoginInfo()
				 let loginObj = JSON.parse(loginInfo)
				 this.classId = loginObj.classId
				 this.schoolId = loginObj.schoolId
				 this.ut = loginObj.ssout
				 this.userType = loginObj.userType		
				 this.userType = 3 //测试用
			}catch(e){
				this.teacherComputerMac = '6C-4B-90-78-9B-E7'
				this.classId = '150174041245814936'
				this.teachernumber = '41010100010128'
				this.userType = 3
			}

			//初始化学生信息	
			this.init()			
			//绑定回调在线状态
			OnGetOnlineMacs(this)
			//绑定回调按键信息
			OnGetKeys(this)
			
		},
		destroyed(){
			try{
				VcomTeach.unbindEvent('PaperGetKeys')
				VcomTeach.unbindEvent('PaperGetOnlineMacs')
			}catch(e){

			}
		},		
		watch:{
			checkList(val){
				if(val.length > 1){
					this.checkList.shift()
				}
			}
		},
		computed: {
		},
		methods:{
			async init(){
				//获取学生名单
				try{
					await getStudentListByClassData(this)
				}catch(e){
					console.log('获取学生名单异常')
				}
				
				//1 按号领取  2 绑定用户
				console.log('绑定模式:'+this.smartPaperBindType)
				if(this.smartPaperBindType == 1){
					//序号绑定
					this.showCheckbox = true					
				}

				//切换绑定模式后重新设置白名单
				if(storage.get(TLS_RESET_WHITE_MAC) == 1){
					setWhiteMac(this.macIndex)
				}


				commonUtils.console('开启在线状态查看:VcomPaper.SetOnlineMacs()');
				try{
					VcomPaper.SetOnlineMacs();
				}catch(e){}
			},
			//开始绑定
			startBind(){				
				storage.set(TLS_RESET_WHITE_MAC,1)
				//可以展示左侧字母
				this.isShowLeft = true
				//把未绑定的改为未连接
				let self = this
				for(let [index,item] of this.studentList.entries()){
					if(item.styleTheme == 'cur'){
						self.studentList[index].styleTheme = ''
					}		
				}
				
				checkStatus(this)
				//调用start
				this.isStart = true
				//开始绑定后不显示未绑定按钮
				this.statusCountArr[2].isShow = false
				try{
					//关闭白名单
					VcomPaper.CloseWhiteCard()
					//start
					VcomPaper.Start()
					console.log("VcomPaper.CloseWhiteCard")
					console.log("VcomPaper.Start()")
				}catch (e) {
					console.log("关闭白名单失败")
					console.log(e)
				}
			},
			/**
			 * 调用替换纸笔设备接口
			 * @param {*} smartPaperNumberFrom 原有的编号
 			 * @param {*} smartPaperNumberTo 要替换的编号
			 * @param {*} studentNumberNow 当前学生id
			 * @param {*} smartChangeMac 新要换的mac
			 */
			async exchangeDevice(smartPaperNumberFrom,smartPaperNumberTo,studentNumberNow,smartChangeMac){
				let self = this
				let result = await exchangeSmartPaperOrder(smartPaperNumberFrom,smartPaperNumberTo,this.schoolId,this.teacherComputerMac,this.ut)
				if(result.bindResult != 0){
					//删除老的mac
					console.log(self.studentList[self.studentIndex.get(studentNumberNow)])
					delete self.macIndex['"'+self.studentList[self.studentIndex.get(studentNumberNow)].smartPaperMac+'"']
					//给用户赋值新的mac
					self.studentList[self.studentIndex.get(studentNumberNow)].smartPaperMac = smartChangeMac
					//给用户赋值新的序号
					self.studentList[self.studentIndex.get(studentNumberNow)].smartPaperGetNumber = smartPaperNumberTo
					//设置用户当前状态下线
					self.studentList[self.studentIndex.get(studentNumberNow)].styleTheme= ''
					//给macIndex增加新的mac
					self.macIndex['"'+smartChangeMac+'"'] = self.studentIndex.get(studentNumberNow);

					//重新获取手写版备用mac接口
					let resultBack = await getStudentListByClassNew(self.classId,self.teacherComputerMac,1)
					self.smartPapersBackup = resultBack.data.smartPapersBackup

					//设置白名单
					setWhiteMac(self.macIndex)
					storage.set(TLS_RESET_WHITE_MAC,1)
					self.changeSmartPaperVisible = false
				}else{
					self.$messageteach.error(result.bindResultInfo)
				}
			},
			//关闭页面
			closePage(){
				if(this.isStart){
					//只要点击开始绑定，关闭的时候就要设置白名单，为了把连接上的未绑定的设备断掉
					setWhiteMac(this.macIndex)
				}
				if(storage.get(TLS_RESET_WHITE_MAC) == 1){
					//更新数据库
					VcomTeach.pageForwarding('updatedb','')
				}			
				VcomPaper.Stop()
				storage.set(TLS_RESET_WHITE_MAC,0)
				window.close()			
			},
			//替换板子
			changePaper(){
				if(this.checkList.length == 0){
					this.$messageteach.error('请先选择要更换设备的学生')
					return false
				}
				if(this.smartPapersBackup.length == 0){
					this.$messageteach.error('暂无备用设备')
					return false
				}

				let fromArr = this.studentList.filter(item => item.studentNumber == this.checkList[0])
				if(fromArr[0].smartPaperGetNumber == ''){
					this.$messageteach.error('选择更换设备的学生必须有号')
					return false					
				}
				//展示弹窗
				this.changeSmartPaperVisible = true
				//第一个选中
				this.paperBackCheckRadio = this.smartPapersBackup[0].smartPaperMac
			},
			//替换设备
			doChangeSmartPaper(){
				let arr = this.smartPapersBackup.filter(item => item.smartPaperMac == this.paperBackCheckRadio)				
				let smartPaperNumberTo = arr[0].smartPaperNumber //目标板子编号
				let smartChangeMac = arr[0].smartPaperMac //目标板子mac

				//获取原有板子信息
				let fromArr = this.studentList.filter(item => item.studentNumber == this.checkList[0])
				this.exchangeDevice(fromArr[0].smartPaperGetNumber,smartPaperNumberTo,this.checkList[0],smartChangeMac)
			},
			//关闭替换设备弹窗
			changeSmartPaperCancel(){
				this.changeSmartPaperVisible = false
			},
			//打开绑定模式弹窗
			changePaperMode(){
				this.paperBindTypeCheckRadio = this.smartPaperBindType
				this.changeSmartPaperBindTypeVisible = true				
			},
			//点击切换模式按钮
			async doChangeSmartPaperType(){
				if(this.paperBindTypeCheckRadio != this.smartPaperBindType){
					let result = await changeSmartPaperBindTypeApi(this.paperBindTypeCheckRadio,this.schoolId,this.teacherComputerMac,this.ut)
					//判断是否能切换到序号绑定
					if(result.bindResult != 0){
						storage.set(TLS_RESET_WHITE_MAC,1)
						window.location.reload()
					}else{
						this.$messageteach.error(result.bindResultInfo)
						return false
					}					
				}	
				this.changeSmartPaperBindTypeVisible = false			
			},
			//关闭切换绑定模式弹窗
			changeSmartPaperTypeCancel(){
				this.changeSmartPaperBindTypeVisible = false
			},
			//进入序号绑定页面
			goNumperPage(){
				this.$router.push({path:'/smartPaper/manager'})
			}

		}

}
</script>

<style scoped>
.ztcard span i{display: inline-block;width: 15px;height: 15px;margin: 0 5px;}
.unbind{background-color: #ff6c6c !important;}
.bGray{background-color: #ddd !important;}
.online{background-color: #409EFF !important;}
.ljzt{height: 100%; display: flex; flex-direction: column;}
.ljtop {height:6vh; line-height: 6vh; background: #fafafa;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); text-align: left;}
.ljbottom{background: #efefef;}
.ljmiddle {flex:1;}
.ztcard {box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); padding: 2vh;text-align: left; background: #fff;    margin-bottom: 1vh;}
.ztcard label {float: right;}
.ztcard span {margin: 0 1vh; vertical-align: middle;}

.closebtn {background: linear-gradient(180deg,#f95353 0%,#e04a4a 100%); border-radius: 50%; border: 0;color: #fff; height: 5vh; width: 5vh; text-align: center; line-height: 5vh; font-size: 1.5rem; position: absolute;right:1.5vh; bottom:1.5vh;}
.namelist{text-align: left;}
.namelist li {display: inline-block; border: solid 1px #ddd; padding: 1vh 2vh; margin:0.5vh; background: #fafafa; color: #666; border-radius: 5px;}
.namelist li em {font-weight: bold; border-right: 2px solid #999; padding-right: 1vh; font-style: normal; display: inline-block;}
.namelist li span {padding-left: 1vh; display: inline-block; max-width: 12vh; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; vertical-align: middle;}
.namelist li.no{background:#409EFF; border-color:#2a92fd; color: #fff;}
.namelist li.no em {border-color: #fff; text-shadow: 1px 1px 5px #1c548d;}
.namelist li.cur {background: #F56C6C; border-color: #ed6161; color: #fff;}
.namelist li.cur em {border-color: #fff; text-shadow:1px 1px 5px #c74343}
.colorbox {display: inline-block; width: 2vh; height: 2vh; vertical-align: middle; margin-right: 1vh; margin-top: -3px;}
.colorbox.b {background: #409EFF;border:solid 1px #2a92fd;}
.colorbox.r {background: #f95353;border:solid 1px #e04a4a;}
.colorbox.g {background: #efefef; border:solid 1px #ddd;}
.smartsold{    vertical-align: middle;
    padding: 0 0.2rem;
    line-height: 1.6rem;
    font-weight: bold;
    font-size: 1.2rem;}
	.group-option-width{width:5rem;}

</style>

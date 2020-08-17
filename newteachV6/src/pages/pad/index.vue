<template>
<div class="ljzt">
	<div class="ljtop" v-if="(type=='sendToPad'||type == 'yuxizuoda') && isShowDownloadIng">
		<el-row  style="margin:0;">
			<el-col :span="4"><div>作答情况</div></el-col>
			<el-col :span="6" :offset="14"><div></div>正在下载到授课端<img class="tl-img" src="@/assets/pad/downloading.gif"></el-col>
		</el-row>
	</div>
	<div v-if="type=='sign'||type=='finishClass'">
		<yj-newteach-alert
    title="平板互动课堂已开启，请学生按照以下方式连接到平板互动课堂。"
    type="info"
    description="1.连接本教室wifi，2.使用学生账号登录学生平板，3.请学生平板升级至最新版本。"
		:closable="false"
    show-icon >
  </yj-newteach-alert>
	</div>
	<div v-if="type=='discuss'">
		<yj-newteach-alert
    type="info"
		:closable="false"
    show-icon >
		小组讨论已开启，学生新建小组或已加入的小组进行讨论。<b style="font-size:1.5em;">讨论时间：<span style="color:red;">{{nowTime}}</span></b>
  	</yj-newteach-alert>		
	</div>
	<div v-if="type=='share'">
		<yj-newteach-alert
    type="info"
		:closable="false"
    show-icon >
		请点击学生姓名，查看学生的分享内容
  	</yj-newteach-alert>				
	</div>	
	<div v-if="type=='studentScreen'">
		<yj-newteach-alert type="info" show-icon  :closable="false">请点击学生姓名，将学生平板屏幕投放到授课端大屏，选择多个学生，可进行对比查看！</yj-newteach-alert>
	</div>		
	<div v-if="type=='classkq'||type=='classkqCard'||type=='classkqMix'">
		<yj-newteach-alert type="info" show-icon :closable="false">平板考勤：链接成功，完成考勤。答题卡：提交（任意键+答题），完成考勤。 </yj-newteach-alert>
	</div>


	<div class="ljmiddle" style="overflow-y:auto;">
		<yj-newteach-group
		v-if="type=='sign'||
		type=='finishClass'||
		type=='classkq'||
		type=='classkqCard'||
		type=='classkqMix'||
		type=='studentScreen'||
		type=='yuxizuoda'||
		type=='sendToPad'||
		(type=='discuss'&&discussData.activeIndex==0)||
		(type=='share'&&shareData.activeIndex==0)"		
		 v-model="checkList" 
		 :show-checkbox="showCheckbox"
		>
			<template v-if="type=='classkq'||type=='classkqCard'||type=='classkqMix'">
				<yj-newteach-group-option 
				:label="stu.studentNumber"
				v-for="stu in studentListKq" :key="stu.studentNumber"
				:style-theme="stu.styleTheme"
				:icon="stu.icon"
				:sub-icon="stu.lock"
				:disabled="stu.disabled"
				>
				{{stu.realname}}
				</yj-newteach-group-option>
			</template>
			<template v-else>
				<yj-newteach-group-option 
				:label="stu.studentNumber"
				v-for="(stu,index) in studentList" :key="stu.studentNumber"
				:style-theme="stu.styleTheme"
				:icon="stu.icon"
				:sub-icon="stu.lock"
				:disabled="stu.disabled"
				@click="studentClick(index)"
				>
				{{stu.realname}}
				</yj-newteach-group-option>
			</template>
		</yj-newteach-group>

		 <!-- 成果分享分组信息 -->
		 <template v-if="type=='share'&&shareData.activeIndex==1">
			<el-row :gutter="24" v-rowRemovePadding>
				<el-col :span="6"  v-for="(item,index) in shareGroupList1" :key="index">
					<yjNewteachCard :class="[item.shareOk?'hblue':'','box-card']">
							<div slot="header" @click="shareUserClick(item)">
								<span>{{item.groupName}}</span>
							</div>
							<div class="text item" @click="shareUserClick(item)">
								<font>组长：{{item.studentName}}</font>
							</div>
					</yjNewteachCard>
				</el-col>				
			</el-row>
			<el-row :gutter="24" v-rowRemovePadding>
				<el-col :span="6"  v-for="(item,index) in shareGroupList2" :key="index">
					<yjNewteachCard >
							<div slot="header">
								<span>{{item.groupName}}</span>
							</div>
							<div class="text item">
								<font>组长：{{item.studentName}}</font>
							</div>
					</yjNewteachCard>
				</el-col>					
			</el-row>
		 </template>			 
		 <!-- <yj-newteach-group v-if="type=='share'&&shareData.activeIndex==1">
      <yj-newteach-group-item v-for="item in groupList" :key="item.classGroupId" :group-key="item.classGroupId">
        <span>{{item.classGroupName}}</span>
        <yj-newteach-group-option :label="item.studentName"></yj-newteach-group-option>
      </yj-newteach-group-item>
    </yj-newteach-group> -->

		 <!-- 小组讨论分组信息 -->	
		 <template v-if="type=='discuss'&&discussData.activeIndex==1">
			 <yjNewteachStudentGroup layout="customIcon" :data="groupListBase" ></yjNewteachStudentGroup>
		 </template>			
	</div>
	<div class="ljbottom">
			<yj-newteach-menu v-if="type=='classkq'||type=='classkqCard'||type=='classkqMix'" :default-active="classKqData.activeIndex" class="el-menu-demo" mode="horizontal" @select="classKqHandleSelect">
				<yj-newteach-menu-item index="0">出勤（{{chuqinNum}}）</yj-newteach-menu-item>
				<yj-newteach-menu-item index="1">迟到（{{chidaoNum}}）</yj-newteach-menu-item>
				<yj-newteach-menu-item index="2">请假（{{qingjiaNum}}）</yj-newteach-menu-item>
				<yj-newteach-menu-item index="3">旷课（{{kuangkeNum}}）</yj-newteach-menu-item>
				<yj-newteach-menu-item index="4">未点名（{{weidianmingNum}}）</yj-newteach-menu-item>
			</yj-newteach-menu>
			<!-- <yj-newteach-menu v-if="type=='discuss'" :default-active="discussData.activeIndex" class="el-menu-demo" mode="horizontal" @select="discussHandleSelect">
				<yj-newteach-menu-item v-for="item in discussData.list" :key="item.id" :index="item.id" :disabled="item.disabled">{{item.name}}</yj-newteach-menu-item>
			</yj-newteach-menu>	 -->
			<yj-newteach-menu v-if="type=='share'" :default-active="shareData.activeIndex" class="el-menu-demo" mode="horizontal" @select="shareHandleSelect">
				<yj-newteach-menu-item v-for="item in shareData.list" :key="item.id" :index="item.id">{{item.name}}</yj-newteach-menu-item>
			</yj-newteach-menu>							
		<div class="ztcard" >

			<label v-if="type=='sign'||type=='finishClass'">已连接：<font style="color:red;">{{onlineNum}}</font>/{{studentList.length}}</label>
			<span v-for="(item,index) in statusCountArr.filter(item => item.isShow == true)" :key="index" ><i style="background-color:#666;" :class="item.icon"></i>{{item.name}}({{item.num}})</span>
			<label v-if="type=='discuss' && discussData.activeIndex == 1">班级共{{studentList.length}}人,还有{{notInGroupNum}}人未加入分组</label>
		</div>
				
	  <el-button v-if="type=='sign'" type="primary" @click="startClass">点名结束，开始上课！</el-button>
		<YjNewteachCheckbox v-if="type=='finishClass'||type=='classkq'||type=='classkqCard'||type=='classkqMix'" :indeterminate="isIndeterminate"  v-model="checked" @change="checkAll">全选</YjNewteachCheckbox>
		<el-button v-if="type=='finishClass'" type="warning" @click="lock">锁屏</el-button>
		<el-button v-if="type=='finishClass'" type="success" @click="unlock">解锁</el-button>
		<el-button v-if="type=='finishClass'" type="primary" @click="finishClass">下课，平板解锁</el-button>
		<el-button v-if="type=='finishClass' && powerOffBtn==true" type="danger" @click="padPowerOff">平板关机</el-button>
		<el-button v-if="type=='classkq'||type=='classkqCard'||type=='classkqMix'" type="primary" @click="chuqin">出勤</el-button>
		<el-button v-if="type=='classkq'||type=='classkqCard'||type=='classkqMix'" type="warning" @click="chidao">迟到</el-button>
		<el-button v-if="type=='classkq'||type=='classkqCard'||type=='classkqMix'" type="info" @click="qingjia">请假</el-button>
		<el-button v-if="type=='classkq'||type=='classkqCard'||type=='classkqMix'" type="danger" @click="kuangke">旷课</el-button>
		<el-button v-if="type=='share'" type="primary" @click="shareStop">停止分享</el-button>
		<el-button v-if="type=='discuss'&&discussData.activeIndex==0&&!discussData.isStart" type="primary" @click="startDiscuss1">开始讨论</el-button>
		<el-button v-if="type=='discuss'&&discussData.activeIndex==0&&discussData.isStart" type="primary" @click="closeDiscuss1">结束讨论</el-button>
		<el-button v-if="type=='discuss'&&discussData.activeIndex==1&&!discussData.isStart&&!discussData.isStartGroup" type="primary" @click="startDiscuss2">开始讨论</el-button>
		<el-button v-if="type=='discuss'&&discussData.activeIndex==1&&!discussData.isStart&&!discussData.isStartGroup" type="primary" @click="changeDiscussGroup">调整分组</el-button>
		<el-button v-if="type=='discuss'&&discussData.activeIndex==1&&!discussData.isStart&&discussData.isStartGroup" type="primary" @click="saveDiscussGroup">保存分组</el-button>
		<el-button v-if="type=='discuss'&&discussData.activeIndex==1&&discussData.isStart" type="primary" @click="closeDiscuss2">结束讨论</el-button>
		
		<el-button v-if="type=='studentScreen'" type="primary" @click="Screening">投屏</el-button>
		<el-button v-if="type=='yuxizuoda'" type="primary" @click="yuxizuodaHandle">探究结束，查看反馈</el-button>
		<el-button v-if="type=='sendToPad'" :disabled="isUsed" type="primary" @click="sendpadHandle">答题结束 查看结果</el-button>
		<el-button v-if="type=='classkq'||type=='classkqCard'||type=='classkqMix'" type="primary" @click="classkqClose">点名结束</el-button>
		<!-- <el-button @click="test">test</el-button> -->
		<button v-if="type=='sign'||type=='finishClass'||type=='discuss'||type=='studentScreen'" class="closebtn" @click="closePage"><i class="el-icon-close" ></i></button>
	</div>
	<div v-if="ntype == 10">
		下载到授课端成功！<img class="tl-img" src="ok.png">
	</div>
	<div v-if="ntype == 12">
		下载到授课端失败!<img class="tl-img" src="fail.png">
	</div>	

</div>

</template>

<script>
import { mapGetters } from 'vuex'
import BannerNewteach from '@/components/BannerNewteach'
import PageNewteach from '@/components/PageNewteach'
import DialogNewteach from '@/components/DialogNewteach'
import { yjNewteachAlert} from 'newteach-ui'
import { getPadVersion,saveClassGroupApi,addKaoQinApi } from '@/api/interface'
import { getStudentListByClassData,OnGetStatus,OnGetResults,onGetKeys,OnGetLockInfo,onGetKeysByAnswer  } from '@/api/pad'
import { getStudentGroupData } from '@/api/kqyx'
import commonUtils from '@/utils/common'
import {AUTH_TOKEN_NAME,AUTH_UT_NAME,DOWNLOAD_URL,KQYX_PAPER_ID,KQYX_RS_TYPE} from '@/api/constant'
import storage from '@/utils/storage'
import '@/assets/pad/pad.css'
import { getComputerClassInfo} from '@/api/client'
let Base64 = require('js-base64').Base64;
export default {
	name:'pad',
	  components:{
			yjNewteachAlert
  	},
    data(){
        return{		
					checkList:[],//当前选中的学生
					checked:false,//当前全选按钮是否选中
					isIndeterminate:false,//indeterminate 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效
					type:'',//当前状态
					classId:'',//班级ID
					classType:'',
					teachernumber:'',//教师账号
					teachername:'',//教师姓名
					teacherComputerMac:'',//教学机mac 控件获取
					studentList: [],//学生名单
					studentIndex:{},//学生索引数组（根据学生帐号获取学生索引）
					studentNumberList:[],//学生帐号数组
					screenStuids:[],//投票学生列表（a,b）
					groupList:[],//分组信息
					groupListBase:[],//分组原始信息
					ntype:'',//0,未连接;1,正在下载;3,下载失败；4,正在作答;7,正在分享,8,正在讨论,10,已连接;13,未升级;91,作答完成;92,分享完成;11,下载到授课端成功(用msgBox);12,下载到授课端失败(用msgBox);
          isFirstSend: true,//是否第一次回调（ntype为13的第一次回调）
					lockVisible:false,//是否显示锁屏
					lockFlag:true,//是否更新锁屏状态
					showCheckbox: false,//是否可选
					kqArr: [{id:1,name:'出勤'},{id:2,name:'迟到'},{id:3,name:'请假'},{id:4,name:'旷课'},{id:0,name:'未点名'}],
					statusCountArr: [{id:0,name:'未连接到课堂','icon':'not',isShow:false,num:0},
													{id:13,name:'已连接','icon':'linked',isShow:false,num:0},
													{id:1,name:'正在下载','icon':'download',isShow:false,num:0},
													{id:2,name:'下载完成','icon':'download',isShow:false,num:0},
													{id:3,name:'下载失败','icon':'warning',isShow:false,num:0},
													{id:4,name:'正在作答','icon':'brush',isShow:false,num:0},
													{id:9,name:'作答完成','icon':'right',isShow:false,num:0},
													{id:8,name:'正在讨论','icon':'news',isShow:false,num:0},
													{id:7,name:'正在分享','icon':'share',isShow:false,num:0},
													{id:92,name:'分享完成','icon':'right',isShow:false,num:0},
													{id:90,name:'未升级','icon':'upload',isShow:false,num:0}],
					powerOffBtn:false,//是否显示一键关机按钮
					padLimitVersion:'',//pad最低版本限制
					timer:'',//定时器
					timeVal:0,//时间(秒)
					classKqData:{
						activeIndex:"4"
					},
					discussData:{//讨论相关数据
						// list:[{id:"0",name:'学生自由创建讨论组',disabled:false},{id:"1",name:'教师推荐小组',disabled:false}],
						list:[{id:"1",name:'教师推荐小组',disabled:false}],
						activeIndex:"1",
						groupKey:[],
						isStart:false,//是否开始讨论
						isStartGroup:false,//是否开始调整分组
					},
					shareData:{//分享相关数据
						stopButton:true,//是否显示停止分享按钮
						list:[{id:"0",name:'按学生查看'},{id:"1",name:'按组查看'}],
						activeIndex:"0",
						shareOkArr:[],
						shareIngArr:[],//正在分享的学生
					},
					isUsed:true,//是否可以点击按钮
					notifyInstance:'',//警告框实例
					isShowDownloadIng:false//是否展示正在下载提示
        }
		},
		watch:{
			//根据选中的数量判断是全选/部分选择/未选
			checkList(val){
				let checkedCount = val.length
				let totalNum = 0
				if(this.type == 'classkq'||this.type == 'classkqCard'||this.type=='classkqMix'){
					totalNum = this.studentListKq.length
				}else if(this.type == 'sign'||this.type == 'finishClass'){
					let arr = []
					let onLineArr = this.studentList.filter(item => item.offline == false)
					for(let item of onLineArr){
						arr.push(item.studentNumber)
					}
					totalNum = arr.length
				}

				
				this.checked = checkedCount === totalNum
				this.isIndeterminate = checkedCount > 0 && checkedCount < totalNum
			}
		},
		mounted(){
			this.type = this.$route.query.type
			console.log(this.type)
			//判断展示哪些状态项(未连接，已连接，未升级等)
			if(this.type == 'sign'||this.type == 'finishClass'){
				this.statusCountArr[0].isShow = true
				this.statusCountArr[1].isShow = true
				this.statusCountArr[10].isShow = true
			}else if(this.type == 'share'){
				this.statusCountArr[0].isShow = true
				this.statusCountArr[1].isShow = true
				this.statusCountArr[8].isShow = true
				this.statusCountArr[9].isShow = true
			}else if(this.type == 'discuss'){
				this.statusCountArr[0].isShow = true
				this.statusCountArr[1].isShow = true
				this.statusCountArr[7].isShow = true

				this.discussData.groupKey['A'] = 1;
				this.discussData.groupKey['B'] = 2;
				this.discussData.groupKey['C'] = 3;
				this.discussData.groupKey['D'] = 4;
				this.discussData.groupKey['E'] = 5;
				this.discussData.groupKey['F'] = 6;
				this.discussData.groupKey['G'] = 7;
				this.discussData.groupKey['H'] = 8;
			}else if(this.type == 'studentScreen'){
				this.statusCountArr[0].isShow = true
				this.statusCountArr[1].isShow = true
			}else if(this.type == 'yuxizuoda'){
				//课前预习试卷的发起探究
				this.statusCountArr[0].isShow = true
				this.statusCountArr[2].isShow = true
				// this.statusCountArr[3].isShow = true
				this.statusCountArr[4].isShow = true
				this.statusCountArr[5].isShow = true
				this.statusCountArr[6].isShow = true
			}else if(this.type == 'sendToPad'){
				//训练发送平板
				this.statusCountArr[0].isShow = true
				this.statusCountArr[2].isShow = true
				// this.statusCountArr[3].isShow = true
				this.statusCountArr[4].isShow = true
				this.statusCountArr[5].isShow = true
				this.statusCountArr[6].isShow = true
				let self = this;
				setTimeout(()=>{self.isUsed = false;},5000)
			}
			//判断是否展示checkbox
			if(this.type == 'finishClass'||this.type == 'classkq'||this.type == 'classkqCard'||this.type=='classkqMix'||this.type == 'studentScreen'){
				this.showCheckbox = true
			}

			try{
				//获取教学机MAC
				this.teacherComputerMac = VcomMacIp.GetMacInfo()
				let loginInfo = VcomTeach.getLoginInfo()
				let loginObj = JSON.parse(loginInfo)
				// console.log('登录串')
				this.classId = loginObj.classId
				this.classType = loginObj.classType
				this.teachernumber = loginObj.teachernumber			
				this.teachername = decodeURIComponent(decodeURIComponent(decodeURIComponent(loginObj.teachername)))
			}catch(e){
				this.classId = '153386908359468061'
				// this.classId = '150174041245814936'
				this.teachernumber = '41010100010128'
				this.teacherComputerMac = '6C-4B-90-78-9B-E7'
			}


			//绑定事件
			try{
				if(this.type == 'classkqCard'){
					console.log("答题器专用")
					onGetKeysByAnswer(this)
				}else if(this.type == 'classkqMix'){
					console.log("考勤混用专用")
					onGetKeysByAnswer(this)
					OnGetStatus(this)
				}else{
					OnGetStatus(this)
					OnGetResults(this)
					onGetKeys(this)
					OnGetLockInfo(this)
				}
			}catch(e){

			}
			this.init()			
		},
		destroyed(){
			try{
				if(self.type == 'classkqCard'){
					VcomTeach.unbindEvent('AnswerGetKeys')
				}else if(self.type == 'classkqMix'){
					VcomTeach.unbindEvent('AnswerGetKeys')
					VcomTeach.unbindEvent('PadGetStatus')
				}else{
					VcomTeach.unbindEvent('PadGetStatus')
					VcomTeach.unbindEvent('OnGetResults')
					VcomTeach.unbindEvent('PadGetKeys')
					VcomTeach.unbindEvent('OnPadGetLockInfo')
				}
			}catch(e){

			}
		},
		computed: {
			onlineNum(){
				let arr = this.studentList.filter(item => item.offline == false)
				this.statusCountArr[1].num = arr.length
				return arr.length
			},
			chuqinNum(){
				let arr = this.studentList.filter(item => item.kqStatus == this.kqArr[0].id)
				return arr.length
			},
			chidaoNum(){
				let arr = this.studentList.filter(item => item.kqStatus == this.kqArr[1].id)
				return arr.length
			},	
			qingjiaNum(){
				let arr = this.studentList.filter(item => item.kqStatus == this.kqArr[2].id)
				return arr.length
			},
			kuangkeNum(){
				let arr = this.studentList.filter(item => item.kqStatus == this.kqArr[3].id)
				return arr.length
			},
			weidianmingNum(){
				let arr = this.studentList.filter(item => item.kqStatus == this.kqArr[4].id)
				return arr.length
			},
			studentListKq(){
				let arr = this.studentList.filter(item => item.kqStatus == this.kqArr[this.classKqData.activeIndex].id)
				this.checkList = []
				return arr
			},
			nowTime(){
				return this.getNowTime()
			},
			shareGroupList1(){
				return this.groupListBase.filter((item,index) => { return index < 4})
			},
			shareGroupList2(){
				return this.groupListBase.filter((item,index) => { 
					return index >= 4
				})
			},
			notInGroupNum(){
				let num = 0;
				for(let item of this.groupListBase){
					num += item.students.length
				}
				return this.studentList.length - num
			}			
		},
		methods:{
			async init(){
				try{
					if(this.type == 'studentScreen'){
						VcomPad.InitPadCallback(1)
					}else{
						VcomPad.InitPadCallback(0)
					}
				}catch(e){

				}
				
				//获取学生名单
				let res = await getStudentListByClassData(this)
				this.studentList = res

				try{
					if(this.type == 'sendToPad'){
						this.notifyInstance = this.$notify.warning({
							title: '下载中',
							message: '正在下载到授课端',
							duration: 0
						});
						//发送到平板
						let downloadurl = decodeURIComponent(decodeURIComponent(storage.get(DOWNLOAD_URL)))
						let paper_id = storage.get(KQYX_PAPER_ID)
						// VcomPad.StartPapersAnswer(decodeURIComponent(decodeURIComponent(loginInfo.downloadurl)),loginInfo.paper_id);
						VcomPad.StartPapersAnswer(downloadurl,paper_id)
					}else if(this.type == 'yuxizuoda'){
						this.notifyInstance = this.$notify.warning({
							title: '下载中',
							message: '正在下载到授课端',
							duration: 0
						});						
						//预习作答
						//downloadurl,paper_id课前预习中放到localstorage中
						let downloadurl = decodeURIComponent(decodeURIComponent(storage.get(DOWNLOAD_URL)))
						let paper_id = storage.get(KQYX_PAPER_ID)
						commonUtils.console('开始下载预习作答试卷',downloadurl,paper_id)
						VcomPad.StartPreviewWork(downloadurl,paper_id);
					}else if(this.type == 'discuss'){
						let result = await getStudentGroupData(this.classId)
						let groupRes = result.groupList			
						this.groupListBase = groupRes	

						//重置颜色为离线
						for(let [index,item] of this.groupListBase.entries()){
							for(let [i,val] of item.students.entries()){
								this.groupListBase[index].students[i].groupTheme = 'gray'
							}
						}
					}else if(this.type == 'share'){
						//获取分组名单
						try{
							VcomPad.StartShareResult();
						}catch(e){

						}
						try{
							let result = await getStudentGroupData(this.classId)
							let groupRes = result.groupManagerList
							this.groupListBase = groupRes
						}catch(e){

						}
					}else if(this.type == 'beginClass'){
						VcomPad.StartClass();
					}else if(this.type == 'endClass'){
						VcomPad.StopClass();
					}else if(this.type == 'classkqCard'||this.type == 'classkqMix'){
						VcomAnswerQues.Start() //答题卡课堂考勤
					}else{

					}
				}catch(e){

				}
				if(this.type=="sign"||this.type=="finishClass"){
					try{
						let result = await getPadVersion()
						let version = result.data.content
						version = version.replace(/V/, "");
						version = version.replace(/v/, "");
						this.padLimitVersion = version
					}catch(e){
						// this.padLimitVersion = '3.1.6'
					}
				}
			},
			formatGroupListNew(groupList){
				//设置最大行数
				let maxRow = 0
				for(let item of groupList){
					if(item.length > maxRow){
						maxRow = item.length
					}
				}

				for(let i=0; i< groupList.length; i++){
					for(let j=0; j< maxRow; j++){
						if(typeof groupList[i][j] == 'undefined'){
							groupList[i][j] = {}
						}
					}
				}
				// console.log(groupList)
			},
			formatGroupList(groupList){
				let tableData = []
				let userList = []
				let userIdList = []

				//设置最大行数
				let maxRow = 0
				for(let item of groupList){
					if(item.length > maxRow){
						maxRow = item.length
					}
				}

				//生成最大行数的数组
				for(let i=0;i<maxRow;i++){
						tableData[i] = []
				}

				for(let i=0; i<groupList.length; i++){
					for(let j=0; j<groupList.length; j++){
						if(typeof groupList[i][j] != 'undefined'){
							tableData[j][i] = groupList[i][j]
						}else{
							tableData[j][i] = {}
						}
					}
				}

				return tableData
			},
			start(){				
				try{
					PadAnswer.start()
				}catch(e){
					commonUtils.console(e,'PadAnswer.start() error')
				}
			},
			//开始上课
			startClass(){
				VcomPad.SetClassStatus(1) // 设置课 堂状态 0 下课， 1上课

				let params = {}
				params.type = 'setClassStatus'
				params.code = 1

				VcomTeach.notifyParent(JSON.stringify(params),1)
				VcomPad.StartClass();
				window.close()
			},
			//锁屏
			lock(){
				if(this.checkList.length == 0){
					this.$messageteach.error('请选择学生！')
					return false
				}else{
					this.lockFlag = false //禁止回调函数更新锁屏状态，
					setTimeout(()=> {
						//2秒后回调可以更新锁屏状态
						this.lockFlag = true
					},2000)
					// console.log(this.checkList.join(','))
					try{
						VcomPad.PadLock(this.checkList.join(','));
					}catch(e){

					}					
					//循环更改每个学生的锁屏状态
					for(let item of this.checkList){
						// console.log(this.studentList[this.studentIndex['"' + item + '"']])
						this.studentList[this.studentIndex['"' + item + '"']].lock = 'lock'
					}					
					this.checkList = []
				}
			},
			//解锁
			unlock(){
				if(this.checkList.length == 0){
					this.$messageteach.error('请选择学生！')
					return false
				}else{
					this.lockFlag = false //禁止回调函数更新锁屏状态，
					setTimeout(()=> {
						//2秒后回调可以更新锁屏状态
						this.lockFlag = true
					},2000)					
					try{
						VcomPad.PadUnlock(this.checkList.join(','));
					}catch(e){

					}					
					//循环更改每个学生的锁屏状态
					for(let item of this.checkList){
						this.studentList[this.studentIndex['"' + item + '"']].lock = ''
					}					
					this.checkList = []
				}
			},
			//下课
			finishClass(){
				VcomPad.SetClassStatus(0) // 设置课 堂状态 0 下课， 1上课
				let params = {}
				params.type = 'setClassStatus'
				params.code = 0
				VcomTeach.notifyParent(JSON.stringify(params),1)
				VcomPad.StopClass();
				window.close()
			},
			//停止分享			
			shareStop(){
				VcomPad.StopShareResult()
				window.close()
			},
			//分享选择标签
			shareHandleSelect(key, keyPath){
				this.shareData.activeIndex = key
			},
			//讨论菜单切换回调
			discussHandleSelect(key, keyPath){
				this.discussData.activeIndex = key
			},			
			//开始讨论1
			startDiscuss1(){
				this.discussData.isStart = true
				this.discussData.list[1].disabled = true
				this.timeVal = 0
				this.timer = setInterval(()=>{
					this.timeVal++
					}, 1000);
				try{
					VcomPad.StartGroupTalk()
				}catch(e){

				}
			},
			//结束讨论1
			closeDiscuss1(){
				this.discussData.isStart = false
				this.discussData.list[1].disabled = false				
				clearInterval(this.timer)
				try{
					VcomPad.StopGroupTalk();
				}catch(e){

				}
			},
			//开始讨论2
			startDiscuss2(){
				let allNumberOnlyOneFlag = false //是否包含只有一个人的分组
				let onlineNumOnlyOne = false //是否包含在线人数只有一个人的小组
				let groupDiscussCount = 0 //符合条件的小组个数
				// console.log(this.groupListBase)
				for(let item of this.groupListBase){
					let classGroupId = item.groupId//分组id
					let classGroupName = item.groupName //分组名称

					let onlineMemberArr = item.students.filter(member => member.offline == false) //获取在线数组
					// console.log('onlineNUm:'+onlineMemberArr.length)
					if(item.students.length == 1){
						allNumberOnlyOneFlag = true
					}
					if(onlineMemberArr.length >1){
						//至少在线两个人才能发起讨论(不在线的名单也下发)
						let tmpOnLineArr = []
						let tmpOffLineArr = []
						for(let val of item.students){
							if(val.offline){
								tmpOffLineArr.push(val.studentId)
							}else{
								tmpOnLineArr.push(val.studentId)
							}
						}
						//组长id,学生名单（逗号分割）,组名称（base64），组id，教师id（暂时为空）
						// let groupManagerId = tmpOnLineArr[0] //组长id（第一个人为组长）
						// tmpOnLineArr.splice(0,1)

						let concatArr = tmpOnLineArr.concat(tmpOffLineArr)
						let groupManagerId = concatArr[0] //组长id（第一个人为组长，优先在线的）
						concatArr.shift()
						let studentIds = concatArr.join(",")
						groupDiscussCount++//符合条件的小组+1

						commonUtils.console(groupManagerId,studentIds,Base64.encode(classGroupName),classGroupId,this.teachernumber)
						try{
							VcomPad.StartGroupByTeacher(groupManagerId,studentIds,Base64.encode(classGroupName),classGroupId,this.teachernumber)
						}catch(e){

						}						
					}else if(onlineMemberArr.length == 1){
						//在线只有一个人
						onlineNumOnlyOne = true
					}
				}
			// console.log('groupDiscussCount:'+groupDiscussCount)
				let errorMsg = ''
				if(groupDiscussCount == 0){					
					if(onlineNumOnlyOne){
						errorMsg += '在线只有一个人的小组不能进行讨论！'
					}
					if(allNumberOnlyOneFlag){
						errorMsg += '只有一个人的小组不能进行讨论'
					}
					errorMsg += '没有符合条件的小组!'
					this.$messageteach.error({type:'error',dangerouslyUseHTMLString:true,message:errorMsg})
					return false
				}else{
					if(allNumberOnlyOneFlag){
						errorMsg += "只有一个人的小组不能进行讨论!"
					}
					if(onlineNumOnlyOne){
						errorMsg += '在线只有一个人的小组不能进行讨论！'
					}
					if(errorMsg != ''){
						this.$messageteach.error({type:'warning',dangerouslyUseHTMLString:true,message:errorMsg})
					}
					
					this.discussData.isStart = true
					this.discussData.list[0].disabled = true					
					this.discussData.isStartGroup = false
					
					this.timeVal = 0
					this.timer = setInterval(()=>{
						this.timeVal++
						}, 1000);
				}
			},
			//结束讨论2
			closeDiscuss2(){
				this.discussData.isStart = false
				this.discussData.list[0].disabled = false		
				this.discussData.isStartGroup = false
				clearInterval(this.timer)
				try{
					VcomPad.StopGroupTalk();
				}catch(e){
					
				}				
			},
			studentClick(index){
				if(this.type == 'share'){
					// console.log(this.studentList[index])
					if(this.studentList[index].shareOk){
						//打开分享结果页面
						let url = this.studentList[index].url
						try{
							VcomTeach.pageForwarding('shareresource ',url)
						}catch(e){

						}						
					}
				}
			},
			//调整分组
			changeDiscussGroup(){
				this.discussData.list[0].disabled = true		
				this.discussData.isStartGroup = true

				// let groupNameArr = []
				for(let [index,item] of this.groupListBase.entries()){
					// this.groupListBase.splice(0,this.groupListBase.length)
					// groupNameArr.push(item.groupName)
					this.groupListBase[index].students = []					
				}
				
				try{
					VcomPad.StartGroupByStud('第一组,第二组,第三组,第四组,第五组,第六组,第七组,第八组');
				}catch(e){

				}				
			},
			//保存分组
			async saveDiscussGroup(){
				try{
					VcomPad.EndGroupByStud();
				}catch(e){

				}
				let isNotEmpty = false

				let obj = {}
				let arr = []
				
				for(let [index,item] of this.groupListBase.entries()){
					let groupObj = {}
					groupObj.classGroupName = item.groupName
					groupObj.classGroupType = 1
					groupObj.groupUserName = this.teachernumber
					groupObj.groupOrder = index+1
					groupObj.schoolClassId = this.classId
					if(item.students.length == 0){
						groupObj.groupExist = 0
					}else{
						groupObj.groupExist = 1
					}
					
					let memberInfoArr = []
					for(let val of item.students){
						let memberObj = {}
						memberObj.studentNumber = val.studentId
						if(val.groupManager == 1){
							memberObj.groupManagerFlg = 1
						}else{
							memberObj.groupManagerFlg = 0
						}
						memberInfoArr.push(memberObj)
					}
					if(memberInfoArr.length > 0){
						isNotEmpty = true
					}
					groupObj.memberInfo = memberInfoArr
					arr.push(groupObj)
				}
				obj.classGroup = arr

				if(!isNotEmpty){
					this.$messageteach.error('小组不能为空!')
					return false
				}

				let res = await saveClassGroupApi(JSON.stringify(obj))


				this.discussData.list[0].disabled = false		
				this.discussData.isStartGroup = false
			},
			//关闭页面
			closePage(){
				if(this.type == 'discuss'){
					VcomPad.StopGroupTalk();
				}else{
				
				}				
				window.close()
			},
			checkAll(val){//全选
			// console.log(val)
				if(val){
					if(this.type == 'classkq'||this.type == 'classkqCard'||this.type == 'classkqMix'){
						let arr = []
						for(let item of this.studentListKq){
							arr.push(item.studentNumber)
						}
						this.checkList = arr
					}else{
						let arr = []
						let onLineArr = this.studentList.filter(item => item.offline == false)
						for(let item of onLineArr){
							arr.push(item.studentNumber)
						}
						this.checkList = arr
					}					
				}else{
					this.checkList = []
				}
				
			},
			//课堂考勤菜单切换
			classKqHandleSelect(key, keyPath){
				this.classKqData.activeIndex = key
				
			},			
			//出勤
			chuqin(){
				if(this.checkList.length == 0){
					this.$messageteach.error('请选择学生！')
					return false
				}else{
					//循环更改每个学生的锁屏状态
					for(let item of this.checkList){
						this.studentList[this.studentIndex['"' + item + '"']].kqStatus = this.kqArr[0].id
					}
					this.checkList = []
				}
			},
			//迟到
			chidao(){
				if(this.checkList.length == 0){
					this.$messageteach.error('请选择学生！')
					return false
				}else{	
					//循环更改每个学生的锁屏状态
					for(let item of this.checkList){
						this.studentList[this.studentIndex['"' + item + '"']].kqStatus = this.kqArr[1].id
					}		
					this.checkList = []
				}
			},
			//请假
			qingjia(){
				if(this.checkList.length == 0){
					this.$messageteach.error('请选择学生！')
					return false
				}else{
					//循环更改每个学生的锁屏状态
					for(let item of this.checkList){
						this.studentList[this.studentIndex['"' + item + '"']].kqStatus = this.kqArr[2].id
					}					
					this.checkList = []
				}					
			},
			//旷课
			kuangke(){
				if(this.checkList.length == 0){
					this.$messageteach.error('请选择学生！')
					return false
				}else{	
					//循环更改每个学生的锁屏状态
					for(let item of this.checkList){
						this.studentList[this.studentIndex['"' + item + '"']].kqStatus = this.kqArr[3].id
					}					
					this.checkList = []
				}				
			},
			//投屏
			Screening(){
				if(this.checkList.length == 0){
					this.$messageteach.error('至少选择一个学生！')
					return false
				}else if(this.checkList.length > 4){
					this.$messageteach.error('最多选择4个学生！')
					return false
				}else{
					console.log("VcomPad.StartStudentscreen("+ this.checkList.join(',') +")")
					console.log("VcomTeach.pageForwarding('studentpad','"+ this.checkList.length +"')")
					VcomPad.StartStudentscreen(this.checkList.join(','));
					VcomTeach.pageForwarding('studentpad','"'+this.checkList.length+'"')
				}
			},
			//探究结束，查看反馈
			yuxizuodaHandle(){
				let params = {}
				let paper_id = storage.get(KQYX_PAPER_ID)
				params.type = 'tls_yxzd'
				params.paperId = paper_id
				//通知主窗口打开当前预习任务的反馈
				try{
					VcomTeach.notifyParent(JSON.stringify(params))
				}catch(e){

				}
				storage.set(KQYX_PAPER_ID,'')
				storage.set(DOWNLOAD_URL,'')
				try{
					VcomPad.StopPreviewWork(paper_id);
				}catch(e){

				}
				window.close()
			},
			//答题结束 查看结果
			sendpadHandle(){
				let params = {}
				let paper_id = storage.get(KQYX_PAPER_ID)
				let rsType = storage.get(KQYX_RS_TYPE)
				params.type = 'tls_xlfk'
				params.rcode = paper_id
				params.rsType = rsType

				//通知主窗口打开当前预习任务的反馈
				try{
					VcomTeach.notifyParent(JSON.stringify(params))
				}catch(e){

				}
				storage.set(KQYX_PAPER_ID,'')
				storage.set(DOWNLOAD_URL,'')
				storage.set(KQYX_RS_TYPE,'')

				try{
					VcomPad.StopPapersAnswer();
				}catch(e){

				}
				window.close() 
			},
			//平板关机
			padPowerOff(){
        this.$confirm('确定要关闭平板么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					try{
						let result = VcomPad.CloseAllPad("0","all");
						if(result == 0){
							this.$messageteach.success('关机成功')
						}else{
							this.$messageteach.error('关机失败')
						}
					}catch(e){

					}
        }).catch(() => {
					
        });
			},
			//格式化时间
			getNowTime(){
				let  reg = /^\d$/;
				let d = new Date("1111/1/1,0:0:0");
				d.setSeconds(this.timeVal);
				let h = d.getHours()
				h = reg.test(h) ? "0" + h + "：" : h + "："
				let m = d.getMinutes()
				m = reg.test(m) ? "0" + m + "：" : m + "："
				let s = d.getSeconds()
				s = reg.test(s) ? "0" + s : s
				return h + m + s
			},
			//保存考勤
			classkqClose(){
				if(this.type == 'classkqCard'){
					VcomAnswerQues.Stop();
				}else if(this.type == 'classkq'){
					VcomPad.Stop()
				}else if(this.type == 'classkqMix'){
					VcomAnswerQues.Stop();
					VcomPad.Stop()
				}				
				//出勤
				let chuqinArr = []
				//迟到
				let chidaoArr = []
				//请假
				let qingjiaArr = []
				//旷课
				let kuangkeArr = []
				//未点名
				let weidianmingArr = []

				let arr = []
				for(let item of this.studentList){
					if(item.kqStatus == this.kqArr[0].id){
						//出勤
						chuqinArr.push(item.studentNumber)
					}else if(item.kqStatus == this.kqArr[1].id){
						//迟到
						chidaoArr.push(item.studentNumber)
					}else if(item.kqStatus == this.kqArr[2].id){
						//请假
						qingjiaArr.push(item.studentNumber)
					}else if(item.kqStatus == this.kqArr[3].id){
						//旷课
						kuangkeArr.push(item.studentNumber)
					}else if(item.kqStatus == this.kqArr[4].id){
						//未点名
						weidianmingArr.push(item.studentNumber)
					}
				}

				//未点名和旷课合并
				let kuangkeConcatArr = kuangkeArr.concat(weidianmingArr)
	 			console.log(this.teachername)
				addKaoQinApi(this.classId,this.classType,this.teachernumber,this.teachername,chuqinArr.join('|'),chidaoArr.join('|'),qingjiaArr.join('|'),kuangkeConcatArr.join('|'))
				window.close()
			},
			//成果分享成功查看
			shareUserClick(item){
				if(item.shareOk){
					//打开分享结果页面
					let url = item.url
					try{
						VcomTeach.pageForwarding('shareresource ',url)
					}catch(e){

					}					
				}
			},
			test(){
				console.log(this.studentNumberList.length)
				let n = this.studentNumberList.length
				this.statusCountArr[8].num = n
			}

		}

}
</script>

<style scoped>
.bbb{
	border-right: solid 1px #ddd;
}
.ljzt{height: 100%; display: flex; flex-direction: column;}
.ljtop {height:7vh; line-height: 7vh; background: #fafafa;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);}
.ljbottom{background: #efefef;}
.ljmiddle {flex:1;}
.ztcard {box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); padding: 2vh;text-align: left; background: #fff;}
.ztcard label {float: right;}
.ztcard span {margin: 0 1vh; vertical-align: middle;}
.ztcard span i {margin-right: 1vh;}
.ljbottom>button {margin-top: 2vh;    margin-bottom: 2vh;}
.closebtn {background: linear-gradient(180deg,#f95353 0%,#e04a4a 100%); border-radius: 50%; border: 0;color: #fff; height: 5vh; width: 5vh; text-align: center; line-height: 5vh; margin-bottom: 0!important; font-size: 1.5rem; position: absolute;right:1.5vh; bottom:1.5vh;}
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
.yj-newteach-group{text-align: left; padding: 2vh;}
.el-row {
	margin: 20px;
	&:last-child {
		margin-bottom: 0;
	}
}
.el-col {
	border-radius: 4px;
}

.fzlabel {line-height: 2rem;}
.el-card__header{
	background:#000080
}
</style>

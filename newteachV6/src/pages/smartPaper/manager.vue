<template>
<div class="ljzt">
	<div class="ljtop">
		<span>状态查看</span>
		<label style="float:right;" v-if="isStart">搜索到的设备数：<font style="color:red;">{{OnlineMacArr.length}}</font></label>
	</div>
	<div class="ljmiddle" style="overflow-y: auto;">
		<el-table
		border
		:highlight-current-row="false"
		:row-class-name="tableRowClassName"
		:data="paperListArr"
		style="width: 100%">
		<el-table-column
			prop="smartPaperNumber"
			label="编号"
			width="180">
		</el-table-column>
		<el-table-column
			v-if="isShowLetter"
			prop="bindNum"
			label="字母"
			width="180">
		</el-table-column>
		<el-table-column
			prop="smartPaperMac"
			label="mac">
		</el-table-column>
		<el-table-column
			prop="smartPaperIdNumber"
			label="序列号">
		</el-table-column>		
		</el-table>		
	</div>
	<div class="ljbottom">
		<div class="ztcard">
			<span><i class="online"></i>已连接({{onlineNum}})</span>
			<span><i class="bGray"></i>未连接({{offlineNum}})</span>
			<span v-if="!isStart"><i class="unbind"></i>未绑定({{unbindNum}})</span>
		</div>
		<div class="h6vh">
	  	<el-button type="primary" v-if="!isStart" @click="startBind">开始绑定</el-button>
		<el-button type="primary" @click="sortPaper">一键排序</el-button>
		<button class="closebtn" @click="closePage"><i class="el-icon-close" ></i></button>
		</div>
	</div>

</div>

</template>

<script>
import { mapGetters } from 'vuex'
import {  sortSmartPaperApi } from '@/api/interface'
import { getSmartPaperByMacData, setWhiteMac,OnGetOnlineMacs,OnGetKeys} from '@/api/smartPaperManager'
import storage from '@/utils/storage'
import commonUtils from '@/utils/common'
import {TLS_RESET_WHITE_MAC} from '@/api/constant'
export default {
    data(){
        return{
					ut:'',
					classId:'',//班级ID
					schoolId:'',//学校ID
					paperListArr: [],//学生名单
					macIndex:{}, //mac在paperListArr中的位置
					orderByKey: [], //编号跟字母的对应关系
					orderIndex:{}, //编号在paperListArr中的位置
                    OnlineMacArr:[],//在线平板mac
                    baseKeyArr:[],//基础字母
					isStart:false,//是否点击开始绑定按钮
					teacherComputerMac:'',//教学机mac 控件获取
					statusCountArr: [
								{id:10,name:'已连接','icon':'online',isShow:true,num:0},
								{id:1,name:'未连接','icon':'bGray',isShow:true,num:0},
								{id:3,name:'未绑定','icon':'unbind',isShow:true,num:0}],
					isShowLetter:false,//是否展示字母
					macChange:false,//mac是否变化

        		}
		},
		mounted(){
			try{
				//获取教学机MAC
				this.teacherComputerMac = VcomMacIp.GetMacInfo()
				let loginInfo = VcomTeach.getLoginInfo()
				let loginObj = JSON.parse(loginInfo)
				this.classId = loginObj.classId
				this.schoolId = loginObj.schoolId
				this.ut = loginObj.ssout
			}catch(e){
				this.teacherComputerMac = '6C-4B-90-78-9B-E7'
				this.classId = '153386908359468061'
				this.ut = 'e74af35cb4c689e8bf3606587a141df54c9f1a689d402f4c5e06245c06ccdaf26470c3fa7bcf0496'
				this.schoolId = '4101010001'
				// this.classId = '150174041245814936'
				// this.teachernumber = '41010100010128'	
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
		computed: {
			onlineNum(){
				let arr = this.paperListArr.filter(item => item.styleTheme == 'online')
				return arr.length
			},
			offlineNum(){
				let arr = this.paperListArr.filter(item => item.styleTheme == 'offline')
				return arr.length
			},
			unbindNum(){
				let arr = this.paperListArr.filter(item => item.styleTheme == 'unbind')
				return arr.length
			}						
		},
		methods:{
			tableRowClassName({row,rowIndex}){
				if(row.styleTheme == 'online'){
					return 'online'
				}
				if(row.styleTheme == 'unbind'){
					return 'unbind'
				}
				if(row.styleTheme == 'offline'){
					return 'bGray'
				}
			},
			async init(){
				//获取学生名单
				await getSmartPaperByMacData(this)
				commonUtils.console('开启在线状态查看:Paper.SetOnlineMacs()');
				try{
					VcomPaper.SetOnlineMacs();
				}catch(e){}
			},
			//开始绑定
			startBind(){		
				//可以展示左侧字母
				this.isShowLetter = true
				//把未绑定的改为未连接
				let self = this
				for(let [index,item] of this.paperListArr.entries()){
					if(item.styleTheme == 'unbind'){
						self.paperListArr[index].styleTheme = 'offline'
					}		
				}
				
				//调用start
				this.isStart = true

				try{
					//关闭白名单
					VcomPaper.CloseWhiteCard()
					//start
					VcomPaper.Start()
				}catch (e) {

				}
			},
			//一键排序
			async sortPaper(){
				let res = await sortSmartPaperApi(this.schoolId,this.teacherComputerMac,this.ut,1)
				storage.set(TLS_RESET_WHITE_MAC,1)
				if(this.isStart){
					try{
						VcomPaper.Stop()
					}catch(e){
						console.log(e)
					}
				}
				setWhiteMac(this.macIndex)
				window.location.reload()
			},
			closePage(){
				if(this.isStart){
					try{
						console.log('1111 VcomPaper.Stop()')
						VcomPaper.Stop()
					}catch(e){
						console.log(e)
					}					
				}
				if(this.macChange){				
					setWhiteMac(this.macIndex)
				}				
				window.location.href = '/teachui/#/smartPaper/index'
			}
		}

}
</script>

<style>
.el-table .unbind {
background: #ff6c6c;
}
.el-table .bGray {
background: #ddd;
}
.el-table .online {
background: #409EFF;
}
.ztcard span i{display: inline-block;width: 1rem;height: 1rem;}
.unbind{background-color: #ff6c6c !important;color: #fff}
.bGray{background-color: #ddd !important;}
.online{background-color: #409EFF !important;color:#fff}
.ljzt{height: 100%; display: flex; flex-direction: column;}
.ljtop {height:7vh; line-height: 7vh; background: #fafafa;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);}
.ljbottom{background: #efefef;}
.ljmiddle {flex:1;}
.ztcard {box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); padding: 2vh;text-align: left; background: #fff;}
.ztcard label {float: right;}
.ztcard span {margin: 0 1vh; vertical-align: middle;}
.ljbottom>button {margin-top: 2vh;}
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
</style>

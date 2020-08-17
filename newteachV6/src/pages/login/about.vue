<template>
<div >
<YjNewteachVisibilityDialog title = '关于' width="80%"  :visible="setDialogVisible" @close="closeWindow">
			<el-row :gutter="5">
				<el-col :span="8"><div class="grid-content bg-purple textright">当前客户端版本：</div></el-col>
				<el-col :span="16"><div class="grid-content bg-purple textleft">{{getVersion()}}</div></el-col>
			</el-row>
			<el-row :gutter="5">
				<el-col :span="8"><div class="grid-content bg-purple textright">当前平台版本：</div></el-col>
				<el-col :span="16"><div class="grid-content bg-purple textleft">{{version}}</div></el-col>
			</el-row>
			<el-row :gutter="5">
				<el-col :span="8"><div class="grid-content bg-purple textright">当前学习卡接收器型号：</div></el-col>
				<el-col :span="16"><div class="grid-content bg-purple textleft">{{getDeviceInfo()}}</div></el-col>
			</el-row>
			<el-row :gutter="5" v-if="regcode != ''">
				<el-col :span="8"><div class="grid-content bg-purple textright">注册码：</div></el-col>
				<el-col :span="16"><div class="grid-content bg-purple textleft">{{regcode}}</div></el-col>
			</el-row>
			<el-row :gutter="5">
				<el-col :span="8"><div class="grid-content bg-purple textright">操作系统信息：</div></el-col>
				<el-col :span="16"><div class="grid-content bg-purple textleft">{{getUserAgent()}}</div></el-col>
			</el-row>			
			<el-row :gutter="5">
				<el-col :span="8"><div class="grid-content bg-purple textright">检测更新：</div></el-col>
				<el-col :span="16"><div class="grid-content bg-purple textleft" ><el-button v-show="needUpdate" type="primary" plain   @click="runUpdate()">立即更新</el-button><span v-show="!needUpdate">目前已是最新版本</span></div></el-col>
			</el-row>
			<el-row :gutter="5">
				<el-col :span="8"><div class="grid-content bg-purple textright">环境检测工具：</div></el-col>
				<el-col :span="16"><div class="grid-content bg-purple textleft" ><el-button type="primary" plain   @click="openCheckTool()">点此打开</el-button></div></el-col>
			</el-row>
			<el-row :gutter="5">
				<el-col :span="8"><div class="grid-content bg-purple textright">客服电话：</div></el-col>
				<el-col :span="16" ><div class="grid-content bg-purple textleft">{{tel}}</div></el-col>
			</el-row>
		<div>
			<div>
				<slot name="tips"></slot>
			</div>
			<div class="tcenter">
				<YjNewteachButton type="danger" icon="el-icon-close" circle @click="closeWindow" style="position: absolute; right: 0vh; bottom: 0vh;"></YjNewteachButton>       
			</div>
		</div>           
	</YjNewteachVisibilityDialog>    
	<el-dialog title="提示" :visible.sync="updating" width="30%" :show-close="false" :close-on-click-modal="false" append-to-body>
  		<span>升级程序启动中...请勿操作!</span>
  		<span slot="footer" class="dialog-footer">
  		</span>
	</el-dialog>
</div>
</template>

<script>
import {VERSION,SERVER_TEL} from '@/api/constant'
import DialogNewteach from '@/components/DialogNewteach'

  export default {
    name: 'aboutWindow',
    components: {
        DialogNewteach
	},
	props: ['setDialogVisible'],//设置弹出框是否显示
    data() {
      return {
        version:VERSION,
        tel:SERVER_TEL,
		needUpdate:false,
		updateInfo:null,
		updating:false,
			regcode:''
      };
	},
	mounted(){
		try{
			let newVersionInfo = VcomDownOcx.GetNewVerInfo();
			//判断是否有新版本
			if("undefined"!=typeof(newVersionInfo) && newVersionInfo!=null && newVersionInfo!=''){
				let tempArr=newVersionInfo.split(",");
				console.log("版本升级信息：");
				console.log(tempArr);
				if(tempArr.length>=2){
					this.needUpdate = true;
					//arr[0];最新版本号;arr[1];最新版本升级路径
					this.updateInfo = tempArr;
				}
			}
		}catch(e){console.log("检查更新失败")}

		try{
			let skpath=VcomDownOcx.GetSpecialFolderPath(100);
			console.log(skpath);
			let tempTxt=VcomDownOcx.ReadInfo(skpath,"vcomie.ini");
			if(tempTxt == '-1'){
				//找不到文件,去D盘找
				tempTxt=VcomDownOcx.ReadInfo('D:',"vcomie.ini");
			}
			if(tempTxt == '-1'){
				console.log('找不到vcomie文件')
			}else{
				let reg = /License:(.*?)##PC/;
				let res = reg.exec(tempTxt);
				console.log(res)
				if(res != null){
					this.regcode = res[1];
				}				
			}

			
		}catch(e){
			console.log("读取vcomie失败")
		}
		
        
        
	},
	methods: {
			//关闭
			closeWindow(){
				this.$emit('aboutClose',false)
			},
			getVersion(){
				console.log("getVersion")
				try{
					let versionInfo =VcomTeach.getVcomTeachVersion();
					let versionArr=versionInfo.split(";");
					if(versionArr!=null && versionArr.length>2){
						versionInfo=versionArr[0];+";"+versionArr[1];
					}
					return versionInfo;
				}catch(e){
					console.log("控件异常！非客户端环境！！");
				}
				return "--";
			},
			getDeviceInfo(){
				try{
					return showDriveTypeName(VcomTeach.getAllDeviceInfo());
				}catch(e){
					console.log("控件异常！非客户端环境！！");
				}
				return "--";
			},
			getUserAgent(){
				//return navigator.userAgent;
				try{
					let info = VcomTeach.getVcomTeachVersion();
					let infoArr = info.split(";");
					if(infoArr.length>2){
						return infoArr[2];
					}
				}catch(e){
					console.log("控件异常！非客户端环境！！");
				}
				return "--";
			},
			openCheckTool(){
				//打开授课检查工具
				//VcomDownOcx.GetSpecialFolderPath(100)获取授课安装位置
				VcomDownOcx.playFile(VcomDownOcx.GetSpecialFolderPath(100)+"\\CheckPluginTools\\CheckPluginWin7.exe");
			},
			runUpdate(){
				console.log("执行升级");
				//执行升级
				if(this.needUpdate && !this.updating){
					try{
					this.updating=true;
					this.$emit('aboutClose',false)
					VcomDownOcx.StartNewUpdate(this.updateInfo[0],this.updateInfo[1]);
					}catch(e){
						this.updating=false;
						this.$messageteach({
						type: 'error',
						message: `升级程序调用失败!`
						});
						console.error(e);
					}
				}
			}
	}
  };

</script>

<style scoped>
 .el-row {
    margin-bottom: 3px;
		background: #d3dce6;
  }
  .el-col {
    border-radius: 4px;
  }
  .el-button{
	  padding:0.5vh 1vh;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
	padding-top:8px;
    border-radius: 4px;
    min-height: 36px;
	vertical-align:middle;
  }
  .row-bg {
    padding: 8px 0;
    background-color: #f9fafc;
  }
  .textleft{
	  text-align: left;
	  padding-left:2px;
	  padding-right:2px;
  }
  .textright{
	  text-align: right;
	  padding-right:10px;
  }
</style>

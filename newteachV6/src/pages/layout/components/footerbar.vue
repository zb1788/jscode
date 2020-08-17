<template>
<div >
<el-row type="flex" :class="{'footer':true}" justify="space-between">
  <el-col :span="3"> 
    <modulesbar />
  </el-col>
  <el-col :span="3">
    <chapter />
  </el-col>
  <el-col :span="6">
		<a class="line60" __VCOM_ANALYTICS="tls_sygl_sygl" __VCOM_ANALYTICS_CLICK @click="openNotice" target="_blank" style="color: #fff;cursor:pointer; font-size:1rem"><img src="@/assets/icons/foot/ting.svg" class="tongzhi" />{{noticeTitle}}</a>
	</el-col>
  <el-col :span="6">
		<!-- <el-button type="text" @click="test(7)"><i class="iconY gj"></i>纸笔</el-button>
		<el-button type="text" @click="test(1)"><i class="iconY gj"></i>上课</el-button>
		<el-button type="text" @click="test(2)"><i class="iconY gj"></i>下课</el-button>
		<el-button type="text" @click="test(3)"><i class="iconY gj"></i>课堂考勤</el-button>
		<el-button type="text" @click="test(4)"><i class="iconY gj"></i>小组讨论</el-button>
		<el-button type="text" @click="test(5)"><i class="iconY gj"></i>成果分享</el-button>
		<el-button type="text" @click="test(6)"><i class="iconY gj"></i>投屏</el-button> -->
	</el-col>
  <el-col :span="3"><el-button type="text" @click="open5"><i class="iconY gj"></i>设置</el-button></el-col>
  <el-col :span="3"><el-button type="text" @click="logout"><i class="iconY gb"></i>退出</el-button></el-col>
</el-row>

<setModle :setDialogVisible="setDialogVisible"  @setClose="setDialogVisible=false" />
<!-- <DialogNewteach 
		title = '密码验证'
		dialogWidth = '30%'
		:dialogVisible = "setDialogVisible"
		@cancel="setCancel"				
		>
				<template v-slot>
					<div class="texth3">
						<input class="sn" type="password" v-model="pwd"/></div>
						<div class="texth6">
							<label>系统版本号：</label>
							<span>V5.1.2 发布日期：2018.12.19</span>
						</div>
				</template>
				<template v-slot:footbutton>
						<el-button @click="setCancel">取消</el-button>
						<el-button @click="openArea">确定</el-button>
				</template>
</DialogNewteach> -->
<!-- <DialogNewteach 
		title = '授课IP设置'
		dialogWidth = '80%'
		:dialogVisible = "dialogVisible"
		@cancel="areaCancel"		
		>
				<template v-slot>
					<el-tabs :tab-position="tabPosition" @tab-click="tabClick" style="height:50vh;">
						<el-tab-pane label="网络选择地址">
							<el-row :gutter="20">
								<el-col :span="12">
									<div class="dressxz">
										<template v-for = "(item,index) in areaArr" >
											<el-button size="small" round @click="showSecond(item,index)" :key="index" v-if="index == mainIndex" type="primary">{{item.name}}</el-button>
											<el-button size="small" round @click="showSecond(item,index)" :key="index" v-if="index != mainIndex" >{{item.name}}</el-button>
										</template>							
									</div>
								</el-col>
								<el-col :span="12">
									<div class="dressxz02">
										<template v-for = "(item,index) in secondArr" >
											<el-button size="small" round @click="showThird(item,index)" :key="index" v-if="index == secondIndex" type="primary">{{item.name}}</el-button>
											<el-button size="small" round @click="showThird(item,index)" :key="index" v-if="index != secondIndex" >{{item.name}}</el-button>
										</template>	
									</div>
									<div class="dressxz02">
										<template v-for = "(item,index) in thirdArr" >
											<el-button size="small" round @click="showEnd(item,index)" :key="index" v-if="index == thirdIndex" type="primary">{{item.name}}</el-button>
											<el-button size="small" round @click="showEnd(item,index)" :key="index" v-if="index != thirdIndex" >{{item.name}}</el-button>
										</template>	
									</div>									
								</el-col>
							</el-row>
						</el-tab-pane>
						<el-tab-pane label="手动输入地址">
							<div class="mb20">
							<el-input placeholder="http://plstext.yjt361.com/teach" v-model="input1">
								<template slot="prepend">校级授课地址</template>
							</el-input>
							</div>
							<div class="mb20">
							<el-input placeholder="http://plstext.yjt361.com/teach" v-model="input2">
								<template slot="prepend">市级授课地址</template>
							</el-input>
							</div>
							<el-alert
								title="示例如下：http://plstxx.yjt361.com/teach 或 https://plstxx.yjt361.com/teach"
								type="success"
								:closable="false">
							</el-alert>
				</el-tab-pane>
					</el-tabs>
				</template>
				<template v-slot:footbutton>
						<el-button @click="areaCancel">取消</el-button>
						<el-button @click="areaSubmit">确定</el-button>
				</template>
</DialogNewteach>	 	  -->
<ClassSelectNewteach/>
<div v-show="dialogFilter" id="dialogFilterDiv" @click="hideDialog" class="v-modal" tabindex="0" style="z-index: 2002;"></div>
</div>

</template>

<script>
import modulesbar from './modulesbar'
import chapter from './chapter'
import { mapGetters } from 'vuex'
import DialogNewteach from '@/components/DialogNewteach'
import ClassSelectNewteach from '@/components/ClassSelectNewteach'
import { clientToolTransmit } from '@/api/client'
import {AUTH_TOKEN_NAME,AUTH_TIME_NAME,TLS_RESET_WHITE_MAC,DOWNLOAD_URL,KQYX_PAPER_ID} from '@/api/constant'
import storage from '@/utils/storage'
import { removeUt } from '@/utils/auth'
import { getNotice,getCustomerInfo } from '@/api/interface'
import { logoutClient } from '@/api/client'
import setModle from '@/pages/login/sysSet'
  export default {
    name: 'footerbar',
    components: {
        modulesbar,
				chapter,
				DialogNewteach,
				ClassSelectNewteach,
				setModle
    },
    computed: {
        ...mapGetters([
						'password',
						'dialogFilter',
						'teacherNumber'
				]),
				secondArr(){
					let arr = []
					if(this.areaArr.length > 0){
						if(typeof this.areaArr[this.mainIndex].area != 'undefined'){
							arr = this.areaArr[this.mainIndex].area
						}else{
							arr.push(this.areaArr[this.mainIndex])
						}
					}else{
						arr = []
					}
					return arr
				},
				thirdArr(){
					let arr = []
					if(this.secondArr.length > 0){
						if(typeof this.secondArr[this.secondIndex].area != 'undefined'){
							arr = this.secondArr[this.secondIndex].area
						}else{
							arr.push(this.secondArr[this.secondIndex])
						}
					}
					return arr
				}
		},
		mounted(){
			getNotice(this)
		},
    data() {
      return {
				data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
				setDialogVisible: false,//设置弹出框
				pwd:'',//用户输入密码
				areaArr:[],//区域数组
				mainIndex:0,//一级区域选中
				secondIndex:0,//二级区域选中
				thirdIndex:0,//三级区域选中
				tabIndex:0,//当前标签索引
				dialogVisible: false,
				input1: '',
				input2: '',
				tabPosition: 'right',
				noticeTitle:'',//公告名称
				noticeUrl:'',//公告链接
      };
    },
	 methods: {
		 test(num){
			 if(num == 1){
				 VcomTeach.openNewBrowser('http://plszb.yjt361.com:8777/page_proxy/#/pad/index?type=sign&parent=base','xpos=0&ypos=0&width=0&height=0')
			 }else if(num == 2){
				 VcomTeach.openNewBrowser('http://plszb.yjt361.com:8777/page_proxy/#/pad/index?type=finishClass&parent=base','xpos=0&ypos=0&width=0&height=0')
			 }else if(num == 3){
				 VcomTeach.openNewBrowser('http://plszb.yjt361.com:8777/page_proxy/#/pad/index?type=classkq','xpos=0&ypos=0&width=0&height=0')
			 }else if(num == 4){
				 VcomTeach.openNewBrowser('http://plszb.yjt361.com:8777/page_proxy/#/pad/index?type=discuss','xpos=0&ypos=0&width=0&height=0')
			 }else if(num == 5){
				 VcomTeach.openNewBrowser('http://plszb.yjt361.com:8777/page_proxy/#/pad/index?type=share','xpos=0&ypos=0&width=0&height=0')
			 }else if(num == 6){
				 VcomTeach.openNewBrowser('http://plszb.yjt361.com:8777/page_proxy/#/pad/index?type=studentScreen','xpos=0&ypos=0&width=0&height=0')
			 }else if(num == 7){
				 VcomTeach.openNewBrowser('http://plszb.yjt361.com:8777/page_proxy/#/smartPaper/index','xpos=0&ypos=0&width=0&height=0')
			 }
		 },
		 hideDialog(){
			 console.log('click hideDialog')
			 this.$store.dispatch('setDialogFilter',false)
		 },
		 open5() {
			 this.setDialogVisible = true
			//  return false
      //   this.$confirm('<div class="texth3"><input class="sn" id="password"/></div><div class="texth6"><label>系统版本号：</label><span>V5.1.2 发布日期：2018.12.19</span></div>', '密码验证', {
      //     dangerouslyUseHTMLString: true,
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //   }).then(() => {
      //       let text = document.getElementById('password').value
      //       if(text == this.password){
      //         document.getElementById('password').value = ''
			// 				alert('ok')
      //       }else{
      //         alert('err')
      //       }
      //   }).catch(() =>{})
      },
			handleNodeClick(data) {
        console.log(data);
			},
			//设置弹框关闭
			setCancel(){
				this.setDialogVisible = false
				this.pwd = ''
			},
			//区域选择面板关闭
			areaCancel(){
				this.dialogVisible = false
			},
			startWith(out,inner){
				return out.substring(0,inner.length) == inner
			},
			tabClick(item,event){
				this.tabIndex = item.index
			},
			showSecond(item,index){
				this.mainIndex = index
				this.secondIndex = 0
			},
			showThird(item,index){
				this.secondIndex = index
			},
			showEnd(item,index){
				this.thirdIndex = index
			},
			//打开公告栏
			async openNotice(){
				let params = {}
				let obj = {}
				obj.userId = this.teacherNumber;
				obj.userType = 2;
				obj.platform = '授课端';
				params.extInfo = obj
				params.userId = this.teacherNumber;
				params.browser = 'chrome';
				
				let res = await getCustomerInfo(params);
				console.log(res)
				let url = `https://cschat.antcloud.com.cn/index.htm?tntInstId=ORr_uEJI&scene=SCE00219044&cinfo=${res.cinfo}&key=${res.key}`
				console.log(url)
				window.open(url)
				return false;
				try{					
					// VcomTeach.openNewBrowser(this.noticeUrl,'width=0&&height=0&title='+noticeTitle+'&modal=true');
					VcomTeach.openByIE(this.noticeUrl)
				}catch(e){
					window.open(this.noticeUrl)
				}
			},
			logout(){
        this.$confirm('您确定要退出登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					logoutClient()
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
				
				// this.reload()				
				// alert('xx')	
				// const val = '#E80E19'
				// const oldVal = '#409EFF'
				// const themeCluster = this.getThemeCluster(val.replace('#', ''))
				// const originalCluster = this.getThemeCluster(oldVal.replace('#', ''))		

				// const styles = [].slice.call(document.querySelectorAll('style'))
				// 	.filter(style => {
				// 		const text = style.innerText
				// 		return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
				// 	})

				// styles.forEach(style => {
				// 	const { innerText } = style
				// 	if (typeof innerText !== 'string') return
				// 	style.innerText = this.updateStyle(innerText, originalCluster, themeCluster)
				// })
			},
			updateStyle(style, oldCluster, newCluster) {
				const colorOverrides = [] // only capture color overides
				oldCluster.forEach((color, index) => {
					const value = newCluster[index]
					const color_plain = color.replace(/([()])/g, '\\$1')
					const repl = new RegExp(`(^|})([^{]+{[^{}]+)${color_plain}\\b([^}]*)(?=})`, 'gi')
					const nestRepl = new RegExp(color_plain, 'ig') // for greed matching before the 'color'
					        console.log(value)
        // console.log(color_plain)
        // console.log(repl)
				// console.log(nestRepl)
				console.error('xxxxxxxxxxxxxxxxxxxxxx')
					let v
					while ((v = repl.exec(style))) {
						// console.log(v)
						// console.log(v[2])
						// console.log(v[3])
						console.log(v[2].replace(nestRepl, value) + value + v[3] + '}')
						console.log('aaaaaaaaaaaaaaaaa')						
						colorOverrides.push(v[2].replace(nestRepl, value) + value + v[3] + '}') // '}' not captured in the regexp repl to reserve it as locator-boundary
					}
				})
				return colorOverrides.join('')
			},
			getThemeCluster(theme) {
				const tintColor = (color, tint) => {
					let red = parseInt(color.slice(0, 2), 16)
					let green = parseInt(color.slice(2, 4), 16)
					let blue = parseInt(color.slice(4, 6), 16)

					if (tint === 0) { // when primary color is in its rgb space
						return [red, green, blue].join(',')
					} else {
						red += Math.round(tint * (255 - red))
						green += Math.round(tint * (255 - green))
						blue += Math.round(tint * (255 - blue))

						red = red.toString(16)
						green = green.toString(16)
						blue = blue.toString(16)

						return `#${red}${green}${blue}`
					}
				}

				const shadeColor = (color, shade) => {
					let red = parseInt(color.slice(0, 2), 16)
					let green = parseInt(color.slice(2, 4), 16)
					let blue = parseInt(color.slice(4, 6), 16)

					red = Math.round((1 - shade) * red)
					green = Math.round((1 - shade) * green)
					blue = Math.round((1 - shade) * blue)

					red = red.toString(16)
					green = green.toString(16)
					blue = blue.toString(16)

					return `#${red}${green}${blue}`
				}

				const clusters = [theme]
				for (let i = 0; i <= 9; i++) {
					clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
				}
				clusters.push(shadeColor(theme, 0.1))
				return clusters
			}									
    },
		
  };

</script>

<style scoped>
.w60 {width: 60px;}
.img100{width:100%}

.line60{line-height: 8vh;}
.pad10{padding: 10px;}
.yyList {font-size: 20px; color: #333;}
.text-center{text-align: center;}
button.yuan {width: 30px; height: 30px; background: url(../../../assets/images/ico.png); border:0; margin:10px;}
button.yuan.left { background-position: -23px -231px; }
button.yuan.right { background-position: -65px -231px;}
button.yuan.left.cur {background-position: -104px -231px;}
button.yuan.right.cur {background-position: -146px -231px;}
button.yuan02 {width: 20px; height: 20px; background: url(../../../assets/images/ico.png); background-position: -193px -237px;}
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
.tongzhi{margin-right: 1vh; vertical-align:middle;width: 2.5rem;height: 2.5rem;}
</style>

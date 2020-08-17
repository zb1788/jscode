<template>
    <div style="height:100%">
    <!-- <BannerNewteach/> -->
    <TabsNewteach
    ref="tabRef"
    :tabPosition="tabPosition"
    :data="data"
    @tabClick="tabClick"
    >
        <template v-slot:default="slotProps" >
          <div v-if="template == 1" style="flex:1;padding:2vh 2vh;">
              <div v-if="hasRes" class="yxlist">
                <ul>
                  <li v-for="(item,index) in resByPage" :key="index" @click="rowClick(item)" style="cursor:pointer" :__VCOM_ANALYTICS="item.pvname" __VCOM_ANALYTICS_CLICK>
                    <span v-if="item.icon !='' && typeof item.icon !='undefined'"><img :src="item.icon" /></span>
                    <p>{{ item.title }} 
                      <img v-if="item.useIcon !='' && typeof item.useIcon !='undefined'" :src="item.useIcon" /></p>
                    <span v-if="typeof item.button != 'undefined' && item.button.length > 0">
                      <el-button
                      type="primary" 
                      v-for="(buttonItem,i) in item.button.filter(val => val.enabled == true)"
                      :key="i"
                      @click.stop="handleButton(item,buttonItem)">{{buttonItem.name}}</el-button>
                      <el-button
                      type="primary" 
                      disabled=""
                      v-for="buttonItem in item.button.filter(val => val.enabled == false)"
                      :key="buttonItem.name"
                      >{{buttonItem.name}}</el-button>                    

                    </span>
                  </li>
                </ul>
              </div>
              <div v-if="!hasRes && !loading" style="flex:1;"><img src="../../assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></div>
              <div class="flexh">         
                <div>
                  <PageNewteach v-if="hasRes" :pageCurrent="pageCurrent1" :pageTotal="pageTotal" @pageClick="pageClick"/>
                  <el-button v-if="!loading && (parentFcode != '0'||!hasRes)" @click="goBack" type="warning" icon="el-icon-back"></el-button>
                </div>   
              </div>                                                 
          </div>
         <!-- 预习相关 -->
          <YxNewteach v-if="template == 2" type=3  :index="slotProps.tabIndex"  :nowIndex="activeIndex" :reload="reload" />    
          <!-- 我的网上作业 -->
          <ZyNewteach v-if="template == 3" type=2 :index="slotProps.tabIndex"  :nowIndex="activeIndex" :reload="reload"/>                                         
          <!-- 我的离线作业 -->
          <ZyNewteach v-if="template == 4" type=3 :index="slotProps.tabIndex"  :nowIndex="activeIndex" :reload="reload"/>                                         
          
        </template>
    </TabsNewteach>
    <input type="hidden" id="__VCOM_ANALYTICS_PAGEFLAG" value="tls_jxyp_qtzy" />
    </div>    
</template>

<script>
import { mapGetters } from 'vuex'
import TabsNewteach from '@/components/TabsNewteachs'
import BannerNewteach from '@/components/BannerNewteach'
import PageNewteach from '@/components/PageNewteach'
import YxNewteach from '@/components/YxNewteach'
import ZyNewteach from '@/components/ZyNewteach'
import { getResData } from '@/api/jxyp'
import { click } from '@/api/click' 
import { showResInfo,getStudentGroupData } from '@/api/kqyx'
export default {
    components:{
        TabsNewteach,BannerNewteach,PageNewteach,YxNewteach,ZyNewteach
    },
    data(){
        return{
            loading: true,
            tabPosition: 'bottom',
            activeIndex: 0,
            data: [       
                // {name: '本课资源',type: 0},
                
                // {name: '课件',type: 2},
                // {name: '素材',type: 3},
                // {name: '训练',type: 4},
                // {name: '网上作业',type: 5},
                // {name: '离线作业',type: 6},
                // {name: '拓展',type: 7},
                {name: '全部文件',type: 8,pvname:'tls_jxyp_qtzy'},
                {name: '预习',type: 1},
            ],//标签数组
            resList: [],//任务列表数组
            // pageCurrent:1, //当前页码
            pageSize:9, //每页个数      
            fankuiList:[],//反馈列表
            template:1,//模版         
            pageCurrent1:1, //任务当前页码
            pageCurrent2:1, //反馈分页        
            currentRcode: '',//当前要发送的任务rocde
            resInfoList:[],//任务详情数组
            reload:false,//是否重新加载
            parentFcode:'0',//父目录
            resListArrray:[],
            rowClickFlag:false

        }
    },
    computed: {
        ...mapGetters([
            'ksId'
        ]),
        //列表数组
        // resByPage(){
        //   return this.resList.filter((val,i) => i>=this.pageStart&&i<this.pageStart+this.pageSize)
        // },         
        // pageTotal(){
        //     return Math.ceil(this.resList.length/this.pageSize)
        // },
        // pageStart(){
        //   return (this.pageCurrent-1)*this.pageSize
        // },   
        
        //任务详情数组
        resInfoByPage(){
          return this.resInfoList.filter((val,i) => i>=this.pageStart&&i<this.pageStart+this.pageSize)
        },        
        resByPage(){
          return this.resList.filter((val,i) => i>=this.pageStart&&i<this.pageStart+this.pageSize)
        },          
        pageTotal(){
            return Math.ceil(this.resList.length/this.pageSize)
        },
        pageStart(){
          if(this.template == 1){
            return (this.pageCurrent1-1)*this.pageSize  
          }else{
            return (this.pageCurrent2-1)*this.pageSize
          }     
        },
        hasRes(){
          //是否有资源
          if(this.template == 1 && this.resList.length > 0){
            return true
          }else if(this.template == 2||this.template == 3||this.template == 4){
            return true
          }
          return false
        },          
    },    
    watch: {
        ksId(newVal,oldVal){
          if(newVal != ''){
              this.getTabsDataList()
          }
        }
    },
    mounted(){
        this.$refs.tabRef.setActiveName(this.data[0].name)
        this.getTabsDataList()

    },    
    methods: {
        //切换标签
        async tabClick(tab,event){
            console.log(tab,event)
            this.activeIndex = tab.index
            if(this.activeIndex == 0){
              this.pageCurrent1 = 1
              let resData = await getResData(this.data[this.activeIndex].type)                  
              this.resList = resData
              this.template = 1  
            }

            if(this.activeIndex == 1){
              //预习
              this.template = 2
              this.reload = !this.reload
            }

            // if(this.activeIndex == 1){
            //   //预习
            //   this.template = 2
            //   this.reload = !this.reload
            // }else if(this.activeIndex == 5){
            //   //我的网上作业
            //   this.template = 3
            //   this.reload = !this.reload
            // }else if(this.activeIndex == 6){
            //   //我的离线作业
            //   this.template = 4
            //   this.reload = !this.reload
            // }else{
            //   this.pageCurrent = 1
            //   let resData = await getResData(this.data[this.activeIndex].type)           
        
            //   this.resList = resData
            //   this.template = 1  
            // }
        },
        //获取当前标签下的资源
        async getTabsDataList(){

          if(this.activeIndex == 1){
            //预习
              this.template = 2
              this.reload = !this.reload           
              return false 
          }
          
          //其他资源
            this.resListArrray = []

            try{
              let resData = await getResData(this.data[this.activeIndex].type)     
              this.resList = resData
              this.template = 1         
              if(this.resList.length>0){
                this.resListArrray.push(this.resList)
                this.parentFcode=this.resList[0].parentfcode;
              }
            }catch(e){
              
            }finally{
              this.loading = false
            }    
        },     
        //点击整行事件(打开任务详情)
        async rowClick(row, column){
          console.log(row)
          console.log('row')
          if(row.playJs.playName == 'yuxiView'){
            let item = row
            this.currentRcode = item.rcode
            this.mode = 1 //当前模式预览
            let resultObj = await showResInfo(1,item)
            this.pageCurrent2 = 1
            this.resInfoList = resultObj.resInfoList
            this.template = resultObj.template               
          }else if(row.playJs.playName == 'playOfflineHomeworkRes'){
              //查看离线作业
              // let res = await getOfflineHomeworkInfoData(row.rcode)
              // console.log(res)
              // this.zyfkList = res.resList
              // this.zyfkUserList = res.userArr
              // this.zyfkShowUser = false
              // this.zyfkDialogVisible = true
          }else if(row.filetype=="file"){//文件夹类型
            if(this.resList.length>0){
              this.resListArrray.push(this.resList)
            }
            let resData = await getResData(this.data[this.activeIndex].type,row.rcode);     
            this.resList = resData
            this.template = 1   
            this.pageCurrent1 = 1
            if(this.resList.length>0){
              this.parentFcode=this.resList[0].parentfcode;
            }
          }else{
            click(row.playJs)
          }                            
        },
        //上一页/下一页
        // pageClick(val){
        //   if(val == 'pre'){
        //     this.pageCurrent--
        //   }else{
        //     this.pageCurrent++
        //   }
        // },    
        pageClick(val){
          if(this.template == 1){
            if(val == 'pre'){
              this.pageCurrent1--
            }else{
              this.pageCurrent1++
            }
          }else{
            if(val == 'pre'){
              this.pageCurrent2--
            }else{
              this.pageCurrent2++
            }
          }
        },    
        //展示任务选择
        async showSendJboDialog(){
          let res = await showData(this.currentRcode)
          this.subjobList.splice(0,this.subjobList.length)
          this.checkList.splice(0,this.checkList.length)
          this.subjobList = res

          for(let item of res){ 
            this.checkList.push(item.subjobid)
          }              
          this.dialogVisible = true
        },
        //确定发送任务
        async sendJob(){
          console.log(this.checkList)
          if(this.checkList.length == 0){
            this.$messageteach.error('至少选择一个任务才能发送')
          }else{
            this.dialogVisible = false
            //跳转到分组弹窗
            let groupRes = await getStudentGroupData(this.userSelectClassId)
						this.groupListBase = groupRes
            this.groupVisible = true
            this.userCheckList = []
            
            let arr = []
            for(let item of groupRes){
              let arr1 = []
              for(let val of item.memberInfo){
                this.userTotalNum ++
                arr1.push(val.code)
              }
              arr.push(arr1)
            }
            this.userIdList = arr
          }
        },    
        //从任务详情返回到任务列表
        goResList(){
          this.template = 1
        },   
        //点击按钮事件
        async handleButton(item,obj){
          //type:sendHomeWork:发送作业,fankui:反馈 ,faqitanjiu:发起探究
            this.currentRcode = item.rcode
            if(obj.type == 'sendHomeWork'){
              //发送作业
              this.showSendJboDialog()
            }else if(obj.type == 'fankui'){
              //反馈(跳转到反馈页面)
              this.pageCurrent2 = 1
              this.mode = 2 //当前模式为反馈
              let resultObj = await showResInfo(2,item,this)
              if(resultObj.template == 1){
                this.resList = resultObj.resInfoList
              }else{
                this.resInfoList = resultObj.resInfoList
              }          
              this.template = resultObj.template   
            }else if(obj.type == 'faqitanjiu'){
              //预习任务的发起探究
              let playJs = {'playName':'faqitanjiu','remark':'发起探究',params:{'playName':'faqitanjiu','rcode':item.rcode}}
              // click(playJs.params)
              let res = await sendToPadApi(item.rcode)
              if(res.flag == 1 || res.flag == 3){
                this.$messageteach.success(res.msg)

                let downloadUrl = getDownloadZipFileUrlApi(res.id)
                storage.set(DOWNLOAD_URL,downloadUrl)
                storage.set(KQYX_PAPER_ID,res.id)
                //跳转到pad的探究界面
                // this.$alert('跳转到pad探究页面,用控件下载zip包',{type:'error'})
                try{
                  VcomTeach.openNewBrowser('/teachui/#/pad/index?type=yuxizuoda','width=0&height=0&modal=true')
                }catch(e){

                }                  
                //监控yuxizuoda页面的关闭事件，然后打开当前预习任务的反馈     
                //调用ChildCloseNotify方法（打开预习内容）      
              }else{
                if(res.msg && res.msg.length > 0){
                  this.$messageteach.error(res.msg)
                }else{
                  this.$messageteach.error('发起探究失败')
                }
              }
            }else if(obj.type == 'yuxifankui'){
              //预习反馈
              let res = await getYuxiFankuiData(obj.playJs.params.rcode,obj.playJs.params.subjobid)
              console.log(res)
              this.yxfkList = res
              this.yxfkDialogVisible = true
            }else if(obj.type == 'jiancefankui'){
              console.log(obj)
              console.log(item)
              let index = obj.playJs.params.index + 1
              let arrTmp = commonUtils.objDeepCopy(this.resInfoList)
              let arr = arrTmp.splice(index,arrTmp.length - index -1)
              console.log(arr)
              let result = []
              for(let [index,item] of arr.entries()){
                if(index != 0){
                  if(typeof item.button != 'undefined'){
                    break
                  }
                }
                result.push(item)
              }
              console.log(result)
              this.jcfkResultList = result
              this.jcfkDialogVisible = true
            }
        },
        //预习任务的发起探究，关闭后回调当前任务的反馈按钮
        async ChildCloseNotify(params){
          console.log('回调参数')
          console.log(params)
          let obj = params
          if(obj.type == 'tls_yxzd'){
            this.pageCurrent2 = 1
            this.mode = 2 //当前模式为反馈
            let item = {}
            item.rcode = obj.paperId
            let resultObj = await showResInfo(2,item,this)
            if(resultObj.template == 1){
              this.resList = resultObj.resInfoList
            }else{
              this.resInfoList = resultObj.resInfoList
            }          
            this.template = resultObj.template   
          }else if(obj.type == 'setClass'){
            //设置上课状态
            this.$store.dispatch('setHavingClass',obj.code)
          }
        },    
        async goBack(){
          // let resData = await getResData(this.data[this.activeIndex].type,this.parentFcode);     
          // this.resList = resData
          // this.template = 1 
          // debugger
          // alert(this.resList[0].parentfcode)
          // this.parentFcode=this.resList[0].parentfcode;
          this.pageCurrent1 = 1
          this.resList=this.resListArrray.pop()
          this.template = 1
          this.parentFcode=this.resList[0].parentfcode;
        }                 
        
    }
}
</script>

<style>

</style>

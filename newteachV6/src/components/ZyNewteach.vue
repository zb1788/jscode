<template>
    <div class="flexdy">
      <div>
        <!-- <BannerNewteach/> -->
            <template>
              <div v-if="template == 1" >
                <div class="yxlist" v-if="hasRes">
                  <ul>
                    <li v-for="(item,index) in resByPage" :key="index" style="cursor:pointer">
                      <span @click="rowClick(item)" v-if="item.icon !='' && typeof item.icon !='undefined'"><img :src="item.icon" /></span>
                      <p v-html="item.title" @click="rowClick(item)">
                        <img v-if="item.useIcon !='' && typeof item.useIcon !='undefined'" :src="item.useIcon" /></p>
                      <span v-if="typeof item.button != 'undefined' && item.button.length > 0">
                        <el-button
                        type="primary" 
                        v-for="(buttonItem,i) in item.button.filter(val => val.enabled == true)"
                        :key="i"
                        :__VCOM_ANALYTICS="buttonItem.pvname" __VCOM_ANALYTICS_CLICK
                        @click.stop="handleButton(item,buttonItem)">{{buttonItem.name}}</el-button>
                        <el-button
                        type="primary" 
                        disabled
                        @click.stop="handleButton(item,buttonItem)"
                        v-for="buttonItem in item.button.filter(val => val.enabled == false)"
                        :key="buttonItem.name"
                        >{{buttonItem.name}}</el-button>                    
      
                      </span>
                    </li>
                  </ul>
                </div>                
                <div v-if="template == 1 && !loading && !hasRes" style="flex:1;"><img src="../assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></div>
                <div v-if="template == 1 && loading" style="flex:1;"><img src="../assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>加载中</p></div>
                <div class="flexh">         
                  <div>
                    <el-button v-if="type == 4" type="primary" @click="openPaper" __VCOM_ANALYTICS="tls_ktjx_znzj" __VCOM_ANALYTICS_CLICK>智能组卷</el-button>
                    <PageNewteach :pageCurrent="pageCurrent1" :pageTotal="pageTotal" @pageClick="pageClick"/>
                  </div>   
                </div>                                                 
            </div>
            <div v-if="template == 2">
                <div class="yxlist" v-if="hasRes">
                  <ul>
                    <li v-for="(item,index) in fankuiListByPage" :key="index" @click="fankuiRowClick(item)">
                      <p v-html="item.text"></p>
                      <span v-if="typeof item.button != 'undefined' && item.button.length > 0">
                        <el-button
                        type="primary" 
                        v-for="(buttonItem,i) in item.button.filter(val => val.enabled == true)"
                        :key="i"
                        @click.stop="fankuiClick(item,buttonItem)">{{buttonItem.name}}</el-button>
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
                <div v-if="template == 2 && !loading && !hasRes" style="flex:1;"><img src="../assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></div>
                <div class="flexh">         
                  <div>
                    <PageNewteach v-if="template == 2 && hasRes" :pageCurrent="pageCurrent2" :pageTotal="pageTotal" @pageClick="pageClick"/>
                    <el-button @click="goResList" type="warning" icon="el-icon-back"></el-button>
                  </div>   
                </div>  
              </div>                                               
            </template>     
      </div>
      <!-- 发送班级弹窗（选择要发送的班级） -->        
      <SelectClassNewteach @onSubmit="sendSubmit" @setClassSelectShow="setClassSelectShow" :dialogVisible="dialogVisible" :nowClassList="nowClassList" :needCheck="checkList" />
    <!-- <YjNewteachVisibilityDialog title = '选择班级' width="85%"  :visible.sync="dialogVisible" >
      <div class="sharepic">
      <div class="flex1">
          <YjNewteachCheckboxGroup v-model="checkList"  style="padding: 4vh; text-align: left;" >
            <YjNewteachCheckbox
            border
            v-for="item in nowClassList" 
            :key="item.classId" 
            :label="item.classId"
            :disabled="item.enable"        
            class="classPadding"
            >
            {{item.className}}
            </YjNewteachCheckbox>
          </YjNewteachCheckboxGroup>
      </div>
      <div class="h5m">
          <YjNewteachButton @click="cancel">取 消</YjNewteachButton>
          <YjNewteachButton type="primary" @click="sendSubmit">确 定</YjNewteachButton> 
          <div v-if="nowClassList.length == 0">暂无班级</div>      
      </div>
      </div>      
    </YjNewteachVisibilityDialog>           -->
      <!-- <DialogNewteach 
          title = '选择班级'
          :dialogVisible = "dialogVisible"
          @cancel="cancel"
          >
              <template v-slot>
                <span>
                    <el-checkbox-group v-model="checkList">
                      <el-checkbox 
                      v-for="item in nowClassList" 
                      :key="item.classId" 
                      :label="item.classId"
                      :disabled="item.enable"        
                      class="classPadding"
                      >
                      {{item.className}}
                      </el-checkbox>
                    </el-checkbox-group>
                    <div v-if="nowClassList.length == 0">暂无班级</div>
                </span>
              </template>
              <template v-slot:footbutton>
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="sendSubmit">确 定</el-button>                
              </template>            
      </DialogNewteach>          -->


    <YjNewteachVisibilityDialog title = '作业查看' width="85%"  :visible.sync="zyfkDialogVisible">
      <div>
        <YjNewteachCard class="box-card" style="margin-top: 0vh;">
          <div slot="header" class="clearfix">
            <span v-html="zyfkTitle"></span>    
          </div>
          <div style="padding:2vh;text-align:left; line-height: 2rem;">
            {{zyfkContent}}
          </div>
          <div style="text-align:left;">
                <el-image
            v-for="(item,index) in zyfkList" :key="index"
              style="width:4rem; height: 4rem;margin-right:1vw;margin-bottom: 1vh;cursor:pointer"
              :src="item.icon"
              @click.native="zyResPlay(item)"
              fit="fill"></el-image>
          </div>
        </YjNewteachCard>              
          <div v-if="zyfkShowUser" style="max-height: 18vh;overflow-y: auto;">
            <el-tag v-for="(item,index) in zyfkUserList" :key="index" @click="showUserZyfk(item)" :type="item.type" :class='item.type==""?"cur-point":""'>{{item.truename}}</el-tag>
          </div>
      </div> 
      <div>
        <div>
          <slot name="tips"></slot>
        </div>
        <div class="tcenter">
          <YjNewteachButton type="danger" icon="el-icon-close" circle @click="zyfkCancel" style="position: absolute; right: 1vh; bottom: 1vh;"></YjNewteachButton>       
        </div>
      </div>           
    </YjNewteachVisibilityDialog>


      <!-- 作业反馈byUser（某个人的作业反馈） -->
    <YjNewteachVisibilityDialog title = '作业反馈' width="85%"  :visible.sync="zyfkByUserDialogVisible">
      <div>
          <YjNewteachCard class="box-card" style="margin-top: 0vh;">
            <div style="padding:2vh;text-align:left; line-height: 2rem;">
              {{zyfkByUserContent}}
            </div>
            <div style="text-align:left;">
                  <el-image
              v-for="(item,index) in zyfkByUserList" :key="index"
              style="width:4rem; height: 4rem;margin-right:1vw;margin-bottom: 1vh;cursor:pointer"                
                :src="item.icon"
                @click.native="zyResPlay(item)"
                fit="fill"></el-image>
            </div>
          </YjNewteachCard>
      </div> 
      <div>
        <div>
          <slot name="tips"></slot>
        </div>
        <div class="tcenter">
          <YjNewteachButton type="danger" icon="el-icon-close" circle @click="zyfkByUserCancel" style="position: absolute; right: 1vh; bottom: 1vh;"></YjNewteachButton>       
        </div>
      </div>           
    </YjNewteachVisibilityDialog>      
  
    </div>    
</template>

<script>
import { mapGetters } from 'vuex'
import BannerNewteach from '@/components/BannerNewteach'
import PageNewteach from '@/components/PageNewteach'
import DialogNewteach from '@/components/DialogNewteach'
import SelectClassNewteach from '@/components/SelectClassNewteach'
import { getTabsData, getCurResData, getFankuiTqmsData, getFankuiEngData, getOfflineHomeworkInfoData,getOfflineHomeworkFankuiByUserInfoData} from '@/api/khzy'
import { getHasSendClass, sendHomeWorkBySysApi, sendHomeWorkByNormalApi, sendOfflineHomeworkApi, formatPaperTypeApi} from '@/api/interface'
import commonUtils from '@/utils/common'
import { click,openTqmsPracticePaperFromHomework } from '@/api/click'
export default {
    components:{
        BannerNewteach,
        PageNewteach,
        DialogNewteach,
        SelectClassNewteach
    },
    props:['type','reload','nowIndex','index'],
    data(){
        return{
            loading: true,
            template:1,//1资源列表2反馈列表
            data: [                                                                     
            ],//标签数组
            resList: [],//任务列表数组      
            fankuiList:[],//反馈列表
            pageCurrent1:1, //任务当前页码
            pageCurrent2:1, //反馈分页
            pageSize:9, //每页个数          
            dialogVisible: false,//发送弹窗是否展示
            zyfkDialogVisible: false, //作业反馈
            checkList: [], //选中的班级   
            sendClassList:[], //已经发送过的班级  
            nowClassList:[], //当前班级列表
            curButton:{},//当前点击的资源发送按钮
            zyfkTitle:'',
            zyfkContent:'',
            zyfkList:[],//当前反馈的列表
            zyfkUserList:[],//作业反馈的人员名单
            zyfkShowUser:false,//离线作业反馈是否显示人员名单
            zyfkByUserDialogVisible:false,//离线作业单个人反馈弹窗
            zyfkByUserList:[],
            zyfkByUserContent:'',
            needCheck:[],//选中的班级
            msgId:'',//我的套卷转换后的id，发送我的套卷要用
        }
    },
    computed: {
        ...mapGetters([
            'ksId',
            'userClassList',
            'userSelectClassId',
            'fullscreenLoading',
            'dialogFilter',
            'loginStyle',
            'teacherNumber',
            'userType'
        ]),
        //列表数组
        resByPage(){
          return this.resList.filter((val,i) => i>=this.pageStart&&i<this.pageStart+this.pageSize)
        },          
        fankuiListByPage(){
          return this.fankuiList.filter((val,i) => i>=this.pageStart&&i<this.pageStart+this.pageSize)          
        },
        pageTotal(){
          if(this.template == 1){
            return Math.ceil(this.resList.length/this.pageSize)
          }else{
            return Math.ceil(this.fankuiList.length/this.pageSize)
          }            
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
          }else if(this.template == 2 && this.fankuiList.length > 0){
            return true
          }
          return false
        },        
    },    
    watch: {
        reload(newVal,oldVal){
            if(newVal != oldVal){
                //只有当前的标签才请求数据
                if(this.nowIndex == this.index){
                    setTimeout(()=>{this.getRessDataList()},200)
                }               
            }
        },  
        userSelectClassId(newVal,oldVal){
          if(newVal != oldVal){
              this.getRessDataList()
          }
        }     
    },
    mounted(){
        if(this.nowIndex == this.index){
            //只有当前的标签才请求数据
            // this.getRessDataList()   
            setTimeout(()=>{this.getRessDataList()},200)
        }
    },    
    methods: {
        //获取当前标签下的资源
        async getRessDataList(){
            this.loading = true
            this.pageCurrent1 = 1
            this.template = 1

            try{
              let resData = await getCurResData(this.type)
              this.resList = resData
            }catch(e){
              
            }finally{
              this.loading = false
              console.log(this.loading)
            }
        },     
        //点击整行事件
        async rowClick(row, column){
          console.log(row)
          if(row.playJs){
            if(row.playJs.playName == "playHomeworkRes"){
              let url = row.playJs.params.url
              let title = row.playJs.params.title
              if(this.loginStyle == 0){
                //授课登录(控件打开)
                if(row.hwPaperType == 'listening'){
                  //英语练用工具条的关闭
                  VcomTeach.openNewBrowser(url,'xpos=0&ypos=0&width=0&height=0&modal=true&title='+title+'&showclose=true')
                }else{
                  //题库用他自己的关闭
                  VcomTeach.openNewBrowser(url,'xpos=0&ypos=0&width=0&height=0&modal=true')
                }                
              }else{
                window.open(url)
              }
            }else if(row.playJs.playName == 'playOfflineHomeworkRes'){
              //查看离线作业
              let res = await getOfflineHomeworkInfoData(row.rcode)

              this.zyfkTitle = res.title
              this.zyfkContent = res.content
              this.zyfkList = res.resList
              this.zyfkUserList = res.userArr
              this.zyfkShowUser = false
              this.zyfkDialogVisible = true
            }else if(row.playJs.playName == 'playPaperRes'){
              let url = row.playJs.params.url
              let title = row.playJs.params.title
              if(this.loginStyle == 0){
                //授课登录(控件打开)
                VcomTeach.openNewBrowser(url,'xpos=0&ypos=0&width=0&height=0&modal=true')
              }else{
                window.open(url)
              }
            }
          }         
        },        
        //上一页/下一页
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
        //智能组卷  
        openPaper(){
          openTqmsPracticePaperFromHomework(this.ksId,this.teacherNumber)
        },
        //按钮点击
        async handleButton(item,buttonItem){
          if(buttonItem.type == 'fasong'){
            this.curButton = buttonItem
            //发送到班级
            this.checkList = []
            this.nowClassList = this.userClassList
            this.sendClassList = []

            if(this.type == 3){
              //离线作业发送
              this.checkList.push(this.userSelectClassId)
            }else{
              let publishType = ''
              if(this.type == 0 || this.type == 1){
                publishType = 'sys'
              }else if(this.type == 2||this.type == 4){
                publishType = 'normal'
              }

              //查询已发送过的班级列表
              let homeworkIdTmp = ''
              let paperIdTmp = ''

              if(this.type == 4){
                //我的套卷发送
                //先调用试卷转换接口
                try{
                  let res = await formatPaperTypeApi(this.teacherNumber,this.ksId,item.rcode,this.userType)
                  console.log(res)
                  this.msgId = res.msgId

                  homeworkIdTmp= res.msgId
                  paperIdTmp = res.message                  
                }catch(e){
                  console.log(e)
                }              
              }else{
                homeworkIdTmp = item.homeworkId
                paperIdTmp = item.rcode
              }

              //获取已经发送过的班级
              try{
                let res = await getHasSendClass(publishType,homeworkIdTmp,paperIdTmp)
                if(res.length > 0){
                  let sendClassList = []
                  for(let item of res){
                    sendClassList.push(item.id)
                    this.checkList.push(item.id)
                  }
                  this.sendClassList = sendClassList
                  let arr = []              
                  for(let item of this.userClassList){
                    let obj = {}
                    obj.classId = item.classId
                    obj.className = item.className
                    if(commonUtils.findEleInArr(item.classId,sendClassList) == '-1'){
                      obj.enable = false
                    }else{
                      obj.enable = true
                    }
                    arr.push(obj)
                  }
                  this.nowClassList = arr
                }else{
                  this.checkList.push(this.userSelectClassId)
                }
              }catch(e){
                commonUtils.console('获取作业已发送班级接口失败',e)
              }
            }
            this.dialogVisible = true
          }else if(buttonItem.type == 'fankuiTqms'){
            //题库反馈
            this.loading = true
            this.template = 2
            this.pageCurrent2 = 1
            let res = await getFankuiTqmsData(item.rcode,item.hwPaperType)

            this.fankuiList = res
            this.loading = false
          }else if(buttonItem.type == 'fankuiEng'){
            //英语练反馈
            this.loading = true
            this.template = 2
            this.pageCurrent2 = 1
            let res = await getFankuiEngData(item.rcode)

            this.fankuiList = res
            this.loading = false
          }else if(buttonItem.type == 'fankuiOffline'){
              //查看离线作业
              let res = await getOfflineHomeworkInfoData(item.rcode)

              this.zyfkTitle = res.title
              this.zyfkContent = res.content
              this.zyfkList = res.resList
              this.zyfkUserList = res.userArr
              this.zyfkShowUser = true
              this.zyfkDialogVisible = true            
          }
        },
        //是否展示发送弹窗
        cancel(){
          this.dialogVisible = false
        },
        //发送弹窗点击确定
        async sendSubmit(checkClassL){
          let classArr = []
          for(let item of checkClassL){
            if(commonUtils.findEleInArr(item,this.sendClassList) == -1){
              classArr.push(item)
            }
          }

          if(classArr.length == 0){
            if(this.checkList.length > 0){
              this.$messageteach.error('请选择没有发送过的班级')
            }else{
              this.$messageteach.error('请选择要发送的班级')
            }            
            return false
          }else{
            if(this.type == 0 || this.type == 1){
              //发送系统作业
              let res = await sendHomeWorkBySysApi(this.curButton.playJs.params.paperId,classArr.join(','))
              if(res.status){
                this.$messageteach.success('发送成功')
                let resData = await getCurResData(this.type)            
                this.resList = resData
              }else{
                if(res.msg){
                  this.$messageteach.error(res.msg)
                }else{
                  this.$messageteach.error('发送失败')
                }
                return false
              }
            }else if(this.type == 2){
              //发送我的作业
              let res = await sendHomeWorkByNormalApi(this.curButton.playJs.params.homeworkId,classArr.join(','))
              if(res.status){
                this.$messageteach.success('发送成功')
                let resData = await getCurResData(this.type)            
                this.resList = resData
              }else{
                if(res.msg){
                  this.$messageteach.error(res.msg)
                }else{
                  this.$messageteach.error('发送失败')
                }
                return false
              }              
            }else if(this.type == 3){
              //发送离线作业
              let res = await sendOfflineHomeworkApi(this.curButton.playJs.params.rcode,classArr.join(','))
              //01服务器通信失败 02站内信发送成功，短信接收人手机号为控开关03站内信成功，短信平台返回发送结果为空04站内信发送失败05站内信发送成功，短信失败
              if(res.result == 1){
                this.$messageteach.success('发送成功')
              }else{
                if(res.errnum != '01' && res.errnum != '04' ){
                  this.$messageteach.success('发送成功')
                  let resData = await getCurResData(this.type)            
                  this.resList = resData                
                }else{
                  this.$messageteach.error('发送失败')
                }
              }
            }else if(this.type == 4){
              //我的套卷发送
              let res = await sendHomeWorkByNormalApi(this.msgId,classArr.join(','))
              if(res.status){
                this.$messageteach.success('发送成功')
                // let resData = await getCurResData(this.type)            
                // this.resList = resData
              }else{
                if(res.msg){
                  this.$messageteach.error(res.msg)
                }else{
                  this.$messageteach.error('发送失败')
                }
                return false
              }              
            }
          }
          this.dialogVisible = false
        },    
        //反馈点击
        fankuiClick(item,buttonItem){    
          if(buttonItem.playJs){
            if(buttonItem.playJs.playName == "shititongji"){
              let url = buttonItem.playJs.params.url
              let title = '试题统计'
              if(this.loginStyle == 0){
                //授课登录(控件打开)
                VcomTeach.openNewBrowser(url,'xpos=0&ypos=0&width=0&height=0&modal=true&title='+title+'&showclose=true')
              }else{
                window.open(url)
              }
            }
          }              
        },
        //从反馈详情返回到作业列表
        goResList(){
          this.template = 1
        },
        //点击反馈
        fankuiRowClick(item){
          if(item.playJs.playName != ''){
            let url = ''
            if(item.playJs.playName == 'openEngFankui' || item.playJs.playName == 'shititongji'){
              url = item.playJs.params.url             
              if(this.loginStyle == 0){
                //授课登录(控件打开)
                let title = '试题统计'
                VcomTeach.openNewBrowser(url,'xpos=0&ypos=0&width=0&height=0&modal=true&title='+title+'&showclose=true')
              }else{
                window.open(url)
              }              
            }             
          }
        },
        //作业反馈查看
        zyfkCancel(){
          this.zyfkDialogVisible = false
        },
        //查看离线作业个人反馈
        zyResPlay(item){
          if(item.playJs.playName != ''){
            // let params = {'playName':'playByChrome','params':{'url':item.playJs.params.url}}
            click(item.playJs)
          }
        },
        //查看
        async showUserZyfk(item){
          if(item.type == ''){
            //有反馈
            let res = await getOfflineHomeworkFankuiByUserInfoData(item.rcode,item.username)

            this.zyfkByUserContent = res.content
            this.zyfkByUserList = res.resList
            this.zyfkByUserDialogVisible = true
          }
        },
        zyfkByUserCancel(){
          this.zyfkByUserDialogVisible = false
        },
        //是否隐藏年级选择弹窗
        setClassSelectShow(flag){
            this.dialogVisible = flag
        }, 
    }
}
</script>

<style scoped>
.cur-point{
  cursor: pointer;
}

</style>

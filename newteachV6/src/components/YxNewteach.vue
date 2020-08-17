<template>
  <div class="flexdy">
    <div id="kqyxid">
		<!-- <BannerNewteach/> -->
        <template>
          <!-- 任务列表模版 -->
          <div style="flex:1" v-if="template == 1">
            <div class="yxlist" v-if="resByPage.length > 0">
              <ul>
                <li v-for="(item,index) in resByPage" :key="index" style="cursor: pointer;">
                  <span v-if="item.icon !='' && typeof item.icon !='undefined'" @click="rowClick(item,1)">
                    <img :src="item.icon" />
                  </span>
                  <div @click="rowClick(item,1)" style="flex: 1;display: flex;align-self: baseline;width: 0;">
                    <p style="flex:initial; line-height:6.8vh">{{ item.title }} </p>
                    <div style="flex:1;"><el-tag v-if="(item.useFlag==1||item.useFlag==2)&&type!=0" size="mini" style="margin:2vh 0">已用</el-tag></div>
                    <!-- <p><el-badge :value="12" class="item"><p @click="rowClick(item,1)">{{ item.title }}</p></el-badge></p> -->
                   </div>
                    <span v-if="typeof item.button != 'undefined' && item.button.length > 0" class="buttonWidthShort">

                        <template v-for="(buttonItem,i) in item.button">
                          <el-button
                          v-if="buttonItem.pvname !=''"
                          type="primary" 
                          :key="i"
                          :disabled="!buttonItem.enabled"
                          :__VCOM_ANALYTICS="buttonItem.pvname" __VCOM_ANALYTICS_CLICK
                          @click.stop="handleButton(item,buttonItem)">{{buttonItem.name}}</el-button> 
                          <el-button
                          v-else
                          type="primary" 
                          :key="i"
                          :disabled="!buttonItem.enabled"
                          @click.stop="handleButton(item,buttonItem)">{{buttonItem.name}}</el-button>                           
                        </template>
                     
                        <!-- <el-button
                        type="primary" 
                        v-for="(buttonItem,i) in item.button.filter(val => val.enabled == true)"
                        :key="i"
                        @click.stop="handleButton(item,buttonItem)">{{buttonItem.name}}</el-button>
                        <el-button
                        type="primary" 
                        disabled=""
                        v-for="buttonItem in item.button.filter(val => val.enabled == false)"
                        :key="buttonItem.name"
                        >{{buttonItem.name}}</el-button>                     -->
      
                      </span>
                  
                </li>
              </ul>
            </div>            
            <div v-if="template == 1 && !loading  && !hasRes" style="flex:1;"><img src="../assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></div>
            <div class="flexh" v-if="template == 1 && hasRes">         
              <div>
                <PageNewteach :pageCurrent="pageCurrent1" :pageTotal="pageTotal" @pageClick="pageClick"/>                
              </div>   
            </div>
          </div>
          <!-- 任务详情，任务反馈模版 -->
          <div v-if="template == 2 ">
            <div class="yxlist" v-if="resInfoList.length>0" :class="resInfoByPage[0].html?'yxscroll':''">
              <ul>
                <li v-for="(item,index) in resInfoByPage" :key="index" @click="rowClick(item,2)" :class="[item.html?'lihtml':'',item.isClick?'cur-point':'']"  style="height:auto;min-height:6.8vh;">
                  <span v-if="item.icon !='' && typeof item.icon !='undefined'"><img :src="item.icon" /></span>
                  <p v-html="item.title" style="white-space:normal;">
                    <img v-if="item.useIcon !='' && typeof item.useIcon !='undefined'" :src="item.useIcon" />
                  </p>
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
            <div v-if="template == 2 && !hasRes" style="flex:1;"><img src="../assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></div>
            <div class="flexh">         
              <div>
                <el-button v-if="template == 2 && hasRes" type="primary" icon="el-icon-plus" @click="showSendJboDialog">发送作业</el-button>         
                <PageNewteach v-if="template == 2 && hasRes" :pageCurrent="pageCurrent2" :pageTotal="pageTotal" @pageClick="pageClick"/>
                <el-button v-if="template == 2" @click="goResList" type="warning" icon="el-icon-back"></el-button>
              </div>   
            </div>
          </div>
        </template> 
    </div>
    <!-- 发送作业弹窗（选择要发送的任务） -->
    <!-- <DialogNewteach 
        title = '发送任务'
        :dialogVisible = "dialogVisible"
        @cancel="cancel"
        >
     </DialogNewteach>         -->
    <YjNewteachVisibilityDialog title = '发送任务'  :visible.sync="dialogVisible">     
      <div>
        <div>
              <span>
                  <YjNewteachCheckboxGroup v-model="checkList">
                    <YjNewteachCheckbox
                    v-for="subjob in subjobList" 
                    :key="subjob.subjobid" 
                    :label="subjob.subjobid"              
                    >
                    {{subjob.subjobname}}
                    </YjNewteachCheckbox>
                  </YjNewteachCheckboxGroup>
                  <div v-if="subjobList.length == 0">暂无任务</div>
              </span>          
        </div>
        <div class="tcenter">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="sendSubmit">确 定</el-button>      
        </div>
      </div>        
      </YjNewteachVisibilityDialog>                


    <!-- 发送作业弹窗（选择要发送的人员） -->
    <YjNewteachVisibilityDialog title = '发送作业' width="95%" max-height="75vh" :visible.sync="groupVisible" :is-header="false" >
      <el-tag v-if="!hasGroup" style="text-align:left;margin: 0 2.5vh;">班级无小组，可直接选择学生进行答题</el-tag>
      <el-tag v-if="hasGroup" style="text-align:left;margin: 0 2.5vh;">点击组名可快速选中当前组下所有成员</el-tag>
      <yjNewteachStudentGroup v-if="hasGroup" ref="groupRef" v-model="userCheckList" :data="groupListBase" group-name-align="bottom" :click-group-name="groupNameHandle" :show-checkbox="showCheckbox"></yjNewteachStudentGroup>
      <yj-newteach-group
        v-if="!hasGroup"		
        v-model="userCheckListNoGroup" 
        :show-checkbox=true
        style="overflow-y:auto;"
      >
        <div>
          <yj-newteach-group-option 
          :label="stu.studentId"
          v-for="stu in groupListBase" :key="stu.studentId"
          style-theme=""
          >
          {{stu.studentName}}
          </yj-newteach-group-option>
        </div>
      </yj-newteach-group>
      <div>
        <div>
          <slot name="tips"></slot>
        </div>
        <div class="tcenter">
          <YjNewteachCheckbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</YjNewteachCheckbox>
          <el-button @click="groupCancel">取 消</el-button>
          <el-button type="primary" @click="groupSubmit">发 送</el-button>             
        </div>
      </div>
    </YjNewteachVisibilityDialog>


  
    <YjNewteachVisibilityDialog title = '预习反馈' width="85%"  :visible.sync="yxfkDialogVisible">
      <div style="max-height:55vh;overflow-y:auto;">
        <el-tag v-for="(item,index) in yxfkList" :key="index" @click="showUserYxfk(item)" :type="item.type">{{item.stuname}}</el-tag>
        <div v-if="yxfkList.length == 0">暂无反馈</div>
      </div> 
      <div>
        <div>
          <slot name="tips"></slot>
        </div>
        <div class="tcenter">
          <YjNewteachButton size="mini" type="danger" icon="el-icon-close" circle @click="yxfkCancel" style="position: absolute; right: 1vh; bottom: 1vh;"></YjNewteachButton>       
        </div>
      </div>           
    </YjNewteachVisibilityDialog>
    <!-- <DialogNewteach 
        title = '预习反馈'
        dialogWidth = '80%'
        :footerVisible = false
        :dialogVisible = "yxfkDialogVisible"
        @cancel="yxfkCancel"
        >
            <template v-slot>
              <div style="max-height:55vh;overflow-y:auto;">
                <el-tag v-for="(item,index) in yxfkList" :key="index" @click="showUserYxfk(item)" :type="item.type">{{item.stuname}}</el-tag>
                <div v-if="yxfkList.length == 0">暂无反馈</div>
              </div>
              <el-button size="mini" type="danger" icon="el-icon-close" circle @click="yxfkCancel" style="position: absolute; right: 1vh; bottom: 1vh;"></el-button>       
            </template>
     </DialogNewteach> -->
     <!-- 预习反馈中查看某个人的反馈 -->
    <YjNewteachVisibilityDialog :title = 'yxfkUserName' width="85%"  :visible.sync="yxfkByUserDialogVisible">
      <AutoPageNewteach @handleClick="yxfkPersonResPlay" :resList="yxfkUserResultList" :pageSize="5"/>      
      <div>
        <div>
          <slot name="tips"></slot>
        </div>
        <div class="tcenter">
          <YjNewteachButton size="mini" type="danger" icon="el-icon-close" circle @click="yxfkByUserCancel" style="position: absolute; right: 0vh; bottom: 0vh;"></YjNewteachButton>       
        </div>
      </div>           
    </YjNewteachVisibilityDialog>
    <!-- <DialogNewteach 
        :title = 'yxfkUserName'
        dialogWidth = '80%'
        :footerVisible = false
        :dialogVisible = "yxfkByUserDialogVisible"
        @cancel="yxfkByUserCancel"
        >
            <template v-slot>
              <AutoPageNewteach @handleClick="yxfkPersonResPlay" :resList="yxfkUserResultList" :pageSize="5"/>
              <el-button size="mini" type="danger" icon="el-icon-close" circle @click="yxfkByUserCancel" style="position: absolute; right: 1vh; bottom: 1vh;"></el-button>       
            </template>
     </DialogNewteach>  -->

    <!-- 检测反馈 -->
    <YjNewteachVisibilityDialog title = '检测反馈' width="90%"  :visible.sync="jcfkDialogVisible">
      <AutoPageNewteach @handleClick="jcfkResPlay" :resList="jcfkResultList" :pageSize="5"/>
      <br>
      <div>
        <div>
          <slot name="tips"></slot>
        </div>
        <div class="tcenter">
          <YjNewteachButton size="mini" type="danger" icon="el-icon-close" circle @click="jcfkCancel" style="position: absolute; right: -0vh; bottom: 0vh;"></YjNewteachButton>       
        </div>
      </div>           
    </YjNewteachVisibilityDialog>    
    <!-- <DialogNewteach 
        title = '检测反馈'
        dialogWidth = '80%'
        :footerVisible = false
        :dialogVisible = "jcfkDialogVisible"
        @cancel="jcfkCancel"
        >
            <template v-slot>
              <AutoPageNewteach @handleClick="jcfkResPlay" :resList="jcfkResultList" :pageSize="5"/>
              <el-button size="mini" type="danger" icon="el-icon-close" circle @click="jcfkCancel" style="position: absolute; right: 1vh; bottom: 1vh;"></el-button>       
            </template>          
     </DialogNewteach>       -->


    <YjNewteachVisibilityDialog title = '自主提问' width="85%"  :visible.sync="questionDialogVisible">
      <div style="max-height:55vh;min-height:10vh;overflow-y:auto;">

        <div  v-html="questionDetail"></div>
      </div>
      <div>
        <div>
          <slot name="tips"></slot>
        </div>
        <div class="tcenter">
          <YjNewteachButton size="mini" type="danger" icon="el-icon-close" circle @click="questionCancel" style="position: absolute; right: 1vh; bottom: 1vh;"></YjNewteachButton>       
        </div>
      </div>           
    </YjNewteachVisibilityDialog>
     <!-- <DialogNewteach 
        title = '自主提问'
        dialogWidth = '80%'
        :footerVisible = false
        :dialogVisible = "questionDialogVisible"
        @cancel="questionCancel"
        >
            <template v-slot>
              <div style="max-height:55vh;overflow-y:auto;">

                <div  v-html="questionDetail"></div>
              </div>
              <el-button size="mini" type="danger" icon="el-icon-close" circle @click="questionCancel" style="position: absolute; right: 1vh; bottom: 1vh;"></el-button>       
            </template>
     </DialogNewteach>             -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TabsNewteach from '@/components/TabsNewteachs'
import BannerNewteach from '@/components/BannerNewteach'
import DialogNewteach from '@/components/DialogNewteach'
import PageNewteach from '@/components/PageNewteach'
import AutoPageNewteach from '@/components/AutoPageNewteach'
import { getResList, formatPreviewRes, showData,showResInfo, sendRecommend, getYuxiFankuiData, getYuxifankuiResultByUserData,getStudentByClassData,getStudentGroupData} from '@/api/kqyx'
import { getDownloadZipFileUrlApi, sendToPadApi ,sendRecommendApi} from '@/api/interface'
import { click } from '@/api/click'
import commonUtils from '@/utils/common'
import storage from '@/utils/storage'
import { DOWNLOAD_URL,KQYX_PAPER_ID } from '@/api/constant'


export default {
    name:'kqyxComponents',
    components:{
        TabsNewteach,
        BannerNewteach,
        DialogNewteach,
        PageNewteach,
        AutoPageNewteach
    },
    props:['type','reload','nowIndex','index'],
    data(){
        return {
            loading: true,
            resList: [],//任务列表数组
            resInfoList: [],//任务详情数组
            dialogVisible: false,//发送任务弹窗是否展示
            groupVisible: false, //发送分组人员弹窗是否展示
            yxfkDialogVisible:false,//预习反馈弹窗
            yxfkByUserDialogVisible:false,//预习反馈查看单个人反馈
            jcfkDialogVisible:false,//监测反馈资源列表
            yxfkUserName:'',//预习反馈查看单个人的姓名
            checkList: [], //选中的任务
            subjobList: [], //任务内容
            currentRcode: '',//当前要发送的任务rocde
            template: 1, //1,任务列表 2任务详情列表
            isIndeterminate: false, //全选的监控
            checkAll:false, //全选的监控
            userIdList: [],//分组中的所有的checkbox
            tableData: [],//分组表格数据
            groupListBase:[],//分组数据
            baseStudent:{},//根据学生ID获取学生姓名
            groupNameHandle:true,//分组名称是否可以点击选中
            hasGroup:false,//是否有分组数据
            userCheckList: {}, //当前选中的人员
            userCheckListNoGroup:[],//没有分组的清空下选中的人员
            showCheckbox:true,
            userTotalNum:0,//分组中学生的个数，分组用
            mode:"", //1.预览 2，反馈(我的预习才有) 3，电子书包查看反馈
            pageCurrent1:1, //当前页码（模版1）
            pageCurrent2:1,//当前页码（模版2）
            pageSize:9, //每页个数
            yxfkList: [],//预习反馈弹窗列表
            yxfkUserResultList:[],//预习反馈查看单个人的反馈结果列表
            jcfkResultList:[],//检测反馈列表
            groupVisible111:false,
            questionDialogVisible:false,//学生自主提问弹窗
            questionDetail:'',//学生自主提问详情
        }
    },
    computed: {
        ...mapGetters([
            'ksId',
            'dialogFilter',
            'fullscreenLoading',
            'isHavingClass',
            'userSelectClassId',
            'loginStyle',
            'transferProtocol',
            'domainConfig'
        ]),
        //列表数组
        resByPage(){
          return this.resList.filter((val,i) => i>=this.pageStart&&i<this.pageStart+this.pageSize)
        },
        //任务详情数组
        resInfoByPage(){
          return this.resInfoList.filter((val,i) => i>=this.pageStart&&i<this.pageStart+this.pageSize)
        },
        hasRes(){
          //是否有资源
          if(this.template == 1 && this.resList.length > 0){
            return true
          }else if(this.template == 2 && this.resInfoList.length > 0){
            return true
          }
          return false
        },
        pageStart(){
          if(this.template == 1){
            return (this.pageCurrent1-1)*this.pageSize  
          }else{
            return (this.pageCurrent2-1)*this.pageSize
          }          
        },
        pageTotal(){
          if(this.template == 1){
            return Math.ceil(this.resList.length/this.pageSize)
          }else{
            return Math.ceil(this.resInfoList.length/this.pageSize)
          }
        },
    },
    watch: {
        ksId(newVal,oldVal){
          if(newVal != ''){
              // this.getResList()
          }
        },
        userSelectClassId(newVal,oldVal){
          if(newVal != ''){
              this.getResList()
          }
        },        
        async isHavingClass(newVal,oldVal){
          console.log('上课状态=='+oldVal)
          if(newVal != oldVal){
            if(this.template == 1){
              //刷新列表，显示发起探究按钮
              let res = await formatPreviewRes(this.type)
              this.resList = res
            }
          }
        },
        //根据选中的数量判断是全选/部分选择/未选
        userCheckList(val){
          let checkedCount = 0
          let arr = Object.keys(val)
          for(let i=0; i<8; i++){
            if(typeof val[i] != 'undefined'){
              checkedCount += val[i].length
            }            
          }

          this.checkAll = checkedCount === this.userTotalNum
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.userTotalNum
        },
        userCheckListNoGroup(val){
          this.checkAll = val.length === this.userTotalNum
          this.isIndeterminate = val.length > 0 && val.length < this.userTotalNum
        },
        reload(newVal,oldVal){
            if(newVal != oldVal){
                //只有当前的标签才请求数据
                if(this.index == this.nowIndex){
                    setTimeout(()=>{this.getResList()},200)
                }              
            }
        },                       
    },
    mounted(){
        if(this.index == this.nowIndex){
            //只有当前的标签才请求数据
            setTimeout(()=>{this.getResList()},200)
        }
        
        window.addEventListener('doYxfankui', this.doYxfankui)                  
    },
    destroyed(){
      window.removeEventListener('doYxfankui', this.doYxfankui)
    },
    methods: {
        async getResList(){
            this.loading = true
            this.template = 1
            this.pageCurrent1 = 1
            this.pageCurrent2 = 1

            console.log('reslist:::'+this.isHavingClass)

            try{
              let res = await formatPreviewRes(this.type)
              this.resList = res  
            }catch(e){
              console.log(e)
            }finally{
              this.loading = false
            }                        
        },
        //点击按钮事件
        async handleButton(item,obj){
          //type:sendHomeWork:发送作业,fankui:反馈 ,faqitanjiu:发起探究
            if(this.template == 1){
              this.currentRcode = item.rcode
            }
            
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
                  VcomTeach.openNewBrowser('/teachui/#/pad/index?type=yuxizuoda','xpos=&ypos=&width=&height=&modal=true')
                  // VcomTeach.openNewBrowser(this.transferProtocol + this.domainConfig["PORTAL"] + '/teachui/#/pad/index?type=yuxizuoda','xpos=&ypos=&width=&height=&modal=true')                  
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

              this.yxfkList = res
              this.yxfkDialogVisible = true
            }else if(obj.type == 'jiancefankui'){

              let index = obj.playJs.params.index + 1
              let arrTmp = commonUtils.objDeepCopy(this.resInfoList)
              let arr = arrTmp.splice(index,arrTmp.length - index -1)
              let result = []
              for(let [index,item] of arr.entries()){
                if(index != 0){
                  if(typeof item.button != 'undefined'){
                    break
                  }
                }
                if(item.playJs.params.rsType != 'undefined'){
                  let rsType = item.playJs.params.rsType;
                  if(rsType==2||rsType==6||rsType==9){
                    item.playJs.playName="fankui"
                    result.push(item)
                  }
                }
                
              }

              this.jcfkResultList = result
              this.jcfkDialogVisible = true
            }
        },
        //设置上下课状态
        doSetClassStatus(params){
          this.$store.dispatch('setHavingClass',params.code)
        },
        //预习任务的发起探究，关闭后回调当前任务的反馈按钮
        async doYxfankui(e){
          let obj = e.detail
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

        },
        //点击整行事件
        //type:(1,打开任务详情2,播放任务详情中的某条资源)
        async rowClick(item, type){
          //this.pageCurrent2 = 1
          //判断栏目是否可点
          if(!item.isClick){
            return false
          }

          if(type == 1){
            this.currentRcode = item.rcode
            this.mode = 1 //当前模式预览
            let resultObj = await showResInfo(1,item)


            this.pageCurrent2 = 1
            this.resInfoList = resultObj.resInfoList
            this.template = resultObj.template   
          }else{
            if(item.questionFlag){//学生自主提问
              this.questionDialogVisible=true;
              this.questionDetail=item.title;
            }else{
              click(item.playJs)
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
          if(this.checkList.length == 0){
            this.$messageteach.error('至少选择一个任务才能发送')
          }else{
            this.dialogVisible = false
            //跳转到分组弹窗
            let groupRes;
            try{
              let result = await getStudentGroupData(this.userSelectClassId)
              groupRes = result.groupList
              for(let item of groupRes){
                if(item.students.length >0){
                  this.hasGroup = true
                  break
                }
              }
            }catch(e){
              this.$messageteach.error('获取分组名单失败！')
              return false
            }


            if(!this.hasGroup){
              //没有分组则获取所有班级学生
              let res = await getStudentByClassData()
              this.groupListBase = res
            }else{
              this.groupListBase = groupRes
            }
						
            this.groupVisible = true
            this.userCheckList = {}
            this.userCheckListNoGroup =[]
            this.userTotalNum = 0
            if(this.hasGroup){
              for(let item of this.groupListBase){
                for(let val of item.students){
                  this.userTotalNum ++
                }
              }
            }else{
              this.userTotalNum = this.groupListBase.length
              let arr = []
              for(let item of this.groupListBase){
                arr.push(item.studentId)
                this.baseStudent['"' + item.studentId + '"'] = item.studentName
              }
              this.userIdList = arr
            }
          }
        },
        //分组弹窗打开后的回调
        groupOpen(){
          // document.getElementById('groupDialog').style.height = document.body.clientHeight*2/3+'px'
          let offset = document.body.clientHeight*15/100
          document.getElementById('groupDialog').style.height = (document.getElementById('kqyxid').clientHeight-90-offset)+'px'          
        },
        //选择好人员开始发送作业
        async sendJobByUser(){
          let userCheckArr = []
          let checkedCount = 0

          if(this.hasGroup){
            let arr = Object.keys(this.userCheckList)
            
            for(let i=0; i<8; i++){
              if(typeof this.userCheckList[i] != 'undefined'){
                checkedCount += this.userCheckList[i].length
              }            
            } 
            userCheckArr = this.userCheckList
          }else{
            checkedCount= this.userCheckListNoGroup.length
            userCheckArr = this.userCheckListNoGroup         
          }
         
          if(checkedCount == 0){
            this.$messageteach.error('请选择学生')            
          }else{
              // this.fullscreenLoading = true;
            let params = sendRecommend(this.baseStudent,userCheckArr,this.hasGroup,this.currentRcode,this.checkList)
            try{
              let res = await sendRecommendApi(params.username,params.truename,params.classIds,params.classNames,params.number,params.id,params.subJobs)
              if(res.flag == 1 || res.flag == 3){
                this.groupVisible = false
                this.$messageteach.success(res.msg)
                //重刷当前列表
                let result = await formatPreviewRes(this.type)
                this.resList = result
              }else{
                // 2 "很抱歉，您今天发送预习的条数已用完！"
                // 3 "您已经发送过该预习！"
                // 4 "发送消息失败"
                // 5 "发送试卷信息失败" 
                this.$messageteach.info(res.msg)
              }
            }catch(e){
              this.$messageteach.error('发送失败，请稍候重试')
              commonUtils.console('发送预习任务失败',e)
            }
          }
        },
        //从任务详情返回到任务列表
        goResList(){
          this.template = 1
        },
        //播放资源
        playRes(param){

        },
        //分组弹窗全选的change事件
        handleCheckAllChange(val) {
          if(this.hasGroup){
            if(!val){
              this.$refs.groupRef.unSelectAll()
            }else{
              this.$refs.groupRef.selectAll()
            }
          }else{
            console.log(val)
            if(!val){
              this.userCheckListNoGroup = []
            }else{
              this.userCheckListNoGroup = this.userIdList
            }
          }
        },
        //是否展示发送任务弹窗
        cancel(){
            this.dialogVisible = false
        },
        //发送任务弹窗点击确定
        async sendSubmit(event){
          if(this.checkList.length == 0){
            console.log(event)
            this.$messageteach.error('至少选择一个任务才能发送')
            // let obj = {'message':'至少选择一个任务才能发送',type:'error',offset:event.clientY}
            // this.$messageteach(obj)
            // this.$messageteach({'type':'error','message':'afadsf','event':event,'offsetHeight':-6})
            return false
          }
          this.dialogVisible = false
          this.sendJob()
        },
        //是否展示分组弹窗
        groupCancel(){
            this.groupVisible = false
        },
        //分组弹窗点击确定
        async groupSubmit(){            
            this.sendJobByUser()
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
        //预习反馈弹窗关闭
        yxfkCancel(){
          this.yxfkDialogVisible = false
        },
        //预习反馈，点击人名查看详情
        async showUserYxfk(item){
          if(item.finishflag != 0){
            //展示内容
            let res = await getYuxifankuiResultByUserData(item.rcode,item.subjobid,item.stuid)

            this.yxfkUserName = item.stuname
            this.yxfkUserResultList = res
            this.yxfkByUserDialogVisible = true
          }
        },
        //预习反馈个人反馈结果弹窗取消
        yxfkByUserCancel(){
          this.yxfkByUserDialogVisible = false
        }, 
        //播放个人反馈结果中的资源
        yxfkPersonResPlay(item){
          if(item.playJs.playName != ''){
            click(item.playJs)
          }
        },
        //检测反馈弹窗关闭
        jcfkCancel(){
          this.jcfkDialogVisible = false
        },
        //检测反馈资源播放
        jcfkResPlay(item){
          click(item.playJs)
        },
        //自主提问弹窗关闭
        questionCancel(){
          this.questionDialogVisible = false
        }    
    }    
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tabs{background:#fff;}
.flexdy{display: flex; flex-direction:column; flex:1;height: 100%;}
.flexdy>.nry{flex: 1;}
/* .yxlist {background:#fff; height: 100%; padding: 1vh;}
.yxlist ul {margin:0 1vh;    -webkit-padding-start:0}
.yxlist li {display: flex; width: 100%; border-bottom: solid 1px #efefef; }
.yxlist li>*{align-self: center; text-align: left;} */
.yxlist li p {flex: 1; font-size:0.9rem; padding: 0 1vw; color: #666; overflow: hidden; white-space: "normal"; text-overflow: "";}
.el-tabs--border-card{height: 100%; display: flex; flex-direction: column;}
.textR {text-align: right;}
.kqyxnx {flex: 1; }
.lihtml{
  height:auto;
}

.yxscroll{
  overflow: auto;
}
.buttonWidthShort{
    /* width: 12rem; */
    padding-left: 0.5rem;
}
/* .buttonWidthLong{
  width:24vw;
} */

</style>
<style type="text/scss" lang="scss">
  .cur-point{
    cursor: pointer;
  }
  .no-group-tips {
    text-align: left;
  }

  .student-group {
    display: flex;
    padding: 0 2vh;
    flex-direction: column;
    flex:1;

    .middle {
      flex: 1;
      width: 100%;
      border-radius: 1vh;
      display: flex;
      flex-direction: column;
      padding: 2vh 0;

      .yj-newteach-group {
        padding: 0;
        flex: 1;
        height: 0;
        display: flex;

        .el-row {
          margin: 0 !important;
          display: flex;
          flex: 1;

          .el-col {
            flex: 1;
            display: flex;
            padding: 0 0.5vh !important;

            .yj-newteach-group-item {
              background: #efefef;
              flex: 1;
              .yj-newteach-group-option label {
                width: 3rem;
                vertical-align: bottom;
              }
              .yj-newteach-group-option span.line {
                display: none
              }
              .yj-newteach-group-option.group:nth-child(2) {
                border-radius: 5px 5px 0 0;
              }

            }
          }
        }
      }
    }
  }


  .fzlabel {
    line-height: 2rem;
    text-align: center;
    cursor: pointer;
  }

  .tcenter {
    text-align: center;
    padding: 1vh;
  }
</style>
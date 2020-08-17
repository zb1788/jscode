<template>
    <div style="height:100%; position:relative">
    <!-- <BannerNewteach/> -->
    <TabsNewteach
    ref="tabRef"
    :tabPosition="tabPosition"
    :data="data"
    @tabClick="tabClick"
    >
        <template v-slot>
            <div v-if="resList.length == 0"><img src="@/assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></div>
            <div class="yxlist" style="padding: 2vh 0 0 0;" v-if="resList.length > 0">
              <ul>
                <li v-for="(item,index) in resByPage" :key="index" @click="rowClick(item)" :__VCOM_ANALYTICS="item.pvname" __VCOM_ANALYTICS_CLICK style="cursor: pointer;">
                  <span><img :src="item.icon" /></span>
                  <p>{{ item.title }} 
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
                    disabled=""
                    v-for="buttonItem in item.button.filter(val => val.enabled == false)"
                    :key="buttonItem.name"
                    >{{buttonItem.name}}</el-button>                    
  
                  </span>
                </li>
              </ul>
            </div>   
            <div class="flexh">         
              <div class="flex-lr">
                 
				  <div>
                  <el-button v-if="data[activeIndex].type == 2" type="primary" @click="openPaper" __VCOM_ANALYTICS="tls_ktjx_znzj" __VCOM_ANALYTICS_CLICK>智能组卷</el-button>
                  <PageNewteach :pageCurrent="pageCurrent" :pageTotal="pageTotal" @pageClick="pageClick"/>
				  </div>
				   <el-tag v-if="data[activeIndex].type == 2">注：训练名称后的（a/b）表示本套训练共b道题，其中选择和判断题a道；</el-tag>
              </div>   
            </div>                
        </template>
    </TabsNewteach>
    <el-button style="right:1.5vh; bottom:1.2vh; z-index:8; position:absolute;" type="warning" icon="el-icon-back" @click="goBack();">返回授课包</el-button>
        <!-- 文件探究 弹窗 -->
        <SendPadNewteach 
        :downloadUrl="tanjiuObj.downloadUrl" 
        :format="tanjiuObj.format" 
        :rcode="tanjiuObj.rcode" 
        :filename="tanjiuObj.filename" 
        @sendPadClose="sendPadClose" 
        :dialogVisiable="sendPadDialogVisible" />
    </div>    
</template>

<script>
import { mapGetters } from 'vuex'
import TabsNewteach from '@/components/TabsNewteachs'
import BannerNewteach from '@/components/BannerNewteach'
import PageNewteach from '@/components/PageNewteach'
import { getResListData } from '@/api/ktjx'
import { click,openTqmsPracticePaper } from '@/api/click'
import { getDownLoadUrl } from '@/api/play'
import SendPadNewteach from '@/components/SendPadNewteach'
import { ABLEFORMAT } from '@/api/constant'
export default {
    components:{
        TabsNewteach,
        BannerNewteach,
        PageNewteach,
        SendPadNewteach
    },
    data(){
        return{
            sendPadDialogVisible:false,
            fullscreenLoading:false,
            tabPosition: 'bottom',
            activeIndex: 0,
            data: [
                {
                    name: '课件',
                    type: 0,
                    pvname:'tls_ktjx_kj'
                },
                {
                    name: '素材',
                    type: 1,
                    pvname:'tls_ktjx_sc'
                },
                {
                    name: '训练',
                    type: 2,
                    pvname:'tls_ktjx_xl'
                },
                {
                    name: '拓展',
                    type: 3,
                    pvname:'tls_ktjx_tz'
                },
                {
                    name: '电子教材',
                    type: 4,
                    pvname:'tls_ktjx_dzjc'
                },
                // {
                //     name: '返回授课包',
                //     type: 5,
                //     tabIcon: 'el-icon-back',
                //     styleTheme:'back'
                // }                                                                                
            ],//标签数组
            resList: [],//任务列表数组
            pageCurrent:1, //当前页码
            pageSize:9, //每页个数     
            tanjiuObj:{
                filename:'',
                rcode:'',
                format:'',
                downloadUrl:''
            }       
        }
    },
    computed:{
        ...mapGetters([
            'ksId',
            'isHavingClass',
            'teacherNumber',
            'userSelectClassId'
        ]),        
        //列表数组
        resByPage(){
          return this.resList.filter((val,i) => i>=this.pageStart&&i<this.pageStart+this.pageSize)
        },        
        pageTotal(){
            return Math.ceil(this.resList.length/this.pageSize)
        },
        pageStart(){
          return (this.pageCurrent-1)*this.pageSize
        },
    },
    watch:{
        ksId(newVal,oldVal){
            if(newVal != oldVal){
                this.pageCurrent = 1
                this.getResList()
            }
        },
        isHavingClass(newVal, oldVal){
            //上课状态发生变化重刷列表
            if(newVal != oldVal){
                this.pageCurrent = 1
                this.getResList()
            }
        },
        userSelectClassId(newVal, oldVal){
            //班级发生变化重刷列表
            if(newVal != oldVal){
                this.pageCurrent = 1
                this.getResList()
            }
        },           
    },    
    mounted(){
        let index = this.$route.query.index
        if(typeof index != 'undefined'){
            this.activeIndex = index
        }
        this.$refs.tabRef.setActiveName(this.data[this.activeIndex].name)
        if(this.ksId != ''){
            this.getResList()
        }        

        //智能组卷回调，重新刷新训练列表
        window.addEventListener('doZnzj', this.getResList)
        //训练作答关闭重刷当前页面
        window.addEventListener('doXlzd', this.getResList)         
        //训练发到平板回调，打开反馈页面
        window.addEventListener('doXlfankui', this.openFankui)        
    },
    destroyed(){
        window.removeEventListener('doZnzj', this.getResList)
        window.removeEventListener('doXlzd', this.getResList)
        window.removeEventListener('doXlfankui', this.openFankui)
    },    
    methods: {
        openFankui(e){
            let obj = e.detail
            let params = {}
            if(obj.rsType == 9){
                params.playName = 'fankuiEng'
            }else{
                params.playName = 'fankui'
            }         
            
            let tmpObj = {}
            tmpObj.rsType = obj.rsType
            tmpObj.rcode = obj.rcode
            tmpObj.isEbook = 1 //发送到平板的反馈写死1

            params.params = tmpObj
            
            click(params)
        },
        //切换标签
        tabClick(tab,event){
            console.log(tab,event)
            // if(this.data[tab.index].type == 5){
            //     //返回授课包
            //     this.$router.push({path:'/ktjx/index'})
            //     return false
            // }
            this.pageCurrent = 1
            this.activeIndex = tab.index
            this.getResList()
       
        },
        //返回授课包
        goBack(){
            this.$router.push({path:'/ktjx/index'})
        },
        //获取当前标签资源
        async getResList(){
            this.loading = true
            try{
                let data = await getResListData(this)          
                this.resList = data
            }catch(e){
              
            }finally{
              this.loading = false
            }             
        },        
        //点击整行事件(打开任务详情)
        rowClick(row, column){
          console.log(row)
          console.log('row')
          click(row.playJs)
        }, 
        //点击按钮
        async handleButton(item,buttonItem){
            console.log(item)
            console.log(buttonItem)

            let params = {}
            if(buttonItem.type == "zuoda"){
                params = buttonItem.params
                click(params)
            }else if(buttonItem.type == "zuodaEng"){
                params = buttonItem.playJs
                click(params)
            }else if(buttonItem.type == 'fankui'){
                params = buttonItem.params
                click(params)
            }else if(buttonItem.type == 'fankuiEng'){
                params = buttonItem.params
                click(params)
            }else if(buttonItem.type == 'dengfen'){
                params = buttonItem.params
                click(params)
            }else if(buttonItem.type == 'wenjiantanjiu'){
                let params = buttonItem.params
                if(ABLEFORMAT.indexOf(","+params.formatMark+",")==-1)
                {
                    this.$messageteach.error("暂不支持"+params.formatMark+"格式的文件！");
                    return;
                }
                
                this.tanjiuObj.rcode = params.rcode
                this.tanjiuObj.filename = params.title + '.' + params.formatMark
                this.tanjiuObj.format = params.formatMark
                //获取负载地址

                let obj = {}
                obj.rcode = params.rcode
                obj.resType = params.fileType
                obj.RFormatMark = params.formatMark
                if(typeof params.linkType != 'undefined'){
                    obj.linkType = params.linkType
                    obj.linkValue = params.linkValue
                }

                let res = await getDownLoadUrl(obj,this)  
                this.tanjiuObj.downloadUrl = res
                if(res == ''){
                    // this.$messageteach.error('获取不到负载地址')
                    return false
                }
                this.sendPadDialogVisible = true
            }else if(buttonItem.type=='sendToPad'){
                //题库试卷发到平板
                params = buttonItem.params
                click(params)
            }else if(buttonItem.type == 'sendToPadEng'){
                params = buttonItem.params
                click(params)
            }        
        },
        //上一页/下一页
        pageClick(val){
          if(val == 'pre'){
            this.pageCurrent--
          }else{
            this.pageCurrent++
          }
        },
        //智能组卷
        openPaper(){
            openTqmsPracticePaper(this.ksId,this.teacherNumber)
        },
        //探究弹窗关闭
        sendPadClose(){
            this.sendPadDialogVisible = false
        }
    }
}
</script>

<style scoped>

</style>

<template>
    <div class="flexdy" style="height:100%">
    <!-- <BannerNewteach/> -->
    <div>
        <LeftRightNewteach>
            <template v-slot:top>
                教学云盘
            </template>          
            <template v-slot:left v-if="leftMenu.length > 0">
                <ul class="tree" v-for="(item,index) in leftMenu" :key="index">
                    <li :class="[0 == currendMenuIndex ?'cur':'']" @click="showRightRes(item.index,1)" >{{ item.title }}<span v-if="item.num!=''">({{item.num}})</span></li>
                    <ul>
                        <li 
                        @click="showRightRes(childItem.index,1)" 
                        v-for="(childItem,childIndex) in item.childArr" 
                        :key="childIndex"
                        :__VCOM_ANALYTICS="childItem.pvname" __VCOM_ANALYTICS_CLICK
                        :class="[childItem.index == currendMenuIndex ?'cur':'']"  
                        style="cursor:pointer"
                        >
                            {{childItem.name}}<span v-if="childItem.num!=''">({{childItem.num}})</span>
                        </li>
                    </ul>
                </ul>
            </template>
            <template v-slot:right>
                <div class="yxlist" v-if="template == 1">
                    <div class="right1" v-if="resList.length >0">
                        <ul>
                            <template v-for="(item,index) in resList" >
                                <li 
                                @click="clickDir(item)" 
                                v-if="item.type == 1" 
                                :key="index" 
                                style="cursor:pointer"
                                >
                                    <span><img src="@/assets/images/icon/res/folder.gif" /></span>
                                    <p>{{ item.title }}</p>                
                                </li>
                                <li 
                                @click="clickRes(item)" 
                                v-else
                                :key="index" 
                                style="cursor:pointer"
                                >
                                    <span><img :src="item.icon" /></span>
                                    <p>{{ item.title }}</p>
                                    <span v-if="typeof item.button != 'undefined' && item.button.length > 0">
                                        <template v-for="(buttonItem,i) in item.button">
                                            <el-button
                                            v-if="buttonItem.pvname !='undefined' && buttonItem.pvname !=''" :__VCOM_ANALYTICS="buttonItem.pvname" __VCOM_ANALYTICS_CLICK style="cursor:pointer"
                                            type="primary" 
                                            :key="i"
                                            @click.stop="handleButton(item,buttonItem)">{{buttonItem.name}}</el-button> 
                                            <el-button
                                            v-else
                                            type="primary" 
                                            :key="i"
                                            @click.stop="handleButton(item,buttonItem)">{{buttonItem.name}}</el-button>
                                        </template>                   
                                    </span>                            
                                </li>          
                            </template>
                        </ul>
                    </div>
                    <div style="flex:1;" v-if="dirArr.length == 0 && resList.length == 0"><img src="@/assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></div>
                    <div class="rightbottom">
                    <PageNewteach v-if="dirArr.length != 0 || resList.length != 0" :pageCurrent="pageCurrent" :pageTotal="pageTotal" @pageClick="pageClick"/>  
                    <el-button v-if="histroyArr.length > 1" @click="goDirList" type="warning" icon="el-icon-back"></el-button>                      
                    </div>                
                </div>  
                <YxNewteach v-if="template == 2" type=3  :index=0  :nowIndex=0 :reload="reload" />
            </template>        
        </LeftRightNewteach>
    </div>
    <!-- 发送班级弹窗（选择要发送的班级） -->
    <SelectClassNewteach @onSubmit="onSubmit" @setClassSelectShow="setClassSelectShow" :dialogVisible="classSelectDialogVisible" :needCheck="needCheck" />
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
import TabsNewteach from '@/components/TabsNewteachs'
import BannerNewteach from '@/components/BannerNewteach'
import DialogNewteach from '@/components/DialogNewteach'
import LeftRightNewteach from '@/components/LeftRightNewteach'
import PageNewteach from '@/components/PageNewteach'
import YxNewteach from '@/components/YxNewteach'
import SelectClassNewteach from '@/components/SelectClassNewteach'
import { mapGetters } from 'vuex'
import { getCloudResData,getShareResData } from '@/api/jxyp'
import { click } from '@/api/click'
import { wkResSendApi,sendRecommendXbzyApi,getCloudResCountApi } from '@/api/interface'
import { getDownLoadUrl } from '@/api/play'
import SendPadNewteach from '@/components/SendPadNewteach'
export default {
    components:{
        TabsNewteach,
        LeftRightNewteach,
        BannerNewteach,
        PageNewteach,
        DialogNewteach,
        SelectClassNewteach,
        YxNewteach,
        SendPadNewteach
    },
    data(){
        return {
            template:1,
            reload:false,//是否重新加载
            tabPosition:'bottom',
            leftMenu:[
                {
                    "title":"全部文件",
                    "num":"0",
                    "type":"F000",
                    "index":0,
                    "childArr":[
                        {"name":"文本","pvname":"","type":"F100","num":"0","index":1},
                        {"name":"图片","pvname":"","type":"F200","num":"0","index":2},
                        {"name":"视频","pvname":"","type":"F300","num":"0","index":3},
                        {"name":"音频","pvname":"","type":"F400","num":"0","index":4},
                        {"name":"动画","pvname":"","type":"F500","num":"0","index":5},
                        {"name":"其他","pvname":"","type":"F700","num":"0","index":6}
                    ]
                },
                {
                    "title":"共享文件夹",
                    "num":"",
                    "menuid":"2",
                    "index":7,
                    "childArr":[]
                },
                {
                    "title":"预习",
                    "num":"0",
                    "menuid":"3",
                    "index":8,
                    "childArr":[]
                }                                
            ],//左边栏目
            currendMenuIndex: 1,//默认选中一级栏目选中
            dirArr: [],//右边文件夹列表
            resList:[], //右边资源列表
            pageTotal:0,//总页数
            pageCurrent:1, //当前页码
            pageSize:9, //每页个数  
            histroyArr:[],//历史记录
            parentfcode:"",
            rootCode: "", 
            classSelectDialogVisible: false,//发送弹窗是否展示
            nowSendRcode:'',//当前要发送的微课rcode
            needCheck:[],//选中的班级
            sendType:'',//发送类型（微课资源发送/校本教材资源推荐）
            sendPadDialogVisible:false,//发起探究弹窗
            tanjiuObj:{
                filename:'',
                rcode:'',
                format:'',
                downloadUrl:''
            },
        }
    },
    computed: {
        ...mapGetters([
            'ksId',
            'schoolId',
            'teacherNumber',
            'trueTeacherName',
            'dialogFilter',
            'userClassList',
            'userSelectClassId',
        ]),       
        // pageTotal(){
        //     if(this.dirArr.length > 0){
        //         return Math.ceil(this.dirArr.length/this.pageSize)
        //     }else if(this.resList.length > 0){
        //         return Math.ceil(this.resList.length/this.pageSize)
        //     }else{
        //         return 0
        //     }            
        // },
        // pageStart(){
        //   return (this.pageCurrent-1)*this.pageSize
        // },             
    },    
    watch: {
        async ksId(newVal,oldVal){
            if(newVal != oldVal){
                //展示第一个栏目下的资源
                this.currendMenuIndex = 0
                this.resList = []
                this.dirArr = []            
                this.pageCurrent = 1
                this.histroyArr = []
                
            }
        }
    },
    async mounted(){
        if(this.ksId == ''){
            this.$router.push({'path':'/ktjx'})
        }else{       
            //展示第一个栏目下的资源
            try{
                await this.showRightRes(0,1)
                this.getCloudResCountData()
            }catch(e){
                console.log(e)
            }
        }
    },  
    methods: {
        async showRightRes(index,pageCurrent){
           this.histroyArr = []
           if(index < 7){
               this.histroyArr.push({"from":"1",code:0})
               this.parentfcode = 0
           }else if(index == 7){
               this.histroyArr.push({"from":"2",code:"",rootCode:""})
               this.parentfcode = ""
               this.rootCode = ""
           }

           await this.getRightRes(index,pageCurrent)
        },
        //index:当前第几个栏目
        //childItem:栏目里的第几个标签
        async getRightRes(index,pageCurrent){
            this.currendMenuIndex = index
            this.resList = []
            this.dirArr = []            
            this.pageCurrent = pageCurrent
            
            if(index == 0){
                this.template = 1
                //全部文件
                this.getCloudFileList("")
            }else if(index > 0 && index <7){
                this.template = 1
                let obj = this.leftMenu[0].childArr.find(item => item.index == index)
                
                this.getCloudFileList(obj.type)
            }else if(index == 7){
                this.template = 1
                //共享文件夹
                this.getShareList()               
            }else{
                this.template = 2
            }
        },
        async getCloudResCountData(){
            try{
                let res = await getCloudResCountApi();
                this.leftMenu[0].num = res.countMap.F000
                this.leftMenu[0].childArr[0].num = res.countMap.F100
                this.leftMenu[0].childArr[1].num = res.countMap.F200
                this.leftMenu[0].childArr[2].num = res.countMap.F300
                this.leftMenu[0].childArr[3].num = res.countMap.F400
                this.leftMenu[0].childArr[4].num = res.countMap.F500
                this.leftMenu[0].childArr[5].num = res.countMap.F700                
                this.leftMenu[2].num = res.countMap.yx
            }catch(e){
                console.log(e)
            }            
        },
        //点击右侧文件夹
        async clickDir(item){
            this.resList = []
            this.dirArr = []
            console.log(item)
            this.pageCurrent = 1
            
            
            if(this.currendMenuIndex == 7){
                //共享文件夹的文件夹点击
                this.histroyArr.push({"from":"2",code:item.rcode,rootCode:item.rootCode})
                this.parentfcode = item.rcode
                this.rootCode = item.rootCode
                this.getShareList()
            }else{
                //全部文件夹里的文件夹点击
                this.histroyArr.push({"from":"1",code:item.rcode})
                this.parentfcode = item.rcode
                this.getCloudFileList("")
            }
        },
        //点击资源
        clickRes(item){
            console.log(item)
            click(item.playJs)
        },
        //微课资源发送/教材资源推荐
        async handleButton(item,buttonItem){
            if(buttonItem.type == 'sendWk'){
                this.nowSendRcode = item.rcode
                this.classSelectDialogVisible = true
                this.needCheck = []
                this.needCheck.push(this.userSelectClassId)                  
                //微课资源发送
                this.sendType = 'sendWk'
            }else if(buttonItem.type == 'wenjiantanjiu'){
                //发起探究
                let params = buttonItem.params

                this.tanjiuObj.rcode = params.rcode
                if(params.title.indexOf(params.formatMark)!= -1){
                    this.tanjiuObj.filename = params.title
                }else{
                    this.tanjiuObj.filename = params.title + '.' + params.formatMark
                }                
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
            }else{
                this.nowSendRcode = item.rcode
                this.classSelectDialogVisible = true
                this.needCheck = []
                this.needCheck.push(this.userSelectClassId)                  
                this.sendType = 'tuijian'
            }   
        },
        //探究弹窗关闭
        sendPadClose(){
            this.sendPadDialogVisible = false
        },        
        async getZtzyResInfo(pid,ks_type){
            try{
                let res = await getZtzyResData(pid,1,ks_type)
                console.log(res)
                this.dirArr = res.dirArr
                this.resList = res.resArr
            }catch(e){
                console.log(e)
            }         
        },
        //上一页/下一页
        pageClick(val){
          if(val == 'pre'){
            this.pageCurrent--
          }else{
            this.pageCurrent++
          }
          this.getRightRes(this.currendMenuIndex,this.pageCurrent)
        },  
        //返回上一级目录
        async goDirList(){
            this.pageCurrent = 1            
            let item = this.histroyArr[this.histroyArr.length - 2]
            console.log(item)   
            if(item.from == 1){
                //全部资源文件夹返回
                this.parentfcode = item.code
                this.getCloudFileList("")
            }else{
                //共享文件夹文件夹返回
                this.parentfcode = item.code
                this.rootCode = item.rootCode
                this.getShareList()
            }
            this.histroyArr.pop()
        },    
        //调用获取全部资源和文本等资源列表
        async getCloudFileList(systype){
            try{
                let res = await getCloudResData(systype,this.teacherNumber,this.pageCurrent,this.pageSize,this.parentfcode);

                this.resList = res.res
                this.pageTotal = res.pageTotal
            }catch(e){
                console.log(e)
            }
        },
        //调用接口获取共享文件夹接口
        async getShareList(){
            try{
                let res = await getShareResData(this.pageCurrent,this.pageSize,this.rootCode,this.parentfcode)
                this.resList = res.res
                this.pageTotal = res.pageTotal
            }catch(e){
                console.log(e)
            }  
        },
        //是否隐藏年级选择弹窗
        setClassSelectShow(flag){
            this.classSelectDialogVisible = flag
        },
        //发送
        async onSubmit(checkList){
            if(checkList.length == 0){
                this.$messageteach.error('请选择要发送的班级!')
                return false
            }else{
                if(this.sendType == 'sendWk'){
                    try{
                        let res = await wkResSendApi(this.nowSendRcode,this.teacherNumber,this.trueTeacherName,checkList.join(','))
                        if(res.success){
                            //添加U币
                            this.$messageteach.success('发送成功')
                            this.classSelectDialogVisible = false
                        }else{
                            if(res.text){
                                this.$messageteach.error(res.text)
                            }else{
                                this.$messageteach.error('发送失败!')
                            }
                        }
                    }catch(e){
                        this.$messageteach.error('发送异常!')
                    }
                }else if(this.sendType = 'tuijian'){
                    try{
                        let res = await sendRecommendXbzyApi(this.teacherNumber,2,this.nowSendRcode,1,checkList.join(','),this.trueTeacherName,this.schoolId)
                        if(res.failCount == 0){
                            //添加U币
                            this.$messageteach.success('推荐成功')
                            this.classSelectDialogVisible = false
                        }else{
                            if(res.msg){
                                this.$messageteach.error(res.msg)
                            }else{
                                this.$messageteach.error('推荐失败!')
                            }
                        }                    
                    }catch(e){
                        this.$messageteach.error('推荐失败!')
                    }
                }
            }
        }        
    }
}
</script>

<style>

</style>

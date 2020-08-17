<template>
    <div class="flexdy" style="height:100%">
    <!-- <BannerNewteach/> -->
    <div>
        <LeftRightNewteach>
            <template v-slot:top>
                {{topTitle}}
            </template>          
            <template v-slot:left v-if="leftMenu.length > 0">
                <ul class="tree" v-for="(item,index) in leftMenu" :key="index">
                    <li>{{ item.title }}</li>
                    <ul>
                        <li 
                        @click="getRightRes(index,childIndex,childItem)" 
                        v-for="(childItem,childIndex) in item.childArr" 
                        :key="childIndex"
                        :__VCOM_ANALYTICS="childItem.pvname" __VCOM_ANALYTICS_CLICK
                        :class="[index == currendMainMenuIndex && childIndex==currendSecondMenuIndex?'cur':'']"  
                        style="cursor:pointer"
                        >
                            {{childItem.name}} 
                        </li>
                    </ul>
                </ul>
            </template>
            <template v-slot:right>
                <div class="yxlist">
                    <div class="right1" v-if="dirArr.length >0 || resList.length >0">
                        <ul>
                            <li 
                            @click="clickDir(item)" 
                            v-show="dirArr.length>0" 
                            v-for="(item,index) in dirArr.filter((val,i) => i>=pageStart&&i<pageStart+pageSize)" 
                            :key="index" 
                            style="cursor:pointer"
                            >
                                <span><img src="@/assets/images/icon/res/folder.gif" /></span>
                                <p>{{ item.name }}</p>                
                            </li>
                            <li 
                            @click="clickRes(item)" 
                            v-show="resList.length>0" 
                            v-for="(item,index) in resList.filter((val,i) => i>=pageStart&&i<pageStart+pageSize)" 
                            :key="index" 
                            style="cursor:pointer"
                            >
                                <span><img :src="item.icon" /></span>
                                <p>{{ item.title }}</p>
                                <span v-if="typeof item.button != 'undefined' && item.button.length > 0">
                                    <el-button
                                    type="primary" 
                                    v-for="(buttonItem,i) in item.button"
                                    :key="i"
                                    @click.stop="handleButton(item,buttonItem)">{{buttonItem.name}}</el-button>                    
                                </span>                            
                            </li>
                        </ul>
                    </div>
                    <div style="flex:1;" v-if="dirArr.length == 0 && resList.length == 0"><img src="@/assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></div>
                    <div class="rightbottom">
                    <PageNewteach v-if="dirArr.length != 0 || resList.length != 0" :pageCurrent="pageCurrent" :pageTotal="pageTotal" @pageClick="pageClick"/>  
                    <el-button v-if="histroyArr.length > 1" @click="goDirList" type="warning" icon="el-icon-back"></el-button>                      
                    </div>                
                </div>  
            </template>        
        </LeftRightNewteach>
    </div>
    <!-- 发送班级弹窗（选择要发送的班级） -->
    <SelectClassNewteach @onSubmit="onSubmit" @setClassSelectShow="setClassSelectShow" :dialogVisible="classSelectDialogVisible" :needCheck="needCheck" />
    </div> 
</template>

<script>
import TabsNewteach from '@/components/TabsNewteachs'
import BannerNewteach from '@/components/BannerNewteach'
import DialogNewteach from '@/components/DialogNewteach'
import LeftRightNewteach from '@/components/LeftRightNewteach'
import PageNewteach from '@/components/PageNewteach'
import SelectClassNewteach from '@/components/SelectClassNewteach'
import { mapGetters } from 'vuex'
import { getXbzyTab, getJczyTab, getXbzyResData,getZtzyResData,formateLeftTree,getWkzyResData} from '@/api/xbzy'
import { click } from '@/api/click'
import { wkResSendApi,sendRecommendXbzyApi } from '@/api/interface'
export default {
    components:{
        TabsNewteach,
        LeftRightNewteach,
        BannerNewteach,
        PageNewteach,
        DialogNewteach,
        SelectClassNewteach
    },
    data(){
        return {
            tabPosition:'bottom',
            leftMenu:[],//左边栏目
            currendMainMenuIndex: 0,//默认选中一级栏目选中
            currendSecondMenuIndex: 0,//默认二级栏目选中
            dirArr: [],//右边文件夹列表
            resList:[], //右边资源列表
            pageCurrent:1, //当前页码
            pageSize:9, //每页个数  
            histroyArr:[],//历史记录           
            classSelectDialogVisible: false,//发送弹窗是否展示
            nowSendRcode:'',//当前要发送的微课rcode
            needCheck:[],//选中的班级
            sendType:'',//发送类型（微课资源发送/校本教材资源推荐）            
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
        topTitle(){
            let title = ''
            if(this.leftMenu.length > 0){
                title = this.leftMenu[this.currendMainMenuIndex].title
                if(this.leftMenu[this.currendMainMenuIndex].childArr.length > 0){
                    title += '|' + this.leftMenu[this.currendMainMenuIndex].childArr[this.currendSecondMenuIndex].name
                }
            }
            return title
        },           
        pageTotal(){
            if(this.dirArr.length > 0){
                return Math.ceil(this.dirArr.length/this.pageSize)
            }else if(this.resList.length > 0){
                return Math.ceil(this.resList.length/this.pageSize)
            }else{
                return 0
            }            
        },
        pageStart(){
          return (this.pageCurrent-1)*this.pageSize
        },             
    },    
    watch: {
        async ksId(newVal,oldVal){
            if(newVal != oldVal){
                //展示第一个栏目下的资源
                this.currendMainMenuIndex = 0
                this.currendSecondMenuIndex = 0
                this.resList = []
                this.dirArr = []            
                this.pageCurrent = 1
                this.histroyArr = []
                try{
                    let res = await getXbzyResData(this.leftMenu[0].childArr[0].type)
                    console.log(res)
                    this.resList = res
                }catch(e){
                    console.log(e)
                }
            }
        }
    },
    async mounted(){
        if(this.ksId == ''){
            this.$router.push({'path':'/ktjx'})
        }else{       
            //获取一级栏目
            let  mainMenu = getXbzyTab()
            let secondMenu = getJczyTab()

            //获取左边栏目树
            this.leftMenu = formateLeftTree(mainMenu,secondMenu)

            //展示第一个栏目下的资源
            try{
                let res = await getXbzyResData(secondMenu[0].type)
                console.log(res)
                this.resList = res
            }catch(e){
                console.log(e)
            }
        }
    },  
    methods: {
        //index:当前第几个栏目
        //childItem:栏目里的第几个标签
        async getRightRes(index,childIndex,childItem){
            this.currendMainMenuIndex = index
            this.currendSecondMenuIndex = childIndex
            this.resList = []
            this.dirArr = []            
            this.pageCurrent = 1
            this.histroyArr = []
            if(index == 0){
                //教材资源相关
                try{
                    let res = await getXbzyResData(childItem.type)
                    console.log(res)
                    this.resList = res
                }catch(e){
                    console.log(e)
                }
            }else if(index == 1){
                //专题资源
                this.histroyArr = []
                let pid = this.schoolId + '00' //首次为学校ID
                this.histroyArr.push({code:pid,ks_type:1})
                this.getZtzyResInfo(pid,1)
            }else{
                //微课资源
                try{
                    this.resList  = await getWkzyResData()
                }catch(e){

                }                
            }
        },
        //点击右侧文件夹
        clickDir(item){
            this.resList = []
            this.dirArr = []
            console.log(item)
            this.pageCurrent = 1
            this.histroyArr.push(item)
            this.getZtzyResInfo(item.code,item.ks_type)
        },
        //点击资源
        clickRes(item){
            console.log(item)
            click(item.playJs)
        },
        //微课资源发送/教材资源推荐
        async handleButton(item,buttonItem){
            this.nowSendRcode = item.rcode
            this.classSelectDialogVisible = true
            this.needCheck = []
            this.needCheck.push(this.userSelectClassId)

            if(buttonItem.type == 'sendWk'){
                //微课资源发送
                this.sendType = 'sendWk'
            }else{
                this.sendType = 'tuijian'
            }   
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
        },  
        //返回上一级目录
        goDirList(){
            this.pageCurrent = 1            
            let item = this.histroyArr[this.histroyArr.length - 2]            
            this.getZtzyResInfo(item.code,item.ks_type)
            this.histroyArr.pop()
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

<template>
<div class="flexdy" >
    <div>
        <!-- <BannerNewteach/> -->
        <LeftRightNewteach>
        <template v-slot:top>
            本地资源
        </template>               
        <template v-slot:left>
            <ul class="tree" v-for="(item,index) in leftArr" :key="index">
                <li>{{ item.name }}</li>
                <ul class="lifen2">
                    <li 
                    v-for="(childItem,childIndex) in item.childArr" 
                    :key="childIndex"
                    @click="leftMenuClick(index,childIndex,childItem)" 
                    :class="[index==currendMainMenuIndex && childIndex==currendSecondMenuIndex?'cur':'']"  
                    style="cursor:pointer"
                    >
                         {{childItem.name}} 
                    </li>
                </ul>
            </ul>
        </template>
        <template v-slot:right>
            <div class="yxlist">
                <div class="right1" v-if="hasRes">
                <ul>
                    <li 
                    @click="clickDir(item)" 
                    v-show="rightDirArr.length>0" 
                    v-for="(item,index) in rightArrByPage" 
                    :key="index" 
                    style="cursor:pointer"
                    >
                        <span><img src="@/assets/images/icon/res/folder.gif" /></span>
                        <p>{{ item.name }}</p>                
                    </li>
                    <li @click="clickRes(item)" v-show="rightResArr.length>0" v-for="item in rightArrByPage" :key="item.rcode" style="cursor:pointer">
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
                <div v-if="!hasRes" style="flex:1;"><img src="@/assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></div>
				<div class="rightbottom">
				   <PageNewteach :pageCurrent="rightPageCurrent" :pageTotal="rightPageTotal" @pageClick="rightPageClick"/>
                   <el-button v-if="menuCodeArr.length > 1"  @click="goBack" type="warning" icon="el-icon-back"></el-button> 
				</div>                 
            </div>  
        </template>        
    </LeftRightNewteach>
    </div>    
        <!-- 发送班级弹窗（选择要发送的班级） -->
    <SelectClassNewteach @onSubmit="onSubmit" @setClassSelectShow="setClassSelectShow" :dialogVisible="classSelectDialogVisible" :needCheck="needCheck" />
    <input type="hidden" id="__VCOM_ANALYTICS_PAGEFLAG" value="tls_bdzy_bdzy" />
</div>    
</template>

<script>
import { mapGetters } from 'vuex'
import { getLeftData, getRightResData, getRightWkResData} from '@/api/bdzy'
import LeftRightNewteach from '@/components/LeftRightNewteach'
import BannerNewteach from '@/components/BannerNewteach'
import PageNewteach from '@/components/PageNewteach'
import SelectClassNewteach from '@/components/SelectClassNewteach'
import { click } from '@/api/click'
import { wkResSendApi } from '@/api/interface'
export default {
    components:{
        LeftRightNewteach,
        BannerNewteach,
        PageNewteach,
        SelectClassNewteach
    },
    data(){
        return {
            leftArr: [],//左侧目录树
            rightDirArr:[],//右侧资源列表
            rightResArr: [],//右侧资源列表
            rightPageCurrent:1, //当前页码
            rightPageSize:9, //每页个数 
            currendMainMenuIndex: 0,//默认选中一级栏目选中
            currendSecondMenuIndex: 0,//默认二级栏目选中 
            rightResTotal:0, //右边资源的总数（非文件夹）        
            menuCodeArr:[],//点击的每层目录             
            //微课发送专用参数
            nowSendRcode:'',  
            needCheck:[],//选中的班级
            classSelectDialogVisible:false,
        }
    },
    computed: {
        ...mapGetters([
            'ksId',
            'dialogFilter',
            'teacherNumber',
            'trueTeacherName',
            'userSelectClassId'
        ]),
        rightPageStart(){
          return (this.rightPageCurrent-1)*this.rightPageSize
        },
        rightPageTotal(){
            if(this.rightDirArr.length != 0){
                return Math.ceil(this.rightDirArr.length/this.rightPageSize)
            }else{
                return Math.ceil(this.rightResTotal/this.rightPageSize)
            }            
        },     
        rightArrByPage(){
            if(this.rightDirArr.length != 0){
                return this.rightDirArr.filter((val,i) => i>=this.rightPageStart&&i<this.rightPageStart+this.rightPageSize)
            }else{
                return this.rightResArr.filter((val,i) => i>=this.rightPageStart&&i<this.rightPageStart+this.rightPageSize)
            }            
        },
        hasRes(){
          //是否有资源
          if( this.rightDirArr.length > 0 || this.rightResArr.length >0){
            return true
          }else{
            return false
          }
        },           
    },    
    watch: {
        ksId(newVal,oldVal){
        }
    },
    async mounted(){
        if(this.ksId == ''){
            this.$router.push({'path':'/ktjx'})
        }else{
            this.getLeft()            
        }
    },  
    methods: {
        async getLeft(){
            let leftData = await getLeftData()
            console.log(leftData)
            this.leftArr = leftData
            let obj = {'code':leftData[0].code,'type':leftData[0].childArr[0].code}
            this.menuCodeArr.push(obj)
            this.showRes(obj)            
        },
        //左边栏目点击
        async leftMenuClick(index,childIndex,childItem){
            this.currendMainMenuIndex = index
            this.currendSecondMenuIndex = childIndex            

            this.rightPageCurrent = 1

            console.log(childItem)
            this.menuCodeArr = []
            let obj = {'code':this.leftArr[index].code,'type':childItem.code}
            this.menuCodeArr.push(obj)
            this.showRes(obj)
        },
        //右边文件夹点击
        async clickDir(item){
            console.log(item)
            this.rightPageCurrent = 1

            let obj = {'code':item.code,'type':this.leftArr[this.currendMainMenuIndex].childArr[this.currendSecondMenuIndex].code}
            this.menuCodeArr.push(obj)
            
            this.showRes(obj)
        },
        //点击资源
        clickRes(item){
            console.log(item)
            click(item.playJs)
        },
        async rightPageClick(val){
            //右侧翻页          
          if(val == 'pre'){
            this.rightPageCurrent--
          }else{
            this.rightPageCurrent++
          }
          
        //   if(this.rightResArr.length > 0){
        //       let obj = this.menuCodeArr[this.menuCodeArr.length -1]
        //       this.showRes(obj)
        //   }
        },
        //返回上一页
        async goBack(){
            this.rightPageCurrent = 1

            let obj = this.menuCodeArr[this.menuCodeArr.length-2]
            this.showRes(obj)
            this.menuCodeArr.splice(this.menuCodeArr.length-1,1)
        },
        async showRes(obj){
            //2为微课资源
            if(obj.type != '2'){
                let res = await getRightResData(obj.code,obj.type,999,this.rightPageCurrent)
                if(res.dirArr.length > 0){
                    this.rightDirArr = res.dirArr
                    this.rightResArr = []
                }else if(res.resArr.length > 0){
                    this.rightResArr = res.resArr
                    this.rightDirArr = []
                    this.rightResTotal = res.resTotal
                }else{
                    this.rightDirArr = []
                    this.rightResArr = []
                    this.rightResTotal = 0
                }  
            }else{
                let res = await getRightWkResData(obj.code,999)
                this.rightResArr = res
                this.rightResTotal = res.length
                this.rightDirArr = []
            }  
        },
        //微课资源发送按钮点击，显示弹窗
        handleButton(item,buttonItem){
            this.nowSendRcode = item.rcode
            this.classSelectDialogVisible = true
            this.needCheck = []
            this.needCheck.push(this.userSelectClassId)
        },
        //微课发送提交发送
        async onSubmit(checkList){
            if(checkList.length == 0){
                this.$messageteach.error('请选择要发送的班级!')
                return false
            }else{
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
                    this.$messageteach.error('发送失败!')
                }
            }
        },
        //是否隐藏年级选择弹窗
        setClassSelectShow(flag){
            this.classSelectDialogVisible = flag
        },                
    }
}
</script>

<style>

</style>

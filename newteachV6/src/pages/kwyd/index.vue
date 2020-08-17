<template>
    <div style="heght:100%">
        <!-- <BannerNewteach/> -->
        <LeftRightNewteach>
        <template v-slot:top>
            课外阅读
        </template>             
        <template v-slot:left>
            <ul class="tree" v-for="(item,index) in leftMenuByPage[leftPageCurrent-1]" :key="index">
                <li>{{ item.name }}</li>
                <ul class="lifen2">
                    <li 
                    @click="leftMenuClick(index,childIndex,childItem)" 
                    v-for="(childItem,childIndex) in item.childArr" 
                    :key="childIndex"
                    :class="[index==currendMainMenuIndex && childIndex==currendSecondMenuIndex?'cur':'']" 
                    style="cursor:pointer" 
                    >
                         {{childItem.name}} 
                    </li>
                </ul>
            </ul>
        </template>
        <template v-slot:page>
            <PageNewteach :pageCurrent="leftPageCurrent" :pageTotal="leftPageTotal" @pageClick="leftPageClick"/>
        </template>
        <template v-slot:right>
            <div class="yxlist">
                <div class="right1" v-if="rightDirArr.length != 0 || rightResArr.length != 0">
                <ul>
                    <li 
                    @click="clickDir(item)" 
                    v-show="rightDirArr.length>0" 
                    v-for="(item,index) in rightDirArr.filter((val,i) => i>=rightPageStart&&i<rightPageStart+rightPageSize)" 
                    :key="index" 
                    style="cursor:pointer"
                    >
                        <span><img src="@/assets/images/icon/res/folder.gif" /></span>
                        <p>{{ item.name }}</p>                
                    </li>
                    <li @click="clickRes(item)" v-show="rightResArr.length>0" v-for="(item,index) in rightResArr" :key="index" style="cursor:pointer">
                        <span><img :src="item.icon" /></span>
                        <p>{{ item.title }}</p>
                    </li>
                </ul>
                </div>
                <div style="flex:1;" v-if="rightDirArr.length == 0 && rightResArr.length == 0"><img src="@/assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></div>
				<div class="rightbottom">
				   <PageNewteach :pageCurrent="rightPageCurrent" :pageTotal="rightPageTotal" @pageClick="rightPageClick"/>
                   <el-button v-if="menuCodeArr.length > 1"  @click="goBack" type="warning" icon="el-icon-back"></el-button> 
				</div>                
            </div>  
        </template>        
    </LeftRightNewteach>
    <input type="hidden" id="__VCOM_ANALYTICS_PAGEFLAG" value="tls_kwyd_kwyd" />
    </div>    
</template>

<script>
import { mapGetters } from 'vuex'
import { getLeftData, getRightResData, getRightResDataByPage } from '@/api/kwyd'
import LeftRightNewteach from '@/components/LeftRightNewteach'
import BannerNewteach from '@/components/BannerNewteach'
import PageNewteach from '@/components/PageNewteach'
import { click } from '@/api/click'
export default {
    name:'kwyd',
    components:{
        LeftRightNewteach,
        BannerNewteach,
        PageNewteach
    },
    data(){
        return {
            leftArr: [],//左侧目录树
            rightDirArr:[],//右侧资源列表
            rightResArr: [],//右侧资源列表
            leftPageCurrent:1, //当前页码
            leftPageSize:24, //每页个数
            rightPageCurrent:1, //当前页码
            rightPageSize:9, //每页个数 
            currendMainMenuIndex: 0,//默认选中一级栏目选中
            currendSecondMenuIndex: 0,//默认二级栏目选中 
            lastLeftObj:{},//目录树，当前页的最后一个
            rightResTotal:0, //右边资源的总数（非文件夹）        
            menuCodeArr:[],//点击的每层目录          
            level:0,//当前目录层级         
            leftMenuByPage:[]
        }
    },
    computed: {
        ...mapGetters([
            'ksId',
        ]),            
        leftPageStart(){
          return (this.leftPageCurrent-1)*this.leftPageSize
        },
        leftPageTotal(){
            return Math.ceil(this.leftArr.length/this.leftPageSize)
        },
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
            this.leftArr = leftData

            this.leftMenuByPage = this.getLeftMenuArr()

            this.menuCodeArr.push(leftData[1].code)
            let res = await getRightResData(leftData[1].code,this.rightPageSize,this.rightPageCurrent)
            // console.log(res)
            if(res.dirArr.length > 0){
                this.rightDirArr = res.dirArr
            }else{
                this.rightResArr = res.resArr
            }
        },
        //左边栏目点击
        async leftMenuClick(index,childIndex,childItem){
            // console.log(childItem)
            this.menuCodeArr = []
            this.menuCodeArr.push(childItem.code)
            this.currendMainMenuIndex = index
            this.currendSecondMenuIndex = childIndex
            this.rightPageCurrent = 1

            let res = await getRightResData(childItem.code,this.rightPageSize,this.rightPageCurrent)
            if(res.dirArr.length > 0){
                this.rightDirArr = res.dirArr
                this.rightResArr = []
            }else{
                this.rightDirArr = []
                this.rightResArr = res.resArr
                this.rightResTotal = res.resTotal
            }
        },
        //右边文件夹点击
        async clickDir(item){
            // console.log(item)
            this.rightDirArr = []
            this.rightResArr = []
            this.rightPageCurrent = 1
            this.menuCodeArr.push(item.code)

            let res = await getRightResData(item.code,this.rightPageSize,this.rightPageCurrent)
            // console.log(res)
            if(res.dirArr.length > 0){
                this.rightDirArr = res.dirArr
                this.rightResArr = []
            }else{
                this.rightDirArr = []
                this.rightResArr = res.resArr
                this.rightResTotal = res.resTotal
            }
        },
        //点击资源
        clickRes(item){
            // console.log(item)
            click(item.playJs)
        },
        async leftPageClick(val){
            //左侧翻页
            // this.lastLeftObj = {'name':this.leftMenuByPage[this.leftMenuByPage.length-1].name,'code':this.leftMenuByPage[this.leftMenuByPage.length-1].code,'childArr':[]}
            this.menuCodeArr = [] 
            if(val == 'pre'){
            this.leftPageCurrent--
            }else{
            this.leftPageCurrent++
            }
            this.menuCodeArr.push(this.leftMenuByPage[this.leftPageCurrent-1][0].childArr[0].code)
            this.currendMainMenuIndex = 0
            this.currendSecondMenuIndex = 0
            this.rightPageCurrent = 1


            let res = await getRightResData(this.leftMenuByPage[this.leftPageCurrent-1][0].childArr[0].code,this.rightPageSize,this.rightPageCurrent)
            if(res.dirArr.length > 0){
                this.rightDirArr = res.dirArr
                this.rightResArr = []
            }else{
                this.rightDirArr = []
                this.rightResArr = res.resArr
                this.rightResTotal = res.resTotal
               
            }                  
        },
        async rightPageClick(val){
            //右侧翻页          
          if(val == 'pre'){
            this.rightPageCurrent--
          }else{
            this.rightPageCurrent++
          }
          if(this.rightResArr.length > 0){
            let res = await getRightResDataByPage(this.menuCodeArr[this.menuCodeArr.length-1],this.rightPageSize,this.rightPageCurrent)
            this.rightResArr = res.resArr
            this.rightResTotal = res.resTotal            
          }
        },
        //返回上一页
        async goBack(){
            this.rightPageCurrent=1;
            let res = await getRightResData(this.menuCodeArr[this.menuCodeArr.length-2],this.rightPageSize,this.rightPageCurrent)
            if(res.dirArr.length > 0){
                this.rightDirArr = res.dirArr
                this.rightResArr = []
            }else{
                this.rightDirArr = []
                this.rightResArr = res.resArr
                this.rightResTotal = res.resTotal            
            }
            this.menuCodeArr.splice(this.menuCodeArr.length-1,1)
        },
        getLeftMenuArr(){
            let arr = []
            let tmpArr = []
            for(let [index,item] of this.leftArr.entries()){              
                if((index+1)%this.leftPageSize == 0){
                    if(tmpArr.length > 0){
                        arr.push(tmpArr)
                    }
                    tmpArr = []
                }

                let obj = {}
                obj.name = item.name
                obj.code = item.code   
                if(item.type == 1){
                    obj.childArr = []
                    tmpArr.push(obj)
                }else{
                    if(tmpArr.length == 0){
                        let tmpObj = {}
                        tmpObj.name = arr[arr.length-1][arr[arr.length-1].length-1].name
                        tmpObj.code = arr[arr.length-1][arr[arr.length-1].length-1].code
                        tmpObj.childArr = []
                        tmpArr.push(tmpObj)
                        tmpArr[tmpArr.length -1].childArr.push(obj)
                    }else{
                        tmpArr[tmpArr.length -1].childArr.push(obj)
                    }
                    
                }      
                if(index == this.leftArr.length-1){
                    //最后一个
                    arr.push(tmpArr)
                }
                // console.log(tmpArr)
            } 
            return arr
        }                    
    }
}
</script>

<style>

</style>

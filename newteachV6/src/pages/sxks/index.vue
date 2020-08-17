<template>
    <div style="height:100%">
        <div style="display: flex; flex:1; flex-direction: column;">
            <!-- <BannerNewteach/> -->
            <TabsNewteach
            ref="tabRef"
            :tabPosition="tabPosition"
            :data="tabArr"
            @tabClick="tabClick"
            >
                <template v-slot>
                    <LeftRightNewteach>
                        <template v-slot:top>
                            <p @click="dialogVisible = true" style="cursor:pointer">{{topTitle}}<i  class="el-icon-arrow-down"></i></p>
                        </template>
                        <template v-slot:left>
                            <ul class="tree">
                                <ul>
                                    <li 
                                    @click="leftDirClick(item,index)" 
                                    :class="[index==leftMenuIndex?'cur':'']"  
                                    v-for="(item,index) in leftMenuByPage" 
                                    :key="index" 
                                    style="cursor:pointer"
                                    >
                                    {{ item.title }}
                                    </li>
                                </ul>
                            </ul>
                        </template>
                        <template v-slot:page>
                            <PageNewteach :pageCurrent="leftPageCurrent" :pageTotal="leftPageTotal" @pageClick="leftPageClick"/>
                        </template>
                        <template v-slot:right >
                        <div class="yxlist" v-if="resList.length > 0">
                            <div class="right1">
                            <ul>
                                <li v-for="(item,index) in rightResByPage" @click="playRes(item)" :key="index" style="cursor:pointer">
                                    <span><img :src="item.icon" /></span>
                                    <p>{{ item.title }}</p>
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
                            <div class="rightbottom">
                                <PageNewteach :pageCurrent="rightPageCurrent" :pageTotal="rightPageTotal" @pageClick="rightPageClick"/>                          
                            </div>
                        </div>
   
                        </template>        
                    </LeftRightNewteach>
                </template>
            </TabsNewteach>
        </div>

        <YjNewteachVisibilityDialog width="80%" :title = 'dialogTitle'  :visible.sync="dialogVisible">
            <div class="banben">
                <div class="flextan" v-for="(item,index) in mainMenu" :key="index">
                    <label>{{item.title}}</label>
                    <span>
                        <yj-newteach-radio 
                        v-model="checkRadio" 
                        v-for="(childItem,childIndex) in item.childArr" 
                        :label="childItem.ksCode" 
                        :key="childIndex"
                        @click.native="radioChange(index,childIndex)"
                        >
                            {{ childItem.title}}
                        </yj-newteach-radio>
                    </span>
                </div>
            </div>
        <div>
            <div>
            <slot name="tips"></slot>
            </div>
            <div class="tcenter">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>             
            </div>
        </div>           
        </YjNewteachVisibilityDialog>        
        <input type="hidden" id="__VCOM_ANALYTICS_PAGEFLAG" value="tls_sxks_sxks" />
    </div>   
</template>

<script>
import TabsNewteach from '@/components/TabsNewteachs'
import BannerNewteach from '@/components/BannerNewteach'
import LeftRightNewteach from '@/components/LeftRightNewteach'
import DialogNewteach from '@/components/DialogNewteach'
import PageNewteach from '@/components/PageNewteach'
import { yjNewteachRadioGroup,yjNewteachRadio} from 'newteach-ui'
import { mapGetters } from 'vuex'
import { getSxksTab, showSxksRes, formatSxksRes,formatSxksResOnce,getSxksResData } from '@/api/sxks'
import { click } from '@/api/click'
export default {
    components:{
        TabsNewteach,
        LeftRightNewteach,
        BannerNewteach,
        DialogNewteach,
        PageNewteach,
        yjNewteachRadioGroup,
        yjNewteachRadio
    },
    data(){
        return {
            dialogTitle: '专题选择',
            dialogVisible:false,
            checkRadio:'',
            tabArr: [],
            activeIndex:0,//当前tab
            tabPosition: 'bottom',
            resList:[],
            mainMenu: [],//弹出面板栏目
            mainMenuIndex:0,//弹出面板当前选择项
            mainMenuChildIndex:0,//子选择项
            leftMenu:[], //左边栏目
            leftMenuIndex:0,//左边栏目当前选择
            leftPageCurrent:1, //当前页码
            leftPageSize:15, //每页个数
            rightPageCurrent:1, //当前页码
            rightPageSize:10, //每页个数            
        }
    },
    computed: {
        ...mapGetters([
            'ksId',
            'currentmfFlag',
            'dialogFilter',
            'fullscreenLoading'
        ]),
        topTitle(){
            let title = ''
            if(this.mainMenu.length > 0){
                title = this.mainMenu[this.mainMenuIndex].title
                if(this.mainMenu[this.mainMenuIndex].childArr.length > 0){
                    title += '|' + this.mainMenu[this.mainMenuIndex].childArr[this.mainMenuChildIndex].title
                }
            }
            return title
        },
        //列表数组
        leftMenuByPage(){
            return this.leftMenu.filter((val,i) => i>=this.leftPageStart&&i<this.leftPageStart+this.leftPageSize)
        },
        rightResByPage(){
            return this.resList.filter((val,i) => i>=this.rightPageStart&&i<this.rightPageStart+this.rightPageSize)
        },        
        leftPageStart(){
          return (this.leftPageCurrent-1)*this.leftPageSize
        },
        leftPageTotal(){
            return Math.ceil(this.leftMenu.length/this.leftPageSize)
        },
        rightPageStart(){
          return (this.rightPageCurrent-1)*this.rightPageSize
        },
        rightPageTotal(){
            return Math.ceil(this.resList.length/this.rightPageSize)
        }              
    },    
    watch: {
        ksId(newVal,oldVal){
        }
    },
    async mounted(){
        if(this.ksId == ''){
            this.$router.push({'path':'/ktjx'})
        }else{
            //获取二级栏目
            this.tabArr = getSxksTab()            
            console.log(this.tabArr)
            this.$refs.tabRef.setActiveName(this.tabArr[this.activeIndex].name)
            this.getRightRes(this.tabArr[this.activeIndex].pid)            
        }
    },  
    methods: {
        async tabClick(tab,event){
            this.activeIndex = tab.index
            this.mainMenuIndex = 0
            this.mainMenuChildIndex = 0
            this.leftMenuIndex = 0
            this.leftPageCurrent = 1
            this.rightPageCurrent = 1
            this.getRightRes(this.tabArr[this.activeIndex].pid)
        },
        async getRightRes(pid){
            //展示第一个栏目下的资源
            let result = await showSxksRes(this.tabArr[this.activeIndex].pid)
            //获取弹出面板的菜单
            let arr = await formatSxksRes(result)  
            this.checkRadio = arr[this.mainMenuIndex].childArr[this.mainMenuChildIndex].ksCode
            this.mainMenu = arr

            //获取弹出菜单第一个栏目下的菜单
            let leftRes = await showSxksRes(this.checkRadio)
            let leftArr = await formatSxksResOnce(leftRes)
            console.log(leftArr)
            this.leftMenu = leftArr
            //获取左边栏目第一个菜单下的资源
            let res = await getSxksResData(this.leftMenuByPage[this.leftMenuIndex].ksCode)
            this.resList = res
        },
        async leftDirClick(item,index){
            console.log(item)
            this.rightPageCurrent = 1
            this.leftMenuIndex = index
            let res = await getSxksResData(item.ksCode)
            this.resList = res
        },
        //是否展示弹窗
        cancel(){
            this.dialogVisible = false
        },
        //弹窗点击确定
        async submit(){
            this.dialogVisible = false

            let leftRes = await showSxksRes(this.checkRadio)
            let leftArr = await formatSxksResOnce(leftRes)
            console.log(leftArr)
            this.leftMenu = leftArr
            //获取左边栏目第一个菜单下的资源
            this.leftMenuIndex = 0
            this.leftPageCurrent = 1
            this.rightPageCurrent = 1
            let res = await getSxksResData(this.leftMenuByPage[this.leftMenuIndex].ksCode)
            this.resList = res
        },
        radioChange(index,childIndex){
            this.mainMenuIndex = index
            this.mainMenuChildIndex = childIndex
        },
        async leftPageClick(val){
            //左侧翻页
            if(val == 'pre'){
            this.leftPageCurrent--
            }else{
            this.leftPageCurrent++
            }
            this.leftMenuIndex = 0
            this.rightPageCurrent = 1
            let res = await getSxksResData(this.leftMenuByPage[this.leftMenuIndex].ksCode)
            this.resList = res          
        },
        rightPageClick(val){
            //右侧翻页
          if(val == 'pre'){
            this.rightPageCurrent--
          }else{
            this.rightPageCurrent++
          }
        },
        //播放资源
        playRes(item){
            click(item.playJs)
        }    
    }
}
</script>

<style>
.flexh {display: flex; flex-direction: row-reverse;}
 .flexh>.text{text-align: left; flex: 1; color: #999; font-size: 0.8rem; padding: 1vh 2vh;     background: #fafae5;    color: #666;}

 	.flextan {display: flex; text-align: left;}
	.flextan>label {width: 10vw; font-size: 1rem; line-height: 4vh; text-align: center;}
	.flextan>span {flex: 1; line-height: 4vh;}
</style>

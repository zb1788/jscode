<template>
<div style="heght:100%">
    <div style="height: 100%;">
        <!-- <BannerNewteach/> -->
        <LeftRightNewteach>
            <template v-slot:top>
                {{topTitle}}<i @click="dialogVisible = true" class="el-icon-circle-plus" style="cursor:pointer"></i>
            </template>        
            <template v-slot:left>
                <ul class="tree">
                    <ul>
                        <li 
                        v-for="(item,index) in leftMenuByPage" 
                        :key="index" 
                        :class="[index==leftMenuIndex?'cur':'']"  
                        @click="getCurRes(item,index)"
                        style="cursor:pointer"
                        > 
                        {{ item.name }}
                        </li>
                    </ul>
                </ul>
            </template>
            <template v-slot:page>
                    <PageNewteach :pageCurrent="leftPageCurrent" :pageTotal="leftPageTotal" @pageClick="leftPageClick"/>
            </template>
            <template v-slot:right v-if="resList.length > 0">
                <div class="yxlist">
                    <div class="right1">
                    <ul>
                        <li v-for="(item,index) in rightResByPage" :key="index" @click="playRes(item)" style="cursor:pointer">
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
                    </ul></div>
                    <div class="rightbottom">
                    <el-button type="primary" @click="sendCommendClick" __VCOM_ANALYTICS="tls_mswk_fs" __VCOM_ANALYTICS_CLICK>推荐</el-button>
                    <PageNewteach :pageCurrent="rightPageCurrent" :pageTotal="rightPageTotal" @pageClick="rightPageClick"/>                          
                    </div>
                </div> 
                
            </template>        
        </LeftRightNewteach>
    </div>
    <YjNewteachVisibilityDialog :title = 'dialogTitle' width="80%" :visible.sync="dialogVisible" >
        <div class="banben">
            <div class="ms-flextan">
                <label>年级</label>
                <yj-newteach-radio-group v-model="checkGradeRadioId" @change="gradeRadioChange" class="groupL">
                <yj-newteach-radio border
                v-for="(childItem,childIndex) in gradeArr" 
                :label="childItem.id" 
                :key="childIndex"
                >
                    {{ childItem.name}}
                </yj-newteach-radio>
                </yj-newteach-radio-group>
            </div>
            <div class="ms-flextan">
                <label>科目</label>
                <yj-newteach-radio-group v-model="checkSubjectRadio" @change="subjectRadioChange" class="groupL">
                <yj-newteach-radio border
                v-for="(childItem,childIndex) in subjectArr" 
                :label="childItem.nameCode" 
                :key="childIndex"
                >
                    {{ childItem.name}}
                </yj-newteach-radio>
                </yj-newteach-radio-group>
            </div>            
        </div>
      <div>
        <div>
          <slot name="tips"></slot>
        </div>
        <div class="tcenter">
          <YjNewteachButton @click="cancel">取 消</YjNewteachButton>
          <YjNewteachButton type="blue" @click="submit">确 定</YjNewteachButton>                   
        </div>
      </div>           
    </YjNewteachVisibilityDialog>     
    <!-- <YjNewteachVisibilityDialog 
    :title = 'dialogTitle'
    :dialogVisible = "dialogVisible"
    dialogWidth = "80%"
    @cancel="cancel"
    >
        <template v-slot>

        </template>
        <template v-slot:footbutton>
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>                
        </template> 
    </YjNewteachVisibilityDialog>     -->
    <SelectClassNewteach @onSubmit="onSubmit" @setClassSelectShow="setClassSelectShow" :dialogVisible="classSelectDialogVisible" :needCheck="needCheck" />
</div>    
</template>

<script>
import { mapGetters } from 'vuex'
import { getMswkData, getLeftMenuData, getResData,getSubjectData} from '@/api/mswk'
import LeftRightNewteach from '@/components/LeftRightNewteach'
import BannerNewteach from '@/components/BannerNewteach'
import DialogNewteach from '@/components/DialogNewteach'
import PageNewteach from '@/components/PageNewteach'
import SelectClassNewteach from '@/components/SelectClassNewteach'
import { yjNewteachRadioGroup,yjNewteachRadio} from 'newteach-ui'
import { click } from '@/api/click'
import { wkResRecommendApi } from '@/api/interface'
export default {
    components:{
        LeftRightNewteach,
        BannerNewteach,
        DialogNewteach,
        PageNewteach,
        SelectClassNewteach,
        yjNewteachRadioGroup,
        yjNewteachRadio        
    },
    data(){
        return {
            catalogId:'',//微课当前选中的章节
            dialogTitle: '微课版本设置',
            dialogVisible:false,
            checkGradeRadioId:'',//当前选中的年级id
            checkGradeRadio:'',  //当前选中的年级 
            checkSubjectRadio:'', //当前选中的学科
            currentGradeIndex: 0, //当前年级
            currentSubjectIndex: 0, //当前学科
            gradeArr: [],//年级
            subjectArr: [], //学科
            leftMenu:[], //左边栏目
            leftMenuIndex:0,//左边栏目当前选择
            resList:[],            
            leftPageCurrent:1, //当前页码
            leftPageSize:15, //每页个数
            rightPageCurrent:1, //当前页码
            rightPageSize:9, //每页个数   
            classSelectDialogVisible:false,//是否弹出班级选择弹窗          
            needCheck:[],//选中的班级            
        }
    },
    computed: {
        ...mapGetters([
            'ksId',
            'currentmfFlag',
            'baseData',
            'fullscreenLoading',
            'dialogFilter',
            'userSelectClassId',
            'teacherNumber',
            'trueTeacherName',
        ]),
        topTitle(){
            let title = ''
            if(this.gradeArr.length > 0){
                title = this.gradeArr[this.currentGradeIndex].name
                if(this.subjectArr.length > 0){
                    title += '|' + this.subjectArr[this.currentSubjectIndex].name
                }
            }
            return title
        },
        leftMenuByPage(){
            if(this.leftMenu.length > 0){
                return this.leftMenu.filter((val,i) => i>=this.leftPageStart&&i<this.leftPageStart+this.leftPageSize)
            }else{
                return []
            }            
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
            //获取弹出面板的菜单
            let menuData = await getMswkData()
            this.gradeArr = menuData.gradeArr
            this.subjectArr = menuData.subjectArr
            this.currentGradeIndex = menuData.currentGradeIndex
            this.currentSubjectIndex = menuData.currentSubjectIndex
            console.log(menuData)
            this.checkGradeRadioId = this.gradeArr[this.currentGradeIndex].id
            this.checkGradeRadio = this.gradeArr[this.currentGradeIndex].nameCode
            this.checkSubjectRadio = this.subjectArr[this.currentSubjectIndex].nameCode
            //获取弹左边的菜单
            let leftMenu = await getLeftMenuData(this.checkGradeRadio,this.checkSubjectRadio)
            this.leftMenu = leftMenu
            console.log(leftMenu)
            //获取右边资源列表
            if(this.leftMenu.length > 0){
                let rightData = await getResData(this.leftMenu[0].id)
                this.catalogId = this.leftMenu[0].id
                this.resList = rightData                
            }                                               
        }
    },  
    methods: {
        async getCurRes(item,index){
            this.leftMenuIndex = index
            this.rightPageCurrent = 1
            let rightData = await getResData(item.id)
            this.catalogId = item.id
            console.log(rightData)
            this.resList = rightData
        },
        //是否展示弹窗
        cancel(){
            this.dialogVisible = false
        },
        //弹窗点击确定
        async submit(){
            this.dialogVisible = false
            this.leftMenuIndex = 0
            this.leftPageCurrent = 1
            this.rightPageCurrent = 1
            //获取弹左边的菜单
            let leftMenu = await getLeftMenuData(this.checkGradeRadio,this.checkSubjectRadio)
            this.leftMenu = leftMenu
            console.log(leftMenu)
            //获取右边资源列表
            if(this.leftMenu.length > 0){
                let rightData = await getResData(this.leftMenuByPage[this.leftMenuIndex].id)
                this.catalogId = this.leftMenuByPage[this.leftMenuIndex].id
                console.log(rightData)
                this.resList = rightData
            }else{
                this.catalogId = ''
                this.resList = []
            }
        },
        async gradeRadioChange(val){        
            let index = this.gradeArr.findIndex(item => item.id == val)               
            
            this.currentGradeIndex = index
            this.checkGradeRadioId = this.gradeArr[this.currentGradeIndex].id
            this.checkGradeRadio = this.gradeArr[this.currentGradeIndex].nameCode

            let res = await getSubjectData(this.gradeArr[index].id)
            this.subjectArr = res.arrList
            this.currentSubjectIndex = res.currentIndex
            this.checkSubjectRadio = this.subjectArr[res.currentIndex].nameCode
        },
        subjectRadioChange(val){
            let index = this.subjectArr.findIndex(item => item.nameCode == val)
            this.currentSubjectIndex = index
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

            let rightData = await getResData(this.leftMenuByPage[this.leftMenuIndex].id)        
            this.catalogId = this.leftMenuByPage[this.leftMenuIndex].id
            this.resList = rightData                        
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
        },
        //是否隐藏年级选择弹窗
        setClassSelectShow(flag){
            this.classSelectDialogVisible = flag
        },
        //名师微课，资源推荐
        async onSubmit(checkList){
            console.log(checkList)
            let res = await wkResRecommendApi(this.catalogId,this.teacherNumber,this.trueTeacherName,checkList.join(','))
            if(res.success){
                this.$messageteach.success('推荐成功')
                this.classSelectDialogVisible = false
            }else{
                this.$messageteach.error('推荐失败！')
            }
        },
        sendCommendClick(){
            this.classSelectDialogVisible = true
            this.needCheck = []
            this.needCheck.push(this.userSelectClassId)
        }

    }
}
</script>

<style type="text/css">
	.ms-flextan {display: flex;}
	.ms-flextan>label {width: 5rem; line-height: 3rem;}
	.ms-flextan>.groupL{flex: 1;text-align: left;}
	.ms-flextan>.groupL>label {margin-bottom: 1vh; margin: 0 1vw 1vh 0!important;;}
</style>

<template>
    <div>
	<el-popover v-popoverWidth="{width:30}" v-model="chapterVisible" placement="top" width="250" trigger="click" class="pad0">
      <div class="overY dtree">
        <el-tree 
        ref="treeBox"
        :data="data" 
        node-key="id"
        :default-expanded-keys="[defaultExpandedKey]"
        highlight-current
        :props="defaultProps" 
        accordion
        @node-click="handleNodeClick"></el-tree>
      </div>
      <el-popover v-popoverWidth="{width:25}" v-model="versionListVisible" placement="right-end" width="280" trigger="click" class="pad0">
        <ul class="bblist" style="max-height: 70vh; overflow-y: auto;">
            <li style="border-bottom:solid 1px #ddd;cursor:pointer " __VCOM_ANALYTICS="tls_xk_bbqh" __VCOM_ANALYTICS_CLICK v-for="(item,index) in bookList" @click="changeBook(item)" :key="index">{{item.name}}</li>
        </ul>
        <div class="morebtn" __VCOM_ANALYTICS="tls_xk_zsbb" __VCOM_ANALYTICS_CLICK @click="openVersionPage" style="cursor:pointer">增删备选版本</div>
        <div class="morebtn" slot="reference" style="cursor:pointer">{{versionInfo}}</div>        
      </el-popover>
      <el-button type="text" slot="reference" :class="isCur?'cur':''" ><i class="iconY xk"></i>选课</el-button>
    </el-popover> 
    <YjNewteachVisibilityDialog title="版本设置" width="85%" max-height="75vh"  :visible.sync="versionVisible" :is-header="true" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
        <br/>
    <div class="dialog-content">
        <div class="formrow">
            <el-form>
                <el-tag v-if="bookList.length == 0">暂无可选版本</el-tag>
                <div class="fen2" v-for="(item,index) in bookList" :key="index">
                <el-tag  closable @close="handleTagClose(item,index)">
                {{item.name}}
                </el-tag> 
                </div>
            <div class="clearfix"></div>
            </el-form>
        </div>
        <el-form  label-width="50px">
            <el-form-item label="学科" class="textL">
                <template  v-for="(item,index) in subjectArr">
                    <yj-newteach-button size="small" plain type="blue" round @click="subjectHandleClick(item)" :key="index" v-if="item.code==curSubjectCode">{{item.name}}</yj-newteach-button>
                    <yj-newteach-button size="small" plain round @click="subjectHandleClick(item)" :key="index" v-else >{{item.name}}</yj-newteach-button>
                </template>                    
            </el-form-item>
            <el-form-item label="年级" class="textL">
                <template  v-for="(item,index) in gradeArr">
                    <yj-newteach-button size="small" plain type="blue" round @click="gradeHandleClick(item)" :key="index" v-if="(curStudyStageCode!='0003'&&item.code==curGradeCode && item.studyStageCode==curStudyStageCode)||(curStudyStageCode=='0003'&&item.code=='')">{{item.name}}</yj-newteach-button>
                    <yj-newteach-button size="small" plain round @click="gradeHandleClick(item)" :key="index" v-else >{{item.name}}</yj-newteach-button>                    
                </template>                    
            </el-form-item>
            <el-form-item label="学期" class="textL" v-if="curStudyStageCode!='0003'">
                <template  v-for="(item,index) in termArr">
                    <yj-newteach-button size="small" plain type="blue" round @click="termHandleClick(item)" :key="index" v-if="item.code==curTermCode">{{item.name}}</yj-newteach-button>
                    <yj-newteach-button size="small" plain round @click="termHandleClick(item)" :key="index" v-else >{{item.name}}</yj-newteach-button>                                        
                </template>                    
            </el-form-item>
            <el-form-item label="版本" class="textL">
                <template  v-for="(item,index) in versionArr">
                    <yj-newteach-button size="small" plain type="blue" round @click="versionHandleClick(item)" :key="index" v-if="item.code==curVersionCode">{{item.name}}</yj-newteach-button>
                    <yj-newteach-button size="small" plain round @click="versionHandleClick(item)" :key="index" v-else >{{item.name}}</yj-newteach-button>                                        
                </template>    
            </el-form-item>
            <el-form-item label="册数" class="textL" v-if="curStudyStageCode=='0003'">
                <template  v-for="(item,index) in bixiuArr">
                    <yj-newteach-button size="small" plain type="blue" round @click="bixiuHandleClick(item)" :key="index" v-if="item.bookOptionCode==curBixiuCode">{{item.name}}</yj-newteach-button>
                    <yj-newteach-button size="small" plain round @click="bixiuHandleClick(item)" :key="index" v-else >{{item.name}}</yj-newteach-button>
                </template>    
            </el-form-item>                
            <el-col :span="24">
                <yj-newteach-card shadow="always">
                {{curSelectBook}}  
                <yj-newteach-button v-if="isShowAdd" plain round @click="addVersion"  size="small">确定增加</yj-newteach-button>
                <yj-newteach-button v-if="!isShowAdd" plain round type="blue" size="small" disabled>已增加</yj-newteach-button>
                </yj-newteach-card>
            </el-col>
            <el-button type="danger" icon="el-icon-close" circle @click="close" style="position: absolute; right: 1vh; bottom: 1vh;"></el-button>       			    
            <div class="clearfix"></div>
        </el-form>
    </div>
    </YjNewteachVisibilityDialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import commonUtils from '@/utils/common'
import { addUserLastCourseToDb,getChapterAndBookData,getUserAllBookListByTms} from '@/api/userinfo'
import request from '@/utils/request'
import DialogNewteach from '@/components/DialogNewteach'
import { getSubjectApi, getGradeTermVersionBySubjectApi,saveUserVersionApi,delUserVersionApi,setUserVersionProgressApi } from '@/api/interface'
export default {
    name: 'chapter',
    components: {
        DialogNewteach
    },
    computed: {
        ...mapGetters([
            'teacherNumber',
            'curModule',
            'baseData',
            'ksId',
            'classHourId'
        ]),
        versionInfo(){
            let str = ''
            if(this.baseData.studyStageCode != '0003'){
                str = this.baseData.grade + ' • ' +this.baseData.term + ' • ' + this.baseData.subject + ' • ' + this.baseData.version
            }else{
                str = this.baseData.studyStage + ' • ' + this.baseData.subject + ' • ' + this.baseData.version + ' • ' + this.baseData.bookOptionName
            }
            return str
        },
        //当前选择的课本
        curSelectBook(){
            let name = ''

            let subjectTmp = this.subjectArr.filter(item=>item.code == this.curSubjectCode)
            let versionTmp = this.versionArr.filter(item=>item.code == this.curVersionCode)
            
            if(this.curStudyStageCode != '0003'){
                //非高中
                let gradeTmp = this.gradeArr.filter(item=>item.code == this.curGradeCode && item.studyStageCode == this.curStudyStageCode)
                let termTmp = this.termArr.filter(item=>item.code == this.curTermCode)
                if(gradeTmp.length > 0 && termTmp.length > 0 && subjectTmp.length > 0 && versionTmp.length > 0){
                    name = gradeTmp[0].name + '  ·  ' + termTmp[0].name + '  ·  ' + subjectTmp[0].name + '  ·  ' + versionTmp[0].name
                    this.needAddVersionCode = versionTmp[0].code
                }                
            }else{
                //高中
                let bixiuTmp = this.bixiuArr.filter(item=>item.bookOptionCode == this.curBixiuCode)
                if(subjectTmp.length > 0 && versionTmp.length > 0 && bixiuTmp.length > 0){
                    name = '高中  ·  ' + subjectTmp[0].name + '  ·  ' + versionTmp[0].name + '  ·  ' + bixiuTmp[0].name
                    this.needAddVersionCode = versionTmp[0].code
                    this.needAddBixiuCode = bixiuTmp[0].bookOptionCode
                }                
            }
            return name
        },
        //是否展示确定添加按钮
        isShowAdd(){
            return this.bookList.filter(item => item.bookId == this.curBookCode).length == 0
        },
        isCur(){            
            if(this.chapterVisible){
                //处理目录树的span标签
                let doms = document.getElementsByClassName('is-leaf')
                for(let i=0; i<doms.length; i++){
                    let nodes = doms[i].parentNode.querySelectorAll("span.teachPadding")
                    if(nodes.length == 0){
                        doms[i].style.display = 'none'
                        var newItem=document.createElement("span")
                        newItem.className = 'teachPadding'
                        newItem.setAttribute('style','padding:6px 11px;');
                        
                        doms[i].parentNode.insertBefore(newItem,doms[i])
                    }
                }         
            }
            if(this.chapterVisible||this.versionListVisible){
                let zIndex = commonUtils.getMInPopoverZindex()
                document.getElementById('dialogFilterDiv').style.zIndex = zIndex
                // setTimeout(()=>{this.$store.dispatch('setDialogFilter',true)},200)
                this.$store.dispatch('setDialogFilter',true)
                return true
            }else{
                this.$store.dispatch('setDialogFilter',false)
                return false
            }
        }
    },
    data(){
        return{
            bookList: [],       
            baseChapterData:[],//基础章节信息     
            curBookId: '',
            defaultExpandedKey: '',//默认展开的章节
            bookChapterArr: [],//单元列表
            treeNoClassHour: [],//不含课时的树
            treeHasClassHour: [],//包含课时的树
            data:[],
            versionVisible: false,//是否展示版本管理界面
            chapterVisible:false,//是否展示目录树
            versionListVisible:false,//是否展示目录列表
            defaultProps: {
            children: 'children',
            label: 'label'
            },
            subjectArr:[],//学科基础数据
            gradeArr:[],//年级基础数据
            termArr:[],//学期基础数据
            versionArr:[],//版本列表
            bixiuArr:[],//必修选修,
            curSubjectCode:'',//当前学科
            curGradeCode:'',//当前年级
            curTermCode:'',//当前学期
            curVersionCode:'',//当前版本
            curBookCode:'',//当前弹窗选择的bookId
            curBixiuCode:'',//当前必修
            curStudyStageCode:'',//当前学段
            curDataBySubject:[],//当前学科下的所有数据
            needAddVersionCode:'',//当前要添加的版本
            needAddBixiuCode:'',//当前要添加的选修必修
            isReloadChapter:false,//是否重新获取目录
        }
    },
    watch:{
        curModule(newVal, oldVal){
            if(newVal != oldVal){
                // this.getBookList()
            }
            if(newVal == '课堂教学'){
                this.data = this.treeHasClassHour

                let classHourId = ''
                let classHourName = ''
                let arr = this.baseChapterData.filter(item => item.code == this.ksId);
                if(arr.length > 0){
                    if(typeof arr[0].classHours != 'undefined' && arr[0].classHours.length > 0){
                        let classHourId = arr[0].classHours[0].id
                        let classHourName = arr[0].classHours[0].name
                        this.$store.dispatch('setClassHourId', classHourId)
                        this.$store.dispatch('setClassHourName',classHourName)
                    }
                }
            //    let obj = this.getCurClassHourId(this.data,this.ksId)
            //    console.log(obj)

                if(classHourId != ''){
                    this.expandAndCheck(this.classHourId)
                }else{
                    this.expandAndCheck(this.ksId)
                }                
            }else{
                this.data = this.treeNoClassHour
                this.expandAndCheck(this.ksId)
            }
        }
    },
    async mounted(){
        await this.getBookList()
        //获取基础学科信息
        await this.getSubjectList()
        //根据学科获取年级，学期以及版本信息
        await this.getGradeTermVersionBySubjectData()
    },
    methods:{
        getCurClassHourId(arr,ksId){                 
            let obj = {}      
            for(let item of arr){
                if(item.ksCode == ksId && item.isUnit == 2){
                    obj.classHourId = item.id
                    obj.classHourName = item.label
                    return obj
                }else{
                    
                    if(typeof item.children!= 'undefined' && item.children.length > 0){
                        let tmp = {}                        
                        tmp = this.getCurClassHourId(item.children,ksId)
                        if(typeof tmp.classHourId == 'undefined'){
                            continue
                        }else{
                            return tmp
                        }
                    }else{
                        continue
                    }
                }             
            }
            return obj
        },
        changeVisible(flag){
            this.versionVisible = flag
        },
        //获取基础学科信息
        async getSubjectList(){
            try{
                let res = await getSubjectApi();

                if(res.code == '200'){
                    let arr = []
                    for(let item of res.data.rtnArray){
                        let obj = {}
                        obj.name = item.subject
                        obj.code = item.subjectCode
                        arr.push(obj)
                    }
                    this.subjectArr = arr
                }else{
                    commonUtils.console('调用学科接口失败',res.message)
                }
            }catch(e){
                commonUtils.console(e)
            }
        },
        //根据学科获取年级，学期以及版本信息
        async getGradeTermVersionBySubjectData(){
            try{
                let res = await getGradeTermVersionBySubjectApi(this.curSubjectCode)
                if(res.code == '200'){
                    this.curDataBySubject = res.data.subjectGradeVersion.grades
                    this.formatBaseData(res.data.subjectGradeVersion.grades)
                }else{
                    commonUtils.console('调用年级接口失败',res.message)
                }
            }catch(e){
                commonUtils.console(e)
            }            
        },
        //获取所有章节以及版本
        async getBookList(){
            let res = await getChapterAndBookData(this)

            this.data = res.data
            this.bookList = res.bookList
            this.baseChapterData = res.baseChapterData
            this.curBookId = res.curBookId
            this.treeHasClassHour = res.treeHasClassHour
            this.treeNoClassHour = res.treeNoClassHour
            this.expandAndCheck(res.defaultCheckedKey)

            this.curSubjectCode = this.baseData.subjectCode
            this.curGradeCode = this.baseData.gradeCode
            this.curTermCode = this.baseData.termCode
            this.curVersionCode = this.baseData.versionCode
            this.curBixiuCode = this.baseData.bookOptionCode
            this.curStudyStageCode = this.baseData.studyStageCode
        },
        //设置用户基本信息
        setUserBaseData(tmp){
            let baseDataObj = {}
            baseDataObj.grade = tmp.grade
            baseDataObj.gradeCode = tmp.gradeCode
            baseDataObj.studyStage = tmp.studyStage
            baseDataObj.studyStageCode = tmp.studyStageCode
            baseDataObj.subject = tmp.subject
            baseDataObj.subjectCode = tmp.subjectCode
            baseDataObj.term = tmp.term
            baseDataObj.termCode = tmp.termCode
            baseDataObj.version = tmp.version
            baseDataObj.versionCode = tmp.versionCode
            baseDataObj.bookOptionCode = tmp.bookOptionCode
            return baseDataObj
       },
       //设置当前展开和选中的项(展开和选中都用选中的id)
       expandAndCheck(defaultCheckedKey){
           this.defaultExpandedKey = defaultCheckedKey
            this.$nextTick(() => {
                // treeBox 元素的ref   value 绑定的node-key
                this.$refs.treeBox.setCurrentKey(defaultCheckedKey); 
            });
       },
       //切换章节
        handleNodeClick(a,b,c) {        
            console.log(a)
            console.log(b)
            console.log(c)
            console.log(c.$children[0].$el.textContent)
            console.log('-------')    
            if(a.children){
                if(a.children.length == 0){
                    console.log("xxxxxxxxxx:"+a.classHourId)
                    //添加记录(点击的是章节，且章节下只有一个课时)
                    addUserLastCourseToDb(a.ksCode,a.classHourId).then((response) => {
                        if(response.flag == '1'){
                            this.$store.dispatch('setKsName',a.label)
                            this.$store.dispatch('setKsId',a.ksCode)
                            this.$store.dispatch('setClassHourName',a.classHourName)
                            this.$store.dispatch('setClassHourId',a.classHourId)
                            this.$store.dispatch('setIsShowClassHour',false)
                            this.$store.dispatch('setMfFlag',a.mfFlag)
                        }
                    }).catch((e) => {

                    })
                }else if(a.children.length > 0){
                    console.log('aaaaaaa')
                    //替换目录树上的不能点击的span,替换成自己的span
                    setTimeout(()=>{
                        let nodeContents = document.getElementsByClassName('el-tree-node__content')
                        for(let i =0; i<nodeContents.length; i++){
                            console.log(nodeContents[i].textContent+"=="+c.$children[0].$el.textContent)
                            if(nodeContents[i].textContent == c.$children[0].$el.textContent){

                                let doms = nodeContents[i].nextSibling.getElementsByClassName('is-leaf')
                                console.log(doms)
                                console.log(doms.length)
                                for(let j=0; j<doms.length; j++){                                    
                                    doms[j].style.display = 'none'
                                    let nodes = doms[j].parentNode.querySelectorAll("span.teachPadding")
                                    if(nodes.length == 0){
                                        var newItem=document.createElement("span")
                                        newItem.className = 'teachPadding'
                                        newItem.setAttribute('style','padding:6px 11px;');
                                        
                                        doms[j].parentNode.insertBefore(newItem,doms[j])
                                    }
                                }
                                break;
                            }
                        }
                    },300)
                    return false
                }
            }else{
                //添加记录(点击的是课时)
                addUserLastCourseToDb(a.ksCode,a.id).then((response) => {
                        if(response.flag == '1'){
                            this.$store.dispatch('setKsName',a.ksName)
                            this.$store.dispatch('setKsId',a.ksCode)
                            this.$store.dispatch('setClassHourName',a.label)
                            this.$store.dispatch('setClassHourId',a.id)
                            this.$store.dispatch('setIsShowClassHour',true)
                        }
                    }).catch((e) => {
                        
                    })
            }
            this.chapterVisible = false
        },
        async changeBook(item){
            await setUserVersionProgressApi(item.bookId)
            this.getBookList()
            this.chapterVisible = true
            this.versionListVisible = false
        },
        async addVersion(){
            let res = await saveUserVersionApi(this.curBookCode)
            if(res.code == 200){
                let obj = {}
                obj.bookId = this.curBookCode
                obj.name = this.curSelectBook
                this.bookList.push(obj)
                let result = await setUserVersionProgressApi(this.curBookCode)
                if(result.code == '200'){
                    this.isReloadChapter = true
                }else{
                    this.$messageteach.error(result.message)    
                }
            }else{
                this.$messageteach.error(res.message)
            }
        },
        //打开版本选择面板
        async openVersionPage(){
            let res = await getUserAllBookListByTms()
            if(res.rtnArray.length == 0){
                this.bookList = []
                this.isReloadChapter = true
            }
            this.chapterVisible = false
            this.versionListVisible = false
            this.versionVisible = true
        },
        //关闭版本选择面板
        close(){
            //判断只有新增过才刷新目录
            this.versionVisible = false
            if(this.isReloadChapter){
                this.getBookList()
                this.isReloadChapter = false
            }
        },
        //删除教师版本
        async handleTagClose(tag,index){
            let res = await delUserVersionApi(tag.bookId)
            if(res.code == '200'){
                this.bookList.splice(index,1)
            }else{
                this.$messageteach.error(res.message)
            }
            if(this.bookList.length == 0){
                this.isReloadChapter = true
            }            
            commonUtils.console(tag,index)            
        },
        //选择学科
        async subjectHandleClick(item){
            //置空当前选择
            this.curSubjectCode = item.code
            this.curGradeCode = -1    
            this.curVersionCode = -1
            this.curTermCode = -1
            this.curBixiuCode = -1
            this.curStudyStageCode = -1

            let res = await getGradeTermVersionBySubjectApi(item.code)
            if(res.code == '200'){
                this.curDataBySubject = res.data.subjectGradeVersion.grades
                this.formatBaseData(res.data.subjectGradeVersion.grades)
            }else{
                commonUtils.console('调用年级接口失败',res.message)
            }
        },
        //年级选择
        gradeHandleClick(item){
            this.curGradeCode = item.code
            this.curStudyStageCode = item.studyStageCode 
            this.curTermCode = -1           
            this.curVersionCode = -1
            this.curBixiuCode = -1

            
            this.formatBaseData(this.curDataBySubject)            
        },
        //学期选择
        termHandleClick(item){
            this.curTermCode = item.code    
            this.curVersionCode = -1
            this.curBixiuCode = -1
                    
            this.formatBaseData(this.curDataBySubject)            
        },        
        //版本选择
        versionHandleClick(item){
            this.curVersionCode = item.code
            this.curBixiuCode = -1

            this.formatBaseData(this.curDataBySubject)                  
        },   
        //册数选择
        bixiuHandleClick(item){
            this.curBixiuCode = item.bookOptionCode

            this.formatBaseData(this.curDataBySubject) 
        },                        
        //格式化基础学科，年级，版本等信息
        formatBaseData(baseData){          
            let gradeArr = []
            let termArr = []
            let versionArr = []
            let bixiuArr = []

            //先清空
            this.gradeArr = gradeArr
            this.termArr = termArr
            this.versionArr = versionArr
            this.bixiuArr = bixiuArr 

            for(let item of baseData){
                let gradeObj = {}

                if(this.curGradeCode == -1){
                    this.curGradeCode = item.gradeCode
                }
                if(this.curStudyStageCode == -1){
                    this.curStudyStageCode = item.studyStageCode
                }
                if(item.studyStageCode != '0003'){
                    //非高中
                    //六年级带上学段（区分六三制和五四制）
                    if(item.gradeCode == '0006'){
                        gradeObj.name = item.studyStageName+item.grade
                    }else{
                        gradeObj.name = item.grade
                    }                    
                    gradeObj.code = item.gradeCode
                    gradeObj.studyStageName = item.studyStageName
                    gradeObj.studyStageCode = item.studyStageCode
                    gradeArr.push(gradeObj)
                    if(this.curGradeCode == -1){
                        this.curGradeCode = item.gradeCode
                    }
                    if(item.gradeCode == this.curGradeCode && item.studyStageCode == this.curStudyStageCode){
                        for(let val of item.terms){      
                            let termObj = {}                                                 
                            termObj.name = val.term
                            termObj.code = val.termCode
                            termArr.push(termObj)

                            if(this.curTermCode == -1){
                                this.curTermCode = val.termCode
                            }
                            
                            if(val.termCode == this.curTermCode){
                                for(let obj of val.versions){
                                    if(this.curVersionCode == -1){
                                        this.curVersionCode = obj.versionCode
                                    }
                                    if(obj.versionCode == this.curVersionCode){
                                        this.curBookCode = obj.books[0].bookId
                                    }
                                    let versionObj = {}
                                    versionObj.name = obj.version
                                    versionObj.code = obj.versionCode
                                    versionObj.bookId = obj.books[0].bookId
                                    versionArr.push(versionObj)                                    
                                }
                            }
                        }
                    }
                }else{
                    //高中
                    gradeObj.name = item.studyStageName
                    gradeObj.code = '' //高中code为空
                    gradeObj.studyStageName = item.studyStageName
                    gradeObj.studyStageCode = item.studyStageCode
                    gradeArr.push(gradeObj)

                    if(this.curStudyStageCode == -1){
                        this.curStudyStageCode = item.studyStageCode
                    }

                    if(this.curStudyStageCode == '0003'){
                        //当前高中
                        for(let val of item.terms){      
                            for(let obj of val.versions){
                                if(this.curVersionCode == -1){
                                    this.curVersionCode = obj.versionCode
                                }                                
                                let versionObj = {}
                                versionObj.name = obj.version
                                versionObj.code = obj.versionCode

                                versionArr.push(versionObj)
                                if(obj.versionCode == this.curVersionCode){
                                    for(let curObj of obj.books){
                                        if(this.curBixiuCode == -1){
                                            this.curBixiuCode = curObj.bookOptionCode
                                        }
                                        if(curObj.bookOptionCode == this.curBixiuCode){
                                            this.curBookCode = curObj.bookId
                                        }
                                        let xiuObj = {}
                                        xiuObj.name = curObj.bookOptionName
                                        xiuObj.bookId = curObj.bookId
                                        xiuObj.bookOptionCode = curObj.bookOptionCode
                                        bixiuArr.push(xiuObj)                                        
                                    }
                                }
                                
                            }
                        }
                    }
                }


            }


            this.gradeArr = gradeArr
            this.termArr = termArr
            this.versionArr = versionArr
            this.bixiuArr = bixiuArr            
        }
    }
}
</script>

<style scoped>
.w60 {width: 60px;}
.img100{width:100%}

.line60{line-height: 60px;}
.pad10{padding: 10px;}
.yyList {font-size: 20px; color: #333;}
.text-center{text-align: center;}
button.yuan {width: 30px; height: 30px; background: url(../../../assets/images/ico.png); border:0; margin:10px;}
button.yuan.left { background-position: -23px -231px; }
button.yuan.right { background-position: -65px -231px;}
button.yuan.left.cur {background-position: -104px -231px;}
button.yuan.right.cur {background-position: -146px -231px;}
button.yuan02 {width: 20px; height: 20px; background: url(../../../assets/images/ico.png); background-position: -193px -237px;}
button.yuan02.cur {background-position: -222px -237px;}
.morebtn {background: #269bd7;    color: #fff;    padding: 1vh 3vh 1vh 1vh;    font-size: 0.8rem;    margin: 0;    /* line-height: 2rem;    height: 3vh; */ white-space: nowrap;    overflow: hidden;    text-overflow: ellipsis;}
.el-tag{margin: 0.3vh; display: block;}
.fen2 {width: 50%; float:left;}
.overY {overflow-y: auto; height: 55vh;}
.clearfix {clear: both;}
.el-form-item {margin-bottom:5px;}
.formrow {margin: -20px -10px 20px; height:16vh; overflow-y: auto;border: solid 0.3vh #e1f0ff;
    margin-bottom: 2vh;
    padding: 1vh;background: #f2f7ff;}
.el-card__body {padding:10px 20px; margin-bottom: 20px;}
.dialog {margin-bottom: 0;}
.borderL {border-left: 4px solid rgb(38, 154, 215) !important;}
.textL {text-align: left;}
.el-tree-node__label{font-size: 0.8rem;}
.bblist {    margin: 0;    padding: 0;    overflow: hidden;    word-wrap: normal;    text-overflow: ellipsis;}
.bblist li {line-height: 2.6rem; padding: 0 1vh; font-size: 0.8rem;    white-space: nowrap;    overflow: hidden;    text-overflow: ellipsis;}
.myspan {
    padding: 6px;
    color: transparent;
    text-transform: none;
}
</style>

<template>
    <div style="height:100%" class="flexdy jxfx">
        <input type="hidden" id="__VCOM_ANALYTICS_PAGEFLAG" value="tls_jxfx_jxfx" />

        <div>
            <!-- <BannerNewteach/>  -->
            <div v-if="currentmfFlag == 0||currentmfFlag == 1" class="flexjx">
				<div class="flex1">
                <el-table
                    v-loading="loading"
                    :data="resByPage"
                    :empty-text="eMessage"
                    @row-click="rowClick"
                    style="width: 100%">
                    <el-table-column label="知识点">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.title }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  label="中考重要性" v-if="isShowZhongkao">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.gradeFrequency }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="加权均分率">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.accuracy }}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column label="典型错题">
                        <template slot-scope="scope">
                            <span :class='{"wrongs":(scope.row.uncorrectAmount>0)}' style="margin-left: 10px" @click="wrongQuestions(scope.row.knowledgeId)">{{ scope.row.uncorrectAmount }}</span>
                        </template>
                    </el-table-column>                          
                    <el-table-column label="提分方案">
                        <template slot-scope="scope">
                            <el-button
                            type="primary"
                            v-for="(item,index) in scope.row.button"
                            :key="index"
                            :__VCOM_ANALYTICS="item.pvkey"
                            __VCOM_ANALYTICS_CLICK
                            @click.stop="handleButton(item,scope.row)">{{item.name}}</el-button>
                        </template>
                    </el-table-column>                    
                </el-table>  
				 </div>
				<div class="flex-lr" style=" flex:none;" >
					<PageNewteach :pageCurrent="pageCurrent" :pageTotal="pageTotal" @pageClick="pageClick"/>
				<el-tag>温馨提示：典型错题为班级学生错误率超过60%的试题，加权均分率为学生在难中易不同难度层次得分率的加权均分率</el-tag>
                </div>
            </div>
            <TabsNewteach
             v-if="currentmfFlag != 0 && currentmfFlag != 1" 
             ref="tabRef"
            :tabPosition="tabPosition"
            :data="tabArr"
            @tabClick="tabClick"
            >
                <template v-slot>
                    <div class="flex1">
                        <el-table
                            :empty-text="eMessage"
                            :data="resByPage"
                            @row-click="rowClick"
                            style="width: 100%">
                            <el-table-column label="知识点">
                                <template slot-scope="scope">
                                    <span style="margin-left: 10px">{{ scope.row.title }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="中考重要性" v-if="isShowZhongkao">
                                <template slot-scope="scope">
                                    <span style="margin-left: 10px">{{ scope.row.gradeFrequency }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="加权均分率">
                                <template slot-scope="scope">
                                    <span style="margin-left: 10px">{{ scope.row.accuracy }}</span>
                                </template>
                            </el-table-column>  
                            <el-table-column label="典型错题">
                                <template slot-scope="scope">
                                    <span :class='{"wrongs":(scope.row.uncorrectAmount>0)}' style="margin-left: 10px" @click="wrongQuestions(scope.row.knowledgeId)">{{ scope.row.uncorrectAmount }}</span>
                                </template>
                            </el-table-column>                          
                            <el-table-column label="提分方案">
                                <template slot-scope="scope">
                                    <el-button
                                    type="primary"
                                    v-for="(item,index) in scope.row.button"
                                    :key="index"
                                    :__VCOM_ANALYTICS="item.pvkey"
                                    __VCOM_ANALYTICS_CLICK
                                    @click.stop="handleButton(item,scope.row)">{{item.name}}</el-button>
                                </template>
                            </el-table-column>               
                        </el-table>   
                        <div class="flex-lr" style=" flex:none;" >
                        <PageNewteach :pageCurrent="pageCurrent" :pageTotal="pageTotal" @pageClick="pageClick"/>
                        </div>
                    </div>
                </template>
            </TabsNewteach>            
        </div>
        <DialogNewteach 
            :dialogVisible = "dialogVisible"
            :footerVisible = false
            @cancel="cancel"
            >
                <template v-slot>
                    <el-row :gutter="30" v-if="trainData!=null">
                    <el-col :span="3">&nbsp;</el-col>
                    <el-col :span="6">涉及知识点数：{{trainData.knowledgeNum}}</el-col>
                    <el-col :span="6">试题数量：{{trainData.question_num}}</el-col>
                    <el-col :span="6">难度：{{trainData.difficulty}}</el-col>
                    <el-col :span="3">&nbsp;</el-col>
                    </el-row>
                    <br/>
                        <el-button @click="openTrain" >开始训练</el-button>
                        <el-button @click="openExplain" >提分训练解析</el-button>
                        <el-button @click="sendTrain" >发送给学生</el-button>
                    <br/><br/>
                    <el-button type="danger" icon="el-icon-close" circle @click="cancel" style="position: absolute; right: 1vh; bottom: 1vh;"></el-button>       
                </template>
                <!-- <template v-slot:footbutton>
                    <el-button @click="cancel">关闭</el-button>
                </template> -->
        </DialogNewteach>
    </div>    
</template>

<script>
import { mapGetters } from 'vuex'
import BannerNewteach from '@/components/BannerNewteach'
import TabsNewteach from '@/components/TabsNewteachs'
import PageNewteach from '@/components/PageNewteach'
import DialogNewteach from '@/components/DialogNewteach'
import { click } from '@/api/click'
import { saveSendTrainApi,openTrainExplainApi,wrongQuestionsApi } from '@/api/interface'
import { getJxfxSubject, getJxfxWkData, getJxfxXunlianData, getJxfxRes, formatJxfxRes,getJxfxSubjectNew,setViewData} from '@/api/jxfx'
import commonUtils from '@/utils/common'
export default {
    components:{
        TabsNewteach,
        PageNewteach,
        DialogNewteach,
        BannerNewteach
    },
    data(){
        return{
            tabPosition: 'bottom',
            activeIndex: 0,
            tabArr: [],
            resList: [],//任务列表数组       
            pageCurrent:1,
            pageSize: 10,
            dialogVisible:false,
            trainData:null,//提分训练数据缓存
            selectRow:null,//选中数据
            loading:true,
            eMessage:"数据加载中.."
        }
    },
    computed: {
        ...mapGetters([
            'ksId',
            'currentmfFlag',
            'dialogFilter'
        ]),
        isShowZhongkao(){
            if(this.currentmfFlag == 0 || this.currentmfFlag == 1 ){
                return false
            }else{
                return true
            }            
        },
        resByPage(){
            if(this.resList.length > 0){
                return this.resList.filter((val,i) => i>=this.pageStart&&i<this.pageStart+this.pageSize)
            }else{
                return []
            }            
        },
        pageStart(){
          let rn=(this.pageCurrent-1)*this.pageSize;
          return rn; 
        },        
        pageTotal(){
            if(this.resList==null){
                return 0;
            }
            let rn=Math.ceil(this.resList.length/this.pageSize);
            if(rn==null){
                rn=0;
            }
            return rn;
        }
    },    
    watch: {
        ksId(newVal,oldVal){
          if(newVal != ''){
            //getJxfxSubject(this)
            this.getRes()
          }
        }
    },
    mounted(){
        if(this.currentmfFlag !='0' && this.currentmfFlag != '1'){
            
        }
        // getJxfxSubject(this)
        this.getRes()
        
    },    
    methods: {
        //切换标签
        async tabClick(tab,event){
            console.log(tab,event)
            this.pageCurrent = 1
            this.activeIndex = tab.index

            let resData = await getJxfxRes(this.tabArr[this.activeIndex].type)            
            let resultObj = formatJxfxRes(resData)              
            this.resList = resultObj.resList            
        },    
        async getRes(){
            this.loading = true;
            let res = await getJxfxSubjectNew()
            console.log(res)
            await setViewData(this,res)
            this.loading = false
        },
        //点击整行事件(打开任务详情)
        rowClick(row, column){
          console.log(row)
          console.log('row')         
        },    
        pageClick(val){
          if(val == 'pre'){
            this.pageCurrent--
          }else{
            this.pageCurrent++
          }
        },
        wrongQuestions(knowledgeId){
            let protocol=this.$store.getters.domainConfig.LOCAL_PROTOCOL;
            let tqms = this.$store.getters.domainConfig.QBMS;
            let tqmsUrl=protocol+"://"+tqms;
            let ksid=this.$store.getters.ksId
            let usernumber=this.$store.getters.teacherNumber
            let classid= this.$store.getters.userSelectClassId
            let loginStyle=0;
            console.log(tqmsUrl);
            wrongQuestionsApi(tqmsUrl,ksid,usernumber,classid,knowledgeId,loginStyle);
        },
        async handleButton(item,row){
            console.log("教学分析：select item:");
            console.log(item);
            console.log(" row:");
            console.log(row)
            this.selectRow=row;
            if(item.type == 'weike'){
                let res = await getJxfxWkData(row.fourthKnowledgeId)
                console.log("提分微课：");
                console.log(res);
                //播放资源
                if(res==null || res.infos==null || res.infos.length==0){
                    this.$messageteach.error("暂无对应课程！");
                }else{
                    let robj=res.infos[0];
                    let playJs = {'playName':'playRes',params:{'rcode':robj.RCode,'rtitle':robj.RTitle,'resType':5}}
                    click(playJs)
               }
            }else{
                let res = await getJxfxXunlianData(row.knowledgeId)
                if(!res.success){
                    this.$messageteach.error('您的训练记录尚不足生成提分训练，赶紧训练吧')
                }else{
                    this.trainData=res;
                    this.dialogVisible = true
                }
            }
        },
        //是否展示弹窗
        cancel(){
            this.dialogVisible = false
        },
                
        //提升训练发送给学生
        async sendTrain(){
            if(this.trainData.question_num==0){
                this.$messageteach.error("试题个数为零！");
                return;
            }
            if(this.$store.getters.userSelectClassId==null){
                this.$messageteach.error("您尚未设置当前班级！");
                return;
            }
            
            let saveRes=await saveSendTrainApi(this.$store.getters.teacherNumber,this.$store.getters.trueTeacherName,this.$store.getters.userType,this.$store.getters.areaId,this.$store.getters.userSelectClassId,this.$store.getters.baseData.subjectCode,this.$store.getters.ksBookId,this.$store.getters.ksId,this.selectRow.title,this.trainData.question_ids,1)
            if(saveRes.success){
                this.$messageteach.success(saveRes.msg);
            }else{
                this.$messageteach.error(saveRes.msg);
            }
        },
        //打开训练
        async openTrain(){
            if(this.trainData.question_num==0){
                this.$messageteach.error("试题个数为零！");
                return;
            }
            if(this.$store.getters.userSelectClassId==null){
                this.$messageteach.error("您尚未设置当前班级！");
                return;
            }
            
            let saveRes=await saveSendTrainApi(this.$store.getters.teacherNumber,this.$store.getters.trueTeacherName,this.$store.getters.userType,this.$store.getters.areaId,this.$store.getters.userSelectClassId,this.$store.getters.baseData.subjectCode,this.$store.getters.ksBookId,this.$store.getters.ksId,this.selectRow.title,this.trainData.question_ids,2)
            if(saveRes.success){
                let params = {}
                params.playName = 'zuoda'
                params.params = {rcode:saveRes.paperId,rsType:"6"}
                click(params)
            }else{
                this.$messageteach.success(saveRes.msg);
            }
        },
        //提升训练查看分析
        openExplain(){
            openTrainExplainApi(this.$store.getters.teacherNumber,this.$store.getters.trueTeacherName,this.$store.getters.userType,this.$store.getters.areaId,this.$store.getters.userSelectClassId,this.$store.getters.baseData.subjectCode,this.$store.getters.ksBookId,this.$store.getters.ksId,this.selectRow.title,this.trainData.question_ids)
        }
    }
}
</script>

<style>
.wrongs {text-decoration: underline;cursor: pointer}
.flexjx {display: flex; flex: 1; flex-direction: column; background: #fff;}
.flex1 {flex: 1;}
.jxfx .el-table::before{display: none}
.jxfx .el-table .cell {line-height: 5vh;}
</style>

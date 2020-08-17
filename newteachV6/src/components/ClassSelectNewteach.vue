<template>
<!-- 切换班级弹窗 -->
<YjNewteachVisibilityDialog width="80%" height="70vh" title = '班级设置' center :visible.sync="classSelect" :close-on-click-modal=false :close-on-press-escape = false :show-close=false>     

    <yj-newteach-tabs tab-position="right" v-model="activeName" @tab-click="tabClick">
<!-- 		<div class="class-select-background"> -->
        <yj-newteach-tab-pane label="教师班级" name="教师班级" class="class-select-background">
            <el-row :gutter="20">
                <el-col>
                    <div class="dressxz">
                        <template v-for = "(item,index) in classArr" >
                            <yj-newteach-button size="small" plain type="blue" round @click="checkClass(item,index)" :key="index" v-if="item.classId == actionClass">{{item.className}}</yj-newteach-button>
                            <yj-newteach-button size="small" plain round @click="checkClass(item,index)" :key="index" v-else >{{item.className}}</yj-newteach-button>
                        </template>							
                    </div>
                </el-col>
            </el-row>
        </yj-newteach-tab-pane>
        <yj-newteach-tab-pane label="全部班级" name="全部班级" class="class-select-background">
            <el-row :gutter="20">
                <el-col>
                    <div class="dressxz">
                        <template v-for = "(item,index) in classArr" >
                            <yj-newteach-button size="small" plain type="blue" round @click="checkClass(item,index)" :key="index" v-if="item.classId == actionClass">{{item.className}}</yj-newteach-button>
                            <yj-newteach-button size="small" plain round @click="checkClass(item,index)" :key="index" v-else >{{item.className}}</yj-newteach-button>
                        </template>							
                    </div>
                </el-col>
            </el-row>
        </yj-newteach-tab-pane>
        <yj-newteach-tab-pane label="学习卡组配置" name="学习卡组配置" class="class-select-background">
            <el-row :gutter="20">
                <el-col>
                    <div class="cardremark">根据学校安排情况，选择一个公用教室，若该教室不是公用学习卡使用教室，请勿选择，以免影响您正常上课</div>
                    <div class="dressxz">
                        <template v-for = "(item,index) in groupArr" >
                            <yj-newteach-button size="small" plain type="blue" round @click="checkGroup(item,index)" :key="index" v-if="item.groupId == actionGroup">{{item.groupName}}</yj-newteach-button>
                            <yj-newteach-button size="small" plain round @click="checkGroup(item,index)" :key="index" v-else >{{item.groupName}}</yj-newteach-button>
                        </template>
                        <yj-newteach-button size="small" plain type="blue" v-if="actionGroup==''" round @click="uncheckGroup" >不选择</yj-newteach-button>
                        <yj-newteach-button size="small" plain  v-else round @click="uncheckGroup" >不选择</yj-newteach-button>
                    </div>
                </el-col>
            </el-row>
        </yj-newteach-tab-pane>
<!-- 		</div> -->
    </yj-newteach-tabs>        

    <div slot="footer">
    <yj-newteach-button size="small" @click="cancel">取 消</yj-newteach-button>
    <yj-newteach-button size="small" type="blue" @click="submit" :disabled="enableClick">确 定</yj-newteach-button>      
    </div>

</YjNewteachVisibilityDialog>
<!-- <DialogNewteach 
		title = '班级设置'
		dialogWidth = '80%'
		:dialogVisible = "classSelect"
        :dialogClose = false
        @cancel="cancel"
        @open="open"		
		>
				<template v-slot>
					<el-tabs tab-position="right" v-model="activeName" @tab-click="tabClick" style="height:50vh;">
						<el-tab-pane label="教师班级" name="教师班级">
							<el-row :gutter="20">
								<el-col>
									<div class="dressxz">
										<template v-for = "(item,index) in classArr" >
											<yj-newteach-button type="blue" plain @click="checkClass(item,index)" :key="index" v-if="item.classId == actionClass" type="primary">{{item.className}}</yj-newteach-button>
											<yj-newteach-button type="blue" plain @click="checkClass(item,index)" :key="index" v-if="item.classId != actionClass" >{{item.className}}</yj-newteach-button>
										</template>							
									</div>
								</el-col>
							</el-row>
						</el-tab-pane>
						<el-tab-pane label="全部班级" name="全部班级">
							<el-row :gutter="20">
								<el-col>
									<div class="dressxz">
										<template v-for = "(item,index) in classArr" >
											<yj-newteach-button type="blue" plain @click="checkClass(item,index)" :key="index" v-if="item.classId == actionClass" type="primary">{{item.className}}</yj-newteach-button>
											<yj-newteach-button type="blue" plain @click="checkClass(item,index)" :key="index" v-if="item.classId != actionClass" >{{item.className}}</yj-newteach-button>
										</template>							
									</div>
								</el-col>
							</el-row>
				        </el-tab-pane>
					</el-tabs>
				</template>
				<template v-slot:footbutton>
						<yj-newteach-button @click="cancel">取消</yj-newteach-button>
						<yj-newteach-button @click="submit" :disabled="enableClick">确定</yj-newteach-button>
				</template>
</DialogNewteach>	      -->
</template>

<script>
import DialogNewteach from '@/components/DialogNewteach'
import { getAllClassData } from '@/api/init'
import { addUserClass,getCardGroupBySchool,getCardGroupByMac,saveCardGroupByMac } from '@/api/interface'
import { mapGetters } from 'vuex'
import { clientToolTransmit,getComputerClassInfo,saveComputerClassInfo,updateComputerClassInfo} from '@/api/client'

export default {
    name: 'classSelect',
    components: {
		DialogNewteach
    },
    computed: {
        ...mapGetters([
            'classSelect',
            'userSchoolClassList',//用户所在学校班级
            'userClassList',//用户所有班级
            'userSelectClassId',//用户当前班级
            'computerClassId',//客户端存储的班级
            'loginStyle',//0授课 1预览
            'isSetLoginFirst',//true已经设置过首次登录的信息
            'isHavingClass',//是否上课
            'schoolId',//学校ID
            'teacherNumber',
            'trueTeacherName',
            'cardGroupId'
        ])
    },    
    data(){
        return {
            actionIndex: '',//当前选中
            classArr:[],
            activeName:'教师班级',//默认选项
            actionClass:'',
            enableClick:false,//防止重复点击
            groupArr:[],
            actionGroup:'',//当前选中的分组
            teacherComputerMac:'',//教学机mac
        }
    },
    watch:{
        classSelect(newVal,oldVal){
            if(newVal){
                this.open()
            }
        }
    },
    async mounted(){
        try{
            this.teacherComputerMac = VcomMacIp.GetMacInfo()
        }catch(e){
            console.log('获取教学机mac失败');
            this.teacherComputerMac = '6C-4B-90-78-9B-E7'
        }
        this.open()
    },
    methods:{
        async open(){
            //获取当前老师的班级
            let arr = await getAllClassData(1)
            this.$store.dispatch('setUserClassList',arr)
            if(this.computerClassId == ''){
                //从客户端数据库取不到班级
                //1.取教师班级第一个，如果取不到，找全部班级第一个
                if(arr.length != 0){
                    this.actionIndex = 0
                    this.activeName = '教师班级'
                    this.classArr = arr
                }else{
                    let allClassArr = await getAllClassData(2)
                    this.classArr = allClassArr
                    this.actionIndex = 0
                    this.activeName = '全部班级'
                }
            }else{
                let index = arr.findIndex(item => item.classId == this.computerClassId)
                if(index == -1){
                    //教师班级中找不到这个班级
                    if(arr.length > 0){
                        //显示教师班级第一个
                        this.classArr = arr
                        this.actionIndex = 0
                        this.activeName = '教师班级'                        
                    }else{
                        //显示全部班级第一个
                        let allClassArr = await getAllClassData(2)
                        this.classArr = allClassArr
                        this.activeName = '全部班级'
                        this.actionIndex = 0
                    }


                    // let allClassArr = await getAllClassData(2)
                    // this.activeName = '全部班级'
                    // this.classArr = allClassArr
                    // let indexAll = allClassArr.findIndex(item => item.classId == this.userSelectClassId)
                    // if(indexAll != -1){
                    //     this.actionIndex = indexAll
                    // }else{
                    //     this.actionIndex = 0
                        
                    // }
                }else{
                    this.classArr = arr
                    this.actionIndex = index
                    this.activeName = '教师班级'
                }
            }
            this.actionClass = this.classArr[this.actionIndex].classId


            let res = await getCardGroupByMac(this.actionClass,this.teacherComputerMac);
            if(res.code == '200' && res.rtnArray.smartCardGroupId!=null){
                this.actionGroup = res.rtnArray.smartCardGroupId;
            }else{
                // this.$messageteach.error(res.info)
            }
            // let result = arr.filter(item => item.classId == this.userSelectClassId)
            // if(result.length == 0){
            //     //教师班级中找不到这个班级，显示全部班级
            //     let allClassArr = await getAllClassData(2)
            //     let resultAll = allClassArr.filter(item => item.classId == this.userSelectClassId)
                
            //     this.getActionIndex(allClassArr)
            //     this.classArr = arr        
            //     this.activeName = '全部班级'
            // }else{

            // }
            // this.getActionIndex(arr)
            // this.classArr = arr
            // this.$store.dispatch('setUserClassList',arr)
            
            // if(this.classArr.length != 0){
            //     this.activeName = '教师班级'     
            // }else{
            //     let arr = await getAllClassData(2)
            //     this.getActionIndex(arr)
            //     this.classArr = arr        
            //     this.activeName = '全部班级'
                
            //     this.$store.dispatch('setClassSelect',true)                       
            // }

            // if(this.actionClass == '' && this.classArr.length > 0){
            //     this.actionIndex = 0
            //     this.actionClass = this.classArr[0].classId
            // }
        },
        cancel(){
            if(this.userSelectClassId == ''){
                this.$messageteach.error('必须选择一个班级')
                return false
            }
                        
            this.enableClick = false
            this.$store.dispatch('setClassSelect',false)
        },
        async submit(){
            if( this.actionIndex === ''){
                this.$messageteach.error('必须选择一个班级')
                return false
            }


            
            if(this.loginStyle == 0){
                //平板上课状态不允许切换班级
                if(this.isHavingClass){
                    this.$messageteach.error('请先平板下课！')
                    return false
                }
            }
            
            //从客户端数据库查询出来的班级信息
            let resultArr = []
            try{
                resultArr = getComputerClassInfo()
            }catch(e){

            }

            console.log(resultArr)
   
            let updataDbFlag = false
            if(resultArr.length == 0 ){
                //更新数据库
                updataDbFlag = true
            }else{
                //当前教师的班级数组中查询客户端保存的班级是否存在
                let arr = this.userClassList.filter(item => item.classId == this.actionClass)
                console.log('班级是否存在')
                console.log(arr)
                console.log('computerClassId:'+this.computerClassId)
                console.log("actionClass:"+this.actionClass)
                if(this.computerClassId != this.actionClass){
                    //更新数据库
                    updataDbFlag = true
                    if(arr.length == 0){                        
                        await addUserClass(this.actionClass)
                        let arr = await getAllClassData(1)
                        this.$store.dispatch('setUserClassList',arr)
                    }
                }else{
                    if(arr.length == 0){                        
                        await addUserClass(this.actionClass)
                        let arr = await getAllClassData(1)
                        this.$store.dispatch('setUserClassList',arr)
                    }
                    //不更新
                    updataDbFlag = false
                }
            }


            let obj = {}
            obj.userSelectClassId = this.classArr[this.actionIndex].classId
            obj.userSelectClassName = this.classArr[this.actionIndex].className
            obj.userSelectClassType = this.classArr[this.actionIndex].classType

            this.$store.dispatch('setTeacherInfo',obj)

            if(updataDbFlag){
                this.enableClick = true //点击过确定按钮，就置灰
                 
                try{
                    //从本地数据库查询是否有数据
                    if(resultArr.length == 0){
                        //新增
                        saveComputerClassInfo(obj.userSelectClassId,obj.userSelectClassName)                        
                    }else{
                        //更新
                        updateComputerClassInfo(obj.userSelectClassId,obj.userSelectClassName)                        
                    }
                }catch(e){

                }
                
                
                if(this.isSetLoginFirst){
                    //换班
                    clientToolTransmit(2)
                }else{
                    //登录
                    clientToolTransmit(1)
                }
            }

            if(this.cardGroupId != this.actionGroup){
                this.$store.dispatch('setCardGroupId',this.actionGroup)
                await saveCardGroupByMac(this.schoolId,this.teacherComputerMac,this.actionGroup,this.teacherNumber,this.trueTeacherName);
                clientToolTransmit(2);
            }            
            this.$store.dispatch('setComputerClassId',this.classArr[this.actionIndex].classId)     
            this.$store.dispatch('setClassSelect',false)
            this.enableClick = false
        },
        async tabClick(tab,event){
            this.activeName = tab.name
            if(tab.index == 0 || tab.index == 1){
                if(tab.index == 1){
                    let arr = await getAllClassData(2)           
                    this.classArr = arr
                }else if(tab.index == 0){
                    this.classArr = this.userClassList
                }

                let index = this.classArr.findIndex(item => item.classId == this.actionClass)
                if(index != -1){
                    this.actionIndex = index
                }else{
                    this.actionIndex = 0                             
                }
                this.actionClass = this.classArr[this.actionIndex].classId
            }else{
                if(this.groupArr.length == 0){
                    let groupResult = await getCardGroupBySchool(this.schoolId);
                    if(groupResult.rtnArray && groupResult.rtnArray.length > 0){
                        for(let item of groupResult.rtnArray){
                            let obj = {}
                            obj.groupId = item.smartCardGroupId;
                            obj.groupName = item.smartCardGroupName;
                            this.groupArr.push(obj);
                        }
                    }else{
                        this.$messageteach.error('学校暂无分组')
                        return false
                    }
                }
                
            }

            // this.getActionIndex(this.classArr) 

            // if(this.actionClass == '' && this.classArr.length > 0){
            //     this.actionIndex = 0                
            //     this.actionClass = this.classArr[0].classId
            // }
            
        },
        checkClass(item,index){
            this.actionIndex = index
            this.actionClass = item.classId
        },
        getActionIndex(arr){
            for(let [index,item] of arr.entries()){
                if(item.classId == this.actionClass){
                    this.actionIndex = index
                }
            }
        },
        //选择分组
        checkGroup(item,index){
            this.actionGroup = item.groupId;            
            // try{
            //     VcomTeach.SetCardGroupNum(this.actionGroup);
            // }catch(e){
            //     console.log('设置分组失败，VcomTeach.SetCardGroupNum()')
            // }            
        },
        //取消分组
        uncheckGroup(){
            this.actionGroup = '';            
            // try{
            //     VcomTeach.SetCardGroupNum(this.actionGroup);
            // }catch(e){
            //     console.log('取消设置分组失败，VcomTeach.SetCardGroupNum()')
            // }                        
        }
    }
}
</script>

<style>
.dressxz { overflow-y:auto; padding: 10px; text-align: left;}
.dressxz button {margin-bottom: 10px; margin-left:0!important; margin-right:1vw!important;}
.class-select-background{  height: 103%; margin: -1vh -1vw;}
.cardremark{ padding: 0px 10px; }
</style>

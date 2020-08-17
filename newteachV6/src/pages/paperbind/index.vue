<template>
    <div class="paperbind">
        <ul class="student-info">
            <li class="student-name">{{studentItem.realname}}</li>
            <li class="paper-number"><span class="paper-title">答题器编号</span><b v-if="studentItem.answerToolCode != 'err'">{{studentItem.answerToolCode}}</b></li>
        </ul>
        <h3 class=''>
绑定答题器时，请点击答题器上的 <b>{{letters}}</b> 按键，并点击答题或提交按键.
        </h3>
        <div class="student-list">
            <el-checkbox-button 
            style="text-overflow:ellipsis;overflow:hidden;"
            :class = "student.answerToolCode==''?'bGray':student.answerToolCode=='err'?'bRed':'bGreen'"
            v-for="(student,index) in studentList" 
            :label="student.realname" 
            @change="chooseChange(index)" 
            v-model="checked"
            :key='student.studentNumber'>
            {{student.realname}}
            </el-checkbox-button>
            
        </div>
        <div class="tips">
            <p><span class="bGreen"></span>绿色代表绑定成功；<span class="bRed"></span>红色代表绑定异常；<span class="bGray"></span>灰色代表未绑定。</p>
        </div>
        <!-- <div class="close"><a @click="closeWindow();return false;" style="cursor: pointer;">关闭</a></div> -->
        <YjNewteachButton type="danger" icon="el-icon-close" circle @click="closeWindow" style="position: absolute; right: 1vh; bottom: 1vh;"></YjNewteachButton>
        <input type="hidden" id="__VCOM_ANALYTICS_PAGEFLAG" value="tls_dtbd_dtbd" />
    </div>
</template>

<script>
import { getStudentListByClassNew,sendBindPaperApi } from '@/api/interface'
import { getDeviceType,getComputerClassInfo } from '@/api/client'

export default {
    data(){
        return{
            checked:false,
            classId:'',//班级id
            studentList:[],
            actionIndex:0,//当前选中的学生
            bindSuccess:true,//是否绑定成功
            lettersArr: ['AB','AC','AD','AE','AF','BC','BD','BE','BF','CD','CE','CF','EF'],
            letters: 'AB',
            devs:'',//设备类型
            teacherComputerMac:'',//教学机mac
            teachernumber:'',
        }
    },
    computed:{
        studentItem(){
            if(this.studentList.length == 0){
                return {'realname':'','answerToolCode':''}
            }else{
                return this.studentList[this.actionIndex]
            }            
        }
    },
    async mounted(){

        try{
            //获取教学机MAC
            this.teacherComputerMac = VcomMacIp.GetMacInfo()
            let loginInfo = VcomTeach.getLoginInfo()
            let loginObj = JSON.parse(loginInfo)
            console.log('登录串')
            console.log(loginObj)
            this.classId = loginObj.classId
            this.teachernumber = loginObj.teachernumber					 
        }catch(e){
            // this.classId = '153386908359468061'
            // this.teachernumber = '41010100010128'

            this.classId = '150422907837126782'
            this.teachernumber = '41019900010001'
            this.teacherComputerMac = '6C-4B-90-78-9B-E7'
        }

        //绑定事件
        this.bindEvent()
        //获取设备类型
        this.devs = getDeviceType()
        console.log('devs:'+this.devs)
        //：0 老设备，1新设备，2数字键，4无设备，5上课，6纸笔
        if(this.devs.indexOf('1') != -1||this.devs.indexOf('2') != -1||this.devs.indexOf('6') != -1){
            try{
                console.log('关闭白名单')
                VcomAnswerQues.CloseWhiteCard();
            }catch(e){

            }            
        }
        let res = await getStudentListByClassNew(this.classId,this.teacherComputerMac,1);
        if(res.code == '200'){
            let arr = []
            for(let item of res.data.rtnArray){
                let obj = {}
                obj.studentNumber = item.studentNumber
                obj.realname = item.realname
                obj.answerToolCode = item.answerToolCode
                arr.push(obj)
            }
            this.studentList = arr
        }else{
            this.$messageteach.error('获取学生名单失败')
        }
        try{
            VcomAnswerQues.Start();
        }catch(e){

        }
    },
    methods:{
        chooseChange(index){
            this.checked = false
            this.actionIndex = index
            this.letters = this.lettersArr[Math.round(Math.random()*10)]
        },
        closeWindow(){
            //判断是否有绑定异常的
            let arr = this.studentList.filter(item => item.answerToolCode == 'err')
            if(arr.length > 0){
                this.$confirm('班级中存在绑定异常的答题器, 你确定要关闭窗口吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    //确定
                    this.close()
                }).catch(() => {
                    
                });
            }else{
                this.close()
            }         
        },
        //关闭页面
        async close(){
            if(this.devs.indexOf('1') != -1||this.devs.indexOf('2') != -1||this.devs.indexOf('6') != -1){
                //新设备 设置白名单
                let arr = []
                for(let item of this.studentList){
                    if(item.answerToolCode != '' && item.answerToolCode != 'err'){
                        arr.push(item.answerToolCode)
                    }
                }
                try{
                    VcomAnswerQues.Stop();                    
                }catch(e){
                }         
                this.setWhiteList(arr.join(','))   
            }else{
                VcomAnswerQues.Stop();
            }
            //更新数据库
            VcomTeach.pageForwarding('updatedb','')
            window.close()   
        },
        //设置白名单
        setWhiteList(ids){
            try{
                VcomAnswerQues.InitList(ids);
            }catch(e){

            }   
        },
        bindEvent(){
            console.log('注入绑定事件')
            let self = this
            try{
                VcomTeach.bindingEvent("AnswerGetKeys",async function(id,keys){//id：答题器编号key:字母
                console.log('get keys')
                console.log(id)
                console.log(keys)
                    if(keys != self.letters){
                        self.$messageteach.error('按键错误，请点击答题器上的 '+self.letters+' 按键！')
                        return false
                    }
                    if(typeof self.studentList[self.actionIndex].studentNumber == 'undefined'){
                        self.$messageteach.error('请选择一个学生进行绑定！');
                        return false
                    }                    
                    console.log("继续绑定")
                    let studentNumber = self.studentList[self.actionIndex].studentNumber
                    let res = await sendBindPaperApi(id,studentNumber,self.classId)
                    console.log(res)
                    let index = self.studentList.findIndex((item => item.studentNumber == studentNumber))
                    if(res.code == '200'){
                        //先找此答题器绑定过没，如果绑过,把绑过的重置为异常，然后再绑定新的
                        let indexOld = self.studentList.findIndex(item => item.answerToolCode == id)
                        if(indexOld != -1){
                            self.studentList[indexOld].answerToolCode = 'err'
                        }                        
                        //新的状态改为已绑定                   
                        self.studentList[index].answerToolCode = id
                    }else{
                        if(res.data && res.data.reason && res.data.reason != 'null' ){
                            self.$messageteach.error(res.data.reason)
                        }else{
                            self.$messageteach.error('绑定失败！')
                        }
                        
                        self.studentList[index].answerToolCode = 'err'
                        return false
                    }
                })
            }catch(e){
                console.log(e)
            }
        }

    }
}
</script>

<style>
    .paperbind {
        padding: 2vh;
        overflow: hidden;
        font-family: Microsoft YaHei;
		height:100%;
		display: flex;
		flex-direction: column;
    }

    .student-info {
        margin: 1vh 0;
        padding: 3vh;
        text-align: center;
        background-color: #269bd7;
        color: #fff;
        font-size: 3vh;
        line-height: 6vh;
    }

    .student-name {
        font-size: 2rem;
    }

    .paper-title {
        font-size: 1.4rem;
		padding:0 1vw;
    }

    .paper-number {
        font-size: 2.4rem;
        vertical-align: middle;
        color: #FF0;
        height: 7vh;
    }

    .paper-number b {
       vertical-align: middle;
    }

    h3 {
        color: #555;
        font-weight: normal;
        font-size: 2vh;
        text-align: center;
        margin-bottom: 2vh;
    }

    h3 b {
        color: #f00;
        font-size: 2.2vh;
        margin: 0 3px;
    }

    .student-list {
        overflow-y:auto;
        text-align: left;
		flex:1;
    }

   

    .el-checkbox-button.is-checked .el-checkbox-button__inner {
        background-color: #efefef;
        color: #606266;
        border: 0;
        border-right: 1px solid #fff;
    }

    .el-checkbox-button {
        width: 12.4%;
        margin-bottom: 1px
    }

   .el-checkbox-button .el-checkbox-button__inner {
        width: 100%;
        border: 0;
        border-right: 1px solid #fff;
        /* background-color:#efefef; */
        font-size: 1rem;
        padding: 2vh 1vh;
    }
    /* .el-checkbox-button.is-checked .el-checkbox-button__inner{
        border: 0;
        box-shadow: none
    } */
   .student-list .el-checkbox-button.is-focus .el-checkbox-button__inner{
    border-color: #fff
    }
    .tips {
    margin: 1vh 0;
    border: 1px dotted #ccc;
    padding: 1vh;
    font-size: 2vh;
    }
    .tips span {
    display: inline-block;
    width: 2vh;
    height: 2vh;
    margin: 0 1vh;
}


.bGreen {
    background-color: #67C23A;
}
label.bGreen span{
    background-color: #67C23A;
    color:#fff;
}
.bRed {
    background-color: #F56C6C;
}
label.bRed span{
    background-color: #F56C6C;
    color:#fff;
}
.bGray {
    background-color: #ccc;
}
label.bGray span{
    background-color: #efefef;
}
.close a {
    display: block;
    padding: 1vh;
    text-align: center;
    background-color: #dc4c4c;
    color: #fff;
    margin-top: 1vh;
}
a {
    text-decoration: none;
}
</style>

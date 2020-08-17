<template>
    <div class="sharepic">
		<div class="flex1" style="overflow-y: auto;">
        <YjNewteachCheckboxGroup  v-model="checkList" style="padding: 4vh; text-align: left;" >
            <YjNewteachCheckbox  v-for="(item) in classData" :key="item.classId" border :label="item.classId">{{item.className}}</YjNewteachCheckbox>
        </YjNewteachCheckboxGroup>
		</div>
		<div class="h5m">
        <YjNewteachCheckbox v-if="classData.length > 0" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</YjNewteachCheckbox>  
        <YjNewteachButton @click="cancel">取消</YjNewteachButton>
        <YjNewteachButton type="blue" @click="submit">确定</YjNewteachButton>
        <div v-if="classData.length == 0">暂无班级</div>      
		</div>
    </div>
</template>

<script>
import { getAllClassData } from '@/api/init'
import { sendScreenByToolsApi } from '@/api/interface'
export default {
    data(){
        return {
            checkList:[],
            classData:[],
            isIndeterminate:false, //全选的监控
            checkAll:false,//全选的监控
            classIdArr: [],//班级id数组
            teacherNumber:'',
            trueName:'',
            classId:'',//当前班级
            rcodes:''
        }
    },
    watch:{
        checkList(val){
          let checkedCount = val.length
          this.checkAll = checkedCount === this.classData.length
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.classData.length
        },
    },
    async mounted(){
        this.rcodes = this.$route.query.rcodes
        try{
            //获取教学机MAC
            // this.teacherComputerMac = VcomMacIp.GetMacInfo()
            let loginInfo = VcomTeach.getLoginInfo()
            let loginObj = JSON.parse(loginInfo)
            this.classId = loginObj.classId
            this.teacherNumber = loginObj.teachernumber					 
            this.trueName = loginObj.teachername
        }catch(e){
            this.classId = '153386908359468061'
            this.teacherNumber = '41010100010128'
            this.trueName = ''
            // this.teacherComputerMac = '6C-4B-90-78-9B-E7'
        }        

        let obj = {}
        obj.teacherNumber = this.teacherNumber	
        this.$store.dispatch('setTeacherInfo',obj) 

        let arr = await getAllClassData(1)
        for(let item of arr){
            this.classIdArr.push(item.classId)
        }
        this.classData = arr
        this.checkList.push(this.classId)
    },
    methods:{
        handleCheckAllChange(val){
            if(val){
                this.checkList = this.classIdArr
            }else{
                this.checkList = []
            }
        },
        async submit(){
            if(this.checkList.length == 0){
                this.$messageteach.error("请选择班级")
                return false
            }
            //custSendType 0,一个资源作为一条信息发送； 1，多个资源合并成一个信息发送
            try{
                let res = await sendScreenByToolsApi(this.teacherNumber,2,this.rcodes,2,this.checkList.join(','),this.trueName,1)
                if(res.failCout > 0){
                    this.$messageteach.error('发送失败')
                }else{
                    this.$messageteach.success("发送成功")
                    setTimeout(()=>{window.close()},1000)
                }
            }catch(e){
                this.$messageteach.error('发送失败')
            }
        },
        cancel(){
            window.close()
        }
    }
}
</script>

<style type="text/css" scoped>
.sharepic{display: flex; flex-direction: column; height: 100%;}
.flex1{flex: 1;}
.h5m{height: 5rem;   border-top: solid 1px #efefef;}
.yj-newteach-checkbox{margin-bottom: 1vh;    line-height:4rem; margin-right: 1vw;}
.el-checkbox.is-bordered .el-checkbox__label {    line-height: 3rem;    font-size: 3rem;}
.el-checkbox.is-bordered {padding: 0 1vw;    border-radius: 4px;   line-height: 3rem;}
</style>

<template>
    <!-- 发送班级弹窗（选择要发送的班级） -->
    <YjNewteachVisibilityDialog width="75%" max-height="75vh" title = '选择班级' center   :visible.sync="isVisible">          
        <div class="sharepic">
            <div class="flex1">
                <YjNewteachCheckboxGroup v-model="checkList">
                    <YjNewteachCheckbox 
                    v-for="item in classListOwn" 
                    border
                    :key="item.classId" 
                    :label="item.classId"
                    :disabled="item.enable"          
                    >
                    {{item.className}}
                    </YjNewteachCheckbox>
                </YjNewteachCheckboxGroup>
                <div v-if="classListOwn.length == 0">暂无班级</div>
            </div>
        </div>          
        <div slot="footer">            
            <YjNewteachCheckbox v-if="classListOwn.length > 0" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</YjNewteachCheckbox>  
            <YjNewteachButton @click="cancel">取消</YjNewteachButton>
            <YjNewteachButton type="blue" @click="sendSubmit">确定</YjNewteachButton>
        </div>          
      </YjNewteachVisibilityDialog>       
    <!-- <DialogNewteach 
        title = '选择班级'
        :dialogVisible = "dialogVisible"
        @cancel="cancel"
        >
            <template v-slot>
            <span>
                <YjNewteachCheckboxGroup v-model="checkList">
                    <el-checkbox 
                    v-for="item in userClassList" 
                    :key="item.classId" 
                    :label="item.classId"
                    :disabled="item.enable"         
                    class="classSelectPadding"     
                    >
                    {{item.className}}
                    </el-checkbox>
                </YjNewteachCheckboxGroup>
                <div v-if="userClassList.length == 0">暂无班级</div>
            </span>
            </template>
            <template v-slot:footbutton>
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="sendSubmit">确 定</el-button>                
            </template>            
    </DialogNewteach>      -->
</template>

<script>
import DialogNewteach from '@/components/DialogNewteach'
import { mapGetters } from 'vuex'
export default {
    props: {
        'dialogVisible':{type:Boolean},
        'needCheck':{type:Array,default:() => []},
        'nowClassList':{type:Array,default:() => [],require:false}
    },
    // props:['dialogVisible','needCheck','nowClassList'],
    components:{
        DialogNewteach
    },
    data(){
        return {
            checkList:[],//当前选中的
            isIndeterminate:false, //全选的监控
            checkAll:false,//全选的监控
            // isVisible:this.dialogVisible
        }
    },
    watch:{
        needCheck(val){
            this.checkList = []
            this.checkList = this.checkList.concat(val)
        },
        checkList(val){
          let checkedCount = val.length
          this.checkAll = checkedCount === this.classListOwn.length
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.classListOwn.length
        }
    },
    computed:{
        ...mapGetters([
            'userSelectClassId',
            'userClassList'
        ]),
        classListOwn(){
            //如果传入班级列表就用传入的，如果没有传入就用store里的
            if(this.nowClassList.length == 0){
                return this.userClassList
            }else{
                return this.nowClassList
            }
        },        
        userClassIdArr(){
            let arr = []
            for(let item of this.classListOwn){
                arr.push(item.classId)
            }
            return arr
        },
        isVisible:{
            get(){
                return this.dialogVisible
            },
            set(val){
                this.$emit('setClassSelectShow',val);
            }
        }

    },
    methods:{
        handleCheckAllChange(val){
            if(val){
                this.checkList = this.userClassIdArr
            }else{
                this.checkList = []
            }
        },        
        //取消
        cancel(){
            this.$emit('setClassSelectShow',false)
        },
        sendSubmit(){
            this.$emit('onSubmit',this.checkList)
            //this.checkList = []
        }
    }
}
</script>

<style scoped>
.classSelectPadding{padding: 1vh 0px;}

.sharepic{display: flex; flex-direction: column; height: 100%;}
.flex1{flex: 1;}
.h5m{height: 5rem;   border-top: solid 1px #efefef;}
.yj-newteach-checkbox{margin-bottom: 1vh;    line-height:3rem; margin-right: 1vw;}
.el-checkbox.is-bordered .el-checkbox__label {    line-height: 3rem;    font-size: 1rem;}
.el-checkbox.is-bordered {padding: 0 1vw;    border-radius: 4px;   line-height: 3rem;}
</style>

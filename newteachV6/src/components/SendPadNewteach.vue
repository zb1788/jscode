<template>
    <YjNewteachVisibilityDialog title = '探究' width="80%" height="35vh" :visible.sync="dialogVisiable" :is-header="false" >
        <div>
            <yj-newteach-alert
                title="请选择探究的反馈形式"
                type="info"
                    :closable="false"
                show-icon >
            </yj-newteach-alert>    
        </div>    

        <YjNewteachCheckboxGroup v-model="checkList" style="padding: 4vh;" @change="handleCheckBoxChange">
            <YjNewteachCheckbox  v-for="(item) in data" :key="item.id" :label="item.id">{{item.label}}</YjNewteachCheckbox>
        </YjNewteachCheckboxGroup>
        <div>
            <div>
            <slot name="tips"></slot>
            </div>
            <div class="tcenter">
            <YjNewteachButton @click="close">取消</YjNewteachButton>
            <YjNewteachButton type="blue" @click="submit">发起探究</YjNewteachButton>                
            </div>
        </div>
         <!-- <yj-newteach-button icon="el-icon-close" size="mini" @click="close" circle style="position: absolute; right: 1vh; bottom: 1vh;"></yj-newteach-button> -->
    </YjNewteachVisibilityDialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { yjNewteachAlert} from 'newteach-ui'
export default {
    props: {
        'dialogVisiable': {type:Boolean},
        'downloadUrl':{type:String},
        'format':{type:String},
        'rcode':{type:String},
        'filename':{type:String}
    },    
    components:{
        yjNewteachAlert
    },
    data(){
        return{
            checkList: [],
            data:[
                {"id":1,"label":"答题"},
                {"id":2,"label":"文字"},
                {"id":3,"label":"图片"},
                {"id":4,"label":"录屏"},
                {"id":5,"label":"录音"},
                {"id":6,"label":"不反馈"}
                ]
        }
    },
    computed:{
        ...mapGetters([
            'ksId'
        ])
    },
    mounted(){      
    },
    methods: {
        submit(){
            if(this.checkList.length == 0){
                this.$messageteach.error('请选择探究的反馈形式！')
                return false
            }else{
                let ndownload = 1
                if(this.format == 'html'){
                    ndownload = 0
                }
                let ntype = this.checkList[0]
                //添加统计
                try{
                    console.log('VcomPad.StartFilePreview:'+'ntype='+ntype+'|downloadUrl='+this.downloadUrl+'|rcode='+this.rcode+'|filename='+this.filename+'|ndownload:'+ndownload)
                    console.log('VcomTeach.pageForwarding=fileExplorClose'+ntype)
           
                    VcomPad.StartFilePreview(ntype , this.downloadUrl,this.rcode,this.filename,ndownload+'');
                    VcomTeach.pageForwarding('fileExplorClose',ntype+'')
                }catch(e){

                }
                this.$emit("sendPadClose")
            }
        },
        close(){
            this.$emit("sendPadClose")
        },
        handleCheckBoxChange(val){       
            console.log(val.length)     
            if(val.length > 1){
                this.checkList.shift()                
            }
        }
    }
}
</script>

<style>

</style>

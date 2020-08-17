<template>
    <DialogNewteach 
        title = '资源播放'
        dialogWidth = '100%'
        :dialogVisible = "dialogVisible"
        @cancel="cancel"
        >
            <template v-slot>
                <iframe  :src="url" frameborder="0" height="100%" width="100%"></iframe>    
            </template>
            <template v-slot:footbutton>
              <el-button type="primary" @click="cancel">关 闭</el-button>                
            </template>            
     </DialogNewteach>    

</template>

<script>
import DialogNewteach from '@/components/DialogNewteach'
export default {
    name:'play',
    components:{
        DialogNewteach
    },
    data(){
        return {
            url: 'http://www.baidu.com',
            dialogVisible:true,            
        }
    },
    created(){
        this.url = '#/play/index?rcode='+this.$route.query.rcode+'&resType='+this.$route.query.resType
    },
    methods:{
        cancel(){
            this.dialogVisible = false
        }
    }
}
</script>

<style>

</style>

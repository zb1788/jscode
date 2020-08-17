<template>
    <el-dialog
    :visible.sync = "visibleDialog"
    :show-close = "dialogClose"
    :width = "dialogWidth"
    :close-on-click-modal = false  
    @open="open"
    @opened="opened"
    @close="close"
    class="abow_dialog"
    >
        <template v-slot:title><span style="color:#2c3e50">{{title}}</span></template>
        <slot></slot>
        <template v-slot:footer>
            <span class="dialog-footer" v-if="footerVisible">        
                <slot name="footbutton"></slot>        
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'dialogNewteach',
    props: {
        'dialogVisible':{type:Boolean},
        'title':{type:String,default:''},
        'dialogWidth':{type:String,default:'50%'},
        'dialogClose':{type:Boolean,default:false},
        'footerVisible':{type:Boolean,default:true}
    },
    data(){
        return {
            visibleDialog: this.dialogVisible
        }
    },    
    computed: {
        ...mapGetters([
            'dialogFilter'
        ])
    },
    watch:{
        dialogVisible(newVal,oldVal){
            this.visibleDialog = newVal
        },
    },
    mounted(){
        
    },
    methods: {
        open(){
            // this.$store.dispatch('setDialogFilter',true)
            this.$emit('open')
        },
        close(){
            this.$store.dispatch('setDialogFilter',false)
            this.$emit('cancel')
        },
        opened(){
            this.$emit('opened')
        }
    }
}
</script>

<style>
.flexdy>div>.el-dialog{
    flex:initial;
    height:auto;
}


/* 
.abow_dialog {
    display: flex;
    justify-content: center;
    align-items: Center;
    overflow: hidden;
}

 .abow_dialog  .el-dialog {
    margin: 0 auto !important;
    height: 90%;
    overflow: hidden;
}
 .abow_dialog  .el-dialog .el-dialog__body {
    position: absolute;
    left: 0;
    top: 54px;
    bottom: 10px;
    right: 0;
    padding: 0;
    z-index: 1;
    overflow: hidden;
    overflow-y: auto;
}

 .abow_dialog  .el-dialog .el-dialog__footer {
    position: absolute;
    left: 0;
    top: 54px;
    bottom: 0;
    right: 0;
    padding: 0;
    z-index: 1;
    overflow: hidden;
    overflow-y: auto;
} */
</style>

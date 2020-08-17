<template>
    <el-button-group>
    <el-button type="info" icon="el-icon-arrow-left" v-if="pageCurrent <= 1" disabled></el-button>
    <el-button type="info" icon="el-icon-arrow-left"  v-if="pageCurrent > 1" @click="prePage"></el-button>
    <el-button type="info" icon="el-icon-arrow-right" v-if="pageCurrent >= pageTotal" disabled></el-button>
    <el-button type="info" icon="el-icon-arrow-right" v-if="pageCurrent < pageTotal" @click="nextPage"></el-button>
    </el-button-group>
</template>

<script>
export default {
    props:['pageCurrent','pageTotal'],
    methods:{
        prePage(){
            this.$emit('pageClick','pre')
        },
        nextPage(){
            this.$emit('pageClick','next')
        }
    }
}
</script>

<style>

</style>

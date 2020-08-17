<template>
    <div>
        <div class="yxlist">
        <ul>
            <li v-for="(item,index) in resByPage" :key="index">
            <span v-if="item.icon !='' && typeof item.icon !='undefined'" @click="handleClick(item)"><img :src="item.icon" /></span>
            <p @click="handleClick(item)" v-html="item.title"></p>
            </li>
        </ul>
        </div>
        <div class="flexh" v-if="resList.length > 0">
            <PageNewteach :pageCurrent="pageCurrent" :pageTotal="pageTotal" @pageClick="pageClick"/>            
        </div>
    </div>
</template>

<script>
import PageNewteach from '@/components/PageNewteach'
//自动分页
export default {
    components:{
        PageNewteach,
    },
    props:['resList','pageSize'],
    data(){
        return {
            pageCurrent:1,
        }
    },
    computed:{
        resByPage(){
          return this.resList.filter((val,i) => i>=this.pageStart&&i<this.pageStart+this.pageSize)
        },
        pageStart(){
            return (this.pageCurrent-1)*this.pageSize    
        },
        pageTotal(){
            return Math.ceil(this.resList.length/this.pageSize)
        }        
    },
    watch:{
        resList(newVal,oldVal){
            if(newVal != oldVal){
                this.pageCurrent = 1
            }
        }
    },
    methods:{
        pageClick(val){
            if(val == 'pre'){
              this.pageCurrent--
            }else{
              this.pageCurrent++
            }
        },
        handleClick(item){
            this.$emit('handleClick',item)
        }
    }
}
</script>

<style>

</style>

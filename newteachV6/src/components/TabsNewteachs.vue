<template>
	<!-- <el-tabs 
    type="border-card" 
    :tab-position="tabPosition"
    v-model="activeName"
    @tab-click="tabClick"
    class="kqyxnx">
    
    <el-tab-pane class="nry" v-for="(item,index) in data" :key="item.type" :name="item.name">
      <span slot="label"><i v-if=" typeof item.tabIcon != 'undefined' && item.tabIcon != ''" :class="item.tabIcon"></i> {{item.name}}</span>
      <slot v-bind:tabIndex="index"><img src="../assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></slot>
    </el-tab-pane>
  </el-tabs> -->
  	<yj-newteach-tabs 
    type="border-card" 
    :tab-position="tabPosition"
    v-model="activeName"
    @tab-click="tabClick"
    class="kqyxnx">
    
    <yj-newteach-tab-pane class="nry" v-for="(item,index) in data" :key="item.type" :name="item.name">
      <span slot="label" v-if="item.pvname != '' && typeof(item.pvname) != 'undefined'" :__VCOM_ANALYTICS="item.pvname" __VCOM_ANALYTICS_CLICK><i v-if=" typeof item.tabIcon != 'undefined' && item.tabIcon != ''" :class="item.tabIcon"></i> {{item.name}}</span>
      <span slot="label" v-else :class="typeof(item.styleTheme) != 'undefined'?'back':''"><i v-if=" typeof item.tabIcon != 'undefined' && item.tabIcon != ''" :class="item.tabIcon"></i> {{item.name}}</span>
      <slot v-bind:tabIndex="index"><img src="../assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></slot>
    </yj-newteach-tab-pane>
  </yj-newteach-tabs>
</template>

<script>
export default {
    name: 'tabsNewteach',
    components:{
    },
    props: ['tabPosition','data'],
    watch: {
    },
    data(){
        return {
            activeName: ''
        }
    },
    methods: {
        tabClick(tab,event){
            this.activeName = tab.name
            this.$emit('tabClick',tab,event)
        },
        setActiveName(name){
          this.activeName = name
        }
    }

}
</script>

<style scoped>
.tabs{background:#fff;}
.flexdy{display: flex; flex-direction:column; flex:1;height: 100%;}
.flexdy>.nry{flex: 1;}
.yxlist {background:#fff; height: 100%; padding: 1vh;}
.yxlist ul {margin:0 1vh;    -webkit-padding-start:0}
.yxlist li {display: flex; width: 100%; border-bottom: solid 1px #efefef; }
.yxlist li>*{align-self: center; text-align: left;}
.yxlist li p {flex: 1; font-size:1rem; padding: 0 1vw; color: #666; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
.yxlist li span img {height: 5vh;}
.el-tabs--border-card{height: 100%; display: flex; flex-direction: column;}
.textR {text-align: right;}
.kqyxnx {flex: 1; padding: 0;}
.flexh {display: flex; flex-direction: row-reverse;}
 .flexh>.text{text-align: left; flex: 1; color: #999; font-size: 0.8rem; padding: 1vh 2vh;     background: #fafae5;    color: #666;}
 
.back{
    color: #fff;
    display: block;
    background: #409EFF;
    padding: 0 1vw;
    border-radius: 0.5vh;
}
</style>

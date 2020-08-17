<!--
 * @Author: your name
 * @Date: 2020-02-24 14:13:30
 * @LastEditTime: 2020-04-29 19:13:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \user-center\src\App.vue
 -->
<template>
<div id="app">
      <component :is=this.layoutComponent> <router-view /> </component>
    </div>
</template>>
<script type="text/jsx">
import Layout from '@/components/Layout';
import LayoutHome from '@/components/Layout/Home';
import LayoutSystem from '@/components/Layout/System';
import LayoutEmpty from '@/components/Layout/Empty';

export default {
  components: {
    Layout,
    LayoutHome,
    LayoutSystem,
    LayoutEmpty
  },
  computed: {
    layoutComponent () {
      const [, layoutComponent] = [
        [['systemEntrance', 'simulatedLogin', 'changePassword', 'closeTM'], LayoutHome],
        [['systemParameter', 'ruleManage'], LayoutSystem],
        [['login'], LayoutEmpty]
      ].find(([routeNames]) => routeNames.find(name => {
        return this.$route.name &&
        this.$route.name.substr(0, name.length) === name;
      })) || ['default', Layout];
      return layoutComponent;
    }
  }

};
</script>

<style lang="scss">
html,body,#app{
  height: 100%;
}
// .setFontinput 用于textarea颜色和字体与页面一样
.vcom_setTextareaFont{
  color: #666;
  .el-textarea__inner{
    color: #666 !important;
    font-family: inherit;
  }
}
// ie浏览器 table不是100% 解决
.el-table__header{
    width: 100% !important;
}
.el-table__body{
    width: 100% !important;
}
</style>

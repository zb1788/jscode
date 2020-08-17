<!--
 * @Author: your name
 * @Date: 2020-04-28 19:05:39
 * @LastEditTime: 2020-05-07 13:42:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\src\components\Header\index.vue
 -->
<template>
  <div class="vcom-header">
    <span class="logo">
      统计中心
    </span>
    <slot></slot>
    <div class="vcom-header-right">
      <span class="user-tip">{{truename}}</span>
<!--      <el-tooltip class="item" placement="bottom">-->
<!--        -->
<!--      </el-tooltip>-->
      <!-- <i class="iconfont iconquestion-circle-fill" @click="goToHelp" /> -->
      <vcom-button class="loginout" ghost @click="loginOut"><i class="iconfont iconpoweroff" />退出</vcom-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'vcom-header',
  computed: {
    ...mapState('user', [
      'truename'
    ])
  },
  methods: {
    loginOut () {
      // this.$store.dispatch('user/logout')
      // localStorage.clear()
      // sessionStorage.clear()
      // this.$router.push({ path: '/' })
      window.close();
    },
    goToHelp () {
      this.$router.push({ path: '/help/accountFlow' }).catch(e => { return e; });
    }
  }
};
</script>

<style lang="scss" scoped>

.vcom-header {
  box-sizing: border-box;
  line-height: 50px;
  height: 50px;

  .vcom-menu{
    box-sizing: border-box;
    display: inline-block;
    float: left;
    margin-left: 24px;
  }

  .logo{
    box-sizing: border-box;
    display: inline-block;
    line-height: 50px;
    // padding: 4px 12px;
    float: left;
        font-size: 21px;
    font-weight: bold;
    color: #fff!important;
  }
  .logo img{height:20px;}
  &-right{
    float: right;
    color: #fff;
      .vcom-button.is-ghost .el-icon{
      color: #fff;
    }
  }
  .iconfont{
    line-height: 50px;
    padding:0 4px;
    cursor: pointer;
  }
  .user-tip{
    display: inline-block;
    margin-right:5px;vertical-align: top;
    font-size:13px;
  }
  .user-icon{
    margin-right: 10px;
    cursor: pointer;
  }
  .loginout{
    color: #fff !important;
    font-size:13px !important;
  }
  .vcom-button--default.is-ghost{ display:block; margin-top:12px !important; float:right;}
}
</style>

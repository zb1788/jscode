<template>
    <div class="system-box">
      <div class="head-left">
        <p class="left-title">
          系统管理中心
        </p>
        <p class="left-name">
          欢迎,{{truename}}
        </p>
      </div>
      <ul class="head-right">
       <li :class="{changeStyle: changeFlag === 1}" @click="jump('/simulatedLogin',1)">
         <i class="el-icon-s-custom"></i>
         模拟登录
       </li>
<!--        <li :class="{changeStyle: changeFlag === 2}" >-->
<!--          <i class="el-icon-setting"></i>-->
<!--          系统配置-->
<!--        </li>-->
        <li :class="{changeStyle: changeFlag === 3}"  @click="jump('/changePassword',3)">
          <i class="el-icon-lock"></i>
          修改密码
        </li>
        <li @click="loginOut">
          <i class="el-icon-switch-button"></i>
          退出
        </li>
      </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'index',
  data () {
    return {
      changeFlag: 0
    };
  },
  computed: {
    ...mapState('user', [
      'nickname', 'truename'
    ])
  },
  methods: {
    loginOut () {
      this.$store.dispatch('user/logout');
      localStorage.clear();
      sessionStorage.clear();
      this.$router.push({ path: '/login' }).catch(e => { return e; });
    },
    jump (url, num) {
      this.changeFlag = num;
      this.$router.push({ path: url }).catch(e => { return e; });
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'systemEntrance') {
        this.changeFlag = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.system-box{
  width: 100%;
  height: 60px;
  color: #fff;
  .head-left{
    width: 36%;
    height:60px;
    float: left;
    .left-title{
      width: 150px;
      height: 60px;
      line-height: 60px;
      margin-left: 40px;
      margin-right: 38px;
      font-size: 24px;
      font-weight: 500;
      float: left;
    }
    .left-name{
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      float: left;
      opacity:0.6;
    }
  }
  .head-right{
    width: 440px;
    height: 60px;
    float: right;
    li{
      height: 60px;
      width: 105px;
      line-height: 60px;
      text-align: center;
      float: left;
      cursor: pointer;
    }
    .changeStyle{
      color: red;
    }
  }
}
</style>

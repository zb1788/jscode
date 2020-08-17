<template>
  <div class="login-box">
    <div class="content-box">
      <div class="img-box">
        <img src="../assets/images/login/bg-pic.png">
      </div>
      <div class="operation-box">
        <div class="oper-head">
          系统管理中心
        </div>
        <div class="oper-input">
          <yj-input v-model="phone" class="userstyle" placeholder="请输入用户名" clearable><i slot="prefix"
                                                                                        class="el-icon-s-custom"></i>
          </yj-input>
          <yj-input show-password v-model="password" class="passstyle" placeholder="请输入密码"><i
            slot="prefix" class="el-icon-lock"></i></yj-input>
          <slide-verify v-if="errors" @success="onSuccess" ref="slideVerify" @fail="onFail" :slider-init-text="text" @xpos="xpos"  :tel='tel' :type="login" :w="280"  :password="password" class="slide-top"></slide-verify>
          <vcom-button class="mar-top" type="primary" size="bigger"  @click="handleLogin" >登录</vcom-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/style/login/login.scss';
import { mapActions } from 'vuex';
import { USER_ACTION_TYPES } from '../store';
import VcomButton from '../components/Button/index';
import cookie from '../common/js/cookie';
import SlideVerify from '../components/SlideVerify';
export default {
  name: 'Login',
  components: { VcomButton, SlideVerify },
  data () {
    return {
      errors: false,
      phone: '',
      password: '',
      slidervalue: 5,
      verificationflag: false,
      loginFrequency: 0,
      login: 'login',
      tel: '',
      text: '向右滑动滑块',
      xposp: ''
    };
  },
  methods: {
    ...mapActions([
      USER_ACTION_TYPES.LOGIN
    ]),
    onSuccess () {
      // this.errors = false
      this.handleLogin();
    },
    onFail () {
      this.errors = false;
    },
    Refresh () {
      this.$refs.slideVerify.reset();
    },
    xpos (val) {
      this.xposp = val;
    },
    async handleLogin () {
      if (this.phone === '') {
        this.$message.error('用户名不能为空');
        return;
      }
      if (this.password === '') {
        this.$message.error('密码不能为空');
        return;
      }
      const { phone, password } = this;
      if (phone && password) {
        const phone = this.phone,
          password = this.password;
        let xpos = this.xposp;
        cookie.setCookie('usernameval', phone);
        const data = await this[USER_ACTION_TYPES.LOGIN]({ phone, password, xpos });
        if (data.res) {
          if (data.res.access_token) {
            this.$router.push({ path: '/systemEntrance' }).catch(e => { return e; });
            cookie.deleteCookie('errorFlag');
          } else {
            this.loginFrequency++;
            if (this.loginFrequency > 2) {
              this.errors = true;
              cookie.setCookie('errorFlag', true, 1, '/');
              this.tel = this.phone;
            }
            this.$message.error(data.res.message);
            // this.Refresh()
          }
        } else {
          this.$message.error('系统错误');
        }
      }
    }
  },
  created () {
    var _self = this;
    document.onkeydown = function (e) {
      var key = window.event.keyCode;
      if (key === 13) {
        _self.handleLogin();
      }
    };
  },
  beforeDestroy () {
    // document.onkeydown = function (e) {
    //   var key = window.event.keyCode;
    //   if (key === 13) {
    //   }
    // };
  },
  mounted () {
    this.errors = cookie.getCookie('errorFlag') || false;
    this.phone = cookie.getCookie('usernameval');
    this.tel = cookie.getCookie('usernameval');
  }
};
</script>
<style scoped>

</style>

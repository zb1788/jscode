<template>
	<div class="login">
    	<div class="store_header">
		<div class="store_avatar">
			<img src="../../assets/images/avatar_default.png" alt="头像" width="55" height="55">
		</div>
		<div class="store_name">医疗</div>
	</div>

    <md-field-group>
      <md-field
        v-model="account"
        icon="username"
        placeholder="请输入账号"
        right-icon="clear-full"
        name="user"
        data-vv-as="帐号"
        @right-click="clearText"
      />

      <md-field
        v-model="password"
        icon="lock"
        placeholder="请输入密码"
        :type="visiblePass ? 'text' : 'password'"
        :right-icon="visiblePass ? 'eye-open' : 'eye-close'"
        data-vv-as="密码"
        name="password"
        @right-click="visiblePass = !visiblePass"
      />

      <div class="clearfix">
        <div class="float-l">
          <router-link to="/login/registerSubmit">免费注册</router-link>
        </div>
        <div class="float-r">
          <router-link to="/login/registerSubmit">忘记密码</router-link>
        </div>
      </div>

      <van-button size="large" type="danger" :loading="isLogining" @click="loginSubmit">登录</van-button>
    </md-field-group>


      <div class="text-desc text-center bottom_positon"></div>

	</div>
</template>

<script>
import field from '@/components/field/';
import fieldGroup from '@/components/field-group/';

import { loginApi } from '@/api/api';
import { setLocalStorage } from '@/utils/local-storage';
import { emailReg, mobileReg } from '@/utils/validate';

import { Toast } from 'vant';


export default {
  name: 'login-request',
  components: {
    [field.name]: field,
    [fieldGroup.name]: fieldGroup,
    Toast
  },
  data() {
    return {
      account: '',
      password: '',
      visiblePass: false,
      isLogining: false,
      userInfo: {}
    };
  },

  methods: {
    clearText() {
      this.account = '';
    },

    validate() {

    },
    created() {
    },
    login() {      
      // let loginData = this.getLoginData();
      // authLoginByAccount(loginData).then(res => {
      //   this.userInfo = res.data.data.userInfo;
      //   setLocalStorage({
      //     Authorization: res.data.data.token,
      //     avatar: this.userInfo.avatarUrl,
      //     nickName: this.userInfo.nickName
      //   });

      //   this.routerRedirect();
      // }).catch(error => {
      //   Toast.fail(error.data.errmsg);
      // });
    },

    async loginSubmit() {
      this.isLogining = true;
      try {
        if(this.account == ''){
          Toast.fail("用户名不能为空");
          return false;
        }

        if(this.password == ''){
          Toast.fail("密码不能为空");
          return false;
        }      

        let obj = {};
        obj.login_name = this.account;
        obj.password = this.password;
        obj.action = 'login';
        let res = await loginApi(obj);
        console.log(res);
        if(res.code == 1){
          setLocalStorage({ 
            Authorization: res.data.login_name,
            userid:res.data.id
            });
          this.routerRedirect();
        }else{
          Toast.fail("登录失败");
        }
        this.isLogining = false;
      } catch (err) {
        console.log(err.message);
        this.isLogining = false;
      }
    },

    routerRedirect() {
      // const { query } = this.$route;
      // this.$router.replace({
      //   name: query.redirect || 'home',
      //   query: query
      // });
      //window.location = '#/';
      this.$router.push('/msg/home');
    },

    getLoginData() {
      const password = this.password;
      const account = this.getUserType(this.account);
      return {
        [account]: this.account,
        password: password
      };
    },

    getUserType(account) {
      const accountType = mobileReg.test(account)
        ? 'mobile'
        : emailReg.test(account)
        ? 'email'
        : 'username';
      return accountType;
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../../assets/scss/mixin';
.login {
  position: relative;
  background-color: #fff;
}
.store_header {
  text-align: center;
  padding: 30px 0;
  .store_avatar img {
    border-radius: 50%;
  }
  .store_name {
    padding-top: 5px;
    font-size: 16px;
  }
}
.register {
  padding-top: 40px;
  color: $font-color-gray;
  a {
    color: $font-color-gray;
  }
  > div {
    width: 50%;
    box-sizing: border-box;
    padding: 0 20px;
  }
  .connect {
    @include one-border(right);
    text-align: right;
  }
}
.bottom_positon {
  position: absolute;
  bottom: 30px;
  width: 100%;
}
</style>

<template>
	<md-field-group class="register_view">
		<div>我们将发送验证码到您的手机</div>
		<md-field
			v-model="username"
			icon="mobile"
			placeholder="请输入帐号"/>

		<md-field
			v-model="password"
			icon="mobile"
			placeholder="请输入密码"/>

		<div class="register_submit">
			<van-button size="large" type="danger" @click="submitCode">免费注册</van-button>
		</div>

		<div class="register_footer">
			已有账号?
			<router-link to="/login" class="red">登录</router-link>
		</div>
	</md-field-group>
</template>

<script>
import { registerApi } from '@/api/api'
import field from '@/components/field/';
import fieldGroup from '@/components/field-group/';
import { setLocalStorage } from '@/utils/local-storage';
import { Toast} from 'vant';
export default {
  data() {
    return {
      mobile: '',
      username:'',
      password:''
    };
  },

  methods: {
    async submitCode() {
      if(this.username == ''){
        Toast.fail("用户名不能为空");
        return false;
      }

      if(this.password == ''){
        Toast.fail("密码不能为空");
        return false;
      }      

      let obj = {};
      obj.login_name = this.username;
      obj.password = this.password;
      obj.action = 'login';
      let res = await registerApi(obj);
      console.log(res);
      if(res.code == 1){
        setLocalStorage({ Authorization: res.data.login_name});
      }else{
        Toast.fail("注册失败");
      }      
      //this.$router.push({ name: 'registerSubmit' });
    }
  },

  components: {
    [field.name]: field,
    [fieldGroup.name]: fieldGroup
  }
};
</script>

<style lang="scss" scoped>
div.register_view {
  background-color: #fff;
  padding-top: 30px;
}

div.register_submit {
  padding-top: 30px;
  padding-bottom: 20px;
}

.register_footer {
  text-align: right;
  color: $font-color-gray;
}
</style>

<template>
	<md-field-group class="foget_view">
		<md-field
			v-model="password"
			icon="lock"
			:is-error="isErrow"
			placeholder="请输入新密码"/>

		<md-field
			v-model="passwordRepeat"
			type="password"
			icon="lock"
			:is-error="isErrow"
			placeholder="请再次输入密码" />
		<div class="red" v-show="isErrow">两次密码输入不一致</div>

		<div class="foget_submit">
			<van-button size="large" type="danger" @click="submitCode">重置</van-button>
		</div>
	</md-field-group>
</template>

<script>
import { Toast} from 'vant';
import field from '@/components/field/';
import fieldGroup from '@/components/field-group/';
import { getCodeApi,registerApi } from '@/api/api'
import { setLocalStorage } from '@/utils/local-storage';
export default {
  props: {
    phone: String,
    phonecode: String
  },
  data() {
    return {
      isErrow: false,
      password: '',
      passwordRepeat: ''
    };
  },

  methods: {
    async submitCode() {
      if(this.password == ''){
        Toast.fail("新密码不能为空！");
        return false;
      }

      if(this.passwordRepeat == ''){
        Toast.fail("再次输入密码不能为空！");
        return false;
      }

      if(this.password != this.passwordRepeat){
        Toast.fail("两次密码不一致！");
        return false;
      }

      let obj = {};
      obj.mobile = this.phone;
      obj.password = this.password;
      obj.code = this.phonecode;
      obj.action = 'register_by_code';
      let res = await registerApi(obj);
      console.log(res);
      if(res.code == 1){
        //setLocalStorage({ Authorization: res.data.login_name});
        this.$router.push({
        name: 'registerStatus',
        params: { status: 'success' }
      });
      }else{
        Toast.fail("注册失败");
      }  
    }
  },

  components: {
    [field.name]: field,
    [fieldGroup.name]: fieldGroup
  }
};
</script>

<style lang="scss" scoped>
div.foget_view {
  background-color: #fff;
  padding-top: 30px;
}

div.foget_submit {
  padding-top: 30px;
  padding-bottom: 20px;
}
</style>

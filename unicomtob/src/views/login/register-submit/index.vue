<template>
	<md-field-group class="register_submit">
		<md-field v-model="code" icon="mobile" placeholder="请输入验证码">
			<div slot="rightIcon" @click="getCode" class="getCode red">
				<countdown v-if="counting" :time="60000" @end="countdownend">
				  <template slot-scope="props">{{ +props.seconds || 60 }}秒后获取</template>
				</countdown>
				<span v-else>获取验证码</span>
			</div>
		</md-field>
		<md-field v-model="password" icon="lock" placeholder="请输入密码"/>
		<md-field v-model="repeatPassword" icon="lock" placeholder="请再次确认密码"/>

		<div class="register_submit_btn">
			<van-button type="danger" size="large" @click="registerSubmit">确定</van-button>
		</div>
	</md-field-group>
</template>

<script>
import { Toast} from 'vant';
import { getCodeApi,registerApi } from '@/api/api'
import { setLocalStorage } from '@/utils/local-storage';
import field from '@/components/field/';
import fieldGroup from '@/components/field-group/';

export default {
  props: {
    phone: String,
    phonecode: String
  },
  data() {
    return {
      counting: true,
      code: '',
      password: '',
      repeatPassword: ''
    };
  },

  methods: {
    async registerSubmit() {
      if(this.password == ''){
          Toast.fail("密码不能为空！");
          return false;        
      }
      if(this.repeatPassword == ''){
          Toast.fail("确认密码不能为空！");
          return false;        
      }      
      if(this.password != this.repeatPassword){
          Toast.fail("两次密码不一致！");
          return false;   
      }

      if(this.code != this.phonecode){
        Toast.fail("验证码错误！");
        return false;
      }

      let obj = {};
      obj.mobile = this.phone;
      obj.password = this.password;
      obj.code = this.code;
      obj.action = 'register_by_code';
      let res = await registerApi(obj);
      //console.log(res);
      if(res.code == 1){
        //setLocalStorage({ Authorization: res.data.login_name});
        this.$router.push({
        name: 'registerStatus',
        params: { status: 'success' }
      });
      }else{
        Toast.fail("注册失败");
      }  
    },
    checkPhone(){
      let phone = this.phone;
      if(!(/^1[3456789]\d{9}$/.test(phone))){ 
        return false; 
      }else{
        return true;
      }
    },    
    async getCode() {
      this.counting = true;
      if(!this.checkPhone()){
          Toast.fail("手机号格式错误！");
          return false;
      }      

      //开始发短信
      let obj = {}
      obj.mobile = this.phone;
      obj.action = 'send_code';

      let res = await getCodeApi(obj);
      console.log(res);      
    },
    countdownend() {
      this.counting = false;
    }
  },

  components: {
    [field.name]: field,
    [fieldGroup.name]: fieldGroup
  }
};
</script>


<style lang="scss" scoped>
@import '../../../assets/scss/mixin';

.register_submit {
  padding-top: 40px;
  background-color: #fff;
}

.register_submit_btn {
  padding-top: 30px;
}

.getCode {
  @include one-border(left);
  text-align: center;
}

.time_down {
  color: $red;
}
</style>

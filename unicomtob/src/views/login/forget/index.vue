<template>
	<md-field-group class="foget_view">
		<md-field
			v-model="mobile"
			icon="mobile"
			placeholder="请输入手机号"/>

		<md-field
			v-model="code"
			icon="lock"
			placeholder="请输入短信验证码"
		>
			<div slot="rightIcon" @click="getCode" class="getCode red">
				<countdown v-if="counting" :time="60000" @end="countdownend">
				  <template slot-scope="props">{{ +props.seconds || 60 }}秒后获取</template>
				</countdown>
				<span v-else>获取验证码</span>
			</div>
		</md-field >

		<div class="foget_submit">
			<van-button size="large" type="danger" @click="submitCode">下一步</van-button>
		</div>
	</md-field-group>
</template>

<script>
import { Toast} from 'vant';
import { getCodeApi,registerApi } from '@/api/api'
import field from '@/components/field/';
import fieldGroup from '@/components/field-group/';

export default {
  data() {
    return {
      counting: false,
      mobile: '',
      code: '',
      phonecode:''
    };
  },

  methods: {
    checkPhone(){
      let phone = this.mobile;
      if(!(/^1[3456789]\d{9}$/.test(phone))){ 
        return false; 
      }else{
        return true;
      }
    }, 
    submitCode() {
      if(!this.checkPhone()){
          Toast.fail("手机号格式错误！");
          return false;
      }    
      if(this.phonecode != this.code){
          Toast.fail("验证码错误！");
          return false;        
      }  
      this.$router.push('/login/forget/reset/'+this.mobile+'/'+this.code);  
    },
    async getCode() {
      this.counting = true;
      if(!this.checkPhone()){
          Toast.fail("手机号格式错误！");
          return false;
      }      

      //开始发短信
      let obj = {}
      obj.mobile = this.mobile;
      obj.action = 'send_code';

      let res = await getCodeApi(obj);
      //console.log(res);
      if(res.code == 1){
          this.phonecode = res.data
      }else{
          Toast.fail("手机号格式错误！");
          return false;
      }
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

div.foget_view {
  background-color: #fff;
  padding-top: 30px;
}

div.foget_submit {
  padding-top: 30px;
  padding-bottom: 20px;
}

.getCode {
  @include one-border(left);
  text-align: center;
}

.time_down {
  color: $red;
}
</style>

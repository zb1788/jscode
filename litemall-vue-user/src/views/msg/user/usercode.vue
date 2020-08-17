<template>
	<md-field-group class="register_view">
		<md-field
			v-model="code"
			icon="mobile"
			placeholder="请输入激活码"/>

		<div class="register_submit">
			<van-button size="large" type="danger" @click="submitCode">激活</van-button>
		</div>    
	</md-field-group>
</template>

<script>
import { registerApi } from '@/api/api'
import field from '@/components/field/';
import fieldGroup from '@/components/field-group/';
import { setLocalStorage,getLocalStorage } from '@/utils/local-storage';
import { Toast} from 'vant';
export default {
  data() {
    return {
      code:''
    };
  },

  methods: {
    async submitCode() {
      if(this.code == ''){
          Toast.fail("激活码不能为空！");
          return false;
      }      

      //开始发短信
      let obj = {}
      obj.member_id = getLocalStorage('userid').userid;
      obj.activity_code = this.code;
      obj.action = 'insert_activity_code';

      let res = await registerApi(obj);
      //console.log(res);
      
      if(res.code == 1){
          Toast.success("激活成功");
          setTimeout(function(){
              this.$router.push('/msg/userorder');
          },1000);
        
      }else{
        Toast.fail("激活失败");
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

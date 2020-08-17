<template>
 <div style="background-color:#fafafa">
    <div class="red" style="text-align:center;font-size:2rem;padding: 1rem 0rem;">兑换服务</div>

    <van-divider :style="{ color: '#D84035', borderColor: '#D84035', padding: '0 0',margin:'0 0','border-width':'0.5px' }"/>
    <div style="min-height:30%;">
      <van-field
          style="font-size: 1.5rem;margin-top:21vh;padding-left:20%;"
          v-model="duihuancode"
          placeholder="请填写兑换码"        
      />
    </div>

    <van-divider :style="{ color: '#D84035', borderColor: '#D84035', padding: '0 0',margin:'0 0','border-width':'0.5px' }"/>  
    <van-checkbox v-model="checked">兑换即视为同意《服务须知与隐私条款》</van-checkbox>

    <div style="padding:1rem 0rem;text-align: center;">
      <van-button @click="cancel" class="buttoninfo" style="border-radius: 6%;width:7rem;margin-right:0.5rem;background-color:#F5EEE8;color:#848484;font-size:1.5rem;">取消</van-button>
      <van-button @click="submit" type="danger" class="buttoninfo"  style="border-radius: 6%;width:7rem;font-size:1.5rem;;">确认</van-button>      
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { addOrderApi,registerApi } from '@/api/api';
import { setLocalStorage,getLocalStorage } from '@/utils/local-storage';
import {Divider,Uploader, Grid, GridItem,Radio,RadioGroup,Checkbox } from 'vant';
import { connect } from 'tls';
import { Toast} from 'vant';
export default {
  props: {
    itemId: [String, Number]
  },
  data() {
    return {
      checked:false,
      duihuancode: '',
      phone: '',
      card:'',
      cardlist:[],
      codelist:[],
      cardPicUrl:'',
      codePicUrl:''
    };
  },
  methods: {
    cancel(){
      this.$router.push('/msg/home');
    },
    async submit(){
      //确认
      if(!this.checked){
        this.$toast.fail('请勾选服务须知与隐私条款');
        return false;
      }

      if(this.duihuancode == ''){
        this.$toast.fail('兑换码不能为空');
        return false;
      }

      //开始发短信
      let obj = {}
      obj.member_id = getLocalStorage('userid').userid;
      obj.activity_code = this.duihuancode;
      obj.action = 'insert_activity_code';

      let res = await registerApi(obj);
      //console.log(res);
      let self = this;
      if(res.code == 1){
          Toast.success("兑换成功");
          setTimeout(function(){
              self.$router.push('/msg/home');
          },1000);
        
      }else{
        Toast.fail("激活失败");
      }
      
    }
  },
  components: {    
    [Divider.name]: Divider,
    [Uploader.name]: Uploader,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Radio.name]: Radio,
    [RadioGroup.name]:RadioGroup,
    [Checkbox.name]:Checkbox
  }  
};
</script>
<style>

</style>
<style lang="scss" >
@import '../../../assets/scss/mixin';
.van-uploader__upload{
  width: 100%;
  height: 15vh;
}
.van-uploader__preview-image{
  width: 100%;
  height: 15vh;
}
.van-uploader__upload-icon {
  font-family: vant-icon !important;
}
.red {
  color: #D84035;
}
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

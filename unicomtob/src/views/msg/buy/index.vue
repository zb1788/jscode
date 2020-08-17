<template>
 <div style="background-color:#fafafa">
    <div class="red" style="text-align:center;font-size:2rem;padding: 1rem 0rem;">客户信息采集</div>
    <van-divider :style="{ color: '#D84035', borderColor: '#D84035', padding: '0 0',margin:'0 0','border-width':'0.5px' }"/>
    <van-cell-group>
      <van-field
          v-model="username"
          label="姓名"
          placeholder="请输入姓名"        
      />
      <van-field
          v-model="phone"
          label="手机号"
          placeholder="请输入手机号"        
      />
      <van-field
          v-model="card"
          type="card"
          label="身份证号"
          placeholder="请输入身份证号"          
      />      
      <!-- <van-button type="danger" style="width:100%;">立即购买</van-button> -->
    </van-cell-group>

    <div style="display:flex;margin-top:0.5rem;">
      <van-uploader style="flex: 1;" accept="image/*" :max-count="1" v-model="cardlist" :after-read="uploadCard" upload-text="上传身份证正面"/>
      <van-uploader style="flex: 1;" accept="image/*" :max-count="1" v-model="codelist" :after-read="uploadScreen" upload-text="销券截图凭证"/>
    </div>

    <van-divider :style="{ color: '#D84035', borderColor: '#D84035', padding: '0 0',margin:'0 0','border-width':'0.5px' }"/>  

    <div style="padding:1rem 0rem;text-align: center;">
      <van-button @click="cancel" class="buttoninfo" style="border-radius: 6%;width:7rem;margin-right:0.5rem;background-color:#F5EEE8;color:#848484;font-size:1.5rem;">取消</van-button>
      <van-button @click="submit" type="danger" class="buttoninfo"  style="border-radius: 6%;width:7rem;font-size:1.5rem;;">确认</van-button>      
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { addOrderApi } from '@/api/api';
import { setLocalStorage,getLocalStorage } from '@/utils/local-storage';
import {Divider,Uploader, Grid, GridItem } from 'vant';
export default {
  props: {
    itemId: [String, Number]
  },
  data() {
    return {
      username: '',
      phone: '',
      card:'',
      cardlist:[],
      codelist:[],
      cardPicUrl:'',
      codePicUrl:''
    };
  },
  methods: {
    uploadCard(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);      
      this.upload(file,1);
    },
    uploadScreen(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);      
      this.upload(file,2);
    },    
    upload(file,type){
      var formData = new FormData() // 声明一个FormData对象
      var formData = new window.FormData() // vue 中使用 window.FormData(),否则会报 'FormData isn't definded'
      formData.append('file', file.file)
      var options = {  // 设置axios的参数
         url: 'https://www.hnumg.top/v1.0/message/upload?ran=' + Math.random(),
         data: formData,
         method: 'post',
         headers: { 
          'Content-Type': 'multipart/form-data'
         }
      }
      axios(options).then((res) => {        
        if(type == 1){
          //身份证
          this.cardPicUrl = res.data;
        }else{
          //截图
          this.codePicUrl = res.data;
        }
      }) // 发送请求      
    },
    cancel(){
      this.$router.push('/home')
    },
    async submit(){
      //确认
      if(this.username == ''){
        this.$toast.fail('姓名不能为空');
        return false;
      }

      if(this.phone == ''){
        this.$toast.fail('手机号不能为空');
        return false;
      }

      if(this.card == ''){
        this.$toast.fail('身份证号不能为空');
        return false;
      }     
      if(this.cardPicUrl == ''){
        this.$toast.fail('身份证正面图片不能为空');
        return false;
      }

      if(this.codePicUrl == ''){
        this.$toast.fail('销券截图凭证不能为空');
        return false;
      }

        let self = this;

        let obj = {};
        obj.product_id = 16;
        obj.product_name = 'vip就诊服务';
        obj.member_id = getLocalStorage('userid').userid;
        obj.nums = this.itemId;//次数
        obj.amount = 0;//价格
        obj.action = 'insert';
        let res = await addOrderApi(obj);
        if(res.code == 1){
          //生成订单id
          let obj1 ={};
          obj1.order_id = res.data.id;
          obj1.purchaser_name = this.username;
          obj1.purchaser_cart_no = this.card;
          obj1.purchaser_mobile = this.phone;
          obj1.pic_url = this.cardPicUrl;
          obj1.pic_proof = this.codePicUrl;
          obj1.action = 'update_purchaser';
          addOrderApi(obj1).then(function(response){
            console.log(response);            
            self.$router.push('/msg/about/'+res.data.id);  
          })
        }
      
    }
  },
  components: {    
    [Divider.name]: Divider,
    [Uploader.name]: Uploader,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
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

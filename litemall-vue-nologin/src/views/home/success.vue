<template>
  <div class="main" style="font-">
      <div style="text-align:center;color:#ee0a24;font-size:1.5rem;">已购买成功</div>
      <van-divider />
      <van-row gutter="20">
        <van-col span="8">
            <van-image
            style="height:100px" 
            width="100%"
            :src="goodPic"
            />
        </van-col>
        <van-col span="10" style="height:100px;line-height: 100px;font-size:1.1rem;">{{goodName}} X {{goodNum}}</van-col>
        <van-col span="6" style="height:100px;line-height: 100px;font-size:1.2rem;color:#ee0a24;">¥{{price}}</van-col>
      </van-row>
      <van-divider />
      <div style="padding:15px;font-size:1.1rem;">
          我们的客服人员会在接收消息后第一时间联系您，请保持手机畅通<br/>
          我们的服务热线：<u><a style="color:#ee0a24;" href="tel:0371-55957120">0371-55957120</a></u>。
      </div>
      <div style="text-align: center;">
        <van-button style="width:80%;" size="large" round  type="danger" @click="back">返回首页</van-button>
      </div>      
  </div>
</template>

<script>
import { Row, Col ,Divider,image,Toast,NavBar  } from 'vant';
import { addOrderApi,goodDetail } from '@/api/api';
export default {
  props: {
    itemId: [String, Number],
    orderId: [String, Number]
  },
  data(){
      return {
          goodPic:'',
          price:0,
          goodName:'',
          goodNum:0,
      }
  },
  created() {
    this.getPic();
    this.initData();
  },
  methods: {
    async getPic() {
      let obj = {};
      obj.id = this.itemId;
      obj.action = 'query_product';
      let res = await goodDetail(obj);
      console.log(res);
      if(res.code == 1){
        this.goodPic = res.data.pic;
      }else{
        Toast.fail("获取数据失败");
      }
    },          
    async initData() {
      let obj = {};
      obj.order_id = this.orderId;
      obj.action = 'query_order';
      let res = await addOrderApi(obj);
      console.log(res);
      if(res.code == 1){
        this.price = res.data.jine;
        this.goodName = res.data.chanpinname;
        this.goodNum = res.data.cishu;
      }else{
        Toast.fail("获取数据失败");
      }
    },
    back(){
       this.$router.push('/iptv/');
    }
  },
  components: {
    [image.name]: image,
    [Divider.name]: Divider,
    [Col.name]: Col,
    [Row.name]: Row,
    [Toast.name]: Toast
  }
}
</script>

<style>
div.main {
  background-color: #fff;
  padding-top: 30px;
}
</style>
<template>
<div>
	<md-field-group class="foget_view">
		<md-field
			v-model="name"
			icon="user-circle-o"
			placeholder="购买人姓名"/>

		<md-field
			v-model="mobile"
			icon="mobile"
			placeholder="联系电话"
		>
		</md-field >

		<div class="foget_submit">
			<van-button size="large" type="danger" @click="submitCode">确认支付</van-button>            
		</div>
    <div style="color:#EB3C2B;font-size:1.2rem;">以上信息为使用服务凭证，请确保信息真实有效</div>
    <van-checkbox v-model="checked" ><a href="#/info" style="color:rgba(24, 88, 77, 0.7);font-size:1.1rem;">已阅读并同意《服务须知和隐私条款》</a></van-checkbox>
    <!-- <a href="#/info" style="color:rgba(24, 88, 77, 0.7);font-size:1.2rem;">服务协议</a> -->
    <div>
      
    </div>
        <!-- <div style="color:#e15a59f0;font-size:1.2rem;">以上信息为使用服务凭证，请确保信息真实有效</div> -->
	</md-field-group>

    <van-popup v-model="showPayResult" :close-on-click-overlay=false round :style="{width:'70%',height: '15%' }">
      <van-row  type="flex" justify="center">
        <van-col>
          请确认支付是否完成
        </van-col>               
      </van-row>      
      <van-row  type="flex" justify="center">
        <van-col>
          <van-button hairline  size="normal" type="info" @click="getPayResult">已完成支付</van-button>
        </van-col>               
      </van-row>         
      <van-row  type="flex" justify="center">
        <van-col>
          <van-button hairline  size="normal" type="default" @click="retryPay">支付遇到问题重新支付</van-button>
        </van-col>               
      </van-row>         
    </van-popup>  

    <van-action-sheet
      v-model="paytypeshow"
      :actions="actions"
       @select="onSelect"
      description="请选择支付方式"
    />    
</div>  
</template>

<script>
import { Checkbox,Row,Col,Popup,Toast,ActionSheet,Notify  } from 'vant';
import { addOrderApi,goodDetail,iptvPay,isWeixin } from '@/api/api'
import field from '@/components/field/';
import fieldGroup from '@/components/field-group/';
import _ from 'lodash';
import { setLocalStorage,getLocalStorage } from '@/utils/local-storage';
export default {
  props: {
    itemId: [String, Number],
    selectNum: [String, Number],
  },
  data() {
    return {
      counting: false,
      mobile: '',
      name: '',
      good:{},
      checked:true,
      showPayResult:false,
      currentOrderId:'',
      paytypeshow:false,
      actions:[
        // {name:'微信支付',type:1},
        {name:'支付宝支付',type:2}
      ],
      amount:0,
      productId:''      //全程绿色就医500：2476005900；300：2476005901；名医问诊：2476005902；名医主刀:2476005903;
    };
  },
  created() {
    console.log(this.itemId)
    this.initData();
  },
  methods: {
    async initData() {
      let obj = {};
      obj.id = this.itemId;
      obj.action = 'query_product';
      let res = await goodDetail(obj);
      console.log(res);
      if(res.code == 1){
        this.good.name = res.data.name;
        this.good.cishu = res.data.cishu;
        this.good.jiage = res.data.jiage;
        this.good.pic = res.data.pic;
        this.good.content = res.data.content;
      }else{
        Toast.fail("获取数据失败");
      }
    },    
    checkPhone(){
      let phone = this.mobile;
      if(!(/^1[3456789]\d{9}$/.test(phone))){ 
        return false; 
      }else{
        return true;
      }
    },
    async onSelect(item){
      this.paytypeshow = false;      
      
      if(this.itemId == 13){
        let param = {};
        param.phone = this.mobile;
        param.action = 'isFirstPay';
        let result = await addOrderApi(param);
        if(result.code == 1){
          if(result.data == '0'){
            //首次下单
            this.amount = this.good.jiage*1*this.selectNum - 200;
            this.productId = '2476005901';
          }else{
            this.amount = this.good.jiage*1*this.selectNum;
            this.productId = '2476005900';
          }          
        }else{          
        }        
      }else{
        this.amount = this.good.jiage*1*this.selectNum;
        if(this.itemId == 11){
          //名医主刀
          this.productId = '2476005903';
        }
        if(this.itemId == 12){
          //名医问诊
          this.productId = '2476005902';
        }        
      }
      let obj = {};
      obj.product_id = this.itemId;
      obj.product_name = this.good.name;
      obj.member_id = 11;
      obj.nums = this.selectNum;
      obj.amount = this.amount;
      obj.name = this.name;
      obj.phone = this.mobile;
      obj.action = 'insertForIPTV';

      let res = await addOrderApi(obj);
      let self = this;
      if(res.code == 1){
          //下单成功，开始支付
          self.currentOrderId = res.data.id;
          self.showPayResult = true;     
          self.iptvPayOrder(item.type);    
          //this.$router.push('/success/'+this.itemId+'/'+res.data.id);
      }else{
          this.$toast.fail('下单失败！');
      }          
    },    
    async submitCode() {
      if(!this.checked){
          this.$toast.fail("请先勾选服务凭证");
          return false;
      }
      if(this.name == ''){
          this.$toast.fail("姓名不能为空！");
          return false;
      }
      if(!this.checkPhone()){
          this.$toast.fail("手机号格式错误！");
          return false;
      }    
      
      if(this.mobile == ''){
          this.$toast.fail("电话不能为空！");
          return false;
      } 

      if(isWeixin()){
        //this.$toast.fail("不能在微信中打开，请在手机浏览器中打开");
        Notify({ type: 'success', message: '不能在微信中打开，请用支付宝或浏览器扫一扫打开',duration: 0 });
        return false;
      }else{
        //this.paytypeshow = true;
        //直接支付，不用选择微信或者支付宝
        this.onSelect({'type':2});
      }
      
      //this.$router.push('/msg/checkorder/buy/'+this.itemId);
      //return false;
   
    },
    iptvPayOrder(type){
          let payobj = {};
          payobj.order_id = this.currentOrderId;
          if(type == 1){
            payobj.out_trade_type = 'wxh5';
          }else{
            payobj.out_trade_type = 'alih5';
          }

          
          payobj.out_body = 'iptv';          
          payobj.amount = this.amount;
          // payobj.amount = 0.01;
          payobj.member_id=11;
          payobj.spbill_create_ip='120.194.3.98';
          // payobj.product_id = 'productIDa0000000000000000000012';
          payobj.product_id = this.productId;
          payobj.content_id = '00000002';
          payobj.action = 'iptv_payment';

          iptvPay(payobj).then(function(response){
            console.log(response);
            if(response.result == 1){
              window.location.replace(response.payextend);
              //判断支付方式微信还是支付宝
              // if(type == 1){
              //   //微信
              //   window.location.replace(response.pay_url);
              // }else{
              //   const div = document.createElement("div");
              //   div.innerHTML=response.pay_url;
              //   document.body.append(div);
              //   document.forms[0].submit();                
              // }                
            }else{
              Toast.fail("支付接口失败");
            }
          }) 
    },
    async getPayResult(){
      let obj = {};
      obj.order_id = this.currentOrderId;
      obj.action = 'query_order';
      let res = await addOrderApi(obj);
      if(res.code == 1){
        let zhifustate = res.data.zhifustate;
        if(zhifustate == 1){
            //未支付，页面不跳转
            this.$toast.fail('支付失败请重新支付');   
            this.iptvPayOrder();
        }else{
          //支付成功
          this.$router.push('/success/'+this.itemId+'/'+this.currentOrderId);
        }
      }else{
        this.$toast.fail('请求支付接口失败！');      
      }
    },
    retryPay(){
      //重新支付
      this.iptvPayOrder();
    },          
    getCode() {
      this.counting = true;
    },
    countdownend() {
      this.counting = false;
    }
  },

  components: {    
    [Checkbox.name]: Checkbox,
    [field.name]: field,
    [fieldGroup.name]: fieldGroup,
    [Row.name]: Row,
    [Col.name]: Col,    
    [Popup.name]: Popup,
    [Toast.name]: Toast ,
    [ActionSheet.name]:ActionSheet,
    [Notify.name]: Notify
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/mixin';

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

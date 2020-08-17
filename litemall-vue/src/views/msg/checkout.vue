<template>
<div class="order">
  <!-- <van-cell-group>
      <div slot="label">
        <div>
         <span>{{ checkedAddress.name }} </span>
         <span>{{ checkedAddress.tel }} </span>
      </div>
      <div>
        {{ checkedAddress.addressDetail }}
      </div>
      </div>
    </van-cell>
  </van-cell-group> -->

  <!-- <van-cell-group>
    <van-cell class="order-coupon" title="优惠券" is-link :value="getCouponValue()" @click="getCoupons" />
  </van-cell-group> -->

<!-- 优惠券列表 -->
<van-popup v-model="showList" position="bottom">
  <van-coupon-list
    :coupons="coupons"
    :chosen-coupon="chosenCoupon"
    :disabled-coupons="disabledCoupons"
    @change="onChange"
    @exchange="onExchange"
  />
</van-popup>

    <!-- <van-card
      v-for="item in checkedGoodsList"
      :key="item.id"
      :title="item.goodsName"
      :num="item.number"
      :price="item.price +'.00'"
      :thumb="item.picUrl"
    >
      <div slot="desc">
        <div class="van-card__desc">
          <van-tag plain style="margin-right:6px;" v-for="(spec, index) in item.specifications" :key="index">
            {{spec}}
          </van-tag>
        </div>
      </div>
    </van-card> -->

    <van-cell-group>
      <van-cell title="商品金额">
        <span class="red">{{goods.jiage * 100 | yuan}}</span>
      </van-cell>
      <van-cell title="付款方式">
        <span class="red"></span>
      </van-cell>      
      <van-cell center title="微信">
        <van-switch v-model="wxchecked" @change="wxchange" slot="right-icon" size="24" />
      </van-cell>        
      <van-cell center title="支付宝">
        <van-switch v-model="alichecked" @change="alichange" slot="right-icon" size="24" />
      </van-cell>      

      <!-- <van-cell title="优惠券">
        <span class="red">-{{ couponPrice * 100| yuan}}</span>
      </van-cell>
      <van-field v-model="message" placeholder="请输入备注" label="订单备注">
      <template slot="icon">{{message.length}}/50</template>
      </van-field>       -->
    </van-cell-group>

    <van-submit-bar
      :price="goods.jiage*100"
      label="总计："
      buttonText="提交订单"
      :disabled="isDisabled"
      @submit="onSubmit"
    />

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
</div>
</template>

<script>
import { Switch ,Card, Tag, ard, Field, SubmitBar, Toast,Row,Col  } from 'vant';
import { CouponCell, CouponList, Popup } from 'vant';
import { addOrderApi,goPay,goodDetail,cartCheckout, orderSubmit, couponSelectList,getQueryVariable} from '@/api/api';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import dayjs from 'dayjs';

export default {
  props: {
    itemId: [String, Number],
    type: [String, Number]
  },  
  data() {
    return {
      checkedGoodsList: [],
      checkedAddress: {},
      availableCouponLength: 0, // 可用的优惠券数量
      goodsTotalPrice: 0, //商品总价
      freightPrice: 0, //快递费
      couponPrice: 0, //优惠券的价格
      grouponPrice: 0, //团购优惠价格
      orderTotalPrice: 0, //订单总价
      actualPrice: 0, //实际需要支付的总价
      message: '',

      isDisabled: false,
      showList: false,
      chosenCoupon: -1,
      coupons: [],
      disabledCoupons: [],
      goods: {
        id:'',
        namge:'',
        jiage:0,
        cishu:'',
        content:'',
        pic:'',
        userHasCollect: 0,
        info: {
          gallery: []
        }
      },
      wxchecked:true,
      alichecked:false,
      showPayResult:false,
      currentOrderId:'',
      code:'',
      wxjsObj:{
        appId:'',
        nonceStr:'',
        package:'',
        paySign:'',
        timestamp:''
      }
    };
  },
  created() {
    if(this.is_weixn()){           
      this.code = getQueryVariable('code');            
    }
    this.init();
  },

  methods: {
    wxchange(checked){
      console.log(checked);
      if(!checked){
        this.alichecked = true;
      }else{
        this.alichecked = false;
      }
    },
    alichange(checked){
      console.log(checked);
      if(!checked){
        this.wxchecked = true;
      }else{
        this.wxchecked = false;
      }
    },
    is_weixn(){
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
      } else {
        return false;
      }
    },    
    wxPay(){
      let payObj = {};
      if(this.is_weixn()){
        //微信内支付      
        this.$toast.fail("不能在微信中打开，请在手机浏览器中打开");
        return false;
        payObj.order_id = this.currentOrderId;      
        payObj.amount = this.goods.jiage;
        payObj.member_id = getLocalStorage('userid').userid;
        payObj.action = 'wx_payment';        
        payObj.describe = this.goods.name;
        payObj.pay_source = 'JSAPI';
        payObj.spbill_create_ip = '127.0.0.1';
        payObj.js_code = this.code;
      }else{
        //其他浏览器
        payObj.order_id = this.currentOrderId;      
        payObj.amount = this.goods.jiage;
        payObj.member_id = getLocalStorage('userid').userid;
        payObj.action = 'wx_payment';        
        payObj.describe = 'h5支付';
        payObj.pay_source = 'MWEB';
        payObj.spbill_create_ip = '36.99.141.56';
      }
      
      let self = this;
      goPay(payObj).then(function(res){
        console.log(res);
        if(res.code == 1){
            if(self.is_weixn()){
              self.wxjsObj.appId = res.pay_url.appid;
              self.wxjsObj.nonceStr = res.pay_url.noncestr;
              self.wxjsObj.package = res.pay_url.package;
              self.wxjsObj.paySign = res.pay_url.paySign;
              self.wxjsObj.timestamp = res.pay_url.timestamp;
              if (typeof WeixinJSBridge == "undefined"){
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', self.onBridgeReady, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', self.onBridgeReady); 
                    document.attachEvent('onWeixinJSBridgeReady', self.onBridgeReady);
                }
              }else{
                self.onBridgeReady();
              }
            }else{
              window.location.replace(res.pay_url);
            }            
        }else{
          Toast.fail("支付接口失败");
        }
      })
    },
    onBridgeReady(){
      WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId":this.wxjsObj.appId,     //公众号名称，由商户传入     
            "timeStamp":this.wxjsObj.timestamp,         //时间戳，自1970年以来的秒数     
            "nonceStr":this.wxjsObj.nonceStr, //随机串     
            "package":this.wxjsObj.package,     
            "signType":"MD5",         //微信签名方式：     
            "paySign":this.wxjsObj.paySign //微信签名 
          },
          function(res){
          if(res.err_msg == "get_brand_wcpay_request:ok" ){
          // 使用以上方式判断前端返回,微信团队郑重提示：
                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          }else{
          }
      }); 

    },
    async aliPay(){
      let obj = {};
      obj.order_id = this.currentOrderId;
      obj.pay_source = 3;
      obj.amount = this.goods.jiage;
      obj.member_id=getLocalStorage('userid').userid;
      obj.action = 'alipay_payment';

      let res = await addOrderApi(obj);
      if(res.code == 1){
        window.location.replace(res.pay_url);
      }else{
        Toast.fail("支付接口失败");
      }

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
            this.$router.push('/msg/userorder');           
        }else{
          //支付成功
          this.$router.push('/msg/about');  
        }
      }else{
        this.$toast.fail('请求支付接口失败！');      
      }
    },
    retryPay(){
      //重新支付
      this.wxPay();
    },       
    async onSubmit() {     
      if(this.type == 'buy'){
        let obj = {};
        obj.product_id = this.goods.id;
        obj.product_name = this.goods.name;
        obj.member_id = getLocalStorage('userid').userid;
        obj.nums = 1;
        obj.amount = this.goods.jiage;
        obj.action = 'insertTC';

        let self = this;
        let res = await addOrderApi(obj);
        console.log(res);
        if(res.code == 1){
          self.currentOrderId = res.data.id;
          self.showPayResult = true;
          if(this.wxchecked){
            self.wxPay();
          }else if(this.alichecked){
            self.aliPay();
          }
          
          //this.$router.push('/msg/userorder');  
        }
      }else{
        this.currentOrderId = this.type;
        this.showPayResult = true;
        if(this.wxchecked){
          this.wxPay();
        }else if(this.alichecked){
          this.aliPay();
        }        
      }       
      // const {AddressId, CartId, CouponId, UserCouponId} = getLocalStorage('AddressId', 'CartId', 'CouponId', 'UserCouponId');

      // if (AddressId === null) {
      //   Toast.fail('请设置收货地址');
      //   return;
      // }


      // this.isDisabled = true;

      // orderSubmit({
      //   addressId: AddressId,
      //   cartId: CartId,
      //   couponId: CouponId,
      //   userCouponId: UserCouponId,
      //   grouponLinkId: 0,
      //   grouponRulesId: 0,
      //   message: this.message
      // }).then(res => {
        
      //   // 下单成功，重置下单参数。
      //   setLocalStorage({AddressId: 0, CartId: 0, CouponId: 0});

      //   let orderId = res.data.data.orderId;
      //   this.$router.push({
      //     name: 'payment',
      //     params: { orderId: orderId }
      //   });
      // }).catch(error => {
      //   this.isDisabled = false;
      //   this.$toast("下单失败");
      // })

    },
    goAddressList() {
      this.$router.push({
        path: '/user/address'
      });
    },
    getCouponValue() {
      if(this.couponPrice !== 0 ){
        return "-¥" + this.couponPrice + ".00元"
      }
      if(this.availableCouponLength !== 0){
        return this.availableCouponLength + "张可用"
      }
      return '没有可用优惠券'
    },
    getCoupons() {
      const {AddressId, CartId, CouponId} = getLocalStorage('AddressId', 'CartId', 'CouponId');
      couponSelectList({cartId: CartId, grouponRulesId: 0}).then(res => {
        var cList = res.data.data.list;
        this.coupons = []
        this.disabledCoupons = [];
        for(var i = 0; i < cList.length; i++){
          var c = cList[i]

          var coupon = {
            id: c.id,
            cid: c.cid,
            name: c.name,
            condition: '满' + c.min + '元可用',
            value: c.discount * 100,
            description: c.desc,
            startAt: new Date(c.startTime).getTime()/1000,
            endAt: new Date(c.endTime).getTime()/1000,
            valueDesc: c.discount,
            unitDesc: '元'            
          }
          if (c.available) {
            this.coupons.push(coupon);
          } else {
            this.disabledCoupons.push(coupon);
          }
        }
        
        this.showList = true
      })
    },
    async init() {
      this.goods.id = this.itemId;
      let obj = {};
      console.log(this.itemId)
      obj.id = this.itemId;
      obj.action = 'query_product';
      let res = await goodDetail(obj);
      console.log(res);
      if(res.code == 1){
        this.goods.name = res.data.name;
        this.goods.cishu = res.data.cishu;
        this.goods.jiage = res.data.jiage;
        this.goods.pic = res.data.pic;
        this.goods.content = res.data.content;
      }else{
        Toast.fail("获取数据失败");
      }      
      // const {AddressId, CartId, CouponId, UserCouponId} = getLocalStorage('AddressId', 'CartId', 'CouponId', 'UserCouponId');

      // cartCheckout({cartId: CartId, addressId: AddressId, couponId: CouponId, userCouponId: UserCouponId, grouponRulesId: 0}).then(res => {
      //     var data = res.data.data

      //     this.checkedGoodsList = data.checkedGoodsList;
      //     this.checkedAddress= data.checkedAddress;
      //     this.availableCouponLength= data.availableCouponLength;
      //     this.actualPrice= data.actualPrice;
      //     this.couponPrice= data.couponPrice;
      //     this.grouponPrice= data.grouponPrice;
      //     this.freightPrice= data.freightPrice;
      //     this.goodsTotalPrice= data.goodsTotalPrice;
      //     this.orderTotalPrice= data.orderTotalPrice;

      //     setLocalStorage({AddressId: data.addressId, CartId: data.cartId, CouponId: data.couponId, UserCouponId: data.userCouponId});
      // });

    },
    onChange(index) {
      this.showList = false;
      this.chosenCoupon = index;
      
      if(index === -1 ){
        setLocalStorage({CouponId: -1, UserCouponId: -1});
      }
      else{
        const couponId = this.coupons[index].cid;
        const userCouponId = this.coupons[index].id;
        setLocalStorage({CouponId: couponId, UserCouponId: userCouponId});
      }

      this.init()
    },
    onExchange() {
      this.$toast("兑换暂不支持");
    }    
  },

  components: {
    [Switch.name]:Switch,
    [Row.name]: Row,
    [Col.name]: Col,       
    [Toast.name]: Toast ,
    [SubmitBar.name]: SubmitBar,
    [Card.name]: Card,
    [Field.name]: Field,
    [Tag.name]: Tag,
    [CouponCell.name]: CouponCell,
    [CouponList.name]: CouponList,
    [Popup.name]: Popup
  }
};
</script>


<style lang="scss" scoped>
.order-coupon {
  margin-top: 10px;
}
</style>
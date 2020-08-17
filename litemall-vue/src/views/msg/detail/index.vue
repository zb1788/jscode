<template>
  <div class="item_detail">
    <van-image :src="banner"/>
    <van-image :src="banner1" style="display:none;"/>
    <van-cell-group class="item_cell_group" v-if="goods">
      <van-cell class="item_info">
        <div>
          <span class="item_price">￥{{goods.jiage}}元<van-tag round type="warning">首单体验价</van-tag></span>
          <span class="item_market_price">价格500元</span>
        </div>
        <div class="item-title">
          {{goods.name}}
        </div>
        <!-- <div class="item_intro">商品描述</div> -->
      </van-cell>
    </van-cell-group>

  <div class="item_cell_group">
    <!-- <van-cell-group>
      <van-cell title="运费" value="满88免邮费"/>
    </van-cell-group> -->
    <van-sku
      v-model="showSku"
      :sku="sku"
      :close-on-click-overlay = true
      :show-add-cart-btn=false
      :hide-stock="true"
      :goods="skuGoods"
      :goodsId="goods.id"
      :quota="goodForUser.max"
      :quota-used="goodForUser.used"
      @buy-clicked="buyGoods"
      @add-cart="addCart"
    />
  </div>

    <div class="item_desc">
      <div class="item_desc_title">商品详情</div>
      <div class="item_desc_wrap" v-if="goods.content" v-html="goods.content"></div>
      <div class="item_desc_wrap" v-else style="text-align: center;">
        <p>无详情</p>
      </div>
    </div>

    <van-goods-action>
      <!-- <van-goods-action-icon @click="toCart" icon="cart-o" :info="(cartInfo > 0) ? cartInfo : ''"/>
      <van-goods-action-icon @click="addCollect" icon="star-o" :style="(goods.userHasCollect !== 0) ? 'color: #f7b444;':''"/>
      <van-goods-action-button type="warning" @click="skuClick" text="加入购物车"/> -->
      <van-goods-action-button type="danger" @click="skuClick" text="立即购买"/>
    </van-goods-action>

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


    <van-popup v-model="showKefu" round :style="{width:'70%',height: '40%' }">
      <van-cell-group>
        <van-field
          v-model="useOrderObj.truename"
          label="姓名"
          placeholder="请输入姓名"
        />
        <van-field
          v-model="useOrderObj.phone"
          label="手机号"
          placeholder="请输入手机号"
        />
        <van-field
          v-model="useOrderObj.shenfezhenghao"
          label="身份证号"
          placeholder="请输入身份证号"
        /> 
        <input type="file" name="file" @change="checkImage();"/>                 
      </van-cell-group>

      <van-row  type="flex" justify="center">
        <van-col span="3">
        </van-col>        
        <van-col span="7">
          <van-button hairline  size="normal" type="info" @click="cancel">取消</van-button>
        </van-col>
        <van-col span="4">
        </van-col>
        <van-col span="7">
          <van-button hairline  size="normal" type="danger" @click="submit()">确认</van-button>
          </van-col>
        <van-col span="3">
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

import { goPay,addOrderApi,goodDetail, cartGoodsCount, collectAddOrDelete, cartAdd, cartFastAdd,isWeixin } from '@/api/api';
import { ActionSheet ,Tag,image,Toast,Sku, Swipe, SwipeItem, GoodsAction, GoodsActionButton, GoodsActionIcon, Popup,Row,Col } from 'vant';
import { setLocalStorage,getLocalStorage } from '@/utils/local-storage';
import popupProps from './popup-props';
import _ from 'lodash';
import axios from 'axios'
export default {
  props: {
    itemId: [String, Number]
  },

  data() {
    const isLogin = !!localStorage.getItem('Authorization');

    return {
      isLogin,
      banner:require('../../../assets/images/banner.jpg'),
      banner1:require('../../../assets/images/banner1.jpg'),
      goods: {
        id:'',
        namge:'',
        jiage:'',
        cishu:'',
        content:'',
        pic:'',
        userHasCollect: 0,
        info: {
          gallery: []
        }
      },
      goodForUser:{
        max:5,
        used:3
      },
      sku: {
        tree: [],
        list: [],
        price: '' // 默认价格（单位元）
      },
      skuGoods: {
        // 商品标题
        title: '',
        // 默认商品 sku 缩略图
        picture: ''
      },
      cartInfo: 0,
      selectSku: {
        selectedNum: 1,
        selectedSkuComb: {
          sku_str: 'aa'
        }
      },
      propsPopup: false,
      showSku: false,
      showKefu: false,
      showPayResult:false,
      paytypeshow:false,
      useOrderObj:{
        truename:'',
        phone:'',
        shenfezhenghao:'',
        screenpic:''
      },
      goodsData:{},
      currentOrderId:'',
      actions:[
        {name:'微信支付',type:1},{name:'支付宝支付',type:2}
      ]
    };
  },

  computed: {
    props_str() {
      let props_arr = [];
      _.each(this.goods.attribute, json => {
        props_arr.push([json['attribute'], json['value']]);
      });
      return props_arr || [];
    }
  },

  created() {
    this.initData();
  },

  methods: {
    async skuClick() {
      //this.showSku = true;
      if(this.isLogin){
        //this.paytypeshow = true;
        if(isWeixin()){
          this.$toast.fail("不能在微信中打开，请在手机浏览器中打开");
          return false;
          let redirectUrl = 'https://www.hnumg.top/unicom/#/msg/checkorder/buy/'+this.itemId;
          window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx384be6182019a1d8&redirect_uri='+encodeURIComponent(redirectUrl)+'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect');
        }else{
          this.$router.push('/msg/checkorder/buy/'+this.itemId)
        }                
      }else{
        this.$router.push('/login/');
      }      
    },
    wxPay(){
      if(this.is_weixn()){
        //微信内支付
      }else{
        //其他浏览器
      }
      let payObj = {};
      payObj.order_id = this.currentOrderId;
      payObj.pay_source = 'MWEB';
      payObj.amount = '0.01';
      payObj.describe = 'h5支付';
      payObj.member_id = getLocalStorage('userid').userid;
      payObj.spbill_create_ip = '36.99.141.56';
      payObj.action = 'wx_payment';
      goPay(payObj).then(function(res){
        console.log(res);
        if(res.code == 1){
            window.location.replace(res.pay_url);
        }else{
          Toast.fail("支付接口失败");
        }
      })
    },
    async aliPay(){
      let obj = {};
      obj.order_id = this.currentOrderId;
      obj.pay_source = 3;
      obj.amount = 0.01;
      obj.member_id=getLocalStorage('userid').userid;
      obj.action = 'alipay_payment';

      let res = await addOrderApi(obj);
      if(res.code == 1){
        window.location.replace(res.pay_url);
      }else{
        Toast.fail("支付接口失败");
      }

    },    
    async onSelect(item){
      this.paytypeshow = false;
      if(this.isLogin){
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
          if(item.type == 1){
            self.wxPay();
          }else if(item.type == 2){
            self.aliPay();
          }
          
          //this.$router.push('/msg/userorder');  
        }      
      }else{
        //退出登录
        this.$router.push('/login/');
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
        }else{
          //支付成功
          this.$router.push('/msg/userorder');  
        }
      }else{
        this.$toast.fail('请求支付接口失败！');      
      }
    },
    retryPay(){
      //重新支付
      self.wxPay();
    },
    is_weixn(){
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
      } else {
        return false;
      }
    },
    cancel(){
      this.showKefu = false;
    },
    async submit(){
      if(this.useOrderObj.truename == ''){
        this.$toast.fail('姓名不能为空');
        return false;
      }

      if(this.useOrderObj.phone == ''){
        this.$toast.fail('手机号不能为空');
        return false;
      }

      if(this.useOrderObj.shenfezhenghao == ''){
        this.$toast.fail('身份证号不能为空');
        return false;
      }

      if(this.useOrderObj.screenpic == ''){
        this.$toast.fail('图片不能为空');
        return false;
      }      
      console.log(this.useOrderObj);
      
      let obj ={};
      obj.order_id = this.itemId;
      obj.purchaser_name = this.useOrderObj.truename;
      obj.purchaser_cart_no = this.useOrderObj.shenfezhenghao;
      obj.purchaser_mobile = this.useOrderObj.phone;
      obj.pic_url = this.useOrderObj.screenpic;
      obj.action = 'update_purchaser';
      let res = await addOrderApi(obj);
      console.log(res);
      if(res.code == 1){
        this.showKefu = false;

        let obj = {};
        obj.product_id = this.goodsData.goodsId;
        obj.product_name = this.goods.name;
        obj.member_id = getLocalStorage('userid').userid;
        obj.nums = this.goodsData.selectedNum;
        obj.amount = this.goods.jiage;
        obj.action = 'insert';
        let res = await addOrderApi(obj);
        console.log(res);
        if(res.code == 1){
          this.$router.push('/msg/userorder');  
        }        
      }else{
        this.$toast.fail(res.msg);
      }
    },
    checkImage(){
      console.log("a");
      var formData = new FormData() // 声明一个FormData对象
      var formData = new window.FormData() // vue 中使用 window.FormData(),否则会报 'FormData isn't definded'
      formData.append('file', document.querySelector('input[type=file]').files[0])
      var options = {  // 设置axios的参数
         url: 'http://www.hnumg.top/v1.0/message/upload?ran=' + Math.random(),
         data: formData,
         method: 'post',
         headers: { 
          'Content-Type': 'multipart/form-data'
         }
      }
      axios(options).then((res) => {        
        this.screenpic = res;
      }) // 发送请求
    },
    async initData() {
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

        this.sku.price = res.data.jiage;
        this.skuGoods.picture = res.data.pic;
      }else{
        Toast.fail("获取数据失败");
      }
      
      // goodsDetail({ id: this.itemId }).then(res => {
      //   this.goods = res.data.data;
      //   this.skuAdapter();
      // });

      // cartGoodsCount().then(res => {
      //   this.cartInfo = res.data.data;
      // });
    },
    toCart() {
      this.$router.push({
        name: 'cart'
      });
    },
    addCollect() {
      collectAddOrDelete({ valueId: this.itemId, type: 0 }).then(res => {
        if (this.goods.userHasCollect === 1) {
          this.goods.userHasCollect = 0;
        } else {
          this.goods.userHasCollect = 1;
          this.$toast({
            message: '收藏成功',
            duration: 1500
          });
        }
      });
    },
    getProductId(s1, s2) {
      var productId;
      var s1_name;
      var s2_name;
      _.each(this.goods.specificationList, specification => {
        _.each(specification.valueList, specValue => {
          if (specValue.id === s1) {
            s1_name = specValue.value;
          } else if (specValue.id === s2) {
            s2_name = specValue.value;
          }
        });
      });

      _.each(this.goods.productList, v => {
        let result = _.without(v.specifications, s1_name, s2_name);
        if (result.length === 0) {
          productId = v.id;
        }
      });
      return productId;
    },
    getProductIdByOne(s1) {
      var productId;
      var s1_name;
      _.each(this.goods.specificationList, specification => {
        _.each(specification.valueList, specValue => {
          if (specValue.id === s1) {
            s1_name = specValue.value;
            return;
          }
        });
      });

      _.each(this.goods.productList, v => {
        let result = _.without(v.specifications, s1_name);
        if (result.length === 0) {
          productId = v.id;
        }
      });
      return productId;
    },
    addCart(data) {
      let that = this;
      let params = {
        goodsId: data.goodsId,
        number: data.selectedNum,
        productId: 0
      };
      if (_.has(data.selectedSkuComb, 's3')) {
        this.$toast({
          message: '目前仅支持两规格',
          duration: 1500
        });
        return;
      } else if (_.has(data.selectedSkuComb, 's2')) {
        params.productId = this.getProductId(
          data.selectedSkuComb.s1,
          data.selectedSkuComb.s2
        );
      } else {
        params.productId = this.getProductIdByOne(data.selectedSkuComb.s1);
      }
      cartAdd(params).then(() => {
        this.cartInfo = this.cartInfo + data.selectedNum;
        this.$toast({
          message: '已添加至购物车',
          duration: 1500
        });
        that.showSku = false;
      });
    },
    async buyGoods(data) {
      console.log(data);
      this.goodsData = data;

      if(this.isLogin){
        let obj = {};
        obj.product_id = this.goodsData.goodsId;
        obj.product_name = this.goods.name;
        obj.member_id = getLocalStorage('userid').userid;
        obj.nums = this.goodsData.selectedNum;
        obj.amount = this.goods.jiage;
        obj.action = 'insert';
        let res = await addOrderApi(obj);
        console.log(res);
        if(res.code == 1){
          this.$router.push('/msg/userorder');  
        }      
      }else{
        //退出登录
        this.$router.push('/login/');
      }
      console.log(this.isLogin);
      return false;
      let that = this;
      let params = {
        goodsId: data.goodsId,
        number: data.selectedNum,
        productId: 0
      };
      if (_.has(data.selectedSkuComb, 's3')) {
        this.$toast({
          message: '目前仅支持两规格',
          duration: 1500
        });
        return;
      } else if (_.has(data.selectedSkuComb, 's2')) {
        params.productId = this.getProductId(
          data.selectedSkuComb.s1,
          data.selectedSkuComb.s2
        );
      } else {
        params.productId = this.getProductIdByOne(data.selectedSkuComb.s1);
      }
      cartFastAdd(params).then(res => {
        let cartId = res.data.data;
        setLocalStorage({ CartId: cartId });
        that.showSku = false;
        this.$router.push('/order/checkout');
      });
    },
    skuAdapter() {
      const tree = this.setSkuTree();
      const list = this.setSkuList();
      const skuInfo = {
        price: parseInt(this.goods.info.retailPrice), // 未选择规格时的价格
        stock_num: 0, // TODO 总库存
        collection_id: '', // 无规格商品skuId取collection_id，否则取所选sku组合对应的id
        none_sku: false, // 是否无规格商品
        hide_stock: true
      };
      this.sku = {
        tree,
        list,
        ...skuInfo
      };
      this.skuGoods = {
        title: this.goods.info.name,
        picture: this.goods.info.picUrl
      };
    },
    setSkuList() {
      var sku_list = [];
      _.each(this.goods.productList, v => {
        var sku_list_obj = {};
        _.each(v.specifications, (specificationName, index) => {
          sku_list_obj['s' + (~~index + 1)] = this.findSpecValueIdByName(
            specificationName
          );
        });

        sku_list_obj.price = v.price * 100;
        sku_list_obj.stock_num = v.number;
        sku_list.push(sku_list_obj);
      });

      return sku_list;
    },
    findSpecValueIdByName(name) {
      let id = 0;
      _.each(this.goods.specificationList, specification => {
        _.each(specification.valueList, specValue => {
          if (specValue.value === name) {
            id = specValue.id;
            return;
          }
        });
        if (id !== 0) {
          return;
        }
      });
      return id;
    },
    setSkuTree() {
      let that = this;
      let specifications = [];
      _.each(this.goods.specificationList, (v, k) => {
        let values = [];
        _.each(v.valueList, vv => {
          vv.name = vv.value;
          values.push({
            id: vv.id,
            name: vv.value,
            imUrl: vv.picUrl
          });
        });

        specifications.push({
          k: v.name,
          v: values,
          k_s: 's' + (~~k + 1)
        });
      });

      return specifications;
    }
  },

  components: {
    [ActionSheet.name]:ActionSheet,
    [Row.name]: Row,
    [Col.name]: Col,    
    [Tag.name]: Tag,
    [image.name]: image,
    [Popup.name]: Popup,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Sku.name]: Sku,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionButton.name]: GoodsActionButton,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [popupProps.name]: popupProps
  }
};
</script>

<style lang="scss" scoped>
.item_detail {
  img {
    max-width: 100%;
  }
}

.item_cell_group {
  margin-bottom: 15px;
}

.item_price {
  font-size: 20px;
  color: $red;
  margin-right: 10px;
}

.item_market_price {
  color: $font-color-gray;
  text-decoration: line-through;
  font-size: $font-size-small;
}

.item-title {
  line-height: 1.4;
}

.item_dispatch {
  font-size: $font-size-small;
  color: $font-color-gray;
}

.item_intro {
  line-height: 18px;
  margin: 5px 0;
  font-size: $font-size-small;
  color: $font-color-gray;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.item_desc {
  background-color: #fff;
  /deep/ p {
    padding: 0 10px;
    margin-block-start: 0 !important;
    margin-block-end: 0 !important;
  }
  /deep/ img {
    max-width: 100%;
    display: block;
  }
}

.item_desc_title {
  @include one-border;
  padding: 10px 0;
  text-align: center;
}
</style>

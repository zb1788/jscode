<template>
  <div class="tab_home">
    <van-image
       style="height:150px" 
      width="100%"
      :src="banner"
      @click="openlist"
    />

  <van-grid :border="false" :column-num="3" style="font-size:1rem;">
    <van-grid-item v-for="(item,index) in brandList" :key="index" @click="show(index)" >
      <van-image v-if="index == curIndex" :src="item.picUrl" :class="item.ccname"/>
      <van-image v-else :src="item.picUrl" class="blur" style="padding: 10px 10px;"/>
      <span v-if="index == curIndex" :class="item.cname" style="font-weight: bold;">{{item.name}}</span>
      <span v-else>{{item.name}}</span>
    </van-grid-item>
  </van-grid>
  <v-touch @swipeleft="swiperleft" @swiperight="swiperight" class="vtouch" :swipe-options="{direction: 'horizontal'}">
    <van-cell-group class="item_cell_group" v-if="goods" style="margin-bottom:0px;">
          <van-cell class="item_info" style="padding: 0;">
            <div>
              <!-- <span class="item_price">服务单价：￥{{goods.jiage}}元</span> -->
              <van-image :src="sdyh" v-if="goods.id == 13"/>
              <van-image :src="fwdj" v-else/>
              <!-- <span class="item_market_price">价格500元</span> -->
            </div>
            <!-- <div class="item-title">
              {{goods.name}}
            </div> -->
            <!-- <div class="item_intro">商品描述</div> -->
          </van-cell>
    </van-cell-group>
  <!-- <div class="item_cell_group">
    <van-sku
      v-model="showSku"
      :sku="sku"
      :close-on-click-overlay = true
      :show-add-cart-btn = false
      :hide-stock = true
      :goods="skuGoods"
      :goodsId="goods.id"
      :quota="goodForUser.max"
      :quota-used="goodForUser.used"
      @buy-clicked="buyGoods"
    />
  </div> -->

    <div class="item_desc">
      <!-- <div class="item_desc_title">商品详情</div> -->
      <div class="item_desc_wrap" v-if="goods.content" v-html="goods.content"></div>
      <div class="item_desc_wrap" v-else style="text-align: center;">
        <p>无详情</p>
      </div>
    </div>

    <!-- <van-goods-action>
      <van-goods-action-button type="danger" @click="skuClick" text="立即购买"/>
    </van-goods-action> -->
    <div class="buy">
      <!-- <span class="item_price">￥{{goods.jiage}}元</span> -->
      购买数量：<van-stepper v-model="goodNum" min="1" max="999" />
      <van-button round type="danger" size="normal" @click="buyGoodsNew">立即购买</van-button>
    </div>
    </v-touch>

    <div id="block" style="display:none;">
      <a style="color:#ee0a24;" href="tel:0371-63217120"><img :src="phoneimg" /></a>
    </div>
  </div>
</template>

<script>
import { goodDetail,getHome, goodsCategory, couponReceive,isWeixin } from '@/api/api';
import scrollFixed from '@/mixin/scroll-fixed';
import popupProps from './popup-props';
import _ from 'lodash';
import { setLocalStorage,getLocalStorage } from '@/utils/local-storage';
import {
  Stepper,
  List,
  Swipe,
  SwipeItem,
  Tabbar,
  TabbarItem,
  Search,
  Panel,
  CouponCell,
  CouponList,
  Toast,
  Card,
  Grid,
  GridItem,
  Row,
  Col,
  Tag,
  image,
  Tab, Tabs,
  Sku, GoodsAction, GoodsActionButton, GoodsActionIcon, Popup,Notify 
} from 'vant';

export default {
  mixins: [scrollFixed],

  data() {
    return {
      banner:require('../../assets/images/top.jpg'),
      phoneimg:require('../../assets/images/phone.png'),
      sdyh:require('../../assets/images/sctyj.jpg'),
      fwdj:require('../../assets/images/fwdj.jpg'),
      brandList:[

      ],
      itemId:'',
      curIndex:0,
      isLoading: false,
      goodNum:1,
      goods: {
        id:'',
        name:'',
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
        max:0,
        used:0
      },
      sku: {
        tree: [],
        list: [],
        price: '', // 默认价格（单位元）
        stock_num:999999999999
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
      showSku: false
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
  async created() {
    //this.itemId = 13;
    let obj = {};
    obj.per_page = 999;
    obj.page = 1;
    obj.type = 1;
    obj.action = 'query_product_page';
    let res = await getHome(obj)
    console.log(res)
    if(res.code == 1){
      for(let [index,item] of res.data.entries()){
        let obj = {};
        obj.id = item.id;
        obj.name = item.name;
        console.log(index)
        obj.picUrl = item.pic;
        obj.jiage = item.jiage;
        obj.cishu = item.cishu;
        obj.desc = "（门诊+住院+手术）";
        obj.retailPrice = 0;
        obj.content = item.content;
        if(item.id == 13){
          obj.cname = 'cur1';
          obj.ccname = 'redImg';
        }else if(item.id == 12){
          obj.cname = 'cur3';
          obj.ccname = 'greenImg';
        }else{
          obj.cname = 'cur2';
          obj.ccname = 'blueImg';
        }
        
        this.brandList.push(obj);
      }
      this.itemId = this.brandList[0].id;
    }    
    this.initViews(0);
  },
mounted:function () {
    //this.drag();
  },
  methods: {
    swiperleft(){
      console.log("a")
      let num = 0;
      if(this.curIndex<2){
        num = this.curIndex +1;
      }else if(this.curIndex == 2){
        num = 0;
      }
      this.show(num);
    },
    swiperight(){
      console.log("b")
      let num = 0;
      if(this.curIndex >0){
        num = this.curIndex - 1;
      }else if(this.curIndex == 0){
        num = 2
      }
      this.show(num);
    },
    skuClick() {
      this.showSku = true;
    },
    show(index){
      console.log(index);
      this.curIndex = index;
      this.initViews(index);
    },
    openlist(){
      this.$router.push('/list');
    },
    goDetail(id) {
      let path = `/msg/detail/${id}`;
      this.$router.push(path);
    },
    goBrand(id) {
      let path = `/msg/detail/${id}`;
      this.$router.push(path);
      //return `#/msg/detail/${id}`      
    },
    goTopic(id) {
      return `#/items/topic/${id}`;
    },    
    getCoupon(id) {
      couponReceive({ couponId: id }).then(res => {
        Toast.success('领取成功');
      });
    },
    changeTabbar(o) {
      goodsCategory({ id: o.id }).then(res => {
        let categoryId = res.data.data.currentCategory.id;
        this.$router.replace({
          name: 'category',
          query: { itemClass: categoryId }
        });
      });
    },
    initViews(index) {
        if(isWeixin()){
          Notify({ type: 'success', message: '不能在微信中打开，请用支付宝或浏览器扫一扫打开',duration: 0 });
        }
        
        let cur = this.brandList[index];
        console.log(cur)
        this.goods.id = cur.id;
        this.goods.name = cur.name;
        this.goods.cishu = cur.cishu;
        this.goods.jiage = cur.jiage;
        this.goods.pic = cur.picUrl;
        this.goods.content = cur.content;

        this.sku.price = cur.jiage;
        this.skuGoods.picture = cur.picUrl;
        this.skuGoods.title = cur.name;     
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
            duration: 0
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
    async buyGoodsNew(){
      this.$router.push('/add/'+this.goods.id+'/'+this.goodNum);  
    },
    async buyGoods(data) {
      console.log(data);

      this.$router.push('/add/'+data.goodsId+'/'+data.selectedNum);  
      return false;
      let obj = {};
      obj.product_id = data.goodsId;
      obj.product_name = this.goods.name;
      obj.member_id = 11; //写死11
      obj.nums = data.selectedNum;
      obj.amount = this.goods.jiage;
      obj.action = 'insert';
      let res = await addOrderApi(obj);
      console.log(res);
      if(res.code == 1){
        this.$router.push('/add'+data.goodsId);  
      }
      // this.$router.push('/add/'+data.goodsId);
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
    },
     home:function(){
      this.$router.push({path:'/main'});
    },
    drag:function(){
      var block = document.getElementById("block");
      var oW,oH;
      // 绑定touchstart事件
      block.addEventListener("touchstart", function(e) {
        var touches = e.touches[0];
        oW = touches.clientX - block.offsetLeft;
        oH = touches.clientY - block.offsetTop;

      },false);
      block.addEventListener("touchmove", function(e) {
        e.preventDefault();
        var touches = e.touches[0];
        var oLeft = touches.clientX - oW;
        var oTop = touches.clientY - oH;
        if(oLeft < 0) {
          oLeft = 0;
        }else if(oLeft > document.documentElement.clientWidth - block.offsetWidth) {
          oLeft = (document.documentElement.clientWidth - block.offsetWidth);
        }else if(oTop<0){
          oTop=0;
        }else if(oTop>document.documentElement.clientHeight-block.offsetHeight){
          oTop=document.documentElement.clientHeight-block.offsetHeight;
        }
        block.style.left = oLeft + "px";
        block.style.top = oTop + "px";
      },false);

      block.addEventListener("touchend", function(e) {
        var endLeft = e.changedTouches[0].pageX;
        if(endLeft> document.documentElement.clientWidth/2){
          block.style.left=(document.documentElement.clientWidth-block.offsetWidth-5)+'px';
        }else if(endLeft<document.documentElement.clientWidth/2){
          block.style.left=5+'px';
        }
      },false);
    }

  },

  components: {    
    [Stepper.name]: Stepper,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [image.name]: image,
    [Row.name]: Row,
    [Col.name]: Col,
    [Card.name]: Card,
    [Toast.name]: Toast,
    [CouponCell.name]: CouponCell,
    [CouponList.name]: CouponList,
    [Search.name]: Search,
    [Panel.name]: Panel,
    [List.name]: List,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Tag.name]: Tag,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Sku.name]: Sku,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionButton.name]: GoodsActionButton,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [popupProps.name]: popupProps,
    [Notify.name]: Notify
  }
};
</script>


<style lang="scss" scoped>
.blur{
-webkit-filter: blur(2px); /* Chrome, Opera */
       -moz-filter: blur(2px);
        -ms-filter: blur(2px);    
            filter: blur(2px);  
background-color: #e8e8e8;            
}
.vtouch{
  touch-action: pan-y!important;
}
.cur1{
  // border: 1.5px solid #E14E44;
  color:#E14E44;
}
.cur2{
  // border: 1.5px solid #3EB9BE;
  color:#3EB9BE;
}
.cur3{
  // border: 1.5px solid #FF7B4C;
  color:#FF7B4C;
}
.redImg{padding: 0px 0px;border:#E14E44 solid 1px;}
.blueImg{padding: 0px 0px;border:#3EB9BE solid 1px;}
.greenImg{padding: 0px 0px;border:#FF7B4C solid 1px;}
.buy{
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    justify-content:space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    background-color: #fff;
    padding: 0 1rem;
}
div.van-card {
    font-size: 14px;
    background-color: #f2f3f5;
}
.interval_bot {
  margin-bottom: 10px;
}
.van-panel {
  margin-top: 20px;
}
.goods-channel {
  background: #fff;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 0px;
  padding-top: 10px;
}

.goods-channel .item {
  width: 50px;
  height: 50px;
  margin-left: 10px;
}

.goods-channel img {
  display: block;
  width: 20px;
  height: 20px;
  margin: 0 auto;
}

.goods-channel span {
  display: block;
  font-size: 14px;
  text-align: center;
  margin-top: 5px;
  margin-bottom: 10px;
  color: #333;
}
.van-coupon-cell--selected {
  color: #323233;
}
.van-coupon-list {
  height: 100%;
  position: relative;
  background-color: #f8f8f8;
}
.van-coupon-list__field {
  padding: 7px 15px;
}
.van-coupon-list__exchange {
  height: 32px;
  line-height: 30px;
}
.van-coupon-list__list {
  overflow-y: auto;
  padding: 15px 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}
.van-coupon-list__close {
  left: 0;
  bottom: 0;
  position: absolute;
  font-weight: 500;
}
.van-coupon-list__empty {
  padding-top: 100px;
  text-align: center;
}
.van-coupon-list__empty p {
  color: #969799;
  margin: 15px 0;
  font-size: 14px;
  line-height: 20px;
}
.van-coupon-list__empty img {
  width: 80px;
  height: 84px;
}
.van-coupon-item {
  overflow: hidden;
  border-radius: 4px;
  margin: 0 15px 15px;
  background-color: #fff;
  -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}
.van-coupon-item:active {
  background-color: #e8e8e8;
}
.van-coupon-item__content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 100px;
  padding: 24px 0 0 15px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid red;
}
.van-coupon-item h2,
.van-coupon-item p {
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.van-coupon-item h2 {
  height: 34px;
  font-weight: 500;
  line-height: 34px;
}
.van-coupon-item p {
  font-size: 12px;
  line-height: 16px;
  color: #969799;
}
.van-coupon-item__head {
  min-width: 90px;
}
.van-coupon-item__head h2 {
  color: #f44;
  font-size: 24px;
}
.van-coupon-item__head h2 span {
  font-size: 50%;
}
.van-coupon-item__body {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  position: relative;
  border-radius: 0 4px 4px 0;
}
.van-coupon-item__body h2 {
  font-size: 16px;
}
.van-coupon-item__corner {
  top: 16px;
  right: 15px;
  position: absolute;
}
.van-coupon-item__corner .van-icon {
  border-color: #f44;
  background-color: #f44;
}
.van-coupon-item__reason {
  padding: 7px 15px;
  border-top: 1px dashed #ebedf0;
  background-color: #fafafa;
}
.van-coupon-item--disabled:active {
  background-color: #fff;
}
.van-coupon-item--disabled .van-coupon-item__content {
  height: 90px;
}
.van-coupon-item--disabled h2,
.van-coupon-item--disabled p,
.van-coupon-item--disabled span {
  color: #969799;
}

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



#block img{
    width: 100%;
  }
  #block {
    color:#fff;
    font-size: 0.6rem;
    text-align: center;
    line-height: 3rem;
    width:3rem;
    height:3rem;
    position: fixed;
    right: 2%;
    bottom: 13%;
    border-radius: 50%;
    z-index: 500;
  }
</style>

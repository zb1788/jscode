<template>
  <div class="item_detail">
    <van-image :src="banner"/>
    <!-- <van-image :src="banner1"/> -->
    <!-- <van-cell-group class="item_cell_group" v-if="goods">
      <van-cell class="item_info">
        <div>
          <span class="item_price">￥{{goods.jiage}}元<van-tag round type="warning">首单体验价</van-tag></span>
          <span class="item_market_price">价格500元</span>
        </div>
        <div class="item-title">
          {{goods.name}}
        </div>
      </van-cell>
    </van-cell-group> -->

  <!-- <div class="item_cell_group">
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
  </div> -->

    <div class="item_desc">
      <!-- <div class="item_desc_title">商品详情</div> -->
      <div class="item_desc_wrap" v-if="goods.content" v-html="goods.content"></div>
      <div class="item_desc_wrap" v-else style="text-align: center;">
        <p>无详情</p>
      </div>
    </div>

    <van-goods-action>      
      <van-goods-action-button type="danger" @click="skuClick" text="领取激活码"/>
    </van-goods-action>

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
        <div class="van-cell van-field">
          <div class="van-cell__title van-field__label">
            <span>上传截图</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <input type="file" name="file" @change="checkImage();"/>                 
            </div>
          </div>
        </div>        
        
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
  </div>
</template>

<script>

import { addOrderApi,goodDetail, cartGoodsCount, collectAddOrDelete, cartAdd, cartFastAdd } from '@/api/api';
import { Tag,image,Toast,Sku, Swipe, SwipeItem, GoodsAction, GoodsActionButton, GoodsActionIcon, Popup,Row,Col } from 'vant';
import { setLocalStorage,getLocalStorage } from '@/utils/local-storage';
import popupProps from './popup-props';
import _ from 'lodash';
import axios from 'axios'
export default {
  props: {
    itemId: [String, Number],
    num: [String, Number]
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
      useOrderObj:{
        truename:'',
        phone:'',
        shenfezhenghao:'',
        screenpic:''
      },
      goodsData:{}
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
      
      let self = this;

      let obj = {};
      obj.product_id = this.itemId;
      obj.product_name = this.goods.name;
      obj.member_id = getLocalStorage('userid').userid;
      obj.nums = 1;
      obj.amount = this.goods.jiage;
      obj.action = 'insert';
      let res = await addOrderApi(obj);
      console.log(res);
      // console.log(res.code);
      // console.log(res.data);
      // console.log(res.data.id);
      if(res.code == 1){
        let obj1 ={};
        obj1.order_id = res.data.id;
        obj1.purchaser_name = this.useOrderObj.truename;
        obj1.purchaser_cart_no = this.useOrderObj.shenfezhenghao;
        obj1.purchaser_mobile = this.useOrderObj.phone;
        obj1.pic_url = this.useOrderObj.screenpic;
        obj1.action = 'update_purchaser';
        addOrderApi(obj1).then(function(res){
          console.log(res);
          self.showKefu = false;
          self.$router.push('/msg/userorder');  
        })
        // let res = await addOrderApi(obj1);
        // console.log(res);
        // if(res.code == 1){
        //   this.showKefu = false;
        //   this.$router.push('/msg/userorder');  
        // }else{
        //   this.$toast.fail(res.msg);
        // }
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
         url: 'https://www.hnumg.top/v1.0/message/upload?ran=' + Math.random(),
         data: formData,
         method: 'post',
         headers: { 
          'Content-Type': 'multipart/form-data'
         }
      }
      axios(options).then((res) => {        
        this.useOrderObj.screenpic = res.data;
      }) // 发送请求
    },
    async skuClick() {
      //this.showSku = true;
      if(this.isLogin){
        //this.showKefu = true;
        this.$router.push('/msg/buy/'+this.num);
      }else{
        //退出登录
        this.$router.push('/login/');
      }

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

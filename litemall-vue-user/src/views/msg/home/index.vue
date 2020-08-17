<template>
<div>
  <div class="tab_home" style="min-height:90%;">

    <van-image
       style="height:230px" 
      width="100%"
      :src="lunbo"
    />

    <div class="itemlist">
        <div @click="goduihuan" style="width:48%;height:8vh;line-height:8vh;background:rgb(214, 209, 209);margin-right:1rem;">兑换服务</div>
        <div @click="goshiyong" style="width:48%;height:8vh;line-height:8vh;background:rgb(214, 209, 209);">使用服务</div>        
    </div>
    <div class="itemlist">
        <div @click="goDetail" style="width:48%;height:8vh;line-height:8vh;background:rgb(214, 209, 209);">服务详情</div>
    </div>
  </div>
  <div style="text-align: center;color:red;font-size:1.5rem;font-weight: bold;">官方热线：0371-63217120</div>
</div>  
</template>

<script>
import { addOrderApi,getHome, goodsCategory, couponReceive } from '@/api/api';
import scrollFixed from '@/mixin/scroll-fixed';
import _ from 'lodash';
import { setLocalStorage,getLocalStorage } from '@/utils/local-storage';
import {
  Button,
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
  image
} from 'vant';

export default {
  mixins: [scrollFixed],

  data() {
    const isLogin = !!localStorage.getItem('Authorization');
    return {
      isLogin,
      lunbo:require('../../../assets/images/bannernew.jpg'),
      banner:["http://yanxuan.nosdn.127.net/65091eebc48899298171c2eb6696fe27.jpg"],
      brandList:[

      ],
      isLoading: false
    };
  },

  created() {
    this.initViews();
  },

  methods: {
    goduihuan(){
        if(this.isLogin){
            this.$router.push('/msg/submit');
        }else{
            this.$router.push('/login');
        }        
    },
    goshiyong(){
        if(this.isLogin){
            this.$router.push('/msg/userorder');
        }else{
            this.$router.push('/login');
        }                    
    },
    async duihuan(num){
      let path = '';
      console.log(this.isLogin);
      if(this.isLogin){        
        path = `/msg/buy/${num}`;                
      }else{        
        path = '/login/';
      }            
      this.$router.push(path);
    },
    goDetail() {
        if(this.isLogin){
            let path = `/msg/detail/16`;
            this.$router.push(path);
        }else{
            this.$router.push('/login');
        }            
    },
    goBrand(id) {
      let path = `#/msg/detail/${id}`;
      return path;
      //this.$router.push(path);      
    },
    goTopic(id) {
      return `#/items/topic/${id}`;
    },    

    async initViews() {
      let obj = {};
      obj.per_page = 999;
      obj.page = 1;
      obj.type = 4;
      obj.action = 'query_product_page';
      let res = await getHome(obj)
      console.log(res)
      if(res.code == 1){
        this.brandList = [];
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
          this.brandList.push(obj);
        }

      }else{
        Toast.fail("获取首页数据失败");
      }
      
    }
  },

  components: {    
    [Button.name]: Button,
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
    [GridItem.name]: GridItem
  }
};
</script>


<style lang="scss" scoped>
.pink{
  color:#F77565;
}
.gray{
  color:#848484;
}
.red {
  color: #F24D49;
}
.buttoninfo{
  padding:0 2rem;
}
.itemlist{
    display:flex;text-align:center;margin:0.5rem 1rem;font-size:20px;color: #5f5454;font-weight: bold;
}
p{
  margin-block-start: 0;
  margin-block-end: 0;
}
div.card{
  text-align:center;
  font-size:2rem;
  background-color:#fafafa;
  margin-top:1rem;
  padding:1rem 0.5rem;
  color:#848484;

}

div.info{
  border-top:2px solid #848484;
  border-bottom:2px solid #848484;
  padding: 1rem;
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
</style>

<template>
  <div class="order_list">
        <van-list v-model="loading"
                  :finished="finished"
                  :immediate-check="false"
                  finished-text="没有更多了"
                  @load="getOrderList">
          <van-panel v-for="(el, i) in orderList"
                     :key="i"
                     :title="'订单编号: ' + el.weiyidingdanhao"
                     :status="el.name"
                     >
            <van-card
                      :title="el.chanpinname"
                      :num="el.shuliang"
                      :thumb="el.pic">
              <!-- <div slot="desc">
                <div class="desc">
                  <van-tag plain
                           style="margin-right:6px;"
                           v-for="(spec, index) in goods.specifications"
                           :key="index">
                    {{spec}}
                  </van-tag>
                </div>
              </div> -->
            </van-card>
            <div class="total">兑换码：{{el.activity_code}}</div>

            <div slot="footer"
                 class="footer_btn">
              <!-- <van-button size="small"
                          v-if="el.shiyongcishu < el.cishu"
                          @click.stop="userOrder(el)">立即使用</van-button> -->
              <!-- <van-button size="small"
                          v-if="el.handleOption.pay"
                          type="danger"
                          @click.stop="toPay(el.id)">去支付</van-button>
              <van-button size="small"
                          v-if="el.handleOption.refund"
                          type="danger"
                          @click.stop="refundOrder(el.id)">退款</van-button>
              <van-button size="small"
                          v-if="el.handleOption.confirm"
                          type="danger"
                          @click.stop="confirmOrder(el.id)">确认收货</van-button>
              <van-button size="small"
                          v-if="el.handleOption.delete"
                          @click.stop="delOrder(el.id)">删除订单</van-button>
              <van-button size="small"
                          v-if="el.handleOption.comment"
                          @click.stop="commentOrder(el.id)">去评价</van-button> -->
            </div>

          </van-panel>

        </van-list>


        

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
import { submitUseApi,orderListApi, orderDelete, orderConfirm, orderCancel, orderRefund } from '@/api/api';
import _ from 'lodash';
import { Popup, Tab, Tabs, Panel, Card, List, Tag ,  Row,Col,} from 'vant';
import { setLocalStorage,getLocalStorage } from '@/utils/local-storage';
export default {
  name: 'order-list',

  props: {
    // active: {
    //   type: [String, Number],
    //   default: 0
    // }
  },
  created() {
    this.init();
  },
  data() {
    return {
      //activeIndex: Number(this.active),
      tabTitles: ['全部', '待付款', '待发货', '待收货', '待评价'],
      orderList: [],
      page: 0,
      limit: 10,
      total: '',
      loading: false,
      finished: false,
      showKefu: false,
      useOrderObj:{
        truename:'',
        phone:'',
        shenfezhenghao:''
      },
      nowel:{},
    };
  },

  methods: {
    init() {
      this.page = 0;
      this.orderList = [];
      this.getOrderList();
    },
    async getOrderList() {
      this.page++;
      let obj = {};
      obj.member_id = getLocalStorage('userid').userid;
      obj.page = this.page;
      obj.per_page = this.limit;
      obj.action = 'query_order_page';
      let res = await orderListApi(obj);
      let self = this;
      if(res.code == 1){
        let arr = [];
        for(let item of res.data){
          
          let o = {};
          o.id = item.id;
          o.chanpinid = item.chanpinid;
          o.chanpinname = item.chanpinname;
          o.yonghuid = item.yonghuid;
          o.shuliang = item.shuliang;
          o.cishu = item.cishu;
          o.liushuihao = item.liushuihao;
          o.jine = item.jine;
          o.xiadanshijian = item.xiadanshijian;
          o.zhifushijian = item.zhifushijian;
          o.zhifustate = item.zhifustate;
          o.name = item.name;
          o.shenfezhenghao = item.shenfezhenghao;
          o.phone = item.phone;
          o.weiyidingdanhao = item.weiyidingdanhao;
          o.pic = item.pic;
          o.shiyongcishu = item.shiyongcishu;
          o.activity_code = item.activity_code;
          
          arr.push(o);
        }
        self.orderList = arr;
        this.total = res.total;
        this.loading = false;        
        if (this.orderList.length >= 30||this.orderList.length<=this.total||this.total == 0) {
            this.finished = true;
        }
      }else{

      }

      // return false;
      // for(let i=0;i<10;i++){
      //     let obj = {};
      //     obj.orderSn = i+'订单编号';
      //     obj.orderStatusText = '订单描述';
      //     obj.id = i;
      //     let goodsList = [{'goodsName':'aa'+i,'number':i,'picUrl':'http://yanxuan.nosdn.127.net/203cb83d93606865e3ddde57b69b9e9a.png'}];
      //     obj.goodsList = goodsList;
      //     obj.actualPrice = i;
      //     obj.handleOption = {'handleOption':{'cancel':true}}
      //     this.orderList.push(obj);          
      // }
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
      console.log(this.useOrderObj);
      console.log(this.nowel);
      let obj ={};
      obj.order_id = this.nowel.id
      obj.member_id = this.nowel.yonghuid;
      obj.use_name = this.useOrderObj.truename;
      obj.use_card_no = this.useOrderObj.shenfezhenghao;
      obj.use_phone = this.useOrderObj.phone;
      obj.use_times = 1;
      obj.action = 'use_equity';
      let res = await submitUseApi(obj);
      console.log(res);
      if(res.code == 1){
        this.init();
        this.showKefu = false;
      }else{
        this.$toast.fail(res.msg);
      }
    },
    userOrder(el){      
      this.nowel = el;
      this.useOrderObj.truename = '';
      this.useOrderObj.shenfezhenghao = '';
      this.useOrderObj.phone = '';
      this.showKefu = true;
    },
    delOrder(id) {
      let that = this;
      this.$dialog
        .confirm({ message: '确定要删除该订单吗?' })
        .then(() => {
          orderDelete({ orderId: id }).then(() => {
            this.init();
            this.$toast('已删除订单');
          });
        })
        .catch(() => {});
    },
    cancelOrder(id) {
      this.$dialog
        .confirm({ message: '确定要取消该订单吗?' })
        .then(() => {
          orderCancel({ orderId: id }).then(() => {
            this.init();
            this.$toast('已取消该订单');
          });
        })
        .catch(() => {});
    },
    refundOrder(id) {
      this.$dialog
        .confirm({ message: '确定要申请退款吗?' })
        .then(() => {
          orderRefund({ orderId: id }).then(() => {
            this.init();
            this.$toast('已申请订单退款');
          });
        })
        .catch(() => {});
    },    
    confirmOrder(id) {
      this.$dialog
        .confirm({
          message: '请确认收到货物, 确认收货后无法撤销!'
        })
        .then(() => {
          orderConfirm({ orderId: id }).then(() => {
            this.init();
            this.$toast('已确认收货');
          });
        })
        .catch(() => {});
    },
    commentOrder(id) {},
    toPay(id) {
      this.$router.push({ name: 'payment', params: { orderId: id } });
    },
    handleTabClick() {
      this.page = 0;
      this.orderList = [];
      this.getOrderList();
    },
    toOrderDetail(id) {
      this.$router.push({
        path: '/order/order-detail',
        query: { orderId: id }
      });
    }
  },
  components: {
        [Row.name]: Row,
    [Col.name]: Col,
    [Popup.name]: Popup,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Panel.name]: Panel,
    [Card.name]: Card,
    [List.name]: List,
    [Tag.name]: Tag
  }
};
</script>

<style lang="scss" scoped>
.order_list {
  .van-panel {
    margin-top: 20px;
  }

  .van-card {
    background-color: #fff;
  }

  .total {
    text-align: right;
    padding: 10px;
  }

  .footer_btn {
    text-align: right;
    .van-button {
      margin-left: 10px;
    }
  }
}
</style>

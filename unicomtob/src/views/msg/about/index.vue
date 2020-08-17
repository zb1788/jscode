<template>
  <div>
      <h2 style="text-align:center;color:#4B8F80;">兑换码：{{activeCode}}</h2>
      <van-divider :style="{ color: '#D84035', borderColor: '#D84035', padding: '0 0',margin:'0 0','border-width':'0.5px' }"/>
      <p style="text-align:center;font-weight: bold;font-size:1rem;color:#737373;">请使用客户手机扫描下方二维码</p>
      <p style="text-align:center;font-weight: bold;font-size:1rem;color:#737373;">关注“河南医联集团”公众号兑换服务</p>
      <div style="text-align:center;">
      <van-image
      width="60%"      
      :src="aboutUrl"
      />
      </div>
    <!-- <van-cell-group>
      <van-cell title="联系我们" @click="showKefu = true" isLink></van-cell>
      <van-cell title="关于我们" @click="showAbout = true"  isLink/>
    </van-cell-group>
    <van-popup v-model="showKefu">
      <van-cell-group>
        <van-cell title="项目名称" value="litemall" />
        <van-cell title="项目地址" value="Github"  url="https://github.com/linlinjava/litemall"/>
        <van-cell title="项目地址" value="Gitee"  url="https://gitee.com/linlinjava/litemall"/>
        <van-cell title="联系电话" value="021-xxxx-xxxx" />
        <van-cell title="联系QQ" value="738696120" />
        <van-cell title="当前版本" value="V1.0" />
        <van-cell title="开源协议" value="MIT" />
      </van-cell-group>
    </van-popup>
    <van-popup v-model="showAbout" :style="{width:'90%',height: '30%' }">
      <van-image
      width="100%"
      :src="aboutUrl"
    />
    </van-popup>     -->
  </div>
</template>

<script>
import { addOrderApi } from '@/api/api';
import { Divider,Image,Popup, Cell, CellGroup } from 'vant';

export default {
  props: {
    itemId: [String, Number]
  },
  data() {
    return {
      showKefu: false,
      showAbout: false,
      aboutUrl: require('../../../assets/images/gongzhonghao.jpg'),
      activeCode:''
    };
  },
  created() {
    this.initData();
  },
  methods:{
    async initData(){
      let obj = {};
      obj.order_id = this.itemId;
      obj.action = 'query_order';
      let res = await addOrderApi(obj);
      if(res.code == 1 ){
        this.activeCode = res.data.activity_code;
      }
    }
  },

  components: {
    [Image.name]: Image,
    [Popup.name]: Popup,
    [Cell.name]: Cell, 
    [CellGroup.name]: CellGroup,
    [Divider.name]:Divider
  }
};
</script>
<style scoped lang="scss">
  .van-popup {
    width: 80%;
    padding: 20px;
    box-sizing: border-box;

  }
</style>
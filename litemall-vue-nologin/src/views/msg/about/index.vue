<template>
  <div>
      <van-image
      width="100%"
      :src="aboutUrl"
    />
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
import { Image,Popup, Cell, CellGroup } from 'vant';

export default {
  data() {
    return {
      showKefu: false,
      showAbout: false,
      aboutUrl: require('../../../assets/images/about.jpg')
    };
  },

  components: {
    [Image.name]: Image,
    [Popup.name]: Popup,
    [Cell.name]: Cell, 
    [CellGroup.name]: CellGroup    
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
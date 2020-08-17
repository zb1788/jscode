<template>
  <div>
    <van-image
      width="100%"
      :src="aboutUrl"
    />
  </div>
</template>

<script>
import { Image,Popup, Cell, CellGroup } from 'vant';

export default {
  data() {
    return {
      aboutUrl: require('../../assets/images/listhospital.jpg')
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

<style>
  .van-popup {
    width: 80%;
    padding: 20px;
    box-sizing: border-box;

  }
</style>
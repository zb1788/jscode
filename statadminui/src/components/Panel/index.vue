<!--
 * @Author: your name
 * @Date: 2020-04-28 19:05:39
 * @LastEditTime: 2020-04-30 11:02:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\src\components\Panel\index.vue
 -->
<template>
  <div class="vcom-panel">
    <div v-show="$scopedSlots.buttons" class="vcom-panel-buttons">
      <slot name="buttons" />
    </div>
    <div v-show="$scopedSlots.default"  class="vcom-panel-container">
      <slot />
    </div>
    <div v-show="showDetail" class="vcom-panel-detail">
      <slot name="detail" />
    </div>
    <div v-show="$scopedSlots.footer" class="vcom-panel-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'vcom-panel',

  props: {
    showDetail: {
      type: Boolean,
      default: () => false
    }
  }
};
</script>

<style scoped lang="scss">
$padding-width: 18px;
.vcom-panel{
  box-sizing: border-box;
  display: block;
  background: #fff;
  position: relative;
  &+&{
    margin-top: 1px;
  }

  &:last-child{
    margin: 15px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .15);
  }

  &-buttons{
    float: right;
    margin: $padding-width;
  }

  &-container{
    box-sizing: border-box;
    padding: $padding-width;
  }

  &-detail{
    box-sizing: border-box;
    padding: $padding-width;
    padding-top:0;
  }
  &-footer{
    box-sizing: border-box;
    padding: $padding-width;
    padding-top: 4px;
    background:#f4f4f4;
  }
}
</style>

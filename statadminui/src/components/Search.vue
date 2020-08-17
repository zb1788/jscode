<!--
 * @Author: your name
 * @Date: 2020-04-28 19:05:39
 * @LastEditTime: 2020-05-06 17:28:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\src\components\Search.vue
 -->
<template>
  <div>
    <yj-form :inline="true">
      <slot></slot>
      <hr>
      <slot name="hidden"></slot>
    </yj-form>
  </div>
</template>

<script>
export default {
  props: {
    showMore: {
      type: Boolean,
      default: () => false
    }
  }
};
</script>

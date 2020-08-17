<!--
 * @Author: your name
 * @Date: 2020-04-28 19:05:39
 * @LastEditTime: 2020-05-06 17:24:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\src\components\OperationPanel\index.vue
 -->
<template>
  <div>
    <label>操作：</label>
    <vcom-button
      size="small"
      plain
      v-for="(item, i) in list"
      :key="`operation-${i}`"
      :disabled="item.disabled"
      @click="handleItemClick(item)"
    >{{ item.label }}</vcom-button>
    <yj-popover
      v-if="listMore.length"
      ref="popover1"
      :tabindex='900'
      popper-class='tab-index'
      placement="bottom-start"
      width="150"
      trigger="hover">
      <vcom-button slot="reference" size="small" plain type="primary">
        更多...
      </vcom-button>
      <div>
        <vcom-button
          size="small"
          plain
          ghost
          :disabled="item.disabled"
          style="display: block"
          v-for="(item, i) in listMore"
          :key="`operation-more-${i}`"
          @click="handleItemClick(item)"
        >{{ item.label }}</vcom-button>
      </div>
    </yj-popover>
  </div>
</template>

<script>
export default {
  name: 'vcom-operation-panel',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    listMore: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    handleItemClick (item) {
      item.onClick && item.onClick(item);
      this.$emit('item-click', item);
    }
  }
};
</script>

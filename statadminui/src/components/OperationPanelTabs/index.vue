<!--
 * @Author: your name
 * @Date: 2020-04-28 19:05:39
 * @LastEditTime: 2020-04-29 15:48:31
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \base\src\components\OperationPanelTabs\index.vue
 -->
<template>
  <vcom-tabs
    class="vcom-operation-panel-tabs"
    theme="card"
    :close-able="true"
    :data="data"
    :active-tab-id="activeTabId"
    @tab-click="(tab) => $emit('update:activeTabId', tab.id)"
    @close="handleCloseTab"
  />
</template>

<script>

// import { forEach } from '../../utils/tree'

export default {
  props: {
    activeTabId: {
      type: String,
      default: () => ''
    },
    data: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    handleCloseTab (tab) {
      for (let i = 0; i < this.data.length; i++) {
        const item = this.data[i];

        if (item && item.id === tab.id) {
          const siblingItem = this.data[i - 1] || this.activeOperationTabId[i + 1];

          this.data.splice(i, 1);
          this.$emit('update:data', this.data);
          if (siblingItem && siblingItem.path) {
            this.$emit('update:activeTabId', siblingItem.id);

            const { route } = this.$router.resolve({
                path: item.path
              }) || {},

              { matched } = route || {};
            (matched || [])
              .forEach(({ path, meta, instances: { default: component } = {} }) => {
                if (path === item.path && component) {
                  // 清除组件缓存
                  try {
                    component.$vnode.parent.componentInstance.cache[route.path] = null;
                  } catch (e) {}
                }
              });
          }
          return;
        }
      }
    }
  },

  watch: {
    activeTabId: {
      handler () {
        console.log('this.activeTabId', this.activeTabId);
        const item = (this.data || [])
          .find(item => item.id === this.activeTabId);
        console.log('item', item);
        if (item) {
          item && item.path &&
          this.$router.push({ path: item.path, query: item.query }).catch(err => { return err; });
        }
      },
      immediate: true
    }
  }
};
</script>

<style>

</style>

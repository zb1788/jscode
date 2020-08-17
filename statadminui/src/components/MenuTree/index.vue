<!--
 * @Author: your name
 * @Date: 2020-04-28 19:05:39
 * @LastEditTime: 2020-05-06 17:19:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\src\components\MenuTree\index.vue
 -->
<template>
  <yj-tree
    :data="menuTree"
    class="roleMenuList"
    show-checkbox
    ref="tree"
    node-key="moduleId"
    empty-text=""
    :default-checked-keys="value"
    :disabled="disabled"
    :props="{
      children: 'children',
      label: 'moduleName',
      id: 'moduleId'
    }"
    @check-change="handleChange"
  >
  </yj-tree>
</template>

<script>
import { getMenuList } from '../../api/systerm';
import { arrayToTree } from '../../utils/tree';
import { mergeObjectArr } from '../../utils/array';

export default {
  name: 'vcom-menu-tree',

  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },

  data () {
    return {
      menuTree: []
    };
  },

  async created () {
    let { data } = await getMenuList({ isUseable: 1 });
    if (this.disabled) {
      data = mergeObjectArr(data, { disabled: this.disabled });
    }

    this.menuTree = arrayToTree(
      data || [],
      { id: 'moduleId', parentId: 'parentId' },
      '00'
    ) || [];
  },

  methods: {
    handleChange (data, checked, indeterminate) {
      this.$emit('input', this.$refs.tree.getCheckedKeys());
    }
  },

  watch: {
    value: {
      handler () {
        this.$refs.tree.setCheckedKeys(this.value);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
.el-tree{
  display: inline-block;
}
 .roleMenuList .el-tree__empty-block{
    width: 210px;
   letter-spacing:5px
  }
</style>

<template>
  <vcom-panel>
    <vcom-table
      :data="formData"
      :columns="columns"
    >
    <template slot="header">
      <span>如用户中心为LVS双机需要分别登录两台用户中心操作才能保证全部生效</span>
    </template>
    </vcom-table>
    <div class="sms-editable" v-if="isShowItem">
      <vcom-button type="primary" @click="handleEdit()">修改</vcom-button>
    </div>
    <div class="sms-editable" v-else>
      <vcom-button type="primary" @click="handleSave()">保存</vcom-button>
      <vcom-button type="primary" @click="handleBack">返回</vcom-button>
    </div>
  </vcom-panel>
</template>

<script type="text/jsx">
export default {
  data () {
    return {
      isShowItem: true,
      formData: [
        { confName: '电子学生证注册',
          value: '1',
          desc: '0：不允许注册 1：允许注册'
        },
        { confName: '平安通注册',
          value: '1',
          desc: '0：不允许注册 1：允许注册'
        },
        { confName: '人人通注册',
          value: '0',
          desc: '0：不允许注册 1：允许注册'
        },
        { confName: '优教同步学习卡注册',
          value: '1',
          desc: '0：不允许注册 1：允许注册'
        }
      ],
      columns: [
        { prop: 'confName', label: '配置项' },
        { prop: 'value',
          label: '参数值',
          render: (h, { row }) => {
            if (row.__edit) {
              return this.renderFormItem(row, 'value');
            }
            return row['value'];
          }
        },
        { prop: 'desc', label: '描述' }
      ]
    };
  },
  methods: {
    // 校验输入框
    renderFormItem (row, field, params = {}) {
      return <vcom-form
        ref={field}
        id={field}
        v-model={row}
        items={[
          { field, required: true, ...params }
        ]}
      ></vcom-form>;
    },
    // 修改
    handleEdit () {
      this.formData.map(item => this.$set(item, '__edit', true));
      this.isShowItem = false;
    },
    handleBack () {
      this.formData.map(item => {
        if (item.__edit) {
          item.__edit = false;
        }
      });
      this.isShowItem = true;
    },
    // 保存
    handleSave () {

    }
  }
};
</script>

<style lang="scss" scoped>
.sms-editable{
  margin: 10px;
  text-align: center;
}
</style>

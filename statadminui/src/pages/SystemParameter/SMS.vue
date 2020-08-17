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

<script>
export default {
  data () {
    return {
      isShowItem: true,
      formData: [
        { confName: 'vsms_platUser',
          field: 'sxt',
          desc: '威科姆短信平台--用户名'
        },
        { confName: 'vsms_platPwd',
          field: 'sxt',
          desc: '威科姆短信平台--密码'
        }
      ],
      columns: [
        { prop: 'confName', label: '配置项' },
        { prop: 'field',
          label: '参数值',
          render: (h, { row }) => {
            if (row.__edit) {
              return this.renderFormItem(row, 'field')
            }
            return row['field']
          } },
        { prop: 'desc', label: '描述' }
      ]
    }
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
      ></vcom-form>
    },
    // 修改按钮
    handleEdit () {
      this.formData.map(item => this.$set(item, '__edit', true))
      this.isShowItem = false
    },
    handleBack () {
      this.formData.map(item => {
        if (item.__edit) {
          item.__edit = false
        }
      })
      this.isShowItem = true
    },
    // 保存
    handleSave () {

    }
  }
}
</script>

<style lang="scss" scoped>
.sms-editable{
  margin: 10px;
  text-align: center;
}
</style>

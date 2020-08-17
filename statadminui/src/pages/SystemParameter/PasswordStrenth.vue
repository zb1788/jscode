<template>
  <vcom-panel>
    <vcom-table
      title="如用户中心为LVS双机需要分别登录两台用户中心操作才能保证全部生效"
      :data="data"
      :columns="columns"
    >
    </vcom-table>
    <div class="notice">
      <div class="notice-content">
        <p>1级:8到16位字母“A-Za-z”、数字“0-9”和下划线“_”，必须包含字母和数字，可以包含下划线，也可以不包含下划线</p>
        <p>2级:8到16位字母“A-Za-z”、数字“0-9”和下划线“_”，必须包含大写字母、小写字母和数字，可以包含下划线，也可以不包含下划线</p>
        <p>3级:8到16位字母“A-Za-z”、数字“0-9”和下划线“_”，必须包含大写字母、小写字母、数字和下划线</p>
      </div>
      <div class="notice-btn"><vcom-button type="primary" @click="save">修改</vcom-button></div>
    </div>
  </vcom-panel>
</template>

<script type="text/jsx">
import form from '../../common/mixins/form';
import { PwdPowerLevel, PwdSimpleForceModify, PwdPowerLevelOrPwdSimpleForceModify } from '../../api/config';
export default {
  mixins: [form],
  data () {
    return {
      formItems: [
        {
          type: 'select',
          field: 'parameter',
          configCode: 'PWD_SIMPLE_FORCE_MODIFY'
        }
      ],
      formLevel: [
        {
          type: 'select',
          field: 'parameter',
          configCode: 'PWD_POWER_LEVEL'
        }
      ],
      data: [
        { confItem: '简单密码强制修改',
          parameter: '',
          simply: 0
        },
        { confItem: '密码强度等级',
          parameter: '',
          simply: 1
        }
      ],
      columns: [
        {
          prop: 'confItem',
          label: '配置项'
        },
        {
          prop: 'parameter',
          label: '参数值',
          render: (h, { row }) => {
            return <vcom-form
              // v-model={row}
              value={row}
              items={row.simply === 0 ? this.formItems : this.formLevel}
            />;
          }
        }
      ]
    };
  },
  methods: {
    // 获取密码强度等级
    async PwdPowerLevel () {
      const res = await PwdPowerLevel();
      this.data[1].parameter = res.data.cfgPlatValue;
    },
    // 简单密码强制修改
    async PwdSimpleForceModify () {
      const res = await PwdSimpleForceModify();
      this.data[0].parameter = res.data;
    },
    save () {
      this.PwdPowerLevelOrPwdSimpleForceModify();
    },
    // 获取密码强度等级
    async PwdPowerLevelOrPwdSimpleForceModify () {
      let PwdPowerLevelValue = this.data[1].parameter,
        pwdSimpleForceModifyValue = this.data[0].parameter;
      const res = await PwdPowerLevelOrPwdSimpleForceModify({ PwdPowerLevelValue, pwdSimpleForceModifyValue });
      if (res.subCode === '200') {
        this.$message.success(res.subMsg);
        this.PwdPowerLevel();
        this.PwdSimpleForceModify();
      } else {
        this.$message.error(res.subMsg);
      }
    }
  },
  created () {
    this.loadFormItemsOptions(this.formItems);
    this.loadFormItemsOptions(this.formLevel);
    this.PwdPowerLevel();
    this.PwdSimpleForceModify();
  }
};
</script>

<style lang="scss" scoped>
.notice{

  .notice-content{
    background-color: #F7F7F7;
    color: #666;
    font-size: 12px;
    line-height: 20px;
    padding: 20px;
    margin-top: 10px;
  }
  .notice-btn{
    text-align: center;
  }
}
</style>

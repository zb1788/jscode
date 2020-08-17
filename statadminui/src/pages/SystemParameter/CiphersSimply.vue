<!--
 * @Author: your name
 * @Date: 2020-04-29 14:09:35
 * @LastEditTime: 2020-04-30 10:36:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\src\pages\SystemParameter\CiphersSimply.vue
 -->
<template>
  <div>
    <div class="ciphersSimply-add"><vcom-button type="primary" @click="handleAdd">增加</vcom-button></div>
  <vcom-panel>
    <vcom-table
      :data="data"
      :columns="columns"
    >
      <template slot="header">
        <span>如用户中心为LVS双机需要分别登录两台用户中心操作才能保证全部生效</span>
      </template>
    </vcom-table>
  </vcom-panel>
  </div>
</template>

<script type="text/jsx">
import VcomPanel from '../../components/Panel/index';
export default {
  components: {
    VcomPanel
  },
  data () {
    return {
      data: [
        { ciphers: '123456',
          ciphersMd5: 'e10adc3949ba59abbe56e057f20f883e'
        }
      ],
      columns: [
        { prop: 'ciphers', label: '简单密码' },
        { prop: 'ciphersMd5', label: '简单密码MD5加密', width: 300 },
        { label: '管理',
          render: (n, { row }) => <span>
            <vcom-button type="primary" ghost={true} onClick={() => { this.delClass(row); }}>删除</vcom-button>
          </span>
        }
      ],
      form: {
        name: ''
      }
    };
  },
  methods: {
    handleAdd () {
      this.$dialog({
        width: 600,
        renderHeader: () => <span>添加</span>,
        render: (h) => {
          return <vcom-form
            ref="form"
            v-model={this.form}
            items={[
              {
                field: 'name',
                label: '简单密码',
                type: 'input',
                labelWidth: '100px',
                required: true
              }
            ]}
          ></vcom-form>;
        },
        renderFooter: (h, $dialog) => {
          const buttonsAttrs = { size: 'small', type: 'primary', ghost: false };
          return <div>
            <vcom-button {...{ props: { ...buttonsAttrs
            } }
            } onClick={() => {
              this.addClass('form', $dialog);
            }}>确定</vcom-button>
            <vcom-button size="small" onClick={$dialog.distroy}>取消</vcom-button>
          </div>;
        }
      });
    },
    async addClass (form, dialog) {
      if (dialog.$refs.form.validator()) {
        dialog.distroy();
      }
    },
    async delClass (row) {
      console.log('删除', row);
    }
  }
};
</script>

<style lang="scss" scoped>
.ciphersSimply-add{
  text-align: right;
  padding: 10px;
}
</style>

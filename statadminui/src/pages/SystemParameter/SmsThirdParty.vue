<template>
  <vcom-panel>
    <vcom-table
      :data="data"
      v-loading="loading"
      :columns="columns"
    >
    <template slot="header">
<!--        <span>如用户中心为LVS双机需要分别登录两台用户中心操作才能保证全部生效</span>-->
      </template>
    </vcom-table>
  </vcom-panel>
</template>

<script type="text/jsx">
import { baseServices } from '../../api';
import dialog from '../../common/mixins/dialog';
import { updateCfgSmsService3pCfgIsStuPhoneAsSender } from '../../api/base';

export default {
  mixins: [dialog],

  data () {
    return {
      data: [],
      loading: false,
      columns: [
        { prop: 'smsService3pName', label: '第三方名称' },
        { prop: 'status',
          label: '状态',
          render: (h, { row }) => {
            return <div>
              <span>
                {
                  {
                    '0': '不添加学生号码为发送人',
                    '1': '添加学生号码为发送人'
                  }[row.stuPhoneAsSender]
                }
              </span>
            </div>;
          }
        },
        {
          prop: 'isUseable',
          label: '是否设置学生为发送人',
          render: (h, { row }) => <span>
            <vcom-button
              type="primary"
              ghost={true}
              onClick={() => {
                this.confirmDelete({
                  title: '修改设置',
                  text: '确定修改吗?'
                }).then($dialog => {
                  this.responseMessage(
                    () => updateCfgSmsService3pCfgIsStuPhoneAsSender({
                      smsService3pId: row.smsService3pId,
                      stuPhoneAsSender: row.stuPhoneAsSender === '0' ? '1' : '0'
                    }),
                    () => {
                      $dialog.distroy();
                      this.getCfgSmsService3pCfgAll();
                    }
                  );
                });
              }}
            >
              {
                { '0': '否',
                  '1': '是'
                }[row.stuPhoneAsSender]
              }
            </vcom-button>
          </span>
        }
      ]
    };
  },
  methods: {
    async getCfgSmsService3pCfgAll () {
      this.loading = true;
      const { data } = await baseServices.getCfgSmsService3pCfgAll();
      this.loading = false;
      this.data = data;
    }
  },
  created () {
    this.getCfgSmsService3pCfgAll();
  }
};
</script>

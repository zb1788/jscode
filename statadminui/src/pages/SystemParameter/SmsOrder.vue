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
import { updateCfgSmsSendWayCfgNeedBuy } from '../../api/base';
export default {
  mixins: [dialog],
  data () {
    return {
      data: [],
      loading: false,
      columns: [
        { prop: 'smsSendWayName', label: '短信发送方式' },
        { prop: 'status',
          label: '状态',
          render: (h, { row }) => {
            return <div>
              <span>
                {
                  {
                    '0': '不需订购',
                    '1': '需订购'
                  }[row.needReceiverPhoneBuy]
                }
              </span>
            </div>;
          }
        },
        { prop: 'ordered',
          label: '是否订购',
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
                    () => updateCfgSmsSendWayCfgNeedBuy({
                      smsSendWayId: row.smsSendWayId,
                      needReceiverPhoneBuy: row.needReceiverPhoneBuy === '0' ? '1' : '0'
                    }),
                    () => {
                      $dialog.distroy();
                      this.getCfgSmsSendWayCfgAll();
                    }
                  );
                });
              }}
            >
              {
                { '0': '否',
                  '1': '是'
                }[row.needReceiverPhoneBuy]
              }
            </vcom-button>
          </span>
        }
      ]
    };
  },
  methods: {
    async getCfgSmsSendWayCfgAll () {
      this.loading = true;
      const { data } = await baseServices.getCfgSmsSendWayCfgAll();
      this.loading = false;
      this.data = data;
    }
  },
  created () {
    this.getCfgSmsSendWayCfgAll();
  }
};
</script>

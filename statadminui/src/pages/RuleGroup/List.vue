<template>
  <vcom-table
    :columns="columns"
    :data="data"
    :checked="checkedRows"
    @update:checked="handleUpdate"
    :pager.sync="pager"
    :disableRow="(row) => {
      return !Number(row.userstate)
    }"
    :showPagination="showPagination"
    @load="getStuMuti(pager.pageNo)"
    v-loading="loading"
  >
    <template slot="header">
      <vcom-button-column-visible
        class="btn-column-visible"
        :columns.sync="columns"
      />
    </template>
  </vcom-table>
</template>

<script type="text/jsx">
import VcomButtonColumnVisible from '../../components/ButtonColumnVisible';
// import VcomVerification from '../../components/VerificationCode'
import { getRuleList, delRuleById } from '@/api/rule';

export default {
  components: {
    VcomButtonColumnVisible
  },
  props: {
    form: {
      type: Object,
      default: () => { return {}; }
    },
    checkedRows: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      pager: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      showPagination: false,
      data: [
      ],
      columns: [
        { prop: 'groupName', label: '分组名称', minWidth: '150px' },
        { prop: 'groupRule', label: 'Cron表达式', minWidth: '120px' },
        { prop: 'remark1', label: '备注', minWidth: '140px' },
        { prop: '__edit',
          label: '操作',
          fixed: 'right',
          minWidth: '180px',
          disabled: true,
          render: (h, { row }) => {
            const buttonsAttrs = { size: 'small', type: 'primary', ghost: true };
            return <div>
              {[
                { label: '修改',
                  showBtn: true,
                  onClick: () => this.$emit('panel-edit', row)
                },
                { label: '删除',
                  showBtn: true,
                  onClick: () => this.completeDeleteTeacher(row)
                }
              ].map(({ label, onClick, disabled, showBtn }) => <vcom-button key={label} {...{ props: { ...buttonsAttrs
              } }
              } v-show={showBtn} disabled={disabled} onClick={onClick}>{ label }</vcom-button>)
              }
            </div>;
          }
        }
      ]
    };
  },
  methods: {
    // 处理逗号
    // handleDot (item) {
    //   let regx = /^,*|,*$/g
    //   if (item) {
    //     return item.replace(regx, '')
    //   }
    // },
    handleUpdate (checkeds = []) {
      this.$emit('update:checkedRows', checkeds);
    },
    async getStuMuti (index) {
      this.loading = true;
      this.showPagination = true;
      this.pager.pageNo = index;
      console.log({ ...this.pager, ...this.form });

      const res = await getRuleList({ ...this.pager, ...this.form });
      console.log(res);
      if (res.code === '200') {
        this.data = res.data.content;
        this.pager.total = res.data.total * 1;
      } else {
        this.$message.error(res.message);
      }
      this.loading = false;
    },
    completeDeleteTeacher (row) {
      this.$dialog({
        width: 600,
        renderHeader: () => <span>彻底删除</span>,
        render: (h) => {
          return <div>
            <span>是否要彻底删除？</span>
          </div>;
        },
        renderFooter: (h, $dialog) => {
          return <div>
            <vcom-button
              size="small"
              type="primary"
              onClick={async () => {
                let groupCode = row.groupCode;
                const res = await delRuleById(groupCode);
                if (res.code === '200') {
                  this.$message.success('彻底删除成功！');
                  this.getStuMuti(this.pager.pageNo);
                  $dialog.distroy();
                } else {
                  this.$message.error(res.message);
                }
              }}
            >确定</vcom-button>
            <vcom-button
              size="small"
              onClick={$dialog.distroy}
            >取消</vcom-button>
          </div>;
        }
      });
    }
  }
};
</script>

<style lang="scss" >
  @import "../../assets/style/theme";
.btn-column-visible{
  position: absolute;
  right: 12px;
  top: 12px;
}
.student-detail-panel{
  color: #666;
  font-size: 14px;
  font-weight: 400;
  line-height: 30px;
}
.student-detail-title{
  font-size: 16px;
  line-height: 30px;
  font-weight: bold;
  padding-top: 10px;
  @include themeify{
    color: themed('color');
  }
}
.student-detail-panel-item{
    margin-left:80px;
  }
</style>

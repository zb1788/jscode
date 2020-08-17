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
import { getRuleInfoList, deleteRuleById, changeRuleState } from '@/api/rule';

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
        { prop: 'ruleName', label: '规则名称', minWidth: '150px' },
        { prop: 'groupName', label: '分组名称', minWidth: '120px' },
        { prop: 'taskType', label: '任务类型', minWidth: '120px' },
        { prop: 'taskContent', label: '任务内容', minWidth: '120px' },
        { prop: 'maxTimes', label: '最大重试次数', minWidth: '110px' },
        { prop: 'beforeRuleName', label: '前置规则', minWidth: '120px' },
        { prop: 'remark1', label: '备注', minWidth: '140px' },
        { prop: '__edit',
          label: '操作',
          fixed: 'right',
          minWidth: '180px',
          disabled: true,
          render: (h, { row }) => {
            const buttonsAttrs = { size: 'small', type: 'primary', ghost: true };
            let baseButtons = [
                { label: '修改',
                  showBtn: true,
                  onClick: () => this.$emit('panel-edit', row)
                },
                { label: '删除',
                  showBtn: true,
                  onClick: () => this.completeDeleteTeacher(row)
                }
              ], otherButton;
            if (row.ruleState === 1) {
              otherButton = [
                { label: '禁用',
                  showBtn: true,
                  onClick: () => this.changeState(0, row)
                }
              ];
            } else {
              otherButton = [
                { label: '启用',
                  showBtn: true,
                  onClick: () => this.changeState(1, row)
                }
              ];
            }
            return <div>
              {baseButtons.concat(otherButton).map(({ label, onClick, disabled, showBtn }) => <vcom-button key={label} {...{ props: { ...buttonsAttrs
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
      try {
        const res = await getRuleInfoList({ ...this.pager, ...this.form });
        console.log(res);
        if (res.code === '200') {
          this.data = res.data.content;
          this.pager.total = res.data.total;
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        this.$message.error('网络异常');
      }
      this.loading = false;
    },
    async changeState (type, row) {
      try {
        const res = await changeRuleState(type, row.ruleCode);
        if (res.code === '200') {
          let index = this.data.findIndex(item => item.ruleCode === row.ruleCode);
          this.data[index].ruleState = type;
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {

      }
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
                let ruleCode = row.ruleCode;
                const res = await deleteRuleById(ruleCode);
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

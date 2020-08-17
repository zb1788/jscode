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
import { getColumnList, delColById, getColRuleByColId } from '@/api/canel';

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
      tab: JSON.parse(sessionStorage.getItem('tab')),
      loading: false,
      showPagination: false,
      data: [
      ],
      tableRowDetail: {},
      columns: [
        { prop: 'expand',
          type: 'expand',
          render: (h, { row }) => {
            const isDataLoaded = !!this.tableRowDetail[row.id];
            if (!isDataLoaded) {
              this.$set(this.tableRowDetail, row.id, []);
              (async () => {
                const res = await getColRuleByColId(row.id);
                this.$set(this.tableRowDetail, row.id, res.data);
              })();
            }
            const ruleInfo = this.tableRowDetail[row.id] || [];
            return <div
              class="row-detail"
            >
              <p class="row-detail-title">字段写入规则</p>
              <vcom-table
                size="small"
                data={ruleInfo || []}
                style="width: 100%"
                columns={[
                  { label: '英文标识', prop: 'ruleCode', width: 120, align: 'left' },
                  { label: '规则json', prop: 'ruleParam', width: 120, align: 'left' },
                  { label: '状态', prop: 'status', width: 100, align: 'left' },
                  { label: '创建时间', prop: 'createtime', width: 300, align: 'left' },
                  { label: '修改时间', prop: 'updatetime', align: 'left' }
                ]}
              />
            </div>;
          }
        },
        { prop: 'tabName', label: '表名称', minWidth: '150px' },
        { prop: 'colName', label: '列名称', minWidth: '150px' },
        { prop: 'colLength', label: '表长度', minWidth: '120px' },
        { prop: 'status', label: '状态', minWidth: '120px' },
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
      const res = await getColumnList({ ...this.pager, ...this.form, ...this.tab });
      if (res.code === '200') {
        let arr = [];
        res.data.content.map((item, index) => {
          arr.push({ ...item, ...{'tabName': this.tab.tabName} });
        });
        this.data = arr;
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
                let id = row.id;
                const res = await delColById(id);
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

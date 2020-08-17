<script type="text/jsx">
import { last } from '../../utils/array';

export default {
  name: 'vcom-table',

  props: {
    title: {
      type: String,
      default: () => ''
    },
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    props: {
      type: Object,
      default: () => ({ border: true })
    },

    // 选中
    checked: {
      type: Array,
      default: undefined
    },
    index: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    pager: {
      type: Object,
      default: undefined
    },
    size: {
      type: String,
      default: 'medium'
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    disableRow: {
      type: Function,
      default: () => false
    }
  },

  data () {
    return {
      disabledColumnPropsList: [],
      dataList: [],
      expandRowKeys: []
    };
  },

  computed: {
    visibleColumns () {
      return [
        ...(this.checked ? [{ type: 'selection', width: '60px' }] : []),
        ...(this.index ? [{ type: 'index', label: '序号', width: '50px' }] : ''),
        ...this.columns
          .filter(col => col && col.__show !== false)
      ];
    }
  },

  render (h, context) {
    return <div class="vcom-table">
      <div class="vcom-table-header">
        {this.$scopedSlots.header &&
        this.$scopedSlots.header()}
      </div>
      <yj-table
        ref="multipleTable"
        {...{ props: { ...this.props
        } }
        }
        data={this.data}
        onExpand-change={(row, expandRows) => {
          this.expandRowKeys = last(expandRows) ? [last(expandRows).__id] : [];
          this.$emit('expand-change', row, expandRows);
        }}
        onSelection-change={this.handleSelectionChange}
        size={this.size}
        rowClassName={({ row }) => {
          const classNames = {
            'el-table__row--disabled': this.disableRow(row)
          };

          return (Object.keys(classNames)).reduce((str, key) => {
            if (classNames[key]) {
              str += ` ${key}`;
            }

            return str;
          }, '');
        }}
        row-key="__id"
        expand-row-keys={this.expandRowKeys}
      >
        {this.renderColumns(this.visibleColumns)}
      </yj-table>
      {this.pager &&
      <yj-pagination
        onSize-change={(pageSize) => this.pagerChange({ pageNo: 1, pageSize })}
        onCurrent-change={(pageNo) => this.pagerChange({ pageNo })}
        current-page={this.pager.pageNo}
        page-sizes={[10, 20, 50, 400]}
        page-size={this.pager.pageSize}
        layout="total, sizes, prev, pager, next, jumper"
        background={true}
        total={this.pager.total}
        v-show={this.showPagination}
      />
      }
    </div>;
  },

  created () {
    this.$emit('load');
  },

  methods: {
    handleSelectionChange (checked) {
      this.$emit('update:checked', checked);
    },
    renderColumns (columns) {
      // columns.forEach(item => { item.class = 'lgwabc'; item.label = 'hehehe'; });
      return columns.map(({ render, renderHeader, children, ...columnProps }) => <yj-table-column
        key={columnProps.prop || columnProps.type || columnProps.label || Math.random().toString(16)}
        align='center'
        // label={columnProps.label}
        // prop={columnProps.prop}
        {...{ props: { ...columnProps,
          ...{
            align: this.align || columnProps.align || 'left'
          } } }}
        class= {columnProps}
        align = {this.align || columnProps.align || 'left'}
        index={(index) => {
          return (this.pager.pageNo - 1) * (this.pager.pageSize || 10) + index + 1;
        }}
        {...{
          scopedSlots: (render || renderHeader) && {
            default: (scope) => {
              return render(this.$createElement, scope);
            },
            header: renderHeader
              ? scope => renderHeader(this.$createElement, scope)
              : undefined
          }
        }}
      >
        {children && children.length > 0 &&
            this.renderColumns(children)}
      </yj-table-column>);
    },

    pagerChange (pager = {}) {
      this.$emit('update:pager', { ...this.pager, ...pager });
      this.$emit('load');
    }
  },

  watch: {
    // columns更新时table组件可能出现错乱 需要触发重绘 （element-ui table fix column error）
    columns () {
      const $table = this.$refs.multipleTable;
      if (!$table || !$table.resizeListener) { return false; }

      this.$nextTick(() => {
        $table.resizeListener();
      });
    },
    checked: {
      deep: true,
      handler () {
        (this.checked || []).forEach(checked => {
          const row = (this.data || []).find(row => row === checked);
          this.$refs.multipleTable.toggleRowSelection(row, !!row);
        });
      }
    },
    data () {
      (this.data || []).forEach(item => {
        this.$set(item, '__id', Math.random().toString(16));
      });
    }
  }
};
</script>

<style scoped lang="scss">
.vcom-table{
  &-header{
    display: inline-block;
    padding: 6px 0;
    &-title{
      display: inline-block;
      font-size: 16px;
      color: #666;
    }
  }

  .el-table{
    width: 100%;
  }
}
  .el-pagination{
    text-align: right;
    padding-top: 10px;
  }
</style>

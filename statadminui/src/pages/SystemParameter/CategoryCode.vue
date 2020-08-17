<script type="text/jsx">
import { addConfigType, getConfigTypeList, updateConfigType } from '../../api/config';

export default {
  data () {
    return {
      pager: {
        pageNo: 1,
        pageSize: 50,
        total: 0
      },
      tableData: [],
      columns: [
        { prop: 'sortCode',
          label: '分类编码',
          align: 'left',
          render: (h, { row }) => {
            if (row.__add) {
              return this.renderFormItem(row, 'sortCode');
            }

            return row['sortCode'];
          }
        },
        { prop: 'sortName',
          label: '分类名称',
          align: 'left',
          render: (h, { row }) => {
            if (row.__edit) {
              return this.renderFormItem(row, 'sortName');
            }

            return row['sortName'];
          }
        },
        { label: '操作',
          align: 'left',
          render: (h, { row, $index }) => <span>
            {row.__edit &&
            <span>
              <vcom-button
                type="primary"
                size="small"
                onClick={() => this.handleSave(row)}
              >保存</vcom-button>
              <vcom-button
                type="primary"
                size="small"
                onClick={() => this.handleCancelEdit(row, $index)}
              >取消</vcom-button>
            </span>
            }
            {!row.__edit &&
            <vcom-button
              type="primary"
              ghost={true}
              onClick={() => this.$set(row, '__edit', true)}
            >修改</vcom-button>
            }
          </span>
        }
      ]
    };
  },

  render (h, context) {
    return <vcom-panel>
      <vcom-button
        type="primary"
        onClick={() => {
          this.tableData = [
            { __edit: true, __add: true },
            ...this.tableData
          ];
        }}
      >添加</vcom-button>
      <vcom-table
        pager={this.pager}
        data={this.tableData}
        onLoad={this.loadData}
        columns={this.columns}
      />
    </vcom-panel>;
  },

  methods: {
    // 加载表格数据
    async loadData () {
      const { data } = await getConfigTypeList({ ...this.pager });
      this.tableData = data.records || [];
      this.$set(this.pager, 'pageNo', data.current);
      this.$set(this.pager, 'total', data.total);
    },

    // 保存
    async handleSave (row) {
      if (row.__add) {
        const res = await addConfigType(row);
        if (res.code === 200) {
          this.loadData();
        }
        return false;
      }

      const res = await updateConfigType(row);
      if (res.code === 200) {
        this.loadData();
      }
    },

    async handleCancelEdit (row, $index) {
      if (row.__add) {
        this.tableData.splice($index, 1);
        return false;
      }

      this.loadData();
    },

    renderFormItem (row, field, params = {}) {
      return <vcom-form
        ref={field}
        id={field}
        // v-model={row}
        value={row}
        items={[
          { field, required: true, ...params }
        ]}
      />;
    }
  }
};
</script>

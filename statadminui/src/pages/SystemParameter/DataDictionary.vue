<script type="text/jsx">
import VcomSearchPanel from '../../components/SearchPanel/index';
import { addConfig, delConfig, getConfigList, getConfigTypeList, updateConfig } from '../../api/config';
import { objectListFieldConvert } from '../../utils/array';
import { resetRedisCache } from '../../api';

import dialog from '../../common/mixins/dialog';
import pager from '../../common/mixins/pager';
import { getOssAccountDetail } from '../../api/user';

export default {
  components: { VcomSearchPanel },
  mixins: [dialog, pager],
  data () {
    return {
      resetloading: false,
      showReset: false,
      searchForm: {},
      tableData: [],
      configTypes: [],
      loading: false,
      columns: [
        { label: '序列',
          prop: 'showOrder',
          render: (h, { row }) => {
            if (row.__edit) {
              return this.renderFormItem(row, 'showOrder', { type: 'number' });
            }
            return row['showOrder'];
          }
        },
        { label: '类别',
          prop: 'sortName',
          render: (h, { row }) => {
            if (row.__edit) {
              return this.renderFormItem(
                row,
                'sortCode',
                { type: 'select',
                  filterable: true,
                  options: objectListFieldConvert(this.configTypes, { sortName: 'label', sortCode: 'value' })
                }
              );
            }

            return row.sortName || '';
          }
        },
        { label: '类别编码',
          prop: 'sortCode'
        },
        { label: '参数编码',
          prop: 'paramCode',
          render: (h, { row }) => {
            if (row.__edit) {
              return this.renderFormItem(row, 'paramCode');
            }
            return row['paramCode'];
          }
        },
        { label: '参数名称',
          prop: 'paramName',
          render: (h, { row }) => {
            if (row.__edit) {
              return this.renderFormItem(row, 'paramName');
            }
            return row['paramName'];
          }
        },
        { label: '备注',
          prop: 'remark',
          render: (h, { row }) => {
            if (row.__edit) {
              return this.renderFormItem(row, 'remark', { required: false });
            }
            return row['remark'];
          }
        }
      ]
    };
  },

  async created () {
    const { data } = await getConfigTypeList({ pageNo: 1, pageSize: 100 });
    this.configTypes = data.records || [];

    try {
      const { data: user = {} } = await getOssAccountDetail(this.$store.state.user.username),
        { roleId } = user;

      if (String(roleId).split(',').some(v => v === '1')) {
        this.showReset = true;
      }
    } catch (e) {}
  },

  methods: {
    addEmptyRow () {
      this.tableData = [
        { __edit: true,
          __add: true,
          sortCode: this.searchForm.sortCode
        },
        ...this.tableData
      ];
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
    },

    async handleSave (row, $index) {
      const unValidFields = Object.keys(this.$refs)
        .filter(key => !this.$refs[key].validator());

      if (unValidFields.length) { return; }

      const updateFunc = row.__add ? addConfig : updateConfig,
        { code, subMsg } = await updateFunc(row);

      if (code === 200) {
        this.tableData.splice($index, 1);
        this.loadData();
      } else {
        this.$message.error(subMsg);
      }
    },

    async handleDelete (row, $index) {
      this.confirmDelete({
        text: `是否删除[${row.paramName}]?`
      }).then(async ($dialog) => {
        if (row.__add) {
          this.tableData.splice($index, 1);
          $dialog.distroy();
          return false;
        }

        const res = await delConfig(row.id);
        if (res.code === 200) {
          this.loadData();
          $dialog.distroy();
        } else {
          this.$message.error(res.subMsg);
        }
      });
    },

    async loadData () {
      this.loading = true;
      let searchType = 'list';
      const { data } = await getConfigList({ ...this.searchForm, ...this.pager, searchType });
      this.loading = false;
      const addRows = this.tableData.filter(item => item && item.__add);
      this.setPager(data, this.loadData);
      this.tableData = [ ...addRows, ...data.records || [] ];
    }
  },

  render (h, context) {
    return <div>
      <vcom-search-panel
        v-model={this.searchForm}
        items={[
          { label: '参数名称', field: 'name' },
          { label: '类别',
            field: 'sortCode',
            type: 'select',
            filterable: true,
            options: objectListFieldConvert(this.configTypes, { sortName: 'label', sortCode: 'value' })
          }
        ]}
        onSearch={this.loadData}
      >
      </vcom-search-panel>
      <vcom-button
        v-loading={this.resetloading}
        v-show={false}
        type="primary"
        style="float: right; right: 40px; top: -50px"
        onClick={() => {
          this.resetloading = true;
          this.responseMessage(
            () => resetRedisCache(),
            () => {
              this.resetloading = false;
            },
            () => {
              this.resetloading = false;
            }
          );
        }}
      >重置缓存</vcom-button>
      <vcom-panel>
        <vcom-table
          data={this.tableData}
          columns={this.columns}
          pager={this.pager}
          v-loading={this.loading}
          onLoad={this.loadData}
          {...{
            on: {
              'update:pager': (pager) => (this.pager = pager)
            }
          }}
        >
        </vcom-table>
      </vcom-panel>
    </div>;
  }
};
</script>

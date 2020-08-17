<!--
  操作日志
-->
<script type="text/jsx">
import VcomSearchPanel from '../../components/SearchPanel/index';
import form from '../../common/mixins/form';
import pager from '../../common/mixins/pager';
import { getLogList } from '../../api/log.js';

export default {
  components: { VcomSearchPanel },
  mixins: [pager, form],
  data () {
    return {
      searchForm: {},
      configTypes: [],
      pickerOptionsStart: {},
      pickerOptionsEnd: {},
      searchItems: [
        {
          label: '操作类型',
          field: 'opType',
          type: 'select',
          filterable: true,
          configCode: 'log_op_type'
        },
        {
          label: '数据类型',
          field: 'opDataType',
          type: 'select',
          filterable: true,
          configCode: 'log_op_data_type'
        },
        {
          type: 'date',
          label: '开始时间',
          field: 'startOpDate',
          filterable: true,
          placeholder: '开始时间',
          valueFormat: 'yyyy-MM-dd',
          pickerOptions: {}
        },
        {
          type: 'date',
          label: '结束时间',
          field: 'endOpDate',
          filterable: true,
          placeholder: '结束时间',
          valueFormat: 'yyyy-MM-dd',
          pickerOptions: {}
        }
      ],
      loading: false,
      tableData: [],
      columns: [
        {
          label: '操作员',
          prop: 'opUserRealName'
        },
        {
          label: '操作账号',
          prop: 'opUserName'
        },
        {
          label: '数据类型',
          prop: 'opDataType'
        },
        {
          label: '操作类型',
          prop: 'opType'
        },
        {
          label: '详情',
          prop: 'opName'
        },
        {
          label: '操作时间',
          prop: 'opTime'
        }
      ]
    };
  },
  async created () {
    this.loadFormItemsOptions(this.searchItems);
  },
  watch: {
    'searchForm.startOpDate': {
      handler (val) {
        this.pickerOptionsEnd = {
          disabledDate: time => {
            if (val) {
              return time.getTime() < new Date(val).getTime() - 86400000;
            }
          }
        };
        this.searchItems[3].pickerOptions = this.pickerOptionsEnd;
      }
    },
    'searchForm.endOpDate': {
      handler (val) {
        this.pickerOptionsStart = {
          disabledDate: time => {
            if (val) {
              return time.getTime() > new Date(val).getTime();
            }
          }
        };
        this.searchItems[2].pickerOptions = this.pickerOptionsStart;
      }
    }
  },
  methods: {
    // 查找name
    searchName (val) {
      let str = '',
        ary = this.searchItems.filter(item => item.field === val);
      if (this.searchForm[val]) {
        ary.map(item => {
          item.options && item.options.map(k => {
            if (Number(k.value) === Number(this.searchForm[val])) {
              str = k.label;
            }
          });
        });
      }
      return str;
    },
    async loadData () {
      this.loading = true;
      let obj = JSON.parse(JSON.stringify(this.searchForm));
      obj.opType = this.searchName('opType');
      obj.opDataType = this.searchName('opDataType');
      const res = await getLogList({ ...obj, ...this.pager });
      this.loading = false;
      if (res.subCode === '200') {
        this.setPager(res.data, this.loadData);
        this.tableData = res.data.records;
      } else {
        this.$message.error(`${res.subMsg}`);
      }
    }
  },
  render (h, content) {
    return <div>
      <vcom-search-panel
        v-model={this.searchForm}
        items={this.searchItems}
        onSearch={this.loadData}
      />
      <vcom-panel>
        <vcom-table
          data={this.tableData}
          columns={this.columns}
          pager={this.pager}
          v-loading={this.loading}
          onLoad={this.loadData}
          {
          ...{
            on: {
              'update:pager': (pager) => (this.pager = pager)
            }
          }
          }
        />
      </vcom-panel>
    </div>;
  }
};
</script>

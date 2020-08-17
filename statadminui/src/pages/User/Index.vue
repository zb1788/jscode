<template>
  <div class="home student-info">
    <!--搜索面板 begin-->
    <vcom-search-panel
      v-model="form"
      :show-detail.sync="showSearchPanelDetail"
      :items="formItems"
      :reset-func="(val) => {
        return ({ ...val, type: '1' })
      }"
      @search="getList()"
    >
    </vcom-search-panel>
    <!--搜索面板 end-->

    <!--操作面板 begin-->
    <!-- <vcom-panel>
      <VcomOperationPanel
        :list="operation.list"
        :list-more="operation.more"
        @item-click="handleOperationClick"
      />
    </vcom-panel> -->
    <!--搜索面板 end-->

    <!--表格 begin-->
    <vcom-panel :show-detail="true">
      <div>
        <vcom-operation-panel-tabs
          :active-tab-id.sync="activeOperationTabId"
          :data.sync="operationViewList"
        />
      </div>
      <template slot="detail">
        <keep-alive>
          <router-view
            v-if="$route.meta.keepAlive"
            :key="$route.path"
            ref="children"
            :form="form"
            @delTab="delTab"
            @panel-manage="(row, origin) => {
              handleOperationClick({
                 id: '12',
                 path: '/column',
                 query: row
              }, origin)
            }"
            @panel-edit="(row, origin) => {
            handleOperationClick({
              id: '18',
              path: '/table/edit',
              label: '修改',
              query: row
            }, origin)
          }"
            @goIndex="goIndex"
          />
        </keep-alive>
        <router-view
          v-if="!$route.meta.keepAlive"
          :key="$route.path"
          ref="children"
          :form="form"
          @delTab="delTab"
          @panel-manage="(row, origin) => {
            handleOperationClick({
                id: '12',
                path: '/column',
                query: row
            }, origin)
          }"
          @panel-edit="(row, origin) => {
            handleOperationClick({
              id: '18',
              path: '/table/edit',
              label: '修改',
              query: row
            }, origin)
          }"
          @goIndex="goIndex"
        />
      </template>
    </vcom-panel>
    <!--表格 begin-->

  </div>
</template>

<script type="text/jsx">
import { mapState } from 'vuex';
import VcomSearchPanel from '@/components/SearchPanel';
import VcomOperationPanel from '@/components/OperationPanel';
import VcomOperationPanelTabs from '@/components/OperationPanelTabs';
import form from '../../common/mixins/form';
import area from '../../common/mixins/area';
import opetationPanel from '../../common/mixins/opetationPanel';
import { delTabsByIdList } from '@/api/canel';
import { getSchoolByName } from '@/api/area';

export default {
  name: 'user-index',
  mixins: [form, opetationPanel, area],
  components: {
    VcomSearchPanel,
    VcomOperationPanel,
    VcomOperationPanelTabs
  },
  computed: {
    ...mapState('user', [
      'provinceCode',
      'cityCode',
      'areaCode'
    ])
  },
  data () {
    return {
      labelWidth: '80px',
      showSearchPanelDetail: false,
      checkedRows: [],
      /**
       * 操作面板 按钮
       */
      operation: {
        list: [
          { id: '7', path: '', label: '删除', disabled: true }
        ],
        more: [
        ]
      },
      operationViewList: [
        { id: '0', path: '/useractive', label: '用户激活', __closeAble: false }
      ],
      activeOperationTabId: '0',
      provinceArr: [],
      form: {
        startDate: '',
        endDate: '',
        province: '',
        city: '',
        area: '',
        // userType: '',
        activeType: 'all',
        isDel: '0',
        schoolType: ['1'],
        schoolId: ''
      },
      formItems: [
        { label: '省',
          field: 'province',
          placeholder: '全部省',
          required: false,
          type: 'select',
          options: []
        },
        { label: '市',
          field: 'city',
          placeholder: '全部市',
          required: false,
          type: 'select',
          options: [],
          onFocus: (query) => {
            if (!this.form.province) {
              return this.$message.error('请先选择省');
            }
          }
        },
        { label: '区',
          field: 'area',
          placeholder: '全部区',
          required: false,
          type: 'select',
          options: [],
          onFocus: (query) => {
            if (!this.form.city) {
              return this.$message.error('请先选择市');
            }
          }
        },
        {
          type: 'date',
          label: '激活起始时间',
          field: 'startDate',
          filterable: true,
          placeholder: '开始时间',
          valueFormat: 'yyyy-MM-dd',
          pickerOptions: {}
        },
        {
          type: 'date',
          label: '激活结束时间',
          field: 'endDate',
          filterable: true,
          placeholder: '结束时间',
          valueFormat: 'yyyy-MM-dd',
          pickerOptions: {}
        },
        { label: '激活类型',
          field: 'activeType',
          placeholder: '全部',
          required: false,
          type: 'select',
          options: [
            {
              label: '全部',
              value: 'all'
            },
            {
              label: 'pc网站',
              value: 'portal'
            },
            {
              label: '授课',
              value: 'TLS'
            },
            {
              label: '优信APP',
              value: 'uxin'
            }
          ]
        },
        { label: '是否包含销号',
          field: 'isDel',
          placeholder: '否',
          required: false,
          type: 'select',
          options: [
            {
              label: '否',
              value: '0'
            },
            {
              label: '是',
              value: '1'
            }
          ]
        },
        // { label: '用户类型',
        //   field: 'userType',
        //   required: false,
        //   type: 'select',
        //   options: [
        //     {
        //       label: '全部',
        //       value: '0'
        //     },
        //     {
        //       label: '家长',
        //       value: '1'
        //     },
        //     {
        //       label: '学生',
        //       value: '2'
        //     },
        //     {
        //       label: '教师',
        //       value: '3'
        //     }
        //   ]
        // },
        { label: '学校类型',
          field: 'schoolType',
          required: false,
          multiple: true,
          type: 'select',
          options: [
            {
              label: '正式',
              value: '1'
            },
            {
              label: '测试',
              value: '0'
            },
            {
              label: '虚拟',
              value: '2'
            }
          ]
        },
        { label: '学校',
          field: 'schoolId',
          filterable: true,
          type: 'select',
          placeholder: '请输入要查询的学校名称',
          options: [],
          remoteMethod: (query) => {
            this.__remoteSearchSchool(query);
          }
        }
      ]
    };
  },

  methods: {
    aa (item, origin) {
      console.log('====');
      console.log(item);
    },
    async __remoteSearchSchool (query) {
      console.log(query);
      let res = await getSchoolByName({schoolName: query});
      console.log(res);
      if (res.code === '200') {
        let arr = [];
        for (let item of res.data) {
          arr.push({'label': item.school, 'value': item.schId});
        }
        console.log(arr);
        this.formItems[8].options = arr;
      }
    },
    /**
     * @parans origin 是从增加成功后 修改按钮带
     */
    async handleOperationClick (item, origin) {
      console.log(item, origin);
      sessionStorage.setItem('tab', JSON.stringify(item.query));
      if (origin === 'continue' && this.operationViewList) {
        this.operationViewList.forEach((e, i) => {
          if (e.label === '增加') {
            this.operationViewList.splice(i, 1);
          }
        });
      }
      if (!item.path) {
        if (item.id === '7') {
          this.$dialog({
            width: 600,
            renderHeader: () => <span>彻底删除</span>,
            render: (h) => {
              return <div>
                <span style="color:red;font-weight: bold;">删除后表下面的所有字段也全部被删掉，确定是否要彻底删除？</span>
              </div>;
            },
            renderFooter: (h, $dialog) => {
              return <div>
                <vcom-button
                  size="small"
                  type="primary"
                  onClick={async () => {
                    let idList = [];
                    this.checkedRows.map((item) => {
                      idList.push(item.tabId);
                    });
                    const res = await delTabsByIdList(idList.join(','));
                    if (res.code === '200') {
                      this.$message.success('彻底删除成功！');
                      $dialog.distroy();
                      this.$refs.children.getStuMuti && this.$refs.children.getStuMuti(this.$refs.children.pager.pageNo);
                    } else {
                      this.$message.error(res.message);
                      $dialog.distroy();
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
      } else {
        this.operationViewList.forEach((element, i) => {
          if (element.id === item.id) {
            this.operationViewList.splice(i, 1);
            this.operationViewList.push(item);
          } else {
            if (!this.operationViewList.some(({ path, label }) => path === item.path || item.label === label)) {
              this.operationViewList.push(item);
            }
          }
        });
        this.activeOperationTabId = item.id;
        this.checkedRows = [];
      }
    },
    getList () {
      this.$refs.children.getStuMuti && this.$refs.children.getStuMuti(1);
    },
    delTab (val) {
      if (val === 'update') {
        this.operationViewList.forEach((e, i) => {
          if (e.label === '修改') {
            this.operationViewList.splice(i, 1);
          }
        });
      } else {
        this.operationViewList.forEach((e, i) => {
          if (e.label === '增加') {
            this.operationViewList.splice(i, 1);
          }
        });
      }
      this.activeOperationTabId = '0';
    },
    // 从增加页面过来
    goIndex (val, origin) {
      if (origin === 'phone') { // 从学生手机号过来
        this.form.type = '1';
      } else if (origin === 'patCard') { // 从平安通卡号过来
        this.form.type = '5';
      }
      this.form.param = val;
      this.activeOperationTabId = '0';
      this.$nextTick(() => {
        this.getList();
      });
    }
  },
  async created () {
    this.loadFormItemsOptions(this.detailItems);
    console.log(this.areaId);
    // let res = await getProvinceList({fid: this.provinceCode});
    // console.log(res);
    // let parr = [];
    // for (let item of res.data) {
    //   parr.push({'label': item.province, 'value': item.provinceCode});
    // }
    // this.provinceArr = parr;
    // this.formItems[0].options = parr;
    // if (this.provinceCode !== '') {
    //   this.form.province = this.provinceCode;
    // }
  },
  watch: {
    // 'form.province': {
    //   async handler (val) {
    //     this.formItems[1].options = [];
    //     this.formItems[2].options = [];
    //     this.form.city = '';
    //     this.form.area = '';
    //     console.log(this.form.province);
    //     if (this.form.province !== '') {
    //       let res;
    //       if (this.cityCode !== '') {
    //         res = await getCityById({fid: this.cityCode});
    //       } else {
    //         res = await getCityListByProvinceCode({fid: this.form.province});
    //       }
    //       console.log(res);
    //       let parr = [];
    //       for (let item of res.data) {
    //         parr.push({'label': item.city, 'value': item.cityCode});
    //       }
    //       this.formItems[1].options = parr;
    //       if (this.cityCode !== '') {
    //         this.form.city = this.cityCode;
    //       }
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // 'form.city': {
    //   async handler (val) {
    //     this.formItems[2].options = [];
    //     console.log(this.form.city);
    //     if (this.form.city !== '') {
    //       let res;
    //       if (this.areaCode !== '') {
    //         res = await getAreaById({fid: this.areaCode});
    //       } else {
    //         res = await getAreaListByCity({fid: this.form.city});
    //       }
    //       console.log(res);
    //       let parr = [];
    //       for (let item of res.data) {
    //         parr.push({'label': item.area, 'value': item.areaCode});
    //       }
    //       this.formItems[2].options = parr;
    //       if (this.areaCode !== '') {
    //         this.form.area = this.areaCode;
    //       }
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    checkedRows () {
      this.operation.list.map(item => {
        if (['7'].indexOf(item.id) !== -1) {
          this.$set(item, 'disabled', this.checkedRows.length < 1);
        }
      });
    },
    activeOperationTabId (val) {
      if (val === '0') {
        this.checkedRows = [];
      }
    }
  }
};
</script>

<style lang="scss">
</style>

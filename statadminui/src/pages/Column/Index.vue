<template>
  <div class="home student-info">
    <div style="text-align:right;">
      <vcom-button @click="goBack" size="bigger" type="primary" :ghost=true>返回</vcom-button>
    </div>
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
    <vcom-panel>
      <VcomOperationPanel
        :list="operation.list"
        :list-more="operation.more"
        @item-click="handleOperationClick"
      />
    </vcom-panel>
    <!--搜索面板 end-->

    <!--表格 begin-->
    <vcom-panel :show-detail="true">
      <div>
        <vcom-operation-panel-tabs
          :activeTabId.sync="activeOperationTabId"
          :data.sync="operationViewList"
        />
      </div>
      <template slot="detail">
        <keep-alive>
          <router-view
            v-if="$route.meta.keepAlive"
            :key="$route.path"
            ref="childrenCol"
            :form="form"
            @delTab="delTab"
            :checkedRows.sync="checkedRows"
            @panel-edit="(row, origin) => {
            handleOperationClick({
              id: '18',
              path: '/column/edit',
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
          ref="childrenCol"
          :form="form"
          @delTab="delTab"
          :checkedRows.sync="checkedRows"
          @panel-edit="(row, origin) => {
            handleOperationClick({
              id: '18',
              path: '/column/edit',
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
import VcomButton from '@/components/Button';
import VcomSearchPanel from '@/components/SearchPanel';
import VcomOperationPanel from '@/components/OperationPanel';
import VcomOperationPanelTabs from '@/components/OperationPanelTabs';
import form from '../../common/mixins/form';
import opetationPanel from '../../common/mixins/opetationPanel';
import { delTabsByIdList } from '@/api/canel';

export default {
  name: 'Column-index',
  mixins: [form, opetationPanel],
  components: {
    VcomButton,
    VcomSearchPanel,
    VcomOperationPanel,
    VcomOperationPanelTabs
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
          { id: '11', path: '/column/add', label: '增加' },
          { id: '17', path: '', label: '删除', disabled: true }
        ],
        more: [
        ]
      },
      operationViewList: [
        { id: '12', path: '/column', label: 'Column管理', __closeAble: false }
      ],
      activeOperationTabId: '12',
      form: {
        colName: ''
      },
      formItems: [
        { field: 'colName',
          placeholder: '列名称'
        }
      ]
    };
  },
  methods: {
    goBack () {
      this.$router.push({path: '/table'}).catch(e => { return e; });
    },
    aa (item, origin) {
      console.log('====');
      console.log(item);
    },
    /**
     * @parans origin 是从增加成功后 修改按钮带
     */
    async handleOperationClick (item, origin) {
      console.log(item, origin);
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
                <span>是否要彻底删除？</span>
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
                      this.$refs.childrenCol.getStuMuti && this.$refs.childrenCol.getStuMuti(this.$refs.childrenCol.pager.pageNo);
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
    operationTip (stopStudent) {
      this.$dialog({
        width: 600,
        renderHeader: () => <span>提示</span>,
        render: (h) => {
          return <div>
            <p style="height:30px;line-height:30px;">您选择的部分学生被禁用，不可进行操作，请重新选择！</p>
            <p style="height:30px;line-height:30px;">不可进行操作的学生：</p>
            <ul>
              { stopStudent.map(item => {
                return <li style="height:30px;line-height:30px;text-align:center;">
                  <span style="margin-right:30px;">{item.studentNumber}</span> <span>{item.realName}</span>
                </li>;
              }) }
            </ul>
          </div>;
        },
        renderFooter: (h, $dialog) => {
          return <div>
            <vcom-button
              size="small"
              type="primary"
              onClick={() => {
                $dialog.distroy();
              }}
            >确定</vcom-button>
          </div>;
        }
      });
    },
    getList () {
      this.$refs.childrenCol.getStuMuti && this.$refs.childrenCol.getStuMuti(1);
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
      this.activeOperationTabId = '12';
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
    // this.__remoteSearchSchool()
  },
  watch: {
    checkedRows () {
      this.operation.list.map(item => {
        if (['7'].indexOf(item.id) !== -1) {
          this.$set(item, 'disabled', this.checkedRows.length < 1);
        }
      });
    },
    activeOperationTabId (val) {
      if (val === '12') {
        this.checkedRows = [];
      }
    }
  }
};
</script>

<style lang="scss">
</style>

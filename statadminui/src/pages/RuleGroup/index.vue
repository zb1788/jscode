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
            :checkedRows.sync="checkedRows"
            @panel-edit="(row, origin) => {
            handleOperationClick({
              id: '18',
              path: '/rulegroup/edit',
              label: '修改',
              query: row
            }, origin)
          }"
            @panel-kin-ship="(row) => {
            handleOperationClick({
              id: '19',
              path: '/student/kinShipNo',
              label: '删除',
              query: row
            })
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
          :checkedRows.sync="checkedRows"
          @panel-edit="(row, origin) => {
            handleOperationClick({
              id: '18',
              path: '/rulegroup/edit',
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
import VcomSearchPanel from '@/components/SearchPanel';
import VcomOperationPanel from '@/components/OperationPanel';
import VcomOperationPanelTabs from '@/components/OperationPanelTabs';
import form from '../../common/mixins/form';
import opetationPanel from '../../common/mixins/opetationPanel';
import { delRuleByIdList } from '@/api/rule';

export default {
  name: 'rule-group-manage',
  mixins: [form, opetationPanel],
  components: {
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
          { id: '1', path: '/rulegroup/add', label: '增加' },
          { id: '7', path: '', label: '删除', disabled: true }
        ],
        more: [
        ]
      },
      operationViewList: [
        { id: '0', path: '/rulegroup', label: '规则分组管理', __closeAble: false }
      ],
      activeOperationTabId: '0',
      form: {
        groupName: ''
      },
      formItems: [
        { field: 'groupName',
          placeholder: '分组名称'
        }
      ],
      formVCode: {
        mobile: this.$store.state.user.phone,
        smsCode: ''
      }
    };
  },

  methods: {
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
                    let groupList = [];
                    this.checkedRows.map((item) => {
                      groupList.push(item.groupCode);
                    });
                    const res = await delRuleByIdList(groupList.join(','));
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
      if (val === '0') {
        this.checkedRows = [];
      }
    }
  }
};
</script>

<style lang="scss">
</style>

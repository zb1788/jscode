<template>
  <div class="student-add">
    <div v-if="isShowAdd">
      <vcom-form
        label-width="120px"
        v-model="form"
        :items="formItems"
        ref="form"
      />
      <div class="operationBtn">
        <vcom-button type="primary" @click="handleAdd">新增</vcom-button>
<!--        <vcom-button type="primary" plain @click="() => {this.$emit('delTab', 'add')}">返回</vcom-button>-->
      </div>
    </div>
    <div v-else class="student_success-add">
      <div class="student_success-img"></div>
      <p class="student_success-p">保存成功</p>
      <div>
        <vcom-button type="primary" @click="handleToAdd">继续添加</vcom-button>
        <vcom-button type="primary" plain @click="handleUpToAdd">修改</vcom-button>
<!--        <vcom-button type="success" plain @click="handleToBack">返回</vcom-button>-->
      </div>
    </div>
  </div>
</template>
<script type="text/jsx">
import VcomForm from '../../components/Form';
import form from '../../common/mixins/form';
import { addColumn, getRuleDictionaryByType } from '@/api/canel';
import { typeOf } from '../../utils/object';
export default {
  mixins: [form],
  components: {
    VcomForm
  },
  data () {
    return {
      addrow: {},
      isShowAdd: true,
      ruleDictionarys: [],
      tab: JSON.parse(sessionStorage.getItem('tab')),
      form: {
        tabId: JSON.parse(sessionStorage.getItem('tab')).tabId,
        colName: '',
        colLength: '',
        columnRuleList: [
          {}
        ]
      },
      formItems: [
        { label: '列名称', field: 'colName', required: true },
        { label: '列长度', type: 'number', field: 'colLength', required: true },
        { label: '规则内容',
          field: 'columnRuleList',
          inLine: true,
          required: false,
          validators: [
            // {
            //   func: (columnRuleList) => {
            //     return columnRuleList &&
            //       (columnRuleList || [])
            //         .filter(item => item && (item.ruleCode && item.ruleParam)).length > 0;
            //   },
            //   errorText: '列规则不能为空'
            // }
          ],
          render: (h, item, value) => {
            const { columnRuleList } = value;
            return <span>
              {typeOf(columnRuleList) === 'Array' &&
              columnRuleList.map((item, i) => <vcom-form
                label-width="100px"
                // v-model={item}
                value = {item}
                items={[
                  { field: 'ruleCode',
                    label: '规则标识',
                    inLine: true,
                    type: 'select',
                    width: '140px',
                    required: false,
                    options: this.ruleDictionarys,
                    requiredErrorText: '客户经理姓名不能为空'
                  },
                  { field: 'ruleParam',
                    label: '规则JSON',
                    inLine: true,
                    required: false,
                    width: '260px',
                    placeholder: '请输入JSON字符串',
                    subRender: () => i !== 0 && <vcom-button
                      type="danger"
                      ghost={true}
                      class="el-icon el-icon-close"
                      onClick={() => columnRuleList.splice(i, 1)}
                    />
                  }
                ]}
              >
                {i < 2 && i === columnRuleList.length - 1 &&
                  <vcom-form-item>
                    <vcom-button
                      type="primary"
                      plain={true}
                      onClick={() => {
                        columnRuleList.push({});
                      }}
                      size="small"
                    >新增规则</vcom-button>
                  </vcom-form-item>
                }
              </vcom-form>)
              }
            </span>;
          }
        }
      ]
    };
  },
  computed: {

  },
  methods: {
    async handleAdd () {
      if (this.$refs.form.validator()) {
        console.log(this.form);
        if (this.form.tabId === '') {
          this.$message.error('tabId不能为空,请返回Table管理重新进入！');
          return false;
        }
        let arr = [];
        this.form.columnRuleList.map(item => {
          console.log(item);
          typeof item.ruleCode != 'undefined' && typeof item.ruleParam != 'undefined' ? arr.push(item) : arr.push();
        });
        this.form.columnRuleList = arr;
        let res = await addColumn(this.form);
        console.log(res);
        if (res.code === '200') {
          this.addrow = res.data;
          this.isShowAdd = false;
        } else {
          this.$message.error(res.message);
        }
      }
    },
    // 继续添加
    handleToAdd () {
      this.clearFormData(this.form);
      this.isShowAdd = true;
      this.form.columnRuleList = [{}];
      this.form.tabId = JSON.parse(sessionStorage.getItem('tab')).tabId;
    },
    // 清空form数据
    clearFormData (obj) {
      for (let i in obj) {
        this.$set(this.form, i, '');
      }
    },
    // 继续修改
    async handleUpToAdd () {
      console.log(this.addrow);
      if (this.addrow.tabId) {
        this.$emit('panel-edit', this.addrow, 'continue');
        this.isShowAdd = true;
      }
    },
    // 返回到列表
    handleToBack () {
      this.$emit('delTab', 'add');
    }
  },
  async created () {
    let res = await getRuleDictionaryByType('C');
    console.log(res);
    let self = this;
    res.data.map((item, i) => {
      let obj = {};
      obj.label = item.ruleName;
      obj.value = item.ruleCode;
      self.ruleDictionarys.push(obj);
    });

    // this.loadFormItemsOptions(this.formItems);
    // this.isShowAdd = true;
  },
  watch: {
    // '$route': {
    //   handler (val) {
    //     if (val.name === 'student-add') {
    //       this.loadFormItemsOptions(this.formItems);
    //       this.isShowAdd = true;
    //     }
    //   }
    // }
  }
};
</script>
<style scoped lang="scss">
  .eduInst-from .el-form-item {
    width: 600px;
  }
  .subBtn{
    text-align: center;
  }
  .operationBtn{
    /*width: 100%;*/
    /*text-align: center;*/
    /*width: 140px;*/
  }
  .student_success{
    &-add{
      text-align: center;
    }
    &-img{
      width: 90px;
      height: 90px;
      margin: 0 auto;
      background: url('../../assets/images/success.png') no-repeat;
      background-size: 90px 90px;
    }
    &-p{
      color: #666666;
      margin: 20px 0 50px 0;
      font-size: 16px;
    }
  }
</style>
<style lang="scss">
  .student-add .vcom-form .vcom-form-item-sub {
    margin-left:0;
  }
</style>

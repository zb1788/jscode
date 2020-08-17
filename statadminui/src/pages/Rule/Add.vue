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
import { addRule, getRuleList, getRuleInfoListNoPage } from '@/api/rule';
export default {
  mixins: [form],
  components: {
    VcomForm
  },
  data () {
    return {
      addrow: {},
      isShowAdd: true,
      form: {
        ruleName: '',
        groupCode: '',
        taskType: '',
        taskContent: '',
        maxTimes: '',
        beforeRuleCode: '',
        remark1: ''
      },
      formItems: [
        { label: '规则名称', field: 'ruleName', required: true },
        { label: '分组',
          field: 'groupCode',
          required: true,
          type: 'select',
          options: []
        },
        { label: '任务类型',
          field: 'taskType',
          required: true,
          type: 'select',
          options: [
            {label: '存储过程', value: 'procedure'},
            {label: 'java类', value: 'java'},
            {label: 'datax执行文件', value: 'datax'}
          ]
        },
        { label: '任务内容', field: 'taskContent', required: true },
        { label: '最大重复执行次数', field: 'maxTimes', required: true },
        { label: '前置规则',
          field: 'beforeRuleCode',
          required: false,
          type: 'select',
          options: [],
          onFocus: (query) => {
            console.log(this.form.groupCode);
            if (this.form.groupCode === '') {
              return this.$message.error('请先选择分组');
            }
          }
        },
        { label: '备注', field: 'remark1', required: false }
      ]
    };
  },
  computed: {

  },
  methods: {
    async handleAdd () {
      if (this.$refs.form.validator()) {
        console.log(this.form);
        let res = await addRule(this.form);
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
      if (this.addrow.ruleCode) {
        this.$emit('panel-edit', this.addrow, 'continue');
        this.isShowAdd = true;
        // let res = await addRule(this.form);
        // if (res.status === 'ok') {
        //   // this.addrow = res.data;
        //   // this.isShowAdd = true;
        //   this.$emit('panel-edit', res.data, 'continue');
        //   this.isShowAdd = true;
        // } else {
        //   this.$message.error(res.msg);
        // }
      }
    },
    // 返回到列表
    handleToBack () {
      this.$emit('delTab', 'add');
    },
    async getGroupList () {
      const res = await getRuleList({groupName: '', pageNo: 1, pageSize: 999});
      let groupList = [];
      res.data.content.length > 0 && res.data.content.map(item => {
        let group = {};
        group.label = item.groupName;
        group.value = item.groupCode;
        groupList.push(group);
      });
      this.formItems[1].options = groupList;
    },
    async getRuleInfoListByGroupCode (groupCode) {
      const res = await getRuleInfoListNoPage(groupCode);
      let ruleList = [];
      res.data.length > 0 && res.data.map(item => {
        let rule = {};
        rule.label = item.ruleName;
        rule.value = item.ruleCode;
        ruleList.push(rule);
      });
      this.formItems[5].options = ruleList;
    }
  },
  async created () {
    this.getGroupList();
    // this.loadFormItemsOptions(this.formItems);
    // this.isShowAdd = true;
  },
  watch: {
    'form.groupCode': {
      handler (val) {
        this.form.beforeRuleCode = '';
        this.formItems[5].options = [];
        console.log(this.form.groupCode);
        if (this.form.groupCode !== '') {
          this.getRuleInfoListByGroupCode(this.form.groupCode);
        }
      },
      deep: true,
      immediate: true
    }
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

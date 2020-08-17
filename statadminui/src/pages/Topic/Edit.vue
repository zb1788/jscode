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
        <vcom-button type="primary" @click="handleAdd">保存</vcom-button>
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
import { addTopicGroup } from '@/api/canel';
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
        id: this.$route.query.id || '',
        topic: this.$route.query.topic,
        topicPartition: this.$route.query.topicPartition,
        topicOffset: this.$route.query.topicOffset
      },
      formItems: [
        { label: 'Topic名称', field: 'topic', required: true },
        { label: 'Topic分区号', field: 'topicPartition', required: true },
        { label: '分区offset', field: 'topicOffset', required: true }
      ]
    };
  },
  computed: {

  },
  methods: {
    async handleAdd () {
      if (this.$refs.form.validator()) {
        console.log(this.form);
        let res = await addTopicGroup(this.form);
        console.log(res);
        if (res.code === '200') {
          this.$message.success('修改成功！');
          this.$emit('delTab', 'update');
        } else {
          this.$message.error(`${res.message}`);
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
      if (this.addrow.groupCode) {
        let res = await addTopicGroup(this.form);
        if (res.code === '200') {
          // this.addrow = res.data;
          // this.isShowAdd = true;
          this.$emit('panel-edit', res.data, 'continue');
          this.isShowAdd = true;
        } else {
          this.$message.error(res.message);
        }
      }
    },
    // 返回到列表
    handleToBack () {
      this.$emit('delTab', 'add');
    }
  },
  async created () {
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

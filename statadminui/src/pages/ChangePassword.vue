<template>
  <div class="simulated-box">
    <div class="simulated-head">
      <p class="simulated-tit">修改密码</p>
    </div>
    <div class="simulated-content oper-div">
     <yj-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" >
       <yj-form-item label="用户名：" prop="userName">
         <yj-input v-model="ruleForm.userName" disabled style="width: 300px"></yj-input>
       </yj-form-item>
       <yj-form-item label="旧密码：" prop="oldPassword">
         <yj-input v-model="ruleForm.oldPassword" placeholder="请输入旧密码" show-password style="width: 300px"></yj-input>
       </yj-form-item>
       <yj-form-item label="新密码：" prop="newPassword">
         <yj-input v-model="ruleForm.newPassword" :placeholder="placeholder" show-password :minLength="6" :maxLength="16" style="width: 300px"></yj-input>
       </yj-form-item>
       <yj-form-item label="确认密码：" :minLength="8" :maxLength="12" prop="rePassword">
         <yj-input v-model="ruleForm.rePassword" placeholder="请再次输入密码" show-password style="width: 300px"></yj-input>
       </yj-form-item>
     </yj-form>
      <div class="tips"><p>温馨提示：</p>应公安部要求，为保证您的个人隐私及信息安全，请您不要使用过于简单的密码</div>
      <div class="operationBtn">
        <vcom-button type="primary" @click="submitForm('ruleForm')">保存</vcom-button>
        <vcom-button type="primary" plain @click="goback">返回</vcom-button>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import VcomButton from '../components/Button/index';
import { userServices } from '../api';
import { PwdPowerLevel } from '../api/config';

export default {
  name: 'ChangePassword',
  components: { VcomButton },
  data () {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        userName: this.$store.state.user.username,
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      placeholder: '',
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^[a-z0-9]{6,16}$/, message: '' }
        ],
        rePassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    goback () {
      this.$router.push({
        path: '/systemEntrance'
      }).catch(e => { return e; });
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.changePsd();
        } else {
          return false;
        }
      });
    },
    // 获取密码强度等级
    async PwdPowerLevel () {
      const res = await PwdPowerLevel();
      this.rules.newPassword[1].pattern = new RegExp(res.data.paramName);
      this.rules.newPassword[1].message = res.data.tip;
      this.placeholder = res.data.tip;
    },
    async changePsd () {
      const data = await userServices.changeSelfPassword({
        ...this.ruleForm
      });
      if (data.subCode === '200') {
        this.$message.success(data.subMsg);
      } else {
        this.$message.error(data.subMsg);
      }
    }

  },
  created () {
    this.PwdPowerLevel();
  }
};
</script>

<style lang="scss" scoped>
  .simulated-box{
    width: calc(100% - 176px);
    height:100%;
    margin-left: 88px;
    .simulated-head{
      width: 100%;
      height: 40px;
      padding: 26px 0;
      border-bottom: 1px solid #ddd;
      .simulated-tit{
        width: 80%;
        margin-left: 11px;
        font-size: 20px;
        height: 40px;
        line-height: 40px;
        color: #666;
        float: left;
      }
      .vcom-button{
        float: right;
        margin-right: 11px;
      }
    }
    .simulated-content{
      width: calc(100% - 100px);
      height: calc(100% - 92px);
      margin-left: 50px;
      margin-top: 30px;
      .tips{
        width: 800px;
        font-size:16px;
        font-weight:400;
        color:#999;
        margin-top: 30px;
        p{
          width: 110px;
          padding-right: 10px;
          text-align: right;
          display: inline-block;
        }
      }
    }
  }
</style>

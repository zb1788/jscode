<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="addUserRules" label-width="120px">
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="form.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名：" prop="truename">
        <el-input v-model="form.truename" placeholder="真实姓名"></el-input>
      </el-form-item>      
      <el-form-item label="密码：" prop="password">
        <el-input v-model="form.password" placeholder="密码"></el-input>
      </el-form-item>      

      <el-form-item label="是否管理员：">
        <el-switch v-model="form.ifadmin"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import { addUser,getUserInfos } from '@/api/userlist'
export default {
  data() {
    const validateUsername = (rule,value,callback) => {
      if(value.length < 5){
        this.form.message = '用户名不能小于5位'
        callback(new Error('用户名不能小于5位'))
      }else{
        callback()
      }
    }   
    
    const validatePassword = (rule,value,callback) => {
      if(value.length < 4){
        this.form.message = '密码不能小于4位'
        callback(new Error('密码不能小于4位'))
      }else{
        callback()
      }
    }           
    return {  
      form: {
        username: '',
        truename:'',
        password: '',
        ifadmin: false,
        message:'',
        loading:false,
        id:0,
        type:''
      },
      addUserRules: {
        username: [{require:true,trigger:'blur',validator:validateUsername}],
        password: [{require:true,trigger:'blur',validator:validatePassword}]
      }
    }
  },
  created() {
    let id = this.$route.query.id;
    let type = this.$route.query.type;
    this.form.id = id
    this.form.type = type
    if(type == 'edit'){
      this.getUserInfo(id)
    }
  },
  methods: {
    getUserInfo(id){
      this.loading = true;
      const obj = {}
      obj.id = id
      getUserInfos(obj).then(response=>{
        this.loading = false;
        this.form.username = response.data.username
        this.form.truename = response.data.truename
        this.form.password = response.data.pwd
        if(response.data.ifadmin===1){
          this.form.ifadmin = true;
        }else{
          this.form.ifadmin = false;
        }
      }).catch((error)=>{
        this.loading = false;
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if(valid){
          this.loading = true;
          const obj = {}
          obj.type = this.form.type
          obj.id = this.form.id
          obj.username = this.form.username
          obj.truename = this.form.truename
          obj.password = this.form.password
          if(this.form.ifadmin){
            obj.ifadmin = 1
          }else{
            obj.ifadmin = 0
          }
          var msg = '';
          if(this.form.type == 'add'){
            msg = '添加成功';
          }else{
            msg = '修改成功';
          }
          addUser(obj).then(response => {
            this.loading = false;
            if(response.data.status=='ok'){
              // this.$message('添加成功！')
              Message({
                  message: msg,
                  type: 'success',
                  duration: 5*1000
              })
              this.$router.push({ path: '/userList/index'})
            }
          }).catch((error) => {
            this.loading = false;
          })
        }else{
          this.loading = false;
          var message = this.form.message
          this.$message({
          message: message,
          type: 'warning'
        })
        }
      })

      //this.$message('submit!')
    },
    onCancel() {
      this.$router.go(-1)
      return false;
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>


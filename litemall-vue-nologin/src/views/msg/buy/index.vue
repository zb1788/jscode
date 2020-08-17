<template>
    <van-cell-group>
    <van-field
        v-model="username"
        label="用户名"
        placeholder="请输入用户名"        
    />
    <van-field
        v-model="username"
        label="手机号"
        placeholder="请输入手机号"        
    />
    <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
    />
    <van-button type="danger" style="width:100%;">立即购买</van-button>
    </van-cell-group>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },

  methods: {

  }
};
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/mixin';

.register_submit {
  padding-top: 40px;
  background-color: #fff;
}

.register_submit_btn {
  padding-top: 30px;
}

.getCode {
  @include one-border(left);
  text-align: center;
}

.time_down {
  color: $red;
}
</style>

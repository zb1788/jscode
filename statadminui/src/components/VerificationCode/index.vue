<!--
 * @Author: your name
 * @Date: 2019-11-19 20:33:06
 * @LastEditTime: 2020-05-06 17:27:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \user-center\src\components\VerificationCode\index.vue
 -->
<template>
  <div class="vcode">
    <yj-input v-model = 'inputVal' :placeholder="placeholder" :style=" inputWidth ? `width: ${inputWidth}`: '' "></yj-input>
    <vcom-button :plain='this.sendState' type="primary" :style=" buttonWidth ? `width:${buttonWidth};margin-left:20px` : 'margin-left:20px;width: 100%' " :disabled='sendState' @click='slideVerify'>{{msg}}</vcom-button>
    <yj-dialog
    title=""
    :visible.sync="dialogVisible"
    width="400px"
    :appendToBody=true
    >
    <slide-verify @success="onSuccess" @fail="onFail" @refresh="onRefresh" :slider-init-text="text" :tel='tel'></slide-verify>
    </yj-dialog>
    <div class='vcode--reminder' v-show='sendState'>验证码已发送至{{tel}}，请注意查收</div>
  </div>
</template>
<script>
import SlideVerify from '../SlideVerify';
export default {
  name: 'vcom-verification',
  components: {
    SlideVerify
  },
  props: {
    field: {
      type: String,
      default: ''
    },
    value: {
      default: ''
    },
    buttonWidth: {
      type: String,
      default: ''
    },
    inputWidth: {
      type: String,
      default: '200px'
    },
    seconds: {
      type: Number,
      default: 1
    },
    placeholder: {
      type: String,
      default: '请输入验证码'
    },
    tel: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      sendState: false,
      msg: '发送验证码',
      inputVal: this.value,
      dialogVisible: false,
      text: '向右拖动滑块填充拼图'
    };
  },
  created () {
    this.inputVal = '';
  },
  watch: {
    inputVal: {
      handler () {
        this.$emit('input', this.inputVal);
      },
      immediate: true
    }
  },
  methods: {
    slideVerify () {
      if (!this.tel) {
        return this.$message.error('该用户未绑定手机号，无法发送短信验证码');
      }
      this.dialogVisible = true;
    },
    getVerification () {
      // getVerificationApi()
      if (this.sendState) {
        return;
      }
      this.sendState = true;
      let remainingSeconds = this.seconds;
      this.msg = remainingSeconds + 's';
      let timer = setInterval(() => {
        remainingSeconds--;
        if (remainingSeconds <= 0) {
          this.sendState = false;
          this.msg = '发送验证码';
          clearInterval(timer);
        } else {
          this.msg = remainingSeconds + 's';
        }
      }, 1000);
    },
    onSuccess () {
      this.dialogVisible = false;
      this.getVerification();
    },
    onFail () {
      this.dialogVisible = false;
    }
    // onRefresh () {
    // }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/style/theme';
.vcode {
  @at-root #{&}--reminder {
    text-indent: 6px;
    @include themeify{
      color: themed('color-success')
    }
  }
}
</style>

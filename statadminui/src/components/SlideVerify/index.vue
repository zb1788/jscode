<template>
  <div class="slide-verify" ref='slideVerify' id="slideVerify" onselectstart="return false">
    <canvas :width="w"  ref="canvas"></canvas>
    <div @click="refresh" class="slide-verify-refresh-icon"></div>
    <canvas  ref="block" class="slide-verify-block"></canvas>
    <!-- container -->
    <div
      class="slide-verify-slider"
      :class="{'container-active': containerActive, 'container-success': containerSuccess, 'container-fail': containerFail}"
      :style="{width: w + 'px'}"
    >
      <div class="slide-verify-slider-mask" :style="{width: sliderMaskWidth}">
        <!-- slider -->
        <div
          @mousedown="sliderDown"
          @touchstart="touchStartEvent"
          @touchmove="touchMoveEvent"
          @touchend="touchEndEvent"
          class="slide-verify-slider-mask-item"
          :style="{left: sliderLeft}"
        >
          <div class="slide-verify-slider-mask-item-icon"></div>
        </div>
      </div>
      <span class="slide-verify-slider-text">{{sliderText}}</span>
    </div>
  </div>
</template>
<script>
import { baseServices } from '../../api/index';
export default {
  name: 'SlideVerify',
  props: {
    // block length
    l: {
      type: Number,
      default: 42
    },
    // block radius
    r: {
      type: Number,
      default: 10
    },
    // canvas width
    w: {
      type: Number,
      default: 300
    },
    // canvas height
    sliderInitText: {
      type: String,
      default: 'Slide filled right'
    },
    sliderSuccessText: {
      type: String,
      default: '成功'
    },
    sliderFailText: {
      type: String,
      default: '失败'
    },
    tel: {
      type: String,
      required: true
    },
    // 判断是否是登陆
    type: {
      type: String
    },
    password: {
      type: String
    }
  },
  data () {
    return {
      containerActive: false, // container active class
      containerSuccess: false, // container success class
      containerFail: false, // container fail class
      canvasCtx: null,
      canvas: null,
      blockCtx: null,
      block: null,
      block_x: undefined, // container random position
      block_y: undefined,
      L: this.l + this.r * 2 + 3, // block real lenght
      img: undefined,
      originX: undefined,
      originY: undefined,
      isMouseDown: false,
      blockLeft: undefined,
      trail: [],
      scale: undefined,
      height: undefined,
      sliderLeft: 0, // block right offset
      sliderMaskWidth: 0, // mask width
      sliderText: undefined
    };
  },
  mounted () {
    this.init();
  },
  watch: {
    sliderInitText: {
      handler (val) {
        this.sliderText = val;
      },
      immediate: true
    }
  },
  methods: {
    init () {
      this.initDom();
      this.initImg();
      this.bindEvents();
    },
    initDom () {
      this.block = this.$refs.block;
      this.canvas = this.$refs.canvas;
      this.canvasCtx = this.$refs.canvas.getContext('2d');
      this.blockCtx = this.block.getContext('2d');
      this.$refs.slideVerify.style.width = this.w + 'px';
    },
    initImg () {
      this.createImg();
    },
    createImg (onload) {
      const img = document.createElement('img'),
        blockImg = document.createElement('img');
      baseServices.getSliderVerify({
        captchaId: this.tel
      }).then((data) => {
        img.src = 'data:image/png;base64,' + data.backImage;
        this.img = img;
        this.yHeight = data.yHeight;
        img.onload = () => {
          this.scale = (img.width / this.w).toFixed(4);
          this.height = (this.w * img.height / img.width).toFixed(4);
          this.$refs.canvas.height = this.height;
          this.canvasCtx.drawImage(this.img, 0, 0, this.w, this.height);
          blockImg.src = 'data:image/png;base64,' + data.slidingImage;
          this.blockImg = blockImg;
          blockImg.onload = () => {
            this.block.width = this.blockWidth = (blockImg.width / this.scale).toFixed(4);
            this.block.height = this.height;
            let blockImgheight = (this.blockWidth * blockImg.height / blockImg.width).toFixed(4);
            this.blockCtx.drawImage(this.blockImg, 0, (this.yHeight / this.scale).toFixed(4), this.block.width, blockImgheight);
          };
        };
      });
    },
    refresh () {
      this.reset();
      this.$emit('refresh');
    },
    sliderDown (event) {
      this.originX = event.clientX;
      this.originY = event.clientY;
      this.isMouseDown = true;
    },
    touchStartEvent (e) {
      this.originX = e.changedTouches[0].pageX;
      this.originY = e.changedTouches[0].pageY;
      this.isMouseDown = true;
    },
    bindEvents () {
      document.addEventListener('mousemove', e => {
        if (!this.isMouseDown) { return false; }
        const moveX = e.clientX - this.originX;
        if (moveX < 0 || moveX + 38 >= this.w) { return false; }
        this.sliderLeft = moveX + 'px';
        this.blockLeft = (((this.w - this.blockWidth) / (this.w - 40)) * moveX).toFixed(4);
        this.block.style.left = this.blockLeft + 'px';
        this.containerActive = true; // add active
        this.sliderMaskWidth = moveX + 'px';
      });
      document.addEventListener('mouseup', async e => {
        if (!this.isMouseDown) { return false; }
        this.isMouseDown = false;
        if (e.clientX === this.originX) { return false; }
        this.containerActive = false; // remove active
        const { code, subCode, msg, subMsg, data } = await this.verify();
        if (this.type !== 'login') {
          if (code !== 200) {
            this.containerFail = true;
            this.$emit('fail');
            this.$message.error(msg || subMsg);
            this.reset();
          } else {
            if (subCode === '200') {
              this.containerSuccess = true;
              this.containerActive = false;
              // this.sliderText = this.sliderSuccessText;
              setTimeout(() => {
                this.$emit('success');
                this.reset();
              }, 500);
            } else if (subCode === '1103') {
              this.containerFail = true;
              this.containerActive = false; // remove active
              // this.$emit('fail');
              // this.sliderText = this.sliderFailText;
              // this.$message.error(subMsg);
              setTimeout(() => {
                this.reset();
              }, 500);
            } else {
              this.$message.error(data);
              this.reset();
              return false;
            }
          }
        } else {
          if (subCode === '200') {
            this.$emit('success');
            this.reset();
          } else {
            this.$message.error('验证失败');
            this.reset();
          }
        }
      });
    },
    touchMoveEvent (e) {
      if (!this.isMouseDown) { return false; }
      const moveX = e.changedTouches[0].pageX - this.originX;
      if (moveX < 0 || moveX + 38 >= this.w) { return false; }
      this.sliderLeft = moveX + 'px';
      this.blockLeft = ((this.w - this.blockWidth) / (this.w - 40)) * moveX;
      this.block.style.left = this.blockLeft + 'px';
      this.containerActive = true;
      this.sliderMaskWidth = moveX + 'px';
    },
    async touchEndEvent (e) {
      if (!this.isMouseDown) { return false; }
      this.isMouseDown = false;
      if (e.clientX === this.originX) { return false; }
      this.containerActive = false; // remove active
      const { subCode, subMsg } = await this.verify();
      if (this.type !== 'login') {
        if (subCode === '200') {
          this.containerSuccess = true;
          // this.sliderText = this.sliderSuccessText
          this.$emit('success');
          this.reset();
        } else if (subCode === '500') {
          this.containerFail = true;
          this.$emit('fail');
          this.$message.error(subMsg);
          this.reset();
        } else {
          this.containerFail = true;
          this.$emit('fail');
          // this.sliderText = this.sliderFailText
          this.$message.error('验证失败');
          this.reset();
        }
      }
    },
    async verify () {
      if (this.type === 'login') {
        let xpos = (this.blockLeft * this.scale).toFixed(4);
        this.$emit('xpos', xpos);
        let res = await baseServices.verify({
          captchaId: this.tel,
          xpos: (this.blockLeft * this.scale).toFixed(4)
        });
        return res;
      } else {
        let res = await baseServices.sendSmsCode({
          mobile: this.tel,
          captchaId: this.tel,
          xpos: (this.blockLeft * this.scale).toFixed(4)
        });
        return res;
      }
    },
    reset () {
      this.containerActive = false;
      this.containerSuccess = false;
      this.containerFail = false;
      this.sliderLeft = 0;
      this.block.style.left = 0;
      this.sliderMaskWidth = 0;
      // canvas
      let { w, height } = this;
      this.canvasCtx.clearRect(0, 0, w, height);
      this.blockCtx.clearRect(0, 0, w, height);
      this.block.width = w;
      this.blockLeft = 0;
      // generate img
      // this.img.src = this.getRandomImg()
      this.initImg();
    }
  }
};
</script>
<style scoped>
 .slide-verify {
        position: relative;
        width: 0px;
        margin: 0 auto;
    }
    .slide-verify-block {
        position: absolute;
        left: 0;
        top: 0
    }
    .slide-verify-refresh-icon {
        position: absolute;
        right: 0;
        top: 0;
        width: 34px;
        height: 34px;
        cursor: pointer;
        background: url("../../assets/images/icon/icon_light.png") 0 -437px;
        background-size: 34px 471px
    }
    .slide-verify-slider {
        position: relative;
        text-align: center;
        /* width: 300px; */
        height: 40px;
        line-height: 40px;
        margin-top: 15px;
        background: #f7f9fa;
        color: #45494c;
        border: 1px solid #e4e7eb
    }
    .slide-verify-slider-mask {
        position: absolute;
        left: 0;
        top: 0;
        height: 40px;
        border: 0 solid #1991FA;
        background: #D1E9FE
    }
    .slide-verify-slider-mask-item {
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
        background: #fff;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: background .2s linear
    }
    .slide-verify-slider-mask-item:hover {
        background: #1991FA
    }
    .slide-verify-slider-mask-item:hover .slide-verify-slider-mask-item-icon {
        background-position: 0 -13px
    }
    .slide-verify-slider-mask-item-icon {
        position: absolute;
        top: 15px;
        left: 13px;
        width: 14px;
        height: 12px;
        background: url("../../assets/images/icon/icon_light.png") 0 -26px;
        background-size: 34px 471px
    }
    .container-active .slide-verify-slider-mask-item {
        height: 38px;
        top: -1px;
        border: 1px solid #1991FA;
    }
    .container-active .slide-verify-slider-mask {
        height: 38px;
        border-width: 1px;
    }
    .container-success .slide-verify-slider-mask-item {
        height: 38px;
        top: -1px;
        border: 1px solid #52CCBA;
        background-color: #52CCBA !important;
    }
    .container-success .slide-verify-slider-mask {
        height: 38px;
        border: 1px solid #52CCBA;
        background-color: #D2F4EF;
    }
    .container-success .slide-verify-slider-mask-item-icon {
        background-position: 0 0 !important;
    }
    .container-fail .slide-verify-slider-mask-item {
        height: 38px;
        top: -1px;
        border: 1px solid #f57a7a;
        background-color: #f57a7a !important;
    }
    .container-fail .slide-verify-slider-mask {
        height: 38px;
        border: 1px solid #f57a7a;
        background-color: #fce1e1;
    }
    .container-fail .slide-verify-slider-mask-item-icon {
        top: 14px;
        background-position: 0 -82px !important;
    }
    .container-active .slide-verify-slider-text,
    .container-success .slide-verify-slider-text,
    .container-fail .slide-verify-slider-text {
        display: none;
    }
</style>

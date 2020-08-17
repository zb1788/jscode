<template>
	<div>
		<div id="bg" style="display:block;"></div>
		<div class="deTanImg">
			<div class="posR">
			<img :src="img" class="img100">
			</div>
			<a class="ktBtn kyello" @click="isback(1)">退出</a>
			<a class="ktBtn kgreen" @click="isback(0)">取消</a>
			<!-- <span class="close"><i class="icon-error03"></i></span> -->
		</div>
	</div>
</template>

<script>
import yellow from "./../assets/img/SignOut.png";
export default {
  // props: ["gonggao"],
  data() {
    return {
      img: yellow
    };
  },
  methods: {
    isback(num) {
      this.$emit("isback", num);
    }
  }
};
</script>

<style>
#bg {
  background-color: #666;
  position: absolute;
  z-index: 111;
  left: 0;
  top: 0;
  display: none;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  filter: alpha(opacity=80);
  -moz-opacity: 0.8;
}
.deTanImg {
  position: fixed;
  top: 10%;
  /* left: 10%;
  right: 10%; */
  z-index: 198;
  text-align: center;
}
.posR {
  position: relative;
}
.ktBtn.kyello {
  background: #ff6823;
  color: #fff;
  box-shadow: 1px 5px #333;
}
.ktBtn.kgreen {
  background: #32b16c;
  color: #fff;
  box-shadow: 1px 5px #333;
}
.ktBtn {
  display: inline-block;
  background: #fff;
  color: #666;
  width: 120px;
  border-radius: 10px;
  line-height: 40px;
  height: 40px;
  text-align: center;
  margin: 20px 5px;
  box-shadow: 1px 5px 0px #c0c0c0;
}
.deTanImg .close {
  position: absolute;
  bottom: -60px;
  color: #fff;
  left: 45%;
  font-size: 2em;
}
@media only screen and (min-width: 500px) {
  .deTanImg {
    left: 10%;
    right: 10%;
  }
}
@media all and (orientation: landscape) {
  .deTanImg {
    left: 30%;
    right: 30%;
  }
}
</style>

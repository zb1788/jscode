<template>
	<!-- <div>
		<div id="bg" style="display:block;"></div>
		<div class="cgbd pad10" style="display: block;">
			<h1 class="cgH1">闯关宝典</h1>
			<h3 class="textH3">练习技巧：</h3>
			<p>{{gonggao.keypoint}}</p>
			<h3 class="textH3">练习举例：</h3>
			<p>{{gonggao.example}}</p>
			<h3 class="textH3">解题思路：</h3>
			<p>{{gonggao.thinking}}</p>
			<div class="boxCon">
				<a class="btn bDefault closeCG" @click="startGame">
					<i class="icon-kwdd2"></i>开始练习</a>
			</div>
		</div>
	</div> -->
	<div class="bbBlueNew" id="bgremark"> 
		<header>
			<div class="pad10-0">
				<a class="guan" @click="close">
					<i class="icon-cuo02"></i>
				</a>
			</div>
		</header>
		<section>
			<div id="wrapperNew" style="overflow-y:auto;">
				<div id="scroller">
					<div class="cgnr pad10" v-html="gonggao">

					</div>
				</div>
			</div>
			<div id="die"></div>
			<div class="bottom center padB20">
				<a v-if="rcode!=''" class="btnS" @click="startVideo(rcode,plsurl,userName)">学习微课</a>
				<a class="btnSS" @click="startGame">开始闯关</a>
			</div>
		</section>		
	</div>
</template>

<script>
export default {
  props: ["gonggao", "plsurl", "rcode", "userName"],
  mounted() {
    // setTimeout(function() {
    //   new IScroll("#wrapperNew", {
    //     mouseWheel: true,
    //     click: true
    //   });
    // }, 500);
  },
  methods: {
    startGame() {
      this.$emit("startGame");
    },
    startVideo(rcode, plsurl, userName) {
      // console.log(rcode);
      var ishttps = document.location.protocol;
      var url =
        ishttps + "//" + plsurl + "/youjiao/doMutiplePlay.do?jsoncallback=?";
      $.getJSON(
        url,
        {
          rcode: rcode,
          userName: userName,
          filterType: 2,
          outType: 1
        },
        function(data) {
          window.location.href = data.jsonList[0].list[0].path;
        }
      );
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style>
#bgremark {
  position: fixed;
  z-index: 111;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
#wrapperNew {
  position: absolute;
  z-index: 1;
  top: 44px;
  background: #fff;
  right: 20px;
  left: 20px;
  bottom: 90px;
  overflow: hidden;
}
</style>

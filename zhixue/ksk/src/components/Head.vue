<template>
    <header class="head">
			<a class="head-left" @click="goback"><i class="icon-back"></i>返回</a>
			<h1 v-if="!iswrongView">
				<Process :time="time" @gameOver='gameOver' v-if="!isBegTime"></Process>
			</h1>
      <h1 v-if="iswrongView&&total!=0">{{now}}/{{total}}</h1>
			<a class="head-right" v-if="!iswrongView&&total!=0">{{now}}/{{total}}</a>
      <a class="head-right" v-if="iswrongView&&isHasQues" @click="goDel">清空</a>
		</header>
</template>

<script>
import Process from "./Process";
export default {
  components: {
    Process
  },
  props: ["time", "now", "total", "isBegTime", "iswrongView", "isHasQues"],
  computed: {},
  methods: {
    gameOver() {
      this.$emit("gameOver");
    },
    goback() {
      this.$emit("goback");
    },
    goDel() {
      this.$emit("goDel");
    }
  }
};
</script>

<style>

</style>

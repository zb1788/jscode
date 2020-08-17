<template>
    <header class="head">
			<a class="head-left" @click="goback"><i class="icon-back"></i>返回</a>
			<h1>
				<Process :time="time" @gameOver='gameOver' v-if="!isBegTime&&isStart"></Process>
			</h1>
			<a class="head-right">{{now}}/{{total}}</a>
		</header>
</template>

<script>
import Process from "./Process";
export default {
  components: {
    Process
  },
  props: ["time", "now", "total", "isBegTime"],
  computed: {
    isStart() {
      if (this.time > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    gameOver() {
      this.$emit("gameOver");
    },
    goback() {
      this.$emit("goback");
    }
  }
};
</script>

<style>

</style>

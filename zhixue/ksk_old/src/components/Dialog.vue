<template>
	<div>
		<div id="bg" style="display:block;"></div>
		<div class="cgbd pad10" style="display: block;">
			<div class="pad10" v-html="gonggao"></div>
			<div class="boxCon">
				<a class="btn bDefault closeCG" @click="startGame">
					<i class="icon-kwdd2"></i>开始练习</a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  props: ["gonggao"],
  methods: {
    startGame() {
      this.$emit("startGame");
    }
  }
};
</script>

<style>
</style>

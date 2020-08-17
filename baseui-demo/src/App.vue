<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { init } from '@/utils/fontSizeUtil';
export default {
  name: 'App',
  mounted () {
    init();
  }
};
</script>

<style>
  #app {
  }
</style>

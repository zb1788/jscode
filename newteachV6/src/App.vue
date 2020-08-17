<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { init } from '@/utils/fontSizeUtil'
export default {
  name: 'App',
  mounted(){
    init()
  }
}

</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html, body，input, textarea, select, button {
  font-family: Microsoft YaHei;
}
body,html,#app,.el-container{height:100%; margin:0; padding:0; overflow: hidden;}
*{margin: 0; padding:0;}
</style>

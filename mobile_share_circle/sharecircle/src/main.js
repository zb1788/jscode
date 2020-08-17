// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import "./assets/style.css";
import 'mint-ui/lib/style.css'
import "./assets/font/style.css"
import VueJsonp from 'vue-jsonp'
// import vueTouch from 'kim-vue-touch'


// import Es6Promise from 'es6-promise'
/* eslint-disable no-unused-vars */
// import Vconsole from 'vconsole';
// const vConsole = new Vconsole();
// export default vConsole;

// Es6Promise.polyfill()
// import 'babel-polyfill'

Vue.use(VueJsonp)
// Vue.use(vueTouch)

FastClick.attach(document.body)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import "babel-polyfill";
// import Es6Promise from "es6-promise";
// Es6Promise.polyfill();
import Vue from "vue";
import App from "./App";
import axios from "axios";

import "./assets/css/ksk.css";
import "./assets/css/ksknew.css";
// import "./assets/css/iscroll.css";
import "./assets/font/fonts.css";
import "./assets/font/style.css";

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});

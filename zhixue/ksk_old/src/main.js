// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import axios from "axios";

import "./assets/css/ksk.css";
import "./assets/css/iscroll.css";
import "./assets/font/fonts.css";

Vue.config.productionTip = false;
// Vue.use(axios);
Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});

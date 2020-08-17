import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'vant/lib/icon/local.css';
import '@/assets/scss/global.scss';
import '@/assets/scss/iconfont/iconfont.css';
import VueTouch from 'vue-touch'

import VueCountdown from '@chenfengyuan/vue-countdown';

import filters from '@/filter';

Vue.component(VueCountdown.name, VueCountdown);
Vue.use(filters);
Vue.use(VueTouch, {name: 'v-touch'})

VueTouch.config.swipe = {

  threshold: 100 //手指左右滑动距离

}

import { Lazyload, Icon, Cell, CellGroup, loading, Button, Toast ,Field } from 'vant';
Vue.use(Icon);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(loading);
Vue.use(Button);
Vue.use(Toast);
Vue.use(Field);
Vue.use(Lazyload, {
  preLoad: 1.3,
  error: require('@/assets/images/goods_default.png'),
  loading: require('@/assets/images/goods_default.png'),
  attempt: 1,
  listenEvents: ['scroll'],
  lazyComponent: true
});


Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
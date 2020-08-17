import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import axios from 'axios';

import YjUI from 'yj-ui';
import 'yj-ui/lib/theme-chalk/index.css';
import { Select, Option, Table, TableColumn, Pagination } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { useResponseCallback } from './api';

import './common/js/rem';
// import taskMessage from './common/js/taskMessage';

import $Dialog from './components/Dialog/index.js';
import $Notice from './components/Notice/index.js';

import '@/assets/style/reset.css';
import '@/assets/icons/iconfont.css';
import '@/assets/style/style.css';
import { refreshToken } from './api/user';
import { getAccessToken } from './utils/token';
Vue.use(Select);
Vue.use(Option);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.prototype.$dialog = $Dialog;
Vue.prototype.$notice = $Notice;

Vue.config.productionTip = false;

/**
 * 设置默认主题
 *
 */
window.document.documentElement.setAttribute('data-theme', 'default');

router.beforeEach((to, from, next) => {
  next();
  // 判断是否需要验证
  if (to.meta && to.meta.requireAuth !== false) {
    if (getAccessToken() !== '') {
      next();
    } else {
      // next();
      window.location.href = '/ucsui/manageportal/pc';
    }
  } else {
    next();
  }
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = '统计中心';
  }
});

/**
 * 注册components文件夹中的 全局组件
 */
[
  'Button',
  'FormItem',
  'Panel',
  'Table',
  'Tabs',
  'Form',
  'Dropdown'
].forEach(componentName => {
  const { default: component } = require(`./components/${componentName}`);
  Vue.component(component.name, component);
});

Vue.use(YjUI);
const $message = Vue.prototype.$message;

function messageCall (options, callFunc) {
  const duration = 5000;

  if (typeof options === 'string') {
    options && callFunc({
      message: options,
      duration
    });
    return;
  }

  options.message && callFunc({
    duration,
    ...options
  });
}

Vue.prototype.$message = (options) => messageCall(options, $message);
Vue.prototype.$message.success = (options) => messageCall(options, $message.success);
Vue.prototype.$message.error = (options) => messageCall(options, $message.error);
Vue.prototype.$message.warning = (options) => messageCall(options, $message.warning);
Vue.prototype.$message.info = (options) => messageCall(options, $message.info);

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    // 消息
    // taskMessage(this);

    let PERMISSION_FAILD_DIALOG_VISIBLED = false,
      // 是否正在刷新的标记
      isRefreshing = false,
      // 重试队列，每一项将是一个待执行的函数形式
      requests = [];

    const instance = axios.create({
      timeout: 300000,
      baseURL: process.env.VUE_APP_BASE_URL,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    // 请求后拦截
    useResponseCallback((responseCallback) => {
      responseCallback.error = async (res) => {
        const code = res.response.data.code;

        if (res.response.config.url.indexOf('sso/oauth/token') !== -1 && res.response.data.error) {
          !PERMISSION_FAILD_DIALOG_VISIBLED && this.$dialog({
            data: {
              closeAble: false
            },
            created () {
              PERMISSION_FAILD_DIALOG_VISIBLED = true;
            },
            renderHeader: () => <span>系统通知</span>,
            render: () => <div>由于您长时间没有操作，请重新登陆系统!</div>,
            renderFooter: (h, $dialog) => <span>
              <vcom-button
                type='primary'
                onClick={() => {
                  router.push({
                    path: '/login'
                  }).catch(e => { return e; });
                  $dialog.distroy();
                  PERMISSION_FAILD_DIALOG_VISIBLED = false;
                }}
              >确定</vcom-button>
            </span>
          });
        }

        // 当无访问权限时返回登录页
        if (code === 401) {
          if (res.response.config.url.indexOf('sso/oauth/token') === -1 && !isRefreshing) {
            isRefreshing = true;
            refreshToken(sessionStorage.getItem('refresh_token'))
              .then(res => {
                sessionStorage.setItem('token', res.access_token);
                requests.forEach(cb => cb());
                requests = [];
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          return new Promise((resolve) => {
            requests.push(() => {
              res.response.config.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`;
              resolve(instance(res.response.config));
            });
          });
        }
        return res;
      };
    });
  }
}).$mount('#app');

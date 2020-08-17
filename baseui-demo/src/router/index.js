'use strict';
import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/pages/HelloWorld';
import notFind from '@/pages/404';
import First from '@/pages/First';

const wProject = require('../../config/project');

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '/' + wProject.assetsPublicPath + '/',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/first',
      name: 'First',
      component: First
    },
    {
      path: '*',
      name: '404',
      component: notFind,
      meta: {
        title: '404-找不到指定资源'
      }
    }
  ]
});

import SystemEntrance from '../pages/SystemEntrance.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
      path: '/systemEntrance',
      name: 'systemEntrance',
      component: SystemEntrance,
      meta: {
        title: '系统管理中心'
      }
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('../pages/Index/Index')
    },
    {
      path: '/rulegroup',
      component: () => import(/* webpackChunkName: "student-info-mgr" */ '../pages/RuleGroup/index'),
      children: [
        {
          path: '',
          name: 'rulegroup--list',
          component: () => import('../pages/RuleGroup/List')
        },
        {
          path: '/rulegroup/add',
          name: 'rulegroup-add',
          component: () => import('../pages/RuleGroup/Add'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/rulegroup/edit',
          name: 'rulegroup-edit',
          component: () => import('../pages/RuleGroup/Edit')
        }
      ]
    },
    {
      path: '/rule',
      component: () => import(/* webpackChunkName: "student-info-mgr" */ '../pages/Rule/index'),
      children: [
        {
          path: '',
          name: 'rule--list',
          component: () => import('../pages/Rule/List')
        },
        {
          path: '/rule/add',
          name: 'rule-add',
          component: () => import('../pages/Rule/Add')
        },
        {
          path: '/rule/edit',
          name: 'rule-edit',
          component: () => import('../pages/Rule/Edit')
        }
      ]
    },
    {
      path: '/topic',
      component: () => import(/* webpackChunkName: "student-info-mgr" */ '../pages/Topic/index'),
      children: [
        {
          path: '',
          name: 'topic--list',
          component: () => import('../pages/Topic/List')
        },
        {
          path: '/topic/add',
          name: 'topic-add',
          component: () => import('../pages/Topic/Add'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/topic/edit',
          name: 'topic-edit',
          component: () => import('../pages/Topic/Edit')
        }
      ]
    },
    {
      path: '/table',
      component: () => import(/* webpackChunkName: "student-info-mgr" */ '../pages/Table/Index'),
      children: [
        {
          path: '',
          name: 'table--list',
          component: () => import('../pages/Table/List')
        },
        {
          path: 'add',
          name: 'table-add',
          component: () => import('../pages/Table/Add'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'edit',
          name: 'table-edit',
          component: () => import('../pages/Table/Edit')
        }
        // { path: 'cindex',
        //   name: 'column-index',
        //   component: () => import('../pages/Column'),
        //   children: [
        //     { path: '',
        //       name: 'column-list',
        //       component: () => import('../pages/Column/List')
        //     },
        //     { path: 'add',
        //       name: 'column-add',
        //       component: () => import('../pages/Column/Add')
        //     },
        //     { path: 'edit',
        //       name: 'column-edit',
        //       component: () => import('../pages/Column/Edit')
        //     }
        //   ]
        // }

      ]
    },
    {
      path: '/column',
      component: () => import(/* webpackChunkName: "student-info-mgr" */ '../pages/Column/Index'),
      children: [
        {
          path: '',
          name: 'column--list',
          component: () => import('../pages/Column/List')
        },
        {
          path: '/column/add',
          name: 'column-add',
          component: () => import('../pages/Column/Add'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/column/edit',
          name: 'column-edit',
          component: () => import('../pages/Column/Edit')
        }
      ]
    },
    { path: '/useractive',
      component: () => import('../pages/User/Index'),
      children: [
        { path: '',
          name: 'user-active',
          component: () => import('../pages/User/List')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta: {
      /**
       * 设置为false 不验证登陆
       * 其他则验证登陆状态
       */
        requireAuth: false,
        title: '系统管理中心'
      },
      component: () => import('../pages/Login.vue')
    }
  ],
  router = new VueRouter({
    mode: 'history',
    // 强制使用history模式
    fallback: false,
    base: process.env.PUBLIC_PATH,
    routes
  });

export default router;

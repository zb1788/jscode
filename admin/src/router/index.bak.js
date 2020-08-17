import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import HelloWorld from '@/components/HelloWorld'
import Layout from '@/views/layout/layout'
// import Dashboard from '@views/dashboard/Dashboard'
/* Layout */


export default new Router({
  routes: [
    {
      path:'/login',
      component:() => import('@/views/login/index'),
      hidden: true
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      name:'Dashboard',
      hidden: true,
      children: [{
        path: 'dashboard',
        component: () => import('@/views/dashboard/Dashboard'),
        meta:{title: 'Dashboard', icon: 'el-icon-menu'}
      }]
    },
    {
      path: '/example',
      component: Layout,
      redirect: '/example/table',
      name: 'Example',
      meta:{title:'Example',icon:'el-icon-tickets'},
      children: [
        {
          path: 'table',
          name: 'Table',
          component: () => import('@/views/table/Table'),
          meta: {title: 'Table', icon: 'el-icon-picture'}
        },
        {
          path : 'tree',
          name: 'Tree',
          component: () => import('@/views/tree/Tree'),
          meta: {title: 'Tree', icon: 'el-icon-phone-outline'}
        }
      ]
    },
    {
      path: '/form',
      component: Layout,
      children: [{
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/form'),
        meta:{title: 'Form', icon: 'el-icon-edit-outline'}
      }]
    }
    // {
    //   path: '/test',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // }
  ]
})

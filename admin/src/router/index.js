import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import HelloWorld from '@/components/HelloWorld'
import Layout from '@/views/layout/layout'

/* Layout */

//所有权限通用路由表 
//如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [
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
    meta:{title:'Example',icon:'el-icon-tickets', role: ['admin','editor']},
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/Table'),
        meta: {title: 'Table', icon: 'el-icon-picture', role: ['admin','editor']}
      },
      {
        path : 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/Tree'),
        meta: {title: 'Tree', icon: 'el-icon-phone-outline', role: ['admin','editor']}
      }
    ]
  }
]


//实例化vue的时候只挂载constantRouter
export default new Router({
  routes: constantRouterMap
});

//异步挂载的路由
//动态需要根据权限加载的路由表 
export const asyncRouterMap = [
  {
    path: '/form',
    component: Layout,
    meta: {role: ['xx']},
    children: [{
      path: 'index',
      name: 'Form',
      component: () => import('@/views/form/form'),
      meta:{title: 'Form', icon: 'el-icon-edit-outline',role: ['xx']}
    }]
  },
  {
    path: '/userList',
    component: Layout,
    meta: {role: ['admin']},
    children: [
      {
        path: 'index',
        name: 'userList',
        component: () => import('@/views/table/userlist'),
        meta:{title: '用户管理', icon: 'el-icon-edit-outline',role: ['admin']}
      }    
    ]
  },
  {
    path: '/manageUser',
    component: Layout,
    meta:{role: ['admin']},
    hidden:true,
    children: [
      {
        path: 'index',
        name: 'addUser',
        component: () => import('@/Views/form/addUser'),
        meta:{title:'添加用户', hidden: true,role: ['admin']}
      },
      {
        path: 'editUser',
        name: 'editUser',
        component: () => import('@/Views/form/addUser'),
        meta:{title:'编辑用户', hidden: true,role: ['admin']}
      }      
    ]
  }
];


export default [
  {
    path: '/login',
    name: 'loginbase',
    components: {
      default: () => import('@/views/login/login'),
    },
    meta: {
      // keepAlive: true
    }
  },
  {
    path: '/login/type/:name',
    name: 'login',
    props: true,
    component: () => import('@/views/login/login')
  },
  {
    path: '/login/registerGetCode',
    name: 'registerGetCode',
    component: () => import('@/views/login/register-getCode')
  },
  {
    path: '/login/registerSubmit/:phone/:phonecode',
    name: 'registerSubmit',
    props: true,
    component: () => import('@/views/login/register-submit')
  },
  {
    path: '/login/registerStatus/:status',
    name: 'registerStatus',
    props: true,
    component: () => import('@/views/login/register-status')
  },
  {
    path: '/login/forget',
    name: 'forget',
    component: () => import('@/views/login/forget')
  },
  {
    path: '/login/forget/reset/:phone/:phonecode',
    name: 'forgetReset',
    props: true,
    component: () => import('@/views/login/forget-reset')
  },
  {
    path: '/login/forget/reset/:status',
    name: 'forgetStatus',
    props: true,
    component: () => import('@/views/login/forget-status')
  }
];

const Tabbar = () => import('@/components/Tabbar/');

export default [
  {
    path: '/',
    name: 'home',
    components: {
      default: () => import('@/views/home/tabbar-home'),
      // tabbar: Tabbar
    },
    meta: {
      // keepAlive: true
    }
  },
  {
    path: '/info',
    name: 'info',
    components: {
      default: () => import('@/views/home/info'),
      // tabbar: Tabbar
    },
    meta: {
      // keepAlive: true
    }
  },  
  {
    path: '/list',
    name: 'list',
    components: {
      default: () => import('@/views/home/list'),
      // tabbar: Tabbar
    },
    meta: {
      // keepAlive: true
    }
  },   
  {
    path: '/add/:itemId/:selectNum',
    props: true,
    name: 'add',
    component: () => import('@/views/home/addinfo'),
    meta: {
      // keepAlive: true
    }
  }, 
  {
    path: '/success/:itemId/:orderId',
    name: 'success',
    props: true,
    component: () => import('@/views/home/success'),
    meta: {
      // keepAlive: true
    }
  },   
  {
    path: '*',
    redirect: {
      name: 'home'
    }
  }
];

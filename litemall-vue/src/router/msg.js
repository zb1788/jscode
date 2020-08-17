const Tabbar = () => import('@/components/Tabbar/');

export default [
  {
    path: '/msg',
    name: 'list',
    meta: {
      //keepAlive: true
    },
    components: {
      default:  () => import('@/views/msg/list'),
      tabbar: Tabbar
    }
  },
  {
    path: '/msg/about',
    name: 'about',
    meta: {
      keepAlive: true
    },
    components: {
      default:  () => import('@/views/msg/about'),
      tabbar: Tabbar
    }
  },  
  {
    path: '/msg/userorder',
    name: 'userorder',
    meta: {
      //keepAlive: true
    },
    components: {
      default:  () => import('@/views/msg/user/order-list'),
      tabbar: Tabbar
    }
  },   
  {
    path: '/msg/detail/:itemId',
    name: 'details',
    props: true,
    meta: {
      //keepAlive: true
    },
    component: () => import('@/views/msg/detail')
    // components: {
    //   default:  () => import('@/views/msg/detail'),
    //   tabbar: Tabbar
    // }
  },  
  {
    path: '/msg/checkorder/:type/:itemId',
    name: 'details',
    props: true,
    meta: {
      //keepAlive: true
    },
    component: () => import('@/views/msg/checkout')
    // components: {
    //   default:  () => import('@/views/msg/detail'),
    //   tabbar: Tabbar
    // }
  },   
  {
    path: '/msg/buy',
    name: 'buy',
    meta: {
      keepAlive: true
    },
    component: () => import('@/views/msg/buy')
  }
  // {
  //   path: '/items/detail/:itemId',
  //   name: 'detail',
  //   props: true,
  //   component: () => import('@/views/items/detail')
  // }
];

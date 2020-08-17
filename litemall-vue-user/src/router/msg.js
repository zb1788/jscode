const Tabbar = () => import('@/components/Tabbar/');

export default [
  // {
  //   path: '/msg',
  //   name: 'list',
  //   meta: {
  //     keepAlive: true
  //   },
  //   components: {
  //     default:  () => import('@/views/msg/list'),
  //     tabbar: Tabbar
  //   }
  // },
  // {
  //   path: '/msg/about',
  //   name: 'about',
  //   meta: {
  //     keepAlive: true
  //   },
  //   components: {
  //     default:  () => import('@/views/msg/about'),
  //     tabbar: Tabbar
  //   }
  // },  
  {
    path: '/msg/userorder',
    name: 'user',
    meta: {
      //keepAlive: true
    },
    components: {
      default:  () => import('@/views/msg/user/order-list'),
      // tabbar: Tabbar
    }
  },  
  {
    path: '/msg/submit',
    name: 'usersubmit',
    meta: {
      //keepAlive: true
    },
    components: {
      default:  () => import('@/views/msg/submit'),
      // tabbar: Tabbar
    }
  },   
  {
    path: '/msg/collect/:itemId',
    name: 'usercollect',
    props: true,
    meta: {
      //keepAlive: true
    },
    component: () => import('@/views/msg/collect')
  },     
  {
    path: '/msg/home',
    name: 'msghome',
    meta: {
      //keepAlive: true
    },
    components: {
      default:  () => import('@/views/msg/home/index'),
      // tabbar: Tabbar
    }
  },   
  {
    path: '/msg/activecode',
    name: 'active',
    meta: {
      //keepAlive: true
    },
    components: {
      default:  () => import('@/views/msg/user/usercode'),
      // tabbar: Tabbar
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
  },   
  // {
  //   path: '/msg/buy',
  //   name: 'buy',
  //   meta: {
  //     keepAlive: true
  //   },
  //   component: () => import('@/views/msg/buy')
  // }
  // {
  //   path: '/items/detail/:itemId',
  //   name: 'detail',
  //   props: true,
  //   component: () => import('@/views/items/detail')
  // }
];

const Tabbar = () => import('@/components/Tabbar/');

export default [
  {
    path: '/msg',
    name: 'class',
    meta: {
      keepAlive: true
    },
    components: {
      default:  () => import('@/views/msg/list'),
      tabbar: Tabbar
    }
  },
  {
    path: '/msg/about',
    name: 'class',
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
    name: 'class',
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
    name: 'class',
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
    path: '/msg/buy',
    name: 'class',
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

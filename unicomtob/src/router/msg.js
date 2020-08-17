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
    path: '/msg/about/:itemId',
    name: 'about',
    props: true,
    meta: {
      //keepAlive: true
    },
    component: () => import('@/views/msg/about')
    // components: {
    //   default:  () => import('@/views/msg/about'),
    //   tabbar: Tabbar
    // }
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
    path: '/msg/detail/:itemId/:num',
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
    path: '/msg/buy/:itemId',
    name: 'buy',
    props:true,
    meta: {
      //keepAlive: true
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

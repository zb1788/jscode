import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/pages/layout/layout'
import Login from '@/pages/login/login'


Vue.use(VueRouter)

/**
 * meta中的title是当前模块的名称,即curModule
 * abbr是应用模块的缩写，非应用模块的普通链接一律为空
 */
export default new VueRouter({
  // mode:'history',
  // base:'/dist',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    }, 
    {
      path:'/ktjx',
      component: Layout,
      redirect: '/ktjx/index',
      name:'ktjx',
      children:[
        {
        path: 'index',
        component: () => import('@/pages/ktjx/index'),
        meta: {title: '课堂教学',name:'ktjx', abbr: 'ktjx'}
        },
        {
          path: 'more',
          component: () => import('@/pages/ktjx/more'),
          meta: {title: '课堂教学',name:'more', abbr: 'ktjx'}
          }        
      ]
    },
    {
      path:'/kqyx',
      component: Layout,
      redirect: '/kqyx/index',
      name:'kqyx',
      children:[
        {
        path: 'index',
        component: () => import('@/pages/kqyx/index'),
        meta: {title: '预习探究', name:'kqyx1', abbr: 'kqyx'}
        }       
      ]
    },
    {
      path:'/khzy',
      component: Layout,
      redirect: '/khzy/index',
      name:'khzy',
      children:[
        {
        path: 'index',
        component: () => import('@/pages/khzy/index'),
        meta: {title: '课后作业', abbr: 'khzy'}
        }      
      ]
    },      
    {
      path:'/jxyp',
      component: Layout,
      redirect: '/jxyp/index',
      name:'jxyp',
      children:[
        {
        path: 'index',
        component: () => import('@/pages/jxyp/index'),
        meta: {title: '教学云盘', abbr: 'jxyp'}
        }      
      ]
    },     
    {
      path:'/jxfx',
      component: Layout,
      redirect: '/jxfx/index',
      name:'jxfx',
      children:[
        {
        path: 'index',
        component: () => import('@/pages/jxfx/index'),
        meta: {title: '教学分析', abbr: 'jxfx'}
        }              
      ]
    },   
    {
      path:'/sxks',
      component: Layout,
      redirect: '/sxks/index',
      name:'sxks',
      children:[
        {
        path: 'index',
        component: () => import('@/pages/sxks/index'),
        meta: {title: '升学考试', abbr: 'sxks'}
        }      
      ]
    },     
    {
      path:'/mswk',
      component: Layout,
      redirect: '/mswk/index',
      name:'mswk',
      children:[
        {
        path: 'index',
        component: () => import('@/pages/mswk/index'),
        meta: {title: '名师微课', abbr: 'mswk'}
        }      
      ]
    },   
    {
      path:'/xbzy',
      component: Layout,
      redirect: '/xbzy/index',
      name:'xbzy',
      children:[
        {
        path: 'index',
        component: () => import('@/pages/xbzy/index'),
        meta: {title: '校本资源', abbr: 'xbzy'}
        }      
      ]
    },     
    {
      path:'/kwyd',
      component: Layout,
      redirect: '/kwyd/index',
      name:'kwyd',
      children:[
        {
        path: 'index',
        component: () => import('@/pages/kwyd/index'),
        meta: {title: '课外阅读', abbr: 'kwyd'}
        }      
      ]
    },
    {
      path:'/zbkc',
      component: Layout,
      redirect: '/zbkc/index',
      name:'zbkc',
      children:[
        {
        path: 'index',
        component: () => import('@/pages/zbkc/index'),
        meta: {title: '直播课程', abbr: 'zbkc'}
        }      
      ]
    },  
    {
      path:'/bdzy',
      component: Layout,
      redirect: '/bdzy/index',
      name:'bdzy',
      children:[
        {
        path: 'index',
        component: () => import('@/pages/bdzy/index'),
        meta: {title: '本地资源', abbr: 'bdzy'}
        }      
      ]
    },   
    {
      path:'/play/index',
      name:'play',
      component: () => import('@/pages/play/index'),
      meta: {title: 'play', abbr: ''}
    },   
		{
		  path: '/pad/index',
      name: 'pad',
      component: () => import('@/pages/pad/index'),
      meta: {title: 'pad', abbr: ''}
    },
		{
		  path: '/smartPaper/index',
      name: 'smartPaper',
      component: () => import('@/pages/smartPaper/index'),
      meta: {title: 'smartPaper', abbr: ''}
    }, 
		{
		  path: '/smartPaper/manager',
      name: 'smartPaperManager',
      component: () => import('@/pages/smartPaper/manager'),
      meta: {title: 'smartPaperManager', abbr: ''}
    },
		{
		  path: '/paperbind/index',
      name: 'paperbind',
      component: () => import('@/pages/paperbind/index'),
      meta: {title: 'paperbind', abbr: ''}
    },   
		{
		  path: '/paperbind/new',
      name: 'paperbindnew',
      component: () => import('@/pages/paperbind/papernew'),
      meta: {title: 'paperbindnew', abbr: ''}
    },      
		{
		  path: '/ktjx/bindex',
      name: 'ktjxb',
      component: () => import('@/pages/ktjx/bindex'),
      meta: {title: 'ktjxb', abbr: ''}
    }, 
		{
		  path: '/iframe/index',
      name: 'iframe',
      component: () => import('@/pages/iframe/index'),
      meta: {title: 'iframe', abbr: ''}
    },
		{
		  path: '/hdkt/sharepic',
      name: 'hdkt',
      component: () => import('@/pages/hdkt/sharepic'),
      meta: {title: 'sharepic', abbr: ''}
    }                                                            
  ]
})

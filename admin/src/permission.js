import router from './router'
import store from './vuex'
import NProgress from 'nprogress' //Progress进度条
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'


const whiteList = ['/login'] //不重定向白名单
router.beforeEach((to,from,next) => {
    NProgress.start();
    if(getToken()){
        if(to.path === '/login'){
            next({path:'/'})
        }else{
            if(store.getters.roles.length === 0){
                store.dispatch('GetInfo').then(res => { // 拉取用户信息
                    // next()
                    const roles = res.data.roles;
                    store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
                      router.addRoutes(store.getters.routers) // 动态添加可访问路由表
                      next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                    })
                  }).catch(() => {
                    store.dispatch('FedLogOut').then(() => {
                      Message.error('验证失败,请重新登录')
                      next({ path: '/login' })
                    })
                  })
            }else{
                next()
            }
        }
    }else{
        if(whiteList.indexOf(to.path) !== -1){
            next();
        }else{
            next({path:'/login'})
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})

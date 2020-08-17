import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../vuex'
import { getToken } from '@/utils/auth'



//创建axios实例
const service = axios.create({
    baseURL:'http://192.168.151.126:8071/Home/Vue',
    //baseURL:'',
    timeout:15000   //请求超时时间
})


//request拦截器
service.interceptors.request.use(config => {
    if(store.getters.token){
        config.headers['X-token'] = getToken()  //让每个请求携带自定义的token
    }
    return config;
}, error => {
    console.log(error)
    Promise.reject(error)
})


//response拦截器
service.interceptors.response.use(
    response => {
        //code为状态码 200表示正常，
        const res = response.data;
        return response.data;
        // if(res.code !== 200){
        //     Message({
        //         message: res.data,
        //         type: 'error',
        //         duration: 5*1000
        //     })
        //     alert('111')
        //     return false;
        //     //50008:非法的token;50012:其他客户端登录了；50014：Token过期了;
        //     if(res.code === 50008 || res.code === 50012 || res.code === 50014 ){
        //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定退出', {
        //             confirmButtonText: '重新登录',
        //             cancelButtonText: '取消',
        //             type: 'warning'
        //         }).then(() => {
        //             store.dispatch('FedLogOut').then(() =>{
        //                 location.reload() //为了重新实例化vue-router对象 避免BUG
        //             })
        //         })
        //     }
        //     return Promise.reject(error)
        // }else{
        //     return response.data;
        // }
    },
    error => {
        console.log('err'+ error)
        Message({
            message: error.message,
            type: 'error',
            duration: 5*1000
        })
        return Promise.reject(error)
    }
)

export default service
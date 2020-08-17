import axios from 'axios'
import qs from 'qs'
// import { Message, MessageBox } from 'element-ui'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'



//创建axios实例
const service = axios.create({
    // baseURL:'http://192.168.151.126:8071/Home/Vue',
    //baseURL:'',
    timeout:15000   //请求超时时间
})


//request拦截器
service.interceptors.request.use(config => {
    if(config.method == 'post'){
        config.data = qs.stringify(config.data)
    }else{
        config.params = config.data
        config.data = ''
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
    },
    error => {
        console.log('err'+ error)
        // Message({
        //     message: error.message,
        //     type: 'error',
        //     duration: 5*1000
        // })
        return Promise.reject(error)
    }
)

export default service
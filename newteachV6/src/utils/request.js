import axios from 'axios'
import qs from 'qs'
import { Message, MessageBox } from 'element-ui'
import { getAccessToken, getTokenType } from '@/utils/auth'
import store from '@/store'


//请求携带cookie
//axios.defaults.withCredentials = true
//创建axios实例
const service = axios.create({
    baseURL: '',
    timeout:15000   //请求超时时间
})


//request拦截器
service.interceptors.request.use(config => {
    store.dispatch('setFullScreen',true)
    
    // if(getAccessToken() != ''){
    //     config.headers['Authorization'] = getTokenType()+ ' ' +getAccessToken()  //让每个请求携带自定义的token
    // }    

    if(config.method == 'post'){        
        config.data = qs.stringify(config.data)
    }else if(config.method == 'get'){
        config.params = config.data
        config.data = ''
    }else if(config.method == 'postjson'){
        config.method = 'post'
        config.headers = {'Content-Type':'application/json'}
    }else if(config.method == 'form'){
        config.method = 'post'
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        //config.data = qs.stringify(config.data)
        config.transformRequest = [
            function(data){
                let ret = ''
                for(let it in data){
                    ret += encodeURIComponent(it) + '=' +encodeURIComponent(data[it]) + '&' 
                }
                return ret
            }
        ]
    }
    return config;
}, error => {
    console.log(error)
    Promise.reject(error)
})

//response拦截器
service.interceptors.response.use(
    response => {
        if(store.getters.ajaxControlFullScreen){
            store.dispatch('setFullScreen',false)

        }
        
        //code为状态码 200表示正常，
        let res = response.data
        if(response.status !== 200){
            return Promise.reject(response.statusText)
        }else{
            return res;
        }
    },
    error => {
        store.dispatch('setFullScreen',false)
        console.log(error)   
        return Promise.reject(error)
    }
)

export default service
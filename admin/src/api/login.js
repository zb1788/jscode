import request from '@/utils/request'

export function login(username, password){
    // var params = new URLSearchParams();
    // params.append('username', username);       //你要传给后台的参数值 key/value
    // params.append('password', password);
    var params = 'username='+username+'&password='+password;
    return request({
        // url: 'api/login',
        //url:'http://localhost/MySsm/test/login',
        url:'/login',
        method: 'post',
        data: params
    })
}


export function getInfo(token){
    return request({
        url: '/getUserInfo',
        method: 'get',
        params: {token}
    })
}


export function logout(){
    return request({
        url: '/logout',
        method: 'get'
    })
}
import request from '@/utils/request'
import store from '@/store'

//登录
export function login(userInfo){
    // return new Promise((resolve,reject) => {
    //     var re = {"uid":1,"username":"admin","truename":"admin","pwd":"87081bc2835d55e988032c7d4bf02d18","ifadmin":1}
    //     resolve(re)
    // })

    let username = userInfo.username.trim()
    let password = userInfo.password.trim()

    let storeObj = store.getters

    username = '15503715016'
    //获取加密后的用户名
    let plsUsernameUrl = storeObj.transferProtocol + storeObj.domainConfig['PLS'] +'/newteach/getUsername.do'
    let params = {}
    params.userid = username

    return sendRequest(plsUsernameUrl, params, 'get')
}

//退出登录
export function logout(){
    let url = process.env.BASE_PREFIX+'/user/logout';
    return request({
        url: url,
        method: 'get'
    })
}



//获取用户名加密后的内容
export function getEncryptUserName(url, params){
    return sendRequest(url, params, 'get')
}

//获取产品鉴权数据
export function getSsoGrant(url, params){
    return sendRequest(url, params, 'get')
}

//去用户中心认证
export function validateUsernameAndPassword(url, params){
    return sendRequest(url, params, 'get')
}

export function sendRequest(url, params,method){
    return request({
        url: url,
        method: method,
        data:params
    })
}

export function getPasswordReg(){
    let url = process.env.TMS_BASE_PREFIX + '/tms/interface/queryPwdLevel.jsp'
    let params = {}

    return request({url: url, method: 'get', data:params}) 
}

//修改密码
export function changePassword(oldpwd,newpwd,userName){
    let url = process.env.TMS_BASE_PREFIX + '/tms/clientInterface/editSelfPwdSafeByUser.do'
    let params = {}
    params.oldpwd = oldpwd;
    params.newpwd = newpwd;
    params.userName = userName;

    return request({url: url, method: 'get', data:params}) 
}

//登录
export function sendLogin(params){
    let url = 'http://127.0.0.1:37375/api/set-ecomnj';
    return request({url:url,method:'form',data:params})
}

//切换章节
export function sendChangeKsId(params){
    let url = 'http://127.0.0.1:37375/api/start-lesson';
    return request({url:url,method:'form',data:params})
}

//退出授课端
export function sendLogout(params){
    let url = 'http://127.0.0.1:37375/api/quit';
    return request({url:url,method:'form',data:params})
}

export function test1(){
    let plsUsernameUrl = 'http://plsvcomyf.czbanbantong.com/newteach/getUsername.do'
    let params = {}
    params.userid = '15503715016'

    return sendRequest(plsUsernameUrl, params, 'get')
}

export function test2(){
    return new Promise((resolve,reject) => {
        test1().then((res) => {
            let ssoAuthUrl = 'http://ssovcomyf.czbanbantong.com/sso/verifyAuthInfo'
            let ssoParams = {}
            ssoParams.appFlg = 'PLS'
            ssoParams.loginUsertype = 'teacher'
            ssoParams.encodeP = 4
            ssoParams.username = res.username
            ssoParams.pwd = 'e10adc3949ba59abbe56e057f20f883e'
            ssoParams.pwdRsa = '53b46f467e30942b9958ca55cd531e514f7229958cdea91e1f1595528fb5a0231193e85ee0d7f3a3d14913d554fa7d295a65c63b089106e6f40409ce71a15f11fa57aa74dde781929efb6e2747bce81c20d289344870dea91ada93ecf5d39ff9ece728514af4aa59eda89f766806440b425500fd147b19df75e1a0510d018a62'
            ssoParams.mac = '6C-4B-90-78-9B-E7'

            // resolve(sendRequest(ssoAuthUrl, ssoParams, 'get'))
            sendRequest(ssoAuthUrl, ssoParams, 'get').then((re) => {
                console.log('xs')
                resolve(re)
            }).catch((err) => {reject(err)})
        }).catch((error) => {
            reject(error)
        })
    })
}
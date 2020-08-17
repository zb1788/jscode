import Cookies from 'js-cookie'
import storageUtil from '@/utils/storage'
import {AUTH_TOKEN_NAME,AUTH_TIME_NAME,AUTH_UT_NAME} from '@/api/constant'
import store from '@/store'
import { getJWTInfo } from '@/api/init'
const domain = document.domain.substr(document.domain.indexOf('.'),document.domain.length)


/**
 * 从cookie获取UT
 */
export function getUt(){
    return Cookies.get(AUTH_UT_NAME,{domain:domain})
}

export function setUt(ut){
    return Cookies.set(AUTH_UT_NAME,ut,{domain:domain});
}

export function removeUt(){
    return Cookies.remove(AUTH_UT_NAME,{domain:domain});
}


/**
 * 从sessionStorage获取token对象
 */
export function getToken(){
    if(storageUtil.get(AUTH_TOKEN_NAME) == 'null'||storageUtil.get(AUTH_TIME_NAME) == 'null'){
        return ''
    }else{
        let tokenObj = JSON.parse(storageUtil.get(AUTH_TOKEN_NAME))
        return tokenObj
    }
}

export function setToken(token){
    storageUtil.set(AUTH_TOKEN_NAME,token)
}

export function removeToken(){
    storageUtil.remove(AUTH_TOKEN_NAME)
}


/**
 * 从sessionStorage获取access_token
 */
export function getAccessToken(){
    if(storageUtil.get(AUTH_TOKEN_NAME) == 'null'){
        return ''
    }else{
        let tokenObj = JSON.parse(storageUtil.get(AUTH_TOKEN_NAME))
        return tokenObj.access_token
    }
}

/**
 * 从sessionStorage获取refresh_token
 */
export function getRefreshToken(){
    if(storageUtil.get(AUTH_TOKEN_NAME) == 'null'){
        return ''
    }else{
        let tokenObj = JSON.parse(storageUtil.get(AUTH_TOKEN_NAME))
        return tokenObj.refresh_token
    }
}

/**
 * 从sessionStorage获取token_type
 */
export function getTokenType(){
    if(storageUtil.get(AUTH_TOKEN_NAME) == 'null'){
        return ''
    }else{
        let tokenObj = JSON.parse(storageUtil.get(AUTH_TOKEN_NAME))
        return tokenObj.token_type
    }
}

/**
 * 从sessionStorage获取access_token时间戳
 */
export function getAccessTokenTime(){
    if(storageUtil.get(AUTH_TIME_NAME) == 'null'){
        return ''
    }else{
        return storageUtil.get(AUTH_TIME_NAME)
    }
}



export function setLoginStyle(loginStyle){
    return Cookies.set('loginStyle',loginStyle,{domain:domain})
}


export function getLoginStyle(){
    return Cookies.get('loginStyle',{domain:domain})
}

export function removeLoginStyle(){
    return Cookies.remove('loginStyle',{domain:domain});
}
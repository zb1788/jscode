import commonUtils from '@/utils/common'
import requestUtil from '@/utils/requestUtil'
/**
 * 检查token是否过期
 * @param {*} response 
 */
export default function checkTokenExpired(response){

    if(response.data.code){
        //401为token失效的标识(网管返回的业务状态码)
        if(response.data.code == '401'){
            commonUtils.console('token失效',response.data.message)
            //先更新token
            
            //再重新调用接口
            return new Promise((resolve, reject) => {
                resolve(requestUtil(response.config)) 
            })            
        }else{
            return response
        }        
    }


    return false
}
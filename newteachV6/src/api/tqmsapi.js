/**
 * 题库相关接口
 */
import request from '@/utils/request'
import store from '@/store'
import { getOfflineHomeworkListApi, getResListFromTqmsPaperApi } from '@/api/interface'
 
/**
 * 获取我的训练
 */
export function getPersonalPractice(){
    let url = process.env.TQMS_BASE_PREFIX + '/tqms/interface/practice/queryPracticeByPaperType.action'

    let params = {}
    params.classId = store.getters.ksId
    params.studentClass = store.getters.userSelectClassId
    params.start = 0
    params.type = 0
    params.limit = 100
    params.loginStyle = 0
    params.username = store.getters.teacherNumber
    params.paperType = 0

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })    
}


/**
 * 获取当前标签下的资源
 * @param {*} type 0:名师作业 1：优教作业 2：我的网上作业 3：我的离线作业 4:我的套卷
 */
export function getCurHomeworkRes(type){
    let url = process.env.TQMS_BASE_PREFIX + '/tqms/interface/homework/queryHomeworkByPaperType.action'
    let params = {}
    

    params.classId = store.getters.ksId
    params.studentClass = store.getters.userSelectClassId
    params.start = 0
    params.type = 0
    params.limit = 100
    params.username = store.getters.teacherNumber
    params.loginStyle = 0
    if(type == 0){
        params.paperType = 2
    }else if(type == 1){
        params.paperType = 1
    }else if(type == 2){
        params.paperType = 0
    }else if(type == 3){
        // params.command = 'jobSent'
        // params.username = store.getters.teacherNumber
        // params.infoid = store.getters.ksId
        // params.start = 0
        // params.size = 100
        
        // url =  process.env.WEBMAIL_BASE_PREFIX + '/src/msgInterFace.php'
        return getOfflineHomeworkListApi()
    }else if(type == 4){
        return getResListFromTqmsPaperApi(store.getters.teacherNumber,store.getters.ksId)
    }

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })    
}
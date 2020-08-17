/**
 * pls相关接口
 */

import request from '@/utils/request'
import store from '@/store'



/**
 * ----------------------课前预习相关逻辑----------------------------
 */

//获取课前预习标签
export function getCourseTypeShow(){
    let url = process.env.PLS_BASE_PREFIX + '/interface/getCourseTypeShow.do'
    let params = {}
    params.ksid = store.getters.ksId
    params.random = Math.random()
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

//获取任务详情
export function getResInfo(id){
    let url = process.env.PLS_BASE_PREFIX + '/interface/editCourseJob.do'
    
    let params = {}
    params.id = id
    params.username = store.getters.teacherNumber
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

//获取任务反馈信息
export function getFankui(rcode){
    let url = process.env.PLS_BASE_PREFIX + '/interface/getCourseJobQuestionList.do'
    
    let params = {}
    params.jobid = rcode
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}













/**
 * 获取个人资源资源
 * @param {*} resComeType 
 * @param {*} type 1:个人文件夹的资源 2 其他资源（云盘资源）
 */
export function getPersonalRes (resComeType,type,fcode){
    //教学素材
    let url = process.env.PLS_BASE_PREFIX + '/teacherfile/getfilelist.do'

    let params = {}
    params.teachernumber = store.getters.teacherNumber
    params.noforder = 2
    params.pageindex = 1
    params.pagesize = 100

    if(type == 1){
        params.parentfcode = ''
        params.pageindex = 1
        params.pagesize = 100
        params.kscode = store.getters.ksId
        params.place = 4
        params.resComeType = resComeType
        params.orderby = 1
    }else{
        if(typeof fcode != "undefined"){
            params.parentfcode = fcode
        }else{
            params.parentfcode = 0
        }
        //orderby;////排序 默认空，1:按照教案、课件、素材、拓展排序（主要用于教学云盘资源输出顺序） 2:按照上传时间降序排序 3：按照上传时间升序排序 4：按文件大小降序排序 5：按文件大小降序升序
        params.orderby = 2
        //params.kscode = store.getters.ksId
        params.place = 0
        if(store.getters.loginStyle == 0){
            params.channelid = '03.49' //写死只有教学云盘栏目调用（否则不能写死）
            params.cookieid = Math.random()
        }

    }

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })    
}

/**
 * 获取名师预习/参考预习/我的预习
 * @param {*} systype 1:名师预习；2：参考预习；0：我的预习;3:教学云盘的预习
 */
export function getCurPreviewRes(systype){
    let url
    let params = {}
    if(systype != 3){
        if(systype == 1 || systype == 2){        
            url = process.env.PLS_BASE_PREFIX + '/interface/getCourseJobList.do'
            params.systype = systype
        }else if(systype == 0){
            url = process.env.PLS_BASE_PREFIX + '/interface/getSelfCourseJobList.do'    
            params.ut = store.getters.ut
        }

        params.ksid = store.getters.ksId    
        params.username = store.getters.teacherNumber
        params.classId = store.getters.userSelectClassId
        params.random = Math.random()
    }else{
        //教学云盘预习
        url = process.env.PLS_BASE_PREFIX + '/prepare/getSelfCourseJobList.do'    
        params.currentPage = 1
        params.pageSize = 999
        params.listType = 1
        params.username = store.getters.teacherNumber
        params.sortFlag = 0
    }



    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}
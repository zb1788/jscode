/**
 * 升学考试
 */

import request from '@/utils/request'
import store from '@/store'
import commonUtils from '@/utils/common'



/**
 * 获取名师微课数据
 */
export async function getMswkData(){

    //获取年级数据
    let arrGrade = []
    let gradeArr = await getGradeApi()
    let currentGradeIndex = 0
    let currentGradeId = -1
    arrGrade.push({'id':-1,'name':'全部','nameCode':-1})
    for(let [index,item] of gradeArr.entries()){
        let obj = {}
        obj.id = item.id
        obj.name = item.name
        obj.nameCode = item.nameCode

        if(store.getters.baseData.gradeCode == item.nameCode){
            //当前选中的年级
            currentGradeIndex = index+1
            currentGradeId = item.id
        }
        arrGrade.push(obj)
    }

    //获取学科数据
    // let arrSubject = []
    // let subjectArr = await getSubjectApi(currentGradeId)
    // let currentSubjectIndex = 0
    // arrSubject.push({'name':'全部','nameCode':-1})
    
    // for(let [index,item] of subjectArr.entries()){
    //     let obj = {}
    //     obj.name = item.name
    //     obj.nameCode = item.nameCode
    //     if(store.getters.baseData.subjectCode == item.nameCode){
    //         //当前选中的学科
    //         currentSubjectIndex = index+1
    //     }
    //     arrSubject.push(obj)
    // }

    let res = await getSubjectData(currentGradeId)


    let result = {}
    result.gradeArr = arrGrade
    result.currentGradeIndex = currentGradeIndex
    result.subjectArr = res.arrList
    result.currentSubjectIndex = res.currentIndex

    return result
}

/**
 * 获取当前学科数据
 * @param {*} currentGradeId 
 */
export async function getSubjectData(currentGradeId){
    let arrSubject = []
    let subjectArr = await getSubjectApi(currentGradeId)
    let currentSubjectIndex = 0
    arrSubject.push({'name':'全部','nameCode':-1})
    
    for(let [index,item] of subjectArr.entries()){
        let obj = {}
        obj.name = item.name
        obj.nameCode = item.nameCode
        if(store.getters.baseData.subjectCode == item.nameCode){
            //当前选中的学科
            currentSubjectIndex = index+1
        }
        arrSubject.push(obj)
    }

    let result = {}
    result.arrList = arrSubject
    result.currentIndex = currentSubjectIndex

    console.log(result)
    return result
}


/**
 * 获取左边目录数据
 * @param {*} gradeCode 
 * @param {*} subjectCode 
 */
export async function getLeftMenuData(gradeCode,subjectCode){
    let res = await getLeftMenuApic(gradeCode,subjectCode)
    let arr = []
    if(res && res.items && res.items.length > 0){
        for(let item of res.items){
            let obj = {}
            obj.name = item.name
            obj.id = item.id
            arr.push(obj)
        }
    }
    return arr
}

/**
 * 获取右边资源列表数据
 * @param {*} catalogId 
 */
export async function getResData(catalogId){
    let res = await getResApi(catalogId)
    let arr = []
    if(res && res.length > 0){
        for(let item of res){
            let obj = {}
            obj.title = item.resourceName
            obj.rcode = item.resourceId
            obj.resourceType = item.resourceType
            obj.icon = require('@/assets/images/icon/res/mp4.png')
            if(item.resourceType == 1){
                //试卷 此处rsType写死2
                obj.icon = require('@/assets/images/icon/xunlian.png')
                obj.playJs = {'playName':'zuoda',params:{'rcode':obj.rcode,'rtitle':obj.title,'rsType':2}}
            }else{
                //微课视频
                obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'rtitle':obj.title,'resType':5}}
            }
            
            arr.push(obj)
        }
    }
    return arr
}



/**
 * 获取名师微课年级
 */
export function getGradeApi(){
    let url = process.env.MICRO_BASE_PREFIX + '/own/gradeSubject/getGrade.action'
    let params = {}

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

/**
 * 获取名师微课学科
 */
export function getSubjectApi(parentid){
    let url = process.env.MICRO_BASE_PREFIX + '/own/gradeSubject/getclasslist.action'
    let params = {}
    params.parentid = parentid
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

/**
 * 获取左边目录
 */
export function getLeftMenuApic(gradeCode,subjectCode){
    let url = process.env.MICRO_BASE_PREFIX + '/own/gradeSubject/getcourselist.action'
    let params = {}
    params.gradeCode = gradeCode
    params.subjectCode = subjectCode
    params.limit = 100
    params.time = 0
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}


/**
 * 获取当前栏目下资源
 * @param {*} catalogId 
 */
export function getResApi(catalogId){
    let url = process.env.MICRO_BASE_PREFIX + '/common/resouceList.action'
    let params = {}
    params.catalogId = catalogId
    params.isMyCatalog = false
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}
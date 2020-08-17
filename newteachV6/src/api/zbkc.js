/**
 * 平台直播
 */


import request from '@/utils/request'
import store from '@/store'
import commonUtils from '@/utils/common'
import { getBaseGradeSubjectTerm } from '@/api/tmsapi'


/**
 * 获取平台直播的二级菜单
 */
export function getPtzbTab(){
    let arr = []
    let tabArr = store.getters.mainMenu.filter(item => item.name == store.getters.curModule)

    if(tabArr.length > 0){
        if(tabArr[0].childArr.length > 0){
            for(let [index,item] of tabArr[0].childArr.entries()){
                let obj = {}
                obj.name = item.name
                obj.menuid = item.menuid                
                obj.LiveRange = ''
                if(index == 0){
                    obj.LiveRange = ''
                    obj.pvname = 'tls_zbkt_zbkt'
                }else if(index == 1){
                    obj.LiveRange = '0'
                    obj.pvname = 'tls_zbkt_bxzb'
                }else if(index == 2){
                    obj.LiveRange = '1'
                    obj.pvname = 'tls_zbkt_ptzb'
                }
                arr.push(obj)
            }
        }else{
            console.log('当前模块没有二级栏目')
        }
    }else{
        console.log('获取不到当前模块')
    }
    return arr
}


/**
 * 获取直播内容
 * @param {*} LiveRange 
 */
export async function getResData(LiveRange,page,pageSize){
    let arr = []
    let rdata = await getTvApi(LiveRange,page,pageSize)
    console.log(rdata)
    
    let baseData = await getBaseGradeSubjectTerm(store.getters.teacherNumber)
    console.log(baseData)
    let subjectArr = []
    if(baseData && baseData.subjects && baseData.subjects.length > 0){
        for(let item of baseData.subjects){
            subjectArr[item.subjectCode] = item.subject
        }
    }
    console.log(subjectArr)


    if(rdata && rdata!=null && rdata.list && rdata.list!=null && rdata.list.length>0){
        for(let item of rdata.list){
            let obj = {}
            obj.rcode = item.id
            obj.name = item.name
            obj.start = item.start
            obj.teacher = item.teacher
            obj.playflag = '即将开始'
            obj.duration = item.duration //直播时长分钟
            let playtimes = item.duration*60000
            let passtimes = commonUtils.compareTime(item.start)
            obj.kmstr = '其他'
            if(commonUtils.isNotEmpty(item.kmcode)){
                //非空则将科目编码转换为科目名
                if(typeof subjectArr[item.kmcode]){
                    obj.kmstr = subjectArr[item.kmcode]
                }                
            }
            if(passtimes >= 0){
                obj.playflag = '正在直播'
                if(passtimes > playtimes){
                    obj.playflag = '直播结束'
                }
            }
            obj.gzflag = item.gzflag
            arr.push(obj)
        }
    }
    return arr
}




function getTvApi(liveRange,page,pageSize){
    let url = process.env.RLMS_BASE_PREFIX + '/rlmsapi/rlms/interface/queryLiveClass.jsp'

    let params = {}
    params.userName = store.getters.teacherNumber
    params.areaId = store.getters.areaId
    params.schoolId = store.getters.schoolId
    params.page = page
    params.pageCount = pageSize
    if(liveRange != ''){
        params.liveType = 1 //liveType 1直播课堂  0电视台
        params.liveRange = liveRange
        params.orderType = 2 //orderType=2 按照关注/时间排序,默认为时间/关注排序
    }else{
        params.liveType = 0 //liveType 1直播课堂  0电视台
    }


    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })   
}
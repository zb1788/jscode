/**
 * 本地资源
 */

import request from '@/utils/request'
import store from '@/store'
import commonUtils from '@/utils/common'
import {getIconName} from '@/api/api'
/**
 * 获取左边目录树
 */
export async function getLeftData(){
    let res = await getLeftApi()
    console.log(res)
    let arr = []
    if(res && res.SchoolSelf && res.SchoolSelf.length > 0){
        for(let item of res.SchoolSelf){
            if(item.codeId == store.getters.schoolId){
                continue
            }
            let obj = {}
            obj.name = item.codeName
            obj.code = item.codeId        
            obj.shareType = item.shareType
            obj.selfType = item.selfType
            if(item.codeId.indexOf('.') != -1){
                obj.childArr = [{'name':'教学资源','code':0},{'name':'专题资源','code':1},{'name':'微课资源','code':2}]
            }else{
                obj.childArr = [{'name':'教学资源','code':0},{'name':'专题资源','code':1}]
            }
            
            arr.push(obj)
        }
    }
    return arr
}

export async function getRightResData(pid,type,pageNum,page){
    //先获取是否有下一级目录
    let res = await getRightDirApi(pid,type,pageNum,page)

    let dirArr = []
    if(res && res.classes && res.classes.length > 0){
        for(let item of res.classes){
            let obj = {}
            obj.name = item.name
            obj.code = item.code
            dirArr.push(obj)
        }
    }
    
    //如果目录数据为空，再请求资源接口查看是否资源（endFlag其实可以判断是否最后一级）
    let resArr = []
    let result = {}
    result.resArr = []
    result.resTotal = 0
    if(dirArr.length == 0){
        let resData = await getRightResApi(pid,1,pageNum,page)

        if(resData && resData.ResInfo && resData.ResInfo.length > 0){
            for(let item of resData.ResInfo){
                let obj = {}
                obj.title = item.RTitle
                let RFormatMark = item.RFormatMark.toLowerCase()
                obj.RFormatMark = RFormatMark
                obj.rcode = item.RCode
                obj.icon = '' //资源图标
    
                if(obj.RFormatMark!="null" && obj.RFormatMark!=""){
                    let iconFormat = getIconName(obj.RFormatMark)
                    obj.icon = require(`@/assets/images/icon/res/${iconFormat}.png`)
                }else{
                    obj.icon = require('@/assets/images/icon/res/blank.png')
                }

                //是否需要密码 wordFlag 0 正常；1 需要输入密码               
                obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'rtitle':obj.title,'resType':1,'wordFlag':item.wordFlag}}
                resArr.push(obj)
            }
            let resTotal = await getRightResApi(pid,0,pageNum,page)
            result.resTotal = resTotal.ResInfo
        }
    }

    
    result.dirArr = dirArr
    result.resArr = resArr
    return result
}

/**
 * 获取右边微课资源
 * @param {*} area 
 * @param {*} pageNum 
 */
export async function getRightWkResData(area,pageNum){
    let res = await getRightWkResApi(area,pageNum)
    console.log(res)
    let arr = []
    if(res && res.items && res.items.length > 0){
        for(let item of res.items){
            let obj = {}
            obj.title = item.coursename
            obj.rcode = item.id
            obj.icon = require('@/assets/images/icon/res/mp4.png')
            
            //此处resType和龙真协商传递成bdwk表示是本地微课类型，名师微课的resType还是5
            obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'rtitle':obj.title,'resType':'bdwk','wordFlag':item.wordFlag}}

            let buttonArr = []
            buttonArr .push({'name':'发送','enabled':true,type:'sendWk'})
            obj.button = buttonArr
            arr.push(obj)                
        }
    }
    return arr 
}




/**
 * 获取左边一级菜单
 */
function getLeftApi(){
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/statAreaContent.do'

    let params = {}
    params.areaId = store.getters.areaId
    params.schoolCode = store.getters.schoolId
    params.typeparent = 0


    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })   
}

/**
 * 获取右边目录
 * @param {*} pid 
 * @param {*} type 
 * @param {*} pageNum 
 * @param {*} page 
 */
function getRightDirApi(pid,type,pageNum,page){
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/schoolContent.do'
    let params = {}
    params.pid =  pid
    params.c7 = type
    params.pageNum = pageNum
    params.page = page

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })      
}


/**
 * 获取右边资源
 * @param {*} pid 
 * @param {*} type 
 * @param {*} pageNum 
 * @param {*} page 
 */
function getRightResApi(pid,listType,pageNum,page){
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/schoolResInfo.do'
    let params = {}
    params.menuCode =  pid
    params.listType = listType
    params.deleteState = 0
    if(listType == 1){
        params.orderType = 3
        params.pageNum = pageNum
        params.page = page
    }


    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })      
}


/**
 * 获取微课资源
 * @param {*} area 
 * @param {*} page 
 */
function getRightWkResApi(area,pageNum){
    let url = process.env.MICRO_BASE_PREFIX + '/interface/getResByArea.action'
    let params = {}
    params.areacode =  area
    params.schoolId = store.getters.schoolId
    params.limit = pageNum
    params.start = 0

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })      
}
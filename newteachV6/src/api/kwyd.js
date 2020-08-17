/**
 * 课外阅读相关js
 */

import request from '@/utils/request'
import store from '@/store'
import commonUtils from '@/utils/common'
import {getIconName} from '@/api/api'



export async function getLeftData(){
    let res = await getLeftApi('000111')

    let arr = []
    if(res && res.classes && res.classes.length > 0){
        // for(let item of res.classes){
        //     let obj = {}
        //     obj.name = item.name
        //     obj.code = item.code
        //     obj.childArr = []

        //     let resInfo = await getLeftApi(obj.code)
        //     let childArr = []
        //     if(resInfo && resInfo.classes && resInfo.classes.length > 0){
        //         for(let childItem of resInfo.classes){
        //             let childObj = {}
        //             childObj.name = childItem.name
        //             childObj.code = childItem.code
        //             childArr.push(childObj)                    
        //         }
        //     }
            
        //     obj.childArr = childArr
        //     arr.push(obj)
        // }
        for(let item of res.classes){
            let obj = {}
            obj.name = item.name
            obj.code = item.code
            obj.type = 1
            arr.push(obj)

            let resInfo = await getLeftApi(obj.code)            
            if(resInfo && resInfo.classes && resInfo.classes.length > 0){
                for(let childItem of resInfo.classes){
                    let childObj = {}
                    childObj.name = childItem.name
                    childObj.code = childItem.code
                    childObj.type = 2
                    arr.push(childObj)                    
                }
            }
        }        
    }
    return arr
}



/**
 * 获取目录树
 * @param {*} parentCode 
 * @param {*} menuCode 
 */
async function getLeftApi(parentCode,menuCode){
    // let url = process.env.PLS_BASE_PREFIX + '/interfaces/sourceMenuSchool.do'

    // let params = {}
    // params.menuType = '0:2'
    // params.bcode = '000111'
    // params.typeparent = 0
    // params.type = 'json'


    let url = process.env.PLS_BASE_PREFIX + '/youjiao/baceContent.do'

    let params = {}
    params.parentCode = parentCode
    // params.menuCode = '00011101'


    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })   
}

export async function getRightResData(menuCode,pageNum,page){
    //先获取是否有下一级目录
    let res = await getLeftApi(menuCode)

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
    let result = {}
    if(dirArr.length == 0){
        let resObj = await getRightResDataByPage(menuCode,pageNum,page)
        result.resArr = resObj.resArr
        result.resTotal = resObj.resTotal
    }
    
    result.dirArr = dirArr
    
    return result
}


/**
 * 获取资源
 * @param {*} menuCode 
 * @param {*} pageNum 
 * @param {*} page 
 */
export async function getRightResDataByPage(menuCode,pageNum,page){
    let result = {}
    let resArr = []
    result.resArr = []
    result.resTotal = 0
    let resData = await getRightResApi(menuCode,1,pageNum,page)
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

            obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'rtitle':obj.title,'resType':1}}
            resArr.push(obj)
        }
        //获取总条数
        let resTotal = await getRightResApi(menuCode,0,pageNum,page)
        result.resTotal = resTotal.ResInfo
        result.resArr = resArr
    }    
    return result
}




/**
 * 获取资源列表
 * @param {*} menuCode 
 * @param {*} listType 
 * @param {*} pageNum 
 * @param {*} page 
 */
function getRightResApi(menuCode,listType,pageNum,page){
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/publicResInfo.do'
    let params = {}
    params.schoolId = 
    params.menuCode = menuCode
    params.listType = listType
    if(listType == 1){
        params.pageNum = pageNum
        params.page = page
    }

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })      
}
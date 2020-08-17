/**
 * 升学考试
 */

import request from '@/utils/request'
import store from '@/store'
import {getIconName} from '@/api/api'
import commonUtils from '@/utils/common'


/**
 * 获取升学考试tab标签
 */
export function getSxksTab(){
    let arr = []
    let tabArr = store.getters.mainMenu.filter(item => item.name == store.getters.curModule)
    if(tabArr.length > 0){
        if(tabArr[0].childArr.length > 0){            
            for(let [index,item] of tabArr[0].childArr.entries()){
                let obj = {}
                obj.name = item.name
                obj.menuid = item.menuid                
                obj.pid = ''
                if(item.menuid == '03.51.01'){
                    obj.pid = '000147'
                }else if(item.menuid == '03.51.02'){
                    obj.pid = '000148'
                }else if(item.menuid == '03.51.03'){
                    obj.pid = '000149'
                }
                arr.push(obj)
            }
        }else{
            alert('当前模块没有二级栏目')
        }
    }else{
        alert('获取不到当前模块')
    }

    return arr
}

/**
 * 递归获取接口（不建议使用，递归效率不高）
 * @param {*} res 
 */
export async function digui(res){
    let arr = []
    if(res && res.classes && res.classes.length > 0){
        for(let item of res.classes){
            if(item.code.length <= 10){
                let obj = {}
                obj.title = item.name
                obj.ksCode = item.code

                if(item.code.length > 10){
                    return arr
                }
                obj.childArr = []
                let result = await showSxksRes(item.code)
                obj.childArr = await digui(result)
                arr.push(obj)
            }else{
                return arr
            }
        }
    }
    return arr
}

/**
 * 获取弹出面板的菜单列表
 * @param {*} res 
 */
export async function formatSxksRes(res){
    let arr = []
    if(res && res.classes && res.classes.length > 0){
        for(let item of res.classes){
            let obj = {}
            obj.title = item.name
            obj.ksCode = item.code
            obj.childArr = []

            
            let result = await showSxksRes(item.code)
            if(result && result.classes && result.classes.length > 0){
                for(let second of result.classes){
                    let secondObj = {}
                    secondObj.title = second.name
                    secondObj.ksCode = second.code
  
                    // let resultThird = await showSxksRes(item.code)
                    // if(resultThird && resultThird.classes && resultThird.classes.length > 0){
                    //     for(let third of resultThird.classes){
                    //         let thirdObj = {}
                    //         thirdObj.title = third.name
                    //         thirdObj.ksCode = third.code
                    //         secondObj.childArr.push(thirdObj)
                    //     }
                    // }                    
                    obj.childArr.push(secondObj)
                }
            }
            arr.push(obj)
        }
    }
    return arr
}

/**
 * 获取左边菜单面板的菜单列表
 * @param {*} res 
 */
export function formatSxksResOnce(res){
    let arr = []
    if(res && res.classes && res.classes.length > 0){
        for(let item of res.classes){
            let obj = {}
            obj.title = item.name
            obj.ksCode = item.code
            arr.push(obj)
        }
    }
    return arr
}

/**
 * 展示升学考试栏目下的资源
 * @param {*} pid 小升初：000147；中考专题：000148；高考专题：000147；
 */
export function showSxksRes(pid){
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/baceContent.do'
    let params = {}
    let obj = {}
    obj.parentCode = pid
    obj.listType = 0
    params.data = JSON.stringify(obj)

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

/**
 * 获取当前栏目下的资源
 * @param {*} ksId 
 */
export function getSxksResApi(ksId){
    // let url = process.env.PLS_BASE_PREFIX + '/interfaces/baseresources.do'
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/publicResInfo.do'
    let params = {}
    params.menuCode = ksId
    params.pageNum = 1000
    params.page = 1
    params.luceneOrder = 1
    params.lucene = 1

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

/**
 * 获取升学考试资源
 * @param {*} ksId 
 */
export async function getSxksResData(ksId){
    let res = await getSxksResApi(ksId)
    let arr = []
    for(let item of res.ResInfo){
        let obj = {}
        obj.title = item.RTitle
        obj.icon = ''
        obj.formatMark = ''
        obj.rcode = item.RCode
        let formatMark = item.RFormatMark.toLowerCase()
        obj.formatMark = formatMark
        if(obj.formatMark != ''){
            let iconFormat = getIconName(formatMark)
            obj.icon = require(`@/assets/images/icon/res/${iconFormat}.png`)
        }else{
            obj.icon = require('@/assets/images/icon/res/blank.png')
        }
        let buttonArr = []
        // buttonArr .push({'name':'发送作业','enabled':true,'type':1})
        obj.button = buttonArr
        obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'rtitle':obj.title,'resType':1}}
        arr.push(obj)
    }
    return arr
}
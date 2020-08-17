/**
 * 教学云盘相关
 */
import request from '@/utils/request'
import store from '@/store'
import commonUtils from '@/utils/common'
import {getIconName} from '@/api/api'
import { getPersonalPractice, getCurHomeworkRes} from '@/api/tqmsapi'
import { getPersonalRes } from '@/api/plsapi'
import { formatPreviewRes } from '@/api/kqyx'
import { formatHomeWorkRes } from '@/api/khzy'
import { getCloudResApi,getShareResApi } from '@/api/interface'
import { ABLEFORMAT } from '@/api/constant'

export async function getResData(type,fcode){
    return getResApi(type,fcode)
}


/**
 * 获取教学云盘下的资源
 * @param {*} type 0:本课资源,1:预习,2:课件,3:素材,4:训练,5:网上作业,6:离线作业,7:拓展,8:其他资源
 */
async function getResApi(type,fcode){
   
    let params = {}

    if(type == 0){
        //本课资源
        let res = await getPersonalRes('1,2,3,4',1)
        return formatPersonalRes(res)
    }else if(type == 1){
        //预习(取课前预习接口) 0 代表我的预习
        let res = await formatPreviewRes(0)
        return res
    }else if(type == 2){
        //我的课件
        let res = await getPersonalRes('4',1)
        return formatPersonalRes(res)
    }else if(type == 3){
        //我的素材
        let res = await getPersonalRes('3',1)
        return formatPersonalRes(res)
    }else if(type == 4){
        //我的训练
        let res = await getPersonalPractice()
        let arr = []
        if(res && res.items && res.items.length > 0){
            for(let item of res.items){
                let obj = {}
                obj.title = item.rtitle
                obj.rsType = item.rsType //2系统 6个性 9英语同步练
                obj.useIcon = '' //已发
                if(obj.useFlag == 1){
                    //显示已发标记
                    obj.useIcon = require('@/assets/images/icon/res/yiyong.png')
                }
                obj.icon = require('@/assets/images/icon/xunlian.png')
                if(obj.rsType == 2){
                    obj.icon = require('@/assets/images/icon/xunlian.png')
                }else if(obj.rsType == 6){
                    obj.icon = require('@/assets/images/icon/my.png')
                }

                obj.playJs = {'playName':'zuoda',params:{'rcode':obj.rcode,'rsType':obj.rsType}}

                obj.button = []
                arr.push(obj)
            }
        }
        return arr
    }else if(type == 5){
        //网上作业
        let res = await getCurHomeworkRes(2)
        let arr = []
        if(res && res.items && res.items.length > 0){
            for(let item of res.items){
                let obj = {}
                obj = formatHomeWorkRes(obj, item)
                
                //判断按钮
                let buttonArr = []
                buttonArr .push({'name':'发送','enabled':true,'type':'fasong'})
                if(type == 5){
                    //我的作业
                    if(item.classPublishStatus == 1){
                        buttonArr .push({'name':'反馈','enabled':true,'type':'fankui'})
                    }else{
                        buttonArr .push({'name':'反馈','enabled':false,'type':'fankui'})
                    }
                }
                obj.button = buttonArr
                arr.push(obj)
            }
        }
        return arr
    }else if(type == 6){
        //离线作业
        let res = await getCurHomeworkRes(3)
        let arr = []
        if(res && res.data && res.data.length > 0){
            for(let item of res.data){
                // let obj = {}
                // // obj = formatHomeWorkRes(obj, item)

                
                // //判断按钮
                // let buttonArr = []
                // buttonArr .push({'name':'发送','enabled':true,'type':'fasong'})
                // obj.button = buttonArr
                // arr.push(obj)

                let obj = {}
                obj.title = item.title
                obj.rcode = item.id
                obj.time = item.time
                obj.subject = item.subject
                obj.icon = require('@/assets/images/icon/lixian.png')
                obj.class_info = item.class_info

                //判断按钮
                let buttonArr = []
                buttonArr .push({'name':'发送','enabled':true,'type':'fasong','playJs':{'playName':'fasong',params:{'rcode':obj.rcode}}})

                for(let val of item.class_info){
                    if(val.id.indexOf(store.getters.userSelectClassId) != -1){
                        buttonArr .push({'name':'反馈','enabled':true,'type':'fankuiOffline','playJs':{'playName':'fankuiOffline',params:{'rcode':obj.rcode,'title':obj.title}}})
                    }
                }
                obj.button = buttonArr
                obj.playJs = {'playName':'playOfflineHomeworkRes','remark':'离线作业播放',params:{'rcode':obj.rcode,'title':obj.title}}
                arr.push(obj)                
            }
        }
        return arr
    }else if(type == 7){
        //拓展
        let res = await getPersonalRes(4,1)
        return formatPersonalRes(res)
    }else if(type == 8){
        //其他资源
        let res = await getPersonalRes('',2,fcode)
        return formatPersonalRes(res)
    }
    return null
}


function formatPersonalRes(res){
    let arr = []
    if(res && res.data && res.data.length > 0){
        for(let item of res.data){            
            let obj = {}
            obj.title = item.filenamewithtype
            obj.icon = ''
            obj.rcode = item.fcode
            let formatMark = item.filetype.toLowerCase()
            obj.formatMark = formatMark
            obj.filetype = item.filetype
            obj.parentfcode=item.parentfcode
            //storetypenum 0云盘 1系统
            if(item.storetypenum == 1){
                obj.resType = 1
            }else{
                obj.resType = 3
            }
            obj.pvname = 'tls_jxyp_ypzy'
            if(formatMark != 'null' && formatMark != ''){
                if(formatMark=="file"){
                    formatMark="folder";
                }
                let iconFormat = getIconName(formatMark)
                if(formatMark=='folder'){
                    obj.icon = require(`@/assets/images/icon/res/folder.gif`)
                }else{
                    obj.icon = require(`@/assets/images/icon/res/${iconFormat}.png`)
                }                
            }else{
                obj.icon = require('@/assets/images/icon/res/blank.png')
            }
            //按钮数组
            let buttonArr = []
            // buttonArr .push({'name':'发送作业','enabled':true,'type':1})
            obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'title':obj.title,'resType':obj.resType}}
            obj.button = buttonArr
            arr.push(obj)
        }
    }
    return arr
}


export async function getCloudResData(fileFormat,teachnumber,currPage,pageSize,parentfcode){
    let resultObj = {}
    let arr = []
    let result = []
    let fileTotal = 0
    try{
        let res = await getCloudResApi(fileFormat,teachnumber,currPage,pageSize,parentfcode)
        if(res.files && res.files.length > 0){
            result = res.files
            fileTotal = res.fileTotal
        }
    }catch(e){
        console.log(e)
    }

    let isSchoolbag = store.getters.isSchoolbag //是否支持电子书包
    let isHavingClass = store.getters.isHavingClass //是否上课

    if(result.length > 0){
        for(let item of result){
            let obj = {}
            obj.title = item.fileName
            obj.type = item.type //0代表文件，1代表文件夹
            obj.icon = ''
            
            obj.fileType = item.fileType
            obj.shareType = item.shareType //1共享标识
            obj.attType = item.attType //0,一般文件；1，主文件；2，附件文件

            obj.RFormatMark = item.fileType.toLowerCase()

            if(typeof item.c1 != 'undefined' && item.c1 != ''){
                //系统
                obj.resType = 1
                obj.rcode = item.c1
            }else{
                //云盘
                obj.resType = 3
                obj.rcode = item.fCode
            }

            if(item.type==1){
                obj.icon = require(`@/assets/images/icon/res/folder.gif`)
            }else{
                let formatMark = item.fileType.toLowerCase()
                formatMark = getIconName(formatMark)
                obj.icon = require(`@/assets/images/icon/res/${formatMark}.png`)
                obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'title':obj.title,'resType':obj.resType}}
            }
            
            
            let buttonArr = []
            if(isSchoolbag && isHavingClass){
                if(ABLEFORMAT.indexOf(item.fileType.toLowerCase())!=-1){
                    buttonArr .push({'name':'发起探究','enabled':true,'type':'wenjiantanjiu','pvname':'tls_ktjx_fspb','params':{"title":obj.title,"rcode":obj.rcode,"fileType":obj.resType,"formatMark":obj.RFormatMark}})
                }                    
            }                

            obj.button = buttonArr
            arr.push(obj)
        }
    }

    resultObj.res = arr
    resultObj.pageTotal = Math.ceil(fileTotal/pageSize)
    return resultObj
}


/**
 * 获取共享文件夹列表
 * @param {*} currPage 
 * @param {*} pageNum 
 */
export async function getShareResData(currPage,pageNum,rootCode,rcode){
    let resultObj = {}
    let arr = []
    let result = []
    let fileTotal = 0
    try{
        let res = await getShareResApi(currPage,pageNum,rootCode,rcode)
        if(res.teacherFiles && res.teacherFiles.length > 0){
            result = res.teacherFiles
            fileTotal = res.fileTotal
        }
    }catch(e){
        console.log(e)
    }

    if(result.length > 0){
        for(let item of result){
            let obj = {}
            obj.title = item.filename
            obj.type = item.noforder //0代表文件，1代表文件夹
            obj.icon = ''
            
            obj.fileType = item.filetype
            obj.attType = item.attType //0,一般文件；1，主文件；2，附件文件
            obj.rootCode = item.shareRootFcode

            if(typeof item.c1 != 'undefined' && item.c1 != ''){
                //系统
                obj.resType = 1
                obj.rcode = item.c1
            }else{
                //云盘
                obj.resType = 3
                obj.rcode = item.fcode
            }


            if(obj.type==1){
                obj.icon = require(`@/assets/images/icon/res/folder.gif`)
            }else{
                let formatMark = item.filetype.toLowerCase()
                formatMark = getIconName(formatMark)
                obj.icon = require(`@/assets/images/icon/res/${formatMark}.png`)
                obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'title':obj.title,'resType':obj.resType}}
            }

            arr.push(obj)
        }
    }

    resultObj.res = arr
    resultObj.pageTotal = Math.ceil(fileTotal/pageNum)
    return resultObj
}

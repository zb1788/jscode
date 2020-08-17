/**
 * 校本资源
 */

 
import request from '@/utils/request'
import store from '@/store'
import commonUtils from '@/utils/common'
import {getIconName} from '@/api/api'

/**
 * 获取校本资源一级栏目标签
 */
export function getXbzyTab(){
    let arr = []
    let tabArr = store.getters.mainMenu.filter(item => item.name == store.getters.curModule)
    if(tabArr.length > 0){
        if(tabArr[0].childArr.length > 0){
            for(let item of tabArr[0].childArr){
                let obj = {}
                obj.name = item.name
                obj.menuid = item.menuid                
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
 * 获取教材资源tab标签（第一个栏目的子菜单）
 */
export function getJczyTab(){
    let arr = [{'name':'全部',type:'all',pvname:'tls_sxks_jczy'},{'name':'课件',type:'RT003',pvname:'tls_sxks_jczy'},{'name':'素材',type:'RT002',pvname:'tls_sxks_jczy'},{'name':'习题',type:'RT004',pvname:'tls_sxks_jczy'},{'name':'拓展',type:'RT105',pvname:'tls_sxks_jczy'},{'name':'电子教材',type:'RT106',pvname:'tls_sxks_jczy'}]
    return arr
}

/**
 * 格式化左边树菜单
 * @param {*} mainMenu 
 * @param {*} secondMenu 
 */
export function formateLeftTree(mainMenu,secondMenu){
    let arr = []
    for(let [index,item] of mainMenu.entries()){
        let obj = {}
        obj.childArr = []
        obj.title = item.name
        obj.menuid = item.menuid
        if(index == 0){
            obj.childArr = secondMenu
        }else{
            if(index == 1){
                obj.childArr.push({'name':'全部','type':'all',pvname:'tls_sxks_ztzy'})
            }
            if(index == 2){
                obj.childArr.push({'name':'全部','type':'all',pvname:'tls_sxks_wkzy'})
            }            
        }
        arr.push(obj)
    }
    return arr
}

/**
 * 获取教材资源栏目下的资源
 */
export async function getXbzyResData(typeCode){
    let arr = []
    try{
        let res = await getXbzyResApi(typeCode)
        if(res && res.ResInfo && res.ResInfo.length > 0){
            for(let item of res.ResInfo){
                //跳过教案
                if(item.RTypecode == 'RT001'){
                    continue
                }
                let obj = {}
                obj.title = item.RTitle
                obj.desc = item.RDesc
                let RFormatMark = item.RFormatMark.toLowerCase()
                obj.RFormatMark = RFormatMark
                obj.rcode = item.RCode
                typeof item.RExt6 == 'undefined' ? obj.ext6 = '' : obj.ext6 = item.RExt6
                obj.icon = '' //资源图标
                //判断是否加精
                obj.jingIcon = false
                if(obj.ext6 != ''){
                    obj.jingIcon = true
                }
    
                if(obj.RFormatMark!="null" && obj.RFormatMark!=""){
                    let iconFormat = getIconName(obj.RFormatMark)
                    obj.icon = require(`@/assets/images/icon/res/${iconFormat}.png`)
                }else{
                    obj.icon =  require('@/assets/images/icon/res/blank.png')
                }
                
                obj.fileType = 1 //1普通资源2教师文件夹资源3电子教材
                if("RT106" == item.RTypecode && "xml" == obj.RFormatark){
                    //电子教材
                    obj.fileType = 3
                }
    
                //按钮数组
                let buttonArr = []
                buttonArr .push({'name':'推荐','enabled':true,'type':'tuijian'})
                //此处省略电子书包逻辑（发起探究）
                obj.button = buttonArr

                //是否需要密码 wordFlag 0 正常；1 需要输入密码               
                obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'rtitle':obj.title,'resType':1,'wordFlag':item.wordFlag}}
                
                arr.push(obj)        
            }
        }        
    }catch(e){
        console.log(e)
    }
    
    return arr
}

/**
 * 获取专题资源下的资源
 * @param {*} flag 1-表示对资源不进行分类 2-进行分类(首次默认1)
 * @param {*} ksType 资源类型0：教学资源 1：专题资源
 */
export async function getZtzyResData(pid,flag,ksType){
    //先获取目录，如果目录为空，就获取目录下的资源
    let res = await getZtzyResApi(pid,flag,ksType)

    let dirArr = []
    let resArr = []
    if(res && res != 'undefined' && res.classes.length > 0){
        //展示目录
        for(let item of res.classes){
            let obj = {}
            obj.code = item.code
            obj.name = item.name
            obj.ks_type = item.ks_type
            dirArr.push(obj)
        }
    }else{
        //获取资源
        let xbRes = await getschoolResInfoApi(pid)
        console.log(xbRes)
        if(xbRes && xbRes.ResInfo && xbRes.ResInfo.length > 0){
            for(let item of xbRes.ResInfo){
                let obj = {}
                obj.title = item.RTitle
                obj.rcode = item.RCode
                let formatMark = item.RFormatMark.toLowerCase()
                obj.formatMark = formatMark
                if(formatMark != 'null' && formatMark != ''){
                    let iconFormat = getIconName(formatMark)
                    obj.icon = require(`@/assets/images/icon/res/${iconFormat}.png`)
                }else{
                    obj.icon = require('@/assets/images/icon/res/blank.png')
                }

                //是否需要密码 wordFlag 0 正常；1 需要输入密码               
                obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'rtitle':obj.title,'resType':1,'wordFlag':item.wordFlag}}                
                resArr.push(obj)
            }            
        }
    }
    let result = {}
    result.dirArr = dirArr
    result.resArr = resArr
    return result
}


/**
 * 获取校本资源下的微课资源
 */
export async function getWkzyResData(){
    let res = await getWkzyResApi()
    let arr = []
    if(res && res.items && res.items.length > 0){
        for(let item of res.items){
            let obj = {}
            obj.title = item.coursename
            obj.rcode = item.id
            obj.icon = require('@/assets/images/icon/res/mp4.png')
            //校本资源种的微课也属于本地微课,resType传递为bdwk
            obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'rtitle':obj.title,'resType':'bdwk'}}

            let buttonArr = []
            buttonArr .push({'name':'发送','enabled':true,type:'sendWk'})
            obj.button = buttonArr
            arr.push(obj)                
        }
    }
    return arr
}





/**
 * 获取当前栏目下的资源
 */
export function getXbzyResApi(typeCode){

    let url = process.env.PLS_BASE_PREFIX + '/youjiao/publicResInfo.do'
    let params = {}
    let obj = {}
    obj.menuCode = store.getters.ksId
    obj.cpCode = store.getters.schoolId
    obj.listType = 1
    if(typeCode=='all'){
	    obj.typeCode = ''
	}else{
        obj.typeCode = typeCode
    }    
    obj.pageNum = 0
    obj.userName = store.getters.teacherNumber
    obj.orderby = 4
    obj.userObj = "OBJ002"
    obj.yun = 1
    obj.hashcode = 1    
    obj.deleteState = 0
    
    params.data = JSON.stringify(obj)

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}



/**
 * 获取专题资源(目录)
 * flag:1-表示对资源不进行分类 2-进行分类(首次默认1)
 * ksType:资源类型0：教学资源 1：专题资源
 */
export function getZtzyResApi(pid,flag,ksType){
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/schoolContent.do'
    let params = {}
    params.pid = pid

    if(flag != 1){
        params.c7 = ksType
    }

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}


/**
 * 获取目录下的资源
 * menuCode 代表最后一个的目录code
 */
export function getschoolResInfoApi(menuCode){
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/schoolResInfo.do'
    let params = {}
    params.schoolCode = store.getters.schoolId
    params.listType = 1
    params.menuCode = menuCode
    params.deleteState = 0
    params.pageNum = 150
    params.page = 1
    params.orderType = 3



    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}



/**
 * 获取校本资源下的微课资源
 */
export function getWkzyResApi(){
    let url = process.env.MICRO_BASE_PREFIX + '/interface/getResByChapterId.action'
    let params = {}

    params.schoolId = store.getters.schoolId
    params.chapterId = store.getters.ksId
    params.start = 0
    params.limit = 20

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })

}
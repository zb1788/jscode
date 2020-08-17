/**
 * 课堂教学相关api
 */
import request from '@/utils/request'
import store from '@/store'
import commonUtils from '@/utils/common'
import { getIconName } from '@/api/api'
import { getDeviceType} from '@/api/client'
import { ABLEFORMAT } from '@/api/constant'
//获取课时包内容
function getClassHourRes(){
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/queryClassHourPackByUserName.do'
    let params = {}
    params.classHourId = store.getters.classHourId
    params.userName = store.getters.teacherNumber
    params.classHourIcon = 1
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}
//获取课时包中的题库资源详细信息
function getTqmsResInfo(params){
    let url = process.env.TQMS_BASE_PREFIX + '/tqms/interface/practice/practiceCurriculumResources.action'
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

//处理课时包数据
export async function formatClassHourRes(){
    let res = await getClassHourRes()
    console.log(res)
    let resArr = [] 
    let tqmsResArr = []
    let plsAppTypeIdArr = []
    let tqmsAppTypeIdArr = []
    let tqmsParamsArr = []
    
    let resList = []
    
    if(res.result == 1 && res.linkedResList && res.linkedResList.length > 0){
        for(let item of res.linkedResList){
            //去重(pls返回的资源可能有重复的)
            // console.log(resArr)
            let index = resArr.findIndex(val=>val.destCode == item.destCode)
            // console.log(index)
            if(index != -1){
                continue
            }
            let obj = {}
            typeof item.appTypeDesc == 'undefined' ? obj.appTypeDesc = '' : obj.appTypeDesc = item.appTypeDesc 
            typeof item.appTypeId == 'undefined' ? obj.appTypeId = '' : obj.appTypeId = item.appTypeId
            typeof item.ext6 == 'undefined' ? obj.ext6 = '' : obj.ext6 = item.ext6
            typeof item.downloadNum == 'undefined' ? obj.downloadNum = 0 : obj.downloadNum = item.downloadNum //pls资源下载数量
            typeof item.playUrl == 'undefined' ? obj.playUrl = '' : obj.playUrl = item.playUrl


            obj.appTypeShowType = item.appTypeShowType
            obj.destCode = item.destCode
            obj.destTitle = item.destTitle
            obj.destType = item.destType
            obj.formatMark = item.formatMark
            obj.iconTitle = item.iconTitle
            obj.iconType = item.iconType
            obj.typeCode = item.typeCode
            obj.rmsShowType = item.rmsShowType
            

            
            if(obj.destType == 2 || obj.destType == 6 || obj.destType == 9 ){
                obj.type = 'tqms'
                obj.rtype = 'p'
                tqmsAppTypeIdArr.push(obj.appTypeId)
                //请求题库参数数组
                let tqmsParamsObj = {}
                tqmsParamsObj.rcode = obj.destCode
                tqmsParamsObj.rsType = obj.destType +''
                tqmsParamsArr.push(tqmsParamsObj)
                // tqmsParams += '{"rcode":"'+obj.destCode+'","rsType":"'+obj.destType+'"},'
            }else{
                obj.type = 'pls'
                obj.rtype = 'r'
                plsAppTypeIdArr.push(obj.appTypeId)
            }
            resArr.push(obj)
        }
        console.log(tqmsParamsArr)
console.log(JSON.stringify(tqmsParamsArr))
console.log(encodeURIComponent(JSON.stringify(tqmsParamsArr)))

 
        console.log(resArr)
        console.log(tqmsResArr)


        let isSchoolbag = store.getters.isSchoolbag //是否支持电子书包
        // let deviceType = getDeviceType(); //设备类型，从客户端获取
        let isHavingClass = store.getters.isHavingClass //是否上课


        //循环每条课时包信息，格式化数据
        for(let item of resArr){
            let obj = {}
            item.ext6 == 'ZYHOT' ? obj.isHost = true : obj.isHost = false //资源是否加精
            obj.iconType = '' //资源图片url
            obj.title = '' //资源标题
            obj.desc = '' //资源描述
            obj.destTitle = item.destTitle
            obj.formatMark = ''
            if(typeof item.formatMark != 'undefined'){
                let formatMark = item.formatMark.toLowerCase() 
                obj.formatMark = formatMark //pls资源格式
            }
            obj.downloadNum = item.downloadNum //pls资源下载数量
            obj.degree = 0 //题库资源热度
            obj.totalNum = 0 //题库资源数量
            obj.rcode = item.destCode //资源编码
            obj.rtype = item.rtype
            obj.zuodaUrl = ''   //作答url
            obj.fankuiUrl = ''  //反馈url
            obj.isDel = false   //是否无用数据（题库那边查询不到）
            obj.typeCode = item.typeCode
            obj.destType = item.destType 
            obj.playUrl = item.playUrl
            obj.type = item.type //是PLS资源还是题库资源
            obj.isShowPlus = false //是否展示加号
            obj.isShowJian = false //是否展示减号
            obj.rmsShowType = item.rmsShowType //1其他,2名师3个性
            obj.playJs = {'playName':''}
            obj.button = []
            //判断题库展示按钮
            let buttonArr = []
            if(item.type == 'pls'){
                //pls相关
                //1.图标为类型和热度
                obj.iconType = item.iconType
                obj.title = item.iconTitle                
                /**
                 *描述：
                 *  1.如果appTypeId为空就取destTitle
                 *  2.否则如果不为空并且appTypeShowType=2且appTypeDesc!=''且appTypeId唯一就取appTypeDesc
                 *  3.否则取destTitle
                 */                 
                if(item.appTypeId == ''){
                    obj.desc = item.destTitle
                }else{
                    if(item.appTypeShowType == 2 && item.appTypeDesc != '' && plsAppTypeIdArr.filter(val => val == item.appTypeId).length <= 1){
                        obj.desc = item.appTypeDesc
                    }else{
                        obj.desc = item.destTitle
                    }
                }

                obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'formatMark':obj.formatMark,'resType':obj.destType,'title':obj.desc}}

                if('RT106' != obj.typeCode && 'xml' != obj.formatMark && ABLEFORMAT.indexOf(obj.formatMark)!=-1){
                    if(isSchoolbag && isHavingClass){
                        let params = {}
                        params.title = item.destTitle
                        params.rcode = obj.rcode
                        params.formatMark = obj.formatMark
                        if(obj.destType == 3){
                            //云盘
                            params.fileType = 3
                        }else{
                            params.fileType = 1
                        }
                        buttonArr .push({'name':'发起探究','enabled':true,'type':'wenjiantanjiu','pvname':'tls_ktjx_fspb','params':params})
                    }
                }else{
                    //电子教材
                    obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'resType':obj.destType,'title':'电子教材'}}
                }

                if(obj.destType == 10){
                    //新增h5资源
                    obj.title = item.destTitle;
                    obj.desc = typeof item.destDesc != 'undefined'?item.destDesc:''
                    obj.playJs = {'playName':'playLinkRes',params:{'resFormat':obj.formatMark,'playUrl':obj.playUrl}}
                }

                if(buttonArr.length > 0){
                    obj.isShowPlus = true
                }
            }else{
                //题库相关
                //1.图标为数量和热度
                obj.iconType = item.iconType
                obj.degree = 0
                obj.totalNum = 0
                obj.title = ''
                obj.desc = item.destTitle
                if(item.destType == 2 || item.destType == 6){
                    //题库
                    obj.playJs = {'playName':'zuoda',params:{'rcode':item.destCode,'rsType':item.destType,'isEbook':0}}                       
                }else{
                    //英语同步练
                    obj.playJs = {'playName':'zuodaEng',params:{'rcode':item.destCode,"rsType":9}}                                             
                }
            }
            obj.button = buttonArr
            obj.isShowButton = false
            resList.push(obj)
        }
        //去掉从题库取不到内容的
        resList = resList.filter(item => item.isDel == false)
        //去掉多余15条的
        resList = resList.filter((item,index) => index <15)
    }

    let result = {}
    result.resList = resList
    result.tqmsParamsArr = tqmsParamsArr
    result.resClassHour = res.classHour
    result.tqmsAppTypeIdArr = tqmsAppTypeIdArr


    console.log("result=================result")
    console.log(result)
    return result
}



/**
 * 获取课时包题库资源信息
 * @param {*} tqmsParamsArr 要去请求题库的参数数组
 * @param {*} resClassHour pls接口返回的课时信息
 */
export async function getTqmsClassHourRes(tqmsParamsArr,resClassHour){

    console.log(tqmsParamsArr)
    console.log(resClassHour)
    let tqmsResArr = []

    if(tqmsParamsArr.length > 0){
        //包含题库资源
        let params = {}
        if(resClassHour){
            params.lessionId = resClassHour.ksId
            params.username = store.getters.teacherNumber
            params.classId = store.getters.userSelectClassId
            params.deviceType = 'lecture'
            params.source = 1
            params.papers = encodeURIComponent(JSON.stringify(tqmsParamsArr))
            let tqmsRes = await getTqmsResInfo(params)
            if(tqmsRes&&tqmsRes.success&&tqmsRes.data&&tqmsRes.data.length>0){
                for(let item of tqmsRes.data){
                    var obj = {};
                    obj.typeCode = item.typeCode;
                    obj.feedbackFlag = item.feedbackFlag;//是否有反馈
                    obj.degree = item.hotDegree;//热度
                    obj.totalNum = item.totalNum;//数量
                    obj.iconTitle = item.iconTitle;//栏目类型
                    obj.iconDesc = item.iconDesc;//栏目描述
                    typeof item.iconType == 'undefined' ? obj.iconType = store.getters.transferProtocol + store.getters.domainConfig["QBMS"] + '/tqms/pages/homeworkandtraining/images/icon/classhour/qxxl.png' : obj.iconType = store.getters.transferProtocol + store.getters.domainConfig["QBMS"] + '/tqms/pages/homeworkandtraining/images/icon/classhour/' + item.iconType +'.png'//栏目图片
                    obj.rcode = item.rcode;//题库试卷ID
                    obj.rsType = item.rsType;//2系统 6个性 9英语同步练
                    //obj.hwPaperType = vv.hwPaperType;
                    obj.iconID = item.iconID;
                    obj.iconDesc = item.iconDesc;
                    obj.rtitle = item.rtitle;
                    obj.iconShowStyle = item.iconShowStyle;


                    if(item.rsType != 9){
                        if(item.opt.volumeOfPoints&&item.opt.volumeOfPoints.viewUrl&&item.opt.volumeOfPoints.url){
                            //存在，有登分按钮
                            obj.dengfenViewUrl = item.opt.volumeOfPoints.viewUrl;//预览 弃用
                            obj.dengFenUrl = item.opt.volumeOfPoints.url; //弃用
                            obj.hasDengfen = true;
                        }else{
                            //无登分按钮
                            obj.hasDengfen = false;
                        }
                        if(item.opt.sendEBook&&item.opt.sendEBook.url){
                            //存在，有发送平板按钮
                            obj.sendEBookUrl = item.opt.sendEBook.url;
                            obj.HasSendEBook = true;
                        }else{
                            //无发送平板按钮
                            obj.HasSendEBook = false;
                        }
                    }else{
                        //英语练
                        obj.hasDengfen = true;
                        obj.HasSendEBook = true;
                    }

                    

                    console.log(obj)
                    tqmsResArr[item.rcode] = obj
                }
            }
        }
        
    }
    return tqmsResArr
}

//更新课时包中的题库资源信息
export function updateTqmsClassHourRes(resList,tqmsResArr,tqmsAppTypeIdArr){
    let isSchoolbag = store.getters.isSchoolbag //是否支持电子书包
    let deviceType = getDeviceType(); //设备类型，从客户端获取
    let isHavingClass = store.getters.isHavingClass //是否上课

    let resArr = []
    for(let item of resList){
        if(item.type == 'pls'){
            resArr.push(item)
        }else{
            let buttonArr = []
            let obj ={}
            obj = item
            let tmp = tqmsResArr[item.rcode]
            if(typeof tmp != 'undefined'){
                obj.iconType = tmp.iconType
                obj.degree = tmp.degree
                obj.totalNum = tmp.totalNum
                //题库栏目描述判断,如果iconID唯一,iconShowStyle =2,切描述不为空时显示描述
                commonUtils.isNotEmpty(tmp.iconTitle)?obj.title = tmp.iconTitle:obj.title = ''
                if(tmp.iconShowStyle == 2 && commonUtils.isNotEmpty(tmp.iconDesc) && tqmsAppTypeIdArr.filter(val => val == tmp.iconID).length <= 1){
                    obj.desc = tmp.iconDesc
                }else{
                    if(commonUtils.isNotEmpty(tmp.rtitle)){
                        obj.desc = tmp.rtitle
                    }else{
                        obj.desc = item.destTitle
                    }
                }
        
                if(item.destType == 2 || item.destType == 6){
                    //题库
                    obj.playJs = {'playName':'zuoda',params:{'rcode':item.rcode,'rsType':tmp.rsType,'isEbook':0}}
                    obj.fankuiPlayJs = {'playName':'fankui',params:{'rcode':item.rcode,'rsType':tmp.rsType,'isEbook':0}}
                    // buttonArr .push({'name':'作答','enabled':true,'type':'zuoda','params':obj.playJs})
                    if(tmp.feedbackFlag == 1){
                        buttonArr .push({'name':'反馈','enabled':true,'type':'fankui','params':obj.fankuiPlayJs})
                    }                        
                }else{
                    //英语同步练
                    obj.playJs = {'playName':'zuodaEng',params:{'rcode':item.rcode,"rsType":9}}     
                    // buttonArr .push({'name':'作答','enabled':false,'type':'zuodaEng','params':obj.playJs})   
                    if(tmp.feedbackFlag == 1){
                        let params = {'playName':'fankuiEng',params:{'rcode':item.rcode,"rsType":9}}     
                        buttonArr .push({'name':'反馈','enabled':true,'type':'fankuiEng','params':params})
                    }                                           
                }
                        
                //1.如果设备不混用，答题器就是登分功能，平板就是发到平板功能，
                //2.如果混用（平板+答题器） 根据条件判断是 登分还是发送平板功能
                let buttonDesc = '';//套卷答题当前的功能：1pad 是发送平板功能 2answerTool
                if( deviceType == '0,5' || deviceType == '1,5' || deviceType == '2,5'){
                    //混用状态 按钮名称都叫套卷答题 那就是 0（一代答题卡）的功能是发送平板， 其他的都是登分                
                    let params = {}
                    params.rcode = item.rcode
                    params.rsType = item.destType
                    if(deviceType == '0,5'){
                        //调用发送平板功能
                        buttonDesc = 'pad'
                    }else{
                        //调用登分功能
                        buttonDesc = 'answerTool'
                    }
                }else{
                    //非混用状态，
                    if(deviceType.indexOf('1') != -1 || deviceType.indexOf('2') != -1 ){
                        buttonDesc = 'answerTool'
                    }else if(deviceType.indexOf('5') != -1){
                        buttonDesc = 'pad'
                    }
                }


                if(buttonDesc == 'answerTool'){
                    //出登分功能
                    if(tmp.hasDengfen){
                        //设备类型不为0
                        if( deviceType.indexOf('1') != -1 || deviceType.indexOf('2') != -1){
                            let params = {}
                            params.rcode = item.rcode
                            params.rsType = item.destType
                            params.dengFenUrl = tmp.dengFenUrl //弃用
                            params.dengfenViewUrl = tmp.dengfenViewUrl //弃用
                            // buttonArr .push({'name':'登分','enabled':true,'type':'dengfen','params':params})
                            buttonArr .push({'name':'套卷答题','enabled':true,'type':'dengfen','params':params})
                        }
                    }                    
                }else if(buttonDesc == 'pad'){
                    //出发送平板功能
                    //判断电子书包
                    if(tmp.HasSendEBook){                    
                        if(isSchoolbag){
                            //英语练也可以发送平板了
                            if(isHavingClass == 1 && store.getters.loginStyle == 0){                            
                                if(tmp.rsType != 9){                                
                                    let params = {}
                                    params.rsType = tmp.rsType
                                    params.sendEBookUrl = tmp.sendEBookUrl
                                    buttonArr .push({'name':'套卷作答','enabled':true,'type':'sendToPad','params':params,'pvname':'tls_ktjx_fspb'})
                                }else{
                                    let params = {'playName':'sendToPadEng','params':{'rsType':tmp.rsType,'sendEBookUrl':'','paperId':tmp.rcode}}
                                    buttonArr .push({'name':'套卷作答','enabled':true,'type':'sendToPadEng','params':params,'pvname':'tls_ktjx_fspb'})
                                }                            
                            }
                        }
                    }
                }
        
                if(buttonArr.length > 0){
                    obj.isShowPlus = true
                }
                obj.button = buttonArr
            }else{
                //删除本条资源
                obj.isDel = true
            }  
            resArr.push(obj)  
        }
    }
    return resArr
}


//获取课件/素材/拓展/训练/电子教材下的资源
function getResList(self){
    let url = ''
    let params = {}
    
    if(self.activeIndex==0 || self.activeIndex==1 || self.activeIndex==3 || self.activeIndex==4){
        url = process.env.PLS_BASE_PREFIX + '/youjiao/publicResInfo.do'
        params.menuCode = store.getters.ksId
        params.page = 1
        params.pageNum = 0
        params.listType = 1
        params.userName = store.getters.teacherNumber
        
        if(self.data[self.activeIndex].type == 0){
            params.typeCode = 'RT003' //课件
            params.containfile = 1
        }else if(self.data[self.activeIndex].type == 1){
            params.typeCode = 'RT002,RT004' //素材
            params.containfile = 1
        }else if(self.data[self.activeIndex].type == 3){
            params.typeCode = 'RT105' //拓展
            params.containfile = 1
        }else if(self.data[self.activeIndex].type == 4){
            params.typeCode = 'RT106' //电子教材
        }
    }else if(self.data[self.activeIndex].type==2){
        //训练
        params.lessionId = store.getters.ksId
        params.username = store.getters.teacherNumber
        params.classId = store.getters.userSelectClassId
        params.deviceType = 'lecture'
        params.source = 3

        url = process.env.TQMS_BASE_PREFIX + '/tqms/interface/practice/practiceCurriculumResources.action'    
    }else if(self.data[self.activeIndex].type == 7){
        //现在已经没有我的素材了
        url = process.env.PLS_BASE_PREFIX + '/teacherfile/getfilelist.do'    
        params.parentfcode = ''
        params.pageindex = 1
        params.pagesize = 100
        params.kscode = store.getters.ksId
        params.teachernumber = store.getters.teacherNumber
        params.noforder = 2
        params.place = 4
        params.resComeType = 3
    }

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

//获取课件/素材/拓展/训练/电子教材下的资源
export async function getResListData(self){
    let res
    try{
        res = await getResList(self)
    }catch(e){
        console.log(e)
    }
    
    let data = []
    if(self.activeIndex==0 || self.activeIndex==1 || self.activeIndex==3 || self.activeIndex==4){
        data = formatPlsRes(res)
    }else if(self.data[self.activeIndex].type==2){
        data = formaTqmsRes(res)
    }else if(self.data[self.activeIndex].type==7){
        //现在已经没有我的素材了
    }

    return data
}

//处理pls资源
function formatPlsRes(res){
    //包含个人的资源和系统资源（个人资源放到前面）
    let arr = []
    let isSchoolbag = store.getters.isSchoolbag //是否支持电子书包
    let isHavingClass = store.getters.isHavingClass //是否上课

    if(res && ((res.ResInfo&&res.ResInfo.length > 0)|| (res.teacherFiles&&res.teacherFiles.length > 0))){
        if(res.teacherFiles && res.teacherFiles.length > 0){
            //遍历个人文件夹的资源
            for(let item of res.teacherFiles){
                let obj = {}
                obj.title = item.filename
                obj.RFormatMark = ''
                if(typeof item.filetype != 'undefined'){
                    let RFormatMark = item.filetype.toLowerCase()
                    obj.RFormatMark = RFormatMark
                }
                
                typeof item.RExt6 == 'undefined' ? obj.ext6 = '' : obj.ext6 = item.RExt6
                obj.icon = '' //资源图标
                //判断是否加精
                obj.jingIcon = false
                if(obj.ext6 != ''){
                    obj.jingIcon = true
                }

                if(obj.RFormatMark!="null" && obj.RFormatMark!=""){
                    obj.icon = item.iconType
                }else{
                    obj.icon = require('@/assets/images/icon/res/blank.png')
                }

                // if(obj.RFormatMark!="null" && obj.RFormatMark!=""){                                                            
                //     let iconFormat = getIconName(obj.RFormatMark)
                //     obj.icon = require(`@/assets/images/icon/res/${iconFormat}.png`)
                // }else{
                //     obj.icon = require('@/assets/images/icon/res/blank.png')
                // }
                
                obj.resType = 1 //1普通资源3教师文件夹资源,2电子教材
                obj.rcode = ''
                if(item.c1 && item.c1!=""){
                    obj.rcode = item.c1
                }else{
                    obj.rcode = item.fcode
                    if(item.storeType == 0){
                        //教师文件夹
                        obj.resType = 3
                    }
                }

                if("RT106" == item.RTypecode && "xml" == obj.RFormatark){
                    //电子教材(理论上不会有)
                    obj.resType = 1
                }

                //此处省略电子书包逻辑（发起探究）
                let buttonArr = []
                if(isSchoolbag && isHavingClass){
                    if(ABLEFORMAT.indexOf(obj.RFormatMark)!=-1){
                        buttonArr .push({'name':'发起探究','enabled':true,'type':'wenjiantanjiu','pvname':'tls_ktjx_fspb','params':{"title":obj.title,"rcode":obj.rcode,"fileType":obj.resType,"formatMark":obj.RFormatMark}})
                    }                    
                }                

                obj.button = buttonArr
                obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'title':obj.title,'resType':obj.resType}}
                arr.push(obj)
            }
        }

            //新增课堂活动资源
            if(res.gameInfos&&res.gameInfos.length>0){
                for(let item of res.gameInfos){
                    let obj = {}
                    obj.title = item.topic
                    obj.desc = item.remark
                    //写死html
                    obj.RFormatMark = 'html'                    
                    obj.linkType = item.linkType
                    obj.playUrl = item.playUrl
                    typeof item.RExt6 == 'undefined' ? obj.ext6 = '' : obj.ext6 = item.RExt6
                    obj.icon = '' //资源图标
                    //判断是否加精
                    obj.jingIcon = false
                    if(obj.ext6 != ''){
                        obj.jingIcon = true
                    }

                    if(typeof item.typeIcon!='undefined' && item.typeIcon!="null" && item.typeIcon!=""){
                        obj.icon = item.typeIcon
                    }else{
                        obj.icon = require('@/assets/images/icon/res/blank.png')
                    }
                                        
                    obj.playJs = {'playName':'playLinkRes',params:{'resFormat':obj.RFormatMark,'playUrl':obj.playUrl}}
                    
                    
                    //此处省略电子书包逻辑（发起探究）
                    let buttonArr = []
                    // if(isSchoolbag && isHavingClass && "RT106" != item.RTypecode ){
                    //     if(ABLEFORMAT.indexOf(obj.RFormatMark)!=-1){
                    //         buttonArr .push({'name':'发起探究','enabled':true,'type':'wenjiantanjiu','params':{"title":obj.title,"rcode":obj.rcode,"fileType":1,"formatMark":obj.RFormatMark,"linkType":obj.linkType,"linkValue":obj.linkValue}})
                    //     }                        
                    // }                    
                    obj.button = buttonArr                    
                    arr.push(obj)
                }                 
            }
            if(res.ResInfo&&res.ResInfo.length>0){
                //遍历系统资源
                for(let item of res.ResInfo){
                    let obj = {}
                    obj.title = item.RTitle
                    obj.desc = item.RDesc
                    let RFormatMark = item.RFormatMark.toLowerCase()
                    obj.RFormatMark = RFormatMark
                    obj.rcode = item.RCode
                    obj.linkType = item.linkType
                    obj.linkValue = item.linkValue
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
                        obj.icon = require('@/assets/images/icon/res/blank.png')
                    }
                    
                    obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'title':obj.title,'resType':1}}

                    obj.resType = 1 //1普通资源3教师文件夹资源2电子教材
                    if("RT106" == item.RTypecode && "xml" == obj.RFormatark){
                        //电子教材
                        obj.resType = 1
                        obj.playJs = {'playName':'playRes',params:{'rcode':obj.rcode,'resType':2,'title':obj.title}}
                    }
                    
                    
                    //此处省略电子书包逻辑（发起探究）
                    let buttonArr = []
                    if(isSchoolbag && isHavingClass && "RT106" != item.RTypecode ){
                        if(ABLEFORMAT.indexOf(obj.RFormatMark)!=-1){
                            buttonArr .push({'name':'发起探究','enabled':true,'type':'wenjiantanjiu','pvname':'tls_ktjx_fspb','params':{"title":obj.title,"rcode":obj.rcode,"fileType":1,"formatMark":obj.RFormatMark,"linkType":obj.linkType,"linkValue":obj.linkValue}})
                        }                        
                    }                    
                    obj.button = buttonArr                    
                    arr.push(obj)
                }   
            }            
    }else{
        //暂无资源
    }
    // console.log(arr)
    return arr
}

//格式化题库资源
function formaTqmsRes(res){
    let arr = []
    if(res&&res.success && res.data.length>0){
        let deviceType = getDeviceType(); //设备类型，从客户端获取
        for(let item of res.data){
            let obj = {}
            obj.title = item.rtitle
            obj.feedbackFlag = item.feedbackFlag //已用  0-否 1-是
            let RFormatMark = item.iconType.toLowerCase()
            obj.RFormatMark = RFormatMark
            obj.hwPaperType = item.hwPaperType //作业试卷类型 system:系统试卷;listening:英语同步练
            obj.rcode = item.rcode
            obj.rsType = item.rsType //2系统 6个性 9英语同步练
            obj.jsdata = item.jsdata
            obj.useFlag = item.useFlag

            obj.totalNum = item.totalNum //总题数

            obj.pvname = 'tls_ktjx_zd'

            if(item.rsType == 9){
                obj.choiceNum = item.totalNum //选择题数
                obj.title = item.rtitle 
            }else{
                obj.choiceNum = item.choiceNum //选择题数
                obj.title = item.rtitle + ' （' + obj.choiceNum + '/' + obj.totalNum + '）'
            }
            

            obj.typeCode = item.typeCode //栏目名称：0个性 1优教 2名师 3共享

            obj.useIcon = '' //已发
            if(obj.useFlag == 1){
                //显示已发标记
                obj.useIcon = require('@/assets/images/icon/res/yiyong.png')
            }

    
            

            obj.icon = require('@/assets/images/icon/xunlian.png')
            if(obj.rsType == 2){
                // obj.icon = require('@/assets/images/icon/xunlian.png')
                obj.icon = store.getters.transferProtocol + store.getters.domainConfig["QBMS"] + '/tqms/pages/homeworkandtraining/images/icon/classhour/'+item.iconType +'.png' 
            }else if(obj.rsType == 6){
                // obj.icon = require('@/assets/images/icon/my.png')
                obj.icon = store.getters.transferProtocol + store.getters.domainConfig["QBMS"] + '/tqms/pages/homeworkandtraining/images/icon/classhour/'+item.iconType +'.png' 
            }

            //判断按钮 作答 登分 反馈
            //按钮数组
            obj.playJs = {'playName':'zuoda',params:{'rcode':obj.rcode,'rsType':obj.rsType}}
            let buttonArr = []

            if(obj.rsType != 9){
                //非英语同步练
                buttonArr .push({'name':'作答','enabled':true,'type':'zuoda','params':obj.playJs,'pvname':'tls_ktjx_zd'})
                if(obj.feedbackFlag == 1){
                    let params = {'playName':'fankui','params':{'rcode':obj.rcode,'rsType':obj.rsType,'isEbook':0}}
                    buttonArr .push({'name':'反馈','enabled':true,'type':'fankui','params':params,'pvname':'tls_ktjx_fk'})
                }
            }else{
                //英语同步练
                // obj.icon = require('@/assets/images/tin.png')             
                obj.icon = store.getters.transferProtocol + store.getters.domainConfig["QBMS"] + '/tqms/pages/homeworkandtraining/images/icon/classhour/'+item.iconType +'.png' 
                obj.playJs = {'playName':'zuodaEng',params:{'rcode':obj.rcode,"rsType":9}}     
                buttonArr .push({'name':'作答','enabled':true,'type':'zuodaEng','playJs':obj.playJs})   
                if(obj.feedbackFlag == 1){
                    let params = {'playName':'fankuiEng',params:{'rcode':obj.rcode,"rsType":9}}     
                    buttonArr .push({'name':'反馈','enabled':true,'type':'fankuiEng','params':params})
                }     
            }


            //1.如果设备不混用，答题器就是登分功能，平板就是发到平板功能，
            //2.如果混用（平板+答题器） 根据条件判断是 登分还是发送平板功能
            let buttonDesc = '';//套卷答题当前的功能：1pad 是发送平板功能 2answerTool
            if( deviceType == '0,5' || deviceType == '1,5' || deviceType == '2,5'){
                //混用状态 按钮名称都叫套卷答题 那就是 0（一代答题卡）的功能是发送平板， 其他的都是登分                
                let params = {}
                params.rcode = obj.rcode
                params.rsType = obj.rsType
                if(deviceType == '0,5'){
                    //调用发送平板功能
                    buttonDesc = 'pad'
                }else{
                    //调用登分功能
                    buttonDesc = 'answerTool'
                }
            }else{
                //非混用状态，
                if(deviceType.indexOf('1') != -1 || deviceType.indexOf('2') != -1 ){
                    buttonDesc = 'answerTool'
                }else if(deviceType.indexOf('5') != -1){
                    buttonDesc = 'pad'
                }
            }


            if(buttonDesc == 'answerTool'){
                //出登分功能
                //判断登分按钮
                // if(item.opt.volumeOfPoints && item.opt.volumeOfPoints.viewUrl && item.opt.volumeOfPoints.url){
                //     //判断设备类型，不是老设备
                //     if(deviceType.indexOf('1') != -1 || deviceType.indexOf('2') != -1){
                //         let param = {}
                //         param.playName = 'dengfen'
                //         param.params = {'rcode':obj.rcode,'rsType':obj.rsType,'dengfenViewUrl':item.opt.volumeOfPoints.viewUrl,'dengFenUrl':item.opt.volumeOfPoints.url}
                //         buttonArr .push({'name':'套卷答题','enabled':true,'type':'dengfen','params':param,'pvname':'tls_ktjx_tjdf'})
                //     }                
                // }  
                if(deviceType.indexOf('1') != -1 || deviceType.indexOf('2') != -1){
                    let param = {}
                    param.playName = 'dengfen'
                    param.params = {'rcode':obj.rcode,'rsType':obj.rsType,'dengfenViewUrl':'','dengFenUrl':''}
                    buttonArr .push({'name':'套卷答题','enabled':true,'type':'dengfen','params':param,'pvname':'tls_ktjx_tjdf'})
                }                
            }else if(buttonDesc == 'pad'){
                //出发送平板功能
                //判断电子书包
                //如果不是英语练 并且是电子书包版本 且不是授课预览 且是上课状态
                if(store.getters.isSchoolbag && store.getters.loginStyle == 0 && store.getters.isHavingClass){
                    if(obj.rsType != 9 ){
                        if(item.opt.sendEBook && item.opt.sendEBook.url){
                            let params = {'playName':'sendToPad','params':{'rsType':obj.rsType,'sendEBookUrl':item.opt.sendEBook.url}}
                            buttonArr .push({'name':'套卷作答','enabled':true,'type':'sendToPad','params':params,'pvname':'tls_ktjx_fspb'})
                        }                    
                    }else{
                        let params = {'playName':'sendToPadEng','params':{'rsType':obj.rsType,'sendEBookUrl':'','paperId':obj.rcode}}
                        buttonArr .push({'name':'套卷作答','enabled':true,'type':'sendToPadEng','params':params,'pvname':'tls_ktjx_fspb'})
                    }                                        
                }
            }

            ///我的预习不再显示"已发"按钮
            if(obj.rsType == 6){
                obj.useIcon = ''
            }

            obj.button = buttonArr
            arr.push(obj)
        }
    }
    
    return arr
}
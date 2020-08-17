import store from '@/store'
import { getAccessToken, getTokenType,getToken,getAccessTokenTime} from '@/utils/auth'
import storage from '@/utils/storage'
import {AUTH_TOKEN_NAME,AUTH_TIME_NAME,TLS_RESET_WHITE_MAC,DOWNLOAD_URL,KQYX_PAPER_ID} from '@/api/constant'
import { removeUt } from '@/utils/auth'
import { sendLogin,sendChangeKsId } from '@/api/login'



/**
 * Ecom通信 登录，退出登录
 * @param {*} type 1：登录，2：退出登录到登录页
 */
function sendLoginEcom(type){
    console.log('sendLoginEcom')
    let params = {}

    if(type == 1){
        params.token = getTokenType()+ ' ' +getAccessToken()
        params.mac = VcomMacIp.GetMacInfo()
        params.domain = store.getters.transferProtocol + store.getters.domainConfig["PORTAL"]+'/dzsb'
        //params.domain = 'http://122.112.242.196:11222'
        params.teacherId= store.getters.teacherNumber
        params.teacherName= store.getters.trueTeacherName
        params.schoolClassId= store.getters.userSelectClassId
        params.schoolClassName= store.getters.userSelectClassName
        params.ut= store.getters.ut
    }else{
        params.token = ''
        params.mac = ''
        params.domain = ''
        params.teacherId= ''
        params.teacherName= ''
        params.schoolClassId= ''
        params.schoolClassName= ''
        params.ut= ''
    }
    sendLogin(params).then((res)=>{})
}

//切换章节
function sendChangeKsIdEcom(){
    console.log('sendChangeKsIdEcom')
    let params = {}
    params.paperName = ''
    params.start = 'start'
    params.paperStyle = 1
    params.startTime = ''
    params.operType = '0'
    params.sn = '1'
    params.testContent = ''
    params.standards = ''
    params.classId = store.getters.userSelectClassId
    params.paperId= ''
    params.testId= ''
    params.testStyle= ''
    params.testStyleName= ''
    params.studentList= ''
    params.teacherId= store.getters.teacherNumber
    params.teacherName= store.getters.trueTeacherName
    params.courseId= new Date().getTime()
    params.schoolId= store.getters.schoolId
    params.gradeId= store.getters.baseData.gradeCode
    params.gradeName= store.getters.baseData.grade
    params.subjectId= store.getters.baseData.subjectCode
    params.subjectName= store.getters.baseData.subject
    // params.bookId= ''
    // params.bookName= ''
    params.chaperId= store.getters.ksId
    params.chaperVcom= store.getters.ksId
    params.chaperName= store.getters.ksName
    params.sectionVcom= store.getters.ksName
    params.answerOptions= ''
    params.homeworkId= ''
    

    let obj = {}
    obj.sendData = JSON.stringify(params)
    obj.prepareLessonId = store.getters.classHourId


    sendChangeKsId(obj).then((res)=>{})
}

/**
 * 
 * @param {*} type 0,1，2，3  退出,登录，换班，更换章节(只更新登录串)
 */
export function clientToolTransmit(type){
    // if(store.getters.loginStyle != 0){
    //     return false
    // }

    //通知ecom控件
    try{
        if((type == 1||type ==2) && store.getters.userSelectClassId != '' && store.getters.classHourId != ''){
            sendLoginEcom(1);
            setTimeout(()=>{sendChangeKsIdEcom();},500)
        }else if(type == 0){
            sendLoginEcom(2);
        }else if(type == 3){
            sendChangeKsIdEcom();
        }
    }catch(e){

    }

    if(store.getters.ksId == ''){
        return false;
    }
    console.log('写登录串'+type)
    if(type == 0){
        try{
            VcomTeach.setLoginInfo(0,'');
        }catch(e){

        }        
    }else{        
        if(type == 1){
            store.dispatch('setLoginStatus',true)
        }
        //写登录串
        let obj = {}
        obj.teachernumber = store.getters.teacherNumber
        obj.teachername = encodeURIComponent(encodeURIComponent(store.getters.trueTeacherName))
        obj.schoolId = store.getters.schoolId
        obj.schoolName = encodeURIComponent(encodeURIComponent(store.getters.schoolName))
        obj.classId = store.getters.userSelectClassId
        obj.classType = store.getters.userSelectClassType
        obj.className = encodeURIComponent(encodeURIComponent(store.getters.userSelectClassName))
        obj.areaId = store.getters.areaId
        obj.subjectId = store.getters.baseData.subjectCode
        obj.subjectName = encodeURIComponent(encodeURIComponent(store.getters.baseData.subject))
        obj.termId = store.getters.baseData.termCode
        obj.versionId = store.getters.baseData.versionCode        
        obj.gradeId = store.getters.baseData.gradeCode 
        obj.studyStageId = store.getters.baseData.studyStageCode         
        obj.bookOptionId= store.getters.baseData.bookOptionCode
        obj.sso = store.getters.desSso.SSO
        obj.ssoIp = store.getters.desSso.SSO_IP
        obj.courseId = store.getters.ksId
        obj.classHourId = store.getters.classHourId
        obj.padTeachAble = store.getters.padTeachAble + ''
        obj.userType = store.getters.userType
        obj.auth_token = getToken() //新增认证相关
        obj.auth_time = getAccessTokenTime() //时间
        obj.cardGroupId = store.getters.cardGroupId;//答题器分组id
        obj.ssout = store.getters.ut //最后一个是固定的（只能在中间添加）

        let loginInfo = JSON.stringify(obj)
        console.log(obj)
        console.log('-------------------------------------')
        // console.log(loginInfo)


        // loginstyle：int 类型， 0.退出；1.登录；2.换班,3章节修改和token更新 logininfo：登录串信息
        try{
            VcomTeach.setLoginInfo(type,loginInfo);
        }catch(e){

        }            
    }
}

/**
 * 退出到登录页
 */
export function logoutClient(){
    storage.remove(AUTH_TOKEN_NAME)
    storage.remove(AUTH_TIME_NAME)
    storage.remove(TLS_RESET_WHITE_MAC)
    storage.remove(DOWNLOAD_URL)
    storage.remove(KQYX_PAPER_ID)
    //清理cookie中的ut
    removeUt()

    //发送退出登录串
    clientToolTransmit(0)
    window.location.reload()    
}









/**
 * 获取教学机的班级信息
 */
export function getComputerClassInfo(){
    let resultArr = []
    try{
        let result = VcomTeach.execSelect("select str_value,remark1 from teachui_table where vid = 'pc_classid';","11")
        resultArr = JSON.parse(result)        
    }catch(e){

    }
    return resultArr
}

/**
 * 新增班级信息到本地数据库
 * @param {*} userSelectClassId 
 * @param {*} userSelectClassName 
 */
export function saveComputerClassInfo(userSelectClassId,userSelectClassName){
    try{
        VcomTeach.execDML("insert into teachui_table (vid,str_value,remark1,remark2) values ('pc_classid','"+userSelectClassId+"','"+userSelectClassName+"','当前教学机班级信息');");            
        VcomTeach.commitFile('database')
    }catch(e){

    }    
}

/**
 * 
 * @param {*} userSelectClassId 
 * @param {*} userSelectClassName 
 */
export function updateComputerClassInfo(userSelectClassId,userSelectClassName){
    try{
        VcomTeach.execDML("update teachui_table set str_value='"+userSelectClassId+"',remark1='"+userSelectClassName+"' where vid='pc_classid';")
        VcomTeach.commitFile('database')
    }catch(e){

    }
}


//设置设备类型
//：0 老设备，1新设备，2数字键，4无设备，5上课，6纸笔
export function getDeviceType(){    
    let devs = ''
    try{
        devs = VcomTeach.getAllDeviceInfo()
        console.log(typeof devs == 'undefined')
        console.log('devs:'+devs)
        if(typeof devs == 'undefined'){
            devs = ''
        }
        //写入store
        store.dispatch('setDeviceType', devs)
    }catch(e){
        console.log('获取设备类型失败')
    }
    return devs
}

//设置是否电子书包
export function setIsSchoolBag(padTeachAble){
    try{
        let baseVersion = VcomTeach.getVcomTeachVersion()
        if(baseVersion.indexOf('pad') != -1 && padTeachAble == 1){
            store.dispatch('setSchoolBag', true)
        }else{
            store.dispatch('setSchoolBag', false)
        }
    }catch(e){

    }    
}

//判断是否上课
export function getIsStartClass(){
    let flag = false
    try{
        let devs = VcomTeach.getAllDeviceInfo()        
        if(devs.indexOf(',5') != -1){
            flag = true
            store.dispatch('setHavingClass',true)
        }else{
            flag = false
            store.dispatch('setHavingClass',false)
        }        
    }catch(e){

    }
    return flag
}

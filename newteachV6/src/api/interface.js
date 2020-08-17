/**
 * 各系统API接口
 */
import request from '@/utils/request'
import requestUtil from '@/utils/requestUtil'
import store from '@/store'
import Cookies from 'js-cookie'
let Base64 = require('js-base64').Base64;
//-------------------------------------------------------------


export function getCustomerInfo(params){
    let url = process.env.PORTAL_BASE_PREFIX + '/tt/icss/customer/baseinfo'


    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'postjson', data:params}) ) 
    })
}


//从门户配置获取当前平台Id
export function getLocalAreaCode(){
    let url = process.env.PORTAL_BASE_PREFIX+'/common/config.jsp'
    let params = {"key":"localAreaCode"}

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params})) 
    })
}


/**
 * 登陆认证相关
 * ---------------------------------------------------------------------
 */
//获取产品鉴权信息通过ut
export function getSsoGrantByUt(){
    let url = process.env.SSO_BASE_PREFIX + '/sso/ssoGrant?appFlg=PLS&isPortal=0&ut=' + store.getters.ut

    let params = {}

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params})) 
    })       

}
/**
 * GW网关相关
 * ---------------------------------------------------------------------
 */

/**
 * 获取统一配置文件
 */
export function getDomainConfigFromGwApi(){
    let url = process.env.GW_BASE_PREFIX + '/baseapi/uconfig/cfg'

    let params = {}
    return new Promise((resolve, reject) => {
        resolve(requestUtil({url: url, method: 'get', data:params}) ) 
    })     
}



/**
 * WEBMAIL相关
 * ---------------------------------------------------------------------
 */

/**
 * 获取离线作业列表
 */
export function getOfflineHomeworkListApi(){
    let url =  process.env.WEBMAIL_BASE_PREFIX + '/src/msgInterFace.php'

    let params = {}
    params.command = 'jobSent'
    params.username = store.getters.teacherNumber
    params.infoid = store.getters.ksId
    params.start = 0
    params.size = 100    


    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })       
}


/**
 * 获取离线作业详情
 */
export function getOfflineHomeworkInfoApi(id){
    let url =  process.env.WEBMAIL_BASE_PREFIX + '/src/msgInterFace.php'

    let params = {}
    params.command = 'jobInfo'
    params.id = id
    params.classid = store.getters.userSelectClassId


    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })       
}

/**
 * 查看离线作业某个人的反馈内容
 * @param {*} id 
 * @param {*} username 
 */
export function getOfflineHomeworkFankuiInfoByUserApi(id,username){
    let url =  process.env.WEBMAIL_BASE_PREFIX + '/src/msgInterFace.php'

    let params = {}
    params.command = 'jobInfo'
    params.id = id
    params.username = username


    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })       
}


/**
 * 发送离线作业
 * @param {*} id 
 * @param {班级id} classids 多个用逗号分割
 */
export function sendOfflineHomeworkApi(id,classids){
    let url =  process.env.WEBMAIL_BASE_PREFIX + '/src/msgInterFace.php'

    let params = {}
    params.command = 'job2send'
    params.id = id
    params.classid = classids


    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })       
}

/**
 * 教学分析训练，发送-->保存并发送接口 / 训练 （保存）
 * hwCreateType ： 2训练，1发送
 */
export function saveSendTrainApi(username,truename,usertype,areaId,classId,subjectId,ksid,courseId,paperName,questionids,hwCreateType){
    let url=process.env.TQMS_BASE_PREFIX+"/tqms/jxfx/saveXunlianOrSendhomework.action";
    let params = {}

    params.question_ids=questionids;

    params.class_id=courseId;	//章节id
    params.course_id=subjectId;//科目id
    params.material_id=ksid;//当前版本id

    params.paper_name=encodeURIComponent(paperName);
    params.classIds=classId;//教师班级列表


    params.username=username;
    params.truename=encodeURIComponent(truename);
    params.usertype=usertype;

    params.hwCreateType=hwCreateType;//教师班级列表

    params.areaId=areaId;

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) )
    })
}

/**
 * 打开试卷分析页面
 * 
 * @param {*} username 
 * @param {*} truename 
 * @param {*} usertype 
 * @param {*} classId 
 * @param {*} subjectId 
 * @param {*} ksid 
 * @param {*} courseId 
 * @param {*} paperName 
 * @param {*} questionids 
 */
export function openTrainExplainApi(username,truename,usertype,areaId,classId,subjectId,ksid,courseId,paperName,questionids){
    let url=store.getters.transferProtocol +store.getters.domainConfig["QBMS"]+"/tqms/jxfx/queryNameByQuestionIds.action?question_ids="+questionids;//试题
    url+="&usertype="+usertype;//用户类型
    url+="&areaId="+areaId;//区域id
    url+="&lessionId="+courseId;//章节id
	url+="&course_id="+subjectId;//科目id
	url+="&material_id="+ksid;//当前版本id
	url+="&classIds="+classId;//班级
	url+="&username="+username;
    url+="&truename="+encodeURIComponent(truename);
    let domain = document.domain.substr(document.domain.indexOf('.'),document.domain.length)
    Cookies.set("jxfx_papername",paperName,{domain:domain});
    if(store.getters.loginStyle != 0){
        window.open(url)
    }else{
        //控件弹窗
        VcomTeach.openNewBrowser(url,'xpos=0&ypos=0&width=0&height=0&modal=true&title='+paperName+'&showclose=true')
    }
}
/**
 * TMS相关
 * ****************************************************************************************
 */
/**
 * 获取学校答题器分组
 * @param {*} schoolId 
 */
export function getCardGroupBySchool(schoolId){
    let url = process.env.UCSAPIKF_BASE_PREFIX + '/ucsapi/smart/interface/getSmartCardGroup';
    let params = {}
    params.queryType = 'cardGroupBySchool'
    params.schoolId = schoolId;

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params})) 
    })    
}

/**
 * 保存当前教室的分组id
 * @param {*} schoolId 
 * @param {*} mac 
 * @param {*} cardGroupId 
 * @param {*} teacherNumber 
 * @param {*} trueName 
 */
export function saveCardGroupByMac(schoolId,mac,cardGroupId,teacherNumber,trueName){
    let url = process.env.UCSAPIKF_BASE_PREFIX + '/ucsapi/smart/interface/postTeachComputer';
    let params = {}
    params.schoolId = schoolId;
    params.teachComputerMac = mac;
    params.cardGroupId = cardGroupId;
    params.opAccount = teacherNumber;
    params.opRealname = trueName;

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params})) 
    })
}

/**
 * 获取当前教学机对应的分组id
 * @param {*} schoolId 
 * @param {*} mac 
 */
export function getCardGroupByMac(classId,mac){
    let url = process.env.UCSAPIKF_BASE_PREFIX + '/ucsapi/smart/interface/getTeachComputerByMac';
    let params = {}
    params.schoolClassId = classId;
    params.teachComputerMac = mac;

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params})) 
    })    
}

/**
 * 答题器按照序号替换
 * @param {*} schoolId 
 * @param {*} cardGroupId 
 * @param {*} cardOrder 
 * @param {*} answerToolCodeNew 
 * @param {*} answerToolCodeOld 
 */
export function changeAnswertool(schoolId,cardGroupId,cardOrder,answerToolCodeNew,answerToolCodeOld){
    let url = process.env.UCSAPIKF_BASE_PREFIX + '/ucsapi/smart/interface/putSmartCard';
    let params = {}
    params.queryType = 'bindCard'
    params.schoolId = schoolId;
    params.cardGroupId = cardGroupId;
    params.cardOrder = cardOrder;
    params.answerToolCodeNew = answerToolCodeNew;
    params.answerToolCodeOld = answerToolCodeOld;

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params})) 
    })    
}

/**
 * 获取学生名单答题器绑定用
 * @param {*} schoolClassId 
 * @param {*} cardGroupId 
 */
export function  getStudentBindStatusByClassId(schoolClassId,cardGroupId){
    let url = process.env.UCSAPIKF_BASE_PREFIX + '/ucsapi/smart/interface/getSmartCardBind';
    let params = {}
    params.queryType = 'publicCardByClass';
    params.schoolClassId = schoolClassId;
    params.cardGroupId = cardGroupId;

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params})) 
    })   
}



/**
 * 新版Auth2.0登录调用
 * @param {*} grant_type 授权类型,password 密码模式，固定值
 * @param {*} inputname 用户账号,rsa加密
 * @param {*} pwd 密码,rsa加密
 * @param {*} mac 当前MAC地址，rsa加密
 */
export function authLogin(inputname,pwd,mac){
    let url = process.env.UCSAPIKF_BASE_PREFIX + '/ucsapi/oauth2/oauth/service/token';
    let params = {}
    params.grant_type = 'password_mac'
    params.scope = 'all'
    params.loginUsertype = 'teacher'
    params.inputname = inputname
    params.username = inputname
    params.password = pwd
    params.mac = mac
    try{
    return new Promise((resolve, reject) => {
        resolve(requestUtil({url: url, method: 'post', data:params,headers:{"Authorization":"Basic VExTOmY0ODUzZjFlZWMxZWU4NTZhZWVjMjJhOGI0MTJhNzhh"}})) 
    }).catch((pe)=>{console.error(pe);return pe;});
    }catch(e){
        //网络异常等，登陆失败
        return e;
    }
}

/**
 * 新版Auth2.0二维码登录调用
 * @param {*} key 二维码key
 */
export function authCodeLogin(key){
    let url = process.env.UCSAPIKF_BASE_PREFIX + '/ucsapi/oauth2/oauth/service/token';
    let params = {}
    params.grant_type = 'qrcode'
    params.scope = 'all'
    params.key = key
    try{
    return new Promise((resolve, reject) => {
        resolve(requestUtil({url: url, method: 'post', data:params,headers:{"Authorization":"Basic VExTOmY0ODUzZjFlZWMxZWU4NTZhZWVjMjJhOGI0MTJhNzhh"}})) 
    })
    }catch(e){
        //网络异常等，登陆失败
        return null;
    }
}

/**
 * 刷新token
 * @param {*} grant_type 
 * @param {*} refresh_token 
 */
export function refreshTokenApi(grant_type,refresh_token){
    let url = process.env.UCSAPI_BASE_PREFIX + '/ucsapi/oauth2/oauth/token'

    let params = {}
    params.grant_type = grant_type
    params.refresh_token = refresh_token
    
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'post', data:params,headers:{'Authorization':'Basic VExTOmY0ODUzZjFlZWMxZWU4NTZhZWVjMjJhOGI0MTJhNzhh'}}) ) 
    })
}

/**
 * 添加班级
 */
export function addUserClass(activeClass){
    let url = process.env.TMS_BASE_PREFIX + '/tms/interface/queryTeacher.jsp'

    let params = {}
    params.queryType = 'addClass'
    params.username = store.getters.teacherNumber
    params.ut = store.getters.ut
    params.schoolClassId = activeClass


  
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params})) 
    })     
}


/**
 * 获取当前班级的分组信息接口
 * @param {*} classId 班级id
 */
export function getClassGroupApi(classId){
    let url = process.env.GW_BASE_PREFIX + '/ucsapi/public/classgroup/v1/groups/'+classId

    let params = {}
    return new Promise((resolve, reject) => {
        resolve(requestUtil({url: url, method: 'get', data:params}) ) 
    })
}

/**
 * 保存分组
 * @param {*} params 
 */
export function saveClassGroupApi(params){
    let url = process.env.GW_BASE_PREFIX + '/ucsapi/public/classgroup/v1/groups'


    return new Promise((resolve, reject) => {
        resolve(requestUtil({url: url, method: 'postjson', data:params}) ) 
    })
}

/**
 * 答题器绑定接口
 * @param {*} studentNumber 
 * @param {*} answerToolCode 
 * @param {*} schoolClassId 
 */
export function sendBindPaperApi(answerToolCode,studentNumber,classId){
    let url = process.env.GW_BASE_PREFIX + '/ucsapi/userself/teacher/card'

    let obj = {}
    obj.studentNumber = studentNumber
    obj.answerToolCode = answerToolCode
    obj.classId = classId
    
    let params = JSON.stringify(obj)
    return new Promise((resolve, reject) => {
        resolve(requestUtil({url: url, method: 'postjson', data:params}) ) 
    })
}


/**
 * 获取当前班级的分组信息接口
 * @param {*} queryType 写死'bySchoolClassId'
 * @param {*} classGroupType 写死1
 * @param {*} classId 班级id
 * @param {*} ut 
 */
export function getClassGroup(queryType,classGroupType,classId,ut){
    let url = process.env.TMS_BASE_PREFIX + '/tms/interface/querySchoolClassGroup.jsp'

    let params = {}
    params.queryType = queryType
    params.classGroupType = classGroupType
    params.classId = classId
    params.ut = ut
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

/**
 * 设置用户版本（新版）
 * @param {*} bookId 
 */
export function saveUserVersionApi(bookId){
    let url = process.env.GW_BASE_PREFIX + '/ucsapi/public/courseversion/v1/userversion/' + bookId
    let params = {}
    return new Promise((resolve, reject) => {
        resolve(requestUtil({url: url, method: 'post', data:params}) ) 
    })    
}

/**
 * 删除用户设置的版本（新版）
 * @param {*} bookId 
 */
export function delUserVersionApi(bookId){
    let url = process.env.GW_BASE_PREFIX + '/ucsapi/public/courseversion/v1/userversion/' + bookId
    let params = {}
    return new Promise((resolve, reject) => {
        resolve(requestUtil({url: url, method: 'delete', data:params}) ) 
    })    
}

/**
 * 设置用户最近访问版本
 * @param {*} bookId 
 */
export function setUserVersionProgressApi(bookId){
    let url = process.env.GW_BASE_PREFIX + '/ucsapi/public/courseversion/v1/userversion/' + bookId
    let params = {}
    return new Promise((resolve, reject) => {
        resolve(requestUtil({url: url, method: 'put', data:params}) ) 
    })
}





/**
 * 设置用户当前版本
 * @param {*} bookId 
 */
export function setUserVersionProgress(bookId){
    let url = process.env.TMS_BASE_PREFIX + '/tms/interface/queryVersion.jsp'

    let params = {}
    params.queryType = 'userVersionProgressSet'
    params.username = store.getters.teacherNumber
    params.bookId = bookId
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

/**
 * 获取当前班级学生接口（新API）
 * @param {*} schoolClassId 
 * @param {*} teacherComputerMac 
 * @param {*} smartPaperEnable 
 */
export function getStudentListByClassNew(schoolClassId,teacherComputerMac,smartPaperEnable){    
    if(teacherComputerMac == ''){
        teacherComputerMac = '6C-4B-90-78-9B-E7'
    }
    let url = process.env.GW_BASE_PREFIX + '/ucsapi/public/classgroup/v1/answertools/'+schoolClassId+'/'+teacherComputerMac+'/'+smartPaperEnable
    let params = {}
    return new Promise((resolve, reject) => {
        resolve(requestUtil({url: url, method: 'get', data:params}) ) 
    })    
}


/**
 * 获取用户中心3Des加密后的信息
 */
export function getSsoEncryptInfoApi(){
    let url = process.env.GW_BASE_PREFIX + '/baseapi/uconfig/cfg/encryption/sso'
    let params = {}
    return new Promise((resolve, reject) => {
        resolve(requestUtil({url: url, method: 'get', data:params}) ) 
    })    
}



/**
 * 序号绑定获取当前所有纸板绑定信息
 * @param {*} schoolId 
 * @param {*} teacherComputerMac 
 * @param {*} ut 
 */
export function getSmartPaperByMac(schoolId,teacherComputerMac,ut){
    let url = process.env.TMS_BASE_PREFIX + '/tms/clientInterface/querySmartPaperByTeachComputerMac.do'

    let params = {}
    params.schoolId = schoolId
    params.teachComputerMac = teacherComputerMac
    params.ut = ut

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

/**
 * 序号绑定，一键排序
 * @param {*} schoolId 
 * @param {*} teacherComputerMac 
 * @param {*} ut 
 * @param {*} reOrder 默认1 
 */
export function sortSmartPaperApi(schoolId,teacherComputerMac,ut,reOrder){
    let url = process.env.TMS_BASE_PREFIX + '/tms/clientInterface/querySmartPaperByTeachComputerMac.do'

    let params = {}
    params.schoolId = schoolId
    params.teachComputerMac = teacherComputerMac
    params.ut = ut
    params.reOrder = reOrder

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}





/**
 * 获取基础学科信息
 */
export function getSubjectApi(){
    let url = process.env.GW_BASE_PREFIX + '/ucsapi/public/courseversion/v1/subjectcodetree'
    let params = {}
    return new Promise((resolve, reject) => {
        resolve(requestUtil({url: url, method: 'get', data:params}) ) 
    })
}

/**
 * 根据学科获取年级，学期以及版本信息
 * @param {*} subjectCode 
 */
export function getGradeTermVersionBySubjectApi(subjectCode){
    let url = process.env.GW_BASE_PREFIX + '/ucsapi/public/courseversion/v1/versiontree/'+subjectCode
    let params = {}
    return new Promise((resolve, reject) => {
        resolve(requestUtil({url: url, method: 'get', data:params}) ) 
    })
}



/**
 * 字母绑定接口（绑定手写板）
 * @param {*} studentNumber 学生帐号
 * @param {*} classId 班级id
 * @param {*} schoolId 学校id
 * @param {*} smartPaperMac 手写板mac
 * @param {*} teacherComputerMac 教学机mac
 * @param {*} ut 
 */
export function bindSmartPaper(studentNumber,classId,schoolId,smartPaperMac,teacherComputerMac,ut){
    let url = process.env.TMS_BASE_PREFIX + '/tms/clientInterface/bindStudentSmartPaper.do'

    let params = {}
    params.studentNumber = studentNumber
    params.classId = classId
    params.schoolId = schoolId
    params.smartPaperMac = smartPaperMac
    params.teachComputerMac = teacherComputerMac
    params.ut = ut
    params.rand = Math.random()
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })        
}


/**
 * 序号绑定接口
 * @param {*} schoolId 
 * @param {*} smartPaperMac 
 * @param {*} smartPaperNumber 
 * @param {*} smartPaperOrder 
 * @param {*} teacherComputerMac 
 * @param {*} ut 
 */
export function numBindSmartPaperApi(schoolId,smartPaperMac,smartPaperNumber,smartPaperOrder,teacherComputerMac,ut){
    let url = process.env.TMS_BASE_PREFIX + '/tms/clientInterface/bindSmartPaperNumber.do'

    let params = {}
    params.schoolId = schoolId
    params.smartPaperMac = smartPaperMac
    params.smartPaperNumber = smartPaperNumber
    params.smartPaperOrder = smartPaperOrder
    params.teachComputerMac = teacherComputerMac
    params.ut = ut
    params.rand = Math.random()
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })           
}

/**
 * 切换纸笔绑定模式
 * @param {*} smartPaperBindType 手写板绑定模式 0 手写板未启用 1 按号领取  2 绑定用户
 * @param {*} schoolId 学校id
 * @param {*} teacherComputerMac 教学机MAC
 * @param {*} ut 
 */
export function changeSmartPaperBindTypeApi(smartPaperBindType,schoolId,teacherComputerMac,ut){
    let url = process.env.TMS_BASE_PREFIX + '/tms/clientInterface/changeSmartPaperBindType.do'

    let params = {}
    params.smartPaperBindType = smartPaperBindType
    params.schoolId = schoolId
    params.teachComputerMac = teacherComputerMac
    params.ut = ut
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })     
}

/**
 * 纸笔课堂替换设备接口
 * @param {*} smartPaperNumberFrom 原有的编号
 * @param {*} smartPaperNumberTo 要替换的编号
 * @param {*} schoolId 学校id
 * @param {*} teacherComputerMac 教学机mac 
 * @param {*} ut 
 */
export function exchangeSmartPaperOrder(smartPaperNumberFrom,smartPaperNumberTo,schoolId,teacherComputerMac,ut){
    let url = process.env.TMS_BASE_PREFIX + '/tms/clientInterface/exchangeSmartPaperOrder.do'

    let params = {}
    params.smartPaperNumberFrom = smartPaperNumberFrom
    params.smartPaperNumberTo = smartPaperNumberTo
    params.schoolId = schoolId
    params.teachComputerMac = teacherComputerMac
    params.ut = ut
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })        
}

/**
 * 纸笔一键排序
 * @param {*} schoolId 学校ID
 * @param {*} teacherComputerMac 教学机MAC 
 * @param {*} reOrder 写死1
 * @param {*} ut 
 */
export function sortSmartPaperOrder(schoolId, teacherComputerMac, reOrder, ut){
    let url = process.env.TMS_BASE_PREFIX + '/tms/clientInterface/querySmartPaperByTeachComputerMac.do'

    let params = {}
    params.schoolId = schoolId
    params.teachComputerMac = teacherComputerMac
    params.reOrder = reOrder
    params.ut = ut
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })     
}


/**
 * 题库相关
 * ****************************************************************************************
 */

/**
 * 
 * @param {作业类型} publishType sys:系统，normal：我的
 * @param {作业id} homeworkId 
 * @param {试卷id} paperId 
 */
export function getHasSendClass(publishType,homeworkId,paperId){
    let url = process.env.TQMS_BASE_PREFIX + '/tqms/hw/getHomeworkPublishedClass.action'

    let params = {}
    params.publishType = publishType
    params.homeworkId = homeworkId
    params.paper_id = paperId
    params.username = store.getters.teacherNumber

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })        
}


/**
 * 获取我的套卷的列表
 * @param {*} username 用户名
 * @param {*} classId 章节id
 */
export function getResListFromTqmsPaperApi(username, classId){
    let url = process.env.TQMS_BASE_PREFIX + '/tqms/assembly/queryHomeworkByType.action'

    let params = {}
    params.username = username
    params.classId = classId
    params.paperType = 0
    params.start = 0
    params.limit = 300

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })  
}

// export function aaa(){
//     let url = 'http://192.168.151.126/sh/index.php'

//     let params = {}


//     return new Promise((resolve, reject) => {
//         resolve(request({url: url, method: 'get', data:params}) ) 
//     })  
// }
// export function bbb(){
//     let url = 'http://192.168.151.126/sh/index2.php'

//     let params = {}


//     return new Promise((resolve, reject) => {
//         resolve(request({url: url, method: 'get', data:params}) ) 
//     })  
// }
/**
 * 试卷转换接口
 * @param {*} username 
 * @param {*} lessionId 
 * @param {*} paperId 
 * @param {*} userType 
 */
export function formatPaperTypeApi(username, lessionId, paperId, userType){
    let url = process.env.TQMS_BASE_PREFIX + '/tqms/interface/micro/convertToPersonPaper.action'

    let params = {}
    params.username = username
    params.lessionId = lessionId
    params.hwcreatetype = 1
    params.type = 0
    params.paperId = paperId
    params.userType = userType

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })  
}

/**
 * 发送系统作业
 * @param {*} paperId 
 * @param {班级id} classIds  逗号分割
 */
export function sendHomeWorkBySysApi(paperId,classIds){
    let url = process.env.TQMS_BASE_PREFIX + '/tqms/mobile/homework/publishSysLessonPreByClassInterface.action'

    let params = {}
    params.usertype = store.getters.userType
    params.username = store.getters.teacherNumber
    params.paper_id = paperId
    params.classIds = classIds
    params.areaId = store.getters.areaId
    params.lessionId = store.getters.ksId
    params.truename = store.getters.trueTeacherName
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })    
}

/**
 * 发送我的作业
 * @param {*} homeworkId 
 * @param {班级id} classIds 逗号分割
 */
export function sendHomeWorkByNormalApi(homeworkId,classIds){
    let url = process.env.TQMS_BASE_PREFIX + '/tqms/mobile/homework/publishHomeWorkByClassInterface.action'

    let params = {}
    params.usertype = store.getters.userType
    params.username = store.getters.teacherNumber
    params.storeHomeworkId = homeworkId
    params.classIds = classIds
    params.areaId = store.getters.areaId
    params.truename = store.getters.trueTeacherName
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })    
}



/**
 * 获取题库作业反馈
 * @param {*} rcode 
 */
export function getFankuiTqmsApi(rcode){
    let url = process.env.OLMS_BASE_PREFIX + '/tqms/interface/paper/JobStsCms.action'

    let params = {}
    params.paperWorkId = rcode
    params.type = 'PRACTICE'
    params.studentclass = store.getters.userSelectClassId
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })    
}

/**
 * 调用题库的接口获取平板下载试题的接口
 * @param {*} url sendEBookUrl
 */
export function getPaperDownloadUrlApi(url){
	//可能被浏览器解码（先判断是否被解码）
	if(url.indexOf('data={') != -1){
		var tmpArr = url.split('data=');
		if(tmpArr.length>1){
			url = tmpArr[0]+'data='+encodeURIComponent(tmpArr[1]);
        }
    }

    let params = {}
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

/**
 * 往教学分析队列初始化的
 * @param {*} ksId 
 * @param {*} classId 
 */
export function jxfxMqApi(ksId,classId){
    let url = '/node/api/msg/jxfx/init'
    let params = {}
    let obj = {}
    obj.lessonId = ksId
    obj.classId = classId
    params.msg = obj
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'post', data:params}) ) 
    })
}
/**
 * 教学分析典型错题
 * @param tqmsUrl   题库域名地址带协议头
 * @param kind      目录id
 * @param usernamber用户账号
 * @param classid   班级id
 * @param knowledgeId 知识点Id
 * @param loginStyle 是否预览
 */
export function wrongQuestionsApi(tqmsUrl,ksid,usernumber,classid,knowledgeId,loginStyle){
    let url = tqmsUrl+"/tqms/jxfx/typicalWrongQues.action?lessionId="+ksid+"&username="+usernumber+"&class_id="+classid+"&knowledgeId="+knowledgeId+"&accuracy=60&loginStyle="+loginStyle
    try{
        VcomTeach.openNewBrowser(url,'xpos=-1&ypos=-1&title=典型错题&showclose=true');//&width=800&height=600
    }catch(e){
        console.log(e,"打开教学分析典型错题页面失败！");
    }
}

/**
 * 英语练相关
 * ****************************************************************************************
 */
export function getFankuiEngApi(paper_id){
    let url = process.env.ESLEANR_BASE_PREFIX + '/esleanrapi/Pubinterface/Index/getStuhwErrorFeedback'

    let params = {}
    params.paper_id = paper_id
    params.username = store.getters.teacherNumber
    params.classId = store.getters.userSelectClassId
    params.num = 20
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })        
}


/**
 * PLS相关
 * ****************************************************************************************
 */

/**
 * 发送预习任务
 * @param {*} username 教师账号
 * @param {*} truename 教师名称
 * @param {*} classIds 班级id
 * @param {*} classNames 班级名称
 * @param {*} number 学生相关信息
 * @param {*} id 资源编码
 * @param {*} subJobs 任务列表（多个任务逗号分割）
 */
export function sendRecommendApi(username,truename,classIds,classNames,number,id,subJobs){
    let url = process.env.PLS_BASE_PREFIX + '/interface/sendPreparation.do'

    let params = {}
    params.username = username
    params.truename = truename
    params.classIds = classIds
    params.classNames = classNames
    params.number = number
    params.id = id
    params.subJobs = subJobs
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'post', data:params}) ) 
    })        



}


/**
 * 校本资源（教材资源推荐）
 * @param {*} userName 
 * @param {*} userType 
 * @param {*} resId 
 * @param {*} resType 
 * @param {*} sendToClass 
 * @param {*} truename 
 * @param {*} schoolId 
 */
export function sendRecommendXbzyApi(userName,userType,resId,resType,sendToClass,truename,schoolId){
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/saveTuiJianXClass.do'

    let params = {}
    params.userName = userName
    params.userType = userType
    params.resId = resId
    params.resType = resType
    params.sendToClass = sendToClass
    params.truename = encodeURIComponent(encodeURIComponent(truename))
    params.schoolId = schoolId
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'post', data:params}) ) 
    })        



}

/**
 * 工具条截图后选择班级发送
 * @param {*} userName 
 * @param {*} userType 
 * @param {*} resId 
 * @param {*} resType 
 * @param {*} sendToClass 
 * @param {*} truename 
 * @param {*} custSendType 
 */
export function sendScreenByToolsApi(userName,userType,resId,resType,sendToClass,truename,custSendType){
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/saveTuiJianXClass.do'

    let params = {}
    params.userName = userName
    params.userType = userType
    params.resId = resId
    params.resType = resType
    params.sendToClass = sendToClass
    params.truename = truename
    params.custSendType = custSendType
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'post', data:params}) ) 
    })        



}
/**
 * 课前预习相关
 * #########################################################################################
 */

/**
 * 发起探究
 * @param {*} rcode 
 */
export function sendToPadApi(rcode){
    let url = process.env.PLS_BASE_PREFIX + '/interface/sendPreparation.do'

    let params = {}
    params.id = rcode
    params.sendPadFlag = 1    
    params.username = store.getters.teacherNumber
    params.classIds = store.getters.userSelectClassId
    params.truename = encodeURIComponent(encodeURIComponent(store.getters.trueTeacherName))
    params.classNames = encodeURIComponent(encodeURIComponent(store.getters.userSelectClassName))
    
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'post', data:params}) ) 
    })     
}

/**
 * 发起探究后下载zip包
 * @param {*} paper_id 
 */
export function getDownloadZipFileUrlApi(paper_id){
    return store.getters.transferProtocol + store.getters.domainConfig["PLS"] + '/interface/downloadZipFile.do?id='+paper_id+'&ut='+store.getters.ut    
}



/**
 * 获取预习反馈结果
 * @param {*} rcode 
 * @param {*} subjobid 
 */
export function getYuxiFankuiApi(rcode,subjobid){
    let url = process.env.PLS_BASE_PREFIX + '/interface/getCourseJobStuFk.do'

    let params = {}
    params.jobid = rcode  
    params.username = store.getters.teacherNumber
    params.classid = store.getters.userSelectClassId
    params.subjobid = subjobid
    
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })     
}

/**
 * 获取单个人的预习反馈内容
 * @param {*} rcode 
 * @param {*} subjobid 
 */
export function getYuxifankuiResultByUserApi(rcode,subjobid,stuid){
    let url = process.env.PLS_BASE_PREFIX + '/interface/getCourseSubJobFk.do'

    let params = {}
    params.jobid = rcode  
    params.username = stuid
    params.classid = store.getters.userSelectClassId
    params.subjobid = subjobid
    
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })    
}


/**
 * 获取云盘中的资源列表
 * @param {*} fileFormat 
 */
export function getCloudResApi(fileFormat,teachnumber,currPage,pageSize,parentfcode){
    let url = process.env.PLS_BASE_PREFIX + '/teacher/getFileListNewInfos.do'

    let params = {}
    params.teachnumber = teachnumber  
    params.currPage = currPage
    params.pageSize = pageSize
    params.outType = 1
    params.place = 0
    if(fileFormat == ''){
        if(parentfcode == ''){
            params.parentfcode = 0
        }else{
            params.parentfcode = parentfcode
        }        
    }else{
        params.fileFormat = fileFormat
    }

    
    
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })    
}


/**
 * 获取云盘中各种资源的数量
 */
export function getCloudResCountApi(){
    let url = process.env.PLS_BASE_PREFIX + '/teacher/getFileCountInLeftFileFormatJson.do'

    let params = {}
    params.t = Math.random()  
    
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })     
}


export function getShareResApi(currPage,pageNum,rootCode,rcode){
    let url = process.env.PLS_BASE_PREFIX + '/youjiao2/getShareFileList.do'

    let params = {}
    params.page = currPage
    params.pageNum = pageNum
    if(rootCode != ''){
        params.shareRootFcode = rootCode
        params.parentFcode = rcode
    }
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })     
}
/**
 * 发起探究相关
 * #########################################################################################
 */


export function getPadVersion(){
    let url = process.env.VFS_BASE_PREFIX + '/individualizedManage/api/index.php'

    let clientVersion = ''

    try{
        let baseVersion = VcomTeach.getVcomTeachVersion()
        let arr = baseVersion.split(";")
        clientVersion = arr[0]
    }catch(e){

    }
    

    let params = {}
    params.field = 'classbag'  
    params.version = clientVersion
    
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })       
}



/**
 * 微课相关
 * #########################################################################################
 */

/**
 * 发送微课资源接口
 * @param {*} rcode 
 * @param {*} fromUsername 
 * @param {*} fromTruename 
 * @param {*} stuClassId 多个班级用逗号分割
 */
export function wkResSendApi(rcode,fromUsername,fromTruename,stuClassId){
    let url = process.env.MICRO_BASE_PREFIX + '/interface/shareToStudent.action'
    let params = {}
    params.resourceId = rcode
    params.fromUsername = fromUsername
    params.fromTruename = encodeURIComponent(fromTruename)
    params.stuClassId = stuClassId
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

/**
 * 微课资源推荐
 * @param {*} catalogId 
 * @param {*} username 
 * @param {*} truename 
 * @param {*} classIdList 
 */
export function wkResRecommendApi(catalogId,username,truename,classIdList){
    let url = process.env.MICRO_BASE_PREFIX + '/teacher/ownpc/recommendCatalogByClass.action'
    let params = {}
    params['ownMyCatalog.catalogId'] = catalogId
    params.username = username
    params.truename = truename
    params.classIdList = classIdList
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

/**
 * VFS相关
 * #########################################################################################
 */

/**
 * 获取底部推荐信息
 * @param {*} self 
 */
export function getNotice(self){
    let vfs_url = store.getters.transferProtocol + store.getters.domainConfig["VFS"]
    let scriptEle = document.createElement('script')
    scriptEle.src = vfs_url+'/A01/A01045/A01045008/A01045008001/list.json'
    document.body.appendChild(scriptEle)
    scriptEle.onload = function() {
        if(infolistA01045008001!='undefined'&&infolistA01045008001!=null && infolistA01045008001.infosList && infolistA01045008001.infosList.length>0){
            let tmp = infolistA01045008001.infosList[0];
            let linkUrl = ''
			if(tmp.contenttype == 'HTML'){
				linkUrl = vfs_url + tmp.filepath;
			}else if(tmp.contenttype == 'SURL'){
				linkUrl = tmp.infourl;
            }
            self.noticeTitle = tmp.topic
            self.noticeUrl = linkUrl
        }
    }
}




/**
 * 考勤相关
 * #########################################################################################
 */

 /**
  * 保存考勤接口
  * @param {*} ClassCode 班级编码
  * @param {*} ClassType 班级类型
  * @param {*} TeaAccount 教师账户
  * @param {*} TeaName 教师姓名
  * @param {*} AttList 出勤学生账号/卡号（以’|’分隔）
  * @param {*} LateList 迟到学生账号/卡号（以’|’分隔）
  * @param {*} LeaList 请假学生账号/卡号（以’|’分隔）
  * @param {*} AbsList 旷课学生账号/卡号（以’|’分隔）
  */
export function addKaoQinApi(ClassCode,ClassType,TeaAccount,TeaName,AttList,LateList,LeaList,AbsList){
    let url = process.env.PAT_BASE_PREFIX + '/HistoryTrack/AddClassKQ'
    let params = {}
    params.ClassCode = ClassCode
    params.ClassType = ClassType
    params.TeaAccount = TeaAccount
    params.TeaName = TeaName
    params.KQTime = jsTimeToString(new Date())
    params.AttList = AttList
    params.LateList = LateList
    params.LeaList = LeaList
    params.AbsList = AbsList
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}


//将js的时间对象转换为字符串yyyy-MM-dd HH:ss:mm
function jsTimeToString(time){
    let year=time.getFullYear();
    let month=time.getMonth()+1;
    let day=time.getDate();
    let hour=time.getHours();
    let minute=time.getMinutes();
    let second=time.getSeconds();
    if(month<10){
        month="0"+month;
    }
    if(day<10){
        day="0"+day;
    }
    if(hour<10){
        hour="0"+hour;
    }
    if(minute<10){
        minute="0"+minute;
    }
    if(second<10){
        second="0"+second;
    }
    let strTime = year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
    return strTime;
}


/**
 * UB相关
 * ****************************************************************************************
 */
export function addUb(ucode,desc){
    let url = store.getters.transferProtocol +store.getters.domainConfig["UB"] + '/ub/interface/data_report.jsp'

    let params = {}

    let obj = {}
    obj.a = store.getters.teacherNumber
    obj.ac = store.getters.areaId
    obj.ad = Math.random()
    obj.at = 'u'
    obj.c = ucode
    obj.n = 1
    obj.ut = 2
    obj.i = encodeURIComponent(encodeURIComponent(desc))



    params.p = JSON.stringify(obj)
    params.random = Base64.encode(store.getters.teacherNumber+store.getters.areaId+ucode)
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })        
}

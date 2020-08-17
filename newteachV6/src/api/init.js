/**
 * 加载首页需要初始化的内容
 * 1.获取展示栏目列表
 * 2.判断用户是否有当前班级（如果只有一个班级，直接设置当前班级，否则让从多个班级选择一个）
 * 3.展示用户头像,年级，公告等
 * 4.获取当前用户的版本列表（如果有默认版本展示默认的，如果没有展示第一个）
 * 5.设置并获取用户当前版本
 * 6.获取用户版本和目录信息（设置用户的年级，学期，学科，学段，版本等信息）
 * 7.获取用户课程进度（当前学习到第几章节）
 * 8.设置用户课程进度
 * 9.展示目录树
 * 10.判断是否有课堂教学栏目，如果有则展示课堂教学栏目的内容，如果没有就展示第一个栏目的内容
 */
import request from '@/utils/request'
import store from '@/store'
import router from '@/router'
import { setToken, removeToken, removeUt} from '@/utils/auth'
import commonUtils from '@/utils/common'
import { getSsoGrantByUt} from '@/api/interface'
import { setIsSchoolBag } from '@/api/client'

/**
 * 设置授课地址
 * @param {String} schoolUrl 
 * @param {*} cityUrl 
 */
export function setDomainFile(cityUrl){
    if(cityUrl && cityUrl!=null && cityUrl!="" && cityUrl!="0"){
        let content="";
        //content="showke.school_url="+schoolUrl+";showke.city_url="+cityUrl+";";
        content="showke.city_url="+cityUrl+";";
        console.log("写入showkeip.ini："+content);
        try{
        VcomDownOcx.WriteInfo("","showkeip.ini",content,0);
        }catch(e){
            console.log("控件异常！非客户端环境！！");
        }
    }
}
/**
 * 保存升级信息pcupconfig.txt文件
 * @param {*} areaCode 
 * @param {*} schoolId 
 */
export function saveAreaInfoFile(areaCode,schoolId){
    //&areacode=34.01.01&schoolcode=340101000001
    if("undefined"!=typeof(areaCode) && areaCode!=null && "undefined"!=typeof(schoolId) && schoolId!=null){
        let content = "&areacode="+areaCode+"&schoolcode="+schoolId;
        console.log("写入pcupconfig.txt文件："+content);
        try{
            VcomDownOcx.WriteInfo("","pcupconfig.txt",content,0);
        }catch(e){
            console.log("控件异常！非客户端环境！！");
        }
    }else{
        console.log("pcupconfig.txt文件参数错误！！areaCode:"+areaCode+" schoolId:"+schoolId);
    }
}

/**
 * 读取客户端目录下ClientInfo.xml，获取clientType判断定制信息
 */
export function getClientType(){
    try{
        /*
        let skpath=VcomDownOcx.GetSpecialFolderPath(100);
        console.log(skpath);
        let tempXml=VcomDownOcx.ReadInfo(skpath,"ClientInfo.xml");
        if("undefined"!=typeof(tempXml) && tempXml!=null){
            let xs=tempXml.indexOf("<clientType>");
            let xe=tempXml.indexOf("</clientType>");
            if(xs>-1 && xe>(xs+12)){
                return tempXml.substring(xs+12,xe);
            }
        }
        */
       //通过版本接口获取，分号分割第二段
       let versioninfo=VcomTeach.getVcomTeachVersion();
       if("undefined"!=typeof(versioninfo) && versioninfo!=null && versioninfo.indexOf(";")>0){
        return versioninfo.split(";")[1];
       }
    }catch(e){
        console.log("控件异常！非客户端环境！！");
    }
    return null;
}

/**
 * 检查保存当前平台id
 * @param {String} areaCode 
 */
export function updateLocalAreaCode(areaCode){
    if(typeof(areaCode)=="undefined" || areaCode==null){
        console.log("保存当前平台Id失败！平台Id为空！");
        return;
    }
    try{
        let data=VcomTeach.execSelect("select str_value from teachui_table where vid='localAreaCode';","1");
        let r=false;
        let rArr=null;
        if(typeof(data)!="undefined" && data!=null){
        try{
            rArr=JSON.parse(data);
        }catch(e){}
        }
        if(rArr!=null && rArr.length>0){
            if(areaCode!=rArr[0]){
                console.log("update localAreaCode Data:"+areaCode);
                r=VcomTeach.execDML("update teachui_table set str_value='"+areaCode+"' where vid='localAreaCode';");
                VcomTeach.commitFile('database')
            }
        }else{
            console.log("insert localAreaCode Data:"+areaCode);
            r=VcomTeach.execDML("insert into teachui_table(vid,str_value,remark2) values ('localAreaCode','"+areaCode+"','当前平台Id');");
            VcomTeach.commitFile('database')
        }
        if(r){
            console.log("保存当前平台Id成功！");
        }
    }catch(e){
        console.log("保存当前平台Id失败！控件异常？？"+e.message);
    }
}

/**
 * 获取当前平台ID
 * @returns areaCode {String/null}
 */
export function getLocalAreaCode(){
    try{
        let data=VcomTeach.execSelect("select str_value from teachui_table where vid='localAreaCode';","1");
        let r=false;
        let rArr=null;
        if(typeof(data)!="undefined" && data!=null){
            rArr=JSON.parse(data);
        }
        if(rArr!=null && rArr.length>0){
            return rArr[0];
        }
    }catch(e){
        console.log("获取当前平台Id失败！控件异常？？"+e.message);
    }
    return null;
}

//获取教学机mac
export function getTeacherComputerMac(){
    let teacherComputerMac = ''
    try{
        teacherComputerMac =  VcomMacIp.GetMacInfo()
    }catch(e){
        //未得到mac时的默认值，便于页面可登录
        teacherComputerMac="DE-FA-UL-T0-MA-C0";
        commonUtils.console(e,'获取mac失败')
    }
    commonUtils.console(teacherComputerMac)
    return teacherComputerMac;
}


//获取jwt_accessToken信息对象
export function getJWTInfo(accessToken){
    let tarr=accessToken.split(".");
    let jsonStr=null;
    if(tarr.length>2){
        //jsonStr=base64.decode(tarr[1]);
		jsonStr=window.atob(tarr[1]);
    }
	if(jsonStr!=null){
		if(jsonStr.lastIndexOf("}")>1){
			jsonStr=jsonStr.substring(0,jsonStr.lastIndexOf("}")+1);
		}
		return JSON.parse(jsonStr);
	}
	return null;
}

//获取产品鉴权和栏目信息
export async function getGrantAndMenus(){
    let grantStr = ""

    if(store.getters.modules.length == 0){
        //授课预览（重新获取栏目信息）
        let ssoGrantResponse = await getSsoGrantByUt()
        if(ssoGrantResponse.authFlg == 0){
            //凭证失效，退出重新登录
            removeToken()
            removeUt()
            router.push({ path: '/login'})
        }else{
            let userObj = getUserInfoBySso(ssoGrantResponse)
            store.dispatch('setTeacherInfo', userObj)
        }
    }

    //获取产品鉴权通过用户名
    let ssoGrantResponse = await getSsoGrantByUsername()
    if(ssoGrantResponse && ssoGrantResponse.appNumbersNoGrant && ssoGrantResponse.appNumbersNoGrant.length > 0){
        for(let item of ssoGrantResponse.appNumbersNoGrant){
            grantStr += ',' + item.replace('tls_menu','')
            }
            grantStr += ","
    }

    let obj = formatModules(grantStr)

    return obj.mainMenuArr
}


//获取产品鉴权信息通过用户名
export function getSsoGrantByUsername(){
    let url = process.env.SSO_BASE_PREFIX + '/sso/pdGrant?appFlg=TLS&username=' + store.getters.teacherNumber

    let params = {}

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params})) 
    })       

}

//从用户中心获取用户信息并设置
export function getUserInfoBySso(ssoAuthResponse){
    //进入首页
    let userObj = {};

    if(ssoAuthResponse.ut != ''){
        setToken(ssoAuthResponse.ut)
        userObj.ut = ssoAuthResponse.ut
    }

    userObj.teacherNumber = ssoAuthResponse.user.username
    userObj.trueTeacherName = ssoAuthResponse.user.truename
    userObj.userType = ssoAuthResponse.user.usertype
    userObj.schoolId = ssoAuthResponse.user.school.schoolId
    userObj.schoolName = ssoAuthResponse.user.school.schoolName
    userObj.modules = ssoAuthResponse.userAuthoritys[0].modules
    userObj.areaId = ssoAuthResponse.user.area.areaId

    let padTeachAble = ssoAuthResponse.user.school.padTeachAble
    if(padTeachAble == 0||padTeachAble == 1){
        padTeachAble = 0
    }
    if(padTeachAble == 2 || padTeachAble == 3){
        padTeachAble = 1
    }
    userObj.padTeachAble = padTeachAble

    setIsSchoolBag(padTeachAble)

    let schoolStageArr = []
    if(ssoAuthResponse.user.studyStage.length >0 ){
      for(let item of ssoAuthResponse.user.studyStage){
        schoolStageArr.push(item.studyStageCode)
      }
    }
    
    userObj.schoolStage = schoolStageArr.join(',')
    return userObj
}

//过滤栏目数据
export function formatModules(grantStr){
    let obj = {}
    let mainMenuArr = []
    let secondMenuArr = []

    for(let item of store.getters.modules){
            //产品权限过滤
        if(grantStr.indexOf(item.moduleid) == -1){
            //学段过滤
            let showStage = item.c2;
            if(showStage != ''){
                let passStageFilt=false;
                let schoolStage = store.getters.schoolStage

                if(schoolStage.indexOf(",")>-1){
                    let stageArr=schoolStage.split(",")
                    for(var si=0;si<stageArr.length;si++){
                        if(showStage.indexOf(stageArr[si])>-1){
                            passStageFilt=true
                            break
                        }
                    }
                }else if(showStage.indexOf(schoolStage)>-1){
                    passStageFilt=true;
                }
                if(!passStageFilt){continue;}
            }

            //过滤资源搜索栏目
            if(item.moduleid == '03.58'){
                continue
            }

            var menuObj = {};
            menuObj.name = item.modulename
            menuObj.menuid = item.moduleid
            menuObj.method = item.moduleurl
            menuObj.orderid = item.orderid
            menuObj.icon = item.c3
            menuObj.c3 = getAbbrByName(item.modulename)
            menuObj.hasChild = false
            menuObj.childArr = []



            
            let class_id_array = menuObj.menuid.split(".");

            if(class_id_array.length > 2){
                //子栏目
                secondMenuArr.push(menuObj)
            }else{
                //主栏目
                mainMenuArr.push(menuObj)
            }
        }
    }    

    //处理栏目信息
    mainMenuArr = mainMenuArr.sort(commonUtils.sortBy('orderid'))
    for(let item of mainMenuArr){
        let tmpArr = secondMenuArr.filter(val => val.menuid.indexOf(item.menuid) != -1)
        if(tmpArr.length > 0){
            item.hasChild = true
            tmpArr = tmpArr.sort(commonUtils.sortBy('orderid'))
            item.childArr = tmpArr
        }
    }

    obj.mainMenuArr = mainMenuArr
    obj.secondMenuArr = secondMenuArr

    return obj
}

function getAbbrByName(modulename){
    let abbr;
    switch(modulename){
        case '预习探究':
            abbr = 'kqyx'
            break
        case '课堂教学':
            abbr = 'ktjx'
            break    
        case '课后作业':
            abbr = 'khzy'
            break
        case '教学云盘':
            abbr = 'jxyp'
            break
        case '教学分析':
            abbr = 'jxfx'
            break
        case '升学考试':
            abbr = 'sxks'
            break
        case '名师微课':
            abbr = 'mswk'
            break
        case '校本资源':
            abbr = 'xbzy'
            break
        case '课外阅读':
            abbr = 'kwyd'
            break
        case '直播课程':
            abbr = 'zbkc'
            break
        case '本地资源':
            abbr = 'bdzy'
            break
        default:
            abbr = ''
    }

    return abbr

}


//获取班级收费信息
export function BssCharge(){
    // let url = store.getters.transferProtocol + store.getters.domainConfig['SSO'] +'/sso/interface/queryBssStateSchool.jsp'
    let url = process.env.SSO_BASE_PREFIX + '/sso/interface/queryBssStateSchool.jsp'
    let params = {}
    
    params.username = store.getters.teacherNumber
    params.reqEncoding = 'gbk'

    return request({url: url, method: 'get', data:params}) 
}

/**
 * 获取当前教师的所有班级
 */
export async function getAllClassData(type){
    let arr = []
    let res = await getAllClassApi(type)

    if(res.rtnArray && res.rtnArray.length > 0){
        for(let item of res.rtnArray){
            let obj = {}
            obj.classId = item.classId
            obj.className = item.className
            obj.classType = item.classType
            arr.push(obj)
        }
    }
    return arr
}


/**
 * 获取班级信息
 * @param {*} type 1，当前老师的所有班级2，当前学校所有班级
 */
function getAllClassApi(type){
    let url = process.env.TMS_BASE_PREFIX + '/tms/interface/querySchoolClass.jsp'

    let params = {}
    params.classType = 'a'
    if(type == 2){
        params.queryType = 'bySchool'
        params.schoolId = store.getters.schoolId
    }else{
        params.queryType = 'byUserName'
        params.userName = store.getters.teacherNumber
    }

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params})) 
    })       
}




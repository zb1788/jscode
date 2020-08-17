/**
 * 课前预习相关api
 */
import request from '@/utils/request'
import store from '@/store'
import commonUtils from '@/utils/common'
import {getIconName} from '@/api/api'
import { getCurPreviewRes,getCourseTypeShow,getResInfo,getFankui } from '@/api/plsapi'
import { getYuxiFankuiApi, getYuxifankuiResultByUserApi,getStudentListByClassNew,getClassGroupApi } from '@/api/interface'
import { createCipher } from 'crypto';



//处理返回资源数据
export async function formatPreviewRes(systype){
    let resList = await getCurPreviewRes(systype)
    let arr = []
    if(resList.items != null){
        for(let val of resList.items){
            
            let obj = {}
            obj.rcode = val.id
            obj.title = val.name
            //obj.desc = val.desc;
            obj.jobtype = val.jobtype
            obj.genflag = val.genflag //1为编辑过，0没编辑过
            obj.useIcon = '' //已发
            obj.useFlag=val.useFlag;
            obj.isClick = true //默认有点击事件
            if(val.useFlag != null && val.useFlag == 2){
                //显示已发标记
                obj.useIcon = require('@/assets/images/icon/res/yiyong.png')
            }
            obj.icon = require('@/assets/images/icon/yuxi.png')

            //按钮数组
            let buttonArr = []
            let fasongpvname = ''
            let fankuipvname = ''
            if(systype == 0){
                //我的
                fasongpvname = 'tls_wdyx_fs'
                fankuipvname = 'tls_wdyx_fkck'
            }else if(systype == 1){
                //名师
                fasongpvname = 'tls_msyx_fs'                
            }else if(systype == 2){
                //参考
                fasongpvname = 'tls_yjyx_fs'                
            }
            buttonArr .push({'name':'发送作业','enabled':true,'type':'sendHomeWork','pvname':fasongpvname})


            if(systype == 0){
                //我的预习(不展示已发标识)
                obj.useIcon = ''
                if(val.useFlag != null && val.useFlag == 2){
                    buttonArr .push({'name':'反馈','enabled':true,'type':'fankui','pvname':fankuipvname})
                }else{
                    buttonArr .push({'name':'反馈','enabled':false,'type':'fankui','pvname':fankuipvname})
                }
            }

            //判断是否平板课堂
            if(store.getters.isSchoolbag && store.getters.isHavingClass){
                buttonArr .push({'name':'发起探究','enabled':true,'type':'faqitanjiu','pvname':''})
            }else{
                buttonArr .push({'name':'发起探究','enabled':false,'type':'faqitanjiu','pvname':''})
            }

            obj.button = buttonArr
            obj.playJs = {'playName':'yuxiView',params:{'rcode':obj.rcode,'title':obj.title}}
            arr.push(obj)
        }   
    }
    return arr
}

//获取课前预习的tab标签
export async function getTabList(){
    let res = await getCourseTypeShow()

    let objResult = {}
    objResult.tabArr = [] //标签数组
    objResult.activeName = '' //选中的标签    
    let arr = []
    if(res && res.sysjobTypeList){
        for(let item of res.sysjobTypeList){
          let obj = {}
          obj.name = item.systypeName
          obj.type = item.systype        
          if(item.systype == 1){
              //名师预习
              obj.pvname = 'tls_msyx_msyx'
          }else if(item.systype == 2){
              //参考预习
              obj.pvname = 'tls_yjyx_yjyx'
          }  
          objResult.tabArr.push(obj)
        }
        objResult.tabArr.push({'name':'我的预习','type':0,'tabIcon':"xx",'pvname':'tls_wdyx_wdyx'})
        //默认选中第一个
        objResult.activeName = objResult.tabArr[0].name
    }
    return objResult
}


//获取标签以及资源列表
export async function getResList(){
    let objResult = {}
    objResult.tabArr = [] //标签数组
    objResult.resList = [] //资源数组
    objResult.activeName = '' //选中的标签    
    if(store.getters.ksId == ''){
        return objResult
    }
    let res = await getCourseTypeShow()

    if(res && res.sysjobTypeList){
        for(let item of res.sysjobTypeList){
          let obj = {}
          obj.name = item.systypeName
          obj.type = item.systype          
          objResult.tabArr.push(obj)
        }
        objResult.tabArr.push({'name':'我的预习','type':0,'tabIcon':"xx"})
        //默认选中第一个
        objResult.activeName = objResult.tabArr[0].name
        let resList = await formatPreviewRes(objResult.tabArr[0].type)
        objResult.resList = resList
    }
    return objResult
}


//展示任务详情数据
export async function showData(id){
    let result = {}
    try{
        result = await getResInfo(id)
    }catch(e){
        commonUtils.console('获取训练详情失败',e)
    }
    
    let resList = []
    if(result.cj && result.cj.subJobList && result.cj.subJobList.length > 0){
        for(let [index,item]  of result.cj.subJobList.entries()){
            let obj = {}
            obj.subjobid = item.id
            obj.subjobname = '任务'+(index+1)
            obj.subjobdesc = item.desc
            obj.isClick = false
            obj.html = false
            if(item.yjtContent && item.yjtContent.content){
                if(item.yjtContent.content!="undefined")
                {
                    obj.html = true
                    obj.subjobdesc=item.yjtContent.content;
                }
            }
            if(!commonUtils.isNotEmpty(obj.subjobdesc) || obj.subjobdesc=='undefined'){
                obj.subjobdesc="暂无描述"
            }

            let resInfoArr = []
            if(item.subJobResList){
                for(let val of item.subJobResList){
                    let objInfo = {}
                    objInfo.destCode = val.destCode
                    objInfo.destType = val.destType
                    objInfo.destTitle = val.destTitle
                    objInfo.formatMark = ''
                    objInfo.icon = '' //图标
                    objInfo.playJs = {'playName':''}

                    objInfo.icon =  require('@/assets/images/icon/res/blank.png')
                    

                    if(val.formatMark != 'null' && val.formatMark != '' && typeof val.formatMark != 'undefined'){
                        let formatMark = val.formatMark.toLowerCase()
                        objInfo.formatMark = formatMark
                        let iconFormat = getIconName(objInfo.formatMark)
                        objInfo.icon = require(`@/assets/images/icon/res/${iconFormat}.png`)
                    }

                    //destType//1,资源，2试卷;3、文件夹;4、body；5、微课;6个性试卷 7、amr音频
                    if(objInfo.destType == 1){
                        objInfo.playJs = {'playName':'playRes',params:{'rcode':objInfo.destCode,'formatMark':objInfo.formatMark,'resType':1}}
                    }                   
                    if(objInfo.destType == 2 || objInfo.destType == 6){
                        objInfo.icon =  require('@/assets/images/icon/xunlian.png')
                        //训练作答
                        objInfo.playJs = {'playName':'zuoda',params:{'rcode':objInfo.destCode,'rsType':objInfo.destType}}
                    }                    
                    if(objInfo.destType == 3){
                        //云盘
                        objInfo.playJs = {'playName':'playRes',params:{'rcode':objInfo.destCode,'formatMark':objInfo.formatMark,'resType':3}}
                    }      
                    if(objInfo.destType == 4){
                        objInfo.playJs = {'playName':'playError',params:{'msg':'暂不支持body类型！'}}
                    } 
                    if(objInfo.destType == 5){
                        objInfo.icon = require('@/assets/images/icon/res/mp4.png')
                        //此处resType和龙真协商传递成bdwk表示是本地微课类型，名师微课的resType还是5
                        objInfo.playJs = {'playName':'playRes',params:{'rcode':objInfo.destCode,'rtitle':objInfo.destTitle,'resType':'bdwk'}}
                    }
                    if(objInfo.destType == 7){
                        //链接资源（有待确认）                        
                        objInfo.playJs = {'playName':'playRes',params:{'rcode':objInfo.destCode,'resType':1}}
                    }    
                    resInfoArr.push(objInfo)
                }
            }

            obj.resInfo = resInfoArr
            resList.push(obj)
        }
        return resList
        // return new Promise((resolve, reject) => {
        //     resolve(resList) 
        // })        
    }
    return []
}


//展示任务详情
//type:1，预览2，反馈，3电子书包查看
export async function showResInfo(type,row){
    let res = await showData(row.rcode)

    console.log(res)

    let resultObj = {}
    resultObj.resInfoList = []
    resultObj.template = 2
    let resInfoList = []
    let index_tmp = 0
    
    for(let [index,item] of res.entries()){ 
        let obj = {}
        if(item.html){
            obj.title = '<h2>'+item.subjobname + '</h2><p style="white-space:normal;">' + item.subjobdesc + '</p>'
        }else{
            obj.title = item.subjobname + ':' + item.subjobdesc
        }        
        obj.isClick = false
        obj.icon = ''
        obj.button = []
        obj.html = item.html
        
        if(type == 2){
            //反馈：增加预习反馈按钮
            let buttonArr = []
            buttonArr .push({'name':'预习反馈','enabled':true,type:'yuxifankui','playJs':{'playName':'yuxifankui',params:{'rcode':row.rcode,'subjobid':item.subjobid}}})
            obj.button = buttonArr
        }
        resInfoList.push(obj)
        index_tmp = resInfoList.length - 1
        for(let val of item.resInfo){
          let objRes = {}
          objRes.title = val.destTitle
          if(val.icon != ''){
            objRes.icon = val.icon
          }else{
            objRes.icon = ''
          }
          objRes.isClick = true
          objRes.playJs = val.playJs
          if(type == 2){
              //destType//1,资源，2试卷;3、文件夹;4、body；5、微课;6个性试卷。
              if(val.destType == 2|| val.destType == 6){
                //显示检测反馈按钮
                resInfoList[index_tmp].button = [{'name':'检测反馈','enabled':true,type:'jiancefankui','playJs':{'playName':'jiancefankui',params:{'subjobid':item.subjobid,'index':index_tmp}}}]
              }
          }
          resInfoList.push(objRes)
        }
    }

    
    if(type == 2){
        resInfoList.push({'title':'<strong>学生提问：</strong>以下为学生预习过程中提出的问题','isClick':false,'button':[]})
        let resFankui = await getFankui(row.rcode)
        if(resFankui.questionList && resFankui.questionList.length > 0){
            for(let item of resFankui.questionList){
                let obj = {}
                obj.title = item.stuname + '：' + item.question
                obj.icon = require('@/assets/images/question.png')
                obj.isClick = true
                obj.questionFlag = true
                resInfoList.push(obj)
            }
        }
    }

    resultObj.resInfoList = resInfoList

    return resultObj
}




/**
 * 发送预习
 * @param {*} checkStuList 要发送的学生名单
 * @param {*} hasGroup 是否有分组
 * @param {*} rcode 资源rcode
 * @param {*} jobidArr 要发送的任务id
 */
export function sendRecommend(baseStudent,checkStuList,hasGroup,rcode,jobidArr){

    let arr = []

    if(hasGroup){
        for(let i=0; i<8; i++){
            if(typeof checkStuList[i] != 'undefined'){
              for(let item of checkStuList[i]){
                  let obj = {}
                  obj.studentId = item.studentId
                  obj.studentName = encodeURIComponent(encodeURIComponent(item.studentName))
                  arr.push(obj)
              }
            }            
        }  
    }else{
        for(let item of checkStuList){
            let obj = {}
            obj.studentId = item
            obj.studentName = encodeURIComponent(encodeURIComponent(baseStudent['"'+item+'"']))
            arr.push(obj)            
        }
    }
  


    // for(let item of checkStuList){
    //     // let studentArr = stuList.filter(val => val.studentId == item)
        // let obj = {}
        // obj.studentId = studentArr[0].studentId
        // obj.studentName = studentArr[0].studentName
        // arr.push(obj)
    // }
    let number="";
    number += '[{';
    number += "'classId':'"+ store.getters.userSelectClassId+ "',";
    number += "'className':'" + encodeURIComponent(encodeURIComponent(store.getters.userSelectClassName))+ "',";
    number += "'student':" + JSON.stringify(arr) ;
    number += '}]'

    let params = {}
    params.username = store.getters.teacherNumber
    params.truename = store.getters.trueTeacherName
    params.classIds = store.getters.userSelectClassId
    params.classNames = encodeURIComponent(encodeURIComponent(store.getters.userSelectClassName))
    params.number = number
    params.id = rcode
    params.subJobs = jobidArr.join(',')

    return params
}



/**
 * 获取预习反馈结果
 * @param {*} rcode 
 * @param {*} subjobid 
 */
export async function getYuxiFankuiData(rcode,subjobid){
    let res = {}
    try{
        res = await getYuxiFankuiApi(rcode,subjobid)
    }catch(e){
        commonUtils.console(e,'调用pls获取预习反馈接口失败')
    }
    
    let arr = []

    if(res && res.items && res.items.length > 0){
        for(let item of res.items){
            let obj = {}
            obj = item
            if(item.finishflag == 0){
                obj.type = 'info'
            }else{
                obj.type = ''
            }
            obj.rcode = rcode
            obj.subjobid = subjobid
            arr.push(obj)
        }
    }
    return arr
}

/**
 * 获取单个人的预习反馈内容
 * @param {*} rcode 
 * @param {*} subjobid 
 */
export async function getYuxifankuiResultByUserData(rcode,subjobid,stuid){
    let res = {}
    let arr = []
    try{
        res = await getYuxifankuiResultByUserApi(rcode,subjobid,stuid)
    }catch(e){
        commonUtils.console(e,'调用pls查看单个人的预习反馈内容接口失败')
    }

    let content = ''
    if(res.message && res.att){
        if(res.message.length > 0){
            for(let item of res.message){
                content += item.message
            }
        }

        if(content == '' && res.att.length == 0){
            content = '该学生没有提交留言和附件'
        }
        let obj = {}
        obj.title = content
        obj.playJs = {'playName':''}
        arr.push(obj)

        for(let item of res.att){
            let objInfo = {}

            objInfo.icon = require('@/assets/images/icon/res/blank.png')
            objInfo.formatMark = ''
            if(item.formatMark != 'null' && item.formatMark != '' && typeof item.formatMark != 'undefined'){
                let formatMark = item.formatMark.toLowerCase()
                objInfo.formatMark = formatMark
                let iconFormat = getIconName(objInfo.formatMark)
                objInfo.icon = require(`@/assets/images/icon/res/${iconFormat}.png`)
            }
            objInfo.title = item.destTitle
            objInfo.playJs = {'playName':'playRes',params:{'rcode':item.destCode,'title':item.destTitle,'path':item.path,'resType':item.destType,'desc':item.destDesc,'formatMark':objInfo.formatMark}}
            arr.push(objInfo)
        }
    }

    return arr        
}



/**
 * 获取分组数据
 */
export async function getStudentGroupData(classId){
    let groupRes = await getClassGroupApi(classId)

    let arr1 = []

    let groupManagerArr = []

    let arrTheme = []

    for(let [i,item] of groupRes.data.rtnArray.entries()){
        let arr2 = []
        let obj = {}

        obj.groupKey = i
        obj.groupName = item.classGroupName
        obj.groupId = item.classGroupId
        obj.students = []

        let managerObj = {}
        managerObj.groupName = item.classGroupName
        managerObj.groupId = item.classGroupId
        managerObj.studentName = ""
        managerObj.shareOk = false
        managerObj.url = ""


        for(let val of item.memberInfo){
            let ObjInfo = {}

            if(val.groupManagerFlg == 1){
                managerObj.studentName = val.realName
                managerObj.studentId = val.studentNumber
            }

            ObjInfo.studentId = val.studentNumber
            ObjInfo.studentName = val.realName
            ObjInfo.groupManager = val.groupManagerFlg

            // ObjInfo.type = 'info'
            ObjInfo.shareOk = false
            ObjInfo.icon = 'not'
            ObjInfo.lock = ''
            ObjInfo.offline = true
            ObjInfo.styleTheme = ''
            ObjInfo.groupTheme = ''
            arr2.push(ObjInfo) 
        } 
        obj.students = arr2

        groupManagerArr.push(managerObj)
        arr1.push(obj)
    }
    
    let resultObj = {}
    resultObj.groupList = arr1
    resultObj.groupManagerList = groupManagerArr
    return resultObj
}




/**
 * 获取当前班级学生,并组合成分组数据
 */
export async function getStudentByClassData(){

    let arr = []
    
    let result = await getStudentListByClassNew(store.getters.userSelectClassId,store.getters.teacherComputerMac,1)
    console.log(result)
    if(result.code != '200'){
        self.$messageteach.error('获取学生列表失败')
        return fasle
    }
    let res = result.data
    

    // for(let i=0; i<8; i++){
    //     let obj = {}

    //     obj.groupKey = i
    //     obj.groupName = ''
    //     obj.groupId = ''
    //     obj.students = []

    //     arr.push(obj)
    // }

    // let i = 0
    // for(let [index,stu] of res.rtnArray.entries()){
    //     let obj = {}
    //     obj.studentId = stu.studentNumber
    //     obj.studentName = stu.realname
    //     obj.groupManager = 0


    //     if(index%8 == 0){
    //         if(index != 0){
    //             i = 0
    //         }         
    //     }else{
    //         i++
    //     }

    //     arr[i].students.push(obj)

    // }  
    
    for(let [index,stu] of res.rtnArray.entries()){
        let obj = {}
        obj.studentId = stu.studentNumber
        obj.studentName = stu.realname
        obj.groupManager = 0

        arr.push(obj)

    }   
    return arr
}

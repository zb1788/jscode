/**
 * 获取用户相关的信息
 * 获取学校班级信息
 * 获取用户版本列表
 * 设置用户版本
 * 切换版本
 * 获取用户头像
 * 获取用户当前版本和目录
 * 设置顶部用户信息
 * 获取课程进度
 * 展示目录树
 * 
 */
import request from '@/utils/request'
import store from '@/store'
import commonUtils from '@/utils/common'
import { setUserVersionProgress } from '@/api/interface'
import { clientToolTransmit } from '@/api/client'


//获取学校所有班级
export function getSchoolClass(){
    //  let url = store.getters.transferProtocol + store.getters.domainConfig['TMS'] + '/tms/interface/querySchoolClass.jsp'
     let url = process.env.TMS_BASE_PREFIX + '/tms/interface/querySchoolClass.jsp'
     let params = {}
     params.queryType = 'bySchool'
     params.schoolId = store.getters.schoolId
     
     return request({url: url, method: 'get', data:params}) 
}

//获取用户头像
export function getUserPhoto(){
    // let url = store.getters.transferProtocol + store.getters.domainConfig['TMS'] + '/tms/interface/queryTeacher.jsp'
    let url = process.env.TMS_BASE_PREFIX + '/tms/interface/queryTeacher.jsp'
    let params = {}
    params.queryType = 'byName'
    params.username = store.getters.teacherNumber
    

    return new Promise((resolve,reject) => {
        if(store.getters.teacherNumber == ''){
            return false
        }else{
            request({url: url, method: 'get', data:params}).then((response) => {
                if(response){
                    let photo = response.headPhoto
                    if(commonUtils.isNotEmpty(photo)){
                        let photoUrl = store.getters.transferProtocol + store.getters.domainConfig['VFS'] + '/tms/' +photo
                        resolve(photoUrl)
                    }
                }
            }).catch((error) => {
                commonUtils.console(error, '获取头像接口失败')
            })
        }
    })
}

/**
 * 获取章节以及用户所有版本信息
 * @param {*} self 
 */
export async function getChapterAndBookData(){    
    store.dispatch('setClassHourId', '')
    store.dispatch('setClassHourName','')

    let resultObj = {}
    resultObj.bookList = []
    resultObj.curBookId = ''
    resultObj.baseChapterData = []
    try{
        let result = await getUserAllBookList()
        if(result.rtnArray.length >0){
            let hasHistoryFlag = false
            for(let item of result.rtnArray){
                let obj = {}
                obj.bookId = item.bookId
                if(item.studyStageCode != '0003'){
                    if(item.gradeCode == '0006'){
                        obj.name = item.studyStage+item.grade + ' • ' +item.term + ' • ' + item.subject + ' • ' + item.version
                    }else{
                        obj.name = item.grade + ' • ' +item.term + ' • ' + item.subject + ' • ' + item.version
                    }                    
                }else{
                    obj.name = item.studyStage + ' • ' + item.subject + ' • ' + item.version + ' • ' + item.bookOptionName
                }
                // self.bookList.push(obj)
                resultObj.bookList.push(obj)
            }
            
            let baseDataObj = {}

            if(commonUtils.isNotEmpty(result.seted)){
                let tmpArr = resultObj.bookList.filter(item => item.bookId == result.seted)
                if(tmpArr.length > 0){
                    hasHistoryFlag = true
                    resultObj.curBookId = result.seted
                }
            }else{
                resultObj.curBookId = resultObj.bookList[0].bookId
            }

            let baseDataTmp = result.rtnArray.find(item => item.bookId == resultObj.curBookId)

            if(typeof baseDataTmp != 'undefined'){
                baseDataObj.grade = baseDataTmp.grade
                baseDataObj.gradeCode = baseDataTmp.gradeCode
                baseDataObj.studyStage = baseDataTmp.studyStage
                baseDataObj.studyStageCode = baseDataTmp.studyStageCode
                baseDataObj.subject = baseDataTmp.subject
                baseDataObj.subjectCode = baseDataTmp.subjectCode
                baseDataObj.term = baseDataTmp.term
                baseDataObj.termCode = baseDataTmp.termCode
                baseDataObj.version = baseDataTmp.version
                baseDataObj.versionCode = baseDataTmp.versionCode
                baseDataObj.bookOptionCode = baseDataTmp.bookOptionCode
                baseDataObj.bookOptionName = baseDataTmp.bookOptionName
            }


            //没有历史浏览记录
            if(!hasHistoryFlag){
                await setUserVersionProgress(resultObj.curBookId)
            }
            
            // let userBase = await getUserBase()
            // if(userBase.book != null){
            //     let baseDataObj = setUserBaseData(userBase.book)
            //     store.dispatch('setBaseData', baseDataObj)
            // }


            store.dispatch('setBaseData', baseDataObj)
            
            //发送登录串
            console.log('登录串lllll')
            clientToolTransmit(1)

            store.dispatch('setBookId',resultObj.curBookId)

            let lastCourseRes = await getUserLastCourse()
            let isNewVersion = false
            let curKsid = ''
            let curKsName = ''
            let curMfFlag = ''
            let curClassHourId = ''
            let curClassHourName = ''
            let isShowClassHour = false

            let mainMenuArr = [] //单元+章节数组
            let classHourArr = [] //课时数组
            let classHourKsCodeArr = [] //通过课时id查找父级kscode(只存只有一个章节下只有一个课时)

            if(lastCourseRes.flag == 1){
                if(lastCourseRes.item.ksId == 'null'){
                    //没有浏览记录，默认为第一章节
                    isNewVersion = true
                }else{
                    curKsid = lastCourseRes.item.ksId
                    //判断是否有课时
                    if(commonUtils.isNotEmpty(lastCourseRes.item.classHourId)){
                        curClassHourId = lastCourseRes.item.classHourId
                    }
                }
            }else{
                //新增的课本，默认为第一章节
                isNewVersion = true
            }


            //获取当前课本的章节信息,并检查是否显示课时（1，没有课时；2，章节下只有一个课时）
            let userBookChapterRes = await getUserBookChapter()
            
            if(userBookChapterRes.classes != '' && userBookChapterRes.classes != null){
                resultObj.baseChapterData = userBookChapterRes.classes
                let bookChapterArrTmp = [] //包含课时

                let unitFlag = ''
                for(let [index,item] of userBookChapterRes.classes.entries()){
                    if(item.endflag == '0'){
                        store.dispatch('setKsBookId', item.code)                        
                        continue
                    }
                    let obj = {}
                    obj.id = item.code
                    obj.label = item.name
                    obj.ksCode = item.code
                    obj.mfFlag = item.mfFlag
                    obj.isUnit = item.isUnit
                    obj.children = []

                    mainMenuArr[obj.ksCode] = obj.label

                    //当前浏览章节
                    if(curKsid == item.code){
                        if(item.classHours && item.classHours.length > 1){
                            isShowClassHour = true
                        }else{
                            isShowClassHour = false
                        }
                    }
                 
                    if(item.isUnit == unitFlag || unitFlag == ''){
                        bookChapterArrTmp.push(obj)

                        unitFlag = item.isUnit
                        if(item.isUnit != 1 ){
                            if(item.classHours && item.classHours.length >0){                                        
                                for( let val of item.classHours){
                                    let classHourObj = {}
                                    classHourObj.label = val.name
                                    classHourObj.ksName = item.name
                                    classHourObj.ksCode = val.ksId
                                    classHourObj.id = val.id
                                    classHourObj.isUnit = '2'
                                    
                                    classHourArr[val.id] = val.name

                                    let indexTmp = bookChapterArrTmp.length -1
                                    if(bookChapterArrTmp[indexTmp].isUnit == '0'){
                                        bookChapterArrTmp[indexTmp].children.push(classHourObj)
                                    }                  
                                }
                            }
                        }
                    }else{
                        if(item.isUnit == 1){
                            bookChapterArrTmp.push(obj)
                            unitFlag = item.isUnit
                        }else{
                            let indexTmp = bookChapterArrTmp.length -1

                            bookChapterArrTmp[indexTmp].children.push(obj)


                            if(item.classHours && item.classHours.length >0){                                        
                                for( let val of item.classHours){
                                    let classHourObj = {}
                                    classHourObj.label = val.name
                                    classHourObj.ksName = item.name
                                    classHourObj.ksCode = val.ksId
                                    classHourObj.id = val.id
                                    classHourObj.isUnit = '2'

                                    classHourArr[val.id] = val.name
                                    
                                    let indexTmp = bookChapterArrTmp.length -1
                                    if(bookChapterArrTmp[indexTmp].isUnit == '1'){
                                        let indexClassHourTmp = bookChapterArrTmp[indexTmp].children.length -1
                                        bookChapterArrTmp[indexTmp].children[indexClassHourTmp].children.push(classHourObj)
                                    }else{
                                        bookChapterArrTmp[indexTmp].children.push(classHourObj)
                                    }
                                }
                            }
                        }
                        
                    }
                }



                //循环处理数据（如果章节下只有一个课时，则不展示课时，只展示章节信息）
                for(let [index,item] of bookChapterArrTmp.entries()){
                    if(item.isUnit == '0'){
                        if(item.children.length == 1){
                            bookChapterArrTmp[index].classHourId = item.children[0].id
                            bookChapterArrTmp[index].classHourName = item.children[0].label                                   
                                                                
                            classHourKsCodeArr[item.children[0].id] =  bookChapterArrTmp[index].ksCode
                            bookChapterArrTmp[index].children.splice(0,1);
                        }
                    }else{
                        if(item.children.length >0){
                            for(let [indexTmp,val] of item.children.entries()){
                                if(val.isUnit == '0'){
                                    if(val.children.length == 1){
                                        bookChapterArrTmp[index].children[indexTmp].classHourId = val.children[0].id
                                        bookChapterArrTmp[index].children[indexTmp].classHourName = val.children[0].label

                                        classHourKsCodeArr[val.children[0].id] = bookChapterArrTmp[index].children[indexTmp].ksCode  
                                        bookChapterArrTmp[index].children[indexTmp].children.splice(0,1)                                             
                                    }
                                }
                            }
                        }
                    }
                }

        
                //深拷贝，非引用(生成不包含课时的目录树)
                let bookChapterArrNoClassHour = commonUtils.objDeepCopy(bookChapterArrTmp);
                checkChild(bookChapterArrNoClassHour)

                let defaultCheckedKey = ''//默认选中的章节id


                if(isNewVersion){
                    //新版本默认第一个
                    if(bookChapterArrTmp.length > 0){
                        if(bookChapterArrTmp[0].isUnit == '1'){
                            //单元
                            if(bookChapterArrTmp[0].children.length > 0){
                                if(bookChapterArrTmp[0].children[0].isUnit == '0'){
                                    //章节
                                    curKsid = bookChapterArrTmp[0].children[0].id
                                    curMfFlag = bookChapterArrTmp[0].children[0].mfFlag
                                    if(bookChapterArrTmp[0].children[0].children.length > 0){
                                        //课时
                                        curClassHourId = bookChapterArrTmp[0].children[0].children[0].id
                                    }else{
                                        if(bookChapterArrTmp[0].children[0].classHourId){
                                            //如果有classHourId，表示有课时，没有表示只有章节
                                            curClassHourId = bookChapterArrTmp[0].children[0].classHourId

                                        }
                                    }
                                    addUserLastCourseToDb(curKsid,curClassHourId)
                                }
                            }else{
                                //单元下没有章节
                                curKsid = bookChapterArrTmp[0].id
                                curMfFlag = bookChapterArrTmp[0].mfFlag
                                defaultCheckedKey = curKsid                                
                            }
                        }else{
                            //非单元
                            curKsid = bookChapterArrTmp[0].id
                            curMfFlag = bookChapterArrTmp[0].mfFlag
                            if(bookChapterArrTmp[0].children.length >0 && bookChapterArrTmp[0].children[0]){
                                curClassHourId = bookChapterArrTmp[0].children[0].id
                            }
                            addUserLastCourseToDb(curKsid,curClassHourId)
                        }
                    }
                }else{
                    //老版本，如果没有课时就循环获取课时(兼容数据异常问题)
                    if(curClassHourId == '' ){
                        //两种情况：1本章节没有课时；2忘记设置课时（异常情况）
                        for(let item of userBookChapterRes.classes){
                            if(item.code == curKsid){
                                curMfFlag = item.mfFlag
                                if(item.classHours && item.classHours.length > 0){
                                    //有课时忘记设置
                                    curClassHourId = item.classHours[0].id
                                    isShowClassHour = true
                                    break
                                }else{
                                    //章节下没有课时
                                    defaultCheckedKey = item.code
                                    isShowClassHour = false
                                    break
                                }
                            }
                        }
                    }
                }


                
                if(curKsid != ''){
                    curKsName = mainMenuArr[curKsid]
                    store.dispatch('setKsId', curKsid)
                    store.dispatch('setKsName',curKsName)
                    store.dispatch('setMfFlag',curMfFlag)
                }

                if(curClassHourId != ''){
                    curClassHourName = classHourArr[curClassHourId]
                    store.dispatch('setClassHourId', curClassHourId)
                    store.dispatch('setClassHourName',curClassHourName)
                    store.dispatch('setIsShowClassHour',isShowClassHour)
                }else{
                }
                



                console.log(curKsid + "|" + curClassHourId)
                console.log(curKsName + "|" + curClassHourName)
                console.log('mfFlag:' + curMfFlag)
                resultObj.treeHasClassHour = bookChapterArrTmp
                resultObj.treeNoClassHour = bookChapterArrNoClassHour

                if(store.getters.curModule == '课堂教学'){
                    resultObj.data = resultObj.treeHasClassHour
                }else{
                    resultObj.data = resultObj.treeNoClassHour
                }
                
                if(store.getters.curModule == '课堂教学'){
                    if(defaultCheckedKey == ''){
                        if(isShowClassHour){
                            //章节下有多个课时
                            defaultCheckedKey = curClassHourId
                        }else{
                            //章节下只有一个课时
                            defaultCheckedKey = classHourKsCodeArr[curClassHourId]
                        }
                    }
                }else{
                    defaultCheckedKey = curKsid
                }
                // self.expandAndCheck(defaultCheckedKey)
                resultObj.defaultCheckedKey = defaultCheckedKey
            }else{
                console.log('没有章节信息')
            }

        }else{
            console.log('获取版本列表失败')
        }
    }catch(e){
        console.log(e)
    }
    return resultObj
}


//设置用户基本信息
function setUserBaseData(tmp){
    let baseDataObj = {}
    baseDataObj.grade = tmp.grade
    baseDataObj.gradeCode = tmp.gradeCode
    baseDataObj.studyStage = tmp.studyStage
    baseDataObj.studyStageCode = tmp.studyStageCode
    baseDataObj.subject = tmp.subject
    baseDataObj.subjectCode = tmp.subjectCode
    baseDataObj.term = tmp.term
    baseDataObj.termCode = tmp.termCode
    baseDataObj.version = tmp.version
    baseDataObj.versionCode = tmp.versionCode
    baseDataObj.bookOptionCode = tmp.bookOptionCode

    return baseDataObj
}


//递归处理，把有课时排除掉
function checkChild(arr){
    let tmpArr = []
    for(let [index,item] of arr.entries()){
        if(item.children){
            item.children = checkChild(item.children);
            tmpArr.push(item);
        }   
    }
    return tmpArr;
}


//获取用户所有版本
export function getUserAllBookList(){
    // if(store.getters.teacherNumber == ''){
    //     return false
    // }

    // let url = store.getters.transferProtocol + store.getters.domainConfig['TMS'] + '/tms/interface/queryVersion.jsp'
    let url = process.env.TMS_BASE_PREFIX + '/tms/interface/queryVersion.jsp'
    let params = {}
    params.queryType = 'byUser'
    params.username = store.getters.teacherNumber
    

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })

    
}
//获取用户所有版本（增删版本弹窗使用，如果版本全删后防止出默认的版本）
export function getUserAllBookListByTms(){
    let url = process.env.TMS_BASE_PREFIX + '/tms/interface/queryVersion.jsp'
    let params = {}
    params.queryType = 'byUser'
    params.username = store.getters.teacherNumber
    params.realSet = 1
    

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })

    
}

//获取用户当前年级版本学段等信息
export function getUserBase(){
    // let url = store.getters.transferProtocol + store.getters.domainConfig['SSO'] + '/sso/interface/queryVersion.jsp'
    let url = process.env.SSO_BASE_PREFIX + '/sso/interface/queryVersion.jsp'
    
    let params = {}
    params.queryType = 'userVersionProgressSetLast'
    params.username = store.getters.teacherNumber
    
    return request({url: url, method: 'get', data:params}) 
}

//获取用户最后一次浏览的章节
export function getUserLastCourse(){
    // let url = store.getters.transferProtocol + store.getters.domainConfig['PLS'] + '/youjiao/getLastCourseSetP.do'
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/getLastCourseSetP.do'
    let params = {}
    params.module = 'bk'
    params.userName = store.getters.teacherNumber
    params.bookId = store.getters.bookId
    

    return request({url: url, method: 'get', data:params}) 
}

//获取当前课本的所有章节
export function getUserBookChapter(){
    // let url = store.getters.transferProtocol + store.getters.domainConfig['PLS'] + '/youjiao/baceContent.do'
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/baceContent.do'
    let params = {}

    let baseData = store.getters.baseData
    params.section = baseData.studyStageCode
    params.subject = baseData.subjectCode
    params.versions = baseData.versionCode
    params.classHour = 1
    
    let section = baseData.studyStageCode
    if(section == '0003'){
        //高中
        params.rxiu = baseData.bookOptionCode
    }else{
        params.grade = baseData.gradeCode
        params.volume = baseData.termCode
    }

    return request({url: url, method: 'get', data:params}) 
}

//添加用户最后访问章节记录
export function addUserLastCourseToDb(ksId,classHourId){
    // let url = store.getters.transferProtocol + store.getters.domainConfig['PLS'] + '/youjiao/addLastCourseSetP.do'
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/addLastCourseSetP.do'
    let params = {}
    params.module = 'bk'
    params.userName = store.getters.teacherNumber
    params.section = store.getters.baseData.studyStageCode
    params.subject = store.getters.baseData.subjectCode
    params.versions = store.getters.baseData.versionCode
    params.menuCode = ksId
    params.bookId = store.getters.bookId
    if(params.section == '0003'){
        params.rxiu = store.getters.baseData.bookOptionCode
    }else{
        params.volume = store.getters.baseData.termCode
        params.grade = store.getters.baseData.gradeCode
    }

    if(store.getters.curModule == '课堂教学' ){
        if(commonUtils.isNotEmpty(classHourId)){
            params.classHourId = classHourId
        }
    }

    return request({url: url, method: 'get', data:params}) 
}


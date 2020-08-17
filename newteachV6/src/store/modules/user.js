import Vue from 'vue'
import { login, logout, sendRequest } from '@/api/login'
import {getToken,setToken,removeToken} from '@/utils/auth'
import commonUtils from '@/utils/common'

// let vm = new Vue()


const user = {
    state:{
        ut: '',
        authToken:'',//token
        refreshToken:'',//刷新token
        teacherNumber: '',//当前用户账号
        trueTeacherName: '',//当前用户姓名
        userType: '',//当前用户类型 (2,3教师)
        areaId: '',//用户所在地区
        headPhoto: '',//用户头像
        schoolId: '',//学校Id
        padTeachAble: '',//学校是否支持平板课堂( 0不支持 1NEC平板 2vcom平板 3NEC和vcom平板同时支持； 授课端只支持vcom平板 所以0和1时隐藏平板功能；)
        schoolName: '',//学校名
        schoolStage:'',//学校学段
        userClassList: [], //当前教师所有班级
        userSchoolClassList: [], //当前教师所在学校所有班级
        userSelectClassId:'',//用户当前选择班级ID
        userSelectClassName: '',//用户当前选择班级名
        userSelectClassType:'',
        computerClassId:'',//当前电脑存的班级ID
        bookId:'',//章节目录版本
        ksId: '',//章节目录Id
        ksName: '',//章节目录名
        classHourId: '',//当前课时ID
        classHourName: '',//当前课时名称
        ksBookId:'',//PLS目录的版本id
        cardGroupId:'',//答题器分组id
        isShowClassHour: '',//是否展示课时
        currentmfFlag:'',//0,普通课程;1,单元复习;2,期中;3,期末
        curModule: '',//当前模块
        lectureEndVersion:'',
        stuNum: '',
        modules: [],
        mainMenu: [],
        bssChargeFlag: false,
        bssChargeMsg: '',
        //年级学科版本数据组
        baseData:{
            grade: '',
            gradeCode: '',
            studyStage: '',
            studyStageCode: '',
            subject: '',
            subjectCode: '',
            term: '',
            termCode: '',
            version: '',
            versionCode: '',
            bookOptionCode: '',
            bookOptionName: ''
        },
        userBook: {
            curBookId: '',
            bookList: []
        },
    },

    mutations: {
        SET_TEACHERINFO: (state,userObj) => {
            if(commonUtils.isNotEmpty(userObj.ut)){
                state.ut = userObj.ut
            }
            if(commonUtils.isNotEmpty(userObj.teacherNumber)){
                state.teacherNumber = userObj.teacherNumber
            }
            if(commonUtils.isNotEmpty(userObj.trueTeacherName)){
                state.trueTeacherName = userObj.trueTeacherName
            }
            if(commonUtils.isNotEmpty(userObj.schoolId)){
                state.schoolId = userObj.schoolId
            }
            if(commonUtils.isNotEmpty(userObj.schoolName)){
                state.schoolName = userObj.schoolName
            }
            if(commonUtils.isNotEmpty(userObj.userClassList)){
                state.userClassList = userObj.userClassList
            }
            if(commonUtils.isNotEmpty(userObj.userSelectClassId)){
                state.userSelectClassId = userObj.userSelectClassId
            }            
            if(commonUtils.isNotEmpty(userObj.userSelectClassName)){
                state.userSelectClassName = userObj.userSelectClassName
            }
            if(commonUtils.isNotEmpty(userObj.userSelectClassType)){
                state.userSelectClassType = userObj.userSelectClassType
            }
            
            if(commonUtils.isNotEmpty(userObj.areaId)){
                state.areaId = userObj.areaId
            }
            if(commonUtils.isNotEmpty(userObj.userType)){
                state.userType = userObj.userType
            }
            if(commonUtils.isNotEmpty(userObj.modules)){
                state.modules = userObj.modules
            }
            if(commonUtils.isNotEmpty(userObj.schoolStage)){
                state.schoolStage = userObj.schoolStage
            }
            if(commonUtils.isNotEmpty(userObj.padTeachAble)){
                state.padTeachAble = userObj.padTeachAble
            }            
        },
        SET_COMPUTERCLASSID: (state, computerClassId) => {
            state.computerClassId = computerClassId
        },        
        SET_AUTHTOKEN: (state, authToken) => {
            state.authToken = authToken
        },
        SET_REFRESHTOKEN: (state, refreshToken) => {
            state.refreshToken = refreshToken
        },                
        SET_MAINMENU: (state, mainMenu) => {
            state.mainMenu = mainMenu
        },
        SET_BSSCHARGE: (state, bss) => {
            state.bssChargeFlag = bss.bssChargeFlag
            state.bssChargeMsg = bss.bssChargeMsg
        },
        SET_HEADPHOTO: (state, headPhoto) => {
            state.headPhoto = headPhoto
        },
        SET_USERBOOK: (state, userBook) => {
            state.userBook = userBook
        },        
        SET_BASEDATA: (state, baseData) => {
            // grade: '',
            // gradeCode: '',
            // studyStage: '',
            // studyStageCode: '',
            // subject: '',
            // subjectCode: '',
            // term: '',
            // termCode: '',
            // version: '',
            // versionCode: '',
            // bookOptionCode: '',
            // bookOptionName: ''
            if(commonUtils.isNotEmpty(baseData.grade)){
                state.baseData.grade = baseData.grade
            }
            if(commonUtils.isNotEmpty(baseData.gradeCode)){
                state.baseData.gradeCode = baseData.gradeCode
            }
            if(commonUtils.isNotEmpty(baseData.studyStage)){
                state.baseData.studyStage = baseData.studyStage
            }
            if(commonUtils.isNotEmpty(baseData.studyStageCode)){
                state.baseData.studyStageCode = baseData.studyStageCode
            }
            if(commonUtils.isNotEmpty(baseData.subject)){
                state.baseData.subject = baseData.subject
            }
            if(commonUtils.isNotEmpty(baseData.subjectCode)){
                state.baseData.subjectCode = baseData.subjectCode
            }
            if(commonUtils.isNotEmpty(baseData.term)){
                state.baseData.term = baseData.term
            }
            if(commonUtils.isNotEmpty(baseData.termCode)){
                state.baseData.termCode = baseData.termCode
            }
            if(commonUtils.isNotEmpty(baseData.version)){                
                state.baseData.version = baseData.version                
            }
            if(commonUtils.isNotEmpty(baseData.versionCode)){
                state.baseData.versionCode = baseData.versionCode
            }
            if(commonUtils.isNotEmpty(baseData.bookOptionCode)){
                state.baseData.bookOptionCode = baseData.bookOptionCode
            }
            if(commonUtils.isNotEmpty(baseData.bookOptionName)){
                state.baseData.bookOptionName = baseData.bookOptionName
            }
        },
        SET_CLASSHOURID: (state, classHourId) => {
            state.classHourId = classHourId
        },
        SET_KSID: (state, ksId) => {
            state.ksId = ksId
        },
        SET_KSBOOKID: (state, ksBookId) => {
            state.ksBookId = ksBookId
        },        
        SET_CARDGROUPID: (state, cardGroupId) => {
            state.cardGroupId = cardGroupId
        },        
        SET_BOOKID: (state, bookId) => {
            state.bookId = bookId
        },
        SET_CURMODULE: (state, curModule) => {
            state.curModule = curModule
        },      
        SET_MFFLAG: (state, currentmfFlag) => {
            state.currentmfFlag = currentmfFlag
        },
        SET_KSNAME: (state, ksName) => {
            state.ksName = ksName
        },
        SET_CLASSHOURNAME: (state, classHourName) => {
            state.classHourName = classHourName
        },
        SET_ISSHOWCLASSHOUR: (state, flag) => {
            state.isShowClassHour = flag
        },
        SET_USERCLASSLIST: (state, userClassList) => {
            state.userClassList = userClassList
        },
        SET_USERSCHOOLCLASSLIST: (state, userSchoolClassList) => {
            state.userSchoolClassList = userSchoolClassList
        }
    },

    actions: {
        Login({ commit,state },userInfo){
            return new Promise((resolve,reject) => {
                login(userInfo).then(response => {
                    console.log(response)
                                    //调用用户中心认证接口
                                    let ssoAuthUrl = 'http://ssovcomyf.czbanbantong.com/sso/verifyAuthInfo?appFlg=PLS&loginUsertype=teacher&encodeP=4&username=3e3bccd40cf633b71c5b88857ce67b1e&pwd=e10adc3949ba59abbe56e057f20f883e&pwdRsa=53b46f467e30942b9958ca55cd531e514f7229958cdea91e1f1595528fb5a0231193e85ee0d7f3a3d14913d554fa7d295a65c63b089106e6f40409ce71a15f11fa57aa74dde781929efb6e2747bce81c20d289344870dea91ada93ecf5d39ff9ece728514af4aa59eda89f766806440b425500fd147b19df75e1a0510d018a62&mac=6C-4B-90-78-9B-E7'
                                    let ssoParams = {}
                                    ssoParams.appFlg = 'PLS'
                                    ssoParams.loginUsertype = 'teacher'
                                    ssoParams.encodeP = 4
                                    ssoParams.username = response.username
                                    ssoParams.pwd = 'e10adc3949ba59abbe56e057f20f883e'
                                    ssoParams.pwdRsa = '53b46f467e30942b9958ca55cd531e514f7229958cdea91e1f1595528fb5a0231193e85ee0d7f3a3d14913d554fa7d295a65c63b089106e6f40409ce71a15f11fa57aa74dde781929efb6e2747bce81c20d289344870dea91ada93ecf5d39ff9ece728514af4aa59eda89f766806440b425500fd147b19df75e1a0510d018a62'
                                    ssoParams.mac = '6C-4B-90-78-9B-E7'

                                    sendRequest(ssoAuthUrl, ssoParams, 'get').then((ssoAuthResponse) => {
                                    //this.$router.push({ path: '/'})
                                    }).catch((error) => {})
                    // setToken()
                    // commit('SET_TOKEN', response.uid)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //登出
        LogOut({ commit, state }){
            return new Promise((resolve,reject) => {
                logout(state.token).then(()=>{
                    commit('SET_TOKEN','')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //设置用户信息
        setTeacherInfo({ commit }, userObj){
            commit('SET_TEACHERINFO', userObj)
        },        
        setComputerClassId({ commit }, computerClassId){
            commit('SET_COMPUTERCLASSID', computerClassId)
        },        
        //设置token
        setAuthToken({ commit }, authToken){
            commit('SET_AUTHTOKEN', authToken)
        },
        //设置刷新token
        setRefreshToken({ commit }, refreshToken){
            commit('SET_REFRESHTOKEN', refreshToken)
        },                
        //设置栏目列表
        setMainMenu({ commit }, mainMenu){
            commit('SET_MAINMENU', mainMenu)
        },
        //设置是否收费
        setBssCharge({ commit }, bss){
            commit('SET_BSSCHARGE', bss)
        },
        //设置头像
        setHeadPhoto({ commit }, headPhoto){
            commit('SET_HEADPHOTO', headPhoto)
        },
        setUserBook({ commit }, userBook){
            commit('SET_USERBOOK', userBook)
        },
        setBaseData({ commit }, baseData){
            commit('SET_BASEDATA', baseData)
        },
        setClassHourId({ commit }, classHourId){
            commit('SET_CLASSHOURID', classHourId)
        },
        setKsId({ commit }, ksId){
            commit('SET_KSID', ksId)
        },
        setKsBookId({ commit }, ksBookId){
            commit('SET_KSBOOKID', ksBookId)
        },    
        setCardGroupId({ commit }, cardGroupId){
            commit('SET_CARDGROUPID', cardGroupId)
        },           
        setBookId({ commit }, bookId){
            commit('SET_BOOKID' ,bookId)
        },
        setCurModule({ commit }, curModule){
            commit('SET_CURMODULE',curModule)
        },     
        setMfFlag({ commit }, currentmfFlag){
            commit('SET_MFFLAG',currentmfFlag)
        },
        setKsName({ commit }, ksName){
            commit('SET_KSNAME',ksName)
        },
        setClassHourName({ commit }, classHourName){
            commit('SET_CLASSHOURNAME',classHourName)
        },
        setIsShowClassHour({ commit }, flag){
            commit('SET_ISSHOWCLASSHOUR',flag)
        },
        setUserClassList({ commit }, userClassList){
            commit('SET_USERCLASSLIST',userClassList)
        },
        setUserSchoolClassList({ commit }, userSchoolClassList){
            commit('SET_USERSCHOOLCLASSLIST', userSchoolClassList)
        }
        
    }
}

export default user

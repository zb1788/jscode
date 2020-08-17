import { getSysConfig } from '@/api/login'

const app = {
    state:{
        debug:true,//调试模式
        transferProtocol:'',//http / https 协议
        domainConfig: {},   //各个系统域名配置
        teacherComputerMac:'',//当前MAC
        password: '888888',//系统设置验证密码
        cssName:'',
        loginStyle: '', //是否授课预览0:授课登录 1：预览
        isSchoolbag: '', //是否支持电子书包
        isHavingClass: '', //是否上课
        deviceType:'',//设备类型
        fullscreenLoading:false, //全屏遮罩
        ajaxControlFullScreen:true,//默认ajax控制loading
        dialogFilter:false,//弹窗遮罩
        subMenuYouJiaoKey:'',//优教要替换的文字（tab标签上的优教作业是否替换成精品）
        classSelect:false,//是否展示班级选择弹窗
        isSetLoginFirst:false,//是否首次设置过登录串
        localAreaCode:null,//平台ID
        clientFlag:'default',//客户端定制标志
        requestCount:0,
        desSso:{}
    },

    mutations: {
        SET_TRANSFERPROTOCOL: (state , transferProtocol) => {
            state.transferProtocol = transferProtocol
        },
        SET_CONFIG: (state, config) => {
            state.domainConfig = config
        },
        SET_COMPUTERMAC: (state, mac) => {
            state.teacherComputerMac = mac
        },
        SET_FULLSCREEN: (state, flag) => {
            state.fullscreenLoading = flag
        },
        SET_AJAXCONTROLFULLSCREEN: (state, flag) =>{
            state.ajaxControlFullScreen = flag
        },
        SET_LOGINSTYLE: (state, loginStyle) => {
            state.loginStyle = loginStyle
        },
        SET_SCHOOLBAG: (state, isSchoolbag) => {
            state.isSchoolbag = isSchoolbag
        },
        SET_HAVINGCLASS: (state, isHavingClass) => {
            state.isHavingClass = isHavingClass
        },
        SET_DEVICETYPE: (state, deviceType) => {
            state.deviceType = deviceType
        },        
        SET_DIALOGFILTER:(state, dialogFilter) => {
            state.dialogFilter = dialogFilter
        },
        SET_CLASSSELECT:(state, classSelect) => {
            state.classSelect = classSelect
        },
        SET_LOGINSATUS:(state, flag) => {
            state.isSetLoginFirst = flag
        },
        SET_LOCALAREACODE:(state,localAreaCode)=>{
            state.localAreaCode=localAreaCode;
        },
        SET_CLIENT_FLAG:(state,clientFlag)=>{
            state.clientFlag=clientFlag;
        },
        SET_REQUEST_COUNT:(state,requestCount)=>{
            state.requestCount=requestCount;
        },
        SET_DESSSO:(state,desSso)=>{
            state.desSso = desSso;
        }
    },

    actions: {
        setConfig({ commit }, config){
            commit('SET_CONFIG',config)
        },
        setTransferprotocol({ commit }, transferProtocol){
            commit('SET_TRANSFERPROTOCOL',transferProtocol)
        },
        setTeacherComputerMac({ commit }, mac){
            commit('SET_COMPUTERMAC', mac)
        },
        setFullScreen({ commit }, flag){
            commit('SET_FULLSCREEN',flag)
        },
        setAjaxControlFullScreen({ commit }, flag){
            commit('SET_AJAXCONTROLFULLSCREEN',flag)
        },
        setLoginStyle({ commit }, loginStyle){
            commit('SET_LOGINSTYLE', loginStyle)
        },
        setSchoolBag({ commit }, isSchoolbag){
            commit('SET_SCHOOLBAG', isSchoolbag)
        },
        setHavingClass({ commit }, isHavingClass){
            commit('SET_HAVINGCLASS', isHavingClass)
        },
        setDeviceType({ commit }, deviceType){
            commit('SET_DEVICETYPE', deviceType)
        },        
        setDialogFilter({ commit }, dialogFilter){
            commit('SET_DIALOGFILTER', dialogFilter)
        },
        setClassSelect({ commit }, classSelect){
            commit('SET_CLASSSELECT',classSelect)
        },
        setLoginStatus({ commit }, flag){
            commit('SET_LOGINSATUS',flag)
        },
        setLocalAreaCode({ commit },localAreaCode){
            commit('SET_LOCALAREACODE',localAreaCode)
        },
        setClientFlag({commit},clientFlag){
            commit('SET_CLIENT_FLAG',clientFlag);
        },
        setRequestCount({commit},requestCount){
            commit('SET_REQUEST_COUNT',requestCount);
        },
        setDesSso({commit},desSso){
            commit('SET_DESSSO',desSso)
        }
    }
}

export default app

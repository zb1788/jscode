import router from './router'
import store from './store'
import NProgress from 'nprogress' //Progress进度条
import 'nprogress/nprogress.css'
import { setUt,getUt,getToken, setLoginStyle,getRefreshToken,getAccessTokenTime} from '@/utils/auth'
import { getGrantAndMenus, getSysConfig, getAllClassData,getJWTInfo} from '@/api/init'
import commonUtils from '@/utils/common'
import storage from '@/utils/storage'
import {AUTH_TOKEN_NAME,AUTH_TIME_NAME,AUTH_UT_NAME} from '@/api/constant'
import { getDomainConfigFromGwApi, refreshTokenApi,getCardGroupByMac } from '@/api/interface'
import { getDeviceType,getComputerClassInfo,clientToolTransmit,logoutClient } from '@/api/client'

const whiteList = ['/login','/pad/index','/play/index','/smartPaper/index','/paperbind/index','/iframe/index','/hdkt/sharepic','/ktjx/bindex'] //不重定向白名单

//校验结果(如果false则进入登录页，否则进入当前页面)
let checkFlag = false

router.beforeEach(async (to,from,next) => {
    console.log('进入路由')
    console.log(to)
    // console.log(from)
    //如果在白名单中，则不进行校验
    if(whiteList.indexOf(to.path) !== -1){
        // console.log('白名单'+to.path)
        next();
    }else{      
        if(to.path == '/'){
            next({"name":'login'})
        }
        // console.log('查看token')
        // console.log(getToken())
        if(getToken() != ''){
            // console.log(store.getters.teacherNumber)
            // await checkBaseNeedData(to)
            //检查token
            await checkToken()    
            if(!checkFlag){
                next({path:'/login'})
                return
            }
            //开启定时刷新token
            refreshToken()
            checkDeviceAddEvent()
            if(to.meta.abbr != ''){
                //检查ut
                await checkUt()
                if(store.getters.ut == ''){
                    next({path:'/login'})
                    return
                }
                //检查domainConfig
                await checkDomainConfig()
                //检查备授课
                await checkLoginStyle()
                //检查栏目以及鉴权
                await checkSsoGrant()
                //获取当前用户班级
                await getUserClassList()
                //检查班级信息是否存在
                await checkHasUserClass()
                //获取当前班级是否有答题器分组
                await checkHasGroupId();
            }



            if(!checkFlag){
                //校验失败进login
                next({path:'/login'})
            }else{
                if(to.path == '/main'){
                    //如果包含课堂教学，则展示课堂教学栏目，否则展示第一个栏目
                    let hasKtjx = store.getters.mainMenu.filter(item => item.c3 == 'ktjx')
                    if(hasKtjx.length > 0){
                        next({ path: '/ktjx' })
                    }else{
                        if(store.getters.mainMenu.length>0 && store.getters.mainMenu[0].c3 != ''){
                            next({ path: '/' + store.getters.mainMenu[0].c3 })
                        }else{
                            console.log("栏目数据错误");
                            next({"name":'login',params:{"loginMessage":"栏目数据错误！"}})
                        }
                    }
                }else{
                    next()
                }
            }
        }else{
            // console.log('login----------')
            next({"name":'login'})
            NProgress.done()
        }
    }
})

router.afterEach((to, from) => {
    let arr = store.getters.mainMenu.filter(item => item.c3 == to.meta.abbr)
    if(arr.length > 0){
        store.dispatch('setCurModule', to.meta.title)
    }
   setTimeout(()=>{
       if(document.getElementById("__VCOM_ANALYTICS_PAGEFLAG") != null){
        try{
            __VAE__.pageView();
        }catch(e){
            console.log("统计方法异常！");
        }
       }        
    },200)

    NProgress.done();
})



//检查是否有基础数据
async function checkBaseNeedData(to){
    // console.log('checkBaseData')
    // console.log(to)
    //检查token和刷新token是否过期    
    await checkToken()    
    //开启定时刷新token
    refreshToken()
    checkDeviceAddEvent()
    if(to.meta.abbr != ''){
        //检查ut
        await checkUt()
        //检查domainConfig
        await checkDomainConfig()
        //检查备授课
        await checkLoginStyle()
        //检查栏目以及鉴权
        await checkSsoGrant()
        //获取当前用户班级
        await getUserClassList()
        //检查班级信息是否存在
        await checkHasUserClass()
        //获取当前班级是否有答题器分组
        await checkHasGroupId();
    }
}


//定时计算时间戳，是否要刷新token
let myInterval = ''
function refreshToken(){
    if(myInterval == ''){
        console.log('refreshToken')
        myInterval = setInterval(async () => {
            await checkToken()

            // let oldStamp = getAccessTokenTime()*1 //获取写入token的时间戳
            // let nowStamp = new Date().getTime() //当前时间戳


            //1.第一次登录记下当前时间戳,然后加上失效的时间段，获得本地失效时间
            // let checkStamp = oldStamp + (7200-780)*1000 //两小时后失效，提前13分钟刷新toke
            

            // checkStamp = oldStamp + 60*1000
            // console.log(nowStamp)
            // console.log(checkStamp)


            //第二种方法：
            //1.调用接口获取服务器当前时间,
            //2.拿服务器当前时间和过期时间对比查看是否失效
            // let tokenObj = getToken()
            // let access_result = getJWTInfo(tokenObj.access_token)
            // let access_expires = access_result.exp*1000 //accessToken过期时间戳
            // let access_checkStamp = access_expires - 120*1000 //提前2分钟刷新token






            // console.log("定时器当前时间戳："+nowStamp+"|过期token时间戳："+access_checkStamp)

            // if(nowStamp >= access_checkStamp){
            //     console.log("定时器--token失效，开始调用刷新token")
            //     await doRefreshToken()
            // }
            
        },600000)//600000 10分钟轮询一次  
    }
}


let isAddDeviceStatus = false //是否监听设备插拔事件
//注入监听设备变化事件（只注入一次）（仅能监听纸笔设备的变化）
function checkDeviceAddEvent(){
    if(!isAddDeviceStatus){
        isAddDeviceStatus = true
        try{
            VcomTeach.bindingEvent("PullDevice",function(nﬂag){//1设备插入，0设备拔出
                getDeviceType()
            }) 
        }catch(e){
    
        }
    }    
}


//检查token和刷新token是否失效
async function checkToken(){
    let oldStamp = getAccessTokenTime()*1 //获取写入token的时间戳
    let nowStamp = new Date().getTime() //当前时间戳


    //1.第一次登录记下当前时间戳,然后加上失效的时间段，获得本地失效时间
    // let checkStamp = oldStamp + (7200-780)*1000 //两小时后失效，提前13分钟刷新toke
    

    // checkStamp = oldStamp + 60*1000
    // console.log(nowStamp)
    // console.log(checkStamp)


    //第二种方法：
    //1.调用接口获取服务器当前时间,
    //2.拿服务器当前时间和过期时间对比查看是否失效
    let tokenObj = getToken()
    if(tokenObj == ''){
        checkFlag = false
        logoutClient()
    }

    let access_result = getJWTInfo(tokenObj.access_token)
    let refresh_result = getJWTInfo(tokenObj.refresh_token)
    let access_expires = access_result.exp*1000 //accessToken过期时间戳
    let refresh_expires = refresh_result.exp*1000 //refreshToken过期时间戳

    // let access_checkStamp = access_expires - 780*1000 //提前13分钟刷新token(方式1：根据失效时间戳判断)
    let access_checkStamp = oldStamp + (tokenObj.expires_in*1-780)*1000//提前13分钟刷新token(方式1：根据失效时间戳判断)

    console.log("当前时间戳："+nowStamp+"|过期token时间戳："+access_checkStamp+"|刷新token过期时间戳："+refresh_expires)

    //如果当前时间戳大于token快失效时间戳
    if(nowStamp >= access_checkStamp){
        //accessToken快失效，需要重新获取token
        await doRefreshToken()
    }else{
        checkFlag = true
    }
}

//检查ut
function checkUt(){
    if(store.getters.ut == ''){
        let teacherObj = {}
        teacherObj.ut = getUt()
        store.dispatch('setTeacherInfo', teacherObj)        
    }
    
}

//检查统一配置文件是否存在
export async function checkDomainConfig(){
    if(store.getters.transferProtocol == ''){
        try{
            let res = await getDomainConfigFromGwApi()
            if(res.code == '200'){
                let domainObj = res.data
				domainObj.PORTAL = document.domain
				store.dispatch('setConfig', domainObj)
                store.dispatch('setTransferprotocol', res.data.LOCAL_PROTOCOL+"://")
            }else{
                commonUtils.console(e, res.message)        
                checkFlag = false        
            }
        }catch(e){
            commonUtils.console(e, '获取统一配置文件失败')
            checkFlag = false
        }
        


        // let url = process.env.PLS_BASE_PREFIX + '/newteach/getConfig.do'
        // try{
        //     let response = await getSysConfig(url,{})
        //     store.dispatch('setConfig', response.data.config)
        //     store.dispatch('setTransferprotocol', response.data.transferProtocol)
        // }catch(e){
        //     commonUtils.console(e, '获取统一配置文件失败')
        //     return false
        // }
    }
}


//检查是否登录
function checkLoginStyle(){
    if(store.getters.loginStyle == ''){
        try{
            if(VcomTeach.isVcomTeach()){
                setLoginStyle(0)
                store.dispatch('setLoginStyle',0)               
            }
          }catch(e){
            setLoginStyle(1)
            store.dispatch('setLoginStyle',1)
          }        
    }    
}

//检查鉴权以及栏目信息以及学校是否支持电子书包
async function checkSsoGrant(){
    if(store.getters.mainMenu.length == 0){
        try{
            let mainMenuArr = await getGrantAndMenus()
            store.dispatch('setMainMenu', mainMenuArr)
        }catch(e){
            commonUtils.console(e, '获取栏目以及鉴权失败')
            checkFlag = false
        }
    }
}

//获取教师所有班级
async function getUserClassList(){
    if(store.getters.userClassList.length == 0){
        // console.log('获取班级列表')
        let data = await getAllClassData(1)
        // console.log(data)
        store.dispatch('setUserClassList',data)    
    }
}


//检查是否有当前班级
async function checkHasUserClass(){
    // console.log("当前客户端班级："+ store.getters.computerClassId)
    // console.log("当前是否显示弹窗：", store.getters.classSelect)
    
    // console.log(checkFlag)
    // console.log("classSelect")
    // console.log(store.getters.classSelect)
    let resultArr
    if(checkFlag && store.getters.computerClassId == ''){
        //从控件获取当前教学机对应的班级
        try{
            resultArr = getComputerClassInfo()
            // console.log("当前数据库保存班级信息：")
            // console.log(resultArr)
            if(resultArr.length != 0){
                store.dispatch('setComputerClassId',resultArr[0][0])     
            }
        }catch(e){
            if(store.getters.debug){
                // obj.userSelectClassId = '147098596789321647'
                // obj.userSelectClassName = '三年级（1）班'  
            }              
            commonUtils.console(e, '获取本地班级信息失败')
        }

        // commonUtils.console("当前客户端班级111："+ store.getters.computerClassId)
        if(store.getters.computerClassId == ''){
            // console.log("显示弹窗")
            //从控件获取用户班级为空，弹出选择班级窗口
            store.dispatch('setClassSelect',true)
        }else{
            let result = store.getters.userClassList.filter(item => item.classId == resultArr[0][0])
            // console.log(store.getters.userClassList)
            // console.log('教师班级是否包含数据库班级：')
            // console.log(result)
            if(result.length == 0){
                // console.log("显示弹窗")
                //当前教师班级列表没有这个班级，弹出班级选择面板
                store.dispatch('setClassSelect',true)
            }else{
                let obj = {}
                obj.userSelectClassId = result[0].classId
                obj.userSelectClassName = result[0].className
                obj.userSelectClassType = result[0].classType
                store.dispatch('setTeacherInfo',obj)   
                store.dispatch('setClassSelect',false)
            }
        } 
    }   
}

async function checkHasGroupId(){
    if(store.getters.userSelectClassId != ''){
        try{
            let response = await getCardGroupByMac(store.getters.userSelectClassId,VcomMacIp.GetMacInfo());
            if(response.code == '200' && response.rtnArray.smartCardGroupId!=null){
                let cardGroupId = response.rtnArray.smartCardGroupId;
                store.dispatch('setCardGroupId',cardGroupId)
            }
        }catch(e){
    
        }
    }
}


/**
 * 调用刷新token
 */
export async function doRefreshToken(){
    let refrshToken = getRefreshToken()
    try{
        let response = await refreshTokenApi('refresh_token',refrshToken)
        console.log("写入新的token信息")
        console.log(response)
        //写新token
        storage.set(AUTH_TOKEN_NAME,encodeURI(JSON.stringify(response)))
        //写新时间戳
        storage.set(AUTH_TIME_NAME,new Date().getTime())
        //写新ut
        // storage.set(AUTH_UT_NAME,response.ut)
        // setUt(AUTH_UT_NAME,response.ut)
        checkFlag = true
        //更新登录串token
        clientToolTransmit(3)
    }catch(e){
        console.log("调用刷新token失败")
        checkFlag = false
        //回登录页
        logoutClient()
    }
    



    // refreshTokenApi('refresh_token',refrshToken).then((response) => {
    //     console.log("写入新的token信息")
    //     console.log(response)
    //     //写新token
    //     storage.set(AUTH_TOKEN_NAME,encodeURI(JSON.stringify(response)))
    //     //写新时间戳
    //     storage.set(AUTH_TIME_NAME,new Date().getTime())
    //     //写新ut
    //     // storage.set(AUTH_UT_NAME,response.ut)
    //     setUt(AUTH_UT_NAME,response.ut)
    //     checkFlag = true
    // }).catch((e)=>{
    //     checkFlag = false
    // })   
}
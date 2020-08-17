/**
 * 课后作业相关
 */
import request from '@/utils/request'
import store from '@/store'
import commonUtils from '@/utils/common'
import {getIconName} from '@/api/api'
import { getCurHomeworkRes } from '@/api/tqmsapi'
import { getFankuiTqmsApi, getFankuiEngApi, getOfflineHomeworkInfoApi,getOfflineHomeworkFankuiInfoByUserApi} from '@/api/interface'

//  //获取课后作业名师作业/优教作业/我的网上作业/我的离线作业相关资源
// export async function getResListData(self){
//     let res
//     try{
//         res = await getResList(self)
//     }catch(e){
//         console.log(e)
//     }
    
//     let data = []
//     if(self.activeIndex==0 || self.activeIndex==1 || self.activeIndex==3 || self.activeIndex==4){
//         data = formatPlsRes(res)
//     }else if(self.data[self.activeIndex].type==2){
//         data = formaTqmsRes(res)
//     }else if(self.data[self.activeIndex].type==7){
//         //现在已经没有我的素材了
//     }

//     return data
// }

//获取tab标签数据
export async function getTabsData(){
    let data = [{'name':'名师作业',type:0},{'name':'优教作业',type:1},{'name':'我的套卷',type:4},{'name':'我的网上作业',type:2},{'name':'我的离线作业',type:3}]
    let activeName = ''
    //前两个栏目是动态栏目
    try{
        let res = await getTabsApi()
        let arr = []
        if(res && res.isShowFamous == 1){
            if(arr.length == 0){
                activeName = data[0].name
            }
            arr.push(data[0])
        }

        if(res && res.isShowTeach == 1){
            //替换优教为其他文字
            if(store.getters.subMenuYouJiaoKey != ''){
                data[1].name = data[1].name.replace('优教',store.getters.subMenuYouJiaoKey)
            }
            if(arr.length == 0){
                activeName = data[1].name
            }
            arr.push(data[1])
        }

        if(arr.length == 0){
            activeName = data[2].name
        }

        //循环后两个栏目
        for(let i=2; i< data.length; i++){
            arr.push(data[i])
        }

        let obj = {}
        obj.arr = arr //标签数组
        obj.activeName = activeName //选中的标签名字
        return obj
    }catch(e){
        console.log(e)
    }
    
    
}

//type 0:名师作业 1：优教作业 2：我的网上作业 3：我的离线作业 4:我的套卷
export async function getCurResData(type){
    let res = ''
    try{
        res = await getCurHomeworkRes(type)
    }catch(e){
        commonUtils.console(e)
    }

    let resultStr = ''
    //处理特殊字符
    if(typeof(res) == 'string'){
        resultStr = res.replace('\\','')
        res = JSON.parse(resultStr)
    }

    let arr = []

    if(type == 0||type == 1||type == 2){
        //名师，优教，我的网上作业
        if(res && res.items && res.items.length > 0){
            for(let item of res.items){
                let obj = {}
                obj = formatHomeWorkRes(obj,item)

                //作业打开地址
                // let url = store.getters.transferProtocol + store.getters.domainConfig["QBMS"] + '/online/interface/queryTblxPaper.action?paper_id='+obj.homeworkId
                let url = ''
                let paperType = '' //1：名师作业，2：优教作业 0：我的网上作业
                if(type == 0){
                    //名师作业
                    url = store.getters.transferProtocol + store.getters.domainConfig["PORTAL"] + '/tqmsui/newteach/p1/v1/paper_view/'+obj.rcode+'?paper_type=1&homework_id='+obj.homeworkId
                }else if(type == 1){
                    //优教作业
                    url = store.getters.transferProtocol + store.getters.domainConfig["PORTAL"] + '/tqmsui/newteach/p1/v1/paper_view/'+obj.rcode+'?paper_type=2&homework_id='+obj.homeworkId
                }else if(type == 2){
                    //我的网上作业
                    url = store.getters.transferProtocol + store.getters.domainConfig["PORTAL"] + '/tqmsui/newteach/p1/v1/paper_view/'+obj.rcode+'?paper_type=0&homework_id='+obj.homeworkId
                }

                
                if(type == 0 || type == 1){
                    if(obj.useFlag == 1){
                        //显示已发标记
                        obj.useIcon = require('@/assets/images/icon/res/yiyong.png')
                    }              
                }
                
                obj.icon = require('@/assets/images/icon/zuoye.png')
                if(obj.hwPaperType == 'listening'){
                    obj.icon = require('@/assets/images/icon/english.png')
                }
                
                //判断按钮
                let buttonArr = []
                                
                if(type == 2){
                    //我的作业
                    buttonArr .push({'name':'发送','enabled':true,'type':'fasong','playJs':{'playName':'fasong',params:{'type':'normal','homeworkId':obj.homeworkId,'paperId':obj.rcode}},'pvname':'tls_wszy_fs'})                    
                    
                    if(obj.hwPaperType == 'listening'){
                        url = store.getters.transferProtocol + store.getters.domainConfig["ESLEANR"] + '/Homework/Comhw/student_homework?paper_id=' + obj.rcode
                    }
                    if(item.classPublishStatus == 1){
                        if(obj.hwPaperType == 'listening'){                            
                            buttonArr .push({'name':'反馈','enabled':true,'type':'fankuiEng','playJs':{'playName':'fankuiEng',params:{'rcode':obj.rcode}},'pvname':'tls_wszy_fk'})
                        }else{
                            buttonArr .push({'name':'反馈','enabled':true,'type':'fankuiTqms','playJs':{'playName':'fankuiTqms',params:{'rcode':obj.rcode,'hwPaperType':obj.hwPaperType}},'pvname':'tls_wszy_fk'})
                        }                        
                    }else{
                        buttonArr .push({'name':'反馈','enabled':false})
                    }
                }else{
                    buttonArr .push({'name':'发送','enabled':true,'type':'fasong','playJs':{'playName':'fasong',params:{'type':'sys','homeworkId':obj.homeworkId,'paperId':obj.rcode}},'pvname':'tls_yjzy_fs'})
                }
                
                obj.button = buttonArr
                obj.playJs = {'playName':'playHomeworkRes',params:{'rcode':obj.rcode,'title':obj.title,'url':url}}
                arr.push(obj)
            }
        }
    }else if(type == 3){
        //离线作业
        if(res && res.data && res.data.length > 0){
            for(let item of res.data){
                let obj = {}
                obj.title = item.title
                obj.rcode = item.id
                obj.time = item.time
                obj.subject = item.subject
                obj.icon = require('@/assets/images/icon/lixian.png')
                obj.class_info = item.class_info
                obj.pvname = 'tls_lxzy_yx'
                //判断按钮
                let buttonArr = []
                buttonArr .push({'name':'发送','enabled':true,'type':'fasong','playJs':{'playName':'fasong',params:{'rcode':obj.rcode}},'pvname':'tls_lxzy_fs'})

                for(let val of item.class_info){
                    if(val.id.indexOf(store.getters.userSelectClassId) != -1){
                        buttonArr .push({'name':'反馈','enabled':true,'type':'fankuiOffline','playJs':{'playName':'fankuiOffline',params:{'rcode':obj.rcode,'title':obj.title}},'pvname':'tls_lxzy_fk'})
                    }
                }
                obj.button = buttonArr
                obj.playJs = {'playName':'playOfflineHomeworkRes','remark':'离线作业播放',params:{'rcode':obj.rcode,'title':obj.title}}
                arr.push(obj)
            }
        }
    }else if(type == 4){
        //我的套卷
        if(res && res.items && res.items.length > 0){
            for(let item of res.items){
                let obj = {}
                obj = formatHomeWorkRes(obj,item)

                //作业打开地址
                let url = store.getters.transferProtocol + store.getters.domainConfig["PORTAL"] + '/tqmsui/newteach/p1/v1/paper_view/'+obj.rcode+'?paper_type=0&homework_id='+obj.homeworkId
                
                // if(type == 0 || type == 1){
                //     if(obj.useFlag == 1){
                //         //显示已发标记
                //         obj.useIcon = require('@/assets/images/icon/res/yiyong.png')
                //     }              
                // }
                
                obj.icon = require('@/assets/images/icon/zuoye.png')
                if(obj.hwPaperType == 'listening'){
                    obj.icon = require('@/assets/images/icon/english.png')
                }
                
                //判断按钮
                let buttonArr = []
                                
                buttonArr .push({'name':'发送','enabled':true,'type':'fasong','playJs':{'playName':'fasong',params:{'type':'sys','homeworkId':obj.homeworkId,'paperId':obj.rcode}},'pvname':''})
                
                obj.button = buttonArr
                obj.playJs = {'playName':'playPaperRes',params:{'rcode':obj.rcode,'title':obj.title,'url':url}}
                arr.push(obj)
            }
        }        
    }
 
    return arr
}

export function formatHomeWorkRes(obj,item){
    let title = commonUtils.replaceAll(commonUtils.replaceAll(item.rtitle,"\"","“"),"'","‘")
    obj.title = title
    obj.jsdata = item.jsdata
    obj.classPublishStatus = item.classPublishStatus //是否有反馈  0-否 1-是
    obj.status = item.status //我的作业是否已发  0-否 1-是
    obj.useFlag = item.useFlag //系统是否已发  0-否 1-是
    let formatMark = ''
    try{
        formatMark = item.iconType.toLowerCase()
    }catch(e){

    }
    obj.formatMark = formatMark
    obj.hwPaperType = item.hwPaperType //作业试卷类型 system:系统试卷;listening:英语同步练
    obj.rcode = item.rcode
    obj.brandcategory = item.brandcategory //区分供应商 智乐
    obj.homeworkId = item.homeworkId 

    

    if(item.jsdata != null){
        let tmp =  eval("("+item.jsdata+")");
        obj.rsType = tmp.rsType
    }
    
    obj.icon = '' //资源图标
    obj.useIcon = '' //已发
    

    
    if(obj.hwPaperType != ''){
        obj.icon = require('@/assets/images/icon/zuoye.png')
    }else{
        obj.icon = require('@/assets/images/icon/english.png')
    }
    return obj
}



//获取标签数据（动态铺）
function getTabsApi(){
    let url = process.env.TQMS_BASE_PREFIX + '/tqms/hw/homeworkFamousTeach.action'

    let params = {}
    params.lessionId = store.getters.ksId

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })    
}

/**
 * 获取题库反馈详情
 * @param {*} rcode 
 * @param {*} paperType 
 */
export async function getFankuiTqmsData(rcode,paperType){
    let res = []
    try{
        res = await getFankuiTqmsApi(rcode)
    }catch(e){
        commonUtils.console(e,'获取反馈信息失败')
    }
    
    let arr = []
    for(let item of res){
        let obj = {}
        obj.button = []

        let buttonArr = []

        obj.text = '第'+ item.seq_no + '题&nbsp;&nbsp;提交数:'+item.answerNum+'&nbsp;&nbsp;答错:'+item.errornum+'&nbsp;&nbsp;错误率：'+item.errorRate+''

        if(paperType == 'import'){            
            obj.playJs = {'playName':''}
        }else{            
            let url = store.getters.transferProtocol + store.getters.domainConfig["QBMS"] + '/online/interface/newteach/queryPracticePaperTj.action?question_id='+item.question_id+'&paper_id='+rcode+'&studentclass='+store.getters.userSelectClassId
            obj.playJs = {'playName':'shititongji',params:{'rcode':rcode,'question_id':item.question_id,'url':url}}
            buttonArr .push({'name':'试题统计','enabled':true,'type':'shititongji','playJs':{'playName':'shititongji',params:{'rcode':rcode,'question_id':item.question_id,'url':url}}})
        }
        obj.button = buttonArr
        arr.push(obj)
    }
    return arr
}

/**
 * 获取英语练反馈
 * @param {*} paper_id 
 */
export async function getFankuiEngData(paper_id){
    let arr = []
    let res = {}
    try{
        res = await getFankuiEngApi(paper_id)
    }catch(e){
        commonUtils.console(e,'调用英语练反馈接口失败')
    }

    if(res.Wordread.length > 0){
        let obj = {}
        obj.text = '单词跟读'
        obj.playJs = {'playName':''}
        arr.push(obj)        
        for(let item of res.Wordread){
            let infoObj = {}
            infoObj.text = item.name+'&nbsp;&nbsp;作答数：'+ item.num+'&nbsp;&nbsp;平均分：'+item.average
            infoObj.playJs = {'playName':'openEngFankui',params:{'url':item.url}}
            arr.push(infoObj)
        }        
    }


    if(res.Wordevaluat.length > 0){
        let obj = {}
        obj.text = '单词拼写'
        obj.playJs = {'playName':''}
        arr.push(obj)        
        for(let item of res.Wordevaluat){
            let infoObj = {}
            infoObj.text = item.name+'&nbsp;&nbsp;作答数：'+ item.num+'&nbsp;&nbsp;答错人数：'+item.errornum+'&nbsp;&nbsp;答错率：'+item.errorrate
            infoObj.playJs = {'playName':'openEngFankui',params:{'url':item.url}}
            arr.push(infoObj)
        }        
    }


    if(res.Wordhy.length > 0){
        let obj = {}
        obj.text = '英汉互译'
        obj.playJs = {'playName':''}
        arr.push(obj)        
        for(let item of res.Wordhy){
            let infoObj = {}
            infoObj.text = item.name+'&nbsp;&nbsp;作答数：'+ item.num+'&nbsp;&nbsp;答错人数：'+item.errornum+'&nbsp;&nbsp;答错率：'+item.errorrate
            infoObj.playJs = {'playName':'openEngFankui',params:{'url':item.url}}
            arr.push(infoObj)
        }        
    }  
    
    

    if(res.Wordxc.length > 0){
        let obj = {}
        obj.text = '听音选词'
        obj.playJs = {'playName':''}
        arr.push(obj)        
        for(let item of res.Wordxc){
            let infoObj = {}            
            infoObj.text = item.name+'&nbsp;&nbsp;作答数：'+ item.num+'&nbsp;&nbsp;答错人数：'+item.errornum+'&nbsp;&nbsp;答错率：'+item.errorrate
            infoObj.playJs = {'playName':'openEngFankui',params:{'url':item.url}}
            arr.push(infoObj)
        }        
    } 
    

    if(res.Textread.length > 0){
        let obj = {}
        obj.text = '课文朗读'
        obj.playJs = {'playName':''}
        arr.push(obj)        
        for(let item of res.Textread){
            let infoObj = {}
            infoObj.text = item.name+'&nbsp;&nbsp;作答数：'+ item.num+'&nbsp;&nbsp;平均分：'+item.average
            infoObj.playJs = {'playName':'openEngFankui',params:{'url':item.url}}
            arr.push(infoObj)
        }        
    }
    

    if(res.examsquiz.length > 0){
        let obj = {}
        obj.text = '听力训练'
        obj.playJs = {'playName':''}
        arr.push(obj)        
        for(let item of res.examsquiz){
            let infoObj = {}            
            infoObj.text = item.name+'&nbsp;&nbsp;作答数：'+ item.num+'&nbsp;&nbsp;答错人数：'+item.errornum+'&nbsp;&nbsp;答错率：'+item.errorrate
            infoObj.playJs = {'playName':'openEngFankui',params:{'url':item.url}}
            arr.push(infoObj)
        }        
    }    


    return arr
}


/**
 * 查看离线作业内容和反馈内容
 * @param {*} rcode 
 */
export async function getOfflineHomeworkInfoData(rcode){
    let result = {}

    let res = {}    
    let arr = []
    let userArr = []

    let title = ''
    let content = ''

    try{
        res = await getOfflineHomeworkInfoApi(rcode)
    }catch(e){
        commonUtils.console(e,'调用查看离线作业反馈接口失败')
    }

    let resultStr = ''
    //处理特殊字符
    if(typeof(res) == 'string'){
        resultStr = res.replace('\\','')
        res = JSON.parse(resultStr)
    }

    if(res && res.data){     
        title = '已发送'+res.data.classname
        content = res.data.content

        for(let item of res.data.url){
            let obj = {}
            obj.title = ''
            let formatMark = ''
            let url = ''
            url = item.source_url
            console.log(url)
            if(url != 'null'){
                formatMark = url.substring(url.lastIndexOf(".")+1)
            }
            console.log(formatMark)
            formatMark = formatMark.toLowerCase()
            if(formatMark != ''){
                let iconFormat = getIconName(formatMark)
                if('jpg,jpeg,png,gif,bmp'.indexOf(iconFormat) != -1){
                    obj.icon = url
                }else{
                    obj.icon = require(`@/assets/images/icon/res/${iconFormat}.png`)
                }                
            }else{
                obj.icon = require('@/assets/images/icon/res/blank.png')
            }
            if(url != 'null'){
                obj.playJs = {'playName':'playLinkRes',params:{'resFormat':formatMark,'playUrl':url}}
            }else{
                obj.playJs = {'playName':''}
            }


            arr.push(obj)
        }
        for(let item of res.data.users){
            let obj = {}
            obj.username = item.username
            obj.truename = item.truename
            obj.rcode = rcode
            //good : 0,提交；1，已提交已评优；-1未提交
            if(item.good == 0||item.good == 1){
                obj.type = ''
            }else{
                obj.type = 'info'
            }
            
            userArr.push(obj)
        }
    }

    result.title = title
    result.content = content
    result.resList = arr
    result.userArr = userArr
    return result
}



/**
 * 获取离线作业某个人的反馈内容
 * @param {*} rcode 
 * @param {*} username 
 */
export async function getOfflineHomeworkFankuiByUserInfoData(rcode,username){
    let result = {}
    let arr = []
    let res = {}
    let content = ''
    try{
        res = await getOfflineHomeworkFankuiInfoByUserApi(rcode,username)
    }catch(e){
        commonUtils.console(e,'调用查看离线作业反馈接口失败')
    }

    if(res && res.data){        
        content = res.data.content
        // arr.push({'title':res.data.content,'playJs':{'playName':''}})

        for(let item of res.data.url){
            let obj = {}
            obj.title = ''
            let formatMark = ''
            let url = ''
            url = item.source_url
            console.log(url)
            if(url != 'null'){
                formatMark = url.substring(url.lastIndexOf(".")+1)
            }
            console.log(formatMark)
            formatMark = formatMark.toLowerCase()
            if(formatMark != ''){
                let iconFormat = getIconName(formatMark)
                if('jpg,jpeg,png,gif,bmp'.indexOf(iconFormat) != -1){
                    obj.icon = url
                }else{
                    obj.icon = require(`@/assets/images/icon/res/${iconFormat}.png`)
                }                
            }else{
                obj.icon = require('@/assets/images/icon/res/blank.png')
            }
            if(url != 'null'){
                obj.playJs = {'playName':'playLinkRes',params:{'resFormat':formatMark,'playUrl':url}}
            }else{
                obj.playJs = {'playName':''}
            }
            arr.push(obj)
        }
    }

    result.content = content
    result.resList = arr
    return result
}
/**
 * 所有列表以及列表上的按钮点击事件
 */

import router from '@/router'
import store from '@/store'
import qs from 'qs'
import { jxfxMqApi,getPaperDownloadUrlApi } from '@/api/interface'
import storage from '@/utils/storage'
import { DOWNLOAD_URL,KQYX_PAPER_ID,KQYX_RS_TYPE} from '@/api/constant'

export function click(params){
    let playName = params.playName
    let param = params.params
    switch(playName)
    {
        case "":
            alert('不处理')
            break
        case "yuxifankui":
            yuxifankui(param)
            break
        case "jiancefankui":
            jiancefankui(param)
            break
        case "zuoda":
            zuoda(param)
            break
        case "zuodaEng":
            zuodaEng(param)
            break
        case "fankui":
            fankui(1,param)
            break
        case "fankuiEng":
            fankui(2,param)
            break
        case "dengfen":
            dengfen(param)
            break   
        case "sendToPad":
            sendToPad(param)
            break
        case "sendToPadEng":
            sendToPadEng(param)
            break
        case "faqitanjiu":
            faqitanjiu(param)
            break
        case "playEbook":
            playEbook(param)
            break
        case "playRes":
            playRes(param)
            break
        case "playLive":
            playLive(param)
            break
        case "playLinkRes":
            playLinkRes(param)
            break
        case "playTeachFileRes":
            playTeachFileRes(param)
            break
        case "playWkRes":
            playWkRes(param)
            break
        case "playWkRes":
            playWkRes(param)
            break
        case "playByIe":
            playByIe(param)
            break
        case "playByChrome":
            playByChrome(param)
            break            
        case "playError":
            playError(param)
            break
    }
 }



export function yuxifankui(params){
    alert('yuxifankui')
 }

export function jiancefankui(params){
    alert('jiancefankui')
}


/**
 * 获取作答链接
 * @param {*} type  1题库作答，2英语练作答
 * @param {*} rcode 
 * @param {*} rsType 
 */
function getZuodaUrl(type,rcode,rsType){    
    let zuodaUrl = ""
    if(type == 1){
        zuodaUrl = `${store.getters.transferProtocol}${store.getters.domainConfig["PORTAL"]}/tqmsui/newteach/p1/v1/single_ques/${rcode}/tq?rsType=${rsType}`
    }else{
        zuodaUrl = `${store.getters.transferProtocol}${store.getters.domainConfig["PORTAL"]}/tqmsui/newteach/p1/v1/single_ques/${rcode}/en?rsType=${rsType}`
    }
    
    return zuodaUrl    
}

/**
 * 打开训练作答
 * @param {*} params 
 */
export function zuoda(params){
    let url = getZuodaUrl(1,params.rcode,params.rsType)
    openNewPage(url,'xpos=0&ypos=0&width=0&height=0&modal=true')
}


/**
 * 英语练作答
 * @param {*} params 
 */
export function zuodaEng(params){
    let url = getZuodaUrl(2,params.rcode,params.rsType)
    openNewPage(url,'xpos=0&ypos=0&width=0&height=0&modal=true')
}

/**
 * 打开反馈地址
 * isEbook：是互动套卷访问 Number 1(如果是发送到平板后的反馈为1，其他为0)
 * rsType：资源类型 String
 * feedback：是否反馈 Number 1
 * @type {*} type 1题库2英语同步练
 * @param {*} params 
 */
export function fankui(type,params){
    let url = ''
    // if(type == 1){
    //     //题库
    //     url = getZuodaUrl(type,params.rcode,params.rsType)
    // }else{
    //     //英语练
    //     url = `${store.getters.transferProtocol}${store.getters.domainConfig["ESLEANR"]}/Device/feedback?examsid=${params.rcode}&username=${store.getters.teacherNumber}&studentClassid=${store.getters.userSelectClassId}&tms=${store.getters.domainConfig["TMS"]}`        
    // }
    
    url = getZuodaUrl(type,params.rcode,params.rsType)

    let fankuiUrl = ''
    let isEbook = params.isEbook;
    if(typeof isEbook == "undefined"){
        isEbook = 0;
    }
    // if(params.rsType == 9){
    //     // fankuiUrl = url
    //     fankuiUrl = url + '&feedback=1'
    // }else{
    //     fankuiUrl = url + '&feedback=1&isEbook='+isEbook
    // }

    //不做判断，发送平板的反馈，不管是英语练还是题库的isBook都为1,如果不是平板的反馈，英语练的反馈为0或者不传
    fankuiUrl = url + '&feedback=1&isEbook='+isEbook

    openNewPage(fankuiUrl,'xpos=0&ypos=0&width=0&height=0&modal=true&parent=base')
    // if(type == 1){
    //     openNewPage(fankuiUrl,'xpos=0&ypos=0&width=0&height=0&modal=true&parent=base')
    // }else{
    //     openNewPage(fankuiUrl,'xpos=0&ypos=0&width=0&height=0&modal=true&title=反馈&showclose=true&parent=base')
    // }    
}


export function faqitanjiu(params){
    let url = ''

}

export function dengfen(params){
    // let dengFenUrl = params.dengFenUrl
    // let dengfenViewUrl = params.dengfenViewUrl
    // alert(dengFenUrl)
    // alert(dengfenViewUrl)
    let rcode = params.rcode
    let rsType = params.rsType

    let urlTmp = 'paper_online';
    let dengFenUrl = '';
    if(rsType == 9){
        dengFenUrl = `${store.getters.transferProtocol}${store.getters.domainConfig["PORTAL"]}/tqmsui/newteach/p1/v1/vop/paper_online_en/${rcode}`        
    }else{
        dengFenUrl = `${store.getters.transferProtocol}${store.getters.domainConfig["PORTAL"]}/tqmsui/newteach/p1/v1/vop/paper_online/${rcode}?rsType=${rsType}`
    }
    
    openNewPage(dengFenUrl,'xpos=0&ypos=0&width=0&height=0&modal=true')
}


/**
 * 题库训练发到平板
 * @param {*} params 
 */
export async function sendToPad(params){
    let sendEBookUrl = params.sendEBookUrl
    let rsType = params.rsType
    console.log(sendEBookUrl)
    console.log(rsType)

    //发送到平板
    // if(rsType==2)
    // {
    //     //系统试卷
    //     rsType=1;
    // }
    // else if(rsType==6)
    // {
    //     //个性试卷
    //     rsType=0;
    // }
    // else
    // {
    //     rsType=1;
    // }

    // _common.addTjPv("stxl",teachernumber,userclass,_common.channelid);//pv统计

    //往教学分析队列初始化的



    //调用题库接口
    //接口地址加上/node
    let index = sendEBookUrl.indexOf('/online/')
    let baseUrl = sendEBookUrl.substring(index)
    let res = await getPaperDownloadUrlApi('/node'+baseUrl)
    if(res&&res.data&&res.success){
        let downloadUrl = res.data.downloadurl
        let paper_id =  res.data.paper_id

        //往教学分析队列初始化的
        jxfxMqApi(store.getters.ksId,store.getters.userSelectClassId)

        //通过控件打开弹窗pad.jsp,并传入downloadUrl和fankuiUrl,让平板下载试题
        storage.set(DOWNLOAD_URL,downloadUrl)
        storage.set(KQYX_PAPER_ID,paper_id)
        // storage.set(KQYX_RS_TYPE,rsType)
        storage.set(KQYX_RS_TYPE,6)//写死6
        //窗口关闭的时候，回调打开题库反馈页面
        let openUrl = '/teachui/#/pad/index?type=sendToPad'
        openNewPage(openUrl,'xpos=0&ypos=0&width=0&height=0&modal=true')
        //关闭的时候回调查看反馈
    }else{
        console.log('获取下载地址失败！')
    }
}

//英语练发送到平板
export function sendToPadEng(params){
    let truename = encodeURIComponent(store.getters.trueTeacherName);
    let downloadUrl = `${store.getters.transferProtocol}${store.getters.domainConfig["ESLEANR"]}/Home/Zipdownload/examszip?examsid=${params.paperId}&username=${store.getters.teacherNumber}&truename=${truename}&tqms=${store.getters.domainConfig["QBMS"]}`;

    let paper_id =  params.paperId

    //通过控件打开弹窗pad.jsp,并传入downloadUrl和fankuiUrl,让平板下载试题
    storage.set(DOWNLOAD_URL,downloadUrl)
    storage.set(KQYX_PAPER_ID,paper_id)
    // storage.set(KQYX_RS_TYPE,rsType)
    storage.set(KQYX_RS_TYPE,9)//写死6
    //窗口关闭的时候，回调打开题库反馈页面
    let openUrl = '/teachui/#/pad/index?type=sendToPad'
    openNewPage(openUrl,'xpos=0&ypos=0&width=0&height=0&modal=true')
}

/**
 * 1 正常播放 rcode ,resType,ksId 根据resType判断
 * 2 链接资源和录音 resFormat playUrl 根据resFormat判断
 * 2.resType判断：此处resType和龙真协商传递成bdwk表示是本地微课类型，名师微课的resType还是5
 * @param {*} params 
 */
export function playRes(params){
    // let url = store.getters.transferProtocol + store.getters.domainConfig["PORTAL"] + '/teachui/#/play/index?rcode='+params.rcode+'&resType='+params.resType+'&ut='+store.getters.ut+'&teacherNumber='+store.getters.teacherNumber+"&ksId="+store.getters.ksId;
    let url = '/teachui/#/play/index?rcode='+params.rcode+'&resType='+params.resType+'&ut='+store.getters.ut+'&teacherNumber='+store.getters.teacherNumber+"&ksId="+store.getters.ksId;
    if(typeof(params.wordFlag) != 'undefined' && params.wordFlag == 1){
        this.$alert('需要密码');
        return false
    }
    if(params.resType==7){//录音
        // url = store.getters.transferProtocol + store.getters.domainConfig["PORTAL"] + '/teachui/#/play/index?resFormat='+params.formatMark+'&ut='+store.getters.ut+'&teacherNumber='+store.getters.teacherNumber+'&playUrl='+params.desc        
        url = '/teachui/#/play/index?resFormat='+params.formatMark+'&ut='+store.getters.ut+'&teacherNumber='+store.getters.teacherNumber+'&playUrl='+params.desc        
    }
    try{
        VcomTeach.openNewBrowser(url,'xpos=1&ypos=1&width=1&&height=1&modal=true');
    }catch(e){
        window.open(url)
    }
}

/**
 * 播放链接资源
 * @param {*} params 
 */
export function playLinkRes(params){
    let url = store.getters.transferProtocol + store.getters.domainConfig["PORTAL"] + '/teachui/#/play/index?resFormat='+params.resFormat+'&ut='+store.getters.ut+'&teacherNumber='+store.getters.teacherNumber+'&playUrl='+encodeURIComponent(encodeURIComponent(params.playUrl))

    if(typeof(params.wordFlag) != 'undefined' && params.wordFlag == 1){
        this.$alert('需要密码');
        return false
    }
    if(store.getters.loginStyle != 0){
        window.open(url)
    }else{
        //控件弹窗
        // alert('控件打开'+url)
        try{
            VcomTeach.openNewBrowser(url,'xpos=1&ypos=1&width=1&&height=1&modal=true');
        }catch(e){
            
        }
    }
}

/**
 * 直播播放
 * @param {*} params 
 */
export function playLive(params){
    let url = store.getters.transferProtocol + store.getters.domainConfig["PORTAL"] + '/teachui/#/play/index?rcode='+params.rcode+'&resType='+params.resType+'&ut='+store.getters.ut+'&teacherNumber='+store.getters.teacherNumber
    if(store.getters.loginStyle != 0){
        window.open(url)
    }else{
        //控件弹窗
        // alert('控件打开'+url)
        try{
            VcomTeach.openNewBrowser(url,'xpos=1&ypos=1&width=1&&height=1&modal=true');
        }catch(e){
            
        }
    }
}

export function playEbook(params){
    alert('playEbook')
}

export function playTeachFileRes(params){
    alert('playTeachFileRes')
}

export function playWkRes(params){
    alert('playWkRes')
}

export function playByChrome(params){
    window.open(params.playUrl)
}

export function playByIe(params){
    alert('playByIe')
}

export function playError(params){
    alert('playError')
}


/**
 * 打开智能组卷(训练)
 */
export function openTqmsPracticePaper(ksId,username){
    let url = `${store.getters.transferProtocol}${store.getters.domainConfig["ASSEM"]}/testassemblyui/v2/newteach/practice/${store.getters.domainConfig["PORTAL"]}/${ksId}/${username}`
    openNewPage(url,'xpos=0&ypos=0&width=0&height=0&modal=true')
}

/**
 * 打开智能组卷(作业)
 */
export function openTqmsPracticePaperFromHomework(ksId,username){
    let url = `${store.getters.transferProtocol}${store.getters.domainConfig["ASSEM"]}/testassemblyui/v2/newteach/homework/${store.getters.domainConfig["PORTAL"]}/${ksId}/${username}`
    openNewPage(url,'xpos=0&ypos=0&width=0&height=0&modal=true')
}

/**
 * 打开新窗口（控件打开）
 * @param {*} url 打开新窗口的链接
 * @param {*} dialogParams 窗口的参数
 */
export function openNewPage(url,dialogParams){
    if(store.getters.loginStyle != 0){
        window.open(url)
    }else{
        //控件弹窗
        try{
            VcomTeach.openNewBrowser(url,dialogParams)
        }catch(e){
            console.log(e)
        }        
    }   
}
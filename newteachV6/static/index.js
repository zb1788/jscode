/**
 * 根据客户端clientType返回定制配置
 * @param {} clientType 
 */
function mapClientFlag(clientType){
    /* 
    cssName  定制支持处理 
    type:处理方式1替换图片；如果增加获取图片方法getCustomLogo需要增加判断
    */
    var areaMap={
        "default":{"type":1,"url":"static/area/default/","imgs":"copy,logo","copyrightText":"<p>技术支持：郑州威科姆科技股份有限公司</p><p>服务热线：400-699-3111</p>"},//默认img:copy,logo
        "zzbbt":{"type":1,"url":"static/area/zhengzhou/","imgs":"copy,logo","copyrightText":"<p>监制：郑州市教育局</p><p>技术支持：郑州威科姆科技股份有限公司</p>"},//定制img:copy,logo
        "jizbbt":{"type":1,"url":"static/area/jzzzq/","imgs":"copy,logo","copyrightText":"<p>监制：焦作市中站区教育局</p><p>技术支持：郑州威科姆科技股份有限公司</p>"},//定制img:copy,logo
        "ycbbt":{"type":1,"url":"static/area/yongcheng/","imgs":"copy,logo","copyrightText":"<p>监制：永城市教育局</p><p>技术支持：郑州威科姆科技股份有限公司</p>"},//定制FootTool,img:copy,logo
        "nanweipad":{"type":1,"url":"static/area/nanwei/","imgs":"copy,logo","copyrightText":"<p>技术支持：南威软件股份有限公司</p><p>服务热线：400-058-5686</p>"},//定制FootTool,img:copy,logo
        "qcjypad":{"type":1,"url":"static/area/hhht/","imgs":"copy,logo","copyrightText":"<p>技术支持：中国联通呼和浩特分公司</p><p>服务热线：0471-660-3086</p>"},//定制FootTool,img:copy,logo
        "lwpad":{"type":1,"url":"static/area/lingwu/","imgs":"logo","copyrightText":"<p>技术支持：郑州威科姆科技股份有限公司</p><p>服务热线：400-699-3111</p>"},//定制FootTool,img:logo
        "yxspd":{"type":1,"url":"static/area/yunxiao/","imgs":"logo","copyrightText":"<p>技术支持：郑州威科姆科技股份有限公司</p><p>服务热线：400-699-3111</p>"},//定制FootTool,img:logo
        "ntbbt":{"type":1,"url":"static/area/nantong/","imgs":"logo","copyrightText":"<p>技术支持：郑州威科姆科技股份有限公司</p><p>服务热线：400-699-3111</p>"}
    };
    //bbt/pad对应两份，其他单独
    var flagMap={
        "zzpad":areaMap.zzbbt,
        "jizpad":areaMap.jizbbt,
        "ycpad":areaMap.ycbbt,
        "nanweibbt":areaMap.nanweipad,
        "qcjybbt":areaMap.qcjypad,
        "lwbbt":areaMap.lwpad,
        "ntpad":areaMap.ntbbt
    }
    
    Object.assign(flagMap,areaMap)

    if(flagMap[clientType]){
        return flagMap[clientType];
    }
    return flagMap["default"];
}

/**
 * 根据客户端返回设备类型，转化为文字显示
 * @param {*} stype 
 */
function showDriveTypeName(stype){
    var typeMap={"0":"单题接收器","1":"多题套卷接收器","2":"数字接收器"}
    if(stype.indexOf(",")>-1){
        let typeArr = stype.split(",");
        let nameArr = new Array();
        for(let i=0;i<typeArr.length;i++){
            if(typeMap[typeArr[i]]){
                nameArr.push(typeMap[typeArr[i]]);
            }
        }
        if(nameArr.length>0){
            return nameArr.join(",");
        }
    }else if(typeMap[stype]){
        return typeMap[stype];
    }
    return "无";
}
/**
 * 根据当前客户端定制标记获取定制Logo
 * @param {} clientType 
 */
function getCustomLogo(clientType){
    var cobj = mapClientFlag(clientType);
    return cobj.url+"logo.png"
}
//注入自定义事件
//关闭窗口的回调
function ChildCloseNotify(params){
  
    let obj = JSON.parse(params)
    console.log('回调内容调试')
    console.log(obj)
    if(obj.type == 'setClassStatus'){
        //设置上下课回调
        window.dispatchEvent(new CustomEvent('doSetClassStatus', {"detail": obj}));
    }else if(obj.type == 'tls_yxzd'){
        //设置预习发起探究的反馈
        window.dispatchEvent(new CustomEvent('doYxfankui', {"detail": obj}));
    }else if(obj.type == 'tls_xlfk'){
        //训练发送平板的反馈             
        window.dispatchEvent(new CustomEvent('doXlfankui', {"detail": obj}));
    }else if(obj.type == 'tq_znzj'){
        //智能组卷
        window.dispatchEvent(new CustomEvent('doZnzj', {"detail": obj}));    
    }else if(obj.type == 'tq_xlzd'){
        //训练作答回调刷新列表
        window.dispatchEvent(new CustomEvent('doXlzd', {"detail": obj}));    
    }else if(obj.type == "setArea"){
        //地址设置完成
        if("ok"==obj.option){
            //等待100ms避免假死
            window.setTimeout("window.close();",100);
        }
    }
    // window.dispatchEvent(new CustomEvent('onClosePage', {"detail": obj}));
}
 //电子教材Div关闭
 function requestVcomDivSignOut(){
     //alert(process.env.TQMS_BASE_PREFIX)
    window.close();
		// document.getElementById("dzjcDiv").style.display="none";
		// maskAll.style.display="none";
		// document.getElementById("dzjcDiv").innerHTML="";
		// document.getElementById("dzjcDiv").style.height="0px";
}
//电子教材播放适配
function eTeachingMaterialResPlayer(datastr){
    var playDzjcRes=decodeURIComponent(datastr);
    playDzjcRes=JSON.parse(playDzjcRes);
	try{
        // if(playDzjcRes.rsType=="1")
        // {
        //     //资源
        //     if(playDzjcRes.RFormatMark=="html")
        //     {
        //         //判断是否为电子教材类型
        //         player.checkDZJCplay(playDzjcRes.rcode,playDzjcRes.RFormatMark);
        //     }
        //     else
        //     {
        //         player.playResource(playDzjcRes.rcode,"2",playDzjcRes.RFormatMark);
        //     }

        // }
        // else if(playDzjcRes.rsType=="3")
        // {
        //     //教师文件夹
        //     player.getTeacherFolderFile(playDzjcRes.rcode,playDzjcRes.RFormatMark);

        // }
        var obj={};
        var paramObj={};
        paramObj.rcode=playDzjcRes.rcode;
        paramObj.resType=playDzjcRes.rsType;
        obj.params=paramObj;
        if(playDzjcRes.rsType=="1"||playDzjcRes.rsType=="3")
        {
            obj.playName="playRes";
            //playResInDzjc(playDzjcRes.rcode,playDzjcRes.rsType);
        }
        else if(playDzjcRes.rsType=="2"||playDzjcRes.rsType=="6")
        {
            //系统或个性试卷
            //zjxl.view(playDzjcRes.rcode,playDzjcRes.RTitle);
            // data = "?rcode=" + playDzjcRes.rcode +"&rsType="+playDzjcRes.rsType+ "&classId="+_treeVersion.currentCourseId+"&studentClass="+userclass+ "&username=" + teachernumber +"&userTrueName="+encodeURI(encodeURI(teachername))+"&areaId="+areaId;
            // var playjs=transferProtocol_web+_config["QBMS"]+"/online/interface/newteach/answerdevice/viewClassPracticeDevice.action"+data;
            // zjxl.zuoda(playjs);
            paramObj.rsType=playDzjcRes.rsType;
            obj.playName="zuoda";
        }
        else if(playDzjcRes.rsType=="9")
        {
            obj.playName="zuodaEng";
        }
        /*else if (playDzjcRes.rsType=="6")
        {
            //个性试卷
            /!*url = transferProtocol_web + _config["QBMS"] + '/tqms/interface//queryNameById.action?paper_id='+playDzjcRes.rcode;
            openResPageWithClose(url,playDzjcRes.RTitle);*!/
            data = "?rcode=" + destCode +"&rsType="+destType+ "&classId="+_treeVersion.currentCourseId+"&studentClass="+userclass+ "&username=" + teachernumber +"&userTrueName="+encodeURI(encodeURI(teachername))+"&areaId="+areaId;
            var playjs=transferProtocol_web+_config["QBMS"]+"/online/interface/newteach/answerdevice/viewClassPracticeDevice.action"+data;
            zjxl.zuoda(playjs);
        }*/
        //click(obj);
        window.dispatchEvent(new CustomEvent('dzjcCallBack', {"detail": obj})); 

	}catch(e){
		alert("播放解析异常!");
	}
}
/**
 * 电子教材弹出的资源播放
 * @param {} rcode 资源编码
 * @param {*} resType 资源类型1系统3教师文件夹  2和6 试卷
 */
function playResInDzjc(rcode,resType)
{
    var preUrl=GetUrlPath();
    var teacherNumber=getQueryVariable("teacherNumber");
    var ksId=getQueryVariable("ksId");
    var url = preUrl + '/index?rcode='+rcode+'&resType='+resType+'&teacherNumber='+teacherNumber+"&ksId="+ksId;
     //url='http://llzvcom.yjt361.com:8777/teachui/#/play/index?rcode='+rcode+'&resType='+resType+'&teacherNumber='+teacherNumber+"&ksId="+ksId;
    if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach())
	{
        //控件弹窗
        // alert('控件打开'+url)
        try{
            VcomTeach.openNewBrowser(url,'xpos=1&ypos=1&width=1&&height=1&modal=true');
        }catch(e){
            
        }
    }
    else
    {
        window.open(url)
    }
}
/**
 * 获取应用前缀
 */
function GetUrlPath(){  
    　　　　var url = document.location.toString();               
    　　　　if(url.indexOf("/") != -1){  
                url = url.substring(0,  url.lastIndexOf("/")) ;  
    　　　　}  
    　　　　return url;  
} 
/**
 * 获取url参数
 */
function getQueryVariable(variable)
{
       var query = window.location.href.toString().split("?")[1];//截取url中？后的字符串
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
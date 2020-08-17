/**
 * 所有播放相关
 * author:lilongzhen
 */

import request from '@/utils/request'

var vm;
var userName="";
var resType=1;
function IEVersion() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
  if(isIE) {
      var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(userAgent);
      var fIEVersion = parseFloat(RegExp["$1"]);
      if(fIEVersion == 7) {
          return 7;
      } else if(fIEVersion == 8) {
          return 8;
      } else if(fIEVersion == 9) {
          return 9;
      } else if(fIEVersion == 10) {
          return 10;
      } else {
          return 6;//IE版本<=7
      }   
  } else if(isEdge) {
      return 'edge';//edge
  } else if(isIE11) {
      return 11; //IE11  
  }else{
      return -1;//不是ie浏览器
  }
}

//pc,是否可以进行pdf浏览。
function canPlayPdfRes()
{
var versionVar=IEVersion();
if(versionVar==6 || versionVar==7|| versionVar==8 || versionVar==9)
{
  return false;
}
else
{
  return true;
}

}
function createXml(str){
  　　if(document.all){//IE浏览器
      　　var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async = false;
      　　xmlDoc.loadXML(str);
      　　return xmlDoc;
  　　}
  　　else{//非IE浏览器
  　　        return new DOMParser().parseFromString(str, "text/xml");
      }
  }
function parseLoadUrlXml(xmlDoc)
{
  xmlDoc=createXml(xmlDoc);
 var tmpArra=new Array();
    var items=xmlDoc.getElementsByTagName("file");
     if(items)
     {
      for(var i=0;i<items.length;i++)
     {
        var item=items[i];
        if(item)
        {
          var itemAttr=item.attributes;
         var tmpUrl= itemAttr.getNamedItem("path").nodeValue;
         var tmpFilepath= itemAttr.getNamedItem("filepath").nodeValue;
         var newFlashFlagItem=itemAttr.getNamedItem("newFlashFlag");
         var newFlashFlag;
          if(tmpUrl&&tmpFilepath)
          {
            if(newFlashFlagItem)
            {
            newFlashFlag=newFlashFlagItem.nodeValue;
            }
            var playFlagValue="";
          var playFlag= itemAttr.getNamedItem("playFlag");
          if(playFlag)
          {
            playFlagValue=playFlag.nodeValue;
          }
           var remainTimesValue="";
         var remainTimes= itemAttr.getNamedItem("remainTimes");
          if(remainTimes)
          {
              remainTimesValue=remainTimes.nodeValue;
          }
           var tmp={"path":tmpUrl,"filePath":tmpFilepath,"newFlashFlag":newFlashFlag,"playFlag":playFlag,"remainTimes":remainTimesValue};
                tmpArra.push(tmp);
          }
         
        }
      }
    }
    return tmpArra;
}

function parseLoadUrlJson(data)
{
  var tmpArra=new Array();
  var listItems;
  // if(resType==1){
  //   if(data&&data.jsonList&&data.jsonList.length>0)
  //   {
  //     listItems=data.jsonList[0].list;
  //   }
  // }
  // if(resType==3)
  // {
  //   listItems=data.jsonList[0].list;
  // }
  listItems=data.jsonList;
    if(listItems&&listItems.length>0)
    {
      for(var i=0;i<listItems.length;i++)
      {
        var items=listItems[i].list;
        for(var j=0;j<items.length;j++)
        {
         var item = items[j];
         var tmpUrl= item.path;
         var tmpFilepath= item.filepath;
         var newFlashFlagItem=item.newFlashFlag;
         var newFlashFlag;
          if(tmpUrl&&tmpFilepath)
          {
            if(newFlashFlagItem)
            {
            //newFlashFlag=newFlashFlagItem.nodeValue;
            }
            var playFlagValue="";
          var playFlag= item.playFlag;
          if(playFlag)
          {
            //playFlagValue=playFlag.nodeValue;
          }
           var remainTimesValue="";
         var remainTimes= item.remainTimes;
          if(remainTimes)
          {
              //remainTimesValue=remainTimes.nodeValue;
          }
           var tmp={"path":tmpUrl,"filePath":tmpFilepath,"newFlashFlag":newFlashFlag,"playFlag":playFlag,"remainTimes":remainTimesValue};
                tmpArra.push(tmp);
          }
        }
        }
      }
      return tmpArra;
}
/**
 * 解析错误提示
 * @param {*} data 
 * @param {*} rcode 
 */
function parseErrorMsgJson(data,rcode)
{
  var errMsg = "未返回负载地址";
  if(typeof data.errormsges!="undefined")
  {
    if(typeof data.errormsges[rcode]!="undefined")
    {
      if(typeof data.errormsges[rcode].ecode!="undefined")
      {
        var ecode=data.errormsges[rcode].ecode;
        if(ecode)
        {
          if(ecode=="2"||ecode=="7")
          {
            errMsg=data.errormsges[rcode].errmsg;
          }
        }
      }
    }
  }
  return errMsg;
}
var getInfoJsonUrl=process.env.PLS_BASE_PREFIX+"/youjiaoplay/getInfoJson.do";
var batchDownloadUrl=process.env.PLS_BASE_PREFIX+'/youjiao/doMutiplePlay.do';//负载地址
var fileDownloadUrl=process.env.PLS_BASE_PREFIX+'/teacherfile/nplayfile.do';//教师文件夹负载地址
var wkDownloadUrl=process.env.MICRO_BASE_PREFIX+"/user/resource/play/doMutiplePlayJsonOwn.action";//微课负载地址,授课端
var bdwkDownloadUrl=process.env.MICRO_BASE_PREFIX+"/user/resource/play/doMutiplePlayJson.action";//本地微课负载地址
var loadLiveUrl=process.env.PLS_BASE_PREFIX+'/youjiao2/doLivePlayer.do?';//直播接口
export function playHelper(destCode,destType,self)
{
  vm=self;
  vm.downloadFlag=false;
  //alert(vm.teacherNumber)
  userName=vm.teacherNumber;
  resType=destType;
    let data="";
	if(destType==1)//资源。
		 {
            loadInfoByRcode(destCode);
		 }
		else if(destType==3)//文件。
		{
            loadInfoByFcode(destCode);
		}
		else if(destType==4)
       {
		 //loadInfoByRcodeSid(destCode);
       }
   
   else if(destType==5)//微课。
   {
     //微课播放。
     //var palyWkUrl = microUrl+'user/resource/play/playView.action?rcode='+destCode+'&type=0'; 
	   loadWkInfo(destCode);
    }
    else if(destType=='bdwk')
    {
      wkDownloadUrl=bdwkDownloadUrl;
      loadWkInfo(destCode);
    }

}

function loadInfoByRcodePromise(tmpRcode)
{
  var rsType=1;//默认为基础资源
  if(resType==3)
  {
    rsType=2;
  }
  var time=new Date().getTime();
  var paramName={"rcode":tmpRcode,"rsType":rsType,"t":time};
  return new Promise((resolve, reject) => {
    resolve(request({url: getInfoJsonUrl, method: 'get', data:paramName}) ) 
  })
}
async function loadInfoByRcode(tmpRcode)
{
// if(groupType=='school')
// {
// paramName={"rcode":tmpRcode,"rsType":1,"groupType":groupType,"t":time};
// }
// else if(groupType=='lesson'|| groupType=='typecode')
// {
// paramName={"rcode":tmpRcode,"rsType":1,"groupType":groupType,"groupCode":groupCode,"ksCode":playKsCode,"username":userName,"place":place,"t":time};
// }
//ajaxJsonJKGet(getInfoJsonUrl,paramName,loadInfoByRcodeA,loadInfoByRcodeB);
try{
  let data = await loadInfoByRcodePromise(tmpRcode);
  loadInfoByRcodeA(data);
}catch(e){
  console.log("请求信息异常："+e);
  if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach()){
    VcomTeach.setWndSize(0,0,0,0) // 最大化
    showErrorMessage("打开资源失败");
    closeDialog();
  }else{
    
  }
  
}
}
function loadInfoByRcodeA(data)
{
 if(data)
 {
   var infoTypeFormat=data.infoTypeFormat;
   var info=data.info;
   vm.infoTypeFormat=infoTypeFormat;
   if(info)
   {
   	 
  //播放逻辑 
if((info.RFormat&&info.RFormat!="F800") || (info.RFormat=="F800"&&info.linkType==4 ))
    {
    	if(info.wordFlag==0){
             mainPlayFun(infoTypeFormat,info,data.pdfSID);
        }
    }else{
    	
    	//playResAjaxLinkTypeCommonPlay(info.RCode,2);
    	newPlayResLinkType(info.RCode,info.linkType);
    }
   
    
    //需要密码验证
  //  if(info.wordFlag&&info.wordFlag==1){
  //   showValidateResPasswordDialog(info.RCode);
  //    }
    
   }
   else
   {
  //不存在提示
  showErrorMessage("你所浏览的资源不存在");
   }
   
 }
}

async function loadInfoByFcode(fcode)
{
  let data = await loadInfoByRcodePromise(fcode);
  loadInfoByFcodeA(data);
}
function loadInfoByFcodeA(data)
{

  if(data&&data.info)
  {
    var infoTypeFormat=data.infoTypeFormat;
    vm.infoTypeFormat=data.infoTypeFormat;
    var info=data.info;
    //如果播放的是教师文件夹，不是自己需要限制。
    //  if(info.teachnumber!=userName)
    //  {
    // 	 if(!isGrantClickButton("pls-common-play")){
    // 			playGrantTip();
    // 	      return;
    // 	 }
    //  }
     if(info.c1&&info.c1!="")
     {
      loadInfoByRcode(info.c1);//教师文件连接基础资源。
      return;
     }
    
    // if(infoTypeFormat==2)
    // {
    // $("#fullScreenFlashId").show();
    // }
    mainPlayFileFun(infoTypeFormat,info.fcode,data.pdfFCODE);
   }
   else
   {
    showErrorMessage("你所浏览的文件不存在");
   }
}
function mainPlayFun(infoTypeFormat,info,pdfSID)
 {
 var tmpRcode=info.RCode;
 var RFormatMark=info.RFormatMark;
 vm.infoTypeFormat=infoTypeFormat;
 if(infoTypeFormat==1)
 {
 //loadImagePlay(tmpRcode);
 loadPlays(tmpRcode);
 }else if(infoTypeFormat==2)
 {
 //loadPlaySwf(tmpRcode);
 loadPlays(tmpRcode);
 }else if(infoTypeFormat==3)
 {
   if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach())
   {
    loadPlay(tmpRcode);
   }
   else
   {
     downLoadRes(tmpRcode);
   }
 //ie的才是使用vcom播放控件进行播放，否则下载。
//  if(isIE())
//  {
//  loadPlayVod(tmpRcode);
//  }
//  else
//  {
//   // loadPlayOffice(tmpRcode);
//   // downLoadOpenRes(tmpRcode);
//   downLoadRes(tmpRcode);
  
//  }
 
 }else if(infoTypeFormat==4)
 {
 //loadPlayMp4(tmpRcode);
 loadPlay(tmpRcode);
 }else if(infoTypeFormat==5)
 {
 //loadPlayMp3(tmpRcode);
 loadPlays(tmpRcode);
 }else if(infoTypeFormat==6)
 {
 //loadPlayText(tmpRcode);
 loadPlay(tmpRcode);
 }else if(infoTypeFormat==7)
 {//office
	//  if(pdfSID&&canPlayPdfRes())//PDF预览的支持，以及浏览器判定。
	//  {
  //   //loadPlayPdfSid(pdfSID); 
  //   vm.canPlayPdf=true;
  //   vm.pdfSID=pdfSID;
	//  }else
	// {
    // loadPlayOffice(tmpRcode);
    // downLoadOpenRes(tmpRcode);
    if(RFormatMark=='pdf')
    {
      vm.canPlayPdf=true;
      vm.pdfSID=pdfSID;
    }
    else
    {
      downLoadRes(tmpRcode);    
    }
	 //}
 }else if(infoTypeFormat==8)
 {
 //loadPlayEpt(tmpRcode);
 downLoadRes(tmpRcode);
 }else if(infoTypeFormat==9)
 {
 
 }
 else if(infoTypeFormat==11)//点播模拟直播
 {
 loadPlayLive(tmpRcode);
 
 }
 else if(infoTypeFormat==12)//vcom电子教材播放方式。
 {
  //loadVcomEFlash(tmpRcode);
  loadPlays(tmpRcode);
 }
 else if(infoTypeFormat==13)//在线预览。
 {
  //alert("可以在线预览");
  //onLinePlayDoc(tmpRcode);
  //filterType=5;
  //loadPlays(tmpRcode);
  downLoadRes(tmpRcode);
 }
 else
 {
  // loadPlayOffice(tmpRcode);
  // downLoadOpenRes(tmpRcode);
  downLoadRes(tmpRcode);
 }
 
 }
 function mainPlayFileFun(infoTypeFormat,fCode,pdfFCODE)
 {
  vm.infoTypeFormat=infoTypeFormat;
   if(pdfFCODE&&canPlayPdfRes())
   {
  //loadPlayFilePdf(pdfFCODE);
  vm.canPlayPdf=true;
  vm.pdfSID=pdfFCODE;
	return;   
  }
 if(infoTypeFormat==1)
  {
  //loadImagePlayFile(fCode);
  //loadImagePlay(fCode);
  loadPlays(fCode);
  }
  else if(infoTypeFormat==2)
  {
   //loadPlaySwfFile(fCode);
   loadPlays(fCode);
  }else if(infoTypeFormat==4)
  {
  //loadPlayMp4(tmpRcode);
  loadPlay(fCode);
  }else if(infoTypeFormat==5)
 {
   //loadPlayMp3File(fCode);
   //loadPlayMp3(fCode);
   loadPlays(fCode);
 }
 else if(infoTypeFormat==10)
 {
  // loadPlayDownLoadOfficeFile(fCode);
  // downLoadYunFile(fCode);
  downLoadRes(fCode);
 }
 else if(infoTypeFormat==13)//flexpaper
 {
 //alert(infoTypeFormat);
 //onLinePlayFileDoc(fCode);
 //filterType=5;
 //loadPlays(fCode);
 downLoadRes(fCode);
 }
 else
 {
  //loadPlayOfficeFile(fCode);
  //downLoadOpenYunFile(fCode);
  downLoadRes(fCode);
 }
 }


var filterType=0;
function loadPlayPromise(rCode)
{  
   var params={"rcode":rCode,"userName":userName,"filterType":filterType,"outType":1};
   if(!vm.downloadFlag)
   {
    params.allowPcMain=1;//非下载时需要加上此参数
   }
   //ajaxXmlJKGet(batchDownloadUrl,paramName,loadPlayMp4A,loadPlayMp4B);
   return new Promise((resolve, reject) => {
    resolve(request({url: batchDownloadUrl, method: 'get', data:params}) ) 
  })
}

function loadPlayFilePromise(rCode)
{  
   var params={"ids":rCode,"outType":1,"jsonType":1};
   //ajaxXmlJKGet(batchDownloadUrl,paramName,loadPlayMp4A,loadPlayMp4B);
   return new Promise((resolve, reject) => {
    resolve(request({url: fileDownloadUrl, method: 'get', data:params}) ) 
  })
}

async function loadPlay(rCode)
{
  let xmlDoc;
  if(vm.resType==1)//基础资源
  {
    try{
      xmlDoc = await loadPlayPromise(rCode);
    }catch(e){
      showErrorMessage("未返回负载地址！");
      closeDialog();
      return;
    }
  }
  if(vm.resType==3)//教师文件夹
  {
    try{
      xmlDoc = await loadPlayFilePromise(rCode);
    }catch(e){
      showErrorMessage("未返回负载地址！");
      closeDialog();
      return;
    }
  }
 var tempArra=parseLoadUrlJson(xmlDoc);
 if(tempArra&&tempArra.length>0)
 {
  var temp=tempArra[0];
  var tempUrl=temp.path;
  var tempName=temp.filePath;
  vm.playUrl=tempUrl;
  vm.fileName=tempName.substring(1,tempName.length);
 
 }
 else
 {
  var errMsg = parseErrorMsgJson(xmlDoc,rCode);
  showErrorMessage(errMsg);
  closeDialog();
 }

}

function loadPlaysPromise(rCode)
{  
   var params={"rcode":rCode,"userName":userName,"filterType":filterType,"outType":1};
   if(!vm.downloadFlag)
   {
    params.allowPcMain=1;//非下载时需要加上此参数
   }
   return new Promise((resolve, reject) => {
    resolve(request({url: batchDownloadUrl, method: 'get', data:params}) ) 
  })
}
function loadPlayFilesPromise(rCode)
{  
   var params={"ids":rCode,"outType":1,"jsonType":1};
   return new Promise((resolve, reject) => {
    resolve(request({url: fileDownloadUrl, method: 'get', data:params}) ) 
  })
}
async function loadPlays(rCode)
{
  let xmlDoc;
  if(vm.resType==1)//基础资源
  {
    try{
      xmlDoc = await loadPlaysPromise(rCode);
    }catch(e){
      showErrorMessage("未返回负载地址！");
      closeDialog();
      return;
    }
  }
  if(vm.resType==3)//教师文件夹
  {
    try{
      xmlDoc = await loadPlayFilesPromise(rCode);
    }catch(e){
      showErrorMessage("未返回负载地址！");
      closeDialog();
      return;
    }
  }
 var tempArra=parseLoadUrlJson(xmlDoc);
 if(tempArra&&tempArra.length>0)
 {
   for(var i=0;i<tempArra.length;i++)
   {
    var item={};
    var temp=tempArra[i];
    var tempUrl=temp.path;
    var tempName=temp.filePath;
    item.name=tempName.substring(1,tempName.length);
    item.url=tempUrl;
    vm.playItems.push(item);
    vm.playUrls.push(tempUrl);
    
   }
 
 }
 else
 {
	var errMsg = parseErrorMsgJson(xmlDoc,rCode);
  showErrorMessage(errMsg);
  closeDialog();
 }

}

function downLoadRes(rCode)
{
  vm.downloadFlag=true;
  //loadPlay(rCode);
  loadPlays(rCode);
}

function loadWkPromise(rCode)
{  
   var params={"rcode":rCode,"userName":userName,"ut":vm.ut};
   return new Promise((resolve, reject) => {
    resolve(request({url: wkDownloadUrl, method: 'get', data:params}) ) 
  })
}
async function loadWkInfo(rCode)
{
 // window.location.href=process.env.MICRO_BASE_PREFIX+"/user/resource/play/playView.action?rcode="+rCode+"&type=0"
  let data = await loadWkPromise(rCode);
  console.log(data.success)
  if(data.success)
  {
    if(data.path)
    {
      vm.playUrl=data.path;
      vm.fileName=data.filepath.substring(1,data.filepath.length);
    }
    else
    {
      showErrorMessage("未返回负载地址");
      closeDialog();
    }
  }
 else
 {
  showErrorMessage("未返回负载地址！");
  closeDialog();
 }

}

//兼容一下连接类型资源。
function newPlayResLinkType(rCode,linkType)
{
 if(linkType)
 {
   vm.linkType=linkType;
   if(linkType!=0)
   {
     playResAjaxLinkType(rCode);
   }
   else
   {
    loadInfoByRcode(rCode);
   }
 }else
 {
  loadInfoByRcode(rCode);
 }
}

async function playResAjaxLinkType(rCode)
{
  vm.linkFlag=true;
  let xmlDoc = await loadPlaysPromise(rCode);
  var tempArra=parseLoadUrlJson(xmlDoc);
  if(tempArra&&tempArra.length>0)
  {
    vm.playUrl=tempArra[0].path;
    //alert(tempArra[0].path)
    if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach()){
      VcomTeach.setWndSize(0,0,0,0) // 最大化
    }else{
      //window.open(tempArra[0].path)
      window.location.href=tempArra[0].path;
    }
  }
}

function loadPlayLivePromise(rCode)
{  
   var params={"rcode":rCode,"userName":userName};
   return new Promise((resolve, reject) => {
    resolve(request({url: loadLiveUrl, method: 'get', data:params}) ) 
  })
}
/**
 * 直播
 * @param {*} rCode 资源编码
 */
export async function loadPlayLive(rCode,self)
{
  vm=self;
  userName=vm.teacherNumber;
  let data = await loadPlayLivePromise(rCode);
  console.log("data=="+data)
  if(data&&data.result)
  {
    if(data.result=="1")
    {
      var url=data.url;
      if(url)
      {
        vm.playUrl=url;
        vm.fileName="课程直播";
        
      }
    }
    else if(data.result=="0")
    {
      showErrorMessage("直播负载错误，返回错误状态！");
      closeDialog();
    }
  }
  else
  {
    showErrorMessage("直播接口未返回");
    closeDialog();
  }

}
/**
 * 获取资源负载地址
 * @param {*} item 资源对象
 * rcode资源编码
 * resType1系统资源3教师文件夹5微课（本地微课为bdwk）
 * RFormatMark资源格式，链接类型为html
 * linkType 1 静态、2 仿真实验、3 数理画资源,4 对应本系统的rcode, 0默认 
 * linkValue 链接地址

 */
export async function getDownLoadUrl(item,self)
{
  vm = self;
  var rCode="";
  var resType="";
  var downUrl="";
  let xmlDoc;
  // if(item&& typeof item.RFormatMark != "undefined"&&item.RFormatMark=='html')//链接类型
  // {
  //   var data = await loadInfoByRcodePromise(item.rcode);
  //   var info = data.info;
  //   if(info.linkType==4)//链接资源库文件
  //   {
  //     var tempItem={};
  //     tempItem.rcode=info.linkValue;
  //     tempItem.resType=1;
  //     return await getDownLoadUrl(tempItem,self);
  //   }
  //   else
  //   {
  //     //downUrl=info.linkValue;
  //     try{
  //       xmlDoc = await loadPlayPromise(item.rcode);
  //     }catch(e){
  //       showErrorMessage("未返回负载地址！");
  //       return;
  //     }
  //   }
  // }
  // else
  // {
    rCode=item.rcode;
    resType=item.resType;
    if(resType==1)//系统资源
    {
      try{
        xmlDoc = await loadPlayPromise(rCode);
      }catch(e){
        showErrorMessage("未返回负载地址！");
        return;
      }
    }
    else if(resType==3)//教师文件夹
    {
      try{
        xmlDoc = await loadPlayFilesPromise(rCode);
      }catch(e){
        showErrorMessage("未返回负载地址！");
        return;
      }
    }
  //}
  var tempArra=parseLoadUrlJson(xmlDoc);
  if(tempArra&&tempArra.length>0)
  {
   var temp=tempArra[0];
   downUrl=temp.path;
  //  var tempName=temp.filePath;
  //  vm.playUrl=tempUrl;
  //  vm.fileName=tempName.substring(1,tempName.length);
  
  }
  else
  {
    var errMsg = parseErrorMsgJson(xmlDoc,rCode);
    showErrorMessage(errMsg);
  }
  return downUrl;
}
function closeDialog()
{
  if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach())
  {
    setTimeout("window.close();", 2000 );
  }
}
function showErrorMessage(msg)
{
  try{
    if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach()){
      VcomTeach.setWndSize(-1,-1,'50%','30%');
    }
    vm.$messageteach({type:"error",message:msg});
  }catch(e){
    vm.$messageteach.error(msg);
  }
}
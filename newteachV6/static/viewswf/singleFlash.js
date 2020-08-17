
function parseLoadUrlXml(xmlDoc)
{
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
         var newFlashFlag="";
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
           var tmp={"path":tmpUrl,"filePath":tmpFilepath,"newFlashFlag":newFlashFlag,"playFlag":playFlagValue,"remainTimes":remainTimesValue};
             tmpArra.push(tmp);
           
             
          }
         
        }
      }
    }
    return tmpArra;
}

//swf加载逻辑
function loadPlaySwf(rCode)
{
		
	flashArray=null;	
  var paramName={"rcode":rCode,"userName":userName,"filterType":0,"allowPcMain":1};
  ajaxXmlJKGet(batchDownloadUrl,paramName,loadPlaySwfA,loadPlaySwfB);
  // return new Promise((resolve, reject) => {
  //   resolve(request({url: batchDownloadUrl, method: 'get', data:paramName}) ) 
  // })
}

//swf加载逻辑body
function loadPlaySwfSID(rCode)
{
		
	flashArray=null;	
  var paramName={"rcode":rCode,"userName":userName,"filterType":0,"allowPcMain":1,"onlybody":1};
  ajaxXmlJKGet(batchDownloadUrl,paramName,loadPlaySwfA,loadPlaySwfB);
}

var flashIndex=0;
var flashArray;
function playFlashWrap(path,type,index)
{
flashIndex=index;
 if(type==0)
 {
 showCommonFash(path);
 }
 else
 {
 showFlexPager2(path);
 
 }
 //alert(flashIndex);
}

function loadPlaySwfB(error){}
function loadPlaySwfA(xmlDoc)
{
  //let xmlDoc= await loadPlaySwf(rcode);
flashIndex=0;
 var tempArra=parseLoadUrlXml(xmlDoc);
 flashArray=tempArra;
 $("#flashList").html("");
 var tmpHtml='';
 //var testUrl='http://rss1henan.czbanbantong.com:9000/material01/persionfile/1.1.1/410101999999/4101019999990002/musc/%C4%E3%BA%C3.swf?a=你好&b=朋友'
 //showFlexPager2(testUrl);
 //testUrl=encodeURIComponent(testUrl);
 //var  testClickStr='javascript:showFlexPager2("'+testUrl+'");';
 //tmpHtml+=' <li><a href=\''+testClickStr+'\'>测试</a>';
  if(tempArra&&tempArra.length>0)
  {
    for(var i=0;i<tempArra.length;i++)
    {
      var item=tempArra[i];
      if(item)
      {
      var tmpPath=item.path;
		var filePath=item.filePath;
         if(item.newFlashFlag&&item.newFlashFlag=="flexPager")
         {
        //var  tmpClickStr='showFlexPager2("'+tmpPath+'");';
        var tmpClickStr='playFlashWrap("'+tmpPath+'",1,'+i+');';
         if(i==0)
          {
          showFlexPager2(item.path);
          }
         }
         else
         {
         //  var  tmpClickStr='showCommonFash("'+tmpPath+'");';
             var tmpClickStr='playFlashWrap("'+tmpPath+'",0,'+i+');';
           if(i==0)
           {
           showCommonFash(item.path);
           }
         }
        if(filePath.length>1)
        {
         filePath=filePath.substring(1);
         var lastIndex=filePath.lastIndexOf(".");
         if(lastIndex>0)
         {
         filePath=filePath.substring(0,lastIndex);
         }
        }
        var tmpIcon=global_basePath+'/ext/resources/images/im2.gif';
         tmpHtml+='<li style=\'font-size: 12px;height: 20px;line-height: 20px;cursor: pointer;\' onclick=\''+tmpClickStr+'\' title=\''+filePath+'\'><IMG style=\'vertical-align: middle;\' src=\''+tmpIcon+'\'>'+filePath.substring(0,14)+'</li>';
      
       }
    }
   
  $("#flashList").html(tmpHtml);
  try{
  showViewPort();
  }catch(e){}
  }

}
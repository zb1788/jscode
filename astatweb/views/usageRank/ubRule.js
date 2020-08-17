var table;
var starttime = getWeekStart(0).split("-").join("");
var nowtime = getDateStr3(new Date()).split("-").join("");
var school_id = getParam("school_id");
var usertype = getParam("usertype");
var endtime = getDateStr3(new Date()).split("-").join("");

$(function() {// 初始化内容
	var url = furl + warName + "/getUbRule?school_id="+school_id+"&usertype="+usertype;
	getUbName();
	setTable(url);
	
});

function setTable(url){
  layui.use('table', function(){
  table = layui.table;
  
  table.render({
    elem: '#tableList'
    ,url:url
    ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
    ,cols: [[
		{field:'action', title: '项目'}
      ,{field:'reward_info', title: '额度'}
      ,{field:'rewardnum_day',title: '每日上限次数',templet:function(d){
		  if(d.rewardnum_day == 0){
			return '无限制'
		  }else{
			return d.rewardnum_day;  
		  }
		  
	  }}
	  ,{field:'remark',minWidth: 300, title: '说明'}
    ]]
	,done:function(res){
        tdTitle();
    }
  });
});
}

/** 
 * 获取指定的URL参数值 
 * URL:http://www.quwan.com/index?name=tyler 
 * 参数：paramName URL参数 
 * 调用方法:getParam("name") 
 * 返回值:tyler 
 */ 
function getParam(paramName) { 
    paramValue = "", isFound = !1; 
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) { 
        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0; 
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++ 
    } 
    return paramValue == "" && (paramValue = null), paramValue 
}

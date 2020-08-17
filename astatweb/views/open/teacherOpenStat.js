var table;
var starttime = getWeekStart(0).split("-").join("");
var nowtime = getDateStr3(new Date()).split("-").join("");
var school_id = getParam("school_id");
var endtime = getDateStr3(new Date()).split("-").join("");


$(function() {// 初始化内容
	setTitle();
	var url = furl + warName + "/getOpenTeacherList?school_id="+school_id+"&starttime="+starttime+"&endtime="+endtime;
	setTable(url);
	
});
function setTable(url){
  layui.use('table', function(){
  table = layui.table;
  
  table.render({
    elem: '#tableList'
    ,url:url
    ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
	,page: true //开启分页
    ,cols: [[
		{field:'xh', title: '序号',type:'numbers'}
	  ,{field:'org_name', title: '机构/教研组'}
      ,{field:'regist_persons', title: '注册人数'}
      ,{field:'active_persons', title: '激活人数'}
	  ,{field:'rate', title: '激活率',templet:function(d){
		  return d.rate+'%';
	  }}
    ]]
	,done:function(res){
        tdTitle();
    }
	,limit: 10
	,limits:[10,30,50,100,200,300,500]
  });
});
}
function setTitle(){
	var url = furl + warName + "/getUserActive?school_id="+school_id;
	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		success: function(data){
			var zc = data[0].UserActiveInfo.teacherNum;
			var jh = data[0].UserActiveInfo.loginteacherTimes;
			var jhl = "0%";
			if(zc != 0){
				jhl=Math.round(jh/zc * 100) + "%"
			}
			
			$("#zc").text(zc);
			$("#jh").text(jh);
			$("#jhl").text(jhl);	
		}
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
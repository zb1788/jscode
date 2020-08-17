var table;
var starttime = getWeekStart(0).split("-").join("");
var nowtime = getDateStr3(new Date()).split("-").join("");
var school_id = getParam("school_id");
var endtime = getDateStr3(new Date()).split("-").join("");


$(function() {// 初始化内容
	var url = furl + warName + "/getOpenTeacherDetailList?school_id="+school_id;
	setTable(url);
	setSelect("");
	
});
function setSelect(code){
	$.ajax({
		url:furl + warName+ "/getGtList?school_id="+school_id,
		type:"GET",
		dataType:"json",
		success:function(result){
			var list = result;    //返回的数据
			
			var gtList = document.getElementById("gtList"); //server为select定义的id
			
			for(var p in list){
				var option = document.createElement("option");  // 创建添加option属性
				option.setAttribute("value",list[p].gt_id); // 给option的value添加值
				option.innerText=list[p].gt_name;     // 打印option对应的纯文本 
				gtList.appendChild(option);           //给select添加option子标签
				layui.use('form', function(){
					var form = layui.form;
					form.render("select");            // 刷性select，显示出数据
				});
			}
		}
	});	
}
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
		,{field:'truename', title: '用户姓名'}
      ,{field:'username', title: '账号'}
	  ,{field:'contact_number', title: '手机号'}
	  ,{field:'org_name', title: '机构/教研组'}
      ,{field:'create_time', title: '注册时间'}
      ,{field:'active_time', title: '激活时间'}
    ]]
	,done:function(res){
        tdTitle();
    }
	,limit: 10
	,limits:[10,30,50,100,200,300,500]
  });
});
}


function search(){
	var url=getSearchUrl("getOpenTeacherDetailList");
	setTable(url);
}
   //导出
function excl_rep(){

	var url=getSearchUrl("getOpenTeacherDetailListExport");
	
	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		success: function(data){
			
			layui.use(['excel'], function() {
				var excel = layui.excel;

				// 如果数据量特别大，最好直接传入 AOA 数组，减少内存/CPU消耗
				var dataA = [
				  ['用户姓名','账号','手机号','机构/教研组','注册时间','激活时间']
				];
				if(data.data.length > 0){
					for(var i=0;i<data.data.length;i++){
						dataA.push([
						  data.data[i].truename,
						  data.data[i].username,
						  data.data[i].contact_number,
						  data.data[i].org_name,
						  data.data[i].create_time,
						  data.data[i].active_time
						]);
					}
				}
				excel.exportExcel({
				  sheet1: dataA
				}, '导出数据.xlsx', 'xlsx');
			});
		}
	});
}
function getSearchUrl(method){
	var search = $("#search").val();
	search = encodeURI(encodeURI(search));
	var gtId = $("#gtList option:selected").val();
	var jhqk = $("#jhqkList option:selected").val();
	var url=furl + warName+"/"+ method +"?school_id="+school_id+"&gtId=" + gtId + "&search=" + search + '&jhqk=' + jhqk;
	return url;
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
var table;
var starttime = getWeekStart(0).split("-").join("");
var nowtime = getDateStr3(new Date()).split("-").join("");
var school_id = getParam("school_id");
var endtime = getDateStr3(new Date()).split("-").join("");

$(function() {// 初始化内容
	var url = furl + warName + "/getTeacherRankList?school_id="+school_id+"&starttime="+starttime+"&endtime="+endtime;
	
	getUbName();
	setTable(url);
	setTime();
	setSelect("");
	
});

function setTime(){
	layui.use('laydate', function(){
  var laydate = layui.laydate;
  
  //执行一个laydate实例
  laydate.render({
    elem: '#starttime' //指定元素
	,min: '2018-01-01'
	,value:getWeekStart(0)
	,isInitValue: true
  });
});
layui.use('laydate', function(){
  var laydate = layui.laydate;
  
  //执行一个laydate实例
  laydate.render({
    elem: '#endtime' //指定元素
	,min: '2018-01-01'
	,value:getDateStr3(new Date())
  });
});
	$("#starttime").attr("disabled","disabled");
	$("#endtime").attr("disabled","disabled");
	$("#starttime").attr("style","border:none; color:#666; padding:0; width:80px;");
	$("#endtime").attr("style","border:none; color:#666; padding:0; width:80px;");
}

function setBZ(){
	$("#starttime").removeAttr("disabled");
	$("#endtime").removeAttr("disabled");
	$("#starttime").val(getWeekStart(0));
	$("#endtime").val(getDateStr3(new Date()));
	$("#starttime").attr("disabled","disabled");
	$("#endtime").attr("disabled","disabled");
	$("#starttime").attr("style","border:none; color:#666; padding:0; width:80px;");
	$("#endtime").attr("style","border:none; color:#666; padding:0; width:80px;");
}
function setBy(){
	$("#starttime").removeAttr("disabled");
	$("#endtime").removeAttr("disabled");
	$("#starttime").val(getMonthStart(0));
	$("#endtime").val(getMonthEnd(0));
	$("#starttime").attr("disabled","disabled");
	$("#endtime").attr("disabled","disabled");
	$("#starttime").attr("style","border:none; color:#666; padding:0; width:80px;");
	$("#endtime").attr("style","border:none; color:#666; padding:0; width:80px;");
}
function setBxq(){
	$("#starttime").removeAttr("disabled");
	$("#endtime").removeAttr("disabled");
	$("#starttime").removeAttr("style");
	$("#endtime").removeAttr("style");
	$("#starttime").val(getDateStr3(new Date()));
	$("#endtime").val(getDateStr3(new Date()));

}
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
  $("#rule").text(ub_name+"规则");
  $("#UbTitle").text("教师"+ub_name+"排行榜");
  table.render({
    elem: '#tableList'
    ,url:url
    ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
	,page: true //开启分页
    ,cols: [[
		{align: 'center',colspan:3, title:'总概况'}
		,{align: 'center',colspan:2, title:'空间获取'+ub_name+'数'}
		,{align: 'center',colspan:2, title:'授课获取'+ub_name+'数'}
		,{align: 'center',colspan:2, title:'作业获取'+ub_name+'数'}
		,{align: 'center',colspan:2, title:'师生互动获取'+ub_name+'数'}
		,{field:'other_ub', title:'其他',rowspan:2}
	],[
		{field:'xh', title: '序号',type:'numbers'}
	  ,{field:'truename', title: '用户姓名'}
      ,{field:'ub_sum', title: ub_name+'值'}
      ,{field:'login_ub', title: '空间登录'}
	  ,{field:'ub_share_sum', title: '共享授课包'}
      ,{field:'tlslogin_ub', title: '授课登录'}
	  ,{field:'train_ub', title: '互动答题'}
      ,{field:'hw_ub', title: '布置作业'}
	  ,{field:'goodwork_ub', title: '作业评优'}
      ,{field:'tuijian_ub', title: '推荐及表扬'}
	  ,{field:'study_ub', title: '自主学习'}
    ]]
	,done: function(res, curr, count){
		tdTitle();
		if(res.data.length > 0){
			var dyUb = res.data[0].ub_sum;
			var dyName = res.data[0].truename;
			$("#dyUb").text(dyUb);
			$("#dyName").text(dyName);
			$("#drUb").text("");
			$("#drName").text("");
			$("#dsUb").text("");
			$("#dsName").text("");	
		}
		if(res.data.length > 1){
			var drUb = res.data[1].ub_sum;
			var drName = res.data[1].truename;
			$("#drUb").text(drUb);
			$("#drName").text(drName);
			$("#dsUb").text("");
			$("#dsName").text("");	
		}
		if(res.data.length > 2){
			var dsUb = res.data[2].ub_sum;
			var dsName = res.data[2].truename;
			$("#dsUb").text(dsUb);
			$("#dsName").text(dsName);	
		}

	}
	,limit: 10
	,limits:[10,30,50,100,200,300,500]
  });
});
}
function search(){
	var url=getSearchUrl("getTeacherRankList");
	setTable(url);
}
   //导出
function excl_rep(){

	var url=getSearchUrl("getTeacherRankListExport");
	
	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		success: function(data){
			
			layui.use(['excel'], function() {
				var excel = layui.excel;

				// 如果数据量特别大，最好直接传入 AOA 数组，减少内存/CPU消耗
				var dataA = [
				  ['用户姓名',ub_name+'值','空间登录','共享授课包','授课登录','互动答题','布置作业','作业评优','推荐及表扬','自主学习','其他']
				];
				if(data.data.length > 0){
					for(var i=0;i<data.data.length;i++){
						dataA.push([
						  data.data[i].truename,
						  data.data[i].ub_sum.toString(),
						  data.data[i].login_ub.toString(),
						  data.data[i].ub_share_sum.toString(),
						  data.data[i].tlslogin_ub.toString(),
						  data.data[i].train_ub.toString(),
						  data.data[i].hw_ub.toString(),
						  data.data[i].goodwork_ub.toString(),
						  data.data[i].tuijian_ub.toString(),
						  data.data[i].study_ub.toString(),
						  data.data[i].other_ub.toString()
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
	var starttime = $("#starttime").val().split("-").join("");
	var endtime = $("#endtime").val().split("-").join("");
	var gtId = $("#gtList option:selected").val();
	var url=furl + warName+"/"+ method +"?school_id="+school_id+"&starttime=" + starttime + "&endtime=" + endtime + "&gtId=" + gtId + "&search=" + search;
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
function getUbRule(){
	layui.use(['layer'], function(){
		var layer = layui.layer;
		 
		layer.open({
          title: ub_name+'规则'
          ,area: ['800px', '400px']
		  ,fixed: false //不固定
          ,tipsMore: true
		  ,type: 2
          ,content: furl + viewName+'/views/usageRank/ubRule.html?school_id='+school_id+'&usertype=2'
          
        });
	});
}
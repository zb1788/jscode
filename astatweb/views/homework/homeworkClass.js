var table;
var starttime = getWeekStart(0).split("-").join("");
var nowtime = getDateStr3(new Date()).split("-").join("");
var school_id = getParam("school_id");
var endtime = getDateStr3(new Date()).split("-").join("");
var myChart;
var myCharts1;
var orderBy = "";

$(function() {// 初始化内容
	var url = furl + warName + "/getZYClazzList?school_id="+school_id+"&starttime="+starttime+"&endtime="+endtime;
	setTable(url);
	setTime();
	//setSelect("");
	echartBK();
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
		{field:'xh', title: '排名',type:'numbers'}
	  ,{field:'grade_name', title: '年级名称', sort: true}
      ,{field:'class_name', title: '班级名称', sort: true}
	  ,{field:'teacher_name', title: '班主任', sort: true}
      ,{field:'hw_times', title: '作业次数'}
      ,{field:'person_times', title: '参与人次'}
      ,{field:'finish_times', title: '完成人次'}
	  ,{field:'finish_rate', title: '完成率',sort: true,templet:function(d){
		  return d.finish_rate+'%';
	  }}
    ]]
	,done:function(res){
        tdTitle();
    }
	,limit: 10
	,limits:[10,30,50,100,200,300,500]
  });
    //监听排序事件 
	table.on('sort(test-table-thead1)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
	  //console.log(obj.field); //当前排序的字段名
	  //console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
	  //console.log(this); //当前排序的 th 对象
	  //console.log(obj); 
	  if(null != obj.type & "null" != obj.type){
		orderBy = obj.field + " " + obj.type; 
	  }
	  //尽管我们的 table 自带排序功能，但并没有请求服务端。
	  //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
	  table.reload('tableList', {
		initSort: obj //记录初始排序，如果不设的话，将无法标记表头的排序状态。
		,url: getSearchUrl("getZYClazzList")
		,where: { //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
		  //field: obj.field //排序字段
		  //,order: obj.type //排序方式
		}
	  });
	});
});
}
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

function search(){
	var url=getSearchUrl("getZYClazzList");
	setTable(url);
}
   //导出
function excl_rep(){

	var url=getSearchUrl("getZYClazzListExport");
	
	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		success: function(data){
			
			layui.use(['excel'], function() {
				var excel = layui.excel;

				// 如果数据量特别大，最好直接传入 AOA 数组，减少内存/CPU消耗
				var dataA = [
				  ['年级','班级','班主任','作业次数','参与人数','完成人数','完成率']
				];
				if(data.data.length > 0){
					for(var i=0;i<data.data.length;i++){
						dataA.push([
						  data.data[i].grade_name,
						  data.data[i].class_name,
						  data.data[i].teacher_name,
						  data.data[i].hw_times.toString(),
						  data.data[i].person_times.toString(),
						  data.data[i].finish_times.toString(),
						  data.data[i].finish_rate.toString()+"%"
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
	//var gtId = $("#gtList option:selected").val();
	var url=furl + warName+"/"+ method +"?school_id="+school_id+"&starttime=" + starttime + "&endtime=" + endtime + "&search=" + search + "&orderBy=" + orderBy;
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


	function echartBK() {
	
		/** 折线图（echarts设置） start */	
		myChart = echarts.init(document.getElementById("Day"));
		var dataX=[];
		var dataY=[];
		var dataZ=[];
		var	option = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:['发布作业量','完成人次']
				},
				color:['#76acff','#ff827c','#f8ce3d','#28d752'],
				toolbox: {
					show : false,
					feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						magicType : {show: true, type: ['line', 'bar']},
				
				restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				calculable : true,
				xAxis : [
					{
						type : 'category',
						data : dataX
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name:'发布作业量',
						type:'bar',
						data:dataY,
						markPoint : {
							data : [
								{type : 'max', name: '最大值'},
								{type : 'min', name: '最小值'}
							]
						},
						markLine : {
							data : [
								{type : 'average', name: '平均值'}
							]
						}
					},
					{
						name:'完成人次',
						type:'bar',
						data:dataZ,
						markPoint : {
							data : [
								{type : 'max', name: '最大值'},
								{type : 'min', name: '最小值'}
							]
						},
						markLine : {
							data : [
								{type : 'average', name : '平均值'}
							]
						}
					}
				]
			};			

			$.ajax({
				url: furl + warName + "/getZYClazzTimesList",
				type: "post",
				data: {"school_id":school_id,"starttime":starttime,"endtime":endtime},
				datatype: "json",
				success: function (res) {

					for(var i in res[0].data){
						dataX.push(res[0].data[i].class_name);
						dataY.push(res[0].data[i].hw_times);
						dataZ.push(res[0].data[i].finish_times);
					}
					myChart.setOption(option);
				}
			})
		 /**折线图（echarts设置） end */		
		
		/** 折线图（echarts设置） start */	
		myCharts1 = echarts.init(document.getElementById('Day1'));
		var dataA=[];
		var dataB=[];
		var dataC=[];
		var option1 = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:['参与人次','完成人次']
				},
				color:['#76acff','#ff827c','#f8ce3d','#28d752'],
				toolbox: {
					show : false,
					feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						magicType : {show: true, type: ['line', 'bar']},
				
				restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				calculable : true,
				xAxis : [
					{
						type : 'category',
						data : dataA
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name:'参与人次',
						type:'bar',
						data:dataB,
						markPoint : {
							data : [
								{type : 'max', name: '最大值'},
								{type : 'min', name: '最小值'}
							]
						},
						markLine : {
							data : [
								{type : 'average', name: '平均值'}
							]
						}
					},
					{
						name:'完成人次',
						type:'bar',
						data:dataC,
						markPoint : {
							data : [
								{type : 'max', name: '最大值'},
								{type : 'min', name: '最小值'}
							]
						},
						markLine : {
							data : [
								{type : 'average', name : '平均值'}
							]
						}
					}
				]
			};
		
		$.ajax({
				url: furl + warName + "/getZYClazzFinishTimesList",
				type: "post",
				data: {"school_id":school_id,"starttime":starttime,"endtime":endtime},
				datatype: "json",
				success: function (res) {
					for(var i in res[0].data){
						dataA.push(res[0].data[i].class_name);
						dataB.push(res[0].data[i].person_times);
						dataC.push(res[0].data[i].finish_times);
					}
				myCharts1.setOption(option1);
				}
			})
		/** 折线图（echarts设置） end */		   
	}
/** 
 * 设置监听事件，当浏览器变化时，重新绘制折现图和饼图，控制图形大小兼容浏览器大小。
 */ 
window.addEventListener("resize",function(){              
        myChart.resize();
		myCharts1.resize();
});

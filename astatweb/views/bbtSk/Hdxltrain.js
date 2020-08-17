var table;
var starttime = getWeekStart(0).split("-").join("");
var nowtime = getDateStr3(new Date()).split("-").join("");
var school_id = getParam("school_id");
var endtime = getDateStr3(new Date()).split("-").join("");
var myChart;
var myCharts1;
var orderBy = "";

$(function() {// 初始化内容
	var url = furl + warName + "/getHdxlList?school_id="+school_id+"&starttime="+starttime+"&endtime="+endtime;
	setTable(url);
	setTime();
	setSelect("");
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
		{field:'xh', title: '序号',type:'numbers'}
      ,{field:'time', title: '训练时间', sort: true}
	  ,{field:'teachername', title: '教师姓名', sort: true}
      ,{field:'name', title: '训练名称'}
      ,{field:'questions_num', title: '习题个数'}
      ,{field:'class_name', title: '训练班级'}
	  ,{field:'accuracy_rate', title: '得分率',sort: true,templet:function(d){
		  return d.accuracy_rate+'%';
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
		,url: getSearchUrl("getHdxlList")
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

function search(){
	var url=getSearchUrl("getHdxlList");
	setTable(url);
}
   //导出
function excl_rep(){

	var url=getSearchUrl("getHdxlListExport");
	
	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		success: function(data){
			
			layui.use(['excel'], function() {
				var excel = layui.excel;

				// 如果数据量特别大，最好直接传入 AOA 数组，减少内存/CPU消耗
				var dataA = [
				  ['训练时间','教师姓名','训练名称','习题个数','训练班级','得分率']
				];
				if(data.data.length > 0){
					for(var i=0;i<data.data.length;i++){
						dataA.push([
						  data.data[i].time,
						  data.data[i].teachername,
						  data.data[i].name,
						  data.data[i].questions_num.toString(),
						  data.data[i].class_name,
						  data.data[i].accuracy_rate.toString()+"%"
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
	var url=furl + warName+"/"+ method +"?school_id="+school_id+"&starttime=" + starttime + "&endtime=" + endtime + "&gtId=" + gtId + "&search=" + search + "&orderBy=" + orderBy;
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
		var option = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:['教师人数']
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
						name:'教师人数',
						type:'line',
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
					}	
				]
			};
 
			$.ajax({
				url: furl + warName + "/getHdxlDayList",
				type: "post",
				data: {"school_id":school_id,"starttime":starttime,"endtime":endtime},
				datatype: "json",
				success: function (res) {
					for(var i in res[0].list){
						dataX.push(res[0].list[i].time);
						dataY.push(res[0].list[i].times);
					}
				$("#HdxlCount").text(res[1].HdxlCount);
				myChart.setOption(option);
				}
			})
		/** 折线图（echarts设置） end */		
		
		/** 饼图（echarts设置） start */	
		myCharts1 = echarts.init(document.getElementById('Day1'));
		var dataA=[];
		var option1 = {
		  legend: {
            // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
            orient: 'vertical',
            // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
            x: 'right',
            // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
            y: 'center',
            // itemGap设置各个item之间的间隔，单位px，默认为10，横向布局时为水平间隔，纵向布局时为纵向间隔
            itemGap: 30,
            backgroundColor: '#eee',  // 设置整个图例区域背景颜色
            data: ['使用互动训练的教师','未使用互动训练的教师']
          },
		  color:['#76acff','#ff827c','#f8ce3d','#28d752'],
		  toolbox: {
			show : false,
			feature : {
				mark : {show: true},
				dataView : {show: true, readOnly: false},
				magicType : {
					show: true, 
					type: ['pie', 'funnel'],
					option: {
						funnel: {
							x: '25%',
							width: '50%',
							funnelAlign: 'left',
							max: 1548
						}
					}
				},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		 calculable : false,
		  series: [
            {
              name: '互动训练情况',
              type: 'pie',
              // radius: '50%',  // 设置饼状图大小，100%时，最大直径=整个图形的min(宽，高)
              radius: ['30%', '60%'],  // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
              center: ['40%', '60%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
              data: dataA,//[{value:2,name:'使用在线备课教师'},{value:13,name:'未使用在线备课教师'}],
              // itemStyle 设置饼状图扇形区域样式
              itemStyle: {
                // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
                // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(30, 144, 255，0.5)'
                }
              },
              // 设置值域的那指向线
              labelLine: {
                normal: {
                  show: false   // show设置线是否显示，默认为true，可选值：true ¦ false
                }
              },
              // 设置值域的标签
              label: {
                normal: {
                  position: 'inner',  // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                  // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
                  // {a}指series.name  {b}指series.data的name
                  // {c}指series.data的value  {d}%指这一部分占总数的百分比
                  formatter: '{c}'
                }
              }
            }
          ],
			tooltip: {
            // trigger 设置触发类型，默认数据触发，可选值：'item' ¦ 'axis'
            trigger: 'item',
            // formatter设置提示框显示内容
            // {a}指series.name  {b}指series.data的name
            // {c}指series.data的value  {d}%指这一部分占总数的百分比
            formatter: '{a} <br/>{b} : {c}人 ({d}%)'
          }
		  
		};
		
		$.ajax({
				url: furl + warName + "/getHdxlRate",
				type: "post",
				data: {"school_id":school_id,"starttime":starttime,"endtime":endtime},
				datatype: "json",
				success: function (res) {
					var tmp1 ="{value:"+res[0].HdxlCount+",name:'使用互动训练的教师'}";
					var tmp2 ="{value:"+res[1].unHdxlCount+",name:'未使用互动训练的教师'}";
					dataA.push(eval('(' + tmp1 + ')'));
					dataA.push(eval('(' + tmp2 + ')'));
					myCharts1.setOption(option1);		
				}
			})
		/** 饼图（echarts设置） end */		   
	}
/** 
 * 设置监听事件，当浏览器变化时，重新绘制折现图和饼图，控制图形大小兼容浏览器大小。
 */ 
window.addEventListener("resize",function(){              
        myChart.resize();
		myCharts1.resize();
});

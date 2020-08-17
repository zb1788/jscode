export default {
/**
 * 获取历史用户列表
 * 对象格式：{"name":"张博","inputname":"155123564","account":"41010100010128","pwd":"123456","photo":""}]
 */
getHistoryData(){
        //let historyStr = localStorage.getItem("historyDatas");
        let historyStr = this.getFromDataBase();
        console.log("历史用户字符串："+historyStr);
        if(historyStr!=null){
            let rs = decodeURI(historyStr);
            let ro = JSON.parse(rs);
            return ro;
            
        }
        return [];
},
/**
 * 查找对应账号数据位置
 * @param {*} historyArray 
 * @param {*} username 
 */
getHistoryDataIndex(historyArray,username){
    //判断用户是否已存在,存在则删除已存在的
    for(let hi=0;hi<historyArray.length;hi++){
        if(username==historyArray[hi].account){
            return hi;
        }
    }
    return -1;
},
/**
 * 添加历史用户，超过10个会删除末尾的数据
 * @param {} historyDatas historyDataArray 
 * @param {"name","inputname","account","pwd","photo"} aHistoryData 
 */
addHistoryData(historyDatas,adata){
const maxLength=8;
    //判断用户是否已存在,存在则删除已存在的
	for(let hi=0;hi<historyDatas.length;hi++){
		if(adata.account==historyDatas[hi].account){
			historyDatas.splice(hi,1);//删除已存在的数据后面加入新的
			break;
		}
	}
    //删除超长的(10个)
    if(historyDatas.length>=maxLength){
        historyDatas.pop();
    }
    
    historyDatas.unshift(adata);
    
    return historyDatas;
},
delHistoryData(historyDatas,hi){
    
    historyDatas.splice(hi,1);//删除对应位置
    
    return historyDatas;
},
/**
 * 保存历史用户列表
 * @param {} historyDatas 
 */
saveHistoryData(historyDatas){
    let dataStr=JSON.stringify(historyDatas);
    console.log("保存历史："+dataStr);
    dataStr=encodeURI(dataStr);
    this.upOrSaveDataBase(dataStr);
    
    //localStorage.setItem("historyDatas",JSON.stringify(historyDatas));
},
getFromDataBase(){
    try{
        let r = VcomTeach.execSelect("select str_value from teachui_table where vid='historyDatas';","1");
        console.log("查询历史用户表teachui_table返回："+r);
        let rArr=JSON.parse(r);
        if(rArr.length>0 && rArr[0].length>0){
            return rArr[0][0];
        }
        return null;
    }catch(e){
        console.log(e);
        console.log("获取历史用户失败！控件异常？？");
    }
},upOrSaveDataBase(dataStr){
    try{
        let data=VcomTeach.execSelect("select str_value from teachui_table where vid='historyDatas';","1");
        let r=false;
        let rArr=null;
        if(typeof(data)!="undefined" && data!=null){
        try{
            rArr=JSON.parse(data);
        }catch(e){}
        }
        if(rArr!=null && rArr.length>0){
            console.log("update History User Data:"+dataStr);
            r=VcomTeach.execDML("update teachui_table set str_value='"+dataStr+"' where vid='historyDatas';");
            VcomTeach.commitFile('database')
        }else{
            console.log("insert History User Data:"+dataStr);
            r=VcomTeach.execDML("insert into teachui_table(vid,str_value,remark2) values ('historyDatas','"+dataStr+"','历史用户');");
            VcomTeach.commitFile('database')
        }
        if(r){
            console.log("保存历史用户成功！");
        }
    }catch(e){
        console.log("保存历史用户失败！控件异常？？"+e.message);
    }
}
};
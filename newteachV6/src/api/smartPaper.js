import commonUtils from '@/utils/common'
import { getStudentListByClassNew , bindSmartPaper } from '@/api/interface'
import storage from '@/utils/storage'
import {TLS_RESET_WHITE_MAC} from '@/api/constant'
let paperKeyArray = ["A","B","C","D","E","F","G"]
let baseKeyArr = []



/**
 * 获取学生名单
 */
export async function getStudentListByClassData(self){ 

    let result = await getStudentListByClassNew(self.classId,self.teacherComputerMac,1)
    console.log(result)
    if(result.code != '200'){
        self.$messageteach.error('获取学生列表失败')
        return fasle
    }
    let res = result.data
    let arr = []

    let smartPaperBindType = 0
    //手写板绑定模式 0 手写板未启用 1 按号领取  2 绑定用户
    if(res.smartPaperBindType == 0){
        //手写板未启用按照字母绑定
        smartPaperBindType = 2
    }else{
        smartPaperBindType = res.smartPaperBindType
    }

    if(smartPaperBindType == 2){
        //字母绑定才分配字母
        for(let i=1;i<5;i++){
            generateString("", i,self);
        }
    }else{
        self.isShowLeft = true
    }

    self.baseKeyArr = baseKeyArr

    let studentByKey = []
    for(let [index,stu] of res.rtnArray.entries()){
        let obj = {}
		obj.studentNumber = stu.studentNumber; 
        obj.smartPaperMac = stu.smartPaperMac; //mac
        obj.smartPaperGetNumber = stu.smartPaperGetNumber //编号
        obj.smartPaperOrder = stu.smartPaperOrder //序号
        obj.smartPaperIdNumber = stu.smartPaperIdNumber //序列号
		obj.realname = stu.realname;
        
        obj.styleTheme = ''//默认离线图标
        if(stu.smartPaperMac == ''){
            //未绑定按钮
            obj.styleTheme = 'cur'
        }else{
            //离线按钮
            obj.styleTheme = ''
            self.macIndex['"' + stu.smartPaperMac + '"'] = index
        }

        obj.bindNum = self.baseKeyArr[index] //给每个学生分配一个字母
        studentByKey[self.baseKeyArr[index]] = stu.studentNumber //设置字母和帐号的对应关系

        if(smartPaperBindType == 2){
            //字母绑定
            obj.disabled = false
        }else{
            //序号绑定
            if(stu.smartPaperMac == ''){
                obj.disabled = true //是否可以选中
            }else{
                obj.disabled = false //是否可以选中
            }            
        }

        self.studentIndex.set(stu.studentNumber,index)
        arr.push(obj)
    }    

    
    //更新map
    self.studentIndex = new Map(self.studentIndex)
    self.studentByKey = studentByKey

    console.log(self.studentByKey)


    self.smartPaperBindType = smartPaperBindType*1
    self.studentList = arr
    self.smartPapersBackup = res.smartPapersBackup.sort(sortBySmartPaperNumber)
    checkStatus(self)
}



export function OnGetKeys(self){
    try{
        //回调函数获取用户按键内容( id位mac，keys为ABCD)
        VcomTeach.bindingEvent("PaperGetKeys",async function(mac, keys){
            commonUtils.console('原始mack|key：',mac,keys)
            //先替换G为F，后替换H为G，顺序不能错
            keys = keys.replace("G","F").replace("H","G");
            commonUtils.console('替换后mack|key：',mac,keys)


            //如果获取不到学生名单就停止
            if(self.studentList.length == 0){
                return false
            }

            let studentNumber = self.studentByKey[keys];

            if(typeof studentNumber != 'undefined'){

                if(typeof self.macIndex['"' + mac + '"'] != 'undefined'){
                    if(studentNumber == self.studentList[self.macIndex['"' + mac + '"']].studentNumber){
                        checkStatus(self)
                        return false
                    }
                }

                storage.set(TLS_RESET_WHITE_MAC,1)
                self.macChange = true

                let res = await bindSmartPaper(studentNumber,self.classId,self.schoolId,mac,self.teacherComputerMac,self.ut)
                if(res.bindResult == 1){
                    //先解绑
                    if(typeof self.macIndex['"' + mac + '"'] != 'undefined'){
                        var stu = self.studentList[self.macIndex['"' + mac + '"']]
                        
                        self.studentList[self.macIndex['"' + mac + '"']].smartPaperMac ='' //老mac置空
                        self.studentList[self.macIndex['"' + mac + '"']].styleTheme ='' //状态改为未连接
                        
                        delete self.macIndex['"' + mac + '"'] //从mac数组中删除
                    }

                    //再绑定
                    var stu = self.studentList[self.studentIndex.get(studentNumber)]
                    
                    delete self.macIndex['"' + stu.smartPaperMac + '"'] //从mac数组中删除老的
                    self.macIndex['"' + mac + '"'] = self.studentIndex.get(studentNumber) //往mac数组中加新的

                    self.studentList[self.studentIndex.get(studentNumber)].styleTheme ='no' //状态改为已绑定
                    self.studentList[self.studentIndex.get(studentNumber)].smartPaperMac = mac;//设置当前学生对应的平板mac   
                }else{
                    if(res.bindResultInfo != '抱歉，您绑定的设备不是手写板'){
                        self.$messageteach.error(res.bindResultInfo)
                    }
                    
                }
            }
            checkStatus(self)
        })
    }catch(e){

    }
}





//获取手写上线/下线状态
export function OnGetOnlineMacs(self){
    try{
        //回调函数获取连接上的手写板mac,type1:连接，0：断开
        VcomTeach.bindingEvent("PaperGetOnlineMacs",function(mac,type){
            console.log(mac+"|"+type)
            //如果获取不到学生名单就停止
            if(self.studentList.length == 0){
                return false
            }

            if(!self.isStart){
                //开始绑定就不过滤数据了
                //新增，如果不在白名单的数据直接抛弃
                if(typeof self.macIndex['"' + mac + '"'] == 'undefined'){
                    return false
                }
            }


            if(type == 1){
                if(self.searchDevArr.indexOf(mac) == -1){
                    self.searchDevArr.push(mac)
                }
                
                if(findEleInArr(mac,self.OnlineMacArr) == -1){
                    self.OnlineMacArr.push(mac)
                }
        
                if(typeof self.macIndex['"' + mac + '"'] != 'undefined'){
                    self.studentList[self.macIndex['"' + mac + '"']].styleTheme ='no' //状态改为在线
                }
            }else{
                let index = self.searchDevArr.indexOf(mac)
                if(index != -1){
                    self.searchDevArr.splice(index,1)
                }
                if(findEleInArr(mac,self.OnlineMacArr) == -1){
                    return false;
                }
                self.OnlineMacArr.splice(findEleInArr(mac,self.OnlineMacArr),1);
                if(typeof self.macIndex['"' + mac + '"'] != 'undefined'){
                    self.studentList[self.macIndex['"' + mac + '"']].styleTheme ='' //状态改为离线
                }
            }
            checkStatus(self)
            console.log(self.searchDevArr)
        })    
    }catch(e){

    }
}

/**
 * 跟新连接、未连接、未绑定
 * @param {*} self 
 */
export function checkStatus(self){
    let connectArr = self.studentList.filter(item => item.styleTheme == 'no')
    let noConnectArr = self.studentList.filter(item => item.styleTheme == '')
    let unbindArr = self.studentList.filter(item => item.styleTheme == 'cur')
    self.statusCountArr[0].num = connectArr.length
    self.statusCountArr[1].num = noConnectArr.length
    self.statusCountArr[2].num = unbindArr.length    
}

/**
 * 设置白名单
 * @param {*} macIndex 所有的mac
 */
export function setWhiteMac(macIndex){    
    let macList = Object.keys(macIndex).join(',').replace(/"/g,"");
    commonUtils.console('设置白名单',macList)
	try{
		VcomPaper.SetNewList(macList);
	}catch (e) {
		commonUtils.console(e,'设备白名单失败');
	}    
}


export function sortBySmartPaperNumber(a,b){
	return a.smartPaperNumber - b.smartPaperNumber;
}


//构造字符串
//参数preStr：调用该函数之前已生成的字符串
//参数layer：生成倒数第几个字符
function generateString(preStr, layer, self) {
    //穷举可选字符集
    for (var i = 0; i < paperKeyArray.length; i++) {
        if (layer > 1) {
            if(preStr.indexOf(paperKeyArray[i]) == -1){
                generateString(preStr + paperKeyArray[i], layer - 1);
            }
        } else {
            //已经生成最后一个字符，输出结果
            if(preStr.indexOf(paperKeyArray[i]) == -1){
                var str = preStr + paperKeyArray[i];
                if(findEleInArr(sortStr(str),baseKeyArr) == -1){
                    baseKeyArr.push(str);
                }
            }
        }
    }
}

function findEleInArr(ele, arr){
    if (!Array.indexOf) {
        Array.prototype.indexOf = function(obj) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == obj) {
                    return i;
                }
            }
            return -1;
        };
    }
    var index = arr.indexOf(ele);
    return index;
}


function sortStr(str){
    var arr = [];
    for(var i=0;i<str.length;i++){
        arr.push(str[i]);
    }

    arr.sort();
    return arr.join('');
}
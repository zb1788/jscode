import commonUtils from '@/utils/common'
import { getSmartPaperByMac,numBindSmartPaperApi  } from '@/api/interface'
import storage from '@/utils/storage'
import {TLS_RESET_WHITE_MAC} from '@/api/constant'
let paperKeyArray = ["A","B","C","D","E","F","G"]
let baseKeyArr = []


/**
 * 获取学生名单
 */
export async function getSmartPaperByMacData(self){

    let res = await getSmartPaperByMac(self.schoolId,self.teacherComputerMac,self.ut)

    let arr = []

    for(let i=1;i<5;i++){
        generateString("", i,self);
    }

    self.baseKeyArr = baseKeyArr

    for(let [index,stu] of res.entries()){
        let obj = {}
        obj.smartPaperMac = stu.smartPaperMac; //mac
        obj.smartPaperNumber = stu.smartPaperNumber //编号
        obj.smartPaperOrder = stu.smartPaperOrder //序号
        obj.smartPaperIdNumber = stu.smartPaperIdNumber //序列号
        
        self.orderIndex['"' + stu.smartPaperNumber + '"'] = index
        
        obj.styleTheme = 'offline'//默认离线状态
        if(stu.smartPaperMac == ''){
            //未绑定
            obj.styleTheme = 'unbind'
        }else{
            //离线
            obj.styleTheme = 'offline'
            self.macIndex['"' + stu.smartPaperMac + '"'] = index
        }

        obj.bindNum = self.baseKeyArr[index] //给每个学生分配一个字母
        self.orderByKey[obj.bindNum] = stu.smartPaperNumber
        arr.push(obj)
    }    

    commonUtils.console('paperList:',self.paperListArr,'macIndex:',self.macIndex,'orderIndex:',self.orderIndex)

    self.paperListArr = arr
}

/**
 * 按键绑定
 */
export function OnGetKeys(self){
    try{
        VcomTeach.bindingEvent("PaperGetKeys",async function(mac, keys){
            commonUtils.console('原始mack|key：',mac,keys)
            //先替换G为F，后替换H为G，顺序不能错
            keys = keys.replace("G","F").replace("H","G");
            commonUtils.console('替换后mack|key：',mac,keys)

            //orderByKey编号与字母的对应关系
            let orderNumber = self.orderByKey[keys];
            if(typeof orderNumber != 'undefined'){
                let stu = self.paperListArr[self.orderIndex['"'+ orderNumber +'"']]

                if(stu.smartPaperMac == mac){
                    //重复绑定，不用重新绑定
                    return false
                }
                storage.set(TLS_RESET_WHITE_MAC,1)
                self.macChange = true

                let res = await numBindSmartPaperApi(self.schoolId,mac,stu.smartPaperNumber,stu.smartPaperOrder,self.teacherComputerMac,self.ut)
                if(res.bindResult == 1){
                    //先解绑
                    if(typeof self.macIndex['"' + mac + '"'] != 'undefined'){
                        self.paperListArr[self.macIndex['"'+ mac +'"']].styleTheme = 'offline'
                        self.paperListArr[self.macIndex['"'+ mac +'"']].smartPaperMac = ''
                        self.paperListArr[self.macIndex['"'+ mac +'"']].smartPaperIdNumber = ''                        
                        delete self.macIndex['"'+ mac +'"']
                    }

                    //再绑定
                    let stu = self.paperListArr[self.orderIndex['"'+ orderNumber +'"']]
                    self.paperListArr[self.orderIndex['"'+ orderNumber +'"']].styleTheme = 'online'
                    delete self.macIndex['"'+ stu.smartPaperMac +'"']
                    self.macIndex['"'+ mac +'"'] = self.orderIndex['"'+orderNumber+'"']
                    self.paperListArr[self.orderIndex['"'+ orderNumber +'"']].smartPaperMac = mac
                    self.paperListArr[self.orderIndex['"'+ orderNumber +'"']].smartPaperIdNumber = res.smartPaperIdNumber

                }else{
                    self.$messageteach.error(res.bindResultInfo)
                }
            }
        })
    }catch(e){

    }
}



export function OnGetOnlineMacs(self){
    try{
        //回调函数获取连接上的手写板mac,type1:连接，0：断开
        VcomTeach.bindingEvent("PaperGetOnlineMacs",function(mac,type){
            commonUtils.console(mac+"|"+type)

            if(type == 1){
                if(findEleInArr(mac,self.OnlineMacArr) == -1){
                    self.OnlineMacArr.push(mac)
                }

                if(typeof self.macIndex['"' + mac + '"'] != 'undefined'){
                    self.paperListArr[self.macIndex['"' + mac + '"']].styleTheme = 'online'
                }
            }else{
                if(findEleInArr(mac,self.OnlineMacArr) == -1){
                    return false
                }
                
                self.OnlineMacArr.splice(findEleInArr(mac,self.OnlineMacArr),1)

                if(typeof self.macIndex['"' + mac + '"'] != 'undefined'){
                    self.paperListArr[self.macIndex['"' + mac + '"']].styleTheme = 'offline'
                }
            }
        })
    }catch(e){

    }
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
            for (let i = 0; i < this.length; i++) {
                if (this[i] == obj) {
                    return i;
                }
            }
            return -1;
        };
    }
    let index = arr.indexOf(ele);
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
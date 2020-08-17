import request from '@/utils/request'
import store from '@/store'
import { getClassGroup } from '@/api/interface'
import commonUtils from '@/utils/common'
import {ICON_IMG_ARRAY} from '@/api/constant'

//获取图片对应的图片
export function getIconName(rtype){
    if(typeof(rtype)!="undefined" && rtype!=null ){
        rtype=rtype.toLowerCase()
    }
    let index = commonUtils.findEleInArr(rtype,ICON_IMG_ARRAY)

    return index == -1?'unknow':rtype;
}


//获取当前班级的分组信息数据
export async function getClassGroupData(){
    try{
        let res = await getClassGroup('bySchoolClassId',1,store.getters.userSelectClassId,store.getters.ut)
        let obj = {}
        if(res.length > 0 && res[0].rtnArray){
            let tableData = []
            let userList = []
            let userIdList = []
            //循环给数组添加一个对象
            for(let i=0;i<8;i++){
                tableData[i] = {}
            }

            for(let [index,item] of res[0].rtnArray.entries())
            {                                                                
                for(let [i,val] of item.memberInfo.entries()){                
                    tableData[i]['name'+index] = val.realName
                    tableData[i]['number'+index] = val.studentNumber             
                    
                    let userObj = {}
                    userObj.studentName = val.realName
                    userObj.studentId = val.studentNumber
                    userList.push(userObj)
                    userIdList.push(val.studentNumber)
                }                                
            }
            obj.tableData = tableData
            obj.userList = userList
            obj.userIdList = userIdList
            return obj
        }
    }catch(e){
        console.log(e)
    }
}
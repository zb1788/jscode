import commonUtils from '@/utils/common'
import { getClassGroupApi, getStudentListByClassNew } from '@/api/interface'



/**
 * 11,下载到授课端成功;12,下载到授课端失败;
 *  *	1、正在下载，2、下载完成，3、下载失败，4、正在答题，5、正在登分，6、正在预习，7、正在分享，8、正在讨论  9、完成
 */
export function OnGetStatus(self){
    VcomTeach.bindingEvent("PadGetStatus",function(ntype,UserResults){
        // ntype = 13
        // UserResults = '41010110324679,0,V3.1.0,1;41010110314422,1,V3.1.0,1;'
        commonUtils.console('获取用户状态信息详情：',new Date(),ntype,UserResults)
        self.ntype = ntype
        
        let studentNumberTmp = ''
        if(ntype == 11){
            //下载到授课端成功
            self.notifyInstance.close();
            self.$messageteach.success('下载到授课端成功!')
            self.isShowDownloadIng = false
            return false
        }
        if(ntype == 12){
            //下载到授课端失败
            self.notifyInstance.close();
            self.$messageteach.error('下载到授课端失败!')
            self.isShowDownloadIng = false
            return false
        }


        //分享上报，只上报一次
        if(ntype == 7){
            //正在分享
            if(typeof self.studentIndex['"' + UserResults + '"'] != 'undefined'){
                self.studentList[self.studentIndex['"' + UserResults + '"']].styleTheme = 'no'
                self.studentList[self.studentIndex['"' + UserResults + '"']].offline = false
                self.studentList[self.studentIndex['"' + UserResults + '"']].disabled = false
                self.studentList[self.studentIndex['"' + UserResults + '"']].shareStatus = 1
                self.studentList[self.studentIndex['"' + UserResults + '"']].icon = 'share'
                checkStatusNum(self)
            }
            return false
        }

        //小组讨论
        if(ntype == 8){
            if(self.type == 'discuss'){
                //第一个标签的状态
                if(typeof self.studentIndex['"' + UserResults + '"'] != 'undefined'){
                    self.studentList[self.studentIndex['"' + UserResults + '"']].styleTheme = 'no'
                    self.studentList[self.studentIndex['"' + UserResults + '"']].offline = false
                    self.studentList[self.studentIndex['"' + UserResults + '"']].disabled = false
                    self.studentList[self.studentIndex['"' + UserResults + '"']].shareStatus = 1
                    self.studentList[self.studentIndex['"' + UserResults + '"']].icon = 'news'     
                    checkStatusNum(self)           
                }

                //循环处理分组标签的状态
                if(self.groupListBase.length > 0){
                    for(let [index,item] of self.groupListBase.entries()){
                        for(let [i,stu] of item.students.entries()){
                            studentNumberTmp = "," + stu.studentId + ","
        
                            if ((UserResults).indexOf(studentNumberTmp) == -1) {
                                //不在线
                                self.groupListBase[index].students[i].icon = 'not'
                                self.groupListBase[index].students[i].styleTheme = ''
                                self.groupListBase[index].students[i].groupTheme = 'gray'
                                self.groupListBase[index].students[i].offline = true                        
                            }else{
                                //在线
                                self.groupListBase[index].students[i].icon = 'news'
                                self.groupListBase[index].students[i].styleTheme = 'no'
                                self.groupListBase[index].students[i].groupTheme = ''
                                self.groupListBase[index].students[i].offline = false    
                            }  
                        }
                    }
                }
            }


            return false
        }


        if(ntype == 13){
            /**
             * UserResults格式为：
             * '41010110000674,0,V3.1.0,1;41010110000675,0,V3.1.0,1;';
             * 学生帐号,锁屏状态,版本号,是否有管控;多个帐号中间用分号;分割。
             * 锁屏状态有0和1两种，0代表解锁，1代表锁屏, 版本号传带V的版本号，管控状态有管控传1，无管控传0
             * 学生帐号必须是排第一个,管控必须为最后一个
             */

            if(UserResults.substr(UserResults.length-1,1)!=';'){
                UserResults = UserResults+';';
            }
            UserResults = ";" + UserResults            
        }else{
            /**
             * UserResults格式为：
             * '41010110000674,41010110000675,41010110000676'
             * 多个帐号逗号分割
             */
            if(UserResults.substr(UserResults.length-1,1)!=','){
                UserResults = UserResults+',';
            }
            UserResults = "," + UserResults  
        }



        for(let [index,stu] of self.studentList.entries()){
            if(ntype == 13){
                studentNumberTmp = ";" + stu.studentNumber + ","
            }else{
                studentNumberTmp = "," + stu.studentNumber + ","
            }

            //循环学生列表
            if ((UserResults).indexOf(studentNumberTmp) == -1) {
                //不在线
                if(self.type == 'studentScreen'){
                    if (("," + self.screenStuids + ",").indexOf("," + stu.studentNumber + ",") != -1)
                    {
                        commonUtils.console('投票学生名单',self.screenStuids)
                        //通过插件通知投屏界面
                        PadAnswer.InsertIntoAddress(stu.studentNumber,"","");
                    }
                }

                //自动点名连接一次后不再显示断开状态
                if(self.type=="classkq"||self.type == 'classkqMix')
                {
                    continue;
                }                

                //用户在线状态只根据13这一种情况判断
                if(ntype == 13){
                    //下线取消可选状态,并把选中变成未选中
                    self.studentList[index].disabled = true
                    if(self.checkList.indexOf(stu.studentNumber) != -1){//从选中列表删除
                        self.checkList.splice(self.checkList.indexOf(stu.studentNumber),1)
                    }
                    //更新学生下线状态
                    self.studentList[index].icon = 'not'
                    self.studentList[index].styleTheme = ''
                    self.studentList[index].offline = true
                }
            }else{
                //在线
                //判断锁屏
                if(ntype == 13){
                    //1锁屏,0解锁
                    if(self.lockFlag){
                        if(UserResults.indexOf(";" + stu.studentNumber + ",1") == -1){
                            //结锁
                            self.studentList[index].lock = ''
                        }else{
                            //锁屏
                            self.studentList[index].lock = 'lock'
                        }
                    }
                }

                if(self.type == 'classkq'||self.type == 'classkqMix'){
                    if(stu.kqStatus != self.kqArr[4].id){
                        //如果学生不是未点名，则不更新学生状态
                        continue
                    }

                    //更新学生状态为出勤
                    self.studentList[index].kqStatus = self.kqArr[0].id
                }

                
                if(self.type == 'finishClass'){
                    //下课:判断是否管控 (管控状态有管控传1，无管控传0)
                    if(UserResults.indexOf(',1;') == -1){
                        //没有管控
                        self.powerOffBtn = false
                    }else{
                        //只要有一个管控，就显示平板关机按钮
                        self.powerOffBtn = true
                    }
                }

                if(ntype == 13){
                    //更新学生在线状态
                    self.studentList[index].styleTheme = 'no'
                    self.studentList[index].offline = false
                    self.studentList[index].disabled = false
                }


                //小组讨论
                let icons = 'news,download,warning,brush,right,share,right,upload'
                // if(icons.indexOf(self.studentList[index].icon) != -1){

                // }else{
                //     if(ntype != 13){
                //         //在线标识
                //         let iconObj = self.statusCountArr.find(val=>val.id == ntype)
                //         self.studentList[index].icon = iconObj.icon
                //     }else{
                //         self.studentList[index].icon = 'linked'
                //     }                    
                // }

    

                
                //课前预习的发起探究
                if(self.type == 'yuxizuoda'||self.type == 'sendToPad'){
                    let iconObj = self.statusCountArr.find(val=>val.id == ntype)
                    if(ntype != 13){                  
                        self.studentList[index].icon = iconObj.icon
                        if(ntype == 1){
                            // 1、正在下载，
                            self.studentList[index].downloadStaus = 1
                        }else if(ntype == 2){
                            // 2、下载完成，
                            self.studentList[index].downloadStaus = 2
                        }else if(ntype == 3){
                            // 3、下载失败，
                            self.studentList[index].downloadStaus = 3
                        }else if(ntype == 4){
                            // 4、正在答题，
                            self.studentList[index].writeStatus = 1
                        }
                    }else{
                        if(self.isFirstSend){
                            //第一次设置为在线图标
                            self.studentList[index].icon = 'linked'
                        }
                    }                    
                    console.log(self.studentList[index]);
                }else if(self.type == 'share'){
                    if(ntype == 13){
                        if(self.studentList[index].icon == 'not'){
                            //第一次设置为在线图标
                            self.studentList[index].icon = 'linked'
                        }
                    }
                }else if(self.type == 'discuss'){
                    // 小组讨论
                    if( self.studentList[index].icon == 'news'){
                        //如果学生是正在讨论状态，则不更新图标
                        if(!self.discussData.isStart){
                            self.studentList[index].icon = 'linked'
                        }
                    }else{
                        if(ntype == 13){
                            self.studentList[index].icon = 'linked'
                        }                   
                    }  
                }else{
                    self.studentList[index].icon = 'linked'
                }
                  



                if(self.type=="sign"||self.type=="finishClass"){
                    if(self.padLimitVersion != ''){
                        let regStr = '/'+stu.studentNumber+',(.*?),(.*?),(.*?);/'; 
                        let reg = eval(regStr);
                    	let arr = reg.exec(UserResults);

                        if(arr != 'null'){
                            let curVersion = arr[2].replace(/V/, "");
                            if(compareVersion(self.padLimitVersion,curVersion) == -1){
                                self.studentList[index].enable = false
                                self.studentList[index].icon = 'unlinked'
                                self.studentList[index].styleTheme = 'version-error'
                            }
                        }
                        
                    }
                }
            }
        }


        if(self.type == 'discuss'){
            if(self.groupListBase.length > 0){
                for(let [index,item] of self.groupListBase.entries()){
                    for(let [i,stu] of item.students.entries()){
                        if(ntype == 13){
                            studentNumberTmp = ";" + stu.studentId + ","
                        }

                        if ((UserResults).indexOf(studentNumberTmp) == -1) {
                            //不在线
                            self.groupListBase[index].students[i].icon = 'not'
                            self.groupListBase[index].students[i].groupTheme = 'gray'
                            self.groupListBase[index].students[i].offline = true                        
                        }else{
                            //在线
                            if( self.groupListBase[index].students[i].icon == 'news'){
                                //如果学生是正在讨论状态，则不更新图标
                                if(!self.discussData.isStart){
                                    self.groupListBase[index].students[i].icon = 'linked'
                                }
                            }else{
                                if(ntype == 13){
                                    self.groupListBase[index].students[i].icon = 'linked'
                                }  
                            }
                            self.groupListBase[index].students[i].groupTheme = ''
                            self.groupListBase[index].students[i].offline = false    
                        }  
                    }
                }
            }
        }

        //如果ntype
        self.isFirstSend = false
        checkStatusNum(self)
                                                                
    });
}

//更新状态
function checkStatusNum(self){
        //更新状态
        //不在线
        let offlineArr = self.studentList.filter(item => item.offline == true)
        self.statusCountArr[0].num = offlineArr.length
        //在线
        self.statusCountArr[1].num = self.onlineNum

        if(self.type == 'sign'||self.type == 'finishClass'){
            //版本错误
            let versionErrorArr = self.studentList.filter(item => item.styleTheme == 'version-error')
            self.statusCountArr[10].num = versionErrorArr.length
        }

        if(self.type == 'yuxizuoda'||self.type == 'sendToPad'){
            //正在下载
            let downloadArr = self.studentList.filter(item => item.downloadStaus == 1)
            self.statusCountArr[2].num = downloadArr.length
            //下载完成
            let downloadOkArr = self.studentList.filter(item => item.downloadStaus == 2)
            self.statusCountArr[3].num = downloadOkArr.length
            //下载失败
            let downloadErrorArr = self.studentList.filter(item => item.downloadStaus == 3)
            self.statusCountArr[4].num = downloadErrorArr.length
            //正在作答
            let zuodaArr = self.studentList.filter(item => item.writeStatus == 1)
            self.statusCountArr[5].num = zuodaArr.length
            //作答完成
            let zuodaComputeArr = self.studentList.filter(item => item.writeStatus == 2)
            self.statusCountArr[6].num = zuodaComputeArr.length            
        }

        if(self.type == 'discuss'){
            //讨论
            let talkArr = self.studentList.filter(item => item.icon == 'news')
            self.statusCountArr[7].num = talkArr.length            
        }

        if(self.type == 'share'){
            //正在分享
            let shareIngArr = self.studentList.filter(item => item.shareStatus == 1)
            self.statusCountArr[8].num = shareIngArr.length
            //分享完成
            let shareOkArr = self.studentList.filter(item => item.shareStatus == 2)
            self.statusCountArr[9].num = shareOkArr.length
        }                
}


/**
 * 获取分享结果
 * @param {*} self 
 */
export function OnGetResults(self){
    VcomTeach.bindingEvent("PadGetResults",function(username,submitType){
        //submitType 1 试卷作答完成  2 预习作答完成 
        //成果分享的回调 submitType为学生分享的文件路径
        commonUtils.console('分享完成信息：',username,submitType)
        if ((self.type == "sendToPad" && submitType == "1") || (self.type == "yuxizuoda" && submitType == "2")) {
            //设置作答完成
            self.studentList[self.studentIndex['"' + username + '"']].writeStatus = 2
            self.studentList[self.studentIndex['"' + username + '"']].icon = 'right'
        }

        //成果分享逻辑
        if (self.type == "share" && submitType != "1" && submitType != "2"){
            //分享完成
            self.studentList[self.studentIndex['"' + username + '"']].shareStatus = 2               
         
            let realname = self.studentList[self.studentIndex['"' + username + '"']].realname
            let url = "username=" + realname + "&lpath=" + submitType + "&"
            //更改分享完的学生状态
            self.studentList[self.studentIndex['"' + username + '"']].shareOk = true
            self.studentList[self.studentIndex['"' + username + '"']].url = url
            self.studentList[self.studentIndex['"' + username + '"']].icon = 'right'
            //更改分享完的组长改变状态
            for(let [index,item] of self.groupListBase.entries()){
                if(item.studentId == username){
                    self.groupListBase[index].shareOk = true
                    self.groupListBase[index].url = url
                }
            }
        }



        //正在作答
        let zuodaArr = self.studentList.filter(item => item.writeStatus == 1)
        self.statusCountArr[5].num = zuodaArr.length
        //作答完成
        let zuodaComputeArr = self.studentList.filter(item => item.writeStatus == 2)
        self.statusCountArr[6].num = zuodaComputeArr.length  
        //更新正在分享
        let shareIngArr = self.studentList.filter(item => item.shareStatus == 1)
        self.statusCountArr[8].num = shareIngArr.length 
        //分享完成
        let shareOkArr = self.studentList.filter(item => item.shareStatus == 2)
        self.statusCountArr[9].num = shareOkArr.length      
    })    
}

/**
 * 获取用户的按键信息和小组讨论加入分组的状态
 * @param {*} self 
 */
export function onGetKeys(self){
    VcomTeach.bindingEvent("PadGetKeys",function(username, key){
        commonUtils.console('PadGetKeys',username,key)

        //小组讨论(用户加入小组的回调)
        if (self.type == "discuss"){
            //username,key
            //1.根据帐号从老的小组里移除
            for(let [index,item] of self.groupListBase.entries()){
                for(let [i,stu] of item.students.entries()){
                    if(stu.studentId == username){
                        self.groupListBase[index].students.splice(i,1)
                    }
                }
            }
            let stu = {}
            stu.icon = 'linked'
            stu.lock = ''
            stu.offline = false
            stu.shareOk = false
            stu.studentId = username
            stu.studentName = self.studentList[self.studentIndex['"' + username + '"']].realname
            stu.styleTheme = 'no'
            if(self.groupListBase[self.discussData.groupKey[key]-1].students.length == 0){
                stu.groupManager = 1
            }else{
                stu.groupManager = 0
            }
            self.groupListBase[self.discussData.groupKey[key]-1].students.push(stu)
        }            
    })
}

/**
 * 答题器按键回调
 */
export function onGetKeysByAnswer(self){
    console.log("开启监控答题器按键回调")
    VcomTeach.bindingEvent("AnswerGetKeys",function(answerToolCode, key){   
        commonUtils.console('AnswerGetKeys',answerToolCode,key)
        //答题器考勤
        if(self.type == 'classkqCard'||self.type == 'classkqMix'){
            let index = self.studentList.findIndex(item=>item.answerToolCode == answerToolCode)
            if(index != -1){
                let stu = self.studentList[index]
                if(stu.kqStatus != self.kqArr[4].id){
                    //如果学生不是未点名，则不更新学生状态
                    return
                }                
                self.studentList[index].kqStatus = self.kqArr[0].id
            }
            // if(typeof self.studentIndex['"' + username + '"'] != 'undefined'){
            //     let stu = self.studentList[self.studentIndex['"' + username + '"']]          
            //     if(stu.kqStatus != self.kqArr[0].id){
            //         //如果学生不是未点名，则不更新学生状态
            //         return
            //     }
            //     self.studentList[self.studentIndex['"' + username + '"']].kqStatus = self.kqArr[1].id
            // }
        }      
    });    
}



/**
 * 获取锁屏状态
 * @param {*} self 
 */
export function OnGetLockInfo(self){
    VcomTeach.bindingEvent("PadGetLockInfo",function(stuids){
        commonUtils.console('获取锁屏状态',stuids)
        for(let [index,stu] of self.studentList.entries()){
            //1锁屏,0解锁
            if(self.lockFlag){
                if(stuids.indexOf(";" + stu.studentNumber + ",1") == -1){
                    //结锁
                    self.studentList[index].lock = ''
                }else{
                    //锁屏
                    self.studentList[index].lock = 'lock'
                }
            }
        }
        if(self.type == 'discuss'){
            // for(let [index,item] of self.groupList.entries()){
            //     for(let [i,stu] of item.entries()){
            //         //1锁屏,0解锁
            //         if(self.lockFlag){
            //             if(stuids.indexOf(";" + stu.code + ",1") == -1){
            //                 //结锁
            //                 self.groupList[index][i].lock = ''
            //             }else{
            //                 //锁屏
            //                 self.studentList[index][i].lock = 'lock'
            //             }
            //         }                    
            //     }
            // }
        }
    })
}





/**
 * 获取学生名单
 */
export async function getStudentListByClassData(self){
    let arr = []
    let result = await getStudentListByClassNew(self.classId,self.teacherComputerMac,1)
    if(result.code != '200'){
        self.$messageteach.error('获取学生列表失败')
        return arr
    }
    
    for(let [index,stu] of result.data.rtnArray.entries()){
        let obj = {}
        // obj.answerToolCode = stu.answerToolCode
        // obj.pinyin = stu.pinyin
        // obj.quanpin = stu.quanpin
        // obj.realname = stu.realname
        // obj.sex = stu.sex
        // obj.smartPaperGetNumber = stu.smartPaperGetNumber
        // obj.smartPaperIdNumber = stu.smartPaperIdNumber
        // obj.smartPaperMac = stu.smartPaperMac
        // obj.smartPaperOrder = stu.smartPaperOrder
        // obj.smartPaperProvider = stu.smartPaperProvider
        // obj.studentNumber = stu.studentNumber
        obj = stu
        
        obj.disabled = false //是否可以选中
        obj.styleTheme = '' //风格
        obj.offline = true //默认不在线(统计在线数量用)					
        obj.checked = false //默认未选中	
        obj.icon = 'not' //默认离线图标
        obj.kqStatus = 0 //考勤状态
        obj.enable = true //平板版本是否过低(过低不可用)
        obj.writeStatus = 0 //1正在作答 2作答完成
        obj.shareStatus = 0 // 1正在分享 2分享完成
        obj.downloadStaus = 0 // 1正在下载 2下载完成 3 下载失败                
        obj.lock = '' //加锁
        obj.url = '' //分享的url					

        self.studentIndex['"' + stu.studentNumber + '"'] = index
        self.studentNumberList.push(stu.studentNumber)
        arr.push(obj)
    } 
    return arr
}







/**
 * pad版本对比
 * @param {*} version1 
 * @param {*} version2 
 */
function compareVersion(version1,version2){
    version1 = commonUtils.trim(version1);
    version2 = commonUtils.trim(version2);
    
    let nvArr=version2.split(".");
    let cvArr=version1.split(".");


    if(nvArr.length > cvArr.length){
        let len = nvArr.length - cvArr.length;
        for(let i=0;i<len;i++){
            cvArr.push(0);
        }
    }else if(nvArr.length < cvArr.length){
        let len = cvArr.length - nvArr.length;
        for(let i=0;i<len;i++){
            nvArr.push(0);
        }	
    }

    for(let vi=0;vi<cvArr.length;vi++){
        let nvai=Number(nvArr[vi]);
        let cvai=Number(cvArr[vi]);

        if(nvai == cvai){
            if(vi == (cvArr.length-1)){
                //全等
                return 0;
            }
        }else if(nvai>cvai){
            //verson2大于version1
            return 1;
        }else{
            return -1;
        }
    }    
}
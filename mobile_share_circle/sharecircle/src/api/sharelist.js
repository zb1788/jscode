import request from '@/utils/request'
import utils from '@/utils/common';
import {getAttentionList} from '@/api/attention'
import {getCommentList,getVoteList,getVoteListResult} from '@/api/comment'
import Vue from 'vue'
//获取分享圈列表
export function getShareList(url,params,method) {
  return request({
    url: url,
    method: method,
    data:params
  })
}
  
 


//测试
export function testShareList(url,params,method){
    return request({
        url: url,
        method: method,
        data:params
      })
}

//jsonp请求
export function getJsonpData(url,params){
    return Vue.jsonp(url,params)
  }


//格式化分享圈数据为data
export function formatdata(data, self){
    console.log(data)
    let obj = {}
    //我的共享
    let myShareObj = {}
    let myHeadPhotoArr = []
    let myCommentArr = []
    if(self.currentIndex == 1 && self.currentPage == 1){
        if(data.myShareClassHour){
            //有我的共享
            let myShare = data.myShareClassHour
            let tmpArr = []
            tmpArr.push(myShare)
        
            let myResultObj = checkData(tmpArr, 1, self)
            let myArr = myResultObj.arrInfo
            myHeadPhotoArr = myResultObj.headPhotoArr
            myCommentArr = myResultObj.commentArr
            myShareObj = myArr[0]
        }else{
            //没有我的共享
            self.hasMyShare = false
        }
    }



    let otherResultObj = checkData(data.shareClassHourList, 2, self)
    
    let otherShareArr = otherResultObj.arrInfo
    let otherHeadPhotoArr = otherResultObj.headPhotoArr
    let otherCommentArr = otherResultObj.commentArr

    let headPhotoArrs = myHeadPhotoArr.concat(otherHeadPhotoArr)
    let commentArrs = myCommentArr.concat(otherCommentArr)


    obj.myShareObj = myShareObj
    obj.otherShareArr = otherShareArr
    obj.headPhotoArrs = headPhotoArrs
    obj.commentArrs = commentArrs


    return obj
}

//格式化分享圈具体逻辑
//type:1我的2其他人的
function checkData(arr,type,self){
    let resultObj = {}
    let tmpArr = []
    let headPhotoArr = []//头像数组
    let commentArr = []//评论数组
    arr.forEach((obj,i) =>{
        let shareObj = {}
        shareObj.infoid = obj.id//评论的infoid
        shareObj.userName = utils.nameFormat(obj.trueName)//姓名
        shareObj.schoolName = obj.schoolName//学校名称
        if(obj.message){
            shareObj.Comment = obj.message//评论内容
        }else{
            shareObj.Comment = ""//评论内容
        }
        
        //初始化参数
        shareObj.CommentList = []

        shareObj.userAccount = obj.userName//用户帐号
        shareObj.headPhoto = ""
        
        commentArr.push(obj.id)

        shareObj.ksId = obj.ksId
        shareObj.shareSelfCode = obj.shareSelfCode
        shareObj.shareSysCode = obj.shareSysCode

        if(self.section == ''){
            self.section = obj.sectton
        }
        if(self.grade == ''){
            self.grade = obj.rgrade
        }

        
        //头像判断
        let headPhotoArrTmp = Object.keys(self.headPhotoObj)
        let result = headPhotoArrTmp.find(item => item == obj.userName)
        if(typeof(result) == 'undefined'){
            headPhotoArr.push(obj.userName)
        }else{
            shareObj.headPhoto = self.headPhotoObj[obj.userName]
        }




        //正则匹配时间只取年月日
        var patt = /(.*?)-(.*?)-(.*?) /
        var dataArr = obj.lastShareTime.match(patt)
        shareObj.shareTime = dataArr[0]
        if(obj.shareType == 1){
            shareObj.shareArea = "平台"
        }else{
            shareObj.shareArea = "学校"
        }
    
        shareObj.shareNum = obj.shareNumber    
        shareObj.commentNum = 0
        shareObj.isShowMore  = false //默认不展示更多留言
        
        //评论列表从评价系统取

        if(type == 1){
            //只有我的才有谁引用了我共享的课时包
            if(obj.useShareClassHourList && obj.useShareClassHourList.length>0){
                var sharePeopleStr = ""
                for(let item of obj.useShareClassHourList){
                    sharePeopleStr += ","+item.trueName
                }
                shareObj.shareList = utils.trimStr(sharePeopleStr,',')
            }else{
                shareObj.shareList = ""
            }
        }

        if(type == 1){
            shareObj.isMy = true
            shareObj.isFollow = 3
            shareObj.hasAd = false
        }else{
            shareObj.isMy = false
            shareObj.isFollow = 3//关注状态从互动课堂取(1,未关注；2已关注；3不展示)

            let curIndex = (self.currentPage - 1)*self.pageSize
            if(self.onlyOneAd && (curIndex+i)== self.adIndex){
                shareObj.hasAd = true
                shareObj.adPic = "../assets/defaultad.png"
                self.onlyOneAd = false
                getAdInfo(self)
            }else{
                shareObj.hasAd = false
            }
        }
        
        let voteArr = []
        if(obj.shareClassHourReasonList && obj.shareClassHourReasonList.length>0){
            for(let item of obj.shareClassHourReasonList){
                let voteItemObj = {}
                voteItemObj.voteId = item.voteId
                voteItemObj.id = item.reasonId
                if(self.voteId == ""){
                    self.voteId = item.voteId
                }
                //名称和次数从投票系统获取
                // voteItemObj.value = "啊啊" //临时测试
                voteItemObj.count = 0   //默认为0，后面再赋值
                voteItemObj.value = ""
                voteArr.push(voteItemObj)
            }
        }
        shareObj.items = voteArr


        tmpArr.push(shareObj)
    })

    resultObj.arrInfo = tmpArr
    resultObj.headPhotoArr = headPhotoArr
    resultObj.commentArr = commentArr

    return resultObj
}

//共享圈数据赋值并获取头像，关注状态，评论内容和投票选项以及结果
export function showBaseDataAndGetOtherData(self, response){
    if(response.shareClassHourList.length == 0){
        self.allLoaded = true
        self.isShowBottom = true
        if(self.currentIndex == 2){
            //切换到我的关注，如果没有数据就不往下执行
            return false
        }
    }


    let objTmp = formatdata(response, self)

    //获取投票id（只获取一次，一个课时包下肯定只有一种投票类型）
    if(self.currentIndex == 1 && self.currentPage == 1){
        if(objTmp.myShareObj){
            self.myinfo = objTmp.myShareObj
            // if(self.voteId == ""){
            //     if(objTmp.myShareObj.items && objTmp.myShareObj.items.length>0){
            //         self.voteId = objTmp.myShareObj.items[0].voteId
            //     }
            // }
        }
    }

    //共享圈都是基于当前课时的
    // if(self.voteId == ""){
    //     if(objTmp.otherShareArr && objTmp.otherShareArr.length>0){
    //         if(objTmp.otherShareArr[0].items.length>0){
    //             self.voteId = objTmp.otherShareArr[0].items[0].voteId
    //         }
    //     }
    // }

    self.lists = self.lists.concat(objTmp.otherShareArr)


    //判断是否全部加载完成
    if(!self.allLoaded){
        let total = 0;
        total = self.lists.length
        // if(self.currentIndex == 2){
        //     //我的关注
        //     total = self.lists.length
        // }else{
        //     // if(self.myinfo.userName){
        //     //     total = self.lists.length*1+self.myinfo    
        //     // }else{
        //     //     total = self.lists.length
        //     // }
        // }

        if(response.count > total){
            self.allLoaded = false
            self.isShowBottom = false
        }else{
            self.allLoaded = true
            self.isShowBottom = true
        }
    }
    
    let that = self
    let tms_url = self.domainInfo.tms_url
    //获取用户头像列表(同一个人只获取一次)
    if(objTmp.headPhotoArrs.length>0){
        getTmsHeadPhoto(objTmp.headPhotoArrs,tms_url).then(response => {
            let headPhotoData = response.rtnArray
            let vfs_url = that.domainInfo.vfs_url
    
            let index = (that.currentPage - 1)*that.pageSize
            if(response && headPhotoData && headPhotoData.length > 0){
                // if(that.currentIndex == 1 && that.currentPage == 1 && index == 0 && that.hasMyShare){
                //     that.myinfo.headPhoto = vfs_url + headPhotoData[0].headPhoto
                //     headPhotoData.shift()
                // }
                // for(index; index < headPhotoData.length; index++){
                //     let indexKey = index%that.pageSize
                //     that.lists[index].headPhoto = vfs_url + headPhotoData[indexKey].headPhoto
                // }
    
                //保存头像地址
                for(let i = 0; i<headPhotoData.length; i++){
                    that.headPhotoObj[headPhotoData[i].username] = vfs_url +'/tms'+ headPhotoData[i].headPhoto
                }

                //我的头像
                if(that.currentIndex == 1 && that.currentPage == 1 && index == 0 && that.hasMyShare){
                    if(typeof that.headPhotoObj[that.myinfo.userAccount] != 'undefined'){
                        that.myinfo.headPhoto = that.headPhotoObj[that.myinfo.userAccount]
                    }                    
                } 
                
                //其他人的头像
                for(index; index < that.lists.length; index++){
                    if(!that.lists[index].hasAd){
                        if(typeof that.headPhotoObj[that.lists[index].userAccount] != 'undefined'){
                            that.lists[index].headPhoto = that.headPhotoObj[that.lists[index].userAccount]
                        }                        
                    }                    
                }
    
            }
        }).catch((error) => {
            console.log(error)
        })
    }


    //获取关注列表(只获取一次就行)
    if(!self.onAttentionStatus.isLoad){
        let obj = {}
        let hdxx_url = self.domainInfo.hdxx_url
        self.myinfo.userAccount = self.domainInfo.userAccount

        let attentionListUrl = hdxx_url+"/space/concern/concernList.action?username="+self.myinfo.userAccount

        getAttentionList(attentionListUrl,obj,'get').then(response => {
            that.onAttentionStatus.isLoad = true
            if(response && response.length > 0){
                for(let i=0; i < response.length; i++){
                    that.onAttentionStatus.onAttentionArr.push(response[i].concernAccount);
                }
            }
            checkAttentionStatus(that.currentPage, that.pageSize, that.lists, that.onAttentionStatus.onAttentionArr, that)
        })
    }else{
        checkAttentionStatus(that.currentPage, that.pageSize, that.lists, that.onAttentionStatus.onAttentionArr, that)
    }
    
    //测试数据
    // let tmpObj1 = {}
    // tmpObj1.id = 1
    // tmpObj1.value = "非常好"
    // self.voteOption.push(tmpObj1)
    // let tmpObj2 = {}
    // tmpObj2.id = 2
    // tmpObj2.value = "好"
    // self.voteOption.push(tmpObj2)
    // let tmpObj3 = {}
    // tmpObj3.id = 3
    // tmpObj3.value = "没有想象中的使用，有待改进"
    // self.voteOption.push(tmpObj3)
    // let tmpObj4 = {}
    // tmpObj4.id = 4
    // tmpObj4.value = "凑合使用"
    // self.voteOption.push(tmpObj4)  

    //获取投票选项
    let aux_url = self.domainInfo.aux_url


    //有投票ID
    if(that.voteId != ''){
        let voteListUrl = aux_url+"/auxsys/getVoteInfo.jsp?voteid="+that.voteId

        if(Object.keys(self.voteOption).length == 0){
            getVoteList(voteListUrl,{},'get').then(response => {
                if(response && response.status == 1 && response.info != null && response.info.options.length>0){
                    for(let item of response.info.options ){
                        that.voteOption[item.optionId] = item.optionName
                    }
                    //遍历投票选项并获取投票名称
                    showVoteInfo(that)
                }
            }).catch((error) => {
                console.log(error)
            })
        }else{
            showVoteInfo(that)
        }


        //获取投票结果
        let voteResultUrl = aux_url+'/auxsys/getMultiVoteResult.jsp?appid='+that.appid+'&voteid='+that.voteId+'&infoids='+objTmp.commentArrs.join(',');
        getVoteListResult(voteResultUrl,{},'get').then(response => {
            let result = response
            let index = (that.currentPage - 1)*that.pageSize
            if(result && result.length > 0){
                //我的共享单独处理
                if(that.currentIndex == 1 && that.currentPage == 1 && index == 0 && that.hasMyShare){
                    if(result[0].options && result[0].options.length>0){
                        //如果我的存在投票结果
                        for(let i=0;i<that.myinfo.items.length;i++){
                            let tmpOptionObj = result[0].options.find(ii => ii.id == that.myinfo.items[i].id)
                            that.myinfo.items[i].count = tmpOptionObj.amount
                        }
                        result.shift()
                    }
                }

                //遍历处理lists
                for(index; index < that.lists.length; index++){
                    let indexKey = index%that.pageSize
                    if(result[indexKey].options && result[indexKey].options.length > 0){
                        for(let i=0; i< that.lists[index].items.length; i++){
                            let tmpOptionObj = result[indexKey].options.find(ii => ii.id ==  that.lists[index].items[i].id)
                            if(typeof tmpOptionObj != 'undefined'){
                                that.lists[index].items[i].count = tmpOptionObj.amount
                            }                            
                        }
                    }
                }
            }
        })
    }




    // return false
    // 获取评论列表
    let areaCode = that.domainInfo.areaCode
    let commentListUrl = aux_url+"/auxsys/getMultiCommentList.jsp"
    var commentObj = {};
    commentObj.appid = that.appid;
    commentObj.infoids = objTmp.commentArrs.join(',');//字符串分割
    commentObj.area = areaCode;
    commentObj.start = 1;
    commentObj.limit = 50;

    getCommentList(commentListUrl,commentObj,'get').then(response => {
        let result = response
        //循环赋值评论
        let index = (that.currentPage - 1)*that.pageSize

        if(result && result.length > 0){
            //我的共享单独处理
            if(that.currentIndex == 1 && that.currentPage == 1 && index == 0 && that.hasMyShare){
                if(result[0].commets && result[0].commets.length>0){
                    //如果我的 存在留言内容
                    that.myinfo.commentNum = result[0].totalRow
                    
                    let CommentListArr = []
                    for(let item of result[0].commets){
                        let commentTmpObj = {}
                        commentTmpObj.username = item.username
                        commentTmpObj.msg = item.content
                        commentTmpObj.toname = item.remark1
                        commentTmpObj.id = item.id
                        
                        CommentListArr.push(commentTmpObj)                       
                    }

                    CommentListArr.reverse()
                    that.myinfo.CommentList = CommentListArr
                    result.shift()
                }
            }

            //遍历处理lists
            for(index; index < that.lists.length; index++){
                let indexKey = index%that.pageSize
                if(result[indexKey].commets && result[indexKey].commets.length > 0){
                    that.lists[index].commentNum = result[indexKey].totalRow
                    let CommentListArr = []
                    for(let item of result[indexKey].commets){
                        let commentTmpObj = {}
                        commentTmpObj.username = item.username
                        commentTmpObj.msg = item.content
                        commentTmpObj.toname = item.remark1
                        commentTmpObj.id = item.id
                        CommentListArr.push(commentTmpObj)  
                    }
                    that.lists[index].CommentList = CommentListArr.reverse()
                }
            }
        }
    })

}

//展示投票选项名称
function showVoteInfo(self){
    //遍历我的
    let i = (self.currentPage - 1)*self.pageSize
    if(self.currentIndex == 1 && self.currentPage == 1 && i == 0 && self.hasMyShare){
        if(self.myinfo.items && self.myinfo.items.length > 0){
            for(let index=0; index < self.myinfo.items.length; index++){
                self.myinfo.items[index].value = self.voteOption[self.myinfo.items[index].id]
            }
        }
    }
    //遍历其他人的
    for(i; i < self.lists.length; i++){
        if(self.lists[i].items && self.lists[i].items.length > 0){
            for(let j=0; j < self.lists[i].items.length; j++){
                self.lists[i].items[j].value = self.voteOption[self.lists[i].items[j].id]
            }
        }    
    }
}


//检查是否关注
function checkAttentionStatus(currentPage, pageSize, lists, onAttentionArr, self){
    let index = (currentPage - 1)*pageSize
    for(index; index<lists.length; index++){
        if(utils.findEleInArr(lists[index].userAccount,onAttentionArr) == -1){
            //不存在，未关注
            self.lists[index].isFollow = 1
        }else{
            //关注
            self.lists[index].isFollow = 2
        }
    }
}


//批量获取用户头像地址
export function getTmsHeadPhoto(headPhotoArrs,tms_url){
    var usernames = headPhotoArrs.join(',')
    //测试数据
    // usernames = '3401010000010032,3401010000010002,3401010000010001,3401010000010004'
    var tmpObj = {}
    tmpObj.callbackQuery = 'jsoncallback'
    tmpObj.queryType = 'byNames'
    tmpObj.usernames = usernames

    
    let headPhotoUrl = tms_url+"/tms/interface/queryTeacher.jsp"
    return getJsonpData(headPhotoUrl,tmpObj)
}

//广告
function getAdInfo(self){
    let vfs_url = self.domainInfo.vfs_url
    var scriptEle = document.createElement('script')
    scriptEle.src = vfs_url+'/A01/A01043/A01043011/list.json?_=1545026550847'
    document.body.appendChild(scriptEle)
    scriptEle.onload = function() {
        let tmp = infolistA01043011.infosList
        let areaCode = self.domainInfo.vfs_url.areaCode
        let arr = areaFilter(tmp,areaCode)
        arr = sectionFilter(arr,self)
        arr = gradeFilter(arr,self)
        if(arr.length == 0){
            self.lists[self.adIndex].adTitle = tmp[0].topic
            self.lists[self.adIndex].adDesc = tmp[0].keywords
            self.lists[self.adIndex].adHeadPhoto = vfs_url+tmp[0].outfiles
            self.lists[self.adIndex].adPic = vfs_url+tmp[0].abbrevpic
            self.lists[self.adIndex].adContent = tmp[0].description
            self.lists[self.adIndex].adUrl = tmp[0].filepath
        }else{
            self.lists[self.adIndex].adTitle = tmp[0].topic
            self.lists[self.adIndex].adDesc = tmp[0].keywords
            self.lists[self.adIndex].adHeadPhoto = vfs_url+tmp[0].outfiles
            self.lists[self.adIndex].adPic = vfs_url+arr[0].abbrevpic
            self.lists[self.adIndex].adContent = arr[0].description
            self.lists[self.adIndex].adUrl = arr[0].filepath
        }
    }
}

//区域过滤
function areaFilter(list,areaCode){
    return list.filter(item => item.a1 == areaCode||item.a1 == '')
}
//学段过滤
function sectionFilter(list,self){
    return list.filter(item => item.a2 == self.section||item.a2 == '')
}
//年级过滤
function gradeFilter(list,self){
    return list.filter(item => item.a3 == self.grade||item.a3 == '')
}
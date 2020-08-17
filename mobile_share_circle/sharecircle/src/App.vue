<template>
  <div>
    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
    <x-header title="共享圈"  @click.native="back()" style="background-color:#3cb0e0;"></x-header>
    <div id="wrapper" class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <mt-loadmore :auto-fill="autoFill" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
        <div class="banner">
          <div class="pad010">
            <flexbox>
              <flexbox-item class="banner-right">        
                
                <div class="jieduan texth2">{{ksName}}</div>
                <!--
                <div class=" texth3" style="display:flex; width:70%; margin:0 auto; text-align:right; font-size:1rem "><div class="jieduan" style="min-width:">{{classHourName}}</div> 
                <div class="jieduan" style="min-width:80px; flex:1 ; text-align:left; padding-left:10px;font-size:1rem">{{classTypeName}}</div></div>
                -->
                <div class=" texth3" style="display:flex; width:100%; margin:0 auto; text-align:right; font-size:1rem "><div class="jieduan" style="flex:1;">{{classHourName}}</div> 
                <div class="jieduan" style="flex:1 ; text-align:left; padding-left:10px;font-size:1rem">{{classTypeName}}</div></div>
                <!--  -->
                <!-- <div style="display:inline-block;width:20%;" class="jieduan texth3">{{classTypeName}}</div> -->
              </flexbox-item>
            </flexbox>
          </div>
        </div>

        <Personal
        v-if="hasMyShare"
        :indexKey = 0
        :info = "myinfo"
        :isEmptyComment = "isEmptyComment"
        @addPinglun = "addPinglun"
        @saveVote = "saveVote"
        @goMyClassHour = "goMyClassHour"
        @delComment = "delComment"
        ></Personal>

        <div class="hr"></div>
        <flexbox v-if="hasOherShare">
          <flexbox-item>
            <tab>
              <tab-item selected @on-item-click="onItemClick(1)">全部共享</tab-item>
              <tab-item @on-item-click="onItemClick(2)">仅看我关注的人</tab-item>
            </tab>
          </flexbox-item>
        </flexbox>

        <load-more v-if="Loading" :tip="loadingText"></load-more>

        <Personal
        v-for="(item,index) in lists"
        :key="index"
        :indexKey = "index"
        :info = "item"
        :isEmptyComment = "isEmptyComment"
        @addPinglun = "addPinglun"
        @saveVote = "saveVote"
        @goMyClassHour = "goMyClassHour"
        @onPageAttention = "onPageAttention"
        @offPageAttention = "offPageAttention"
        @delComment = "delComment"
        ref = "persion"
        ></Personal>
      </mt-loadmore>
      <div class="nonebox" v-if="isShowBottom">
        <img src="./assets/empty.png">
        <h2 style="display:none;">{{tips}}</h2> 
        <divider>{{tips}}</divider>
      </div>
      <div style="display:none;">
        <divider>{{tips}}</divider>
      </div>
    </div>




    <!-- <div v-transfer-dom style="touch-action: none;">
        <div class="mask" v-if="isShow"  @click="cancel"></div>
        <group class="dialog-demo" v-if="isShow">
          <div style="padding:3px 14px;">评论</div>
          <checker v-model="currentCommentCheckArr" type="checkbox" class="fontGray paddingCommon" default-item-class="checkbox-item" selected-item-class="checkbox-item-selected">
                <checker-item :value="item" v-for="(item, index) in myinfo.items" :key="index" @on-item-click="onCheckBoxItemClick">{{item.value}}
                </checker-item>
            </checker>
          <x-textarea :max="100" name="description" :placeholder="placeholder" v-model="commentMsg"></x-textarea>
          <x-button type="submit" mini @click.native="save" style="width:100%;background-color: #3cb0e0;">完成</x-button>
        </group>                 
    </div> -->
  </div>
</template>
<style>
.page-loadmore-wrapper {
    /*overflow: scroll;*/
    overflow: auto;     /* winphone8和android4+ */
    -webkit-overflow-scrolling: touch;    /* ios5+ */
}
.nonebox {
    width: 60%;
    margin: 6em auto;
}
.nonebox img {
    width: 100%;
}
.nonebox h2 {
    color: #666;
    font-weight: normal;
    margin-bottom: 10px;
}
</style>

<script>
import { XHeader,Group, Cell, XSwitch, Alert,AlertModule, TransferDomDirective as TransferDom,Flexbox, FlexboxItem,
 Divider, XButton, Card, Checker, CheckerItem, Badge,Tab, TabItem,XTextarea,XDialog,LoadMore ,Loading  } from 'vux'
import Personal from "./components/Personal";
import {testShareList,getShareList,formatdata,getJsonpData,showBaseDataAndGetOtherData} from '@/api/sharelist'
import {getAttentionList,onAttention,offAttention} from '@/api/attention'
import {addComment,addVote,delCommentById} from '@/api/comment'
// import UXinJSInterface from '@/utils/UXinJSInterface'
import axios from 'axios'
import { setTimeout } from 'timers';
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(decodeURIComponent(unescape(r[2])));
  return null;
}
function checkLocalStorage() {
  if (!window.localStorage) {
    alert("您的手机不支持预览功能");
    return false;
  }
}

/**
 * 存储内容到localStorage
 * 【主要】如果是json格式需要encodeURI(JSON.stringify(value)),取的时候decodeURI(value)
 * @param {[String]} name  [名称]
 * @param {[String]} value [值]
 */
function setLocalStorage(name, value) {
  checkLocalStorage();
  window.localStorage.setItem(name, value);
}

function getLocalStorage(name) {
  checkLocalStorage();
  var value = window.localStorage.getItem(name);
  return decodeURI(value);
}

var debug = false

var backUrl = GetQueryString("callbackURL")
var sysClassHourId = GetQueryString("sysClassHourId")
var ksName = GetQueryString("ksName")
var classHourName = GetQueryString("classHourName")
var classTypeName = GetQueryString("classTypeName")


//需要注释的位置
// app.vue 的UXinJSInterface 和sysClassHourId
// Personal.vue的的UXinJSInterface

//20180717104603969640496978526
//20180808150756290373621092226
// sysClassHourId = "20180717104603969640496978526"
//测试环境
if(debug){
  sysClassHourId = "20180808150756290373621092226"
  // sysClassHourId = "20180808162641878765434964478"
  // sysClassHourId = "20180717104603969640496978526"
  // sysClassHourId = "20180808150843159275815917321"
  // sysClassHourId = "20180714155117615436128939328"
  //ksName = "小蝌蚪找妈妈"
  classHourName = "第一课时"
  classTypeName = "阅读课"
}




export default {
  directives: {
    TransferDom
  },
  components: {
    Personal,
    XHeader,
    Group,
    Cell,
    XSwitch,
    Alert,
    TransferDom,
    Flexbox,
    FlexboxItem,
    Divider,
    XButton,
    Card,
    Checker,
    CheckerItem,
    Badge,
    Tab,
    TabItem,
    XTextarea,
    XDialog,
    LoadMore,
    Loading
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      appid:'2129',//评价系统定义的共享圈的id(写死)
      title: '评论',
      ksName:'',
      classHourName:'',
      classTypeName:'',
      placeholder:'给这位老师说几句话吧！你的意见，很宝贵！',
      commentMsg: '',//评论内容
      isEmptyComment:false,//是否清空评论框内容
      currentCommentInfoid:'',//当前评论的infoid
      currentCommentToName:'',//当前是对哪个人的评论,对应remark
      currentCommentCheckArr:[],//当前评论投票选中的内容
      currentCommentIsMy:false,//当前评论是我的还是其他人的
      currentCommentIndex:0,//当前评论第几条
      loadingText: '正在加载',
      currentIndex: 1, //1全部共享；2仅看我的关注（默认1）
      currentPage: 1,//当前页码
      pageSize: 5,//每页显示条数
      onlyOneAd:true,//只有一个广告
      adIndex: 4,//广告的位置(从0开始)
      hasMyShare:true,//是否有我的共享
      section:'',//学段
      grade:'',//年级
      onAttentionStatus:{
        isLoad: false,
        onAttentionArr:[]
      },//已关注的人的数组
      voteId: '',//投票选项id
      voteOption:{},//投票选项内容
      headPhotoObj:{},//用户头像
      isLoading:false,
      Loading:false,//暂时没用
      isShow: false,
      show: false,
      myinfo:{
        Comment:'',//共享留言信息
        CommentList:[],//留言内容数组
        commentNum:0,//留言数量
        hasAd:false,//是否有广告
        headPhoto:'',//头像
        infoid:'',//每条共享的唯一值
        isFollow:3,//关注状态 1未关注 2关注 3默认值（未获取到关注状态）
        isMy:true,//表示本人的共享（置顶）
        items:[],//投票数组
        schoolName:'',//学校名称
        shareArea:'',//共享的位置（学校|平台）
        shareList:'',///引用人列表
        shareNum:0,//共享的数量
        shareTime:'',//共享的时间
        userAccount:'',//用户帐号
        userName:'',//用户真实名称
        ksId:'',//当前ksId
        shareSysCode:'',//系统课时ID
        shareSelfCode:''
      },
      lists:[],
      domainInfo:{
        pls_url:'',
        tms_url:'',
        ilearn_url:'',
        aux_url:'',
        vfs_url:'',
        areaCode:'',

      },
      allLoaded: false,//是否全部加载完
      autoFill: false,//不满一屏是否自动加载更多
      bottomStatus: '',
      wrapperHeight: 0,
      hasOherShare:true,//是否有其他人的动态
      isShowBottom:false,//是否展示我是有底线的
      tips:"我是有底线的",
      ksId:''
    }
  },
  methods:{
    //返回按钮
    back(){
      // window.location.href=backUrl
      // try{
      //   UXinJSInterface.saveHtmlCache("refresh","1")
      //   UXinJSInterface.closeWebView()
      // }catch(e){

      // }
      // return false;

      let pls_url = this.domainInfo.pls_url

      let url = pls_url+'/mobile/examinationAction.do?nv=classHour-classHourPack&ksId='+this.ksId+'&classHourId='+sysClassHourId
      window.location.href = url
    },
    //去我/他的课时包
    goMyClassHour(isMy,index){
      // alert('go 课时包')
      let pls_url = this.domainInfo.pls_url
      // let ut = 'ut'
      let url;
      if(isMy){
        //LianZhenzhen
        let ksId = this.myinfo.ksId
        let shareSysCode = this.myinfo.shareSysCode
        url = pls_url+'/mobile/examinationAction.do?nv=classHour-classHourPack&ksId='+ksId+'&classHourId='+shareSysCode
        window.location.href = url
      }else{
        //LiLongzhen
        let ksId = this.lists[index].ksId
        let shareSysCode = this.lists[index].shareSysCode
        let shareSelfCode = this.lists[index].shareSelfCode
        let userNameTa = this.lists[index].userAccount
        url = pls_url+'/mobile/examinationAction.do?nv=classHour-taClassHourPack&sysClassHourId='+shareSysCode+'&shareClassHourId='+shareSelfCode+'&ksId='+ksId+'&userNameTa='+userNameTa
        // UXinJSInterface.openProgressController(url);
        window.location.href = url
      }


      // UXinJSInterface.openNewWebPage('',url);
      // window.location.href = url
    },
    //切换全部和我的关注
    onItemClick(index){
      if(index != this.currentIndex){
        this.$refs.loadmore.onBottomLoaded();              
        this.currentIndex = index
        this.currentPage = 1
        this.allLoaded = false
        this.isShowBottom = false
        this.lists = []

        if(this.currentIndex == 2){
          if(this.onAttentionStatus.onAttentionArr.length == 0){
            this.allLoaded = true
            this.isShowBottom = true
            this.tips = '您还没有关注任何人！'
            // this.showAlert('您还没有关注任何人！')
            return false;
          }
        }
        this.tips = '我是有底线的'
        this.pageList()
      }
    },
    //评论弹窗
    addPinglun(isMy, infoid, toname, indexKey,commentMsg){
      //alert(index)
      // this.isShow = true;
      this.currentCommentInfoid = infoid
      this.currentCommentToName = toname
      this.currentCommentIsMy = isMy
      this.currentCommentIndex = indexKey
      this.commentMsg = commentMsg

      this.save()
    },
    //取消评论
    cancel(){
      this.isShow = false;
    },
    //评论投票选择
    // onCheckBoxItemClick(value, disabled){
    //   console.log(value, disabled)
    // },
    showAlert(msg){
      AlertModule.show({
        title: '提示',
        content: msg,
        onShow () {
          // console.log('Module: I\'m showing')
        },
        onHide () {
          // console.log('Module: I\'m hiding now')
        }
      })
      // setTimeout(() => {
      //   AlertModule.hide()
      // }, 3000)
    },
    showAlertAndHide(msg){
      AlertModule.show({
        title: '提示',
        content: msg,
        onShow () {
          // console.log('Module: I\'m showing')
        },
        onHide () {
          // console.log('Module: I\'m hiding now')
        }
      })
      setTimeout(() => {
        AlertModule.hide()
      }, 1000)
    },    
    //保存评论
    save(){
      //只少投一票才能评论
      // if(this.currentCommentCheckArr.length == 0){
      //   this.showAlert('至少投一票,才能提交!')
      //   return false
      // }


      if(this.commentMsg == ""){
        this.showAlert('评论内容不能为空！')
        return false
      }

      // this.isShow = false;
      //保存投票结果和评论内容
      let aux_url = this.domainInfo.aux_url

      let username = JSON.parse(UXinJSInterface.getUserInfo()).username
      let realName = JSON.parse(UXinJSInterface.getUserInfo()).realName
      let areaCode = JSON.parse(UXinJSInterface.getDomainInfo()).areaCode
      let addCommentUrl = aux_url+"/auxsys/addComment.jsp"



      //评论参数
      let addCommentObj = {};
      addCommentObj.moduleid = this.appid;
      addCommentObj.infoid = this.currentCommentInfoid //唯一值（根据此值更新）
      addCommentObj.infotitle = ksName+classHourName+realName+this.currentCommentToName;
      addCommentObj.area = areaCode;
      addCommentObj.content = this.commentMsg; //评论内容
      addCommentObj.username = realName;//评论人名称
      addCommentObj.remark = this.currentCommentToName //被评论人的名称
      
      addCommentUrl = addCommentUrl+"?param="+encodeURIComponent(encodeURIComponent(JSON.stringify(addCommentObj)))


      let self = this
      addComment(addCommentUrl,{},'get').then(response => {
        if(response.status == 0){
          self.isEmptyComment = false
          self.showAlert(response.message);
          return false;
        }else{
          //更新评论次数
          //向data中加入评论信息
          self.isEmptyComment = true
          let commentObj = {}
          // this.commentMsg = this.commentMsg.replace(/[\n\r]/g,'')
          // commentObj.msg = this.commentMsg
          commentObj.id = response.id
          commentObj.msg = response.content
          commentObj.toname = this.currentCommentToName
          commentObj.username = realName

          if(self.currentCommentIsMy){
            self.myinfo.CommentList.push(commentObj)
            self.myinfo.commentNum = self.myinfo.commentNum*1 + 1
            // this.$set(this.myinfo.CommentList,this.myinfo.CommentList.length,commentObj)
          }else{
            self.lists[self.currentCommentIndex].CommentList.push(commentObj)
            let num = self.lists[self.currentCommentIndex].commentNum*1
            self.lists[self.currentCommentIndex].commentNum = num +1
            // this.$set(this.lists[this.currentCommentIndex].CommentList,this.lists[this.currentCommentIndex].CommentList.length,commentObj)
          }
          setTimeout(()=>{self.isEmptyComment = false},1000)
        }
      })
    },
    //保存投票
    saveVote(infoid,id){
      this.currentCommentInfoid = infoid
      let aux_url = this.domainInfo.aux_url

      let addVoteUrl = aux_url+"/auxsys/addVoteResult.jsp"
      let areaCode = this.domainInfo.areaCode
      let realName = JSON.parse(UXinJSInterface.getUserInfo()).realName
      //投票参数
      let addVoteObj = {};
      addVoteObj.appid = this.appid;
      addVoteObj.infoid = this.currentCommentInfoid //唯一值（根据此值更新）
      addVoteObj.infotitle = ksName+classHourName+realName;
      addVoteObj.area = areaCode;
      addVoteObj.voteid = this.voteId; //投票项id
      //获取投票项数组
      // let voteOptionArr = []
      // for(let item of this.currentCommentCheckArr){
      //   voteOptionArr.push(item.id)
      // }
      // addVoteObj.opts = voteOptionArr.join(',');//投票项
      addVoteObj.opts = id

      addVoteUrl = addVoteUrl+"?param="+encodeURIComponent(encodeURIComponent(JSON.stringify(addVoteObj)))
      addVote(addVoteUrl,{},'get')
    },
    //关注
    onPageAttention(concernAccount){
      this.onAttentionStatus.onAttentionArr.push(concernAccount)

      let username = this.domainInfo.userAccount
      let params = {}
      //关注人帐号
      params.username = username
      //被关注人帐号
      params.concernAccount = concernAccount
      //关注人类型
      params.role = 3

      let ilearn_url = this.domainInfo.hdxx_url
      let onAttentionUrl = ilearn_url+"/space/concern/addConcern.action"
      let token = UXinJSInterface.string3Des("concernAccount="+concernAccount+"&role=3&username="+username)
      let str = token.substring(0,6)+token.substring(token.length-6)
      
      // let str = '5eef80b9e8a8'//测试
      // let str = '5eef80893a2e'//开发
      onAttention(onAttentionUrl, params, 'get', str)
    },
    //取消关注
    offPageAttention(concernAccount){
      let index = this.onAttentionStatus.onAttentionArr.indexOf(concernAccount)
      this.onAttentionStatus.onAttentionArr.splice(index,1)

      let username = this.domainInfo.userAccount
      let params = {}
      //关注人帐号
      params.username = username
      //被关注人帐号
      params.concernAccount = concernAccount

      let ilearn_url = this.domainInfo.hdxx_url
      let offAttentionUrl = ilearn_url+"/space/concern/deleteConcern.action"
      let token = UXinJSInterface.string3Des("concernAccount="+concernAccount+"&username="+username)
      let str = token.substring(0,6)+token.substring(token.length-6)

      //开发
      // let str = "5eef80dc8f64"
      offAttention(offAttentionUrl, params, 'get',str)
    },
    getShareListParams: function(){
      let username = this.domainInfo.userAccount
      let shareParams = {}
      

      shareParams.sysClassHourId = sysClassHourId
      shareParams.pageSize = this.pageSize
      shareParams.currentPage = this.currentPage
      shareParams.mobileFlag = 1 
      shareParams.shareCircleFlag = 1
      if(!debug){
        let schoolId = JSON.parse(JSON.parse(UXinJSInterface.getUserInfo()).yjtUserInfo).user.school.schoolId
        shareParams.schoolId = schoolId
      }

      if(this.currentIndex == 1){
        //全部共享
        shareParams.userName = username
        if(this.currentPage == 1){
          shareParams.queryMyShareFlag = 1 //是否查询我的信息
        }
      }else{
        //仅看我的关注
        shareParams.userNames = this.onAttentionStatus.onAttentionArr.join(",")
      }
      return shareParams
    },
    //分页查询
    pageList(){
      //获取共享圈数据
      let pls_url = this.domainInfo.pls_url

      let shareListUrl = pls_url+"/interface/queryShareClassHour.do"
      let shareParams = this.getShareListParams()

      this.isLoading = true
      
      let self = this;
      setTimeout(function(){
        getShareList(shareListUrl,shareParams,'get').then(response => {
          self.isLoading = false
          if(self.currentIndex == 2){
            if(response.shareClassHourList.length == 0){
              self.allLoaded = true
              self.isShowBottom = false
              //self.showAlert('您关注的人还没有发表任何动态！')
              self.tips = '你关注的人暂无共享！'
            }
          }else{
            if(self.currentPage == 1){
              if(response.myShareClassHour){
                self.ksId = response.myShareClassHour.ksId
              }else{
                if(response.shareClassHourList.length >0 ){
                  self.ksId = response.shareClassHourList[0].ksId
                }
              }

              if(response.shareClassHourList.length == 0 ){
                self.allLoaded = true
                self.isShowBottom = true
                self.hasOherShare = false
                self.tips = '暂无其他人发表动态！'
                //self.showAlert('暂无其他人发表动态！')   
              }
            }
          }
          showBaseDataAndGetOtherData(self,response)
          if(self.currentPage>1){
            self.$refs.loadmore.onBottomLoaded();
          }
        }).catch((error) => {

        })
      },0)
    },
    //删除评论
    delComment(isMy,indexKey,currentCommentIndex){
      console.log(indexKey+"|"+currentCommentIndex)
      let commentid;
      if(isMy){
        commentid = this.myinfo.CommentList[currentCommentIndex].id
      }else{
        commentid = this.lists[indexKey].CommentList[currentCommentIndex].id
      }

      //调用删除接口
      let aux_url = this.domainInfo.aux_url
      // auxsys_url = 'http://192.168.148.82'
      let delCommentUrl = aux_url+"/auxsys/delComment.jsp?commentid="+commentid

      let self = this
      delCommentById(delCommentUrl,{},'get').then(response => {
        if(response.status == 1){
          if(isMy){
            self.myinfo.CommentList.splice(currentCommentIndex,1)
            self.myinfo.commentNum = self.myinfo.commentNum - 1
          }else{
            self.lists[indexKey].CommentList.splice(currentCommentIndex,1)
            let num = self.lists[self.currentCommentIndex].commentNum
            self.lists[self.currentCommentIndex].commentNum = num - 1
          }
        }
      })
    },
    ok(){
      this.Loading=false
    },
    test(){
      console.log('------')
      return 'x'
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    loadBottom() {
      console.log('down')
      this.currentPage++;
      let self = this;

      this.pageList()
    }     
  },
  created(){
    // let obj = {}
    // var self = this;

    // testShareList(myinfoUrl,obj,'get').then(response => {
    //   self.myinfo = response
    // })
    // testShareList(otherListUrl,obj,'get').then(response => {
    //   self.lists = response
    // })

    // testShareList(attentionListUrl,obj,'get').then(response => {
    //   console.log(response)
    // })

    // self.ok()
    // return false;
    // this.pageList()
    
    // this.ok()
  },
  mounted(){
    window.localStorage.clear(); 
    if(ksName == null){
      ksName = getLocalStorage('sharecircle_ksname')
    }else{
      setLocalStorage('sharecircle_ksname',ksName)
    }

    if(classHourName == null){
      classHourName = getLocalStorage('sharecircle_classhourname')
    }else{
      setLocalStorage('sharecircle_classhourname',classHourName)
    }
    
    if(classTypeName == null){
      classTypeName = getLocalStorage('sharecircle_classtypename')
    }else{
      setLocalStorage('sharecircle_classtypename',classTypeName)
    }    

    
    if(ksName == 'null'|| ksName == 'undefined'|| typeof ksName == 'undefined'){
      ksName = ""
    }

    if(classHourName == 'null'|| classHourName == 'undefined'|| typeof classHourName == 'undefined'){
      classHourName = ""
    }

    if(classTypeName == 'null'|| classTypeName == 'undefined'|| typeof classTypeName == 'undefined'){
      classTypeName = ""
    }    



    let pls_url = JSON.parse(UXinJSInterface.getDomainInfo()).pls_url
    let vfs_url = JSON.parse(UXinJSInterface.getDomainInfo()).vfs_url
    let tms_url = JSON.parse(UXinJSInterface.getDomainInfo()).tms_url
    let hdxx_url = JSON.parse(UXinJSInterface.getDomainInfo()).hdxx_url
    let aux_url = JSON.parse(UXinJSInterface.getDomainInfo()).auxsys_url
    let areaCode = JSON.parse(UXinJSInterface.getDomainInfo()).areaCode
    let userAccount = JSON.parse(UXinJSInterface.getUserInfo()).username


    if(aux_url == null || typeof(aux_url) == 'undefined'){
      aux_url = 'https://auxsys.czbanbantong.com'
    }

    this.domainInfo.pls_url = pls_url
    this.domainInfo.vfs_url = vfs_url
    this.domainInfo.tms_url = tms_url
    this.domainInfo.hdxx_url = hdxx_url
    this.domainInfo.aux_url = aux_url
    this.domainInfo.areaCode = areaCode
    this.domainInfo.userAccount = userAccount


    
    this.pageList()

    this.ksName = ksName
    this.classHourName = classHourName
    this.classTypeName = classTypeName
    setTimeout(() => {
      // alert(document.documentElement.clientHeight)
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    },500)
  }
}
</script>

<style>
body {
  background-color: #fff;
  margin: 0;
  padding: 0;
}
#app{
  background-color: #fff;
}

</style>

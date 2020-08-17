<template>
  <div>
    <x-header title="共享圈"  @click.native="back()" style="background-color:#3cb0e0;"></x-header>
    <div class="banner">
      <div class="pad010">
        <flexbox>
          <flexbox-item class="banner-right">
            <div>2小蝌蚪找妈妈</div>
            <div>第一课时 阅读课</div>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <Personal
    :info = "myinfo"
    @addPinglun = "addPinglun"
    @goMyClassHour = "goMyClassHour"
    ></Personal>

    <flexbox>
      <flexbox-item>
        <tab>
          <tab-item selected @on-item-click="onItemClick(0)">全部共享</tab-item>
          <tab-item @on-item-click="onItemClick(1)">仅看我关注的人</tab-item>
        </tab>
      </flexbox-item>
    </flexbox>

    <load-more v-if="Loading" :tip="loadingText"></load-more>
  
    <Personal
    v-for="(item,index) in lists.slice(0,2)"
    :key="index"
    :info = "item"
    @addPinglun = "addPinglun"
    @goMyClassHour = "goMyClassHour"
    @onPageAttention = "onPageAttention"
    @offPageAttention = "offPageAttention"
    ></Personal>

    <!--广告位开始-->
    <flexbox>
      <flexbox-item>
        <div style="margin: 10px;">
          <masker style="border-radius: 2px;" :opacity="0.1">
            <div class="m-img" style="background-image:url(https://vfszz.zzedu.net.cn//A01/A01074/A01074002/A01074002001/2018_12/12/affix/1544597179394.jpg);height:130px;background-size:cover;background-repeat:no-repeat;"></div>
          </masker>
        </div>
      </flexbox-item>
    </flexbox>

    <!--广告位结束 -->

    <Personal
    v-for="item in lists.slice(2,3)"
    :key="item.userName"
    :info = "item"
    @addPinglun = "addPinglun"
    @goMyClassHour = "goMyClassHour"
    @onPageAttention = "onPageAttention"
    @offPageAttention = "offPageAttention"
    ></Personal>


    <div v-transfer-dom style="touch-action: none;">
        <div class="mask" v-if="isShow"  @click="cancel"></div>
        <group class="dialog-demo" v-if="isShow">
          <div style="padding:3px 14px;">评论</div>
          <checker type="checkbox" class="fontGray paddingCommon" default-item-class="checkbox-item" selected-item-class="checkbox-item-selected">
                <checker-item :value="item" v-for="(item, index) in myinfo.items" :key="index" disabled>{{item.value}}({{item.count}})
                </checker-item>
            </checker>
          <x-textarea :max="200" name="description" :placeholder="placeholder"></x-textarea>
          <x-button type="submit" mini @click.native="save" style="width:100%;background-color: #3cb0e0;">完成</x-button>
        </group>                 
    </div>
  </div>
</template>

<script>
import { XHeader,Group, Cell, XSwitch, Alert, TransferDomDirective as TransferDom,Flexbox, FlexboxItem,
 Divider, XButton, Card, Checker, CheckerItem, Badge,Tab, TabItem,XTextarea,XDialog,LoadMore,Masker   } from 'vux'
import Personal from './Personal'
import {testShareList,getShareList,formatdata,getJsonpData} from '@/api/sharelist'
import {getAttentionList,onAttention,offAttention} from '@/api/attention'
import UXinJSInterface from '@/utils/UXinJSInterface'

function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(decodeURI(unescape(r[2])));
  return null;
}

var sysClassHourId = GetQueryString("GetQueryString")

var debug = "dev";
if (debug == "dev") {
  var myinfoUrl = "api/myinfo"
  var otherListUrl = "api/otherList"
  var getShareListUrl = 'http://plsllz.czbanbantong.com/pls6/interface/queryShareClassHour.do?sysClassHourId=20180717104603969640496978526&userName=3401010000010001&pageSize=6&currentPage=1&mobileFlag=1&shareCircleFlag=1&queryMyShareFlag=1'
  var getMyshareUrl = "api/myinfo"
  var shareListUrl = "api/shareList"
  //关注url
  var attentionListUrl = "http://ilearnvcomyf.czbanbantong.com/space/concern/concernList.action?username=3401010000010002"
  var onAttentionUrl = "http://ilearnvcomyf.czbanbantong.com/space/concern/addConcern.action"
  var offAttentionUrl = "http://ilearnvcomyf.czbanbantong.com/space/concern/deleteConcern.action"
  //获取用户中心头像
  var headPhotoUrl = "http://tmsvcomyf.czbanbantong.com/tms/interface/queryTeacher.jsp"

  //评价系统
  var commentListUrl = "http://auxnat.yjt361.com/auxsys/getCommentList.jsp";
}else{

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
    Masker
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      title: '评论',
      placeholder:'给这位老师说几句话吧！你的意见，很宝贵！',
      loadingText: '正在加载',
      pageCurrent: 1,//当前页码
      pageSize: 5,//每页显示条数
      Loading:true,
      isShow: false,
      show: false,
      myinfo:{  
      },
      lists:[]  
    }
  },
  methods:{
    //返回按钮
    back(){
      window.location.href="http://www.baidu.com"
    },
    //去我的课时包
    goMyClassHour(index){
      alert('go 课时包')
    },
    //切换全部和我的关注
    onItemClick(index){
      // alert(index)
    },
    //评论弹窗
    addPinglun(index){
      //alert(index)
      this.isShow = true;
    },
    //取消评论
    cancel(){
      this.isShow = false;
    },
    //保存评论
    save(){
      this.isShow = false;
    },
    //关注
    onPageAttention(concernAccount){
      let params = {}
      //关注人帐号
      params.username = myinfo.userAccount
      //被关注人帐号
      params.concernAccount = concernAccount
      //关注人类型
      params.role = 3
      onAttention(onAttentionUrl, params, 'get')
    },
    //取消关注
    offPageAttention(concernAccount){
      let params = {}
      //关注人帐号
      params.username = myinfo.userAccount
      //被关注人帐号
      params.concernAccount = concernAccount
      offAttention(offAttentionUrl, params, 'get')
    },
    ok(){
      setTimeout(() => {
        this.Loading=false
      },2000)
    }
  },
  created(){
    let obj = {}

    var self = this;

    testShareList(myinfoUrl,obj,'get').then(response => {
      self.myinfo = response
    })
    testShareList(otherListUrl,obj,'get').then(response => {
      self.lists = response
    })

    testShareList(attentionListUrl,obj,'get').then(response => {
      console.log(response)
    })

    self.ok()

    
    console.log(sysClassHourId)
    return false;
    let shareListUrl = "http://plsllz.czbanbantong.com/pls6/interface/queryShareClassHour.do"
    let shareParams = {}
    //sysClassHourId=20180717104603969640496978526&userName=3401010000010001&pageSize=6&currentPage=1&mobileFlag=1&shareCircleFlag=1&queryMyShareFlag=1
    shareParams.sysClassHourId = '20180717104603969640496978526'
    shareParams.userName = '3401010000010001'
    shareParams.pageSize = 6
    shareParams.currentPage = 1
    shareParams.mobileFlag = 1
    shareParams.shareCircleFlag = 1
    obshareParamsj.queryMyShareFlag = 1
    console.log(getShareListUrl)
    getShareList(shareListUrl,shareParams,'get').then(response => {
      let objTmp = formatdata(response)

      self.myinfo = objTmp.myShareObj
      self.lists = objTmp.otherShareArr
      //获取用户头像列表
      getTmsHeadPhoto(objTmp.headPhotoArrs).then(response => {
        let headPhotoData = response.rtnArray
        let vfs_url = JSON.parse(UXinJSInterface.getDomainInfo()).vfs_url
        if(response && headPhotoData && headPhotoData.length > 0){
          for(let index=0; index < headPhotoData.length; index++){
            if(index == 0){
              self.myinfo.headPhoto = vfs_url + headPhotoData[0].headPhoto
            }else{
              self.lists[index].headPhoto = vfs_url + headPhotoData[0].headPhoto
            }
          }
        }
      })
      //获取关注列表
      getAttentionList(attentionListUrl,obj,'get').then(response => {
        if(response && response.length > 0){
          for(let index = 0; index < response.length; index++){

          }
        }
      })
      // 获取评论列表
      var commentObj = {};
      commentObj.moduleid = '1001';
      commentObj.infoid = '20180726155057673543795026155';//字符串分割
      commentObj.area = '2020';
      commentObj.start = 1;
      commentObj.limit = 50;
      var commentObjTmp = {}
      commentObjTmp.param = +encodeURIComponent(encodeURIComponent(JSON.stringify(commentObj)))
      getCommentList(commentListUrl,commentObjTmp,'get').then(response => {
        //循环赋值评论
      })


      self.ok()
    }).catch((error) => {

    })
  }
}
</script>

<style>
.vux-demo {
  text-align: center;
}
.logo {
  width: 100px;
  height: 100px
}


.flex-demo {
  text-align: center;
  color: #fff;
  background-color: #20b907;
  border-radius: 4px;
  background-clip: padding-box;
}
</style>

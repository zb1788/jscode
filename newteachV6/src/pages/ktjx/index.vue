<template>
<div class="brbox">

  <div class="flex1">
    <div class="nrbox">
      <div v-for="(item,index) in resList" :key="index">
        <div :class="[item.rmsShowType ==2 ?'org ':item.rmsShowType ==3?'green':'','nrcard' ]" style="cursor: pointer;"  abc="aaa" @click="classHourClick(item)" __VCOM_ANALYTICS_CLICK :__VCOM_ANALYTICS_PARAM_INFO='JSON.stringify({r_type:item.rtype,r_id:item.rcode})'>
          <div class="flex1-c">

						 <h3><span class="nrfl">{{item.title}}</span>
               <div class="nrfr"> 
	              <span v-if="item.isHost"><i class="ico-jing"></i></span>            
                </div>
              </h3>
            <div class="flex1 posR">

							<div class="nrimg">
                <!-- <img src="../../assets/images/ppt.png" /> -->
                <img :src="item.iconType" />
              </div>
              <div class="nrwz">
                <label style="cursor:pointer" class=jieduan-db>{{item.desc}}</label>
              </div>

							 <div class="bbut" @click.stop="stopClick()" v-show="item.isShowButton" style="background: #7d7c7c;">              
              
              <template v-for="(buttonItem,i) in item.button">
                <button v-if="buttonItem.pvname !='undefined' && buttonItem.pvname !=''" :__VCOM_ANALYTICS="buttonItem.pvname" __VCOM_ANALYTICS_CLICK style="cursor:pointer" :key="i" @click.stop="buttonClick(buttonItem)">{{buttonItem.name}}</button>
                <button v-else style="cursor:pointer" :key="i" @click.stop="buttonClick(buttonItem)">{{buttonItem.name}}</button>
              </template>							  

							</div>
              <label class="ico-jjj" style="cursor:pointer"  @click.stop="showButton(index)"><i :class="item.isShowPlus?'ico-jia':item.isShowJian?'ico-jian':''"></i></label>              
            </div>
          </div>

        </div>
      </div>

      <div v-if="isLoad">
        <div class="nrcard gray" style="cursor: pointer;">
          <div class="flex1-c">
            <div class="flex1 afterborder1" @click="openPaper" __VCOM_ANALYTICS="tls_ktjx_znzj" __VCOM_ANALYTICS_CLICK>
              <span class="znbtn">智能组卷</span>
            </div>
            <div class="flex1" @click="goMore" __VCOM_ANALYTICS="tls_ktjx_gdzy" __VCOM_ANALYTICS_CLICK> 
              <span class="znbtn">更多</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>

    <!-- 文件探究 弹窗 -->
  <SendPadNewteach 
  :downloadUrl="tanjiuObj.downloadUrl" 
  :format="tanjiuObj.format" 
  :rcode="tanjiuObj.rcode" 
  :filename="tanjiuObj.filename" 
  @sendPadClose="sendPadClose" 
  :dialogVisiable="sendPadDialogVisible" />
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatClassHourRes ,getTqmsClassHourRes,updateTqmsClassHourRes} from '@/api/ktjx'
import commonUtils from '@/utils/common'
import BannerNewteach from '@/components/BannerNewteach'
import { click,openTqmsPracticePaper } from '@/api/click'
import {AUTH_TOKEN_NAME,AUTH_TIME_NAME,AUTH_UT_NAME,ABLEFORMAT} from '@/api/constant'
import { getDomainConfigFromGwApi, refreshTokenApi } from '@/api/interface'
import { setToken,getToken, setLoginStyle,getRefreshToken,getAccessTokenTime} from '@/utils/auth'
import { getDownLoadUrl } from '@/api/play'
import SendPadNewteach from '@/components/SendPadNewteach'

export default {
  name: 'ktjx',
  components:{
    BannerNewteach,
    SendPadNewteach
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      resList: [],
      isLoad: false, //是否展示智能组卷
      tanjiuObj:{
          filename:'',
          rcode:'',
          format:'',
          downloadUrl:''
      },
      sendPadDialogVisible:false,
    }
  },
  computed: {
    ...mapGetters([
        'ksId',
        'classHourId',
        'domainConfig',
        'userSelectClassId',
        'isHavingClass',
        'teacherNumber'
    ])
  },
  watch: {
    classHourId(newVal, oldVal){
      //课时发生变化重刷列表
      if(newVal != oldVal){
        //有课时id才获取课时包的数据
        this.getList()
      }
    },
    ksId(newVal, oldVal){
      //课时发生变化重刷列表
      if(newVal != oldVal){
        //有课时id才获取课时包的数据
        // this.getList()
      }
    },
    userSelectClassId(val){
      //班级发生变化重刷列表
      if(val != ''){
        this.getList()
      }
    },
    isHavingClass(newVal, oldVal){
      //上课状态发生变化重刷列表
      if(newVal != oldVal){
        this.getList()
      }
    }
  },
  mounted(){
    this.getList()  
    let self = this
    //智能组卷回调
    window.addEventListener('doZnzj', this.goXunLian)
    //训练作答关闭重刷当前页面
    window.addEventListener('doXlzd', this.getList)
    //训练发到平板回调，打开反馈页面  
    window.addEventListener('doXlfankui', this.openFankui)
  },
  destroyed(){
    console.log('delstory')
    window.removeEventListener('doZnzj', this.goXunLian)
    window.removeEventListener('doXlzd', this.getList)
    window.removeEventListener('doXlfankui', this.openFankui)
  },
  methods: {
    //训练发到平板回调，打开反馈页面  
    openFankui(e){
        let obj = e.detail
        let params = {}        
        if(obj.rsType == 9){
          params.playName = 'fankuiEng'
        }else{
          params.playName = 'fankui'
        }
        params.params = {"rsType":obj.rsType,"rcode":obj.rcode,"isEbook":1}//发送到平板的反馈写死1

        console.log(params)
        click(params)
    },
    //智能组卷回调
    goXunLian(){
      this.$router.push({path:'/ktjx/more?index=2'})
    },
    async getList(){      
      if(this.userSelectClassId == ''||this.classHourId == ''){
        console.log('xxxx')
        this.isLoad = true
        return false
      }
      
      this.$store.dispatch('setAjaxControlFullScreen',false)
      this.$store.dispatch('setFullScreen',true)

      try{
        let res = await formatClassHourRes()
        console.log(res)
        // this.resList = res.resList

        let tqmsParamsArr = res.tqmsParamsArr
        let resClassHour = res.resClassHour
        let tqmsAppTypeIdArr = res.tqmsAppTypeIdArr
        let tqmsResArr = await getTqmsClassHourRes(tqmsParamsArr,resClassHour)
        let resArr = updateTqmsClassHourRes(res.resList,tqmsResArr,tqmsAppTypeIdArr)
        this.resList = resArr.filter(item=>item.isDel == false)
        console.log('aaaaaaaaaaaaaabbbbbbbbbbbbbb')
        this.isLoad = true
      }catch(e){
        this.isLoad = true
        this.$messageteach.error('数据获取失败，请重试或者检查网络')
        commonUtils.console(e,'获取课时包资源失败')
      }finally {        
        //强制关闭应用和选课的背景遮罩，防止有时候遮罩无法关闭
        this.$store.dispatch('setDialogFilter',false)
        this.$store.dispatch('setFullScreen',false)
        this.$store.dispatch('setAjaxControlFullScreen',true)
      }
    },
    //进入更多
    async goMore(){
      this.$router.push({path:'/ktjx/more'})            
      // let res = await aaa();
      // let res1 = await bbb();
    },
    //打开智能组卷
    async openPaper(){
      // window.open('/page_proxy/#/pad/index?type=sign')
      //window.open('#/play/index?rcode=20170214183333894191718737625&resType=1&ut=54a3fc67734d47d2a744d22535ad54abdb4d0b87ed0c9e315b8e2f66b0c38f25e7964ab0ac0ca7d5&teacherNumber=41010100010128')
      //  VcomTeach.openNewBrowser('#/play/index?rcode=20170214183333894191718737625&resType=1&ut=54a3fc67734d47d2a744d22535ad54abdb4d0b87ed0c9e315b8e2f66b0c38f25e7964ab0ac0ca7d5&teacherNumber=41010100010128','xpos=600&ypos=600&width=800&height=600');
      // console.log(VcomTeach.getVcomTeachVersion())
      // console.log(VcomTeach.getAllDeviceInfo())
      // VcomTeach.openNewBrowser('/page_proxy/#/pad/index?type=sign')
        //       let loginInfo = VcomTeach.getLoginInfo()
        //       console.log(loginInfo)
        // let loginObj = JSON.parse(loginInfo)
        // console.log(loginObj)
        this.resetBottomButton(-1)
      openTqmsPracticePaper(this.ksId,this.teacherNumber)
    },
    //点击加号
    showButton(index){
      this.resetBottomButton(index)
      this.resList[index].isShowButton = !this.resList[index].isShowButton
      this.resList[index].isShowPlus = !this.resList[index].isShowPlus
      this.resList[index].isShowJian = !this.resList[index].isShowJian
    },
    //重置下方展开的按钮条,i需要跳过的index
    resetBottomButton(i){
      for(let index=0;index<this.resList.length;index++){
        if(index == i){
          continue
        }
        if(this.resList[index].button.length > 0){
          this.resList[index].isShowButton = false
          this.resList[index].isShowPlus = true
          this.resList[index].isShowJian = false  
        }      
      }
    },
    //点击某个课时包
    classHourClick(item){
      this.resetBottomButton(-1)
      click(item.playJs)
    },
    //点击按钮
    async buttonClick(item){
      console.log(item)
      this.resetBottomButton(-1)
      if(item.type == 'zuoda'){
        click(item.params)
      }else if(item.type == 'zuodaEng'){
        click(item.params)
      }else if(item.type == 'fankui'){
        click(item.params)
      }else if(item.type == 'fankuiEng'){
        click(item.params)
      }else if(item.type == 'dengfen'){
        let params = {}
        params.playName = 'dengfen'
        params.params = item.params
        click(params)
      }else if(item.type == 'sendToPad'){
        //题库试卷发到平板
        let params = {}
        params.playName = 'sendToPad'
        params.params = item.params
        click(params)
      }else if(item.type == 'sendToPadEng'){
        //英语练试卷发到平板
        let params = {}
        params.playName = 'sendToPadEng'
        params.params = item.params.params
        click(params)
      }else if(item.type == 'wenjiantanjiu'){
        let params = item.params

        if(ABLEFORMAT.indexOf(","+params.formatMark+",")==-1)
        {
            this.$messageteach.error("暂不支持"+params.formatMark+"格式的文件！");
            return;
        }
        
        this.tanjiuObj.rcode = params.rcode
        this.tanjiuObj.filename = params.title + '.' + params.formatMark
        this.tanjiuObj.format = params.formatMark
        //获取负载地址

        let obj = {}
        obj.rcode = params.rcode
        obj.resType = params.fileType
        obj.RFormatMark = params.formatMark
        if(typeof params.linkType != 'undefined'){
            obj.linkType = params.linkType
            obj.linkValue = params.linkValue
        }        
        let res = await getDownLoadUrl(obj,this)           
        this.tanjiuObj.downloadUrl = res
        if(res == ''){
            // this.$messageteach.error('获取不到负载地址')
            return false
        }        
        this.sendPadDialogVisible = true
      }
    },
    //探究弹窗关闭
    sendPadClose(){
        this.sendPadDialogVisible = false
    },
    stopClick(){
      return false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .nrcard {background: #fff; display: block; position: relative; flex:1}
.nrcard>label {padding: 0 5px; font-weight: bold;} */
.afterborder1 {border-bottom: solid 1px #ddd;}
.flex1-c {display: flex; flex-direction: column; flex: 1;}
.el-main {display: flex; flex-direction: column;}
.flex1 {flex:1;display: flex;}
.nrbox{ flex: 1; flex-wrap: wrap; margin: 0 -5px;}
.nrbox>div {width: 25%; flex:none; padding:0.5vh 1vw; display: flex; box-sizing: border-box; height: 19vh; float: left;}
.nrcard {background: #fff; flex:1; display: flex; flex-direction: column; border-radius: 1vh; overflow: hidden;}

.nrcard:before {content: ""; display: block;width: 100%; height: 1vh;    background:#409eff;    box-shadow: 1px 5px 20px #7dbcff; }
.nrcard.gray:before{   background: #ddd;    box-shadow:none;}

.nrcard.org:before{   background: #f98a14;    box-shadow: 1px 5px 20px #f09433;}

.nrcard.green:before{   background: #16b262;    box-shadow: 1px 5px 20px #51e297;}

h3 {padding:0 2vh; line-height: 3rem; height: 3rem;    font-size: 1rem;    color: #484848;text-align:left;font-weight:600;white-space: nowrap;word-break: normal;overflow: hidden;text-overflow: ellipsis;  margin: 0; border-bottom: solid 1px #efefef;}

.tabottom {position: relative; line-height:3vh; height:5vh;text-align: left;   padding:1vh 0vh 1vh 2vh; color: #999;}
.nrimg {    width: 9vw; max-width: 9vh; padding:1vh 0 1vh 2vh; vertical-align: middle; align-self:center}
.nrimg>img {width: 100%; display: block; margin: 0 auto;}
.nrwz {padding: 5px; align-self:center; flex: 1;}
.tabottom>span {padding-right:5px; font-size: 0.8rem;}
.tabottom>span>i {margin-right: 5px;}
.jieduan-db {    font-size: 0.9rem;
    line-height: 1.5rem;
    overflow: hidden;
    max-height: 3rem;
    padding: 0 1vh;
    word-break: break-word;
    text-align: left;
    display: block;
    color: #787878;}
.flex-center {align-items: center; align-self:center;}
.znbtn { align-self: center; flex: 1;}

.posR{position: relative;}

.nrfr{float: right; display: inline-block; font-size: 0.8rem;   
    vertical-align: middle;}
.nrfl{float: left; display: inline-block; white-space: nowrap; overflow: hidden; max-width: 60%; text-overflow: ellipsis; line-height:3rem;
    vertical-align: middle;}
.bbut{
    position: absolute;
    background: #333;
    filter: alpha(opacity=90);
    opacity: 0.9;
    z-index: 6;
    bottom: 0;
    left: 0;
    right: 0;
    height: 5vh;
		line-height: 5vh;
		padding:0 0.5rem;
}
.posR .ico-jjj{    
    position: absolute ;

    right: 0;
    z-index: 11;
    bottom: 0;
    display: block;
    color: #409EFF;
}

.edibox .bbut button {background: none; min-width: 25%; color: #fff; vertical-align: middle; line-height: 5vh; float:left; border: 0; font-size: 0.8rem;}

.el-tag {display: inline-block; margin: 0; }

.el-tag--mini {height:3vh; line-height:3vh; font-size: 0.6rem; margin-left: 1vh;}
@media (min-width:1900px) {

}
</style>

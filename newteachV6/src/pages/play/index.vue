<template>
    <div id="playDiv">
        <Download v-if="downloadFlag" :isVcomTeach="isVcomTeach" :downurl="playUrl" :playUrls="playUrls" :playItems="playItems" :fileName="fileName"></Download>
        <!--<el-progress :percentage="80" color="#8e71c7"></el-progress>
        <Flash :flashSrc="flashSrc"></Flash>
        <iframe v-if="infoTypeFormat==2" :src="flashSrc" width="100%" height="500" frameboder="0"  border="0" id="playFlashIframe"></iframe>
        <iframe v-if="infoTypeFormat==7" :src="playUrl" width="100%" height="500" frameborder="0" scrolling="auto"></iframe>
        <iframe v-if="infoTypeFormat==6" :src="playUrl" width="100%" height="500" frameborder="0" scrolling="auto"></iframe>
        <VueAudio></VueAudio>-->
        <Flash v-if="infoTypeFormat==2"  :playItems="playItems" :isVcomTeach="isVcomTeach" :infoTypeFormat="infoTypeFormat"></Flash>       
        <Pdf v-if="infoTypeFormat==7&&canPlayPdf" :pdfSID="pdfSID" :resType="resType" :pdfSrc="playUrl" :isVcomTeach="isVcomTeach" :fileName="fileName"></Pdf>
        <Txt v-if="infoTypeFormat==6&&resType==1&&!linkFlag" :txtSrc="playUrl" :isVcomTeach="isVcomTeach" :fileName="fileName"></Txt>
        <Images v-if="infoTypeFormat==1" :playUrls="playUrls" :playItems="playItems" :isVcomTeach="isVcomTeach"></Images>
        <MP3 v-if="infoTypeFormat==5"  :playItems="playItems" :isVcomTeach="isVcomTeach"></MP3>
        <MP4 v-if="infoTypeFormat==4||resType==5||resType=='bdwk'" :mp4Src="playUrl" :fileName="fileName" :isVcomTeach="isVcomTeach"></MP4>
        <Dzjc v-if="infoTypeFormat==12" :playUrls="playUrls"  :isVcomTeach="isVcomTeach" :rcode="rcode" :teacherNumber="teacherNumber" :ksId="ksId"></Dzjc>
        <Vod v-if="infoTypeFormat==3||resType=='live'" :isVcomTeach="isVcomTeach" :vodSrc="playUrl" :fileName="fileName"></Vod>
        <Link v-if="linkFlag" :playUrl="playUrl" :linkType="linkType" :ut="ut"></Link>
        <yj-newteach-button type="danger" v-if="isVcomTeach&&infoTypeFormat!=12" id="yjCloseButton" icon="el-icon-close" @click="close" circle style="position: absolute; right: 0vh; bottom: 0vh;z-index:3000;"></yj-newteach-button>        

    </div>
</template>

<script>
import {playHelper,loadPlayLive} from '@/api/play'
import { mapGetters } from 'vuex'
import Images from './image'
import MP3 from "./mp3";
import MP4 from "./mp4";
import VueAudio from "./VueAudio";
import Download from "./download";
import Flash from "./flash";
import Pdf from "./pdf";
import Txt from "./txt";
import Dzjc from "./dzjc";
import Vod from "./vod";
import Link from "./link";
import { yjNewteachButton} from 'newteach-ui'
export default {
    name: 'play',
    data(){
        return {
            rcode:'',//资源编码
            resType:1,//资源类型1基础资源3教师文件夹资源5微课资源
            resFormat:'',//资源格式
            infoTypeFormat:'',//资源格式对应编码
            isVcomTeach:false,//是否授课客户端
            pdfSID:'',//PDF播放需要
            canPlayPdf:false,//是否可以播放pdf
            downloadFlag:false,//下载标识，该标识为true则走下载流程
            playUrl:'',//负载地址
            playUrls:[],//负载地址数组
            playItems:[],//负载文件对象数组
            fileName:'',//文件名
            imageFormat:'JPG,PNG,GIF,JPEG,BMP',//支持的图片格式
            vodFormat:'FLV,264TS,264AVI',//系统支持的视频格式
            teacherNumber:'',//教师账号，通过url传递
            ut:'',//用户认证标识，通过url传递,
            linkFlag:false,//是否链接资源
            ksId:'',//目录编码
            linkType:0//链接类型
        }  
    },
    created () {
        this.playInit();
    },
    watch: {
      playUrl(val) {
          //alert(val)
        this.playUrl = val;
      },
      infoTypeFormat(val){
          if(val==1){
              if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach()){
                  VcomTeach.setWndSize(0,0,0,0);
              }
          }
      }
    },
    mounted() {
        
    },
    methods: {
    playInit:function(){
        if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach()){
             this.isVcomTeach=true;
        }
        this.rcode=this.$route.query.rcode;
        this.teacherNumber=this.$route.query.teacherNumber;
        this.ut=this.$route.query.ut;
        this.resType=this.$route.query.resType;
        this.resFormat=this.$route.query.resFormat;
        this.ksId=this.$route.query.ksId;
         //this.rcode="20180808153425014395641237272";
         //this.resType=1;
         console.log("rcode="+this.rcode+"restype="+this.resType)
         if(this.resFormat){//非pls系统的播放,需要传递资源格式，负载地址，文件名  
              this.playUrl= decodeURIComponent(decodeURIComponent(this.$route.query.playUrl));
              this.fileName=this.$route.query.fileName;
              this.playUrls.push(this.playUrl);
              var tempIndex=this.playUrl.lastIndexOf("/",this.playUrl);
              this.fileName=this.playUrl.substring(tempIndex+1,this.playUrl.length);
              var item={};
              item.name=this.fileName;
              item.url=this.playUrl;
              this.playItems.push(item);
              console.log(this.playItems)
              if(this.imageFormat.indexOf(this.resFormat.toUpperCase())>=0){
                  this.infoTypeFormat=1;
              }else if(this.resFormat.toUpperCase()=="SWF"){
                  this.infoTypeFormat=2;
              }else if(this.vodFormat.indexOf(this.resFormat.toUpperCase())>=0){
                  this.infoTypeFormat=3;
              }else if(this.resFormat.toUpperCase()=="MP4"){
                  this.infoTypeFormat=4;
                  //this.resType=1;
              }else if(this.resFormat.toUpperCase()=="MP3"){
                  this.infoTypeFormat=5;
              }else if(this.resFormat.toUpperCase()=="TXT"){
                  this.infoTypeFormat=6;
                  this.resType=1;
              }else if(this.resFormat.toUpperCase()=="HTML"){
                  this.linkFlag=true;
              }else{  
                  this.downloadFlag=true;
              }
         }else{
            this.getLoadAddress();
         }
    },
    getLoadAddress: function () {
        //debugger
        
        if(this.resType=="live"){
            loadPlayLive(this.rcode,this);   
        }else{
            playHelper(this.rcode,this.resType,this);
        }
    },
    close:function(){

        if(this.downloadFlag){
            if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach()){
             try{
                 VcomDownOcx.stopDownload();
             }catch(e){
                 console.log("调用停止下载方法异常"+e);
             }
            }
        }

        window.close();
    }
    },
     components: {
         Images,MP3,MP4,VueAudio,Download,Flash,Pdf,Txt,Dzjc,Vod,yjNewteachButton,Link
     },  
    
}
</script>

<style>
#playDiv{height: 100%;}
</style>

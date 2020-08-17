<template>
    <div id="dzjcDiv">

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {checkDomainConfig} from '@/permission'
import { click } from '@/api/click'
export default {
    computed: {
        ...mapGetters([
          
        ])
    }, 
  name: "dzjc",
    watch:{
       playUrls(val){
           //alert(val[0])
           this.loadVcomEFlash(val[0]);
       }
    },
    data(){
        return {
           

        }
    },
    mounted(){
        if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach()){
             VcomTeach.setWndSize(0,0,0,0) // 最大化
        }
        this.initStore();
    },
    props:["playUrls","rcode","teacherNumber","ksId"],
    methods: {
       //vcom 电子教材加载逻辑
        loadVcomEFlash:function (path){		           
            //var flashh=document.documentElement.clientHeight;
            var flashh=window.screen.height;
            //var flashw=document.documentElement.clientWidth;
            var flashw=window.screen.width;
            
            var mtop=0;
            document.getElementById("dzjcDiv").style.height=flashh*0.95;
            document.getElementById("dzjcDiv").style.width=flashw;
            var dzjccode='<div style="height:'+flashh*0.95+'px;width:'+flashw+'px;text-align:center;margin-top:'+mtop+'px;margin-left:auto;margin-right:auto;" ><object><embed src="./static/flash/dzjc.swf?rt='+new Date().getTime()+'" wmode="transparent"  allowFullScreenInteractive="true" allowFullScreen="true" quality="high" width="'+flashw+'" height="'+flashh*0.95+'" align="L" scale="noborder" flashvars="mainXmlUrl=';
            //var yxurl=transferProtocol_web+_config["PLS"]+'/youjiao/playPersonalRightList.do?menuCode='+kjsk.currentKsid+'&page=1&pageNum=200&orderby=5&xmlFlag=1&t='+new Date().getMilliseconds();
            //var ypskurl=transferProtocol_web+_config["PLS"]+'/teacherfile/getfilelist.do?teachernumber='+teachernumber+'&pageindex=1&pagesize=200&noforder=2&place=4&kscode='+dzjc.currentKsid+'&xmlFlag=1&t='+new Date().getMilliseconds();
            //资源列表
            var preferenceUrl=process.env.PLS_BASE_PREFIX+"/interface/queryEleTeachRes.do?menuCode="+this.ksId+"&userid="+this.teacherNumber;
            //图标列表
            // 参数由后台自动拼接 userid=yujikuan&ebookCode=20151215132203804892930051706&action=select
            var resUrl=process.env.PLS_BASE_PREFIX+"/interface/eteachInterface.do";
            //题库训练列表
            var tqmsUrl=process.env.TQMS_BASE_PREFIX+"/tqms/interface/practice/queryPractice.action?username="+this.teacherNumber+"&classId="+this.ksId+"&type=0&limit=100";
            console.log("preferenceUrl=="+preferenceUrl)
            console.log("resUrl=="+resUrl)
            console.log("tqmsUrl=="+tqmsUrl)
            dzjccode=dzjccode+encodeURIComponent(path)+'&show=1'
            dzjccode=dzjccode+'&preferenceUrl='+encodeURIComponent(preferenceUrl);
            dzjccode=dzjccode+'&resUrl='+encodeURIComponent(resUrl);
            dzjccode=dzjccode+'&tqmsUrl='+encodeURIComponent(tqmsUrl);
            dzjccode=dzjccode+'&ebookCode='+this.rcode;
            dzjccode=dzjccode+'&statusLabel=1';
            dzjccode=dzjccode+'&userName='+this.teacherNumber;
            dzjccode=dzjccode+'" allowScriptAccess="sameDomain" type="application/x-shockwave-flash"></embed></object></div>';
            document.getElementById("dzjcDiv").innerHTML=dzjccode;
            document.getElementById("dzjcDiv").style.display="block";
        
        },
        initStore:function(){
            var self=this;
            window.addEventListener('dzjcCallBack',function (e) {       
            console.log(e.detail)
            //电子教材内部资源点击回调
            self.playRes(e.detail)
            }) 
            checkDomainConfig()
        },
        playRes:function(param){
            click(param)
        }
    }
}
</script>

<style>
</style>
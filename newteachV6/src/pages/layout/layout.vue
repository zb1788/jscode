
<template>
    <el-container class="edibox" >
		
		<div class="sknr">
    <el-header style="height:8vh;"><navbar></navbar></el-header>
    <el-main style="flex:1;">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </el-main>
    <el-footer style="height:8vh;"><footerbar></footerbar></el-footer></div>
    <div id="customMask" v-show="fullscreenLoading" class="el-loading-mask is-fullscreen" style="display:none;">
      <div class="el-loading-spinner">
        <svg viewBox="25 25 50 50" class="circular">
          <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
        </svg>
        <p class="el-loading-text">加载中</p>
      </div>
    </div>
    </el-container>    
</template>

<script>
import { mapGetters } from 'vuex'
import Navbar from './components/Navbar'
import Footbar from './components/Footbar'
import footerbar from './components/footerbar'
import { clientToolTransmit,logoutClient } from '@/api/client'
import commonUtils from '@/utils/common'
import { BssCharge } from '@/api/init'

export default {
    name: 'layout',
    components: {
        Navbar,
        footerbar,
        Footbar
    },
    computed: {
        ...mapGetters([
            'fullscreenLoading',//是否显示全屏加载
            'dialogFilter',//是否展示弹窗遮罩
            'ksId',
            'userSelectClassId',
            'isSetLoginFirst',
            'classHourId'
        ]),      
    },
    watch:{
      fullscreenLoading(val){
        if(val){
          let maxZindex = commonUtils.getMaxZindex()
          document.getElementById('customMask').style.zIndex = maxZindex+1
        }else{
          document.getElementById('customMask').style.zIndex = 0
        }
      },
      ksId(val){
        if(val != ''){
          console.log("ksId change")
          if(!this.isSetLoginFirst){
            clientToolTransmit(1)
          }else{
             clientToolTransmit(3)
          }                  
        }
      },
      classHourId(val){
        if(val != ''){
          console.log("classHourId change")

          if(!this.isSetLoginFirst){
            clientToolTransmit(1)
          }else{
            let loginInfo = VcomTeach.getLoginInfo()
            let loginObj = JSON.parse(loginInfo)
            //登录串中的课时和当前课时不一致才更新登录串
            if(loginObj.classHourId != val){
              clientToolTransmit(3)
            }            
          }                  
        }
      }
    },
    mounted(){
      let self = this
      window.addEventListener('doSetClassStatus', function (e) {       
        let obj = e.detail
        console.log('回调上下课状态111：'+obj.code)
        //设置上下课状态
        self.$store.dispatch('setHavingClass',obj.code)
      })

      //班级收费等鉴权
      BssCharge().then((response)=>{
        //console.log(response)
        if(typeof(response.userAble) && !response.userAble) {
            //给提示，回登录页
            let bssChargeMsg = '尊敬的用户：' + response.bssStateFlgTip;
            self.$messageteach.error(bssChargeMsg)
            setTimeout(()=>{logoutClient()},1000)
        }else if(typeof(response.userAble) && response.userAble && response.bssStateFlg=="2"){
            //给提示直接用
            let bssChargeMsg = '尊敬的用户：' + response.bssStateFlgTip;
            self.$messageteach.error(bssChargeMsg)
        }        
      }).catch((error)=>{

      })
    }
}
</script>

<style>
	html {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    /* background: #000; */
}
*,
*:before,
*:after {
    box-sizing: inherit;
}
	body {font-size:1rem; font-family:"Microsoft Yahei"; -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased; }

.sknr {display:flex; flex-direction: column; top: 0; left: 0; right:0; bottom: 0; position: absolute; }
  .edibox{
background: -moz-linear-gradient(left top,#081E3F,#09244d,#1658BA); 
background: -webkit-gradient(linear, left top, right top, from(#081E3F), color-stop(5, #09244d), to(#1658BA)); 
background: -webkit-linear-gradient(left top,#081E3F,#09244d,#1658BA); width: 100%; height: 100%;}
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
  }
  el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
	display: flex;
	flex-direction: column;
	
  }
  .el-footer {border-top:solid 1px #a1cfe5;background: rgba(0,0,0,0.2)!important;}
  
  body > .el-container {
    margin-bottom: 40px;
  }
.el-header, .el-footer {background: none; color: #fff; box-sizing:content-box}


/*icon*/
.edibox .icon {display: block;  background: url(../../assets/images/ico.png); background-size: 100%;}
.edibox .icon-yj {width: 235px; height: 75px; background-position:0 -10px;}
.edibox .iconY{display:inline-block; vertical-align: middle;   width:2rem; height: 2rem; margin-right: 5px; background: #fff;}
.el-button--text.cur .iconY,.el-button--text:hover .iconY{background:#66b1ff}
.el-button--text:hover,.el-button--text.cur{color:#66b1ff}
.edibox .iconY.yy { mask:url(../../assets/icons/foot/yy.svg) no-repeat 0 0/100% 100%;}
.edibox .iconY.xk {mask:url(../../assets/icons/foot/xk.svg) no-repeat 0 0/100% 100%;}
.edibox .iconY.gb {mask:url(../../assets/icons/foot/close.svg) no-repeat 0 0/100% 100%;}
.edibox .iconY.gj {mask:url(../../assets/icons/foot/set.svg) no-repeat 0 0/100% 100%;}

.edibox .iconsm {display:inline-block; vertical-align: middle;  background: url(../../assets/images/ico.png); width: 20px; height: 20px;    margin-right: 0.5vh;}
.edibox .iconsm.doc {background-position:-25px -201px;}
.edibox .iconsm.hot {background-position:-53px -201px;}
.edibox .iconsm.time {background-position:-83px -201px;}
.edibox .iconsm.dif {background-position:-169px -201px;}
.edibox .iconsm.num {background-position:-112px -201px;}
.edibox .icont{display:inline-block; vertical-align: middle;  background: url(../../assets/images/ico.png); width: 45px; height: 45px;}
.edibox .icont.kqyx {background-position: -17px -88px;}
.edibox .icont.ktjx {background-position: -74px -88px;}
.edibox .icont.khzy {background-position: -132px -88px;}
.edibox .icont.ktbg {background-position: -188px -88px;}
.edibox .icont.jxyp {background-position: -245px -88px;}
.edibox .icont.jxfx {background-position: -302px -88px;}
.edibox .ico-jing {    width: 1.5rem;
    height: 1.5rem;
    margin-top: 0.5rem; background:url(../../assets/icons/foot/jing.svg) ; display: block;background-size: 100%;}
.ico-jj{display:block; vertical-align: middle; background: url(../../assets/images/ico.png) ; background-position:-25px -270px; width: 25px; height: 25px;}
.ico-jj.aa {background-position: -56px -270px;}
.ico-up {display:inline-block; vertical-align: middle;  background: url(../../assets/images/ico.png); width: 30px; height: 26px; background-position: -256px -237px;}
.ico-down {display:inline-block; vertical-align: middle;  background: url(../../assets/images/ico.png); width: 30px; height: 26px; background-position: -294px -237px;}
.edibox i.ico-more {display:inline-block; vertical-align: middle;  background: url(../../assets/images/ico.png); width: 85px; height: 85px; background-position: -275px -2px;}
.texth3 .sn { line-height: 1.8em; width:100%; margin-bottom: 10px;}
.el-popover {padding: 0!important; border: 0!important;}
.texth6{font-size: 0.7rem; line-height: 2rem; color: #999;}
.texth6 label{color: #666;}
.el-popper[x-placement^=top] .popper__arrow::after{border-top-color: #269ad7!important;}
.el-popper[x-placement^=top]  .popper__arrow{border-top-color: #269ad7!important;}
.el-popper[x-placement^=right] .popper__arrow::after{border-right-color: #269ad7;}
/* .dim{ -webkit-filter: blur(3px); filter: blur(3px);} */
</style>

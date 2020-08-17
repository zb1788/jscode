<template>
 <div style="width:100%;height:100%;">
    
		 <div id="flashContent" style="width:100%;height:100%;visibility:hidden">
				 <p>
				      没有安装flashPlayer或者FlashPlayer版本太低。 
				      </p>
					<p>请下载新的flashPlayer:<a target="_blank" href="http://www.adobe.com/go/getflashplayer"><img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" /></a></p>
		 </div>
<!-- <el-collapse v-if="infoTypeFormat==2" v-model="activeName" accordion>
  <el-collapse-item title="flash播放列表" name="1">
    <div v-for=" (item,index) in playItems" :key="index" @click="playFlashInit(item.url)">{{item.name}}</div>
</el-collapse>  -->

<Dropdown v-if="playItems.length>1" trigger="click">
  <span class="el-dropdown-link">
    <font id="currentName">{{name}}</font><i class="el-icon-arrow-down el-icon--left"></i>
  </span>
  <DropdownMenu slot="dropdown">
    <DropdownItem v-for=" (item,index) in playItems" :key="index" @click.native="playFlashInit(item)">{{item.name}}</DropdownItem>
  </DropdownMenu>
</Dropdown>
<div v-if="playItems.length==1" class="el-dropdown">{{playItems[0].name}}</div>
</div>   
</template>

<script>
import {showFlexPager2} from '../../../static/viewswf/swfobject'
import {Dropdown,DropdownMenu,DropdownItem} from 'element-ui'
export default {
    name:'flash',
    components:{
      Dropdown,DropdownMenu,DropdownItem
    },
    data(){
        return {
        activeName: '1',
        swfVersionStr:"11.1.0",
        xiSwfUrlStr:"./viewswf/playerProductInstall.swf",
        //xiSwfUrlStr:"../../../static/viewswf/viewswf/expressInstall.swf",
        mainflashpath:"./viewswf/FlexPaperApp.swf",
        url:"",
        name:""
        }
    },
    watch:{
        // flashSrc(val){
        //     alert("负载成功")
        //     showFlexPager2(val,this);
        // },
        playItems(val){
           //alert(this.playItems[0].url)
           this.playItems=val;
           this.playFlashInit(this.playItems[0]);
       }
    },
    mounted() {
        //this.path=this.flashSrc;
        //alert(this.path)
        //this.playFlashInit(this.flashSrc);
        if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach()){
             VcomTeach.setWndSize(0,0,0,0) // 最大化
        }
    },
    methods: {
    playFlashInit: function (item) {
        this.name=item.name;
        showFlexPager2(item.url,this);    
    }
    },
    props:["playItems","infoTypeFormat"]
}
</script>

<style scoped>
.el-dropdown{flaot:left;font-size: 1em;}
.el-dropdown-menu__item{font-size: 1em;}
</style>

<template>
    <!-- <el-carousel :interval="4000" type="card" height="800px">
    <el-carousel-item v-for="item in playUrls" :key="item">
      <div class="medium"><img :src="item"></div>
    </el-carousel-item>
  </el-carousel> -->
  
    <ul id="images" style="display:none;">
      <li v-for="(item,index) of playUrls" :key="index"><img :id='"img" + index' @click="clickImg(index)" :data-original-url="item" :src="item" alt=""></li>
    </ul>
  
  
  <!-- <viewer :images="imgs">
            <img v-for="(item,index) of playUrls" :src="item" :key="index">
        </viewer> -->
<!-- <div class="mod18">	
  <div id="_title"></div>
	<div id="picBox" class="picBox">
	     <span style="display: none;" id="prevTop" class="btn prev"></span>
	     <div id="bigImgDiv"><img id="bigImg" src=""/></div>
	     <span style="display: none;" id="nextTop" class="btn next"></span>
	</div>	
	<div id="listBox" class="listBox">
	     <span style="display: none;" id="prev" class="btn prev"></span>
	     <ul class="cf"></ul> 
	     <span style="display: none;" id="next" class="btn next"></span>
	</div>	
</div> -->
</template>

<script>
import {YjNewteachPicViewer} from 'newteach-ui';
// import './viewer.min.css'
// import Viewer from 'viewerjs';
//import Viewer from 'v-viewer';
import { mapGetters } from 'vuex';
//import {init,setListByJson,onSmallImageClicked} from './imageOper'
//import './style.css'
// Vue.use(Viewer);
// Viewer.setDefaults({
//   Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
// });
export default {
  
      
    data(){
        return {
          refreh:false,
           imgArr:[],
           showImgArray:[],
           imgObjs:[]
           
        }
    },
    watch:{
       playUrls(val){
           this.playUrls=val;
           this.imgArr=val;
           this.refreh=true;
           this.setImgSrc();
           //this.showImages();
       },
       playItems(val){
           this.playItems=val;
           for(var i=0;i<this.playItems.length;i++){
             var obj={}
             obj.path=this.playItems[i].url;
             obj.file_name=this.playItems[i].name;
             this.showImgArray.push(obj);
           }
           //this.showImages();
       }
    },
    mounted(){
      if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach())
          {
            VcomTeach.setWndSize(0,0,0,0);
          }
        
        this.setImgSrc();
         
    },
    props:["playUrls","playItems"],
    methods: {
        // showImages:function(){
        //   alert(this.showImgArray)
        //   init();
        //   setListByJson(this.showImgArray);
        // },
        // onSmallImageClicked:function(i){
        //   alert("ddd")
        //   onSmallImageClicked111(i);
        // },
        setImgSrc:function(){
          if(this.playUrls.length>0){
          /** 
          var gallery = new Viewer(document.getElementById('images'),{
                  url: 'data-original-url',
                  
                  fullscreen:true,
                  button:false,
                  toolbar:{
                    zoomIn:1,
                    zoomOut:1,
                    oneToOne: 1,
                    reset: 1,
                    prev: 1,
                    play: {
                      show: 1,
                      size: 'large',
                    },
                    next: 1,
                    rotateLeft: 1,
                    rotateRight: 1,
                    // flipHorizontal: 4,
                    // flipVertical: 4,
                    
                  },
                  show: function (){        // 动态加载图片后，更新实例
                      //gallery.update();
                  }
          });
          */
          // 多个图像
          //setTimeout(function(){
          var num = 0;
          if(this.playUrls.length>1){
            num=1;
          }
          const viewers = YjNewteachPicViewer.newInstance(document.getElementById('images'),{
            inline: true,
            toolbar:{
                    zoomIn:1,
                    zoomOut:1,
                    //oneToOne: 1,
                    reset: 1,
                    prev: num,
                    play: {
                      show: 1,
                      size: 'large',
                    },
                    next: num,
                    rotateLeft: 1,
                    rotateRight: 1
                    // flipHorizontal: 4,
                    // flipVertical: 4,
                    
                  },
                  imageInitFull:true,
            button:false,
              viewed() {
                //viewers.zoomTo(1);
              }
          });
         // }, 500 );
          // setTimeout(function(){
          //      document.getElementById("img0").click();
          //      document.getElementsByClassName("viewer-canvas")[0].setAttribute("data-viewer-action","");
          // }, 500 );
        //   window.setInterval(function(){
        //   var images=document.getElementsByTagName("img");
        //   for(var i=0;i<images.length;i++){
        //     var imgSrc=document.getElementsByTagName("img")[i].getAttribute("src");
        //     document.getElementsByTagName("img")[i].setAttribute("src",imgSrc.replace(/&amp;/g,"&"));
        //   }
        // },1000);
          }
        // this.imgObjs = document.getElementsByTagName("img");
        // alert(this.imgObjs.length)
        // for(var i=0;i<this.imgObjs.length;i++){
        //   var imgObj = this.imaObjs[i];
        //   var imgSrc=imgObj.getAttribute("src");
        //   imgObj.setAttribute("src",imgSrc.replace(/&amp;/g,"&"))
        // }
        },
        clickImg:function(index){
          //alert(document.getElementById("img"+index).getAttribute("src"))
          var imgSrc=document.getElementById("img"+index).getAttribute("src");
          //document.getElementsByTagName("img")[index+1].setAttribute("src",imgSrc);
          var tempLength=document.getElementsByTagName("img").length;
          // setTimeout(function(){
          //      document.getElementsByTagName("img")[tempLength].setAttribute("src",imgSrc);
          // }, 500 );
          
        }
    }
}
</script>

<style>

</style>
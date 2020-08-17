<template>

<div id="videoDiv">
 <h1 class="spTit">视频播放：{{fileName}}</h1> 

<video id="demo" autoplay="autoplay" :src="mp4Src" controls="controls"   preload="auto" controlsList="nodownload nofullscreen" >
  你的浏览器不支持 <code>video</code> 标签.
</video>

</div>
<!-- <div v-else><div class="btnC" onmouseover="tochangebg(this,1);" onmouseout="tochangebg(this,2);" @click="tocloseorbg(1);">关闭</div></div> -->
</template>

<script>
export default {

components: {
          
      },
    data(){
       return {
           
       }
    },
    name: "mp4",
    watch:{
      mp4Src(val){
        this.mp4Src=val;
        this.playInit();
      }
    },
    mounted() {
       this.playInit();
       document.getElementById("yjCloseButton").style.bottom='-0.5vh';
    },
    methods: {
        playInit:function(){
          var self = this;
          if(this.isVcomTeach){
            //VcomTeach.setWndSize(100,100,1700,900);
            VcomTeach.setWndSize(0,0,0,0);
            //VcomTeach.setTitle('表扬');
            //alert(this.mp4Src)
            
            //VcomPlayer.OpenMMFile(this.mp4Src,0);
            //window.close();
            
          }
          if(this.mp4Src){
            var vedio = document.getElementById('demo');
            var videoDiv = document.getElementById('videoDiv');
            // vedio.addEventListener('click', function(){
            //     self.change(vedio);
            // })
            vedio.addEventListener('dblclick', function(){
                self.change(vedio);
            })
            vedio.onerror=function(){
                self.$messageteach.error("播放出错!");
            }
          }
        },
        change:function(_video){
          if( _video.paused ){
              _video.play();
          }else{
              _video.pause();
          }
        }
    },
    props:["mp4Src","isVcomTeach","fileName"]
}
</script>

<style scoped>
body{background: #000;}
.spTit{font-size: 1.2rem;
    line-height: 5vh;
    background: #fff;
    border-bottom: solid 1px #ddd; margin: 0;}

video{
    object-fit: fill;
    position: absolute;
    top:100;
    left: 0;
    width: 100%;
    height: 95vh
}
video::-webkit-media-controls-enclosure {
    width: 94%;
    /*height: 50px;
    flex-shrink: 0;
    bottom: 0px;
    text-indent: 0px;
    box-sizing: border-box;
    padding: 0px;
    margin: 0px;*/
}
/*
video::-webkit-media-controls-enclosure {
    width: 94%;
    height: 40px;
    flex-shrink: 0;
    bottom: 0px;
    text-indent: 0px;
    box-sizing: border-box;
    padding: 0px;
    margin: 0px;
}
video::-webkit-media-controls-panel {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    user-select: none;
    position: relative;
    width: 100%;
    z-index: 0;
    text-align: right;
    bottom: auto;
    height: 40px;
    min-width: 48px;
    line-height: 32px;
    background-color: rgba(13, 13, 14, 0);
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
   
    
}
*/
</style>

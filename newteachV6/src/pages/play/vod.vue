<template>
<div >
    {{fileName}}
</div>

</template>

<script>
export default {

components: {
          
      },
    data(){
       return {
           
       }
    },
    name: "vod",
    watch:{
      vodSrc(val){
        this.vodSrc=val;
        this.playInit();
      }
    },
    mounted() {
       this.playInit();
      
    },
    methods: {
        playInit:function(){
          var self=this;
          var playSuccess=false;
          console.log(this.vodSrc)
          if(this.isVcomTeach){
            var vm=this;
            VcomTeach.setWndSize(-1,-1,'30%','40%');
            //alert(this.vodSrc)
            if(this.vodSrc){
              console.log(this.vodSrc)
              try{
                VcomPlayer.OpenMMFile(this.vodSrc,0,this.fileName);
              }catch(e){
                console.log(e)
                this.$messageteach.error("打开文件失败");
                setTimeout("window.close();", 2000 );
                return;
              }
              VcomTeach.bindingEvent("PlayEvent",function(EventID, EventData){
               //alert("ID = " + EventID);
              // alert("Data = " + EventData);
                   if(EventID=="1"){//开始播放
                   playSuccess=true;
                   setTimeout("window.close();", 500 );
                       
                   }
              })
            setTimeout(function(){
              if(!playSuccess){
                VcomPlayer.ClosePlayer();
                window.close();
                // self.$message.error("播放异常");
                // setTimeout("window.close();", 2000 );
              }
            }, 5000 );
            
            }

          }else{
            if(this.isVcomTeach){
              window.location.href=this.vodSrc;
            }else{
              //alert("未返回直播地址")
            }
              
          }
        }
    },
    props:["vodSrc","isVcomTeach","fileName"]
}
</script>

<style>

</style>

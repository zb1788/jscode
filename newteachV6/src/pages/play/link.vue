<template>
<div id="flexDiv">
<div id="iframeDiv">
<iframe :src="playUrl" ></iframe>
</div>
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
    name: "link",
    watch:{
       playUrl(val){
           //alert(this.linkType)
           this.playUrl=val;
           //授课下的仿真实验，新开IE处理内容乱码问题
        if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach()&&this.linkType==2)
		{
            console.log(this.playUrl)
            try{
                VcomTeach.openByIE(this.playUrl+"&ut="+this.ut);
            }catch(e){
                console.log(e);
                return; 
            }    
            window.close();
        }
           
       }
    },
    mounted() {
         if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach())
		{
            VcomTeach.setWndSize(0,0,0,0);
            
        }
        // var ifm= document.getElementById("myiframe");
        // ifm.height=document.documentElement.clientHeight;
        
    },
    methods: {
    
    },
    props:["playUrl","linkType","ut"]
}
</script>

<style>
#flexDiv{
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}
#iframeDiv{
    flex:1;
}

#iframeDiv iframe{
    height: 99.4%;
    width: 100%;
}

#bottomDiv{
    height: 10vh;
    line-height: 10vh;
    text-indent: 1em;
    border-top: 2px solid #ddd;
    /* background: url("../../assets/images/btn.png") bottom repeat-x; */
    background: #f5f7fa
}
</style>
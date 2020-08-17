<template>
<div >
<iframe id="myiframe"  :src="txtSrc" width="100%" height="1000" frameborder="0" scrolling="auto"></iframe>
<!--<Download v-if="isVcomTeach" :isVcomTeach="isVcomTeach" :downurl="txtSrc" :fileName="fileName"></Download>-->
</div>
</template>

<script>
//import Download from "./download";
export default {

components: {
          //Download
      },
    data(){
       return {
           //viewPdfSrc:''
       }
    },
    name: "txt",
    mounted() {
        if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach())
		{
            VcomTeach.setWndSize(0,0,0,0);
            
        }
        // var ifm= document.getElementById("myiframe");
        // ifm.height=document.documentElement.clientHeight;
       //this.viewPdfSrc='../../../static/viewpdf/viewer.html?file=/servlet/DownloadFileServlet?pdfsid='+this.pdfSID
       //this.viewPdfSrc='https://plstest.yjt361.com/servlet/DownloadFileServlet?pdfsid='+this.pdfSID
      
    },
    methods: {
    
    },
    props:["txtSrc","isVcomTeach","fileName"]
}
</script>

<style>

</style>
<template>
<div id="flexDiv">
<div id="iframeDiv">
<iframe id="myiframe" :src="viewPdfSrc" width="100%"  frameborder="0" scrolling="no"></iframe>
</div>
</div>
</template>

<script>
export default {

components: {
          
      },
    data(){
       return {
           viewPdfSrc:''
       }
    },
    name: "pdf",
    watch:{
       pdfSID(val){
           this.pdfSID=val;
           
       }
    },
    mounted() {
         if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach())
		{
            VcomTeach.setWndSize(0,0,0,0);
            
        }
        // var ifm= document.getElementById("myiframe");
        // ifm.height=document.documentElement.clientHeight;
        var pdfBroswerUrl=process.env.PLS_BASE_PREFIX+'/servlet/DownloadFileServlet?pdfsid='+this.pdfSID
       //this.viewPdfSrc='../../../static/viewpdf/viewer.html?file=/servlet/DownloadFileServlet?pdfsid='+this.pdfSID
    //    if(this.resType==1){//基础资源
    //        //this.viewPdfSrc=process.env.PLS_BASE_PREFIX+'/servlet/DownloadFileServlet?pdfsid='+this.pdfSID
    //        this.viewPdfSrc='../../../static/viewpdf/pdfjs/web/viewer.html?file='+encodeURIComponent(pdfBroswerUrl);
    //    }
       if(this.resType==3){//教师文件夹
           pdfBroswerUrl=process.env.PLS_BASE_PREFIX+'/servlet/DownloadFileServlet?fcode='+this.pdfSID
       }
       this.viewPdfSrc='./static/viewpdf/pdfjs/web/viewer.html?file='+encodeURIComponent(pdfBroswerUrl);
      
    },
    methods: {
    
    },
    props:["pdfSID","resType"]
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
    height: 99.76%;
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
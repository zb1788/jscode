<template>
<div id="downloadDiv" >
<div v-for=" (item,index) in fileItems" :key="index" class="downDiv">
        <el-progress :id="index" v-if="isVcomTeach" :text-inside="true" :stroke-width="30" :percentage="item.percentage" status="success"></el-progress>
        <br>
        <p :id="'file'+index" class="downTitle" ><span>{{item.name}}下载进度：</span>{{item.percentage}}%</p>
</div>

</div>
</template>

<script>
import { debug } from 'util';
export default {
    name:'download',
    data(){
        return {
            num:0,
            url:'',
            //percentage:0,
            filePathArray:[],
            tempIndex:0,
            fileItems:[]
        }
    },
    watch: {
      num(val) {
        // this.percentage = this.num;
        // this.percentage=50;
      },
    //   downurl(val){
    //       this.downurl=val;
    //       this.downloadFile();
    //   },
      playItems(val){
           this.playItems=val;
           for(var i=0;i<this.playItems.length;i++){
               let obj = {}
               obj.percentage = 0;
               obj.url=this.playItems[i].url;
               obj.name=this.playItems[i].name;
            this.fileItems.push(obj)
           }
        //    this.fileItems=this.playItems;
           if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach()){
              let savePath = VcomDownOcx.GetMyDocumentPath()+"\\vcomDownload";
              try{
                  debugger
                  VcomDownOcx.clearSaveDirectory(savePath);
              }catch(e){
                  console.log(e);
              }
           }
           this.downloadFile();
       }

    },
    mounted() {
        for(var i=0;i<this.playItems.length;i++){
               let obj = {}
               obj.percentage = 0;
               obj.url=this.playItems[i].url;
               obj.name=this.playItems[i].name;
            this.fileItems.push(obj)
           }
        this.downloadFile();
    },
    methods: {
   
    downloadFile: function () {
        let vm=this;
        if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach())
			{
                var tempResNum=this.playItems.length;
               
                var tempHeight=25+6*tempResNum;
                if(tempHeight>90){
                    tempHeight=90;
                    document.getElementById("downloadDiv").style.height="90%";
                }
                VcomTeach.setWndSize(-1,-1,'50%',tempHeight+"%");
                
                //alert("YES");
                //alert("下载目录="+VcomDownOcx.GetMyDocumentPath());
                this.isVcomTeach=true;
                //this.percentage=0;
                //alert(this.percentage)
                //alert(typeof VcomPlayer);
                //var filePathArray = new Array();
                //var tempIndex=0;
                var downloadFlag=false;
                console.log("======="+this.fileItems);
                for(var i=0;i<this.fileItems.length;i++)
                { 
                if(i==this.tempIndex)
                {
                    var item=this.fileItems[i];
                //var downurl=this.downurl;
                var downurl=item.url;
                var tempFileName=item.name;
                if(tempFileName.indexOf("?")>0){
                    tempFileName=tempFileName.substring(0,tempFileName.indexOf("?"));
                }
                //var saveFilePath=VcomDownOcx.GetMyDocumentPath()+"\\vcomDownload\\"+this.fileName;  
                //item.name="1555656790593.amr"
                var saveFilePath=VcomDownOcx.GetMyDocumentPath()+"\\vcomDownload\\"+tempFileName;      
                console.log(saveFilePath)
                    this.filePathArray.push(saveFilePath);
                    console.log("downurl:"+downurl)
                    VcomDownOcx.StartDownload(downurl,saveFilePath);
                    VcomTeach.bindingEvent("DownloadStateChange",function(state,errMsg){
                    console.log("state=="+state+"errMsg=="+errMsg);
                    downloadFlag=true;
                    if(state==-1){
                        document.getElementById("downloadDiv").style.display="none";
                        vm.$messageteach.error({type:"error",message:errMsg});
                        setTimeout("window.close();", 2000 );
                    }
                    if(state==3){
                        //alert("vm.tempIndex="+vm.tempIndex+"vm.fileItems.length="+vm.fileItems.length)
                        //alert(vm.tempIndex)
                        if(vm.tempIndex<vm.fileItems.length-1){
                            vm.tempIndex++;
                            vm.downloadFile();
                        }else{
                            //downloadFlag=true;
                            try{
                                VcomDownOcx.playFile(vm.filePathArray[0]);
                            }catch(e){
                                alert("打开文件异常，文件位置："+vm.filePathArray[0]);
                            }
                            window.close();
                            //setTimeout("window.close();", 500 );
                            //break;
                        }
                        
                        //alert(saveFilePath);
                        //if(i==0)
                        //{
                            
                       // }
                    }
                    //alert(errMsg);
                    });
                    VcomTeach.bindingEvent("DownloadProcess", function(pos, speed){
                    vm.fileItems[vm.tempIndex].percentage=pos;

                   // vm.percentage=pos;
                    //vm.playItems.splice(item,1,tempItem);
                    // item.percentage=pos;       
                    // vm.updateProcess(pos,i);      
                    //alert(i)  
                    //vm.$set(vm.fileItems[vm.tempIndex],"percentage",pos);
                    console.log(vm.fileItems[vm.tempIndex])
                    //alert(document.getElementById(vm.tempIndex).getAttribute("percentage"))
                    //document.getElementById(vm.tempIndex).setAttribute("percentage", pos);
                    
                   });
    
                    // VcomTeach.bindingEvent("DownloadXmlFinish",function (file, ret){
                    //     alert("DownloadFinish="+file);
                    //     VcomDownOcx.playFile(file);
                    // });
                    // VcomTeach.bindingEvent("DownloadFinish",function(strXML){
                    // alert(strXML);
                    // })

                }
                
                }

			}
			else
            {
                this.isVcomTeach=false;
                 for(var i=0;i<this.playItems.length;i++)
                {
                var item=this.playItems[0];
                var downurl=item.url;
                if(downurl){
                   window.location.href=downurl;
                }
                }
			}
    }
    
    },
    props:["isVcomTeach","fileName","playUrls","playItems"]
}
</script>

<style>
.downDiv{margin: 20px;}
.downTitle{ font-size: 20px; font-weight: bold; color: #000;}
.downTitle span{ font-size: 14px; color: #999; font-weight: normal;}
#downloadDiv{overflow: auto;}
</style>

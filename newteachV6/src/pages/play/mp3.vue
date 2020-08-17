<template>
    <div  id="mainPlayDiv">
    <!-- <aplayer autoplay :music="{
    title: 'Preparation',
    artist: 'Hans Zimmer/Richard Harvey',
    
    src: '../static/audio/beep.mp3',
    pic: 'https://gss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2649918399,3456341100&fm=173&app=49&f=JPEG?w=218&h=146&s=E383DB0934E779114AA88CC10300C0A3',
    lrc: '[00:00.00]lrc here\n[00:01.00]aplayer'
    }">
    </aplayer> -->
    <h3 class="bt" id="_mp3"></h3>
    <audio style="width: 95%;height: 60px;"  autoplay id="demo" preload="auto" controls controlsList="nodownload">
    </audio>
    <!--
    <div v-if="!isVcomTeach">
  <button onclick="document.getElementById('demo').play()">播放声音</button>
  <button onclick="document.getElementById('demo').pause()">暂停声音</button>
  <button onclick="document.getElementById('demo').volume+=0.1">提高音量</button>
  <button onclick="document.getElementById('demo').volume-=0.1">降低音量</button>
    </div>
    -->
    	
        <div>
        <yj-newteach-table @row-click="handleRowChange" :data="playItems" id="mp3List" width="100%" :highlight-current-row="true" ref="multipleTable">
            <YjNewteachTableColumn prop="name" label="音频列表" ></YjNewteachTableColumn>
           
            <!-- <tr v-for="(item,index) in playItems" :key="index"  class="sel" :id="'tr'+index" title="item.name" >
              <td>{{index+1}}---{{item.name}}</td>
              <td style="text-align:center;"><yj-newteach-button :id="'button'+index" type="primary" icon="el-icon-video-play" @click="playIndex(item,index);" style="font-size: 30px;"></yj-newteach-button></td>
            </tr> -->
       </yj-newteach-table>
        </div>
      <!-- <ul class="mp3List">      
            <li v-for="(item,index) in playItems" :key="index"  class="sel" id="index" title="item.name" @click="playIndex(item,index);">{{index+1}}---{{item.name}}<el-button type="primary" icon="el-icon-video-play">播放</el-button></li>
        
    </ul> -->


     </div>
</template>

<script>
//import {playMp3} from '@/api/mp3'
// import jquery from '../../../static/viewswf/jquery-1.11.1.min.js'
// import mediaelement from '../../../static/mp3/mediaelement-and-player.js'
//import Aplayer from 'vue-aplayer'
import {

  YjNewteachTable,
  YjNewteachTableColumn,
YjNewteachButton,
} from 'newteach-ui';
export default {
    components: {
          //Aplayer
	YjNewteachTable,
    YjNewteachTableColumn,
	YjNewteachButton,
      },
    data(){
       return {
           path:''
       }
    },
    name: "mp3",
    watch:{
       playItems(val){
           //alert(val[0].name)
           this.playItems=val;
           this.playMp3Init();
       }
    },
    mounted() {
        var self = this;
        this.path=this.mp3Src;
        if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach())
		{
            var tempHeight=25+5*this.playItems.length+'%';
            VcomTeach.setWndSize(-1,-1,'50%',tempHeight);
        }
        var audio = document.getElementById('demo');
        
        audio.onerror=function(){
            self.$messageteach.error("播放出错!");
        }
    },
    methods: {
    playMp3Init: function () {
        
        this.playIndex(this.playItems[0],0)
        
        if(typeof VcomTeach != "undefined" && VcomTeach.isVcomTeach())
		{
            var tempHeight=25+5*this.playItems.length+'%';
            VcomTeach.setWndSize(-1,-1,'50%',tempHeight);
            document.getElementById("yjCloseButton").style.bottom='1vh';
            document.getElementById("yjCloseButton").style.right='1vh';
        }
        this.checked();
        // if(!this.isVcomTeach)
        // {
        //     document.getElementById('demo').src=this.playItems[0].url;
        // }
        // else
        // {
        //     //alert("mp3控件")
        //     var tempArray=new Array();
        //     for(var i=0;i<this.playItems.length;i++)
        //     {
        //         var item = this.playItems[i];
        //         tempArray.push(item.url);
        //     }
        //     //alert(tempArray.join(","));
        //     VcomPlayer.OpenMMFiles(tempArray.join(","),tempArray.length);
        // }
        
    },
    playIndex:function (item,index){
        document.getElementById('_mp3').innerHTML="正在播放："+item.name;
        if(document.getElementById('demo').src!=item.url){
            document.getElementById('demo').src=item.url;
        }
        setTimeout(function(){
           var tempNodes = document.getElementsByTagName("i");
            for(var i=0;i<tempNodes.length;i++){
                var tempNode=tempNodes[i];
                var tempClassName=tempNode.getAttribute("class");
                if(tempClassName=="el-icon-video-pause"&&i!=index){
                    tempNode.setAttribute("class","el-icon-video-play");
                    break;
                }
            }
            var currentNode=document.getElementById('button'+index);
            var audio=document.getElementById('demo');
            var currentClassName=currentNode.firstElementChild.getAttribute("class");
            if(currentClassName=="el-icon-video-pause"){
                currentNode.firstElementChild.setAttribute("class","el-icon-video-play");
                audio.pause();
            }
            if(currentClassName=="el-icon-video-play"){
                currentNode.firstElementChild.setAttribute("class","el-icon-video-pause");
                audio.play();
            }
        }, 300 );
            
            
        // if(!this.isVcomTeach)
        // {
        //     document.getElementById('demo').src=item.url;
        // }
        // else
        // {
        //     VcomPlayer.OpenMMFile(item.url,0);
        // }
    },
    handleRowChange:function(row, event, column){ 
        console.log(row)
        document.getElementById('_mp3').innerHTML="正在播放："+row.name;
        document.getElementById('demo').src=row.url;
     },
     /**
     *@methods:checked
     *@description:默认选中第一行
  **/
 checked:function(){
      this.$refs.multipleTable.setCurrentRow(this.$refs.multipleTable.data[0]);
       this.currentContract = this.$refs.multipleTable.data[0];
       //任务分解
       this.$refs.multiplePlan.setCurrentRow(this.$refs.multiplePlan.data[0]);
       this.currentPlan = this.$refs.multiplePlan.data[0];
  }
    },
    props:["playItems","isVcomTeach"]
}
</script>

<style>
/*body{background: #eee;}*/
body{
    
    /* background:url("./music.jpg") no-repeat; 
    background-size: cover; */
	background:#fff;
    }
h3.bt {    
    line-height: 3rem;
    background: #fff;
    border-bottom: solid 1px #ddd; font-size:1.1rem ;
}
#mp3List .cell {    line-height: 1.6rem;
    font-size: 1rem;
}
.success-row {
    background: #f0f9eb;
  }
</style>

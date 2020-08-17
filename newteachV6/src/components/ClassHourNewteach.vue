<template>
  <div class="flex1">
    <div class="nrbox">
      <div v-for="(item,index) in resList" :key="index">
        <div :class="[item.rmsShowType ==2 ?'org ':item.rmsShowType ==3?'green':'','nrcard' ]"  abc="aaa" @click="classHourClick(item)">
          <div class="flex1-c">

						 <h3>{{item.title}}
               <div class="nrfr"> 
	              <span v-if="item.type == 'pls'"><i class="iconsm doc"></i>{{item.downloadNum}}</span>            
                </div>
              </h3>
            <div class="flex1 posR">

							<div class="nrimg"><img src="../assets/images/ppt.png" /></div>
              <div class="nrwz">
                <label class=jieduan-db>{{item.desc}}</label>
              </div>

							 <div class="bbut" v-if="item.isShowButton" style="cursor:default">              

							  <button style="CURSOR: pointer" v-for="(buttonItem,ii) in item.button" :key="ii" @click.stop="buttonClick(buttonItem)">{{buttonItem.name}}</button>

							</div>
              <label class="ico-jjj"  v-if="item.isShowPlus" @click.stop="showButton(index)"><i class="el-icon-circle-plus"></i></label>
            </div>
          </div>

        </div>
      </div>

      <div v-if="isLoad">
        <div class="nrcard gray">
          <div class="flex1-c">
            <div class="flex1 afterborder1" @click="openPaper">
              <span class="znbtn">智能组卷</span>
            </div>
            <div class="flex1" @click="goMore"> 
              <span class="znbtn">更多</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name:'classHourCommponet',
    props: ['resList','isShowMore','isShowPlusButton'],
    data(){
        return {

        }
    },
    methods:{
        //当前课时包点击
        classHourClick(item){
            this.$emit('classHourClick',item)
        },
        //点击加号
        showButton(index){
        this.resList[index].isShowButton = !this.resList[index].isShowButton
        },
        buttonClick(buttonItem){
            
        }
    }

}
</script>

<style>
/* .nrcard {background: #fff; display: block; position: relative; flex:1}
.nrcard>label {padding: 0 5px; font-weight: bold;} */
.afterborder1 {border-bottom: solid 1px #ddd;}
.flex1-c {display: flex; flex-direction: column; flex: 1;}
.el-main {display: flex; flex-direction: column;}
.flex1 {flex:1;display: flex;}
.nrbox{display: flex; flex: 1; flex-wrap: wrap; margin: 0 -5px;}
.nrbox>div {width: 25%; flex:none; padding:5px; display: flex; box-sizing: border-box; height: 19vh;}
.nrcard {background: #fff; flex:1; display: flex; flex-direction: column; border-radius: 1vh; overflow: hidden;}

.nrcard:before {content: ""; display: block;width: 100%; height: 1vh;  background: #0b80ec;   background:#409eff;    box-shadow: 1px 5px 20px #7dbcff; }
.nrcard.gray:before{   background: #ddd;    box-shadow:none;}

.nrcard.org:before{   background: #f98a14;    box-shadow: 1px 5px 20px #f09433;}

.nrcard.green:before{   background: #16b262;    box-shadow: 1px 5px 20px #51e297;}

h3 {padding:1vh;    font-size: 1rem;    color: #484848;text-align:left;font-weight:600;white-space: nowrap;word-break: normal;overflow: hidden;text-overflow: ellipsis;    line-height:3vh; margin: 0; border-bottom: solid 1px #efefef;}
.tabottom {position: relative; line-height:3vh; height:5vh;text-align: left;    padding:1vh; color: #999;}
.nrimg {    width: 9vw; max-width: 9vh; padding:1vh; vertical-align: middle; align-self:center}
.nrimg>img {width: 80%; display: block; margin: 0 auto;}
.nrwz {padding: 5px; align-self:center; flex: 1;}
.tabottom>span {padding-right:5px; font-size: 0.8rem;}
.tabottom>span>i {margin-right: 5px;}
.jieduan-db {font-size:0.8rem;line-height:2.5vh;overflow: hidden;height: 5vh; padding:0 1vh;  word-break: break-word; text-align: left; display: block; color:#666;}
.flex-center {align-items: center; align-self:center;}
.znbtn { align-self: center; flex: 1;}

.posR{position: relative;}

.nrfr{float: right; display: inline-block; font-size: 0.8rem;}

.bbut{
    position: absolute;
    background: #333;
    filter: alpha(opacity=90);
    opacity: 0.9;
    z-index: 6;
    bottom: 0;
    left: 0;
    right: 0;
    height: 5vh;
		line-height: 5vh;
		padding:0 0.5rem;
}
.posR .ico-jjj{    
    position: absolute ;

    right: 10px;
    z-index: 11;
    bottom: 1vh;
    display: block;
    color: #409EFF;
}

.edibox .bbut button {background: none; min-width: 25%; color: #fff; vertical-align: middle; line-height: 5vh; float:left; border: 0; font-size: 0.8rem;}

.el-tag {display: inline-block; margin: 0; }

.el-tag--mini {height:3vh; line-height:3vh; font-size: 0.6rem; margin-left: 1vh;}
</style>

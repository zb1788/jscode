<template>
<div class="brbox" style="overflow-x:hidden; padding:2vh 2vw; background: #efefef;">
  <div v-if="resList.length == 0"><img src="@/assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p style="color: #606266;">{{txt}}</p></div>
  <div class="flex1" v-else>
    <div class="nrbox">
      <div v-for="(item,index) in resList" :key="index">
        <div :class="[item.rmsShowType ==2 ?'org ':item.rmsShowType ==3?'green':'','nrcard' ]"  abc="aaa" @click="classHourClick(item)">
          <div class="flex1-c">

						 <h3>{{item.title}}
               <div class="nrfr"> 
	              <span v-if="item.isHost"><i class="ico-jing"></i></span>
                </div>
              </h3>
            <div class="flex1 posR">

							<div class="nrimg">
                <!-- <img src="../../assets/images/ppt.png" /> -->
                <img :src="item.iconType" />
              </div>
              <div class="nrwz">
                <label class=jieduan-db>{{item.desc}}</label>
              </div>
							 <div class="bbut"  style="display:none;">              
							  <button style="CURSOR: pointer" v-for="(buttonItem,ii) in item.button" :key="ii" @click.stop="buttonClick(buttonItem)">{{buttonItem.name}}</button>
							</div>
              <label class="ico-jjj" style="display:none;" @click.stop="showButton(index)"><i class="el-icon-circle-plus"></i></label>
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
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatClassHourRes ,getTqmsClassHourRes,updateTqmsClassHourRes} from '@/api/ktjx'
import commonUtils from '@/utils/common'
import { click } from '@/api/click'
import { checkDomainConfig } from '@/permission'
import { getUt } from '@/utils/auth'
export default {
  name: 'bktjx',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      resList: [],
      isLoad: false, //是否展示智能组卷
      classId:'',
      classHourId:'',
      ksId:'',
      teacherNumber:'',
      ut:'',
      txt:'加载中'
    }
  },
  computed: {
    ...mapGetters([
        // 'classHourId',
    ])
  },
  watch: {
    // classHourId(newVal, oldVal){
    //   //课时发生变化重刷列表
    //   if(newVal != oldVal){
    //     //有课时id才获取课时包的数据
    //     this.getList()
    //   }
    // },
    // userSelectClassId(val){
    //   //班级发生变化重刷列表
    //   if(val != ''){
    //     this.getList()
    //   }
    // },
    // isHavingClass(newVal, oldVal){
    //   //上课状态发生变化重刷列表
    //   if(newVal != oldVal){
    //     this.getList()
    //   }
    // }
  },
  async mounted(){
      try{
        let loginInfo = VcomTeach.getLoginInfo()
        let loginObj = JSON.parse(loginInfo)
        console.log(loginObj)
        this.classId = loginObj.classId
        this.classHourId = loginObj.classHourId
        this.teacherNumber = loginObj.teachernumber			
        this.ksId = loginObj.courseId
        this.transferProtocol = loginObj.transferProtocol
        this.portal = loginObj.portal
        this.ut = getUt()
      }catch(e){
        console.log(e)
				this.classId = '153386908359468061'
				// this.classId = '150174041245814936'
        this.teacherNumber = '41010100010128'
        this.classHourId = '20180808150756290373621092226'
        this.ksId = '00010203020402'
				this.teacherComputerMac = '6C-4B-90-78-9B-E7'
      }
      //检查协议头
      await checkDomainConfig()

      let obj = {}
      obj.teacherNumber = this.teacherNumber	
      obj.ut = this.ut
      this.$store.dispatch('setTeacherInfo',obj) 
      this.$store.dispatch('setKsId',this.ksId)
      this.$store.dispatch('setClassHourId',this.classHourId)
                  
      this.$store.dispatch('setTeacherInfo',{"userSelectClassId":this.classId}) 


      this.getList()  
    

  },
  methods: {
    async getList(){
      try{
        let res = await formatClassHourRes()
        this.resList = res.resList
        let tqmsParamsArr = res.tqmsParamsArr
        let resClassHour = res.resClassHour
        let tqmsAppTypeIdArr = res.tqmsAppTypeIdArr
        let tqmsResArr = await getTqmsClassHourRes(tqmsParamsArr,resClassHour)
        let resArr = updateTqmsClassHourRes(this.resList,tqmsResArr,tqmsAppTypeIdArr)
        this.resList = resArr
        if(this.resList.length == 0){
          this.txt = '暂无内容'
        }
      }catch(e){
        commonUtils.console(e,'获取课时包资源失败')                
      }
    },
    //点击某个课时包
    classHourClick(item){
      click(item.playJs)
    },
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .nrcard {background: #fff; display: block; position: relative; flex:1}
.nrcard>label {padding: 0 5px; font-weight: bold;} */
.afterborder1 {border-bottom: solid 1px #ddd;}
.flex1-c {display: flex; flex-direction: column; flex: 1;}
.el-main {display: flex; flex-direction: column;}
.flex1 {flex:1;display: flex;}
.nrbox{ flex: 1; flex-wrap: wrap; margin: 0 -5px;}
.nrbox>div {width: 25%; flex:none; padding:5px; display: flex; box-sizing: border-box;    height: 24vh; float: left;    }
.nrcard {background: #fff; flex:1; display: flex; flex-direction: column; border-radius: 1vh; overflow: hidden;border: solid 1px #ddd;    box-shadow: 1px 1px 2vh #ddd;}

.nrcard:before {content: ""; display: block;width: 100%; height: 1vh;  background: #0b80ec;   background:#409eff;    box-shadow: 1px 5px 20px #7dbcff; }
.nrcard.gray:before{   background: #ddd;    box-shadow:none;}

.nrcard.org:before{   background: #f98a14;    box-shadow: 1px 5px 20px #f09433;}

.nrcard.green:before{   background: #16b262;    box-shadow: 1px 5px 20px #51e297;}

h3 {padding:1vh;    font-size: 1rem;    color: #484848;text-align:left;font-weight:600;white-space: nowrap;word-break: normal;overflow: hidden;text-overflow: ellipsis;    line-height:3vh; margin: 0; border-bottom: solid 1px #efefef;}
.tabottom {position: relative; line-height:3vh; height:5vh;text-align: left;    padding:1vh; color: #999;}
.nrimg {    width: 9vw; max-width: 9vh; padding:1vh 0 1vh 1vh; vertical-align: middle; align-self:center}
.nrimg>img {width: 80%; display: block; margin: 0 auto;}
.nrwz {padding: 5px; align-self:center; flex: 1;}
.tabottom>span {padding-right:5px; font-size: 0.9rem;}
.tabottom>span>i {margin-right: 5px;}
.jieduan-db {font-size:0.9rem;line-height:4vh;overflow: hidden;height: 8vh; padding:0 1vh;  word-break: break-word; text-align: left; display: block; color:#666;}
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

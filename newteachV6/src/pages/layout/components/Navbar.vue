<template>
<div>
<el-row type="flex" class="row-bg" justify="space-between">
  <el-col :span="6" class="align-center">
      <img :src="logoImg" class="imgwh100"/>
  </el-col>
  <el-col :span="13" class="align-center">
	  <div style="padding:0 5vw">
      <!--
      <h2 v-if="baseData.studyStageCode != '0003'">{{baseData.grade}} • {{baseData.term}} • {{baseData.subject}} • {{baseData.version}}</h2>
      <h2 v-if="baseData.studyStageCode == '0003'">{{baseData.studyStage}} • {{baseData.subject}} • {{baseData.version}} • {{baseData.bookOptionName}}</h2>
      -->
	  
      <h2>{{ curModule }} &gt; {{ ksName }}</h2>
	  <h4><font v-if="curModule == '课堂教学'">{{ classHourName }}</font></h4>
	  </div>
  </el-col>
  <el-col :span="5">
    <el-col :span="8"><headphoto class="w60 toux"/></el-col>
    <el-col :span="16" class="padT10"><h5>{{trueTeacherName}}</h5><h6>{{userSelectClassName}}</h6>
    </el-col>
  </el-col>
</el-row>
</div>
</template>

<script>
import headphoto from './headphoto'
import { mapGetters } from 'vuex'
export default {
    name: 'navbar',
    data(){
        return {
            logoImg:'static/area/pass.gif'
        }
    },
    components: {
        headphoto
    },
    computed: {
        ...mapGetters([
            'teacherNumber',
            'trueTeacherName',
            'baseData',
            'curModule',
            'ksName',
            'classHourName',
            'isShowClassHour',
            'userSelectClassName',
            'clientFlag'
        ]),
        versionInfo(){
            if(this.baseData.studyStageCode != '0003'){
                return this.baseData.grade + '•' +this.baseData.term + '•' + this.baseData.subject + '•' + this.baseData.version
            }else{
                return this.baseData.studyStage + '•' + this.baseData.subject + '•' + this.baseData.version + '•' + this.baseData.bookOptionName
            }
        }
    },
    mounted(){
        this.logoImg=getCustomLogo(this.clientFlag);//Logo图片地址
    },
    methods: {
        test(){

        }
    }
}
</script>

<style>
.w60 {width: 7vh; height: 7vh; margin-top:1vh;}
.toux{ border-radius: 50%; border:solid 3px rgba(255,255,255,0.3)}
.img100{width:100%; max-height:100%;}
.imgh100{height:100%}
.imgwh100{max-width:100%; max-height:8vh;}
.edibox h2{font-size: 1.2rem; font-weight: normal; margin: 0; padding: 0;    text-align: left;padding-top: 0.5vh; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
.edibox h3{font-size: 1.2rem; font-weight: normal; margin: 0; padding: 0;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
.edibox h4{font-size: 0.9rem; opacity: 0.7; font-weight: normal; margin: 0; padding: 0;    text-align: left;padding-top: 0.5vh;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
.edibox h5{    white-space: nowrap;    text-overflow: ellipsis;    overflow: hidden;font-size: 1rem; font-weight: normal; margin-bottom: 0.5vh; margin: 0; padding: 0; line-height: 4vh;text-align: left ; padding: 0 1vh;}
.edibox h6{font-size: 0.9rem; font-weight: normal; margin-bottom:0.5vh; margin: 0; padding: 0; line-height: 3vh; color: #fff; text-align: left; padding: 0 1vh; opacity: 0.6;}
.padT10 {padding-top: 1vh;}
.align-center {align-self: center;}
</style>

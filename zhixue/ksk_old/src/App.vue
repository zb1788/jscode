<template>
  <div id="app">
    <Head 
    :time="time" 
    @gameOver="gameOver" 
    @goback="goback"
    :now="count+1" 
    :total="questionJson.length"
    :isBegTime="isStart"
    >
    </Head>
    <section>
      <!-- 
      <div class="topt">
        <div class="time"><span></span><i></i></div>
        <h5 class="yeq">1/15</h5>
      </div>
       -->
      <Select 
      v-if="question.quesType==1" 
      :question="question"
      @next="addCount"
      ></Select>
      <TianKong 
      v-if="question.quesType==2" 
      :question="question" 
      @next="addCount"></TianKong>
    </section>
    <Dialog 
    v-if="isShow"
    :gonggao="gonggao"
    @startGame="startGame"
    >
    </Dialog>
    <Confirm v-if="isBack" @isback="isGoback"></Confirm>
  </div>
</template>

<script>
// import { onAudioPlayStatus } from "./assets/common.js";
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(decodeURI(unescape(r[2])));
  return null;
}

function checkLocalStorage() {
  if (!window.localStorage) {
    mui.toast("您的手机不支持预览功能");
    return false;
  }
}

/**
 * 存储内容到localStorage
 * 【主要】如果是json格式需要encodeURI(JSON.stringify(value)),取的时候decodeURI(value)
 * @param {[String]} name  [名称]
 * @param {[String]} value [值]
 */
function setLocalStorage(name, value) {
  checkLocalStorage();
  window.localStorage.setItem(name, value);
}

function getLocalStorage(name) {
  checkLocalStorage();
  var value = window.localStorage.getItem(name);
  return decodeURI(value);
}

var stageid = GetQueryString("stageid"); //当前关卡的id(或者是听算的分类的id)
var genreid = GetQueryString("genreid"); //当前分类的id
var userstageid = GetQueryString("userstageid"); //当前 sx_user_stage的id，用户当前进入的关卡
var type = GetQueryString("type");

var urlCallBack = GetQueryString("urlCallBack"); //关卡列表页面地址需要的callback
var title = GetQueryString("title"); //关卡页面需要的title

var gradeid = GetQueryString("gradeid"); //关卡页面需要的gradeid
var subjectid = GetQueryString("subjectid"); //关卡页面需要的subjectid
var moduleid = GetQueryString("moduleid"); //关卡页面需要的moduleid
var ks_short_name = getLocalStorage("ks_short_name"); //关卡页面需要的ks_short_name

if (type == 1) {
  var backToStageUrl =
    "stagelistksk?genreid=" +
    genreid +
    "&gradeid=" +
    gradeid +
    "&subjectid=" +
    subjectid +
    "&moduleid=" +
    moduleid +
    "&urlCallBack=" +
    encodeURIComponent(urlCallBack);
  var backToStageUrl =urlCallBack;
} else {
  var backToStageUrl =
    "genreting?gradeid=" +
    gradeid +
    "&subjectid=0002&moduleid=" +
    moduleid +
    "&urlCallBack=" +
    encodeURIComponent(urlCallBack);
}

//1:houtai;2:zaixian;3:dev
var debug = "zaixian";

if (debug == "zaixian") {
  var getUrl = "../Game/getQuesView?stageid=" + stageid + "&type=" + type;
}

if (debug == "dev") {
  var getUrl = "api/getQues";
  // var getUrl = "api/getWrong";
}
//---------------------------------------------------------
//126后台预览需要(生成后修改css中static为static_ksk,注意gameover和最后一道题return false)
if (debug == "houtai") {
  var id = GetQueryString("id");
  if (type == "ques") {
    var getUrl = "../Index/getQuesAloneView?quesid=" + id;
  } else {
    var getUrl = "../Index/getQuesView?stageid=" + id;
  }
}
//----------------------------------------------------------

function play() {
  count = 0;
  try {
    console.log(domain + "nan/" + voiceArr[count] + ".mp3");
    UXinJSInterfaceSpeech.playAudio(domain + "nan/" + voiceArr[count] + ".mp3");
  } catch (e) {}
}

import Head from "./components/Head";
import Select from "./components/Select";
import TianKong from "./components/TianKong";
import Dialog from "./components/Dialog";
import Confirm from "./components/Confirm";

export default {
  name: "App",
  components: {
    Head,
    Select,
    TianKong,
    Dialog,
    Confirm
  },
  data() {
    return {
      questionArr: [],
      questionJson: "",
      question: {
        id: "",
        quesType: "",
        info: ""
      },
      isShow: false,
      isBack: false,
      gonggao: "",
      time: 0, //时间
      count: 0, //从第几道题开始
      // now: 1,
      isGameOver: false,
      // resultStr: "",
      rightNum: 0 //做对数量
    };
  },
  computed: {
    //只有ajax成功后，再把时间传递下去
    isStart() {
      if (this.questionJson.length > 0) {
        return this.isShow;
      } else {
        return true;
      }
    }
  },
  methods: {
    getQuestion() {
      var self = this;
      this.$http
        // .get("api/getQues")
        // .get("../Game/getQuesView?stageid=" + stageid + "&type=" + type)
        .get(getUrl)
        .then(function(response) {
          self.time = response.data.stage[0].totaltime * 1;
          if (
            // response.data.stage[0].keypoint == "" ||
            // response.data.stage[0].example == "" ||
            response.data.stage[0].remark == ""
          ) {
            self.isShow = false;
          } else {
            self.isShow = true;
            self.gonggao = response.data.stage[0].remark;
          }

          // for (var i in response.data.ques) {
          //   self.questionArr.push(response.data.ques[i]);
          // }
          self.questionJson = response.data.ques;
          self.question.id = response.data.ques[self.count].id;
          self.question.quesType = response.data.ques[self.count].questype;
          self.question.info = eval(
            "(" + response.data.ques[self.count].content + ")"
          );

          if (type == 2) {
            self.question.voice = eval(
              "(" + self.questionJson[self.count].voice + ")"
            );
            // self.question.voice = eval(
            //   "(" + response.data.ques[self.count].voice + ")"
            // );
            if (typeof self.question.voice !== "undefined") {
              voiceArr = self.question.voice;
              if (!self.isShow) {
                play();
              }
              // console.log(self.question.voice);
            }
          }
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    getNextQuestion() {
      this.question.id = this.questionJson[this.count].id;
      this.question.quesType = this.questionJson[this.count].questype;
      this.question.info = eval(
        "(" + this.questionJson[this.count].content + ")"
      );
      if (type == 2) {
        this.question.voice = eval(
          "(" + this.questionJson[this.count].voice + ")"
        );

        if (typeof this.questionJson[this.count].voice !== "undefined") {
          voiceArr = this.question.voice;
          play();
          // console.log(this.questionJson[this.count].voice);
        }
      }
    },
    addCount(id, isRight) {
      // console.log("答案id" + id + "--" + isRight);
      try {
        UXinJSInterfaceSpeech.stopAudio();
      } catch (e) {}
      if (isRight == 1) {
        this.rightNum++;
      }
      // this.resultStr += isRight;
      this.addQuestionRecord(id, isRight);
      // return false;
      var that = this;
      if (this.count < this.questionJson.length - 1) {
        setTimeout(function() {
          that.count++;
          if (!that.isGameOver) {
            that.getNextQuestion();
          }
        }, 1000);
      } else {
        if (debug == "houtai") {
          // console.log(this.resultStr);
          alert("结束");
          return false;
        }
        window.location.href =
          "result?rightNum=" +
          this.rightNum +
          "&stageid=" +
          stageid +
          "&type=" +
          type +
          "&userstageid=" +
          userstageid +
          "&total=" +
          this.questionJson.length +
          "&genreid=" +
          genreid +
          "&moduleid=" +
          moduleid +
          "&urlCallBack=" +
          encodeURIComponent(urlCallBack);
      }
    },
    //时间到
    gameOver() {
      if (debug == "houtai") {
        // console.log(this.resultStr);
        alert("时间到");
        return false;
      }
      window.location.href =
        "result?rightNum=" +
        this.rightNum +
        "&stageid=" +
        stageid +
        "&type=" +
        type +
        "&userstageid=" +
        userstageid +
        "&total=" +
        this.questionJson.length +
        "&genreid=" +
        genreid +
        "&moduleid=" +
        moduleid +
        "&urlCallBack=" +
        encodeURIComponent(urlCallBack);
      this.isGameOver = true;
    },
    //开始游戏
    startGame() {
      if (type == 2) {
        play();
      }
      this.isShow = false;
    },
    //弹出返回窗口
    goback() {
      document.getElementsByTagName("body")[0].className = "bover";
      this.isBack = true;
    },
    isGoback(num) {
      document.getElementsByTagName("body")[0].className = "";
      if (num == 0) {
        //取消
        this.isBack = false;
      } else {
        //确认退出
        this.isBack = false;
        // UXinJSInterface.popTheController();
        window.location.href = backToStageUrl;
      }
    },
    addQuestionRecord(id, isRight) {
      this.$http
        .get(
          "../Game/addUserAnswer?userstageid=" +
            userstageid +
            "&quesid=" +
            id +
            "&isright=" +
            isRight +
            "&type=" +
            type
        )
        .then(function(response) {})
        .catch(function(response) {
          console.log(response);
        });
    }
  },
  mounted() {
    this.getQuestion();
  }
};
</script>

<style>
</style>

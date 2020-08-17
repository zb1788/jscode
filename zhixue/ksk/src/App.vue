<template>
  <div id="app">
    <Head 
    :time="time" 
    @gameOver="gameOver" 
    @goback="goback"
    @goDel="goDel"
    @emptyWrong = "emptyWrong"
    :now="count+1" 
    :total="questionJson.length"
    :isBegTime="isStart"
    :iswrongView = "iswrongView"
    :isHasQues = "isHasQues"
    >
    </Head>
    <section>
      <!-- 
      <div class="topt">
        <div class="time"><span></span><i></i></div>
        <h5 class="yeq">1/15</h5>
      </div>
       -->
      <Empty v-if="!isHasQues"></Empty>
      <Select 
      v-if="question.quesType==1&&question.info.answerFlag==1&&isHasQues" 
      :question="question"
      @next="addCount"
      @prev="minusCount"
      @addAnswerLog="addQuestionRecord"
      :nowIndex="count" 
      :quesCount="questionJson.length"
      :isComplete= "isWrite"
      ></Select>
      <SelectMore 
      v-if="question.quesType==1&&question.info.answerFlag==2&&isHasQues" 
      :question="question"
      @next="addCount"
      @prev="minusCount"
      @addAnswerLog="addQuestionRecord"
      :nowIndex="count" 
      :quesCount="questionJson.length"
      :isComplete= "isWrite"
      ></SelectMore>
      <TianKong 
      v-if="question.quesType==2&&isHasQues" 
      :question="question" 
      @addAnswerLog="addQuestionRecord"
      @next="addCount"></TianKong>
    </section>
    <Dialog 
    v-if="isShow"
    :gonggao="gonggao"
    :rcode="rcode"
    :plsurl="plsurl"    
    :userName="userName"
    @startGame="startGame"
    @close="close"
    >
    </Dialog>
    <Confirm v-if="isBack" @isback="isGoback"></Confirm>
    <ConfirmDel v-if="isDel" @isGoDel="isGoDel"></ConfirmDel>
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
    alert("您的手机不支持预览功能");
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
var type = GetQueryString("type"); //1:普通选择题2：听算带音频的填空题
var iswrong = GetQueryString("iswrong"); //0:正常做题1：错题本
var urlCallBack = GetQueryString("urlCallBack"); //关卡列表页面地址需要的callback
var title = getLocalStorage("sx_title"); //关卡页面需要的title
var gradeid = GetQueryString("gradeid"); //关卡页面需要的gradeid
var subjectid = GetQueryString("subjectid"); //关卡页面需要的subjectid
//var moduleid = getLocalStorage("sx_moduleid"); //关卡页面需要的moduleid
var moduleid = GetQueryString("moduleid"); //关卡页面需要的moduleid
var ks_short_name = getLocalStorage("ks_short_name"); //关卡页面需要的ks_short_name
var backToStageUrl =
  "stagelist?genreid=" +
  genreid +
  "&gradeid=" +
  gradeid +
  "&subjectid=" +
  subjectid +
  "&moduleid=" +
  moduleid +
  "&urlCallBack=" +
  encodeURIComponent(urlCallBack) +
  "&ks_short_name=" +
  encodeURI(encodeURI(title));




if (iswrong == 1) {
  var getUrl = "../Game/getWrongView?genreid=" + genreid;
} else {
  var getUrl = "../Game/getQuesView?stageid=" + stageid + "&type=" + type;
}

//1:houtai;2:zaixian;3:dev
var debug = "zaixian";
if (debug == "dev") {
  var getUrl = "api/getQues";
  // var getUrl = "api/getWrong";
}
//---------------------------------------------------------
//126后台预览需要
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
    UXinJSInterfaceSpeech.playAudio(domain + "nan/" + voiceArr[count] + ".mp3");
  } catch (e) {}
}

import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
import Head from "./components/Head";
import Select from "./components/Select";
import SelectMore from "./components/SelectMore";
import TianKong from "./components/TianKong";
import Dialog from "./components/Dialog";
import Confirm from "./components/Confirm";
import ConfirmDel from "./components/ConfirmDel";
import Empty from "./components/Empty";

export default {
  name: "App",
  components: {
    Head,
    Select,
    SelectMore,
    TianKong,
    Dialog,
    Confirm,
    ConfirmDel,
    Empty
  },
  store,
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
      isBack: false, //是否返回
      isDel: false, //是否清空错替本
      // gonggao: {
      //   keypoint: "",
      //   example: "",
      //   thinking: ""
      // },
      gonggao: "",
      plsurl: "",
      rcode: "",
      userName: "",
      time: 0, //时间
      count: 0, //从第几道题开始
      // now: 1,
      isGameOver: false,
      // resultStr: "",
      rightNum: 0, //做对数量
      isWrite: false, //是否能答题（上一题只能看不能做）
      // writeNum: 0 //
      isHasQues: true //是否有试题
    };
  },
  computed: {
    iswrongView() {
      if (iswrong == 1) {
        return true;
      } else {
        return false;
      }
    },
    //只有ajax成功后，再把时间传递下去
    isStart() {
      if (this.questionJson.length > 0) {
        if (this.time == 0) {
          return true;
        } else {
          return this.isShow;
        }
      } else {
        return true;
      }
    }
  },
  methods: {
    ...mapMutations(["add", "reduce"]),
    getQuestion() {
      if (iswrong == 1) {
        this.isWrite = true;
      }
      var self = this;
      this.$http
        // .get("api/getQues")
        // .get("../Game/getQuesView?stageid=" + stageid + "&type=" + type)
        .get(getUrl)
        .then(function(response) {
          if (response.data.ques.length == 0) {
            //没有试题
            self.isHasQues = false;
            return false;
          }
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
            self.rcode = response.data.stage[0].r_code;
            self.plsurl = response.data.pls_url;
            self.userName = response.data.userName;
          }
          // if (
          //   response.data.stage[0].keypoint == "" ||
          //   response.data.stage[0].example == "" ||
          //   response.data.stage[0].thinking == ""
          // ) {
          //   self.isShow = false;
          // } else {
          //   self.isShow = true;
          //   self.gonggao.keypoint = response.data.stage[0].keypoint;
          //   self.gonggao.example = response.data.stage[0].example;
          //   self.gonggao.thinking = response.data.stage[0].thinking;
          // }

          // for (var i in response.data.ques) {
          //   self.questionArr.push(response.data.ques[i]);
          // }
          self.questionJson = response.data.ques;
          self.question.id = response.data.ques[self.count].id;
          self.question.quesType = response.data.ques[self.count].questype;
          self.question.info = eval(
            "(" + response.data.ques[self.count].content + ")"
          );

          if (iswrong == 1) {
            //错题本，只能看
            for (var i in response.data.useranswer) {
              self.add(response.data.useranswer[i]);
            }
            // self.add(response.data.useranswer);
            // console.log(self.$store.state.userSelectAnswerArr);
          }

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
      var that = this;
      if (this.count < this.questionJson.length - 1) {
        that.count++;
        // alert(this.writeNum + "/" + this.count);
        if (this.$store.state.writeNum < this.count) {
          if (iswrong != 1) {
            this.isWrite = false;
          }
          // this.addQuestionRecord(id, isRight);
        }
        // if (this.count > this.writeNum) {
        //   that.writeNum = that.count;
        // }
        if (!that.isGameOver) {
          that.getNextQuestion();
        }
        // setTimeout(function() {
        //   that.count++;
        //   if (!that.isGameOver) {
        //     that.getNextQuestion();
        //   }
        // }, 1000);
      } else {
        if (debug == "houtai") {
          // console.log(this.resultStr);
          alert("结束");
          return false;
        }
        if (iswrong == 1) {
          //点击错题本的完成按钮
          // UXinJSInterface.popTheController();
          window.location.href = backToStageUrl;
        } else {
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
            "&gradeid=" +
            gradeid+
            "&subjectid=" +
            subjectid+            
            "&urlCallBack=" +
            encodeURIComponent(urlCallBack);
        }
      }
    },
    //上一题
    minusCount() {
      this.count--;
      this.isWrite = true;
      this.question.id = this.questionJson[this.count].id;
      this.question.quesType = this.questionJson[this.count].questype;
      this.question.info = eval(
        "(" + this.questionJson[this.count].content + ")"
      );
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
        "&gradeid=" +
        gradeid+
        "&subjectid=" +
        subjectid+           
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
      if (iswrong == 1) {
        //错题本
        // UXinJSInterface.popTheController();
        window.location.href = backToStageUrl;
      } else {
        //正常答题，返回需要弹出确认窗口
        document.getElementsByTagName("body")[0].className = "bover";
        this.isBack = true;
      }
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
    close() {
      window.location.href = backToStageUrl;
    },
    //弹出是否清空错题本
    goDel() {
      document.getElementsByTagName("body")[0].className = "bover";
      this.isDel = true;
    },
    isGoDel(num) {
      document.getElementsByTagName("body")[0].className = "";
      if (num == 0) {
        //取消
        this.isDel = false;
      } else {
        //确认清空
        this.isDel = false;
        this.emptyWrong();
      }
    },
    addQuestionRecord(id, isRight, userselect) {
      this.$http
        .get(
          "../Game/addUserAnswer?userstageid=" +
            userstageid +
            "&quesid=" +
            id +
            "&isright=" +
            isRight +
            "&type=" +
            type +
            "&userselect=" +
            userselect +
            "&stageid=" +
            stageid
        )
        .then(function(response) {})
        .catch(function(response) {
          console.log(response);
        });
    },
    //清空错题本
    emptyWrong() {
      var self = this;
      self.isHasQues = false;
      self.questionJson = "";
      this.$http
        .get("../Game/emptyWrongNotes?genreid=" + genreid)
        .then(function(response) {})
        .catch(function(response) {
          // console.log(response);
        });
    }
  },
  mounted() {
    this.getQuestion();
  }
};
</script>

<style>
.bover {
  overflow: hidden;
  height: 100%;
  position: fixed;
}
</style>

<template>
  <div class="timu" style="display: block;">
    <div class="padL">
      <h5 class="textH5" v-html="question.info.quesName"></h5>
      <template v-if="question.info.quesContent!==''">
        <p v-if="question.info.quesContentType===1" class="fenx">{{question.info.quesContent}}</p>
        <img v-if="question.info.quesContentType===2" class="timu100"  :src="question.info.quesContent"/>
      </template>   
      <template v-if="question.info.quesChoiceType===1">
        <ul class="listIww">
            <li 
              v-for="(item,index) in question.info.quesChoice" 
              :key="item.flag"
              @click="choose(index)"
              :class="[index===filter?'cur':'']"
            >
              <em>{{item.flag}}.</em>
              <span>{{item.content}}</span>
            </li>
          </ul>
      </template>   
      <template v-if="question.info.quesChoiceType===2">
        <ul class="listImage tp">
          <li 
            :class="['table',index===filter?'cur':'']"
            v-for="(item,index) in question.info.quesChoice" 
            :key="item.flag"
            @click="choose(index)"
          >
            <em>{{item.flag}}.</em>
            <span><img :src="item.content"></span>
          </li>
        </ul>
      </template> 
    </div>
    <div class="padR" v-if="isShowAnswer">
      <h6 class="textH6" >
        您选择的答案<font class="redFont">{{this.answerArr[this.filter]}}</font> ,
        正确答案<font class="redFont">{{this.question.info.answer.join(',')}}</font>
      </h6>
    </div>
    <div class="padR">
      <div class="look" v-if="isShowJiexiButton&&question.info.jiexi!=''" @click="showJiexiContent">
        <a class="ckjx">查看解析</a>
      </div>
      <div class="look2 pad10" v-if="isShowJiexi">
      <p><label>解析:</label></p>
      <p>{{question.info.jiexi}}</p>
      </div>
    </div>
    <transition name="bounce">
      <div class="puanduan01" v-if="isError==0">
        <img src="../assets/images/ksk/cuo.png" class="img100">
      </div>
      <div class="puanduan01" v-if="isError==1">
        <img src="../assets/images/ksk/dui.png" class="img100">
      </div>
    </transition>
    <div class="mb50"></div>
    <div class="nrBtn">
      <a v-if="nowIndex>0" @click="preQuestion">上一题</a>
      <a class="" v-if="isShowTijiaoButton" @click="submitQues" >提交</a>
      <a v-if="isShowNextButton" @click="nextQuestion" >下一题</a>
      <a v-if="isShowComplateButton" @click="gameOver">完成</a>
    </div>
    <div v-if="isReadOnly"></div>
  </div>
</template>

<script>
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
export default {
  props: ["question", "nowIndex", "isComplete", "quesCount"],
  data() {
    return {
      filter: -1,
      filterRight: -1,
      filterWrong: -1,
      answerArr: ["A", "B", "C", "D", "E", "F"],
      // isComplete: false,
      isDo: false,
      isShowJiexiButton: false,
      isShowJiexi: false,
      isShowNextButton: false,
      isShowTijiaoButton: true,
      isShowComplateButton: false,
      isShowAnswer: false,
      isRight: -1, //当前答案对错 0错误 1正确
      isError: -1, //内部使用弹出对错图片
      userSelectArr: []
    };
  },
  mounted() {},
  computed: {
    isReadOnly() {
      if (this.isComplete) {
        //查看上一题
        this.filter = this.$store.state.userSelectAnswerArr[this.nowIndex];
        this.isShowJiexiButton = true;
        this.isShowTijiaoButton = false;
        this.isShowJiexi = false;
        this.isShowAnswer = true;
        if (this.nowIndex >= this.quesCount - 1) {
          //没有下一题了
          this.isShowComplateButton = true;
          this.isShowNextButton = false;
        } else {
          this.isShowNextButton = true;
          this.isShowComplateButton = false;
        }
        return true;
      } else {
        this.isShowJiexiButton = false;
        this.isShowNextButton = false;
        this.isShowTijiaoButton = true;
        this.isShowJiexi = false;
        this.isShowAnswer = false;
        return false;
      }
    }
    // isDo() {
    //   return this.isComplete;
    // }
    // isWrap() {
    //   var flag = true;
    //   for (var i of this.question.quesChoice) {
    //     console.log(i.content.length);
    //     if (i.content.length > 8) {
    //       flag = false;
    //       break;
    //     }
    //     console.log(i);
    //   }
    //   return flag;
    // }
  },
  store,
  methods: {
    ...mapMutations(["add", "reduce"]),
    choose: function(index) {
      if (this.isDo) {
        return false;
      }
      if (!this.isComplete) {
        //做题
        // if (!this.isDo) {
        //第一次选择
        this.filter = index;
        // }
      } else {
        //查看上一题
        // alert("xx");
      }
    },
    findEleInArr(ele, arr) {
      if (!Array.indexOf) {
        Array.prototype.indexOf = function(obj) {
          for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
              return i;
            }
          }
          return -1;
        };
      }
      var index = arr.indexOf(ele);
      return index;
    },
    //提交答案
    submitQues() {
      // this.$emit("next", this.question.id, this.isRight);
      // this.userSelectArr.push(this.filter);
      this.isDo = true;
      this.add(this.filter);
      this.$store.state.writeNum = this.nowIndex;
      if (
        typeof this.question.info.quesChoice[this.filter] != "undefined" &&
        this.question.info.quesChoice[this.filter].flag ==
          this.question.info.answer
      ) {
        console.log("right");
        this.isRight = 1;
      } else {
        console.log("wrong");
        this.isRight = 0;
      }
      this.$emit("addAnswerLog", this.question.id, this.isRight);

      this.isError = this.isRight;
      var self = this;
      setTimeout(function() {
        self.isError = -1;
      }, 1000);

      this.isShowJiexiButton = true;
      this.isShowTijiaoButton = false;
      this.isShowAnswer = true;
      if (this.nowIndex >= this.quesCount - 1) {
        //没有下一题了
        this.isShowComplateButton = true;
        this.isShowNextButton = false;
      } else {
        this.isShowNextButton = true;
        this.isShowComplateButton = false;
      }
    },
    //下一题
    nextQuestion() {
      this.isDo = false;
      this.$emit("next", this.question.id, this.isRight);
      if (!this.isReadOnly) {
        //正常做题
        this.isShowJiexiButton = false;
        this.isShowNextButton = false;
        this.isShowTijiaoButton = true;
        this.isShowJiexi = false;
        this.isShowComplateButton = false;
        this.isShowAnswer = false;
      } else {
        //只能查看试题
        this.isShowJiexiButton = true;
        this.isShowTijiaoButton = false;
        this.isShowJiexi = false;
        this.isShowAnswer = true;
        if (this.nowIndex >= this.quesCount - 1) {
          this.isShowNextButton = false;
          this.isShowComplateButton = true;
        } else {
          this.isShowNextButton = true;
          this.isShowComplateButton = false;
        }
      }
      this.filter = -1;
      this.isRight = -1;
    },
    //展示解析内容
    showJiexiContent() {
      this.isShowJiexi = true;
    },
    //上一题
    preQuestion() {
      this.filter = -1;
      this.isDo = false;
      this.isShowJiexiButton = false;
      this.isShowJiexi = false;
      this.isShowTijiaoButton = false;
      this.isShowNextButton = true;
      this.isRight = -1;
      if (this.nowIndex > 0) {
        this.$emit("prev");
      }
    },
    gameOver() {
      this.$emit("next", this.question.id, this.isRight);
    }
  }
};
</script>

<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>

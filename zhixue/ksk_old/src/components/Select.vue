<template>
  <div class="timu" style="display: block;">
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
            :class="[index===filterRight?'cur':'',index===filterWrong?'not':'']"
            style="display:inline-flex;width: 100%;"
          >
            <em>{{item.flag}}.</em>
            <span v-html="item.content"></span>
          </li>
        </ul>
    </template>   
    <template v-if="question.info.quesChoiceType===2">
      <ul class="listImage tp">
        <li 
          :class="['table',index===filterRight?'cur':'',index===filterWrong?'not':'']"
          v-for="(item,index) in question.info.quesChoice" 
          :key="item.flag"
          @click="choose(index)"
        >
          <em>{{item.flag}}.</em>
          <span style="background-color: white;"><img :src="item.content"></span>
        </li>
      </ul>
    </template> 
  </div>
</template>

<script>
export default {
  props: ["question"],
  data() {
    return {
      filter: 0,
      filterRight: -1,
      filterWrong: -1,
      answerArr: ["A", "B", "C", "D", "E", "F"],
      isComplete: false
    };
  },
  computed: {
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
  methods: {
    choose: function(index) {
      if (!this.isComplete) {
        //第一次选择
        if (typeof this.question.info.answer == "string") {
          var rightAnswer = this.question.info.answer;
        } else {
          var rightAnswer = this.question.info.answer[0];
        }
        if (this.question.info.quesChoice[index].flag == rightAnswer) {
          console.log("right");
          this.filterRight = index;
          this.$emit("next", this.question.id, 1);
        } else {
          console.log("wrong");
          this.filterWrong = index;
          this.filterRight = this.findEleInArr(rightAnswer, this.answerArr);
          this.$emit("next", this.question.id, 0);
        }
        this.isComplete = true;
        var that = this;
        setTimeout(function() {
          that.filterRight = -1;
          that.filterWrong = -1;
          that.isComplete = false;
        }, 1000);
      } else {
        //连续点击不处理
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
    }
  }
};
</script>

<style>
/* ul.listIww li.right {
  border:solid 1px #6bcbca;
  box-sizing: border-box;
  box-shadow: 1px 1px 10px #00a65a;
  border-radius: 10px;
  overflow: hidden;
}
.right {
  border: solid 3px #6bcbca;
  box-sizing: border-box;
  box-shadow: 1px 1px 10px #00a65a;
  border-radius: 10px;
  overflow: hidden;
}
ul.listIww li.wrong {
  border:solid 1px #6bcbca;
  box-sizing: border-box;
  box-shadow: 1px 1px 10px red;
  border-radius: 10px;
  overflow: hidden;
}
.wrong {
  border:solid 1px #6bcbca;
  box-sizing: border-box;
  box-shadow: 1px 1px 10px red;
  border-radius: 10px;
  overflow: hidden;
} */
</style>

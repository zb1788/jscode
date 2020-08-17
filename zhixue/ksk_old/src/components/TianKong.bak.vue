<template>
<div>
  <div class="timu" style="display: block;">
    <p class="fenx" v-if="questionNew.info.quesName!=''">{{questionNew.info.quesName}}</p>
    <!-- 普通算式 -->
    <div v-if="questionNew.info.quesContentType==1" class="fenx">
      <span 
      class="fend"
      v-for="(item,index) in questionNew.info.quesContent"
      :key="index"
      >
      <label v-if="item!='#'">{{item}}</label>
      <label v-if="item=='#'"><label :class="['fkong',index==findex?'item':'']" @click="chongP(index)">{{answerInput[index]}}</label></label>
      </span>
    </div>
    <!-- 分数 -->
    <div v-if="questionNew.info.quesContentType==2" class="fenx">
      <span 
      class="fens"
      v-for="(item,index1) in questionNew.info.quesContent"
      :key="index1"
      >
        <template v-if="item.length==1">
          {{item}}
        </template>
        <template v-if="item.length>1" v-for="(ii,index2) in item">
          <label v-if="ii=='#'" :class="['fkong',findex==index1&&lindex==index2?'item':'']" :key="index2" @click="choose(index1,index2)">{{answerInput[index1+'-'+index2]}}</label>
          <label v-if="ii!='#' && ii!='/'" :key="index2">{{ii}}</label>
        </template>
      </span>
    </div>
    <!-- 余数 -->
    <div v-if="question.info.quesContentType==3" class="fenx">
      <span 
      class="fend"
      v-for="(item,index) in questionNew.info.quesContent"
      :key="index"
      >
          <label v-if="item!='#' && item!='|'">{{item}}</label>
          <label v-if="item=='|'">······</label>
          <label v-if="item=='#'"><label :class="['fkong',index==findex?'item':'']" @click="chongP(index)">{{answerInput[index]}}</label></label>
      </span>
    </div>
    <!-- 正确 -->
    <div class="panduan" v-if="filter==1">
      <i class="icon-correct04"></i>
    </div>
    <!-- 错误 -->
    <div class="panduan" v-if="filter==2">
      <i class="icon-error02"></i>
    </div>
  </div>
  <div class="keyboard" style="display: block;">
		<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td @click="tijiao(1)">
					<a>1</a>
				</td>
				<td @click="tijiao(2)">
					<a>2</a>
				</td>
				<td @click="tijiao(3)">
					<a>3</a>
				</td>
				<td @click="tijiao(-1)">
					<a class="redFont">删除</a>
				</td>
			</tr>
			<tr>
				<td @click="tijiao(4)">
					<a>4</a>
				</td>
				<td @click="tijiao(5)">
					<a>5</a>
				</td>
				<td @click="tijiao(6)">
					<a>6</a>
				</td>
				<td rowspan="3" valign="middle" class="dd" @click="changeNext">
					<span>下一题</span>
				</td>
			</tr>
			<tr>
				<td @click="tijiao(7)">
					<a>7</a>
				</td>
				<td @click="tijiao(8)">
					<a>8</a>
				</td>
				<td @click="tijiao(9)">
					<a>9</a>
				</td>
			</tr>
			<tr>
				<td @click="tijiao(0)">
					<a>0</a>
				</td>
				<td @click="tijiao('.')">
					<a>.</a>
				</td>
				<td @click="tijiao('00')">
					<a>00</a>
				</td>
			</tr>
		</table>
	</div>
</div>
</template>

<script>
export default {
  props: ["question"],
  data() {
    return {
      findex: -1,
      lindex: -1,
      answerInput: [], //用户输入的数组
      answerArr: [], //保存输入位置的数组
      isRight: false,
      filter: 0,
      isComplete: false //提交按钮禁止连续点击
    };
  },
  computed: {
    questionNew() {
      if (this.question.info.quesContentType == 2) {
        for (var i in this.question.info.quesContent) {
          if (this.question.info.quesContent[i].length > 1) {
            for (var ii in this.question.info.quesContent[i]) {
              if (this.question.info.quesContent[i][ii] == "#") {
                this.answerArr.push(i + "-" + ii);
                if (this.findex == -1) {
                  this.findex = i;
                }
                if (this.lindex == -1) {
                  this.lindex = ii;
                }
              }
            }
          }
        }
      } else if (
        this.question.info.quesContentType == 1 ||
        this.question.info.quesContentType == 3
      ) {
        for (var i in this.question.info.quesContent) {
          if (this.question.info.quesContent[i] == "#") {
            this.answerArr.push(i);
            if (this.findex == -1) {
              this.findex = i;
            }
          }
        }
      }
      return this.question;
    }
  },
  methods: {
    //分数切换
    choose(index1, index2) {
      this.findex = index1;
      this.lindex = index2;
      this.answerArr = [];
    },
    //普通算式切换
    chongP(index) {
      this.findex = index;
      this.answerArr = [];
    },
    objKeySort(arys) {
      var newkey = Object.keys(arys).sort();
      // var newObj = {}; //创建一个新的数据，用于存放排好序的键值对
      var arr = [];
      for (var i = 0; i < newkey.length; i++) {
        //遍历newkey数组
        // newObj[newkey[i]] = arys[newkey[i]];
        arr[newkey[i]] = arys[newkey[i]];
        //向新创建的对象中按照排好的顺序依次增加键值对
      }
      return arr;
      // return newObj; //返回排好序的新对象
    },
    //下一题
    changeNext() {
      if (!this.isComplete) {
        if (this.question.info.answer.length > 1) {
          //有多个空
          var userinput = "";
          // var arr = [];
          // arr["3-3"] = 1;
          // arr["1-1"] = 4;
          // console.log(this.objKeySort(arr));
          // return false;

          for (var i in this.objKeySort(this.answerInput)) {
            userinput += this.answerInput[i] + "#";
          }

          userinput = userinput.substring(0, userinput.length - 1); //用户输入的答案，是按照顺序的

          //判断是否数组,如果是数组说明有多组答案
          if (typeof this.question.info.answer[0] == "string") {
            //不是数组 没有多个答案
            if (userinput == this.question.info.answer.join("#")) {
              this.isRight = true;
            }
          } else {
            for (var i in this.question.info.answer) {
              if (userinput == this.question.info.answer[i].join("#")) {
                this.isRight = true;
                break;
              }
            }
          }
        } else {
          var answerflag = true;
          // return false;
          for (var i in this.answerArr) {
            //只有一个答案
            console.log(this.answerInput[this.answerArr[i]]);
            console.log(this.question.info.answer[0]);
            if (
              this.answerInput[this.answerArr[i]] !=
              this.question.info.answer[0]
            ) {
              answerflag = false;
              break;
            }
          }
          this.isRight = answerflag;
        }
        // console.log("xxx");
        // return false;
        if (this.isRight) {
          this.filter = 1;
          this.$emit("next", this.question.id, 1);
        } else {
          this.filter = 2;
          this.$emit("next", this.question.id, 0);
        }
        this.isComplete = true;
        var that = this;
        setTimeout(function() {
          that.findex = -1;
          that.lindex = -1;
          that.answerInput = [];
          that.answerArr = [];
          that.isRight = false;
          that.filter = 0;
          that.isComplete = false;
        }, 500);
      }
    },
    tijiao(num) {
      if (this.isComplete) {
        //禁止连续提交
        return false;
      }
      if (num != -1) {
        console.log(this.answerInput);
        //不是删除按钮
        if (
          this.question.info.quesContentType == 1 ||
          this.question.info.quesContentType == 3
        ) {
          //普通算式
          if (typeof this.answerInput[this.findex] != "undefined") {
            this.$set(
              this.answerInput,
              this.findex,
              this.answerInput[this.findex].toString() + num.toString()
            );
          } else {
            this.$set(this.answerInput, this.findex, num);
          }
        } else {
          //分数
          console.log("xx");
          console.log(this.answerInput[this.findex + "-" + this.lindex]);
          if (
            typeof this.answerInput[this.findex + "-" + this.lindex] !=
            "undefined"
          ) {
            this.$set(
              this.answerInput,
              this.findex + "-" + this.lindex,
              this.answerInput[this.findex + "-" + this.lindex].toString() +
                num.toString()
            );
          } else {
            this.$set(this.answerInput, this.findex + "-" + this.lindex, num);
          }
        }
      } else {
        //删除
        if (
          this.question.info.quesContentType == 1 ||
          this.question.info.quesContentType == 3
        ) {
          //普通算式
          this.$set(this.answerInput, this.findex, "");
        } else {
          this.$set(this.answerInput, this.findex + "-" + this.lindex, "");
        }
      }
    }
  }
};
</script>

<style>

</style>

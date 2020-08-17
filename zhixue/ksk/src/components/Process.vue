<template>
	<div>
		<canvas id="canvas" width="40" height="40" style="border-radius:100%;vertical-align:middle;"></canvas>
	</div>
</template>

<script>
var draw;
class Draw {
  constructor(el, speed) {
    this.el = el;
    this.speed = speed; //加载的快慢就靠它了
    this.canvas = document.getElementById(this.el);
    this.context = this.canvas.getContext("2d");
    this.centerX = this.canvas.width / 2; //Canvas中心点x轴坐标
    this.centerY = this.canvas.height / 2; //Canvas中心点y轴坐标
    this.rad = Math.PI * 2 / this.speed; //将360度分成100份，那么每一份就是rad度
    this.r = 18; //圆的半径
    this.lineColor = "#fff";
  }

  //绘制5像素宽的运动外圈
  blueCircle(n) {
    this.context.save();
    this.context.strokeStyle = "#19a0a7"; //设置描边样式
    this.context.lineWidth = 3; //设置线宽
    this.context.beginPath(); //路径开始
    this.context.arc(
      this.centerX,
      this.centerY,
      this.r,
      -Math.PI / 2,
      -Math.PI / 2 + n * this.rad,
      false
    ); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
    this.context.stroke(); //绘制
    this.context.closePath(); //路径结束
    this.context.restore();
  }
  //绘制白色外圈
  whiteCircle() {
    this.context.save();
    this.context.beginPath();
    this.context.lineWidth = 4; //设置线宽
    this.context.strokeStyle = this.lineColor;
    this.context.arc(this.centerX, this.centerY, this.r, 0, Math.PI * 2, false);
    this.context.stroke();
    this.context.closePath();
    this.context.restore();
  }
  //百分比文字绘制
  text(n) {
    this.context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
    this.context.strokeStyle = this.lineColor; //设置描边样式
    this.context.font = "20px Arial"; //设置字体大小和字体
    //绘制字体，并且指定位置
    if (this.speed > 99) {
      this.context.strokeText(
        n.toFixed(0),
        this.centerX - 18,
        this.centerY + 8
      );
    } else if (this.speed > 9 && this.speed < 100) {
      this.context.strokeText(
        n.toFixed(0),
        this.centerX - 10,
        this.centerY + 8
      );
    } else {
      this.context.strokeText(n.toFixed(0), this.centerX - 5, this.centerY + 8);
    }

    this.context.stroke(); //执行绘制
    this.context.restore();
  }
  drawFrame() {
    //动画循环
    var that = this;
    var timer = setInterval(function() {
      if (that.speed >= 0) {
        // console.log(that.speed);
        that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
        that.whiteCircle();
        that.text(that.speed);
        that.blueCircle(that.speed);
        that.speed -= 1;
        if (that.speed <= 10) {
          that.context.strokeStyle = "#ffef6a";
          if (that.speed % 2 == 0) {
            // that.canvas.style.backgroundColor = "#ffef6a";
          } else {
            // that.canvas.style.backgroundColor = "#6bcbca";
          }
        }
      } else {
        // that.canvas.style.backgroundColor = "red";
        clearInterval(timer);
      }
    }, 1000);
  }
}
// var canvas = document.getElementById("canvas"); //获取canvas元素
// var context = canvas.getContext("2d"); //获取画图环境，指明为2d
// var centerX = canvas.width / 2; //Canvas中心点x轴坐标
// var centerY = canvas.height / 2; //Canvas中心点y轴坐标
// var rad = Math.PI * 2 / 100; //将360度分成100份，那么每一份就是rad度
// var speed = 0.1; //加载的快慢就靠它了

export default {
  props: ["time"],
  data() {
    return {};
  },
  mounted() {
    draw = new Draw("canvas", this.time);
    var that = this;
    var timer = setInterval(function() {
      if (draw.speed >= 0) {
        if (draw.speed <= 10) {
          draw.lineColor = "#ffef6a";
          // if (draw.speed % 2 == 0) {
          //   draw.canvas.style.backgroundColor = "red";
          // } else {
          //   draw.canvas.style.backgroundColor = "#6bcbca";
          // }
        }
        draw.context.clearRect(0, 0, draw.canvas.width, draw.canvas.height);
        draw.whiteCircle();
        draw.text(draw.speed);
        draw.blueCircle(draw.speed);
        draw.speed -= 1;
      } else {
        // draw.canvas.style.backgroundColor = "red";
        clearInterval(timer);
        that.gameOver();
      }
    }, 1000);
  },
  methods: {
    gameOver() {
      this.$emit("gameOver");
    }
  }
};
</script>

<style>

</style>

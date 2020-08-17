/*
 * @Author: your name
 * @Date: 2020-04-28 19:06:32
 * @LastEditTime: 2020-04-29 17:55:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\src\common\js\rem.js
 */
// 基准大小
const BASE_SIZE = 32,

  // 设计图宽度
  DESIGNED_WIDTH = 1366;

// 设置rem函数
function setRem () {
  const scale = document.documentElement.clientWidth / DESIGNED_WIDTH;
  // 设置根节点字体大小
  // document.documentElement.style.fontSize = (BASE_SIZE * Math.min(scale, 2)) + 'px'
  document.documentElement.style.fontSize = (
    (BASE_SIZE * Math.min(scale, 2)) < 32 ? 32 : 32
  ) + 'px';
}

// 初始化
setRem();
// 改变窗口大小时重置rem
window.onresize = function () {
  setRem();
};

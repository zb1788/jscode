// 基准大小
const BASE_SIZE = 24,
  // 设计图宽度
  DESIGNED_HEIGHT = 1080;

// 设置rem函数
function setRem () {
  const scale = window.screen.height / DESIGNED_HEIGHT;
  // 设置根节点字体大小
  document.documentElement.style.fontSize = (BASE_SIZE * Math.min(scale, 2)) + 'px';
}

export const init = () => {
  // 初始化
  setRem();
  // 改变窗口大小时重置rem
  window.onresize = function () {
    setRem();
  };
};



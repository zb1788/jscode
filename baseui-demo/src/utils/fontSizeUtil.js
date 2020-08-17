// 基准大小
const BASE_SIZE = 32,
  // 设计图宽度
  DESIGNED_HEIGHT = 1920;

// 设置rem函数
function setRem () {
  const scale = document.documentElement.clientWidth / DESIGNED_HEIGHT;
  // 设置根节点字体大小
  document.documentElement.style.fontSize = ((BASE_SIZE * Math.min(scale, 2)) < 32 ? 32 : (BASE_SIZE * Math.min(scale, 2))) + 'px';
}

export const init = () => {
  // 初始化
  setRem();
  // 改变窗口大小时重置rem
  window.onresize = function () {
    setRem();
  };
};


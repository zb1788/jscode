/*
 * @Author: your name
 * @Date: 2019-12-02 11:17:01
 * @LastEditTime: 2019-12-12 20:36:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \user-center\src\utils\index.js
 */
// const util = require('util')
export function debounce (fn, delay = 500) {
  let timer = null;
  return async function () {
    if (timer) {
      clearTimeout(timer);
    }
    await new Promise((resolve, reject) => {
      timer = setTimeout(() => {
        resolve();
      }, delay);
    });
    // let setTimeout_ = util.promisify(setTimeout)
    // console.log('setTimeout_', setTimeout_)
    // await setTimeout_(1000)
    let flag = await fn.call(this, ...arguments);
    timer = null;
    return flag;
  };
}

/**
 * 打开新窗口
 * @param {string} url
 */
export function openWindow (url) {
  const $link = document.createElement('a');
  $link.href = url;
  $link.setAttribute('target', '_blank');
  document.body.appendChild($link);
  $link.click();
  document.body.removeChild($link);
}

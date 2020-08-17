/*
 * @Author: your name
 * @Date: 2020-04-28 19:12:14
 * @LastEditTime: 2020-05-07 13:11:55
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \base-tpl\src\utils\download.js
 */
/**
 * 下载图片
 * @param image
 */
export function downloadImage (image, fileName) {
  let canvas = document.createElement('canvas');
  canvas.width = image.width * 2;
  canvas.height = image.height * 2;
  let context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, image.width * 2, image.height * 2);

  if (window.navigator.msSaveBlob) {
    try {
      window.navigator.msSaveBlob(canvas.msToBlob(), `${fileName}.png`);
    } catch (e) {
    }
    return;
  }
  let a = document.createElement('a');
  a.download = fileName;
  a.href = canvas.toDataURL('image/png');
  a.dispatchEvent(new MouseEvent('click'));
}

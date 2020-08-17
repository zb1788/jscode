/*
 * @Author: your name
 * @Date: 2020-04-28 19:12:14
 * @LastEditTime: 2020-04-28 19:12:40
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \base\src\utils\image.js
 */
export function resizeBase64Image (
  str,
  {
    width,
    height
  } = { width: 200, height: 300 }
) {
  let image = new Image();
  image.src = str;

  return new Promise((resolve) => {
    image.onload = function () {
      let canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;

      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
  });
}

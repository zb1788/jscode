/*
 * @Author: your name
 * @Date: 2020-04-28 19:12:14
 * @LastEditTime: 2020-04-28 19:12:31
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \base\src\utils\area.js
 */
export function getAreaIdList (str = '') {
  const arr = str.split('.');

  return Array.from({ length: arr.length }, (v, i) => {
    return arr.slice(0, i + 1).join('.');
  });
}

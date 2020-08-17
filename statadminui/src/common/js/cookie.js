/*
 * @Author: your name
 * @Date: 2020-04-28 19:06:32
 * @LastEditTime: 2020-04-29 18:09:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\src\common\js\cookie.js
 */
// 设置cookie
var setCookie = function (name, value, day, path, domain) {
    day = day || 30;
    path = path || '/';
    var str = name + '=' + value + '; ';
    if (day) { str += 'expires=' + new Date(Date.now() + day * 24 * 3600 * 1000).toGMTString() + '; '; }
    if (path) { str += 'path=' + path + '; '; }
    if (domain) { str += 'domain=' + domain; }
    document.cookie = str;
  },

  // 获取cookie
  getCookie = function (name) {
    if (document.cookie.length > 0) {
      var cookstart = document.cookie.indexOf(name + '=');
      if (cookstart !== -1) {
        cookstart = cookstart + name.length + 1;
        var cookend = document.cookie.indexOf(';', cookstart);
        if (cookend === -1) { cookend = document.cookie.length; }
        return unescape(document.cookie.substring(cookstart, cookend));
      }
    }
    return '';
  },

  // 删除cookie
  deleteCookie = function (name) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() - 1);
    document.cookie = name + '= ; expires=' + exdate.toGMTString() + ';path=/;';
  };
export default {
  setCookie,
  getCookie,
  deleteCookie
  // deleteCookie
};

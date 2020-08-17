/*
 * @Author: your name
 * @Date: 2019-12-10 16:31:27
 * @LastEditTime: 2020-04-28 19:12:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \user-center\src\utils\object.js
 */
/**
 * 判断对象类型
 * @param value
 * @returns {Function | Object | Array | String | RegExp | Number | Undefined | Null}
 */
export function typeOf (value) {
  const typeStr = Object.prototype.toString.call(value);

  return typeStr.substring(8, typeStr.length - 1);
}

/**
 * 判断对象是否为空
 * @param value
 * @returns {boolean|*}
 */
export function isEmpty (value) {
  const config = [
    ['Array', val => !val.length],
    ['Object', val => !Object.keys(val).length],
    ['String', val => !val.trim().length],
    ['Undefined', val => true],
    ['Null', val => true]
  ];

  for (let i = 0; i < config.length; i++) {
    const [ type, func ] = config[i] || [];
    if (type === typeOf(value)) { return func(value); }
  }

  return false;
}
export function wipeEmpty (obj) {
  for (let k in obj) {
    if (isEmpty(obj[k])) {
      delete obj[k];
    }
  }
  return obj;
}

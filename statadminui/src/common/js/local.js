/*
 * @Author: your name
 * @Date: 2020-04-28 19:06:32
 * @LastEditTime: 2020-04-29 17:47:30
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \base\src\common\js\local.js
 */
/**
 * 本地存储
 * @configure {{default: Any, getApp: Function}}
 */
export class Local {
  constructor (configure = {}) {
    this.configure = configure || {};
  }

  getKey () {
    const {
      getKey: getKeyCallback = () => { return {}; }
    } = this.configure;

    return getKeyCallback();
  }

  set (val) {
    return localStorage.setItem(
      this.getKey(),
      val || this.configure.default
    );
  }

  get (key) {
    return localStorage.getItem(this.getKey()) ||
      this.configure.default ||
      '';
  }

  delete () {
    return localStorage.removeItem(this.getKey());
  }
}

/**
 * Object对象本地存储
 */
export class LocalObject extends Local {
  constructor (configure) {
    configure.default = configure.default || '{}';
    super(configure);
  }

  set (objectVal = {}) {
    super.set(JSON.stringify(objectVal));
  }

  get () {
    let val = super.get();

    return Object.prototype.toString.call(val) === '[object String]'
      ? JSON.parse(val)
      : (val || {});
  }
}

/**
 * Array对象本地存储
 */
export class LocalArray extends Local {
  constructor (configure) {
    configure.default = configure.default || '[]';
    super(configure);
  }

  set (arr = []) {
    super.set(JSON.stringify(arr));
  }

  get () {
    let val = super.get();

    return Object.prototype.toString.call(val) === '[object String]'
      ? JSON.parse(val)
      : (val || []);
  }
}

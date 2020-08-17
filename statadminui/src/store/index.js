/*
 * @Author: your name
 * @Date: 2020-04-28 13:23:40
 * @LastEditTime: 2020-04-29 17:48:03
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \base\src\store\index.js
 */
import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';

/**
 * 获取传入模块内所有 方法名称
 * @param storeModule {{namespaced: string}}
 * @param types {Object}
 * @param moduleName {string}
 * @return {{}}
 */
function formatModuleTypes (storeModule = {}, types = {}, moduleName = '') {
  const { namespaced } = storeModule;

  return !namespaced
    ? types
    : Object.keys(types).reduce((result = {}, key) => {
      result[key] = `${moduleName}/${types[key]}`;
      return result;
    }, {});
}

// 用户模块同步方法
export const USER_MUTATION_TYPES = formatModuleTypes(user, user.mutationTypes, 'user');

// 用户模块异步方法
export const USER_ACTION_TYPES = formatModuleTypes(user, user.actionTypes, 'user');

export default new Vuex.Store({
  modules: {
    user
  },
  strict: debug
});

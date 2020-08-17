'use strict';

/**
 * @Description: example store module
 * @author tianhao
 * @date 2019/7/27
 */

const mutationTypes = {
    SET_MSG: 'setMsg'
  },
  actionTypes = {
    SET_MSG: 'setMsg'
  },
  gettersTypes = {
    GET_MSG: 'getMsg'
  },
  // 状态
  state = {
    msg: 'Welcome to Your Vue.js App'
  },
  mutations = {
    [mutationTypes.SET_MSG] (state, msg) {
      state.msg = msg;
    }
  },
  actions = {
    [actionTypes.SET_MSG] ({ commit }, msg) {
      commit(mutationTypes.SET_MSG)(msg);
    }
  },
  getters = {
    [gettersTypes.GET_MSG] (state) {
      return state.msg;
    }
  };

export default {
  namespaced: true,
  state,
  mutationTypes,
  actionTypes,
  gettersTypes,
  mutations,
  actions,
  getters
};

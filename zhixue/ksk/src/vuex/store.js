import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  userSelectAnswerArr: [],
  writeNum: -1
  // isRead: false
};

const mutations = {
  add(state, n) {
    state.userSelectAnswerArr.push(n);
  },
  reduce(state) {
    state.count--;
  }
};
export default new Vuex.Store({
  state,
  mutations
});

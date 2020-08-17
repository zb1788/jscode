import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';

Vue.use(Vuex);

const getters = {};
Object.assign(getters, app.getters, user.getters);

const store = new Vuex.Store({
  modules: {
    app: app.name,
    user: user.name
  },
  getters
});

export default store;

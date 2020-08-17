import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user'
import app from './modules/app'
import limit from './modules/limit'
import getters from './getters'

Vue.use(Vuex);


const store = new Vuex.Store({
    modules: {
        user:user,
        app:app,
        limit:limit
    },
    getters
})

export default store
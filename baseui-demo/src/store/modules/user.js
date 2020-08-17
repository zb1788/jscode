const user = {
    state: {
      authToken: 'world', // token
      refreshToken: '' // 刷新token
    },

    mutations: {
      SET_AUTHTOKEN: (state, authToken) => {
        state.authToken = authToken;
      },
      SET_REFRESHTOKEN: (state, refreshToken) => {
        state.refreshToken = refreshToken;
      }
    },

    actions: {
    // 设置token
      setAuthToken ({ commit }, authToken) {
        commit('SET_AUTHTOKEN', authToken);
      },
      // 设置刷新token
      setRefreshToken ({ commit }, refreshToken) {
        commit('SET_REFRESHTOKEN', refreshToken);
      }
    }
  },
  usergetters = {
    authToken: state => state.user.authToken,
    refreshToken: state => state.user.refreshToken
  };

export default {
  'name': user,
  'getters': usergetters
};


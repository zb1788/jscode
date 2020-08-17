const app = {
    state: {
      debug: true, // 调试模式
      transferProtocol: '', // http / https 协议
      domainConfig: {}, // 各个系统域名配置
      teacherComputerMac: 'hello', // 当前MAC
      todo: [{id: 1, name: 'kobe'}, {id: 2, name: 'wade'}]
    },

    mutations: {
      SET_TRANSFERPROTOCOL: (state, transferProtocol) => {
        state.transferProtocol = transferProtocol;
      },
      SET_CONFIG: (state, config) => {
        state.domainConfig = config;
      },
      SET_COMPUTERMAC: (state, mac) => {
        state.teacherComputerMac = mac;
      },
      SET_TODO: (state, todo) => {
        state.todo = todo;
      }
    },

    actions: {
      setConfig ({ commit }, config) {
        commit('SET_CONFIG', config);
      },
      setTransferprotocol ({ commit }, transferProtocol) {
        commit('SET_TRANSFERPROTOCOL', transferProtocol);
      },
      setTeacherComputerMac ({ commit }, mac) {
        commit('SET_COMPUTERMAC', mac);
      },
      setTodo ({commit}, todo) {
        commit('SET_TODO', todo);
      }
    }
  },
  appgetters = {
    debug: state => state.app.debug,
    transferProtocol: state => state.app.transferProtocol,
    domainConfig: state => state.app.domainConfig,
    teacherComputerMac: state => state.app.teacherComputerMac,
    todofind: (state) => (id) => {
      return state.app.todo.find(item => item.id === id);
    }
  };

export default {
  'name': app,
  'getters': appgetters
};

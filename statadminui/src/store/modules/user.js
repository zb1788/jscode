import { userServices } from '../../api';
import { LocalObject } from '../../common/js/local';
import { getMenuList, getUserInfo } from '@/api/base';
// 用户信息本地存储
const userLocal = new LocalObject({
    getKey () {
      return `loginData`;
    }
  }),

  mutationTypes = {
  // 设置用户信息
    SET_USER: 'setUser',
    // 清空用户信息
    EMPTY_USER: 'emptyUser'
  },

  actionTypes = {
  // 登陆
    LOGIN: 'login',
    // 注销
    LOGOUT: 'logout',
    // 菜单
    MEUN: 'menu'
  },

  getters = {},

  data = userLocal.get(),

  state = {
    nickname: '',
    truename: '',
    token: '',
    refresh_token: '',
    username: '',
    areaId: '',
    areaFullName: '',
    provinceCode: '',
    cityCode: '',
    areaCode: '',
    ownMenus: [],
    fullname: '',
    usertype: '',
    phone: '',
    vfsDomain: '',
    ...data
  },

  // 同步操作
  mutations = {
  /**
   * 设置用户信息
   * @param state {object}
   * @param payload {object}
   */
    [mutationTypes.SET_USER] (state, payload = {}) {
      Object.keys(state).forEach(key => {
        payload[key] !== undefined && (state[key] = (payload || {})[key]);
      });
      userLocal.set(payload);
    },
    /**
   * 清空用户信息
   * @param state {object}
   */
    [mutationTypes.EMPTY_USER] (state) {
      Object.keys(state)
        .forEach(key => (state[key] = ''));
    }
  },

  // 异步操作
  actions = {
  /**
   * 登陆
   * @param commit
   * @param state
   * @param userName {string} 用户名
   * @param pwd {string} 密码
   * @return {Promise<{
   *  msg: 'string',
   *  code: 'string',
   *  data: 'object'
   * }>}
   */
    async [actionTypes.LOGIN] ({ commit, state }, { phone, password, xpos } = {}) {
      const res = await userServices.authLogin({ phone, password, xpos });
      if (res.access_token) {
        sessionStorage.setItem('token', res.access_token);
        sessionStorage.setItem('refresh_token', res.refresh_token);
        const [ { data } ] = await Promise.all([
          userServices.getTokenInfo()
        ]);
        let areaId = (data.area !== null && (data.area || {}).areaId) || '';
        const fullname = (data.area !== null && (data.area || {}).areaId) || '',
          provinceId = (data.area !== null && (data.area || {}).areaId.split('.'[0])) || '',

          state = {
            username: data.user.username,
            truename: data.user.truename,
            areaId: areaId === '0' ? null : areaId,
            areaFullName: areaId === '0' ? null : fullname,
            provinceId: areaId === '0' ? null : provinceId
          };

        commit(mutationTypes.SET_USER, state);
      }
      return { res };
    },
    // 菜单
    async [actionTypes.MEUN] ({ commit, state }, { systemId } = {}) {
      const res = await getMenuList({ systemId });
      if (res.subCode === '200') {
      // , { data: vfsDomain }
        const [ { data } ] = await Promise.all([
          getUserInfo()
        ]);
        console.log(data);
        var areaId = data.user.areaId;
        // const fullname = (data.area !== null && (data.area || {}).areaId) || '',
        //   provinceId = (data.area !== null && (data.area || {}).areaId.split('.'[0])) || '';
        let provinceCode = '', cityCode = '', areaCode = '';
        if (areaId.indexOf('.') !== -1) {
          let arr = areaId.split('.');
          provinceCode = arr[0];
          if (arr.length === 2) {
            cityCode = areaId;
          } else if (arr.length === 3) {
            cityCode = arr[0] + '.' + arr[1];
            areaCode = areaId;
          }
        }
        const fullname = '';
        console.log(areaId);
        commit(mutationTypes.SET_USER, {
          ...state,
          nickname: data.user.nickname,
          truename: data.user.truename,
          token: sessionStorage.getItem('token'),
          refresh_token: sessionStorage.getItem('refresh_token'),
          username: data.user.username,
          phone: data.user.phone,
          areaId: areaId === '0' ? '' : areaId,
          areaFullName: areaId === '0' ? '' : fullname,
          provinceCode: areaId === '0' ? '' : provinceCode,
          cityCode: cityCode,
          areaCode: areaCode,
          ownMenus: res.data,
          usertype: data.user.usertype
        });
      }
      return { res };
    },

    /**
   * 注销
   * @param commit
   * @param state
   * @return {Promise<boolean>}
   */
    async [actionTypes.LOGOUT] ({ commit, state }) {
      commit(mutationTypes.EMPTY_USER);
      return userLocal.delete();
    }
  };

export default {
  // 是否使用命名空间
  namespaced: true,
  mutationTypes,
  actionTypes,
  state,
  getters,
  mutations,
  actions
};

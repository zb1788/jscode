import axios from 'axios';
import { encode } from '../utils/RSA.js';
import qs from 'qs';
/**
 * 登录
 * username：用户名
 * password：密码
 * usertype：默认3（管理员）
 * @param type
 * @return {Promise<{
    'code': 'xxx',
    'msg': 'XXX',
    'sub_code': 'XXX',
    'sub_msg': 'XXX',
    'data': 'http://ssokw.czbanbantong.com/scanserver/scanlogin?key=f837301b90d04ebc847f7919d9af1273&scantype=4'
}>}
 */
export async function login ({ phone, password }) {
  const { data } = await axios.post(
    `/auth/login`,
    { phone, password, usertype: 5 },
    {
      contentType: 'application/x-www-form-urlencoded',
      transformRequest: [
        function (data) {
          let ret = '';
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          return ret;
        }
      ]
    }
  );

  return data;
}

export async function authLogin ({
  phone,
  password,
  xpos,
  loginUsertype = 'oss'
}) {
  const { data = {} } = await axios.post(
    `/sso/oauth/service/token?grant_type=password`,
    {
      username: encode(phone),
      inputname: encode(phone),
      password: encode(password),
      xpos,
      loginUsertype
    },
    {
      headers: {
        Authorization: `Basic U1NPOjQ2ZmQ1NGVhMjQwMWQyN2U5ZGE4YzcwZjc4YjcwZjI4`
      },
      contentType: 'application/x-www-form-urlencoded',
      transformRequest: [
        function (data) {
          let ret = '';
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          return ret;
        }
      ]
    }
  );

  return data;
}

/**
 * Token获取用户信息
 * @returns {Promise<T>}
 */
export async function getUserInfo () {
  const { data } = await axios.post(
    `/auth/getUserInfo`
  );

  return data;
}
// Token获取用户信息
export async function getTokenInfo () {
  const { data } = await axios.get(
    `/sso/api/getTokenInfo`
  );

  return data;
}
// 获取用户菜单接口
export async function getMenuGrant ({ systemId }) {
  const { data } = await axios.get(
    `/sso/api/getMenuGrant/${systemId}`
  );

  return data;
}

/**
 * 用户查询列表
 * @param areaId
 * @param pageNo
 * @param pageSize
 * @param userName
 * @param trueName
 * @returns {Promise<T>}
 */
export async function getOssAccountList ({
  areaId,
  pageNo = 1,
  pageSize = 10,
  userName,
  trueName,
  isNode
} = {}) {
  const { data } = await axios.get(
    `/uc/sys/user/getOssAccountList`,
    { params: { areaId, pageNo, pageSize, userName, trueName, isNode } }
  );

  return data;
}

/**
 * 用户添加
 * @param areaId
 * @param userName
 * @param trueName
 * @param password
 * @param phone
 * @param roleList
 * @returns {Promise<T>}
 */
export async function addOssAccount ({
  areaId,
  userName,
  trueName,
  password,
  phone,
  cpCode,
  roleList = []
}) {
  const { data } = await axios.post(
    `/uc/sys/user/addOssAccount`,
    { areaId, userName, trueName, password, phone, cpCode, roleList }
  );

  return data;
}

/**
 *  用户修改
 * @param areaId
 * @param userName
 * @param trueName
 * @param password
 * @param phone
 * @param roleList
 * @returns {Promise<T>}
 */
export async function updateOssAccount ({
  areaId,
  userName,
  trueName,
  password,
  phone,
  cpCode,
  roleList = []
}) {
  const { data } = await axios.post(
    `/uc/sys/user/updateOssAccount`,
    { areaId, userName, trueName, password, phone, cpCode, roleList }
  );

  return data;
}

/**
 * 用户明细
 * @param userName
 * @returns {Promise<T>}
 */
export async function getOssAccountDetail (userName) {
  const { data } = await axios.get(
    `/uc/sys/user/getOssAccountDetail`,
    { params: { userName } }
  );

  return data;
}

// 修改密码
export async function updateAccountPwd ({ userName, password }) {
  const { data } = await axios.post(`/uc/sys/user/updateAccountPwd`, {
    userName,
    password
  });

  return data;
}
// 用户个人密码修改（已登录
export async function changeSelfPassword ({ oldPassword, newPassword }) {
  const { data } = await axios.post(`/uc/sys/user/changeSelfPassword`, {
    oldPassword,
    newPassword
  });

  return data;
}
// 用户禁用
export async function forbiddenAccount ({ userName, status }) {
  const { data } = await axios.post(`/uc/sys/user/forbiddenAccount`, {
    userName,
    status
  });

  return data;
}
//  用户删除（OSS）
export async function delOssAccount ({ userName }) {
  const { data } = await axios.post(`/uc/sys/user/delOssAccount`, {
    userName
  });

  return data;
}
//  管理员获取用户登录链接
export async function getUserSystemLink ({ customer, xpos }) {
  const { data } = await axios.post(
    `/sso/api/sms/test`,
    qs.stringify({ customer, xpos })
  );

  return data;
}
//  批量重置密码
export async function updateResetAccountPwdBatch ({ userName }) {
  const { data } = await axios.post(`/uc/sys/user/updateResetUserPwdBatch`, {
    userName
  });

  return data;
}

/**
 * @description: 统计在线用户数量
 * @param {type}
 * @return:
 */
export async function getUtilUserOnlineStatistics () {
  const { data } = await axios.get(
    `/sch/userOnline/getUtilUserOnlineStatistics`
  );
  return data;
}

/**
 * 手机号获取用户信息
 */

export async function queryLoginUser ({ q }) {
  const { data } = await axios.get(
    `/sso/interface/queryLoginUser.jsp`,
    { params: { q } }
  );
  return data;
}
// eslint-disable-next-line
export async function refreshToken (refresh_token) {
  const res = await axios.post(
    `/sso/oauth/token?grant_type=refresh_token`,
    {
      grant_type: 'refresh_token',
      refresh_token
    },
    {
      headers: {
        Authorization: `Basic U1NPOjQ2ZmQ1NGVhMjQwMWQyN2U5ZGE4YzcwZjc4YjcwZjI4`
      },
      contentType: 'application/x-www-form-urlencoded',
      transformRequest: [
        function (data) {
          let ret = '';
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          return ret;
        }
      ]
    }
  );

  return res.data;
}

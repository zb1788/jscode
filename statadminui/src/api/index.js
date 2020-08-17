/*
 * @Author: your name
 * @Date: 2020-01-07 16:26:49
 * @LastEditTime: 2020-04-29 19:40:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings
 * @FilePath: \user-center\src\api\index.js
 */
import Axios from 'axios';

import * as userApi from './user';
import * as eduOrgApi from './eduOrg';
import * as supplierApi from './supplier';
import * as borderApi from './border';
import * as classApi from './classMgr';
import * as studentApi from './student';
import * as baseApi from './base';
import * as taskApi from './task';
import * as schoolApi from './school';
import * as suitesApi from './suites';
import * as teacherApi from './teacher';
import * as productApi from './product';
import * as schoolOrderApi from './schoolOrder';
import * as studentOrderApi from './studentOrder';
import * as logApi from './log';
import { getAccessToken } from '@/utils/token';
// 用户相关接口
export const userServices = userApi;
export const eduOrgServices = eduOrgApi;
export const supplierServices = supplierApi;
export const borderServices = borderApi;
export const classServices = classApi;
export const studentServices = studentApi;
export const baseServices = baseApi;
export const taskServices = taskApi;
export const schoolServices = schoolApi;
export const suitesServices = suitesApi;
export const productServices = productApi;
export const teacherServices = teacherApi;
export const schoolOrderServices = schoolOrderApi;
export const studentOrderServices = studentOrderApi;
export const logServices = logApi;

// 系统相关接口
export * from './systerm';

Axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

const requestCallback = {
    call: (config) => config,
    error: (error) => Promise.reject(error)
  },

  responseCallback = {
    call: (res) => res,
    error: (error) => Promise.reject(error.response)
  };

// 请求前拦截
Axios.interceptors.request.use(
  config => {
    // if (config.url.indexOf('/sso/oauth/token') > -1) {
    //   config.headers.Authorization = `Basic U1NPOjQ2ZmQ1NGVhMjQwMWQyN2U5ZGE4YzcwZjc4YjcwZjI4`
    // } else
    if (config.url.indexOf('ucsapi') > -1) {
      config.baseURL = config.baseURL.replace('stat/', '');
    } else {
      // const token = sessionStorage.getItem('token');
      // token && !config.headers.Authorization && (config.headers.Authorization = `Bearer ${token}`);
    }
    const token = getAccessToken().access_token;
    token && !config.headers.Authorization && (config.headers.Authorization = `Bearer ${token}`);
    // 时间戳
    config.url += (config.url.indexOf('?') !== -1 ? '&' : '?') + new URLSearchParams({
      __ts: Date.parse(new Date()) / 1000
    }).toString();

    return requestCallback.call(config);
  },
  error => {
    return requestCallback.error(error);
  }
);

// 请求后拦截
Axios.interceptors.response.use(
  (res = {}) => {
    return responseCallback.call(res);
  },
  (error) => {
    return responseCallback.error(error);
  }
);

export function useRequestCallback (call) {
  call && call(requestCallback);
}

export function useResponseCallback (call) {
  call && call(responseCallback);
}

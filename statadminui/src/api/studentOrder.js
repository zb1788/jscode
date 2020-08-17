/*
 * @Author: your name
 * @Date: 2019-11-25 11:26:13
 * @LastEditTime: 2020-04-14 19:54:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \user-center\src\api\studentOrder.js
 */
import * as axios from 'axios';
import qs from 'qs';

/**
 * @description: 获取用户订单详情列表
 * @param {type}
 * @return: []
 */
export async function getStudnetOrderDetailList ({
  type,
  search,
  areaId,
  suitesId,
  productId,
  orderStarttime,
  orderEndtime,
  tryType,
  suitesState,
  paymentMin,
  paymentMax,
  userType,
  orderTime,
  payModel,
  size,
  current
}) {
  const { data } = await axios.post(
    `/pbs/uprodo/s`,
    qs.stringify({ type, search, areaId, suitesId, productId, orderStarttime, orderEndtime, tryType, suitesState, paymentMin, paymentMax, userType, orderTime, payModel, size, current }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return data;
}

/**
 * @description: 新增用户订单
 * @param {type}
 * @return:
 */
export async function addStudentOrder ({
  areaId,
  suitesId,
  suitesName,
  areaFullname,
  schoolId,
  schoolName,
  classId,
  className,
  orderStarttime,
  orderEndtime,
  vCode,
  usernames,
  realnames
}) {
  const { data } = await axios.post(
    `/pbs/uprodo`,
    qs.stringify({ areaId, suitesId, suitesName, areaFullname, schoolId, schoolName, classId, className, orderStarttime, orderEndtime, vCode, usernames, realnames }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return data;
}

/**
 * @description: 获取用户订单状态列表
 * @param {type}
 * @return:[]
 */
export async function getStudentOrderStateList ({
  type,
  search,
  areaId,
  suitesId,
  productId,
  orderStarttime,
  orderEndtime,
  tryType,
  suitesState,
  orderTimeLast,
  size,
  current
}) {
  const { data } = await axios.post(
    `/pbs/uprodos/s`,
    qs.stringify({ type, search, areaId, suitesId, productId, orderStarttime, orderEndtime, tryType, suitesState, orderTimeLast, size, current }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return data;
}

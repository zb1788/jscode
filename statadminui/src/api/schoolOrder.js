/*
 * @Author: your name
 * @Date: 2019-11-22 16:34:44
 * @LastEditTime: 2020-02-25 17:57:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \user-center\src\api\schoolOrder.js
 */
import * as axios from 'axios';
import qs from 'qs';

/**
 * @description: 获取学校订单详情列表
 * @param {type}
 * @return:
 */
export async function getShoolOrderDetailList ({
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
  orderTime,
  payModel,
  size,
  current
}) {
  const { data } = await axios.post(
    `/pbs/scprodo/s`,
    qs.stringify({ type, search, areaId, suitesId, productId, orderStarttime, orderEndtime, tryType, suitesState, paymentMin, paymentMax, orderTime, payModel, size, current }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return data;
}

/**
 * @description: 添加学校订单
 * @param {type}
 * @return:
 */
export async function addShoolOrder ({
  areaId,
  orderId,
  suitesId,
  suitesName,
  areaFullname,
  schoolId,
  schoolName,
  broadbandAccessId,
  payment,
  classCountPay,
  tryTimeMode,
  orderStarttime,
  orderEndtime,
  tryType,
  tryDays,
  orderTime,
  payModel,
  vCode
}) {
  const { data } = await axios.post(
    `/pbs/scprodo`,
    qs.stringify({ areaId, orderId, suitesId, suitesName, areaFullname, schoolId, schoolName, payment, classCountPay, tryTimeMode, broadbandAccessId, orderStarttime, orderEndtime, tryType, orderTime, payModel, tryDays, vCode }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return data;
}

/**
 * @description: 获取学校订购状态列表
 * @param {type}
 * @return:
 */
export async function getShoolOrderStateList ({
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
  current,
  schoolId
}) {
  const { data } = await axios.post(
    `/pbs/sprodos/s`,
    qs.stringify({ type, search, areaId, suitesId, productId, orderStarttime, orderEndtime, tryType, suitesState, orderTimeLast, size, current, schoolId }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return data;
}

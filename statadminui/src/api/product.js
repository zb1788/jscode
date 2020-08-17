/*
 * @Author: your name
 * @Date: 2019-11-21 19:45:50
 * @LastEditTime: 2020-02-25 16:51:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \user-center\src\api\product.js
 */
import * as axios from 'axios';
import qs from 'qs';
/**
 * @description: 获取产品列表
 * @param {type}
 * @return:[]
 */
export async function getProdList (params) {
  const { data } = await axios.post(
    `/pbs/prod/l`,
    qs.stringify(params)
  );
  return data;
}
/**
 * @description: 获取产品详情列表
 * @param {type}
 * @return:[]
 */
export async function getProdDetailList ({
  type,
  search,
  addTime,
  productType,
  areaId,
  userType,
  current,
  size
}) {
  const { data } = await axios.post(
    `/pbs/prod/s`,
    qs.stringify({ type, search, addTime, productType, areaId, userType, current, size }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return data;
}

/**
 * @description: 获取产品模块
 * @param {type}
 * @return:[]
 */
export async function getProdMod ({
  productId
}) {
  const { data } = await axios.get(
    `/pbs/prod/${productId}/mod`
  );
  return data;
}

/**
 * @description: 获取平台列表
 * @param {type}
 * @return: []
 */
export async function getPlatformList () {
  const { data } = await axios.get(
    `/pbs/mod/base`
  );
  return data;
}

/**
 * @description: 根据平台获取功能模块
 * @param {type} moduleID: String
 * @return: []
 */
export async function getPlatformModuleList ({ moduleId }) {
  const { data } = await axios.get(
    `/pbs/mod/sub`,
    {
      params: {
        moduleId
      }
    }
  );
  return data;
}

/*
 * @Author: your name
 * @Date: 2019-11-19 18:18:12
 * @LastEditTime: 2020-04-29 16:47:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \user-center\src\api\suites.js
 */
import * as axios from 'axios';
import qs from 'qs';
// import { wipeEmpty } from '../utils/object'
/**
 * @description: 新增套餐
 * @param {type}
 * @return:
 */
export async function addProdsuite ({
  suitesId,
  suitesName,
  suitesDescp,
  productsInclude,
  suitesInclude,
  factory,
  suitesCodeTelecom,
  customType,
  userTypes,
  payModel,
  areaId,
  suitesType,
  baseSuites,
  baseSuites2,
  baseSuites3,
  payUrl,
  tipDays,
  delayDays,
  tryType,
  tryDays,
  orderTip,
  cancleTip,
  enableDate,
  disableDate,
  vCode,
  priceModes,
  isValid
} = {}) {
  let priceModesStr = JSON.stringify(priceModes),
    formattingProducts = [],
    formattingSuites = [];
  productsInclude && (productsInclude.forEach((product) => {
    formattingProducts.push(product.value);
  }));
  suitesInclude && (suitesInclude.forEach((suit) => {
    formattingSuites.push(suit.value);
  }));
  productsInclude = formattingProducts.join(',');
  suitesInclude = formattingSuites.join(',');
  const { data } = await axios.post(
    `/pbs/prodsuite`,
    qs.stringify({ suitesId, suitesName, suitesDescp, productsInclude, suitesInclude, factory, priceModesStr, suitesCodeTelecom, customType, userTypes, payModel, areaId, suitesType, baseSuites, baseSuites2, baseSuites3, payUrl, tipDays, delayDays, tryType, tryDays, orderTip, cancleTip, enableDate, disableDate, vCode, isValid }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );

  return data;
}

/**
 * @description: 更新套餐
 * @param {type}
 * @return:
 */
export async function updateProdsuite ({
  suitesId,
  suitesName,
  suitesDescp,
  productsInclude,
  suitesInclude,
  factory,
  suitesCodeTelecom,
  customType,
  userTypes,
  payModel,
  areaId,
  suitesType,
  baseSuites,
  baseSuites2,
  baseSuites3,
  payUrl,
  tipDays,
  delayDays,
  tryType,
  tryDays,
  orderTip,
  cancleTip,
  enableDate,
  disableDate,
  vCode,
  priceModes,
  isValid
} = {}) {
  let priceModesStr = JSON.stringify(priceModes),
    formattingProducts = [],
    formattingSuites = [];
  productsInclude && (productsInclude.forEach((product) => {
    formattingProducts.push(product.value);
  }));
  suitesInclude && (suitesInclude.forEach((suit) => {
    formattingSuites.push(suit.value);
  }));
  productsInclude = formattingProducts.join(',');
  suitesInclude = formattingSuites.join(',');
  const { data } = await axios.put(
    `/pbs/prodsuite`,
    qs.stringify({ suitesId, suitesName, suitesDescp, productsInclude, suitesInclude, factory, priceModesStr, suitesCodeTelecom, customType, userTypes, payModel, areaId, suitesType, baseSuites, baseSuites2, baseSuites3, payUrl, tipDays, delayDays, tryType, tryDays, orderTip, cancleTip, enableDate, disableDate, vCode, isValid }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return data;
}

/**
 * @description: 获取套餐详情列表
 * @param {type}
 * @return:
 */
export async function getProdsuiteDetailList ({
  type,
  search,
  areaId,
  userType,
  customType,
  suitesId,
  productId,
  suitesType,
  enableDate,
  disableDate,
  payModel,
  baseSuites,
  isValid,
  publishState,
  factory,
  addTime,
  size,
  current
}) {
  const { data } = await axios.post(
    `/pbs/prodsuite/s`,
    qs.stringify({ type, search, areaId, userType, customType, suitesId, productId, suitesType, enableDate, disableDate, payModel, baseSuites, isValid, publishState, factory, addTime, size, current }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return data;
}

/**
 * @description: 删除套餐
 * @param {type}
 * @return:
 */
export async function delProdsuite ({
  vCode,
  suitesId
}) {
  const { data } = await axios.delete(
    `/pbs/prodsuite`,
    {
      data: qs.stringify({ vCode, suitesId }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );
  return data;
}

/**
 * @description: 发布套餐
 * @param {type}
 * @return:
 */
export async function pubProdsuite ({
  vCode,
  suitesId
}) {
  const { data } = await axios.put(
    `/pbs/prodsuite/p`,
    qs.stringify({ vCode, suitesId }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return data;
}

/**
 * @description: 禁用套餐
 * @param {type}
 * @return:
 */
export async function forbiddenProdsuite ({
  vCode,
  suitesId
}) {
  const { data } = await axios.put(
    `/pbs/prodsuite/fb`,
    qs.stringify({ vCode, suitesId }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return data;
}

/**
 * @description: 获取套餐列表(套餐名，id)
 * @param {type} 1: 基础套餐 其他：其他套餐
 * @return:
 */
export async function getProdsuiteList ({
  type,
  areaId
}) {
  const { data } = await axios.get(
    `/pbs/prodsuite/base`,
    {
      params: {
        type,
        areaId
      }
    }
  );
  return data;
}
/**
 * @description: 根据套餐ID获取详情
 * @param {type}
 * @return:
 */
export async function getProdsuiteDetail ({
  suitesId
}) {
  const { data } = await axios.get(
    `/pbs/prodsuite/${suitesId}`
  );
  return data;
}

/**
 * @description: 获取全部套餐
 * @param {type}
 * @return:
 */
export async function getProdsuiteAllList (params) {
  const { data } = await axios.get(
    `/pbs/prodsuite/a`,
    {
      params: params
    }
  );
  return data;
}

/**
 * @description: 校验套餐ID，名称是否存在
 * @param {type}
 * @return: []
 */
export async function getProdExists ({ suitesId = '', suitesName = '', update }) {
  const { data } = await axios.get(
    `/pbs/prodsuite/exists`,
    {
      params: {
        suitesId,
        suitesName,
        update
      }
    }
  );
  return data;
}

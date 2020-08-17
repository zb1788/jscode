/*
 * @Author: your name
 * @Date: 2020-04-29 10:29:44
 * @LastEditTime: 2020-04-29 16:47:28
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \base\src\api\systerm.js
 */
import axios from 'axios';

/**
 * 菜单列表
 * @returns {Promise<T>}
 */
export async function getMenuList ({ systemId, parentId, isUseable } = {}) {
  const { data } = await axios.get(
    `/uc/sys/menu/getMenuList`,
    { params: { systemId, parentId, isUseable } }
  );

  return data;
}

/**
 * 添加菜单
 * @param moduleName
 * @param moduleUrl
 * @param parentId
 * @param systermId
 * @returns {Promise<T>}
 */
export async function addMenu ({
  moduleName,
  moduleUrl,
  parentId = '0',
  systemId = 'TMS'
}) {
  const { data } = await axios.post(
    `/uc/sys/menu/addMenu`,
    { moduleName, moduleUrl, parentId, systemId }
  );

  return data;
}

/**
 * 修改菜单
 * @param moduleId
 * @param moduleName
 * @param moduleUrl
 * @returns {Promise<T>}
 */
export async function updateMenu ({
  moduleId,
  moduleName,
  moduleUrl
}) {
  const { data } = await axios.post(
    `/uc/sys/menu/updateMenu`,
    { moduleId, moduleName, moduleUrl }
  );

  return data;
}

export async function updateRoleStatus ({ moduleId, isUseable } = {}) {
  const { data } = await axios.post(
    `/uc/sys/menu/delMenu`,
    { moduleId, isUseable }
  );

  return data;
}

/**
 * 验证码校验
 * @param smsCode
 * @param phone
 * @returns {Promise<void>}
 */
export async function smsCodeCheck ({
  smsCode,
  phone
}) {
  const { data } = await axios.post(
    `/tms/sms/smsCodeCheck`,
    {
      smsCode,
      phone
    }
  );

  return data;
}

/**
 * 1.44 重置缓存
 * @returns {Promise<T>}
 */
export async function resetRedisCache () {
  const { data } = await axios.get(
    `/cfg/config/resetRedisCache`
  );

  return data;
}

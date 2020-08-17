import axios from 'axios';
import qs from 'qs';
/**
 * 基础参数列表
 * @param pageNo
 * @param pageSize
 * @param sortCode
 * @param code
 * @param name
 * @returns {Promise<T>}
 */
export async function getConfigList ({
  pageNo = 1,
  pageSize = 10,
  sortCode = '',
  code = '',
  name = '',
  searchType
}) {
  const { data } = await axios.get(
    `/cfg/config/getConfigList`,
    {
      params: { pageNo, pageSize, sortCode, code, name, searchType }
    }
  );

  return data;
}

/**
 * 根据code获取数据字典
 * @param sortCode
 * @returns {Promise<T>}
 */
export async function getConfigListByCode (sortCode) {
  return getConfigList({ sortCode, pageNo: 1, pageSize: 100 });
}

/**
 * 基础参数添加
 * @param paramCode 参数编码
 * @param sortCode 类别编码
 * @param paramName 参数名称
 * @param showOrder 序列
 * @param remark 备注
 * @returns {Promise<{}>}
 */
export async function addConfig ({
  paramCode = '',
  sortCode = '',
  paramName = '',
  showOrder = '',
  remark = ''
}) {
  const { data } = await axios.post(
    `/cfg/config/addConfig`,
    {
      paramCode,
      paramName,
      sortCode,
      showOrder: Number(showOrder),
      remark
    }
  );

  return data;
}

/**
 * 修改基础参数
 * @param paramCode
 * @param sortCode
 * @param paramName
 * @param delFlag
 * @param showOrder
 * @param remark
 * @returns {Promise<void>}
 */
export async function updateConfig ({
  paramCode,
  sortCode,
  paramName,
  delFlag,
  showOrder,
  remark,
  id
}) {
  const { data } = await axios.post(
    `/cfg/config/updateConfig`,
    {
      paramCode,
      sortCode,
      paramName,
      delFlag,
      showOrder,
      remark,
      id
    }
  );

  return data;
}

/**
 * 删除数据字典
 * @param id
 * @returns {Promise<*>}
 */
export async function delConfig (...ids) {
  const { data } = await axios.post(
    `/cfg/config/delConfig`,
    ids
  );

  return data;
}

/**
 * 基础参数类别列表
 * @param pageNo
 * @param pageSize
 * @param code
 * @param name
 * @returns {Promise<T>}
 */
export async function getConfigTypeList ({
  pageNo,
  pageSize,
  code,
  name
}) {
  const { data } = await axios.get(
    `/cfg/config/getConfigTypeList`,
    {
      params: {
        pageSize,
        pageNo,
        code,
        name
      }
    }
  );

  return data;
}

/**
 * 基础参数类别修改
 * @param sortCode
 * @param sortName
 * @returns {Promise<T>}
 */
export async function updateConfigType ({
  sortCode,
  sortName
}) {
  const { data } = await axios.post(
    `/cfg/config/updateConfigType`,
    { sortCode, sortName }
  );

  return data;
}

/**
 * 基础参数类别添加
 * @param sortCode
 * @param sortName
 * @returns {Promise<T>}
 */
export async function addConfigType ({
  sortCode,
  sortName
}) {
  const { data } = await axios.post(
    `/cfg/config/addConfigType`,
    { sortCode, sortName }
  );

  return data;
}
// 查询密码强度等级
export async function PwdPowerLevel () {
  const { data } = await axios.get(
    `/cfg/plat/cfgConfigPlat/PwdPowerLevel`
  );

  return data;
}
// 查询简单密码强制修改
export async function PwdSimpleForceModify () {
  const { data } = await axios.get(
    `/cfg/plat/cfgConfigPlat/PwdSimpleForceModify`
  );

  return data;
}
// 修改 密码强度等级/简单密码强制修改
export async function PwdPowerLevelOrPwdSimpleForceModify ({
  pwdSimpleForceModifyValue, PwdPowerLevelValue
}) {
  const { data } = await axios.put(
    `/cfg/plat/cfgConfigPlat/PwdPowerLevelOrPwdSimpleForceModify`,
    qs.stringify({ pwdSimpleForceModifyValue, PwdPowerLevelValue }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return data;
}

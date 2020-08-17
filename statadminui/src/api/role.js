import * as axios from 'axios';

/**
 * 角色列表
 * @param roleName
 * @param pageNo
 * @param pageSize
 * @param orgId
 * @returns {Promise<*>}
 */
export async function getRoleList ({
  roleName,
  pageNo = 1,
  pageSize = 100,
  orgId
} = {}) {
  const { data } = await axios.get(
    `/uc/sys/role/getRoleList`,
    { params: { roleName, pageNo, pageSize, orgId } }
  );

  return data;
}

/**
 * 添加角色
 * @param roleName {string}
 * @param menuIdList {Array<{ moduleId: string }>}
 * @returns {Promise<*>}
 */
export async function addRole ({
  roleName,
  menuIdList = []
}) {
  const { data } = await axios.post(
    `/uc/sys/role/addRole`,
    { roleName, menuIdList }
  );

  return data;
}

/**
 *  角色信息修改
 * @param roleId
 * @param roleName
 * @param menuIdList
 * @returns {Promise<*>}
 */
export async function updateRole ({
  roleId,
  roleName,
  menuIdList
}) {
  const { data } = await axios.post(
    `/uc/sys/role/updateRole`,
    { roleId, roleName, menuIdList }
  );

  return data;
}

/**
 * 角色状态修改
 * @returns {Promise<*>}
 */
export async function updateRoleStatus ({ roleId, isUseable }) {
  const { data } = await axios.post(
    `/uc/sys/role/updateRoleStatus`,
    { roleId, isUseable }
  );

  return data;
}

/**
 * 角色明细
 * @param roleId
 * @returns {Promise<*>}
 */
export async function getRoleDetail (roleId) {
  const { data } = await axios.get(
    `/uc/sys/role/getRoleDetail`,
    {
      params: { roleId }
    }
  );

  return data;
}

/**
 * 删除角色
 * @param roleId
 * @returns {Promise<*>}
 */
export async function delRole (roleId) {
  const { data } = await axios.post(
    `/uc/sys/role/delRole`,
    { roleId }
  );

  return data;
}

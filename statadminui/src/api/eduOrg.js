import axios from 'axios';

/**
 * 教育机构基本信息列表
 * @param pageNo, pageSize, areaId, orgName, orgCode, orgType
 * @returns {Promise<T>}
 */
export async function getEduOrgList (pageNo, pageSize, areaId, orgName, orgCode, orgType) {
  const { data } = await axios.get(
    `/cfg/org/getEduOrgList`,
    { params: { pageNo, pageSize, areaId, orgName, orgCode, orgType } }
  );

  return data;
}
/**
 * 教育机构基本信息列表   (学校添加、修改专用)
 * @param pageNo, pageSize, areaId, orgName, orgCode, orgType
 * @returns {Promise<T>}
 */
export async function getAddSchoolOrgList (pageNo, pageSize, areaId, orgName, orgCode, orgType) {
  const { data } = await axios.get(
    `/cfg/org/getAddSchoolOrgList`,
    { params: { pageNo, pageSize, areaId, orgName, orgCode, orgType } }
  );

  return data;
}
/**
 * 教育机构添加
 * @param pageNo, pageSize, areaId, orgName, orgCode, orgType
 * @returns {Promise<T>}
 */
export async function addEduOrg (areaId, orgName, orgCode, orgManager, orgPhone, orgEmail, orgAddress, isResourcemanager, fid, orgLevel) {
  const { data } = await axios.post(
    `/cfg/org/addEduOrg`,
    { areaId, orgName, orgCode, orgManager, orgPhone, orgEmail, orgAddress, isResourcemanager, fid, orgLevel }
  );

  return data;
}
// 教育机构修改
export async function updateEduOrg (areaId, orgName, orgCode, orgManager, orgPhone, orgEmail, orgAddress, isResourcemanager, id, fid, orgLevel) {
  const { data } = await axios.post(
    `/cfg/org/updateEduOrg`,
    { areaId, orgName, orgCode, orgManager, orgPhone, orgEmail, orgAddress, isResourcemanager, id, fid, orgLevel }
  );

  return data;
}
// 教育机构明细
export async function getEduOrg ({ id }) {
  const { data } = await axios.get(
    `/cfg/org/getEduOrg`,
    { params: { id } }
  );

  return data;
}
// 教育机构资源启用 禁用
export async function enableOrgResource ({ id, resourceState }) {
  const { data } = await axios.post(
    `/cfg/org/enableOrgResource`,
    { id, resourceState }
  );

  return data;
}
// 教育机构学校列表
export async function getEduOrgSchoolList (pageNo, pageSize, id, orgType) {
  const { data } = await axios.get(
    `/cfg/org/getEduOrgSchoolList`,
    { params: { pageNo, pageSize, id, orgType } }
  );

  return data;
}
// 教育机构用户添加
export async function addEduOrgAccount ({ areaId, orgId, username, truename, pwd, phone, roleList }) {
  const { data } = await axios.post(
    `/uc/sys/org/addEduOrgAccount`,
    { areaId, orgId, username, truename, pwd, phone, roleList }
  );

  return data;
}
// 教育机构用户管理学校列表
export async function getEduOrgAccountSchoolList (pageNo, pageSize, orgId, username) {
  const { data } = await axios.get(
    `/uc/sys/org/getEduOrgAccountSchoolList`,
    { params: { pageNo, pageSize, orgId, username } }
  );

  return data;
}
// 教育机构用户修改
export async function updateEduOrgAccount ({ areaId, orgId, username, truename, phone, roleList }) {
  const { data } = await axios.post(
    `/uc/sys/org/updateEduOrgAccount`,
    { areaId, orgId, username, truename, phone, roleList }
  );

  return data;
}
// 教育机构下账户明细
export async function getEduOrgAccountDetail ({ username }) {
  const { data } = await axios.get(
    `/uc/sys/org/getEduOrgAccountDetail`,
    { params: { username } }
  );

  return data;
}
function download (blob, fieldname) {
  if (window.navigator.msSaveBlob) {
    try {
      window.navigator.msSaveBlob(blob, fieldname);
    } catch (e) {
      console.log(e);
    }
    return;
  }
  const a = document.createElement('a');
  a.download = fieldname;
  a.href = window.URL.createObjectURL(blob);

  document.body.appendChild(a);
  a.click();
  a.remove();
}
export async function exportEduOrgList (params = {}) {
  const res = await axios.get(
      `cfg/org/exportEduOrgList`,
      {
        params,
        headers: { 'filename': 'utf-8' },
        responseType: 'arraybuffer'
      }
    ),
    contentDisposition = decodeURIComponent(res.headers['content-disposition'])
      .split(';')
      .reduce((result, str) => {
        const [key, val] = str.split('=');
        result[key] = val;

        return result;
      }, {});

  let blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  download(
    blob,
    contentDisposition.filename
  );
}
// 导出学校
export async function exportEduOrgSchoolList (params = {}) {
  const res = await axios.get(
      `cfg/org/exportEduOrgSchoolList`,
      {
        params,
        headers: { 'filename': 'utf-8' },
        responseType: 'arraybuffer'
      }
    ),

    contentDisposition = decodeURIComponent(res.headers['content-disposition'])
      .split(';')
      .reduce((result, str) => {
        const [key, val] = str.split('=');
        result[key] = val;

        return result;
      }, {});

  let blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  download(
    blob,
    contentDisposition.filename
  );
}
//  教育机构删除
export async function delEduOrg ({ id }) {
  const { data } = await axios.post(
    `/cfg/org/delEduOrg`,
    { id }
  );

  return data;
}
//  教育机构账户下管理学校导出
export async function exportEduOrgAccountSchoolList (username) {
  const { data } = await axios.get(
    `/uc/sys/org/exportEduOrgAccountSchoolList`,
    { params: { username } }
  );

  return data;
}
//  教育机构用户列表
export async function getEduOrgAccountList ({ pageNo, pageSize, areaId, username, truename }) {
  const { data } = await axios.get(
    `/uc/sys/org/getEduOrgAccountList`,
    { params: { pageNo, pageSize, areaId, username, truename } }
  );

  return data;
}
//  教育机构用户删除
export async function delEduOrgAccount ({ username }) {
  const { data } = await axios.post(
    `/uc/sys/org/delEduOrgAccount`,
    { username }
  );

  return data;
}

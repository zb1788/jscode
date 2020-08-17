/*
 * @Author: your name
 * @Date: 2020-04-29 10:29:44
 * @LastEditTime: 2020-04-29 16:47:01
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \base\src\api\supplier.js
 */
import axios from 'axios';

// 供应商列表
export async function getCpList (pageNo, pageSize, name, type, competenceType) {
  const { data } = await axios.get(
    `/cfg/cp/getCpList`,
    { params: { pageNo, pageSize, name, type, competenceType } }
  );
  return data;
}

//   供应商授权学校列表
export async function getCpSchoolList (pageNo, pageSize, roleType, areaId, cpCode, schoolName) {
  const { data } = await axios.get(
    `/cfg/cp/getCpSchoolList`,
    { params: { pageNo, pageSize, roleType, areaId, cpCode, schoolName } }
  );

  return data;
}

//   供应商授权学校删除
export async function delCpSchool ({ idList }) {
  const { data } = await axios.post(
    `/cfg/cp/delCpSchool`,
    { idList }
  );

  return data;
}
//    供应商授权学校添加
export async function addCpSchool ({ cpCode, schoolList }) {
  const { data } = await axios.post(
    `/cfg/cp/addCpSchool`,
    { cpCode, schoolList }
  );

  return data;
}
//    可添加授权学校列表
export async function getNoCpSchoolList ({ pageNo, pageSize, areaId, schoolName, cpCode }) {
  const { data } = await axios.get(
    `/cfg/cp/getNoCpSchoolList`,
    { params: { pageNo, pageSize, areaId, schoolName, cpCode } }
  );

  return data;
}

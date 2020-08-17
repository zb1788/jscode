import * as axios from 'axios';
import qs from 'qs';

/**
 * 获取省份
 * @param {*} param
 */
export async function getProvinceList ({fid}) {
  const { data } = await axios.get(
    `/statdata/user/province/getProvinceList`,
    { params: { fid } }
  );

  return data;
}

/**
 * 获取城市
 * @param {*} param
 */
export async function getCityListByProvinceCode ({fid}) {
  const { data } = await axios.get(
    `/statdata/user/city/getCityList/${fid}`,
    { params: { } }
  );
  return data;
}

export async function getCityById ({fid}) {
  const { data } = await axios.get(
    `/statdata/user/city/getCityById/${fid}`,
    { params: { } }
  );
  return data;
}

/**
 * 获取区域
 * @param {*} param
 */
export async function getAreaListByCity ({fid}) {
  const { data } = await axios.get(
    `/statdata/user/area/getAreaList/${fid}`,
    { params: { } }
  );
  return data;
}

export async function getAreaById ({fid}) {
  const { data } = await axios.get(
    `/statdata/user/area/getAreaById/${fid}`,
    { params: { } }
  );
  return data;
}

/**
 * 获取用户激活数据
 * @param {*} param
 */
export async function getUserActiveList ({startDate, endDate, province, city, area, activeType, isDel, schoolType, schoolId, pageNo, pageSize}) {
  let schoolTypes = schoolType.join(',');
  const { data } = await axios.post(
    `/statdata/user/active/list`,
    qs.stringify({ startDate, endDate, province, city, area, activeType, isDel, schoolTypes, schoolId, pageNo, pageSize })
  );
  return data;
}

export async function getSchoolByName ({ schoolName }) {
  const { data } = await axios.get(
    `/statdata/user/school/schoolList/${schoolName}`,
    { params: { } }
  );
  return data;
}

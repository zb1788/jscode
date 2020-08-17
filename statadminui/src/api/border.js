/*
 * @Author: your name
 * @Date: 2020-04-29 10:29:44
 * @LastEditTime: 2020-04-29 16:44:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\src\api\border.js
 */
import axios from 'axios';
// eslint-disable-next-line
const base_URL = 'http://192.168.1.202:8780/';
// 根据地区和学校名称搜索学校班牌
// eslint-disable-next-line
export async function getBorderList ({ area_id, school_name, offset, limit }) {
  const { data } = await axios.get(
    // eslint-disable-next-line
    `${base_URL}api/v1/bancard/serial/search_by_area_name`,
    { params: { area_id, school_name, offset, limit } }
  );

  return data;
}
// 给学校班牌修改密码
// eslint-disable-next-line
export async function changePsd ({ school_id, new_password }) {
  const { data } = await axios.post(
    // eslint-disable-next-line
    `${base_URL}api/v1/bancard/school/reset_password`,
    { school_id, new_password }
  );

  return data;
}
// 获取学校设备列表
// eslint-disable-next-line
export async function getSchoolBorderList ({ school_id, offset, limit, area, status }) {
  const { data } = await axios.post(
    // eslint-disable-next-line
    `${base_URL}api/v1/bancard/serial/search/${school_id}?offset=${offset}&limit=${limit}`,
    { area, status }
  );

  return data;
}
// 一键升级
// eslint-disable-next-line
export async function oneClickUpgrade ({ school_id }) {
  const { data } = await axios.post(
    // eslint-disable-next-line
    `${base_URL}api/v1/bancard/serial/one-click-upgrade/${school_id}`
  );

  return data;
}
// 单个班牌升级
// eslint-disable-next-line
export async function oneBoardUpgrade ({ school_id, serial }) {
  const { data } = await axios.post(
    // eslint-disable-next-line
    `${base_URL}api/v1/bancard/serial/upgrade/${school_id}`,
    { serial }
  );

  return data;
}
// 给学校添加班牌
// eslint-disable-next-line
export async function addboardSchool ({ school_id, total, school_name }) {
  const { data } = await axios.post(
    // eslint-disable-next-line
    `${base_URL}api/v1/bancard/num/${school_id}`,
    { total, school_name }
  );

  return data;
}

import * as axios from 'axios';
import qs from 'qs';

/**
 * 添加topic
 * @param {*} params
 */
export async function addTopicGroup (params) {
  const { data } = await axios.post(
    `/statmanage/kfk/topic/add`,
    params
  );

  return data;
}

/**
 * 分页获取topic列表
 * @param {*} param
 */
export async function getListByPage ({topic, pageNo, pageSize}) {
  const { data } = await axios.get(
    `/statmanage/kfk/topic/listByPage`,
    { params: { topic, pageNo, pageSize } }
  );

  return data;
}

/**
 * 根据id删除topic
 * @param {*} topicCode
 */
export async function delTopicById (topicCode) {
  const { data } = await axios.get(
    `/statmanage/kfk/topic/delTopicById/${topicCode}`,
    { params: { } }
  );

  return data;
}

/**
 * 根据ids批量删除topic
 * @param {*} topicCodes
 */
export async function delTopicsByIdList (topicCodes) {
  const { data } = await axios.post(
    `/statmanage/kfk/topic/delTopicsByIdList`,
    qs.stringify({ topicCodes })
  );

  return data;
}

/**
 * 分页获取table
 * @param {*} param
 */
export async function getTableList ({tabName, pageNo, pageSize}) {
  const { data } = await axios.get(
    `/statmanage/kfk/table/listByPage`,
    { params: { tabName, pageNo, pageSize } }
  );

  return data;
}

/**
 * 获取当前表的写入规则
 * @param {*} param
 */
export async function getTableRuleById (tabId) {
  const { data } = await axios.get(
    `/statmanage/kfk/table/getTableRuleById/${tabId}`,
    { params: { } }
  );

  return data;
}

/**
 * 添加表
 * @param {*} params
 */
export async function addTable (params) {
  const { data } = await axios.post(
    `/statmanage/kfk/table/add`,
    params
  );

  return data;
}

/**
 * 根据id删除table
 * @param {*} tabCode
 */
export async function delTabById (tabCode) {
  const { data } = await axios.get(
    `/statmanage/kfk/table/delTabById/${tabCode}`,
    { params: { } }
  );

  return data;
}

/**
 * 根据id批量删除
 * @param {*} topicCodes
 */
export async function delTabsByIdList (tabCodes) {
  const { data } = await axios.post(
    `/statmanage/kfk/table/delTabsByIdList`,
    qs.stringify({ tabCodes })
  );

  return data;
}

/**
 * 根据类型查询字段表
 * @param {*} type R：行，C：列
 */
export async function getRuleDictionaryByType (type) {
  const { data } = await axios.get(
    `/statmanage/kfk/rule/list/${type}`,
    { params: { } }
  );

  return data;
}

/**
 * 根据tabId查找当前规则
 * @param {*} tabId
 */
export async function getRowRuleByTabId (tabId) {
  const { data } = await axios.get(
    `/statmanage/kfk/rowRule/list/${tabId}`,
    {params: {}}
  );
  return data;
}

/**
 * 分页获取Column
 * @param {*} param
 */
export async function getColumnList ({colName, pageNo, pageSize, tabId}) {
  const { data } = await axios.get(
    `/statmanage/kfk/column/listByPage`,
    { params: { colName, pageNo, pageSize, tabId } }
  );

  return data;
}

/**
 * 获取当前字段的写入规则
 * @param {*} param
 */
export async function getColumnRuleById (colId) {
  const { data } = await axios.get(
    `/statmanage/kfk/column/getColumnRuleById/${colId}`,
    { params: { } }
  );

  return data;
}

/**
 * 添加column
 * @param {*} params
 */
export async function addColumn (params) {
  const { data } = await axios.post(
    `/statmanage/kfk/column/add`,
    params
  );

  return data;
}

/**
 * 根据id删除column
 * @param {*} tabCode
 */
export async function delColById (colCode) {
  const { data } = await axios.get(
    `/statmanage/kfk/column/delColumnById/${colCode}`,
    { params: { } }
  );

  return data;
}

/**
 * 根据id批量删除
 * @param {*} colCodes
 */
export async function delColsByIdList (colCodes) {
  const { data } = await axios.post(
    `/statmanage/kfk/column/delColsByIdList`,
    qs.stringify({ colCodes })
  );

  return data;
}

/**
 * 根据colId查找当前规则
 * @param {*} colId
 */
export async function getColRuleByColId (colId) {
  const { data } = await axios.get(
    `/statmanage/kfk/colRule/list/${colId}`,
    {params: {}}
  );
  return data;
}

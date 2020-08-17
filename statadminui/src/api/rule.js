import * as axios from 'axios';
import qs from 'qs';

export async function addRuleGroup (params) {
  const { data } = await axios.post(
    `/statmanage/rule/tsRuleGroup/addGroup`,
    params
  );

  return data;
}

export async function getRuleList ({groupName, pageNo, pageSize}) {
  const { data } = await axios.get(
    `/statmanage/rule/tsRuleGroup/list`,
    { params: { groupName, pageNo, pageSize } }
  );

  return data;
}

export async function delRuleById (groupCode) {
  const { data } = await axios.get(
    `/statmanage/rule/tsRuleGroup/delRuleById/${groupCode}`,
    { params: { } }
  );

  return data;
}

export async function delRuleByIdList (groupCodes) {
  const { data } = await axios.post(
    `/statmanage/rule/tsRuleGroup/delRuleByIdList`,
    qs.stringify({ groupCodes })
  );

  return data;
}

export async function getRuleInfoList ({ruleName, pageNo, pageSize}) {
  const { data } = await axios.get(
    `/statmanage/rule/tsTaskRule/getRuleList`,
    { params: { ruleName, pageNo, pageSize } }
  );

  return data;
}

export async function getRuleInfoListNoPage (groupCode) {
  const { data } = await axios.get(
    `/statmanage/rule/tsTaskRule/getRuleListNoPage/${groupCode}`,
    { params: { } }
  );

  return data;
}

export async function changeRuleState (type, rueCode) {
  const { data } = await axios.get(
    `/statmanage/rule/tsTaskRule/changeRuleState/${rueCode}/${type}`,
    { params: { } }
  );

  return data;
}

export async function addRule (params) {
  const { data } = await axios.post(
    `/statmanage/rule/tsTaskRule/addRule`,
    params
  );

  return data;
}

export async function deleteRuleById (ruleCode) {
  const { data } = await axios.get(
    `/statmanage/rule/tsTaskRule/deleteRuleById/${ruleCode}`,
    { params: { } }
  );

  return data;
}

export async function delRulesByIdList (ruleCodes) {
  const { data } = await axios.post(
    `/statmanage/rule/tsTaskRule/delRulesByIdList`,
    qs.stringify({ ruleCodes })
  );

  return data;
}

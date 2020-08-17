import axios from 'axios';
import qs from 'qs';

export async function getMenuList () {
  const { data } = await axios.get(
    `/ucsapi/sso/api/getMenuGrant/NSDC`,
    { params: { } }
  );

  return data;
}

export async function getUserInfo () {
  const { data } = await axios.get(
    `/ucsapi/sso/api/v2/getTokenInfo`,
    { params: { } }
  );

  return data;
}

/**
 * 行政区明细
 * @param areaId
 * @returns {Promise<T>}
 */
export async function getAreaDetail (areaId) {
  const { data } = await axios.get(
    `/cfg/area/getAreaDetail`,
    { params: { areaId } }
  );

  return data;
}

/**
 * 行政区列表
 * @param parentCode
 * @param pageNo
 * @param pageSize
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getAreaList (
  {
    fid,
    pageNo,
    pageSize,
    flag
  }
) {
  const { data } = await axios.get(
    `/statdata/user/province/getProvinceList`,
    { params: { fid, pageNo, pageSize, flag } }
  );

  return data;
}
// 行政区添加
export async function addArea (
  {
    fid,
    areaId,
    fullName,
    areaName,
    areaCode,
    parentLevel,
    schOpStatus,
    // eslint-disable-next-line
    configure_code
  }
) {
  const { data } = await axios.post(
    `/cfg/area/addArea`,
    { fid, areaId, fullName, areaName, areaCode, schOpStatus, parentLevel, configure_code }
  );

  return data;
}

/**
 * 1.20 行政区域教材模板列表
 * @param areaId
 * @param pageSize
 * @param pageNo
 * @returns {Promise<T>}
 */
export async function getEduVersionTemplateList ({
  areaId,
  templateName,
  pageSize = 10,
  pageNo = 1
}) {
  const { data } = await axios.get(
    `/cfg/area/getEduVersionTemplateList`,
    {
      params: { areaId, templateName, pageSize, pageNo }
    }
  );

  return data;
}

/**
 * 1.34 教学授课年级列表
 * @returns {Promise<T>}
 */
export async function getAllGradeList () {
  const { data } = await axios.get(
    `/cfg/config/getAllGradeList`
  );

  return data;
}

/**
 * 1.38 教学授课年级列表For版本
 * @param schoolId
 * @returns {Promise<T>}
 */
export async function getAllGradeListForVersion (schoolId) {
  const { data } = await axios.get(
    `/cfg/config/getAllGradeListForVersion`,
    {
      params: {
        schoolId
      }
    }
  );

  return data;
}

/**
 * 1.23 行政区教材模板删除
 * @param templateId
 * @returns {Promise<T>}
 */
export async function delEduVersionTemplate (templateId = '') {
  const { data } = await axios.post(
    `/cfg/area/delEduVersionTemplate`,
    { templateId }
  );

  return data;
}

/**
 * 1.22 行政区教材模板修改
 * @param areaId
 * @param templateName
 * @param desp
 * @param templateId
 * @param isAreaDefault
 * @returns {Promise<T>}
 */
export async function updateEduVersionTemplate ({
  areaId,
  templateName,
  desp,
  templateId,
  isAreaDefault
}) {
  const { data } = await axios.post(
    `/cfg/area/updateEduVersionTemplate`,
    {
      areaId,
      templateName,
      desp,
      templateId,
      isAreaDefault
    }
  );

  return data;
}

/**
 * 1.25 行政区教材模板教材编辑
 * @param id
 * @param courseVersionId
 * @param gradeCode
 * @param stageCode
 * @param termCode
 * @param subjectCode
 * @param versionCode
 * @param teachingFlg
 * @returns {Promise<T>}
 */
export async function editEduSetVersionTemplate ({
  id,
  courseVersionId,
  gradeCode,
  stageCode,
  termCode,
  subjectCode,
  versionCode,
  teachingFlg
}) {
  const { data } = await axios.post(
    `/cfg/area/editEduSetVersionTemplate`,
    {
      id,
      courseVersionId,
      gradeCode,
      stageCode,
      termCode,
      subjectCode,
      versionCode,
      teachingFlg
    }
  );

  return data;
}

/**
 * 1.26 行政区教材模板教材获取
 * @param templateId
 * @param gradeCode
 * @param studyStageCode
 * @returns {Promise<T>}
 */
export async function getEduSetVersionList ({
  templateId,
  gradeCode,
  studyStageCode
}) {
  const { data } = await axios.get(
    `/cfg/area/getEduSetVersionList`,
    {
      params: {
        templateId,
        gradeCode,
        studyStageCode
      }
    }
  );

  return data;
}

/**
 * 1.37 行政区教材模板教材明细删除
 * @param templateId
 * @param gradeCode
 * @param termCode
 * @param teachingFlg
 * @param subjectCode
 * @param studyStageCode
 * @returns {Promise<T>}
 */
export async function delEduSetVersionTemplate ({
  templateId,
  gradeCode,
  termCode,
  teachingFlg,
  subjectCode,
  studyStageCode
}) {
  const { data } = await axios.post(
    `/cfg/area/delEduSetVersionTemplate`,
    {
      templateId,
      gradeCode,
      termCode,
      teachingFlg,
      subjectCode,
      studyStageCode
    }
  );

  return data;
}

/**
 * 1.24 行政区教材模板复制
 * @param areaId
 * @param templateName
 * @param desp
 * @param srcTemplateId
 * @param isAreaDefault
 * @returns {Promise<void>}
 */
export async function duplicateEduVersionTemplate ({
  areaId,
  templateName,
  desp,
  srcTemplateId,
  isAreaDefault
}) {
  const { data } = await axios.post(
    `/cfg/area/duplicateEduVersionTemplate`,
    {
      areaId,
      templateName,
      desp,
      srcTemplateId,
      isAreaDefault
    }
  );

  return data;
}

/**
 * 1.28 行政区教材模板教材复制（年级）
 * @param templateId
 * @param gradeCodeFrom
 * @param gradeCodeTarget
 * @param studyStageCodeFrom
 * @param studyStageCodeTarget
 * @returns {Promise<T>}
 */
export async function copyEduVersionTemplateGrade ({
  templateId,
  gradeCodeFrom,
  gradeCodeTarget,
  studyStageCodeFrom,
  studyStageCodeTarget
}) {
  const { data } = await axios.post(
    `/cfg/area/copyEduVersionTemplateGrade`,
    {
      templateId,
      gradeCodeFrom,
      gradeCodeTarget,
      studyStageCodeFrom,
      studyStageCodeTarget
    }
  );

  return data;
}

/**
 * 1.27 行政区教材模板教材复制（上学期复制到下学期）
 * @param templateId
 * @param gradeCode
 * @param studyStageCode
 * @returns {Promise<T>}
 */
export async function copyEduVersionTemplateTerm ({
  templateId,
  gradeCode,
  studyStageCode
}) {
  const { data } = await axios.post(
    `/cfg/area/copyEduVersionTemplateTerm`,
    {
      templateId,
      gradeCode,
      studyStageCode
    }
  );

  return data;
}

/**
 * 2.21 获取文件加密Key
 * @returns {Promise<string>}
 */
export async function getFileSk () {
  const { data } = await axios.get(`/uc/file/getFileSk`);

  return (data || {}).data;
}

/**
 * @description: 6.2 获取滑块验证吗
 * @param {type}
 * @return:
 */
export async function getSliderVerify ({ captchaId }) {
  const { data } = await axios.get(
    `/tms/captcha/slider`,
    {
      params: {
        captchaId
      }
    }
  );
  return (data || {}).data;
}

/**
 * @description: 6.3 发送短信验证码
 * @param {type}
 * @return:
 */
export async function sendSmsCode ({ mobile, captchaId, xpos }) {
  const { data } = await axios.post(
    `/tms/sms/sendSmsCode`,
    qs.stringify({
      mobile,
      captchaId,
      xpos
    }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return (data || {});
}
// 校验滑块验证码
export async function verify ({ captchaId, xpos }) {
  const { data } = await axios.get(
    `/tms/captcha/slider/verify`,
    {
      params: {
        captchaId,
        xpos
      }
    },
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );
  return (data || {});
}
// 首页系统列表
export async function getSubSystemGrant () {
  const { data } = await axios.get(
    `/sso/api/getSubSystemGrant`
  );
  return (data || {});
}
// 学生、教师订单查询
export async function getUserProduce ({
  type = 'USERNAME',
  search
}) {
  const { data } = await axios.post(
    `/pbs/uprodos/s`,
    qs.stringify({
      type,
      search
    }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
  );

  return data;
}
// 字典_第三方短信网关列表
export async function getCfgSmsService3pCfgAll (smsSendWayId) {
  const { data } = await axios.get(
    `/cfg/smsService3pCfg/getCfgSmsService3pCfgAll`,
    {
      params: {
        smsSendWayId
      }
    }
  );
  return (data || {});
}
//  字典_短信发送策略列表
export async function getCfgSmsSendWayCfgAll () {
  const { data } = await axios.get(
    `/cfg/smsSendWayCfg/getCfgSmsSendWayCfgAll`
  );
  return (data || {});
}
// 获取vfs下载地址
export async function getVFSDomain () {
  const { data } = await axios.get(
    `/uconfig/cfg/VFS`
  );
  return (data || {});
}

/**
 * 1.43 第三方短信网关 是否设置学生号码为发送人
 * @param smsService3pId
 * @param stuPhoneAsSender
 * @returns {Promise<T>}
 */
export async function updateCfgSmsService3pCfgIsStuPhoneAsSender ({
  smsService3pId,
  stuPhoneAsSender
}) {
  const { data } = await axios.get(
    `/cfg/smsService3pCfg/updateCfgSmsService3pCfgIsStuPhoneAsSender`,
    {
      params: {
        smsService3pId,
        stuPhoneAsSender
      }
    }
  );

  return data;
}
export async function updateCfgSmsSendWayCfgNeedBuy ({
  smsSendWayId,
  needReceiverPhoneBuy
}) {
  const { data } = await axios.get(
    `/cfg/smsSendWayCfg/updateCfgSmsSendWayCfgNeedBuy`,
    {
      params: {
        smsSendWayId,
        needReceiverPhoneBuy
      }
    }
  );

  return data;
}
export async function smsBlur ({ xpos }) {
  const { data } = await axios.post(
    `/sso/api/sms/blur`,
    qs.stringify({ xpos })
  );
  return (data || {});
}

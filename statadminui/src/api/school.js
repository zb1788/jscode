import axios from 'axios';

export async function getSchoolList ({
  pageNo,
  pageSize,
  schoolNames,
  schoolName,
  contactors,
  schoolCodes,
  areaId,
  schoolFlag,
  eduLevel,
  studyStageCode,
  schoolModel,
  loginVerifyCodeNeed,
  productId,
  schoolModelList,
  status
}) {
  const { data } = await axios.post(
    `/sch/school/getSchoolList`,
    {
      pageNo,
      pageSize,
      schoolNames,
      schoolName,
      contactors,
      schoolCodes,
      areaId,
      schoolFlag,
      eduLevel,
      studyStageCode,
      schoolModel,
      loginVerifyCodeNeed,
      productId,
      schoolModelList,
      status
    }
  );

  return data;
}

/**
 * 学校添加
 * @param schoolModel
 * @param schoolType
 * @param eduLevel
 * @param eduYears
 * @param schoolName
 * @param contactor
 * @param customerManager
 * @param areaId
 * @param address
 * @param parentId
 * @param parentLevel
 * @param subSchoolId
 * @param pId
 * @param schoolFlag
 * @param areaCode
 * @returns {Promise<T>}
 */
export async function addSchool ({
  schoolModel,
  schoolType,
  studyStageCode,
  eduYears,
  schoolName,
  contactor,
  customerManager,
  areaId,
  address,
  parentId,
  parentLevel,
  subSchoolId,
  pId,
  topId,
  schoolFlag,
  areaCode,
  comment,
  loginVerifyCodeNeed,
  smsSendWay,
  smsService3p,
  logDetails
}) {
  const { data } = await axios.post(
    `/sch/school/addSchool`,
    {
      schoolModel,
      schoolType,
      studyStageCode,
      eduYears,
      schoolName,
      contactor: JSON.stringify(contactor || {}),
      customerManager: JSON.stringify(customerManager || []),
      areaId,
      address,
      parentId,
      parentLevel,
      subSchoolId,
      pId,
      topId,
      schoolFlag,
      areaCode,
      comment,
      loginVerifyCodeNeed,
      smsSendWay,
      smsService3p,
      logDetails
    }
  );

  return data;
}

/**
 *  学校明细
 * @param schoolId
 * @returns {Promise<T>}
 */
export async function getSchoolDetail (schoolId) {
  const { data } = await axios.get(
    `/sch/school/getSchoolDetail`,
    {
      params: { schoolId }
    }
  );

  try {
    return {
      ...data,
      data: {
        ...data.data,
        contactor: JSON.parse(data.data.contactor || '{}'),
        customerManager: JSON.parse(data.data.customerManager || '[{}]')
      }
    };
  } catch (e) {
    return data;
  }
}

/**
 * 学校修改
 * @param schoolModel
 * @param schoolType
 * @param studyStageCode
 * @param eduYears
 * @param schoolName
 * @param contactor
 * @param customerManager
 * @param areaId
 * @param address
 * @param parentId
 * @param parentLevel
 * @param subSchoolId
 * @param topId
 * @param schoolFlag
 * @param schoolId
 * @param orgId
 * @returns {Promise<T>}
 */
export async function updateSchool ({
  schoolModel,
  schoolType,
  studyStageCode,
  eduYears,
  schoolName,
  contactor,
  customerManager,
  areaId,
  areaCode,
  address,
  parentId,
  parentLevel,
  subSchoolId,
  topId,
  schoolFlag,
  schoolId,
  orgId,
  comment,
  loginVerifyCodeNeed,
  smsSendWay,
  smsService3p,
  logDetails
}) {
  const { data } = await axios.post(
    `/sch/school/updateSchool`,
    {
      schoolModel,
      schoolType,
      studyStageCode,
      eduYears,
      schoolName,
      contactor: JSON.stringify(contactor || {}),
      customerManager: JSON.stringify(customerManager || []),
      areaId,
      areaCode,
      address,
      parentId,
      parentLevel,
      subSchoolId,
      topId,
      schoolFlag,
      schoolId,
      orgId,
      comment,
      loginVerifyCodeNeed,
      smsSendWay,
      smsService3p,
      logDetails
    }
  );

  return data;
}

/**
 * 获取学校下年级
 * @param schoolId
 * @returns {Promise<T>}
 */
export async function getSchoolGrade (schoolId) {
  const { data } = await axios.get(
    `/cfg/school/getSchoolGradeByStage`,
    { params: { schoolId } }
  );

  return data;
}

/**
 * 学校年级长获取
 * @param schoolId
 * @returns {Promise<T>}
 */
export async function getSchoolGradeLeaderList (schoolId) {
  const { data } = await axios.get(
    `/sch/school/getSchoolGradeLeaderList`,
    { params: { schoolId } }
  );

  return data;
}

/**
 * 学校科目查询
 * @param schoolId
 * @param gradeCode
 * @param termCode
 * @returns {Promise<T>}
 */
export async function getSubjectList ({ schoolId, gradeCode, termCode }) {
  const { data } = await axios.get(
    `/cfg/school/getSubjectListNew`,
    { params: { schoolId, gradeCode, termCode } }
  );
  return data;
}
export async function getSubject ({ schoolId, gradeCode, termCode }) {
  const { data } = await axios.get(
    `/cfg/school/getSubjectList`,
    { params: { schoolId, gradeCode, termCode } }
  );
  return data;
}

/**
 * 3.47 学校科目查询(学期、年级) 新
 * @param gradeCode
 * @param termCode
 * @param schoolId
 * @returns {Promise<T>}
 */
export async function getSubjectListNew ({
  gradeCode,
  termCode,
  schoolId,
  studyStageCode
}) {
  const { data } = await axios.get(
    `/cfg/school/getSubjectListNew`,
    {
      params: {
        gradeCode,
        termCode,
        schoolId,
        studyStageCode
      }
    }
  );

  return data;
}

/**
 * 学校设定年级长
 * @param schoolId
 * @param list
 * @returns {Promise<T>}
 */
export async function setSchoolGradeLeader ({
  schoolId,
  list
}) {
  const { data } = await axios.post(
    `/sch/school/setSchoolGradeLeader`,
    { schoolId, list }
  );

  return data;
}

/**
 * 学校机构列表
 * @param pageNo
 * @param pageSize
 * @param orgId
 * @returns {Promise<T>}
 */
export async function getSchoolDeptList ({
  pageNo = 1,
  pageSize = 10,
  orgId
}) {
  const { data } = await axios.get(
    `/cfg/org/getSchoolDeptList`,
    { params: { pageNo, pageSize, orgId } }
  );

  return data;
}

/**
 * 添加学校机构
 * @param params {Array<{code: string, name: string, orgId: string, areaId: string}>}
 * @returns {Promise<T>}
 */
export async function setOrgDept (params = []) {
  const { data } = await axios.post(
    `/cfg/org/setOrgDept`,
    params
  );

  return data;
}

/**
 * 删除学校机构
 * @param deptList {Array<number>}
 * @returns {Promise<T>}
 */
export async function delOrgDept (deptList = []) {
  const { data } = await axios.post(
    `/cfg/org/delOrgDept`,
    { deptList }
  );

  return data;
}

/**
 * 学校机构修改
 * @param code
 * @param name
 * @param orgId
 * @param id
 * @param areaId
 * @returns {Promise<T>}
 */
export async function updateOrgDept ({
  code,
  name,
  orgId,
  id,
  areaId
}) {
  const { data } = await axios.post(
    `/cfg/org/updateOrgDept`,
    { code, name, orgId, id, areaId }
  );

  return data;
}

/**
 * 学校机构人员设定
 * @param params {Array<{deptId: string, username: string, schoolId: string, orgIdL string}>}
 * @returns {Promise<void>}
 */
export async function setOrgDeptUser (params = []) {
  const { data } = await axios.post(
    `/uc/org/setOrgDeptUser`,
    params
  );

  return data;
}

/**
 * 学校机构人员列表
 * @param pageNo
 * @param pageSize
 * @param orgId
 * @param deptId
 * @returns {Promise<T>}
 */
export async function getOrgDeptUserList ({
  pageNo,
  pageSize,
  orgId,
  deptId
}) {
  const { data } = await axios.get(
    `/uc/org/getOrgDeptUserList`,
    {
      params: {
        pageNo,
        pageSize,
        orgId,
        deptId
      }
    }
  );

  return data;
}

/**
 * 学校机构人员删除
 * @param deptId
 * @param userList
 * @returns {Promise<T>}
 */
export async function delOrgDeptUser ({
  deptId = '',
  userList = []
}) {
  const { data } = await axios.post(
    `/uc/org/delOrgDeptUser`,
    {
      deptId,
      userList
    }
  );

  return data;
}

/**
 * 学校组列表
 * @param orgId
 * @param pageNo
 * @param pageSize
 * @returns {Promise<T>}
 */
export async function getSchGroupList ({
  orgId,
  deptId,
  pageNo,
  pageSize
}) {
  const { data } = await axios.get(
    `/cfg/org/getSchGroupList`,
    {
      params: {
        orgId,
        deptId,
        pageNo,
        pageSize
      }
    }
  );

  return data;
}

/**
 * 学校组人员列表
 * @param pageNo
 * @param pageSize
 * @param groupId
 * @param orgId
 * @returns {Promise<T>}
 */
export async function getOrgGroupUserList ({
  pageNo,
  pageSize,
  groupId,
  orgId
}) {
  const { data } = await axios.get(
    `/uc/org/getOrgGroupUserList`,
    {
      params: {
        pageNo,
        pageSize,
        groupId,
        orgId
      }
    }
  );

  return data;
}

/**
 * 学校组设定
 * @param code
 * @param name
 * @param orgId
 * @param areaId
 * @param schoolId
 * @param gradeCode
 * @param subjectCode
 * @param deptId
 * @returns {Promise<T>}
 */
export async function setOrgGroup ({
  code,
  name,
  orgId,
  areaId,
  schoolId,
  gradeCode,
  subjectCode,
  deptId
}) {
  const { data } = await axios.post(
    `/cfg/org/setOrgGroup`,
    {
      code,
      name,
      orgId,
      areaId,
      schoolId,
      gradeCode,
      subjectCode,
      deptId
    }
  );

  return data;
}

/**
 * 批量设置学校组
 * @param params {Array<{
    code: string,
    name: string,
    orgId: string,
    areaId: string,
    schoolId: string,
    gradeCode: string,
    subjectCode: string,
    deptId: string
  }>}
 * @returns {Promise<T>}
 */
export async function setOrgGroups (params = []) {
  const { data } = await axios.post(
    `/cfg/org/setOrgGroups`,
    params
  );

  return data;
}

/**
 * 修改组
 * @param groupId
 * @param name
 * @returns {Promise<T>}
 */
export async function updateOrgGroup ({
  id,
  name,
  orgId
}) {
  const { data } = await axios.post(
    `/cfg/org/updateOrgGroup`,
    { id, name, orgId }
  );

  return data;
}

/**
 * 3.42 学校组添加（批量）按照年级学科
 * @param subjectList
 * @param orgId
 * @param deptId
 * @param areaId
 * @param schoolId
 * @returns {Promise<T>}
 */
export async function setOrgGroupsBySubjectAndGrade ({
  subjectList,
  orgId,
  deptId,
  areaId,
  schoolId
}) {
  const { data } = await axios.post(
    `/cfg/org/setOrgGroupsBySubjectAndGrade`,
    {
      subjectList,
      orgId,
      deptId,
      areaId,
      schoolId
    }
  );

  return data;
}

/**
 * 学校组删除
 * @param groupList
 * @returns {Promise<T>}
 */
export async function delOrgGroup (groupList = []) {
  const { data } = await axios.post(
    `/cfg/org/delOrgGroup`,
    { groupList }
  );

  return data;
}

/**
 * 学校组人员设定（批量）
 * @param parmas {Array<{ groupId: string, userName: string, orgId: string, schoolId: string }>}
 * @returns {Promise<void>}
 */
export async function setOrgGroupUsers (parmas = []) {
  const { data } = await axios.post(
    `/uc/org/setOrgGroupUsers`,
    parmas
  );

  return data;
}

/**
 * 学校组人员删除
 * @param groupId
 * @param userList
 * @returns {Promise<T>}
 */
export async function delOrgGroupUser ({
  groupId,
  userList
}) {
  const { data } = await axios.post(
    `/uc/org/delOrgGroupUser`,
    {
      groupId,
      userList
    }
  );

  return data;
}

/**
 * 查询学校年级
 * @param schoolId
 * @returns {Promise<T>}
 */
export async function getSchoolGradeByStage (schoolId = '') {
  const { data } = await axios.get(
    `/cfg/school/getSchoolGradeByStage`,
    { params: { schoolId } }
  );

  return data;
}

export async function getSchoolBookIdList ({
  schoolId,
  gradeCode
}) {
  const { data } = await axios.get(
    `/cfg/school/getSchoolBookIdList`,
    {
      params: {
        schoolId,
        gradeCode
      }
    }
  );

  return data;
}

/**
 * 学校科目版本查询
 * @param courseId
 * @returns {Promise<T>}
 */
export async function getSubjectVersionList ({
  gradeCode,
  termCode,
  subjectCode
}) {
  const { data } = await axios.get(
    `/cfg/school/getSubjectVersionListNew`,
    {
      params: {
        gradeCode,
        termCode,
        subjectCode
      }
    }
  );

  return data;
}

/**
 * 3.46 学校科目版本查询(新)
 * @param gradeCode
 * @param termCode
 * @param subjectCode
 * @param studyStageCode
 * @returns {Promise<T>}
 */
export async function getSubjectVersionListNew ({
  gradeCode,
  termCode,
  subjectCode,
  studyStageCode
}) {
  const { data } = await axios.get(
    `/cfg/school/getSubjectVersionListNew`,
    {
      params: {
        gradeCode,
        termCode,
        subjectCode,
        studyStageCode
      }
    }
  );

  return data;
}

/**
 * 3.10 学校版本设定
 * @param schoolId
 * @param courseVersionId
 * @param gradeCode
 * @param versionCode
 * @param stageCode
 * @param termCode
 * @param subjectCode
 * @param teachingFlg
 * @param studyStageCode
 * @returns {Promise<T>}
 */
export async function setSchoolEduVersion ({
  schoolId,
  courseVersionId,
  gradeCode,
  versionCode,
  stageCode,
  termCode,
  subjectCode,
  teachingFlg,
  studyStageCode
}) {
  const { data } = await axios.post(
    `/cfg/school/setSchoolEduVersion`,
    {
      schoolId,
      courseVersionId,
      gradeCode,
      versionCode,
      stageCode,
      termCode,
      subjectCode,
      teachingFlg,
      studyStageCode
    }
  );

  return data;
}

/**
 * 3.48 学校版本删除
 * @param schoolId
 * @param gradeCode
 * @param termCode
 * @param teachingFlg
 * @param subjectCode
 * @param studyStageCode
 * @returns {Promise<T>}
 */
export async function delSchoolEduVersion ({
  schoolId,
  gradeCode,
  termCode,
  teachingFlg,
  subjectCode,
  studyStageCode
}) {
  const { data } = await axios.post(
    `/cfg/school/delSchoolEduVersion`,
    {
      schoolId,
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
 * 3.12 学校版本复制（年级）
 * @param schoolId
 * @param gradeCodeFrom
 * @param gradeCodeTarget
 * @returns {Promise<void>}
 */
export async function copySchoolBookIdGrade ({
  schoolId,
  gradeCodeFrom,
  gradeCodeTarget
}) {
  const { data } = await axios.post(
    `/cfg/school/copySchoolBookIdGrade`,
    {
      schoolId,
      gradeCodeFrom,
      gradeCodeTarget
    }
  );

  return data;
}

/**
 * 3.14 学校版本复制（区域）
 * @param schoolId
 * @param templateId
 * @returns {Promise<T>}
 */
export async function copySchoolBookIdFromTemplate ({
  schoolId,
  templateId
}) {
  const { data } = await axios.post(
    `/cfg/school/copySchoolBookIdFromTemplate`,
    {
      schoolId,
      templateId
    }
  );

  return data;
}

/**
 * 3.6 学校禁用/启用（批量）
 * @param schoolList
 * @param valid
 * @returns {Promise<T>}
 */
export async function forbiddenSchool ({
  schoolList = [],
  valid
}) {
  const { data } = await axios.post(
    `/sch/school/forbiddenSchool`,
    {
      schoolList,
      valid
    }
  );

  return data;
}

/**
 * 启用学校
 * @param schoolList
 * @returns {Promise<T>}
 */
export const enableSchools = (schoolList = []) => forbiddenSchool({ schoolList, valid: '1' });

/**
 * 禁用学校
 * @param schoolList
 * @returns {Promise<T>}
 */
export const disableSchools = (schoolList = []) => forbiddenSchool({ schoolList, valid: '0' });

/**
 * 3.9 学校调校、调班授权
 * @param schoolId {string}
 * @param schoolIds {Array<String>}
 * @param policyList {Array<{schoolId: String, keyType: String, val: String, beginTime: String, endTime: String}>}
 * @returns {Promise<void>}
 */
export async function updateSchoolPolicy ({
  schoolId = '',
  schoolIds,
  policyList = [],
  logDetails
}) {
  const { data } = await axios.post(
    `/sch/school/updateSchoolPolicy`,
    {
      schoolIds: schoolIds || [ schoolId ],
      policyList,
      logDetails
    }
  );

  return data;
}

/**
 * 3.39 学校调校、调班授权获取
 * @param schoolId {string}
 * @returns {Promise<T>}
 */
export async function getSchoolPolicy (schoolId = '') {
  const { data } = await axios.post(
    `/sch/school/getSchoolPolicy`,
    { schoolId }
  );

  return data;
}

function download (blob, fieldname) {
  if (window.navigator.msSaveBlob) {
    try {
      window.navigator.msSaveBlob(blob, fieldname);
    } catch (e) {

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

/**
 * 3.5 学校列表导出
 * @param params {{
    schoolNameList: string,
    contactorList,
    schoolCodeList,
    areaId,
    schoolFlag,
    eduLevel,
    schoolModel,
    loginVerifyCodeNeed,
    productId
  }}
 * @returns {Promise<void>}
 */
export async function exportSchoolList (params = {}) {
  const res = await axios.post(
      `sch/school/exportSchoolList`,
      params,
      {
        headers: { 'filename': 'utf-8' },
        responseType: 'arraybuffer'
      }
    ),

    contentDisposition = decodeURIComponent(res.headers['content-disposition'])
      .split(';')
      .reduce((result, str) => {
        const [ key, val ] = str.split('=');
        result[key] = val;

        return result;
      }, {});
  let blob = new Blob([ res.data ], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  download(
    blob,
    contentDisposition.filename
  );
}

/**
 * 获取二维码
 * @param schoolId
 * @param inviter
 * @param inviterPhone
 * @returns {Promise<T>}
 */
export async function getSchQrcode ({
  schoolId,
  inviter,
  inviterPhone
}) {
  const { data } = await axios.get(
    `/sch/school/getSchQrcode`,
    {
      responseType: 'arraybuffer',
      params: {
        schoolId,
        inviter,
        inviterPhone
      }
    }
  );

  return 'data:image/png;base64,' + btoa(
    new Uint8Array(data)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}

/**
 * 获取二维码
 * @param schoolId
 * @param inviter
 * @param inviterPhone
 * @returns {Promise<T>}
 */
export async function getSchQrcodeShare ({
  schoolId,
  inviter,
  inviterPhone
}) {
  const { data } = await axios.get(
    `/sch/school/getSchQrcodeShare`,
    {
      responseType: 'arraybuffer',
      params: {
        schoolId,
        inviter,
        inviterPhone
      }
    }
  );

  return 'data:image/png;base64,' + btoa(
    new Uint8Array(data)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}

/**
 * 复制上学期版本
 * @param schoolId
 * @param gradeCode
 * @returns {Promise<T>}
 */
export async function copySchoolBookIdTerm ({ schoolId, gradeCode }) {
  const { data } = await axios.post(
    `/cfg/school/copySchoolBookIdTerm`,
    { schoolId, gradeCode }
  );

  return data;
}

/**
 * 3.44 学校机构人员列表(未添加)
 * @param pageNo
 * @param pageSize
 * @param orgId 组织ID
 * @param deptId 机构ID
 * @param userName 用户名称
 * @returns {Promise<T>}
 */
export async function getOrgDeptUserListForAdd ({
  pageNo,
  pageSize,
  orgId,
  deptId,
  userName
}) {
  const { data } = await axios.get(
    `/uc/org/getOrgDeptUserListForAdd`,
    {
      params: {
        pageNo,
        pageSize,
        orgId,
        deptId,
        userName
      }
    }
  );

  return data;
}

/**
 * 3.45 学校组人员列表(未添加)
 * @param pageNo
 * @param pageSize
 * @param groupId 组ID
 * @param deptId 组织ID
 * @param userName 用户名称
 * @returns {Promise<T>}
 */
export async function getOrgGroupUserListForAdd ({
  pageNo,
  pageSize,
  groupId,
  orgId,
  userName
}) {
  const { data } = await axios.get(
    `/uc/org/getOrgGroupUserListForAdd`,
    {
      params: {
        pageNo,
        pageSize,
        groupId,
        orgId,
        userName
      }
    }
  );

  return data;
}

/**
 * 3.7 学校删除
 * @param schoolId
 * @param orgId
 * @param validCode
 * @param note
 * @returns {Promise<T>}
 */
export async function delSchool ({
  schoolId,
  orgId,
  validCode,
  note
}) {
  const { data } = await axios.post(
    `/sch/school/delSchool`,
    {
      schoolId,
      orgId,
      validCode,
      note
    }
  );

  return data;
}

/**
 * 学校变更日志
 * @param schoolId
 * @returns {Promise<T>}
 */
export async function getSchoolLog (schoolId) {
  const { data } = await axios.get(
    `/log/getSchoolLog`,
    {
      params: { schoolId }
    }
  );

  return data;
}

/**
 * 3.32 学校是否存在
 * @param schoolId
 * @param schoolName
 * @returns {Promise<void>}
 */
export async function getSchoolExists ({
  schoolId,
  schoolName
}) {
  const { data } = await axios.get(
    `/sch/school/getSchoolExists`,
    {
      params: {
        schoolId,
        schoolName
      }
    }
  );

  return data;
}
/**
 * 3.33 获取学校列表（不受区域限制）
 * @param schoolId
 * @param schoolName
 * @returns {Promise<void>}
 */
export async function getSchoolListForSpace ({
  pageNo = 1,
  pageSize = 200,
  schoolName,
  contactors,
  schoolCodes,
  areaId,
  schoolFlag,
  studyStageCode,
  schoolModel,
  loginVerifyCodeNeed,
  productId,
  schoolModelList
}) {
  const { data } = await axios.get(
    `/sch/school/getSchoolListForSpace`,
    {
      params: {
        pageNo,
        pageSize,
        schoolName,
        contactors,
        schoolCodes,
        areaId,
        schoolFlag,
        studyStageCode,
        schoolModel,
        loginVerifyCodeNeed,
        productId,
        schoolModelList
      }
    }
  );
  return data;
}

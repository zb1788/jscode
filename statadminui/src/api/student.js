import axios from 'axios';

// 班级重名列表
export async function getClassUsernameConflict ({ pageNo, pageSize, areaId, schoolId, className, gradeCode }) {
  const { data } = await axios.get(
    `/sch/student/getClassUsernameConflict`,
    { params: { pageNo, pageSize, areaId, schoolId, className, gradeCode } }
  );

  return data;
}
// 班级重名人员列表
export async function getClassUsernameConflictDetail ({ classId, stuName }) {
  const { data } = await axios.get(
    `/sch/student/getClassUsernameConflictDetail`,
    { params: { classId, stuName } }
  );

  return data;
}
// 班级重名别名修改
export async function updateClassUsernameConflict ({ username, alias, logDetails }) {
  const { data } = await axios.post(
    `/sch/student/updateClassUsernameConflict`,
    { username, alias, logDetails }
  );

  return data;
}

// 班级重名姓名修改
export async function updateStudentSelf ({ schoolId, classId, realName, studentNumber }) {
  const { data } = await axios.post(
    `/sch/student/updateStudentSelf`,
    { schoolId, classId, realName, studentNumber }
  );
  return data;
}
// -------------------------------------------------------
// 学生信息管理
// 学生列表
export async function getStudentList ({ pageNo, pageSize, params, type }) {
  const { data } = await axios.post(
    `/sch/student/getStudentList`,
    { pageNo, pageSize, params, type }
  );

  return data;
}
// 学生列表（高级查询）
export async function getStuMuti ({ pageNo, pageSize, areaId, gradeCode, classId, schoolId, realname, hasIotCode, regFlg, isGraduate, tryFlg, hasPhone, userstate, buyProduct }) {
  const { data } = await axios.get(
    `/sch/student/getStuMuti`,
    { params: { pageNo, pageSize, areaId, gradeCode, classId, schoolId, realname, hasIotCode, regFlg, isGraduate, tryFlg, hasPhone, userstate, buyProduct } }
  );

  return data;
}
// 学生修改
export async function updateStudent ({ schoolId, gradeCode, classId, realName, sex, phone, idCard, patCard, iotCardCode, liveInSchool, areaId, familynoInfo, studentNumber, studentType, parentPhone1, parentPhone2, parentPhone3, parentType1, parentType2, parentType3, logDetails }) {
  const { data } = await axios.post(
    `/sch/student/updateStudent`, { schoolId, gradeCode, classId, realName, sex, phone, idCard, patCard, iotCardCode, liveInSchool, areaId, familynoInfo, studentNumber, studentType, parentPhone1, parentPhone2, parentPhone3, parentType1, parentType2, parentType3, logDetails }
  );

  return data;
}
//  学生添加
export async function addStudent ({ schoolId, gradeCode, classId, realName, sex, phone, idCard, patCard, liveInSchool, areaId, familynoInfo, studentType, regSrc, studentNumber, parentPhone1, parentPhone2, parentPhone3, parentType1, parentType2, parentType3, logDetails }) {
  const { data } = await axios.post(
    `/sch/student/addStudent`, { schoolId, gradeCode, classId, realName, sex, phone, idCard, patCard, liveInSchool, areaId, familynoInfo, studentType, regSrc, studentNumber, parentPhone1, parentPhone2, parentPhone3, parentType1, parentType2, parentType3, logDetails }
  );

  return data;
}
//  学生删除
export async function removeStudent ({ username, smsCode, mobile }) {
  const { data } = await axios.post(
    `/sch/student/removeStudent`, { username, smsCode, mobile }
  );

  return data;
}
//  学生明细
export async function getStudentDetail ({ username }) {
  const { data } = await axios.get(
    `/sch/student/getStudentDetail`, { params: { username } }
  );

  return data;
}
// 学生明细（未加密）
export async function getStudentNoDetail (username) {
  const { data } = await axios.get(
    `/sch/student/getStudentDetailNoEncrypt`, { params: { username } }
  );
  return data;
}
// 学生的禁用启用
export async function StudentStartUseOrForbidden ({ userName, status, logDetails }) {
  const { data } = await axios.post(
    `/uc/sys/user/StudentStartUseOrForbidden`, { userName, status, logDetails }
  );

  return data;
}
//   设置学生亲情号
export async function updateStudentFamilynoIfo ({ studentNumber, familynoInfo, logDetails }) {
  const { data } = await axios.post(
    `/sch/student/updateStudentFamilynoIfo`, { studentNumber, familynoInfo, logDetails }
  );

  return data;
}
//   批量设置取消贫困生
export async function updateStudentTypeBatch ({ studentNumbers, studentType, logDetails }) {
  const { data } = await axios.post(
    `/sch/student/updateStudentTypeBatch`, { studentNumbers, studentType, logDetails }
  );

  return data;
}
//   批量解绑手机号物联卡学习卡
export async function updateStudentUntyingBatch ({ phone, iotCardCode, patCard, smsCode, mobile }) {
  const { data } = await axios.post(
    `/sch/student/updateStudentUntyingBatch`, { phone, iotCardCode, patCard, smsCode, mobile }
  );

  return data;
}
//   家长重置密码 学生重置家长密码（不用这个接口）
export async function updateResetParentAccountPwdBatch ({ userName }) {
  const { data } = await axios.post(
    `/uc/sys/user/updateResetAccountPwdBatch`, { userName }
  );

  return data;
}
// 家长重置密码
export async function updateResetAccountPwdBatch ({ studentNumber }) {
  const { data } = await axios.post('/sch/student/updateResetAccountPwdBatch', { studentNumber });
  return data;
}
//  校验学生手机号（添加学生时用）
export async function addStudentModPhoneCheck ({ phone, username, type }) {
  const { data } = await axios.get(
    `/sch/student/addStudentModPhoneCheck`, { params: { phone, type, username } }
  );

  return data;
}
// 校验平安通卡号（添加学生时用）
export async function addStudentModPadCardCheck ({ patCards, username }) {
  const { data } = await axios.post(`/sch/student/patCardCheck?patCard=${patCards}&username=${username}`);
  return data;
}
//  学生修改（批量转校）
export async function updateBatchTransferSch ({ classId, studentNumbers, logDetails }) {
  const { data } = await axios.post(
    `/sch/student/updateBatchTransferSch`, { classId, studentNumbers, logDetails }
  );

  return data;
}
//  标记删除学生恢复
export async function recoverDelStu ({ studentNumber, type }) {
  const { data } = await axios.post(
    `/sch/student/recoverDelStu`, { studentNumber, type }
  );

  return data;
}
//  标记删除学生彻底删除
export async function physicalDeletStuent ({ studentNumber }) {
  const { data } = await axios.post(
    `/sch/student/physicalDeletStuent`, { studentNumber }
  );

  return data;
}
//  获取学生日志详情
export async function getStudentLog ({ username }) {
  const { data } = await axios.get(
    `/log/getStudentLog`, { params: { username } }
  );

  return data;
}
//  获取家长日志详情
export async function getParentLog ({ username }) {
  const { data } = await axios.get(
    `/log/getParentLog`, { params: { username } }
  );

  return data;
}
//  手机/物联网卡状态变更
export async function updateSimOrderState ({ usernumber, state }) {
  const { data } = await axios.get(
    `/pbs/prodOrder/updateSimOrderState`, { params: { usernumber, state } }
  );

  return data;
}
//   智能电子学生证 - 查询审核列表
export async function smartCardList ({ curPage, pageSize, auditState }) {
  const { data } = await axios.get(
    `/sch/smartCard/list`, { params: { curPage, pageSize, auditState } }
  );

  return data;
}
//   智能电子学生证 - 查询审核列表
export async function smartCardAudit ({ imei, auditState }) {
  const { data } = await axios.get(
    `/sch/smartCard/audit`, { params: { imei, auditState } }
  );

  return data;
}
//   毕业生高级查询
export async function getGraduateStuMuti ({ pageNo, pageSize, areaId, oldSchoolId, truename, userName, tryFlg, hasIotCode, regFlg, phone, parentPhone, userstate, hasPhone }) {
  const { data } = await axios.get(
    `/sch/student/getGraduateStuMuti`, { params: { pageNo, pageSize, areaId, oldSchoolId, truename, userName, tryFlg, hasIotCode, regFlg, phone, parentPhone, userstate, hasPhone } }
  );

  return data;
}
//   毕业生批量查询
export async function getGraduateStudentList ({ params, type }) {
  const { data } = await axios.get(
    `/sch/student/getGraduateStudentList`, { params: { params, type } }
  );

  return data;
}
//   查询升年级任务（分页）
export async function selectTaskUpGradeSchoolList ({ pageNo, pageSize, schoolFlag, studyStageCode, schoolName, execState }) {
  const { data } = await axios.post(
    `/sch/upgradeTask/selectTaskUpGradeSchoolList`, { pageNo, pageSize, schoolFlag, studyStageCode, schoolName, execState }
  );

  return data;
}
//   学校升年级
export async function execTaskUpGradeSchool ({ schoolIds }) {
  const { data } = await axios.post(
    `/sch/upgradeTask/addTaskUpGradeSchool`, { schoolIds }
  );

  return data;
}
// 根据学生账号 查询家长账号
export async function getParentAccountByStudentNumber (studentNumber) {
  const data = await axios.get('/sch/student/getParentAccountByStudentNumber', { params: { studentNumber } });
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
// 导出学生卡
export async function exportStuCard (params = {}) {
  const res = await axios.get(
      `sch/student/exportStuCard`,
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
// 导出学生
export async function exportStudent (params = {}, areaId) {
  const res = await axios.get(
      `sch/student/exportStudent`,
      {
        params,
        areaId,
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
// 查询学生是否有付费套餐（删除学生用）
export async function checkRemoveStudent ({ username }) {
  const { data } = await axios.post(
    `/sch/student/checkRemoveStudent`,
    { username }
  );

  return data;
}

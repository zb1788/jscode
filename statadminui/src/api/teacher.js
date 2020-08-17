import axios from 'axios';
// 教师列表
export async function getTeacherList ({ pageNo, pageSize, phoneList, accountList, idCardList, teacherSnList, schoolId, truename, productId, hasPhone, userstate, username, idCardCode, regFlg, hasEncrypted, testFlg, areaId, type = '0' }) {
  const { data } = await axios.get(
    `/sch/teacher/getTeacherList`,
    { params: { pageNo, pageSize, phoneList, accountList, idCardList, teacherSnList, schoolId, truename, productId, hasPhone, userstate, username, idCardCode, hasEncrypted, regFlg, testFlg, areaId, type } }
  );

  return data;
}
// 教师添加
export async function addTeacher ({ schoolId, truename, teacherSn, idCardCode, phone, deptId, dutyId, subjects, logDetails }) {
  const { data } = await axios.post(
    `/sch/teacher/addTeacher`,
    { schoolId, truename, teacherSn, idCardCode, phone, deptId, dutyId, subjects, logDetails }
  );

  return data;
}
// 教师修改
export async function updateTeacher ({ schoolId, username, truename, teacherSn, idCardCode, phone, deptId, dutyId, subjects, logDetails }) {
  const { data } = await axios.post(
    `/sch/teacher/updateTeacher`,
    { schoolId, username, truename, teacherSn, idCardCode, phone, deptId, dutyId, subjects, logDetails }
  );

  return data;
}
// 教师转校
export async function updateTeacherSchool ({ username, oldSchoolId, newSchoolId, phone, studyStageCode, subjects, truename, logDetails }) {
  const { data } = await axios.post(
    `/sch/teacher/updateTeacherSchool`,
    { username, oldSchoolId, newSchoolId, phone, studyStageCode, subjects, truename, logDetails }
  );

  return data;
}
// 教师转校（批量）
export async function updateTeacherSchoolBatch ({ usernames, schoolId, logDetails }) {
  const { data } = await axios.post(
    `/sch/teacher/updateTeacherSchoolBatch`,
    { usernames, schoolId, logDetails }
  );

  return data;
}
// 教师禁用启用（批量）
export async function updateTeacherStateBatch ({ userstate, usernames, logDetails }) {
  const { data } = await axios.post(
    `/sch/teacher/updateTeacherStateBatch`,
    { userstate, usernames, logDetails }
  );

  return data;
}
// 教师删除（批量）
export async function deleteTeacherBatch ({ delFlg, usernames, vCode, phone }) {
  const { data } = await axios.post(
    `/sch/teacher/deleteTeacherBatch`,
    { delFlg, usernames, vCode, phone }
  );

  return data;
}
// 教师明细
export async function getTeacherInfo ({ username }) {
  const { data } = await axios.get(
    `/sch/teacher/getTeacherInfo`,
    { params: { username } }
  );

  return data;
}
// 查询教师所属班级
export async function getTeacherClassInfo ({ username }) {
  const { data } = await axios.get(
    `/sch/teacher/getTeacherClassInfo`,
    { params: { username } }
  );

  return data;
}
// 教师所属教研组
export async function getTeacherGroup ({ username }) {
  const { data } = await axios.get(
    `/sch/teacher/getTeacherGroup`,
    { params: { username } }
  );

  return data;
}
// 教师所属部门
export async function getTeacherDeptInfo ({ username }) {
  const { data } = await axios.get(
    `/sch/teacher/getTeacherDeptInfo`,
    { params: { username } }
  );

  return data;
}
// 教师添加多班级
export async function addTeacherClass ({ username, classId, logDetails, truename, schoolId, phone }) {
  const { data } = await axios.post(
    `/sch/teacher/addTeacherClass`,
    { username, classId, logDetails, truename, schoolId, phone }
  );

  return data;
}
// 恢复已删除教师
export async function recoverTeacher ({ username, phone }) {
  const { data } = await axios.post(
    `/sch/teacher/recoverTeacher`,
    { username, phone }
  );

  return data;
}
//  手动物理删除教师
export async function removerTeacher ({ username }) {
  const { data } = await axios.post(
    `/sch/teacher/removerTeacher`,
    { username }
  );

  return data;
}
// 校验自注册手机号
export async function checkPhoneForAdd ({ phone, username }) {
  const { data } = await axios.get(
    `/uc/sys/user/checkPhoneForAdd`, { params: { phone, username } }
  );

  return data;
}
// 教师添加多教研组
export async function addTeacherGroup ({ username, groupIds, schoolId, orgId, logDetails, truename, phone }) {
  const { data } = await axios.post(
    `/uc/sys/user/addTeacherGroup`,
    { username, groupIds, schoolId, orgId, logDetails, truename, phone }
  );

  return data;
}
// 获取教师日志详情
export async function getTeacherLog ({ username }) {
  const { data } = await axios.get(
    `/log/getTeacherLog`,
    { params: { username } }
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
export async function exportTeacherList (params = {}) {
  const res = await axios.get(
      `sch/teacher/exportTeacher`,
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
// 查询学生是否有付费套餐（删除学生用）
export async function checkRemoveTeacher ({ username }) {
  const { data } = await axios.post(
    `/sch/teacher/checkRemoveTeacher`,
    { username }
  );

  return data;
}

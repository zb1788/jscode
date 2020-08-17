import axios from 'axios';

// 班级列表
export async function getClassList ({ pageNo, pageSize, areaId, className, gradeCode, schoolId }) {
  const { data } = await axios.get(
    `/sch/class/getClassList`,
    { params: { pageNo, pageSize, areaId, className, gradeCode, schoolId } }
  );

  return data;
}
// 学校查询年级班级
export async function getSchClassList ({ pageNo, pageSize, schoolId, gradeCode }) {
  const { data } = await axios.get(
    `/sch/class/getSchClassList`,
    { params: { pageNo, pageSize, schoolId, gradeCode } }
  );

  return data;
}
// 班级添加
export async function addClass ({ schoolId, areaId, gradeCode, className, classRemark }) {
  const { data } = await axios.post(
    `/sch/class/addClass`,
    { schoolId, areaId, gradeCode, className, classRemark }
  );

  return data;
}
// 班级修改
export async function updateClass ({ className, classRemark, classId }) {
  const { data } = await axios.post(
    `/sch/class/updateClass`,
    { className, classRemark, classId }
  );

  return data;
}
// 班级明细
export async function getClassDetail ({ classId }) {
  const { data } = await axios.get(
    `/sch/class/getClassDetail`,
    { params: { classId } }
  );

  return data;
}
// 班级删除
export async function delClass ({ classIds }) {
  const { data } = await axios.post(
    `/sch/class/delClass`,
    { classIds }
  );

  return data;
}
// 班级学生列表
export async function getClassStudentList ({ pageNo, pageSize, schoolId, classId }) {
  const { data } = await axios.get(
    `/sch/class/getClassStudentList`,
    { params: { pageNo, pageSize, schoolId, classId } }
  );

  return data;
}
// 班级学生选择列表
export async function getAddClassStudentList ({ pageNo, pageSize, schoolId, classId, gradeCode, studentNumber, realName }) {
  const { data } = await axios.get(
    `/sch/class/getAddClassStudentList`,
    { params: { pageNo, pageSize, schoolId, classId, gradeCode, studentNumber, realName } }
  );

  return data;
}
// 班级学生删除
export async function delClassStudent ({ studentNumber, logDetails }) {
  const { data } = await axios.post(
    `/sch/class/delClassStudent`,
    { studentNumber, logDetails }
  );

  return data;
}
// 班级学生添加
export async function addClassStudent ({ classId, stuNumberList, logDetails }) {
  const { data } = await axios.post(
    `/sch/class/addClassStudent`,
    { classId, stuNumberList, logDetails }
  );

  return data;
}
// 班级教师列表
export async function getClassTeacherList ({ pageNo, pageSize, classId, schoolId }) {
  const { data } = await axios.get(
    `/sch/class/getClassTeacherList`,
    { params: { pageNo, pageSize, classId, schoolId } }
  );

  return data;
}
//  班级教师选择列表
export async function getAddClassTeacherList ({ pageNo, pageSize, classId, schoolId, username, truename }) {
  const { data } = await axios.get(
    `/sch/class/getAddClassTeacherList`,
    { params: { pageNo, pageSize, classId, schoolId, username, truename } }
  );

  return data;
}
// 班级老师添加
export async function addClassTeacher ({ classId, teacherIdList, logDetails }) {
  const { data } = await axios.post(
    `/sch/class/addClassTeacher`,
    { classId, teacherIdList, logDetails }
  );

  return data;
}
// 班级老师删除
export async function delClassTeacher ({ classId, username, logDetails }) {
  const { data } = await axios.post(
    `/sch/class/delClassTeacher`,
    { classId, username, logDetails }
  );

  return data;
}
// 班级班主任修改
export async function addClassTeacherMaster ({ classId, classTeacher, logDetails }) {
  const { data } = await axios.post(
    `/sch/class/addClassTeacherMaster`,
    { classId, classTeacher, logDetails }
  );

  return data;
}

// 教学班

// 教学班级列表
export async function getCourseClassList ({ pageNo, pageSize, areaId, name, schoolId }) {
  const { data } = await axios.get(
    `/sch/courseClass/getCourseClassList`,
    { params: { pageNo, pageSize, areaId, name, schoolId } }
  );

  return data;
}
// 教学班级添加
export async function addCourseClass ({ schoolId, name, subjectNumber, gradeCode }) {
  const { data } = await axios.post(
    `/sch/courseClass/addCourseClass`,
    { schoolId, name, subjectNumber, gradeCode }
  );

  return data;
}
// 教学班级修改
export async function updateCourseClass ({ name, id }) {
  const { data } = await axios.post(
    `/sch/courseClass/updateCourseClass`,
    { name, id }
  );

  return data;
}
//  教学班级明细
export async function getCourseClassDetail ({ id }) {
  const { data } = await axios.get(
    `/sch/courseClass/getCourseClassDetail`,
    { params: { id } }
  );

  return data;
}
// 教学班级删除
export async function delCourseClass (classId) {
  const { data } = await axios.post(
    `/sch/courseClass/delCourseClass`,
    classId
  );

  return data;
}
//  教学班级教师列表
export async function getCourseClassTeacherList ({ pageNo, pageSize, id }) {
  const { data } = await axios.get(
    `/sch/courseClass/getCourseClassTeacherList`,
    { params: { pageNo, pageSize, id } }
  );

  return data;
}
// 教学班级老师添加
export async function addCourseClassTeacher ({ classId, teacherIdList, logDetails }) {
  const { data } = await axios.post(
    `/sch/courseClass/addCourseClassTeacher`,
    { classId, teacherIdList, logDetails }
  );

  return data;
}
// 教学班级老师删除
export async function delCourseClassTeacher ({ id, logDetails }) {
  const { data } = await axios.post(
    `/sch/courseClass/delCourseClassTeacher`,
    { id, logDetails }
  );

  return data;
}
//  教学班级学生列表
export async function getCourseClassStudentList ({ pageNo, pageSize, id }) {
  const { data } = await axios.get(
    `/sch/courseClass/getCourseClassStudentList`,
    { params: { pageNo, pageSize, id } }
  );

  return data;
}
//  教学班级学生删除
export async function delCourseClassStudent ({ id, logDetails }) {
  const { data } = await axios.post(
    `/sch/courseClass/delCourseClassStudent`,
    { id, logDetails }
  );

  return data;
}
//  教学班级学生添加
export async function addCourseClassStudent ({ classId, studentList, logDetails }) {
  const { data } = await axios.post(
    `/sch/courseClass/addCourseClassStudent`,
    { classId, studentList, logDetails }
  );

  return data;
}
//  教学班级供选择学生列表
export async function getCourseClassStudentListForAdd ({ pageNo, pageSize, id, gradeCode, truename, username, schoolId }) {
  const { data } = await axios.get(
    `/sch/courseClass/getCourseClassStudentListForAdd`,
    { params: { pageNo, pageSize, id, gradeCode, truename, username, schoolId } }
  );

  return data;
}
//  教学班级供选择教师列表
export async function getCourseClassTeacherListForAdd ({ pageNo, pageSize, id, username, truename, schoolId }) {
  const { data } = await axios.get(
    `/sch/courseClass/getCourseClassTeacherListForAdd`,
    { params: { pageNo, pageSize, id, username, truename, schoolId } }
  );

  return data;
}
//  根据年级查询班级
export async function getClassByGrade ({ schoolId, gradeCode }) {
  const { data } = await axios.get(
    `/sch/class/getClassByGrade`,
    { params: { schoolId, gradeCode } }
  );

  return data;
}

// 根据班级获取学生(学生姓名不加密)
export async function getXZStudnetList (
  {
    pageNo,
    pageSize,
    classId,
    schoolId
  }
) {
  const { data } = await axios.get(
    `/sch/class/getClassStudentListForSapce`,
    {
      params: {
        pageNo,
        pageSize,
        classId,
        schoolId
      }
    }
  );
  return data;
}

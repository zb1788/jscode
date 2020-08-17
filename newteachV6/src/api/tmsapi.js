/**
 * TMS相关接口
 */


import request from '@/utils/request'
import store from '@/store'
import commonUtils from '@/utils/common'


/**
 * 获取基础版本年级学期信息
 * @param {当前登陆教师账号} teacherNumber 
 */
export function getBaseGradeSubjectTerm(teacherNumber){
    let url = process.env.TMS_BASE_PREFIX + '/tms/interface/queryVersion.jsp'
    let params = {}
    params.queryType = 'gradeSubjectsSchoolByUser'
    params.username = teacherNumber
    
    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}
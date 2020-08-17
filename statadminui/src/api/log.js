/*
 * @Author: your name
 * @Date: 2020-04-29 10:29:44
 * @LastEditTime: 2020-04-29 16:43:07
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \base\src\api\log.js
 */
import axios from 'axios';

// 查询日志列表（分页）
export async function getLogList ({ pageNo, pageSize, opType, opDataType, startOpDate, endOpDate }) {
  const { data } = await axios.get('/log/searchLog', {
    params: {
      pageNo,
      pageSize,
      opType,
      opDataType,
      startOpDate,
      endOpDate
    }
  });
  return data;
}

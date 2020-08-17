import axios from 'axios';
import { SYSTEM_ID } from '../CONSTANCE';

/**
 * 7.1 任务列表
 * @param pageNo
 * @param pageSize
 * @param viewStatus
 * @param systemId
 * @param opType
 * @param status
 * @param addTime
 * @param endTime
 * @param opRealname
 * @param isReview
 * @returns {Promise<T>}
 */
export async function getTaskList ({
  pageNo,
  pageSize,
  viewStatus,
  systemId,
  opType,
  status,
  addTime,
  endTime,
  opRealname,
  isReview
}) {
  const { data } = await axios.get(
    `/sys/task/getTaskList`,
    {
      params: {
        pageNo,
        pageSize,
        systemId,
        opType,
        status,
        viewStatus,
        addTime,
        endTime,
        opRealname,
        isReview
      }
    }
  );

  return data;
}

/**
 * 7.3 任务消息通知
 * @returns {Promise<T>}
 */
export async function getTaskFinMessage () {
  const { data } = await axios.get(
    `/sys/task/getTaskFinMessage`
  );

  return data;
}

/**
 * 7.4 任务消息通知确认
 * @param taskId
 * @returns {Promise<T>}
 */
export async function getTaskFinMessageAccept (taskId = '') {
  const { data } = await axios.post(
    `/sys/task/getTaskFinMessageAccept`,
    { taskId }
  );

  return data;
}

/**
 * 7.5 任务新增
 * @param fileUrl
 * @param systemId
 * @param taskLevel
 * @param name
 * @param opType
 * @returns {Promise<T>}
 */
export async function addTask ({
  fileUrl,
  systemId = SYSTEM_ID,
  taskLevel,
  name,
  opType
}) {
  const { data } = await axios.post(
    `/sys/task/addTask`,
    {
      fileUrl,
      systemId,
      taskLevel,
      name,
      opType
    }
  );

  return data;
}
/**
 * 7.5 转入已完成列表
 * @param id
 * @param viewStatus
 * @returns {Promise<T>}
 */
export async function setFinished ({ id, viewStatus = 1 }) {
  const { data } = await axios.post(
    `/sys/task/setFinished`,
    {
      id,
      viewStatus
    }
  );

  return data;
}

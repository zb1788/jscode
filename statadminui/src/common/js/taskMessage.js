/*
 * @Author: your name
 * @Date: 2020-04-28 19:06:32
 * @LastEditTime: 2020-04-29 17:52:09
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \base\src\common\js\taskMessage.js
 */
import { getTaskFinMessage, getTaskFinMessageAccept } from '../../api/task';

const messageList = [];

/**
 * 消息管道
 * @param id {string}
 * @param params {Object}
 */
export function messagePipe (id, params) {
  if (messageList.indexOf(id) !== -1) { return; }

  messageList.push(id);
  const _timeout = window.setTimeout(() => {
    this.$notice(params);
    window.clearTimeout(_timeout);
  }, 10);
}

/**
 * 获取消息
 * @param app
 * @returns {Promise<void>}
 */
export default async function (app) {
  window.setInterval(() => {
    if (['/login', '/systemEntrance'].indexOf(app.$route.path) !== -1) {
      return;
    }

    getTaskFinMessage().then(({ data }) => {
      (data || []).forEach(message => {
        if (!message) { return false; }

        const success = message.status === '执行成功';
        messagePipe.call(app, message.taskId, {
          title: message.status,
          type: success,
          data: {
            loading: false
          },
          duration: 0,
          render () {
            return <span style="color: #666;">{message.opTypeName}</span>;
          },
          subRender (h, $notice) {
            return <vcom-button
              type='primary'
              plain={true}
              v-loading={$notice.loading}
              onClick={() => {
                $notice.loading = true;
                getTaskFinMessageAccept(message.taskId)
                  .then(res => {
                    $notice.loading = false;
                    if (res && res.subCode) {
                      $notice.distroy();
                      // app.$router.push({
                      //   path: success ? '/finishedTask' : '/unFinishedTask'
                      // })
                    }
                  });
              }}
            >确认</vcom-button>;
          }
        });
      });
    });
  }, 60 * 1000);
}

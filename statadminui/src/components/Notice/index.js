/*
 * @Author: your name
 * @Date: 2020-04-28 19:05:39
 * @LastEditTime: 2020-04-29 15:48:05
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \base\src\components\Notice\index.js
 */
import Vue from 'vue';
import Notice from './index.vue';

const NoticeConstructor = Vue.extend(Notice);

let instance;

const $notice = function ({
  type,
  title,
  render,
  subRender,
  data = {},
  methods = {}
}) {
  instance = new NoticeConstructor({
    data: {
      ...data,
      type,
      title
    },
    methods: {
      ...methods,
      render,
      subRender
    }
  });

  instance.$mount();

  const el = document.querySelector('.vcom-notice-box'),
    elBox = document.createElement('div');

  if (!el) {
    elBox.className = 'vcom-notice-box';
    elBox.style.position = 'fixed';
    elBox.style.top = '0';
    elBox.style.right = '0';
    elBox.style.height = '100%';
    elBox.style.zIndex = '9999';
    elBox.style.paddingTop = '60px';
    document.body.append(elBox);
  }

  (el || elBox).appendChild(instance.$el);

  return instance;
};

export default $notice;

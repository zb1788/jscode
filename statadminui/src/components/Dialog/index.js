/*
 * @Author: your name
 * @Date: 2020-04-28 19:05:39
 * @LastEditTime: 2020-04-29 17:47:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\src\components\Dialog\index.js
 */
import Vue from 'vue';
import Dialog from './index.vue';

let DialogConstructor = Vue.extend(Dialog),

  instance;

const $Dialog = function (options) {
  const {
    components,
    data,
    width,
    render = () => { return {}; },
    renderHeader = () => { return {}; },
    renderFooter = () => { return {}; },
    methods = {},
    ...others
  } = options || {};

  instance = new DialogConstructor({
    data: {
      ...(data || {}),
      width
    },
    components,
    ...others,
    methods: { ...{ render, renderHeader, renderFooter }, ...methods }
  });

  instance.$mount();

  document.body.appendChild(instance.$el);

  return instance;
};

export default $Dialog;

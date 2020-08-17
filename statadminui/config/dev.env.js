/*
 * @Author: your name
 * @Date: 2020-04-28 13:23:40
 * @LastEditTime: 2020-04-29 19:39:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\config\dev.env.js
 */
'use strict';
const merge = require('webpack-merge'),
  prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_BASE_URL: '"/"',
  VUE_APP_DOWNLOAD_URL: '"http://vfsvcomyf.czbanbantong.com"',
  VUE_APP_UPLOAD_URL: '"/upfile/upload.call"',
  PUBLIC_PATH: '"/"'
});

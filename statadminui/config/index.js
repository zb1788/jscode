/*
 * @Author: your name
 * @Date: 2020-04-28 13:23:40
 * @LastEditTime: 2020-05-07 13:11:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\config\index.js
 */
'use strict';
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path'),
  wProject = require('./project');

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: `/${wProject.assetsPublicPath}/`,
    proxyTable: {
      ...[
        ["/ucsapi","http://centeryf.czbanbantong.com/gw/"],
        ["/config","http://vcomyf.czbanbantong.com/gw/ucsapi/"],
        ["/uconfig","http://vcomyf.czbanbantong.com/gw/baseapi/"],
        ["/auth","http://vcomyf.czbanbantong.com/gw/ucsapi/"],
        ["/cfg","http://vcomyf.czbanbantong.com/gw/ucsapi/"],
        ["/sch","http://vcomyf.czbanbantong.com/gw/ucsapi/"],
        ["/sys","http://vcomyf.czbanbantong.com/gw/ucsapi/"],
        ["/pbs","http://vcomyf.czbanbantong.com/gw/ucsapi/"],
        ["/captcha","http://vcomyf.czbanbantong.com/gw/ucsapi/"],
        ["/sms","http://vcomyf.czbanbantong.com/gw/ucsapi/"],
        ["/sso","http://vcomyf.czbanbantong.com/gw/ucsapi/"],
        ["/log","http://vcomyf.czbanbantong.com/gw/ucsapi/"],
        ["/upfile","http://vfsvcomyf.czbanbantong.com:8080"],
        ["/api","http://vcomyf.czbanbantong.com/gw/ucsapi/"],
        ["/tms","http://vcomyf.czbanbantong.com/node/tmsapi/"],
        ["/statmanage","http://vcomyf.czbanbantong.com/gw/stat"],
        ["/statdata","http://vcomyf.czbanbantong.com/gw/stat"]     
     ].reduce((result, [key, url]) => {
        result[`${key}/`] = {
          target: url,
          changeOrigin: true,
          pathRewrite: {
            [`^${key}/`]: `${key}/`
          }
        }
        return result
      }, {})
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/' + wProject.projectName + '/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist/' + wProject.projectName),
    assetsSubDirectory: 'static',
    assetsPublicPath: `/${wProject.assetsPublicPath}/`,

    // 运行环境
    assetsWPath: path.resolve(__dirname, '../dist/' + wProject.assetsPublicPath),

    /**
     * Source Maps
     * 是否生成源码map，正式包发布配置为此处配置为false
     */
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
};

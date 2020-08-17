'use strict';
const packageJson = require('../package'),
  version = packageJson.version;
let versionStr = version.substring(0, version.indexOf('.', version.indexOf('.') + 1));
module.exports = {
  projectName: `${packageJson.name}_${versionStr}`, // 打包项目的文件夹名称
  assetsPublicPath: 'baseui' // 项目运行的根path
};

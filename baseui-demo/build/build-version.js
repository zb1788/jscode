const fs = require('fs'),
  path = require('path'),
  packageJson = require('../package'),
  config = require('../config');

function buildVersion () {
  const versionJson = {
    appName: packageJson.name,
    version: packageJson.version
  };
  let versionStr = '[VERSION]';
  Object.keys(versionJson).forEach(key => {
    versionStr += (`\n${key}=${versionJson[key]}`)
  });
  fs.writeFileSync(path.join(config.build.assetsRoot, 'version.ini'), versionStr);
}

module.exports = buildVersion;

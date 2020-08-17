var fse = require('fs-extra');
fse.copySync('./src/config/prod.js','./src/config/index.js');

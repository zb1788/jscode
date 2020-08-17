#! /usr/bin/env node

var path = require('path');
var pkg = require('./package.json');

var license = [
    '// VCom SDK for JavaScript v' + pkg.version
].join('\n') + '\n';

function build(options, callback) {
    if (arguments.length === 1) {
        callback = options;
        options = {};
    }

    console.error('Building with options: %j', options);

    var browserify = require('browserify');
    // var aliasify = require('aliasify');
    var babelify = require('babelify');


    browserify({
            // debug: true,
            insertGlobals: true,
            basedir: path.resolve(__dirname, '.'),
            fullPaths: false,
            standalone: '__VAE__'
        })
        .add(['./src/config/index.js','./src/function/addr.js','./src/function/userAgent.js','./src/function/uuid.js','./src/handler/event.js','./src/function/userAgent.js'])
        .transform(babelify, {
            "global": true,
            "presets": ["@babel/preset-env"],
            "plugins": [
                "@babel/plugin-transform-object-assign",
                "@babel/plugin-transform-runtime"
            ],
            "only": ['src/*'],
        })
        // .transform(aliasify, {
        //     global: true,
        //     aliases: {
        //         'zlib': false,
        //         'iconv-lite': false,
        //         'crypto': './shims/crypto.js',
        //     },
        //     verbose: false
        // })
        .bundle(function (err, data) {
            if (err) return callback(err);
            var code = (data || '').toString();
            if (options.minify) {
                var uglify = require('uglify-js');
                var minified = uglify.minify(code, {
                    // fromString: true // 新版本没有这个属性
                });
                // console.error(JSON.stringify(minified));
                code = minified.code;
            }
            code = license + code;
            callback(null, code);
        });
}

// run if we called this tool directly
if (require.main === module) {
    var opts = {
        minify: process.env.MINIFY ? true : false
    };

    build(opts, function (err, code) {
        if (err) console.error(err.message);
        else console.log(code);
    });
}

module.exports = build;
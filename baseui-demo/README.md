# baseui

> A base Vue.js ui project

> tomcat版

## Build Setup

``` bash

# async load files dependencides library

npm install -D @babel/plugin-syntax-dynamic-import

# api require load axios library

cnpm i -S axios

# 每次构建前清理 /dist 文件夹 clean-webpack-plugin

cnpm install clean-webpack-plugin --save-dev

# install dependencies

npm install

# vue jest plugin: @vue/test-utils

npm install -D @vue/test-utils

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
#此版本为tomcat部署版
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# directory Instructions

## config directory

### index.js

```

//指定项目名，项目访问和打包文件夹名称
process.projectName = "baseui";

```

## static directory

- 存放静态的样式

- 存放样式所有要的图片

- 不需要编译的js文件

## src

###  assets directory

- 存放动态使用的图片

- 存放公用样式文件或其它静态资源（需要进行编译的）
 
### components directory

- 按照模块创建目录存放vue文件

### router directory

- 配置项目访问路径

### pages directory

- 用于放置页面文件

### model directory

- 放置数据模型，后端的数据和前端生成的数据在页面中交互统一使用此模型对数据进行包装，以保证前端数据交互的一致性

### store directory

- vuex store全局状态管理

### utils directory

- 工具类js文件

### main.js

> 此文件为私有文件，不允许修改

 

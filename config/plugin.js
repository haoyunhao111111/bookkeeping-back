'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  ejs: {
    enable: true,
    package: 'egg-view-ejs' // npm i egg-view-ejs --save 渲染html
  },
  mysql: {
    enable: true,
    package: 'egg-mysql' // npm i egg-mysql 连接数据库
  },
  jwt: {
    enable: true,
    package: 'egg-jwt' // npm i egg-jwt -S  用户鉴权
  },
  cors: { // npm i egg-cors -S  解决跨域问题
    enable: true,
    package: 'egg-cors',
  },
};

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
  }
};

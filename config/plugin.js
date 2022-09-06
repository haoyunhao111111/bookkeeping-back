'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  ejs: {
    enable: true,
    package: 'egg-view-ejs' // npm i egg-view-ejs --save
  },
  mysql: {
    enable: true,
    package: 'egg-mysql' // npm i egg-mysql
  }
};

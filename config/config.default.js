/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  /** 配置跨域白名单 */
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ["*"]
  }
  /** 配置模板渲染 */
  config.view = {
    mapping: {'.html': 'ejs'}
  }
  /** 配置mysql链接 */
  config.mysql = {
    client: {
      host: '81.70.63.38',
      port: '3306',
      user: 'root',
      password: 'Hyh123456.',
      database: 'cost_server'
    },
    app: true,
    agent: false
  }

  config.jwt = {
    secret: 'Nick'
  }
  config.multipart = {
    mode: 'file'
  }
  config.cors = {
    origin: '*', // 允许所有跨域访问
    credentials: true, // 允许 Cookie 跨域跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    uploadDir: 'app/public/upload'
  };

  return {
    ...config,
    ...userConfig,
  };
};

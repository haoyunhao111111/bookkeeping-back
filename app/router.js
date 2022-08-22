'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/list/:page/:size', controller.home.list);
  router.get('/getTitle', controller.home.getTitle);
  router.post('/add', controller.home.add);
};
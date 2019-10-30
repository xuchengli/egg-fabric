'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/channel/create', controller.channel.create);
};

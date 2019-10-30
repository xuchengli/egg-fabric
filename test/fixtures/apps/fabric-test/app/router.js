'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.post('/user/register', controller.user.register);
  router.get('/channel/create', controller.channel.create);
};

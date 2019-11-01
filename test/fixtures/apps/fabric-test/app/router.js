'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.post('/user/enroll', controller.user.enroll);
  router.post('/channel/create', controller.channel.create);
};

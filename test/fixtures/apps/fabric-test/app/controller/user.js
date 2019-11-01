'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async enroll() {
    const { ctx, app } = this;
    const { username } = ctx.request.body;

    ctx.body = await app.fabric.ca.getRegisteredUser(username);
  }
}

module.exports = UserController;

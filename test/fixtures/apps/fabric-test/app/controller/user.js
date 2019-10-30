'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async register() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;

    ctx.body = await app.fabric.user.register(username, password);
  }
}

module.exports = UserController;

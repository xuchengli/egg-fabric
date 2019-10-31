'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async register() {
    const { ctx, app } = this;
    const { username, password, role, attrs } = ctx.request.body;

    ctx.body = await app.fabric.user.register(username, password, role, attrs);
  }
  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;

    ctx.body = await app.fabric.user.login(username, password);
  }
}

module.exports = UserController;

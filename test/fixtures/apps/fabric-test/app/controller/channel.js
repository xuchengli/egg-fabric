'use strict';

const path = require('path');
const Controller = require('egg').Controller;

class ChannelController extends Controller {
  async create() {
    const { ctx, app } = this;
    const { username, channelname } = ctx.request.body;

    const channelTx = path.join(app.baseDir, 'fabric-network/config/channel.tx');
    ctx.body = app.fabric.channel.create(channelname, channelTx, username);
  }
}

module.exports = ChannelController;

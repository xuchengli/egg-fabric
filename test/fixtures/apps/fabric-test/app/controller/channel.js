'use strict';

const path = require('path');
const Controller = require('egg').Controller;

class ChannelController extends Controller {
  async create() {
    const { ctx, app } = this;
    const { channelname } = ctx.request.body;

    const channelTx = path.join(app.baseDir, 'fabric-network/config/channel.tx');
    ctx.body = await app.fabric.channel.create(channelname, channelTx);
  }
}

module.exports = ChannelController;

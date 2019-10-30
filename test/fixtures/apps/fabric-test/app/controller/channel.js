'use strict';

const path = require('path');
const Controller = require('egg').Controller;

class ChannelController extends Controller {
  async create() {
    const { ctx, app } = this;

    const channelTx = path.join(app.baseDir, 'fabric-network/config/channel.tx');
    ctx.body = app.fabric.channel.create('mychannel', channelTx);
  }
}

module.exports = ChannelController;

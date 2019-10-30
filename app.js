'use strict';

const hfc = require('fabric-client');
const User = require('./lib/user');
const Channel = require('./lib/channel');
const ChainCode = require('./lib/chaincode');

module.exports = app => {
  app.addSingleton('fabric', async (config, app) => {
    const networkConfig = config['network-config'];
    app.coreLogger.info('[egg-fabric] network config: %j', networkConfig);

    hfc.setConfigSetting('network-connection-profile', networkConfig);

    const user = new User(app);
    const channel = new Channel(app);
    const chaincode = new ChainCode(app);

    return { user, channel, chaincode };
  });
};

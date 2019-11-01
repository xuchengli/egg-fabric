'use strict';

const hfc = require('fabric-client');
const CA = require('./lib/ca');
const Channel = require('./lib/channel');
const ChainCode = require('./lib/chaincode');

module.exports = app => {
  app.addSingleton('fabric', async (config, app) => {
    const networkConfig = config['network-config'];
    app.coreLogger.info('[egg-fabric] network config: %j', networkConfig);

    hfc.setConfigSetting('network-connection-profile', networkConfig);

    const ca = new CA(app);
    const channel = new Channel(app);
    const chaincode = new ChainCode(app);

    return { ca, channel, chaincode };
  });
};

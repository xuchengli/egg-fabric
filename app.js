'use strict';

const hfc = require('fabric-client');
const ChainCode = require('./lib/chaincode');
const Channel = require('./lib/channel');

module.exports = app => {
  app.addSingleton('fabric', async (config, app) => {
    const networkConfig = config['network-config'];
    app.coreLogger.info('[egg-fabric] network config: %j', networkConfig);

    hfc.setConfigSetting('network-connection-profile', networkConfig);

    const channel = new Channel(app);
    const chaincode = new ChainCode(app);

    return { channel, chaincode };
  });
};

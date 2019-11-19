'use strict';

const hfc = require('fabric-client');
const CA = require('./lib/ca');
const Channel = require('./lib/channel');
const ChainCode = require('./lib/chaincode');

module.exports = app => {
  app.addSingleton('fabric', async (config, app) => {
    const networkConfig = config['network-config'];
    app.coreLogger.info('[egg-fabric] network config: %j', networkConfig);

    // build a client context and load it with a connection profile
    const client = hfc.loadFromConfig(networkConfig);

    // this will create both the state store and the crypto store based
    // on the settings in the client section of the connection profile
    await client.initCredentialStores();

    const ca = new CA(app, client);
    const channel = new Channel(app, client);
    const chaincode = new ChainCode(app, client);

    return { ca, channel, chaincode };
  });
};

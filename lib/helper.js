'use strict';

const hfc = require('fabric-client');

async function getClient(username) {
  // build a client context and load it with a connection profile
  const client = hfc.loadFromConfig(hfc.getConfigSetting('network-connection-profile'));

  // this will create both the state store and the crypto store based
  // on the settings in the client section of the connection profile
  await client.initCredentialStores();

  // The getUserContext call tries to get the user from persistence.
  // If the user has been saved to persistence then that means the user has
  // been registered and enrolled. If the user is found in persistence
  // the call will then assign the user to the client object.
  if (username) {
    const user = await client.getUserContext(username, true);
    if (!user) {
      throw new Error(`User was not found: ${username}`);
    }
  }
  return client;
}
exports.getClient = getClient;

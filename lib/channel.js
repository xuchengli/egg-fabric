'use strict';

const fs = require('fs');
const helper = require('./helper');

class Channel {
  constructor(app) {
    this.app = app;
  }
  async create(channelName, channelTx, username) {
    try {
      const client = await helper.getClient(username);

      // read in the envelope for the channel config raw bytes
      const envelope = fs.readFileSync(channelTx);
      // extract the channel config bytes from the envelope to be signed
      const channelConfig = client.extractChannelConfig(envelope);
      // Acting as a client in the given organization provided with "orgName" param
      // sign the channel config bytes as "endorsement", this is required by
      // the orderer's channel creation policy
      // this will use the admin identity assigned to the client when the connection profile was loaded
      const signature = client.signChannelConfig(channelConfig);

      const request = {
        config: channelConfig,
        signatures: [ signature ],
        name: channelName,
        txId: client.newTransactionID(true),
      };
      // send to orderer
      const response = await client.createChannel(request);

      this.app.coreLogger.info('[egg-fabric] Create channel response: %j', response);

      if (!response || response.status !== 'SUCCESS') {
        throw new Error(`Failed to create the channel ${channelName}`);
      }
      return {
        success: true,
        message: `Channel ${channelName} created Successfully`,
      };
    } catch (err) {
      throw new Error(err.toString());
    }
  }
}
module.exports = Channel;

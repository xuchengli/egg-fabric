'use strict';

const fs = require('fs');

class Channel {
  constructor(app, client) {
    this.app = app;
    this.client = client;
  }
  async create(channelName, channelTx) {
    try {
      // read in the envelope for the channel config raw bytes
      const envelope = fs.readFileSync(channelTx);
      // extract the channel config bytes from the envelope to be signed
      const channelConfig = this.client.extractChannelConfig(envelope);
      // Acting as a client in the given organization provided with "orgName" param
      // sign the channel config bytes as "endorsement", this is required by
      // the orderer's channel creation policy
      // this will use the admin identity assigned to the client when the connection profile was loaded
      const signature = this.client.signChannelConfig(channelConfig);

      const request = {
        config: channelConfig,
        signatures: [ signature ],
        name: channelName,
        txId: this.client.newTransactionID(true),
      };
      // send to orderer
      const response = await this.client.createChannel(request);

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

'use strict';

class ChainCode {
  constructor(app, client) {
    this.app = app;
    this.client = client;
  }
  /*
  async invoke(chaincodeName, functionName, args, username) {
    try {
      const client = await helper.getClient(username);

      const channel = client.getChannel();
      const txId = client.newTransactionID(true);
      const invokeId = txId.getTransactionID();

      const request = {
        chaincodeId: chaincodeName,
        fcn: functionName,
        args,
        txId,
      };
      const results = await channel.sendTransactionProposal(request, 60000);
      // the returned object has both the endorsement results
      // and the actual proposal, the proposal will be needed
      // later when we send a transaction to the orderer
      const proposalResponses = results[0];
      const proposal = results[1];

      const result = proposalResponses.map(res => {
        return res && res.response && res.response.status === 200;
      }).every(res => res);
      if (!result) {
        const errors = proposalResponses.map(res => res.details || res.toString());
        throw new Error([ ...new Set(errors) ]);
      }
      this.app.coreLogger.info('[egg-fabric] Successfully sent Proposal and received ProposalResponse: ' +
        `Status - ${proposalResponses[0].response.status}, ` +
        `message - ${proposalResponses[0].response.message}, ` +
        `metadata - ${proposalResponses[0].response.payload}, ` +
        `endorsement signature: ${proposalResponses[0].endorsement.signature}`);
      // wait for the channel-based event hub to tell us that
      // the commit was good or bad on each peer in our organization
      const promises = [];
      const eventHubs = channel.getChannelEventHubsForOrg();
      eventHubs.forEach(eh => {
        const eventPromise = new Promise((resolve, reject) => {
          const eventTimeout = setTimeout(() => { eh.disconnect(); }, 10000);
          eh.registerTxEvent(invokeId, (tx, code) => {
            clearTimeout(eventTimeout);
            if (code !== 'VALID') {
              reject(new Error(`The invoke chaincode transaction was invalid, code: ${code}`));
            } else {
              resolve('The invoke chaincode transaction was valid.');
            }
          }, err => {
            clearTimeout(eventTimeout);
            reject(err);
          }, { unregister: true, disconnect: false });
          eh.connect();
        });
        promises.push(eventPromise);
      });
      const ordererRequest = {
        txId,
        proposalResponses,
        proposal,
      };
      const sendPromise = channel.sendTransaction(ordererRequest);
      // put the send to the orderer last so that the events get
      // registered and are ready for the orderering and committing
      promises.push(sendPromise);
      const responses = await Promise.all(promises);
      this.app.coreLogger.info('[egg-fabric] ------->>> R E S P O N S E : %j', responses);

      // orderer results are last in the responses
      const response = responses.pop();
      if (response.status !== 'SUCCESS') {
        const errorMessage = `Failed to order the transaction. Error code: ${response.status}`;
        throw new Error(errorMessage);
      }
      // now see what each of the event hubs reported
      responses.forEach(res => {
        if (typeof res !== 'string') {
          throw new Error(res.toString());
        }
      });
      return {
        success: true,
        message: `Successfully invoked the chaincode to the channel ${channel.getName()}.`,
        txId: invokeId,
        payload: Buffer.from(proposalResponses[0].response.payload).toString(),
      };
    } catch (err) {
      throw new Error(err.toString());
    }
  }
  async query(chaincodeName, functionName, args, username) {
    try {
      const client = await helper.getClient(username);

      const channel = client.getChannel();
      const request = {
        chaincodeId: chaincodeName,
        fcn: functionName,
        args,
      };
      const responses = await channel.queryByChaincode(request, true);
      if (!responses.every(res => Buffer.isBuffer(res))) {
        const errors = responses.map(res => res.details || res.toString());
        throw new Error([ ...new Set(errors) ]);
      }
      const result = responses.map(res => res.toString('utf8'));
      return {
        success: true,
        payloads: [ ...new Set(result) ].map(res => {
          try {
            return JSON.parse(res);
          } catch (err) {
            return res;
          }
        }),
      };
    } catch (err) {
      throw new Error(err.toString());
    }
  }
  */
}
module.exports = ChainCode;

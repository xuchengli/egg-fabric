'use strict';

class CA {
  constructor(app, client) {
    this.app = app;
    this.client = client;
  }
  async getRegisteredUser(username) {
    try {
      // client can now act as an agent for organization
      // first check to see if the user is already enrolled
      let user = await this.client.getUserContext(username, true);

      if (!user || !user.isEnrolled()) {
        const caClient = this.client.getCertificateAuthority();

        // user was not enrolled, so we will need an admin user object to register
        const registrar = caClient.getRegistrar();
        if (!registrar || !registrar.length) {
          throw new Error('Registrar was not found.');
        }
        const adminUserObj = await this.client.setUserContext({
          username: registrar[0].enrollId,
          password: registrar[0].enrollSecret,
        });

        const secret = await caClient.register({
          enrollmentID: username,
          affiliation: this.client.getClientConfig().organization.toLowerCase(),
        }, adminUserObj);
        this.app.coreLogger.info('[egg-fabric] Successfully got the secret for user %s', username);

        user = await this.client.setUserContext({ username, password: secret });
        this.app.coreLogger.info('[egg-fabric] Successfully enrolled username %s and setUserContext on the client object', username);
      }
      if (!user || !user.isEnrolled()) {
        throw new Error('User was not enrolled');
      }
      const { enrollment: { signingIdentity, identity: { certificate } } } = JSON.parse(user.toString());
      const res = { signingIdentity, certificate };

      const cryptoSuite = user.getCryptoSuite();
      const key = await cryptoSuite.getKey(signingIdentity);

      return Object.assign(res, {
        privateKey: key.toBytes(),
        publicKey: key.getPublicKey().toBytes(),
      });
    } catch (err) {
      throw new Error(err.toString());
    }
  }
}
module.exports = CA;

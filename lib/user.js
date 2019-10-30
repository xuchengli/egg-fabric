'use strict';

const helper = require('./helper');

class User {
  constructor(app) {
    this.app = app;
  }
  async register(username, password) {
    try {
      const client = await helper.getClient();

      // client can now act as an agent for organization Org1
      // first check to see if the user is already enrolled
      let user = await client.getUserContext(username, true);

      if (!user || !user.isEnrolled()) {
        // user was not enrolled, so we will need an admin user object to register
        this.app.coreLogger.info('User %s was not enrolled, so we will need an admin user object to register', username);

        const caClient = client.getCertificateAuthority();
        const registrar = caClient.getRegistrar();
        if (!registrar || !registrar.length) {
          throw new Error('Registrar was not found.');
        }
        const adminUserObj = await client.setUserContext({
          username: registrar[0].enrollId,
          password: registrar[0].enrollSecret,
        });

        const secret = await caClient.register({
          enrollmentID: username,
          enrollmentSecret: password,
          affiliation: client.getClientConfig().organization.toLowerCase(),
        }, adminUserObj);
        this.app.coreLogger.info('Successfully got the secret for user %s', username);

        user = await client.setUserContext({
          username,
          password: secret,
        });
        this.app.coreLogger.info('Successfully enrolled username %s and setUserContext on the client object', username);
      }
      if (!user || !user.isEnrolled()) {
        throw new Error('User was not enrolled');
      }
      return {
        success: true,
        secret: user._enrollmentSecret,
        message: username + ' enrolled Successfully',
      };
    } catch (err) {
      throw new Error(err.toString());
    }
  }
}
module.exports = User;

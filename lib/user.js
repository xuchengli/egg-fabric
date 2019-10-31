'use strict';

const helper = require('./helper');

class User {
  constructor(app) {
    this.app = app;
  }
  async register(username, password, role = '', attrs = []) {
    try {
      const client = await helper.getClient();

      const caClient = client.getCertificateAuthority();
      const registrar = caClient.getRegistrar();
      if (!registrar || !registrar.length) {
        throw new Error('Registrar was not found.');
      }
      const adminUserObj = await client.setUserContext({
        username: registrar[0].enrollId,
        password: registrar[0].enrollSecret,
      });

      await caClient.register({
        enrollmentID: username,
        enrollmentSecret: password,
        role,
        affiliation: client.getClientConfig().organization.toLowerCase(),
        maxEnrollments: -1,
        attrs,
      }, adminUserObj);
      this.app.coreLogger.info('Successfully registered username %s', username);

      return {
        success: true,
        message: username + ' registered Successfully',
      };
    } catch (err) {
      throw new Error(err.toString());
    }
  }
  async login(username, password) {
    try {
      const client = await helper.getClient();

      const caClient = client.getCertificateAuthority();
      const enrollment = await caClient.enroll({
        enrollmentID: username,
        enrollmentSecret: password,
      });

      const mspid = client.getMspid();
      if (!mspid) {
        throw new Error('Common connection profile is missing this client\'s organization and mspid');
      }
      const cryptoContent = { signedCertPEM: enrollment.certificate };
      let keyBytes = null;
      try {
        keyBytes = enrollment.key.toBytes();
      } catch (err) {
        throw new Error('Cannot access enrollment private key bytes');
      }
      if (keyBytes !== null && keyBytes.startsWith('-----BEGIN')) {
        cryptoContent.privateKeyPEM = keyBytes;
      } else {
        cryptoContent.privateKeyObj = enrollment.key;
      }

      const user = await client.createUser({
        username,
        mspid,
        cryptoContent,
      });
      this.app.coreLogger.info('Successfully enrolled username %s and setUserContext on the client object', username);

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
module.exports = User;

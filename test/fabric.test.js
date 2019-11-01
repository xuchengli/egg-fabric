'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('====> test/fabric.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/fabric-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('POST lixuc to /user/enroll', async () => {
    app.mockCsrf();
    const result = await app.httpRequest()
      .post('/user/enroll')
      .type('form')
      .send({
        username: 'lixuc',
      })
      .expect(200);
    assert(result.body.signingIdentity && result.body.certificate && result.body.publicKey && result.body.privateKey);
  });

  it('POST mychannel to /channel/create', async () => {
    app.mockCsrf();
    await app.httpRequest()
      .post('/channel/create')
      .type('form')
      .send({
        username: 'lixuc',
        channelname: 'mychannel',
      })
      .expect(200)
      .expect({
        success: true,
        message: 'Channel mychannel created Successfully',
      });
  });
});

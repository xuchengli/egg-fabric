'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('====> test/login.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/fabric-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('POST xiaoming to /user/register, then POST to /user/login', async () => {
    app.mockCsrf();
    await app.httpRequest()
      .post('/user/register')
      .type('form')
      .send({
        username: 'xiaoming',
        password: 'pass',
      })
      .expect(200)
      .expect({
        success: true,
        message: 'xiaoming registered Successfully',
      });
    const result = await app.httpRequest()
      .post('/user/login')
      .type('form')
      .send({
        username: 'xiaoming',
        password: 'pass',
      })
      .expect(200);
    assert(result.body.signingIdentity && result.body.certificate && result.body.publicKey && result.body.privateKey);
  });

  it('POST xiaoming with wrong password to /user/login again, should throw error.', async () => {
    app.mockCsrf();
    const result = await app.httpRequest()
      .post('/user/login')
      .type('form')
      .send({
        username: 'xiaoming',
        password: 'passw0rd',
      })
      .expect(500);
    assert(result.text.includes('Authentication failure'));
  });

  it('POST not existed user [wang] to /user/login, should throw error.', async () => {
    app.mockCsrf();
    const result = await app.httpRequest()
      .post('/user/login')
      .type('form')
      .send({
        username: 'wang',
        password: 'pass',
      })
      .expect(500);
    assert(result.text.includes('Authentication failure'));
  });
});

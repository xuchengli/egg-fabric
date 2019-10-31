'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('====> test/register.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/fabric-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('POST lixuc to /user/register', async () => {
    app.mockCsrf();
    await app.httpRequest()
      .post('/user/register')
      .type('form')
      .send({
        username: 'lixuc',
        password: 'pass',
        role: 'admin, general user, reporter',
        attrs: [{ name: 'foo', value: 'bar' }, { name: 'fzz', value: 'baz' }],
      })
      .expect(200)
      .expect({
        success: true,
        message: 'lixuc registered Successfully',
      });
  });

  it('POST lixuc to /user/register again, should throw error', async () => {
    app.mockCsrf();
    const result = await app.httpRequest()
      .post('/user/register')
      .type('form')
      .send({
        username: 'lixuc',
        password: 'pass',
      })
      .expect(500);
    assert(result.text.includes('Identity \'lixuc\' is already registered'));
  });

  it('POST admin to /user/register, should also throw error', async () => {
    app.mockCsrf();
    const result = await app.httpRequest()
      .post('/user/register')
      .type('form')
      .send({
        username: 'admin',
        password: 'adminpw',
      })
      .expect(500);
    assert(result.text.includes('Identity \'admin\' is already registered'));
  });

  it('POST new user [foo] to /user/register, should success', async () => {
    app.mockCsrf();
    await app.httpRequest()
      .post('/user/register')
      .type('form')
      .send({
        username: 'foo',
        password: 'pass',
      })
      .expect(200)
      .expect({
        success: true,
        message: 'foo registered Successfully',
      });
  });
});

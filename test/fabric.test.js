'use strict';

const mock = require('egg-mock');

describe('test/fabric.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/fabric-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /channel/create', () => {
    return app.httpRequest()
      .get('/channel/create')
      .expect('hi, fabric')
      .expect(200);
  });
});

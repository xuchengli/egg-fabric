'use strict';

const path = require('path');

module.exports = appInfo => {
  return {
    keys: '123456',
    fabric: {
      client: {
        'network-config': path.join(appInfo.baseDir, 'fabric-network/connection.yaml'),
      },
    },
  };
};

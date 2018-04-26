'use strict';

const prodConfig = {
  hostname: 'localhost',
  port: 3000,
  database: 'mongodb://localhost/inproxi-production',
  jwt: {
    secret: 'passphrase'
  }
};

module.exports = prodConfig

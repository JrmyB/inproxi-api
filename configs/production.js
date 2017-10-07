'use strict';

const prodConfig = {
  hostname: 'localhost',
  port: 3000,
  database: 'mongodb://localhost/inproxi-production',
  jwt: {
    secret: 'pssphrs'
  }
};

module.exports = prodConfig

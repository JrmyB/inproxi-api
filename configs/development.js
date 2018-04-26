'use strict'

var devConfig = {
    hostname: 'localhost',
    port: 3001,
    database: 'mongodb://localhost/inproxi-development',
    jwt: {
	secret: 'passphrase'
    }
};

module.exports = devConfig

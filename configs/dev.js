'use strict'

var devConfig = {
    hostname: 'localhost',
    port: 3000,
    database: 'mongodb://localhost/inproxi',
    jwt: {
	secret: 'pssphrs'
    }
};

module.exports = devConfig

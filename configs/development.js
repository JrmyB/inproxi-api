'use strict'

var devConfig = {
    hostname: 'localhost',
    port: 3001,
    database: 'mongodb://localhost/inproxi-development',
    jwt: {
	secret: 'pssphrs'
    }
};

module.exports = devConfig

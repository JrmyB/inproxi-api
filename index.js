'use strict'

const server = require('./server')
const config = require('./configs')
const debug = require('debug')('http')

server.create(config)
  .then(server.start())
  .catch(err => { throw(err) })

// Debugging unhandled rejections promises
process.on('unhandledRejection', (reason, p) => {
  console.err('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
})

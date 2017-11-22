'use strict'

const server = require('./server')
const config = require('./configs')

const Chat = require('./server/io')

server.create(config)
  .then(server.start())
  .catch(err => { throw(err) })

// Debugging unhandled rejections promises
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
})

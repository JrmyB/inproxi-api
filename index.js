'use strict'

const server = require('./server')
const config = require('./configs')

server.create(config)
  .then(server.start())
  .catch(err => { throw(err) })

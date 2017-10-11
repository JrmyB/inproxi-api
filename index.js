'use strict'

const server = require('./server')
const config = require('./configs')

Promise.all([
  server.create(config),
  server.start()
]).catch(err => { throw(err) })

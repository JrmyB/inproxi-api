'use strict'

const
    v1ApiController = require('./v1')

const init = (server) => {
  server.use('/v1', v1ApiController)
}

module.exports = { init: init }

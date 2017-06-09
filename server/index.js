'use strict'

const
    express = require ('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose')

module.exports = function() {
  let server = express()

  const create = (config) => {
    let routes = require('./routes')

    // Settings
    server.set('env', config.env)
    server.set('port', config.port)
    server.set('hostname', config.hostname)
    server.set('dbName', config.dbName)

    // Middleware that parses json
    server.use(bodyParser.json())

    // Set up routes
    routes.init(server)
  }

  const start = () => {
    let hostname = server.get('hostname')
    let port = server.get('port')
    let dbName = server.get('dbName')

    // TODO: Connection to database
    mongoose.connect('mongodb://' + hostname + '/' + dbName)

    server.listen(port, () => {
      console.log('Magic happens on - http://' + hostname + ':' + port)
    })
  }

  return {
    create: create,
    start: start
  }
}

// // Middleware
// // errorhandler?
// server.use(bodyParser.urlencoded({ extended: true }))
// server.use(bodyParser.json())
// server.use((req, res, next) => {
//    const ip = req.headers['x-forwared-for'] || req.connection.remoteAddress
//    console.log(req.method + ' from ' + ip)
//   next()
// })

// // Route Middleware
// routes.use((req, res, next) => {
//   // logging here or in Middleware?
//   next()
// })

// server.use('/api', routes)

// server.listen(port, () => {
//   console.log('Magic happens on port ' + port)
// })

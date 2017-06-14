'use strict'

const
    express = require ('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    session = require('express-session'),
    passport = require('passport'),
    MongoStore = require('connect-mongo')(session)

module.exports = function() {
  let server = express()

  const create = (config) => {
    let routes = require('./routes')

    // Settings
    server.set('env', config.env)
    server.set('port', config.port)
    server.set('hostname', config.hostname)
    server.set('database', config.database)

    // Middlewares
    server.use(bodyParser.urlencoded({ extended: true }))
    server.use(bodyParser.json())

    // server.use(session({
    //   name: 'inproxi-cookie',
    //   secret: 'ixi',
    //   store: new MongoStore({ url: config.database }),
    //   resave: false, // don't save session if unmodified
    //   saveUninitialized: false // don't create session until something stored
    // }))

    // server.use(passport.initialize())
    // server.use(passport.session())

    if (config.env == 'dev')
      server.use(morgan('dev'))

    // Set up routes
    routes.init(server)
  }

  const start = () => {
    let hostname = server.get('hostname')
    let port = server.get('port')
    let database = server.get('database')

    // Connection to db
    mongoose.connect(database, (err) => {
      if (err) throw err;
    })

    server.listen(port, () => {
      console.log('Magic happens on - http://' + hostname + ':' + port)
    })
  }

  return {
    create: create,
    start: start
  }
}

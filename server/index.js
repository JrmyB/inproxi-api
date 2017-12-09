'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const io = require('./io')
const debug = require('debug')('server')

let app = express()
let server = require('http').Server(app)

const create = config => new Promise(resolve => {
  const routes = require('./routes');

  debug('Loading configuration')
  
  // Settings
  app.set('env', config.env);
  app.set('port', config.port);
  app.set('hostname', config.hostname);
  app.set('database', config.database);

  // Middlewares
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  const allowCrossDomain = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    req.method === 'OPTIONS'
      ? res.sendStatus(200)
      : next()
  };

  app.use(allowCrossDomain);

  debug('Routes initialization')
  routes.init(app)   // Set up routes

  debug('RTM initialization')
  io.init(server) // Set up chat
  
  resolve()
})

const start = () => new Promise((resolve, reject) => {
  const hostname = app.get('hostname')
  const port = app.get('port')
  const database = app.get('database')

  debug('Database connection')
  mongoose.connect(database, err => {
    if (err) reject(err)
  })

  server.listen(port, () => {
    debug('Listening on port %o', port)

    debug('Starting RTM service')
    io.start() // Start chat

    resolve()
  })
})

module.exports = {
  create: create,
  start: start
}

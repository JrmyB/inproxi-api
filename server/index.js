'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const io = require('./io')

let app = express()
let server = require('http').Server(app)

const create = config => new Promise(resolve => {
  const routes = require('./routes');
  
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
//  app.use(morgan('dev')) // Logger
  routes.init(app)   // Set up routes
  io.init(server) // Set up chat
  resolve()
})

const start = () => new Promise((resolve, reject) => {
  const hostname = app.get('hostname')
  const port = app.get('port')
  const database = app.get('database')

  mongoose.connect(database, err => {
    if (err) reject(err)
  })

  server.listen(port, () => {
    console.log('INPROXI API (PORT: ' + port
		+ ', ENV: ' + process.env.NODE_ENV + ') listening ...');
    
    io.start() // Start chat
    resolve()
  })
})

module.exports = {
  create: create,
  start: start
}

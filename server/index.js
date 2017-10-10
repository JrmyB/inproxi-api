'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const io = require('./io')

module.exports = function() {
  let app = express();
  let server = require('http').Server(app)
  
  const create = (config) => {
    let routes = require('./routes');
    
    // Settings
    app.set('env', config.env);
    app.set('port', config.port);
    app.set('hostname', config.hostname);
    app.set('database', config.database);

    // Middlewares
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    let allowCrossDomain = (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

      req.method === 'OPTIONS'
	? res.send(200)
	: next();
    };

    app.use(allowCrossDomain);

    // Logger
    if (config.env == 'dev')
      app.use(morgan('dev'))
    
    // Set up routes
    routes.init(app)

    // Set up chat
    io.init(server)
  }

  const start = () => {
    let hostname = app.get('hostname')
    let port = app.get('port')
    let database = app.get('database')

    // Connection to db
    mongoose.connect(database, (err) => {
      if (err) throw err;
    })

    // Start server
    server.listen(port, () => {
      console.log('\x1b[31m', 'INPROXI API listening...');
      console.log('\x1b[31m', 'PORT: ' + port + ', ENV: ' + process.env.NODE_ENV);
      console.log('\x1b[0m');
		  
      // Start chat
      io.start()
    })

  }

  return {
    create: create,
    start: start
  }
}

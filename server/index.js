'use strict';

const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

module.exports = function() {
    let server = express();

    const create = (config) => {
	let routes = require('./routes');

	// Settings
	server.set('env', config.env);
	server.set('port', config.port);
	server.set('hostname', config.hostname);
	server.set('database', config.database);

	// Middlewares
	server.use(bodyParser.urlencoded({ extended: true }))
	server.use(bodyParser.json())

	let allowCrossDomain = (req, res, next) => {
	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
	    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

	    req.method === 'OPTIONS'
		? res.send(200)
		: next();
	};

	server.use(allowCrossDomain);

	// Logger
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

'use strict'

const jwt = require('jsonwebtoken');
const userMethods = require('../models/user/methods');
const configs = require('../../configs/');
const _ = require('lodash');
const util = require('util')
const debug = require('debug')('http')

const jwtVerify = util.promisify(jwt.verify)

const authentication = (req, res) => {
  debug('User authentication')

  if (!req.body.email || !req.body.password)
    return res.status(422).json({ message: 'Required field(s) missing.'})

  userMethods.getUserByEmail(req.body.email)
    .then(user => {
      if (user === null) {
	return res.status(404).send({ message: 'User not found.' });
      }

      user.comparePwd(req.body.password)
	.then(isMatch => {
	  if (!isMatch)
	    return res.status(401).send({ message: 'Passwords don\'t match.' })
	  
	  const token = jwt.sign({ email: user.email }, configs.jwt.secret, { expiresIn: '1d' });

	  userMethods.updateUser(user, { token: token })
	    .then(user => res.status(200).json({ user_id: user._id, token: token }))
	    .catch(err => {
	      debug('%O', err)
	      res.status(500).send({ message: 'Internal server error.'})
	    })
	})
	.catch(err => {
	  debug('%O', err)
	  res.status(500).send({ message: 'Internal server error.'})
	})
    })
    .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.'})
    })
}

const checkToken = (req, res, next) => {
  debug('Checking token')

  const token = req.headers['authorization'];

  if (token === null)
    return res.status(401).send({ message: 'No token provided.' });

  jwtVerify(token, configs.jwt.secret)
    .then(() => next())
    .catch(err => res.status(401).json({ message: 'Invalid token.' }))
}

module.exports = {
  authentication : authentication,
  checkToken : checkToken
}

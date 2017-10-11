'use strict'

const jwt = require('jsonwebtoken');
const userMethods = require('../models/user/methods');
const configs = require('../../configs/');
const _ = require('lodash');

const authentication = (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(422).json({ message: 'Required field(s) missing.'})
  
  userMethods.getUserByEmail(req.body.email, (err, user) => {
    if (err) return res.status(500).send({ message: 'Internal server error.'});
    if (user === null) return res.status(404).send({ message: 'User not found.' });

    user.comparePwd(req.body.password)
      .then(isMatch => {
	if (!isMatch)
	  return res.status(401).send({ message: 'Passwords don\'t match.' })
	
	let token = jwt.sign({ email: user.email }, configs.jwt.secret, { expiresIn: '1d' });

	userMethods.updateUser(user, { token: token }, err => err
			       ? res.status(500).send({ message: 'Internal server error.'})
			       : res.status(200).json({ user_id: user._id, token: token }))
      })
      .catch(err => res.status(500).send({ message: 'Internal server error.'}))
  });
}

const checkToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (token === null) return res.status(401).send({ message: 'No token provided.' });

  jwt.verify(token, configs.jwt.secret, err => err
	     ? res.status(401).json({ message: 'Invalid token.' })
	     : next())
}

module.exports = {
  authentication : authentication,
  checkToken : checkToken
}

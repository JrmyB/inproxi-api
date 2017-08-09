'use strict'

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const configs = require('../../configs/');
const _ = require('lodash');
const bcrypt = require('../../lib/bcrypt');


const authentication = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
	if (err)
	    return res.status(500).send({ message: 'Internal Server Error.'})
	
	if (!user)
	    return res.status(401).json({ message: 'Authentication failed. Email not found.' })
	
	user.comparePwd(req.body.password, (err, isMatch) => {
	    if (err)
		return status(500).send({ message: 'Internal Server Error.' });
	    
	    if (!isMatch)
		return res.status(401).send({ message: 'Authentication failed. Wrong password.' })

	    
	    user.token = jwt.sign({ email: user.email }, configs.jwt.secret, { expiresIn: '1d' });
	    
	    user.save(err => {
		if (err)
		    return res.status(500).send({ message: 'Internal Server Error.'})
		res.status(200).json({ token: user.token })		    
	    })
	});
    });
}

const checkToken = (req, res, next) => {
    const token = req.headers['authorization']
    
    if (!token)
	return res.status(401).send({ message: 'No token provided.' })
    else {
	jwt.verify(token, configs.jwt.secret, (err, decoded) => {
	    if (err)
		return res.status(401).json({ message: 'Invalid token.'})

	    User.findOne({ email: decoded.email }, (err, user) => {
		if (err)
		    return res.status(500).send({ message: 'Internal Server Error.'})
		
		if (!user || user.token !== token)
		    return res.status(401).json({ message: 'Invalid token.' })

		next();
	    })
	})
    }
}

module.exports = {
  authentication : authentication,
  checkToken : checkToken
}

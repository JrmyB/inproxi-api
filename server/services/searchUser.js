'use strict'

const userMethods = require('../models/user/methods')

const searchUser = (req, res) => {
  if (!req.param('first_name') && !req.param('last_name'))
    return res.status(422).json({ message: 'Required field(s) missing.'})

  userMethods.searchUser(req.param('first_name'),
			 req.param('last_name'),
			 (err, user) => {
			   if (err) return res.status(500).send({ message: 'Internal server error.'});
			   if (user === null) return res.status(404).send({ message: 'User not found.' });
			   
			   res.status(200).json(user);
			 })
}

module.exports = searchUser
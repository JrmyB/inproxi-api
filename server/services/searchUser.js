'use strict'

const userMethods = require('../models/user/methods')
const debug = require('debug')('http')

const searchUser = (req, res) => {
  debug('Searching user')
  
  if (!req.query.first_name && !req.query.last_name)
    return res.status(422).json({ message: 'Required field(s) missing.'})

  userMethods.searchUser(req.query.first_name, req.query.last_name)
    .then(user => {
      if (user === null) return res.status(404).send({ message: 'User not found.' })
      res.status(200).json(user)
    })
    .catch(err => res.status(500).send({ message: 'Internal server error.'}))
}

module.exports = searchUser

'use strict'

const User = require('../../models/user')
const serviceAuth = require('../auth')

const getUsers = (req, res) => {
  User.find((err, users) => {
    if (err) return res.send(err)
    res.status(200).json(users)
  })
}

const getUserWithId = (req, res) => {
  User.findById(req.params.id || 0, (err, user) => {
    if (err) return res.status(404).send(err)
    res.status(200).json(user)
  })
}

const createUser = (req, res) => {
  let user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password
  })

  user.save((err) => {
    if (err) return res.status(404).json({ message: 'Registration failed.' })
    serviceAuth.authentication(req, res)
  })
}

const updateUserWithId = (req, res) => {
  User.findByIdAndUpdate(req.params.id || 0, {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password
    }, { new: true }, (err, user) => {
      if (err) return res.send(err)
      res.status(200).json(user)
    })
}

const deleteUserWithId = (req, res) => {
  User.remove({ _id: req.params.id || 0 }, (err, user) => {
    if (err) return res.send(err)
    res.status(200).json({ message: 'User deleted' })
  })
}

module.exports = {
  getUsers : getUsers,
  getUserWithId : getUserWithId,
  createUser : createUser,
  updateUserWithId : updateUserWithId,
  deleteUserWithId : deleteUserWithId
}

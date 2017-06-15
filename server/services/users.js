'use strict'

const User = require('../models/user')
const serviceAuth = require('./auth')

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
    if (err) return res.status(500).json(err)
    res.status(200).json(user)
  })
}

const updateUserWithId = (req, res) => {
  if (!req.body.password)
    return res.status(404).json({ message: 'Password required.'})

  User.findById(req.params.id || 0, (err, user) => {
    if (err) return res.status(404).send(err)

    user.comparePwd(req.body.password || 0, (err, isMatch) => {
      if (err) return res.status(404).send(err)
      if (!isMatch) return res.status(404).send({ message: 'Passwords don\'t match.' })

      user.first_name = req.body.first_name || user.first_name,
      user.last_name = req.body.last_name || user.last_name,
      user.email = req.body.email || user.email

      user.save((err) => {
        if (err) return res.status(404).json({ message: 'Update failed.' })
        res.status(200).json(user)
      })
    })
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

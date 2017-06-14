'use strict'

const User = require('../../models/user')

const getUsers = (req, res) => {
  User.find((err, users) => {
    if (err) res.send(err)
    res.status(200).json(users)
  })
}

const getUserWithId = (req, res) => {
  User.findById(req.params.id || 0, (err, user) => {
    if (err) res.status(404).send(err)
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

  console.log(user)

  user.save((err) => {
    if (err) res.send(err)
    res.status(200).json(user)
  })
}

const updateUserWithId = (req, res) => {
  User.findById(req.params.id || 0, (err, user) => {
    if (err) res.send(err)

    user.first_name = req.body.first_name || user.first_name
    user.last_name = req.body.last_name || user.last_name
    user.email = req.body.email || user.email
    user.password = req.body.password || user.password

    user.save((err) => {
      if (err) res .send(err)
      res.status(200).json(user)
    })
  })
}

const deleteUserWithId = (req, res) => {
  User.remove({ _id: req.params.id || 0 }, (err, user) => {
    if (err) res.send(err)
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

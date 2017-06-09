'use strict'

const User = require('../../models/user')

const getUsers = (req, res) => {
  User.find((err, users) => {
    if (err) res.send(err)
    res.status(200).json(users)
  })
}

const getUserWithId = (req, res) => {
  User.findById(req.params.user_id || 0, (err, user) => {
    if (err) res.send(err)
    res.status(200).json(user)
  })
}

const createUser = (req, res) => {
  console.log('il a bien post')
  const user = new User()
  user.name = req.body.name

  user.save((err) => {
    if (err) res.send(err)
    res.status(200).json({ message: 'User created !' })
  })
}

const updateUserWithId = (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) res.send(err)

    user.name = req.body.name

    user.save((err) => {
      if (err) res.send(err)
      res.status(200).json({ message: 'User updated!' })
    })
  })
}

const deleteUserWithId = (req, res) => {
  User.remove({ _id: req.params.user_id }, (err, user) => {
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

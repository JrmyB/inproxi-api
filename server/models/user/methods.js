'use strict';

const userModel = require('./')
const User = require('./');

const searchUser = (firstName, lastName) => new Promise((resolve, reject) => {
  const query = User
	.find()
	.or([
	  { $and: [
	    { 'first_name': {'$regex': `^${firstName}`, '$options': 'i'}},
	    { 'last_name': {'$regex': `^${lastName}`, '$options': 'i'}}
	  ]},
	  { $and: [
	    { 'first_name': {'$regex': `^${lastName}`, '$options': 'i'}},
	    { 'last_name': {'$regex': `^${firstName}`, '$options': 'i'}}
	  ]}
	])
	.select('first_name last_name _id')
	.limit(20)

  query.exec()
    .then(users => resolve(users))
    .catch(err => reject(err))
})

const getUserById = id => new Promise((resolve, reject) => {
  User.findById(id)
    .then(user => resolve(user))
    .catch(err => reject(err))
})

const getUserByEmail = email => new Promise((resolve, reject) => {
  User.findOne({ email: email })
    .then(user => resolve(user))
    .catch(err => reject(err))
})

const createUser = data => new Promise((resolve, reject) => {
  const user = new User({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    password: data.password
  })

  user.save()
    .then(user => resolve(user))
    .catch(err => reject(err))
})

const updateUser = (user, data) => new Promise((resolve, reject) => {
  user.first_name = data.first_name || user.first_name
  user.last_name = data.last_name || user.last_name
  user.email = data.email || user.email
  user.token = data.token || user.token
  
  user.save()
    .then(user => resolve(user))
    .catch(err => reject(err))
})

const deleteUser = user => new Promise((resolve, reject) => {
  User.remove({ _id: user._id })
    .then(user => resolve(user))
    .catch(err => reject(err))
})

const getFriends = user => new Promise((resolve, reject) => {
  var friends = []

  if (!user.friends.length)
    return resolve(user.friends)

  user.friends.forEach((friendId, i, arr) => {
    getUserById(friendId)
      .then(friend => {
	friends.push({
	  id: friend._id,
	  first_name: friend.first_name,
	  last_name: friend.last_name
	});

	if (i === user.friends.length - 1)
	  resolve(friends)
      })
      .catch(err => reject(err))
  })
})

module.exports = {
  getUserById: getUserById,
  getUserByEmail: getUserByEmail,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getFriends: getFriends,
  searchUser: searchUser
};

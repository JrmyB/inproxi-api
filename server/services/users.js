'use strict'

const userMethods = require('../models/user/methods');
const frMethods = require('../models/friendRequest/methods');
const convMethods = require('../models/conversation/methods')

const getUser = (req, res) => {
  debug('Getting user')

  userMethods.getUserById(req.params.id)
    .then(user => {
      if (user === null) return res.status(404).send({ message: 'User not found.' });
      res.status(200).json(user);
    })
    .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.'})
    })
}

const createUser = (req, res) => {
  debug('Creating user')
  
  if (!req.body.first_name || !req.body.last_name
      || !req.body.email || !req.body.password)
    return res.status(422).json({ message: 'Required field(s) missing.'})
  
  userMethods.createUser(req.body)
    .then(user => res.status(200).json(user))
    .catch(err => {
      if (err && err.code === 11000)
	return res.status(409).json({ message: 'This email is taken. Try another.' });
      if (err) {
	debug('%O', err)
	return res.status(500).send({ message: 'Internal server error.' });
      }
    })
}

const updateUser = (req, res) => {
  debug('Updating user')

  if (!req.body.password)
    return res.status(422).json({ message: 'Required password missing.'})

  userMethods.getUserById(req.params.id)
    .then(user => {
      if (user === null)
	return res.status(404).send({ message: 'User not found.' });

      user.comparePwd(req.body.password)
	.then(isMatch => {
	  if (!isMatch) return res.status(401).send({ message: 'Passwords don\'t match.' })

	  userMethods.updateUser(user, req.body)
	    .then(() => res.status(200).json(user))
	    .catch(err => res.status(500).send({ message: 'Internal server error.'}))
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

const deleteUser = (req, res) => {
  debug('Deleting user')

  if (!req.body.password)
    return res.status(422).json({ message: 'Required password missing.'})
  
  userMethods.getUserById(req.params.id)
    .then(user => {
      if (user === null)
	return res.status(404).send({ message: 'User not found.' });
      
      user.comparePwd(req.body.password)
	.then(isMatch => {
	  if (!isMatch) return res.status(401).send({ message: 'Passwords don\'t match.' });

	  userMethods.deleteUser(user)
	    .then(user => res.sendStatus(200))
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

const getFriends = (req, res) => {
  debug('Get user\'s friends %o', req.params.id)

  userMethods.getUserById(req.params.id)
    .then(user => {
      if (user === null) return res.status(404).send({ message: 'User not found.' });
      
      userMethods.getFriends(user)
	.then(friends => res.status(200).json(friends))
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

const getFriendRequests = (req, res) => {
  debug('Get user\'s friend requests %o', req.params.id)
  debug('Type: %o', req.query.outgoing || 'ingoing')
  
  frMethods.getFriendRequests(req.query.outgoing, req.params.id)
    .then(friendRequests => res.status(200).json(friendRequests))
      .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.'})
    })
}

const getConversations = (req, res) => {
  debug('Get user\'s conversation %o', req.params.id)
  
  convMethods.getConversationsFromUserId(req.params.id)
    .then(conversations => res.status(200).json(conversations))
    .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.'})
    })
}

module.exports = {
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getFriends: getFriends,
  getFriendRequests: getFriendRequests,
  getConversations: getConversations
}

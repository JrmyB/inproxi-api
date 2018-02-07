'use strict'

const methods = require('../models/friendRequest/methods');
const debug = require('debug')('http')

const add = (req, res) => {
  debug('Adding friend request')
  if (!req.body.to || !req.body.from)
    return res.status(422).json({ message: 'Required field(s) missing.' });
  
  methods.addFriendRequest(req.body.to, req.body.from, req.body.message)
    .then((friendRequest) => res.status(200).send(friendRequest))
    .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.' })
    })
}

const update = (req, res) => {
  debug('Updating friend request')

  if (!req.body.status)
    return res.status(422).json({ message: 'Required field(s) missing.'})

  methods.getFriendRequestById(req.params.id)
    .then(friendRequest => {
      if (friendRequest === undefined)
	return res.status(404).send({ message: 'Friend request not found.' });

      if (req.body.status === 'accept') {
	methods.acceptFriendRequest(friendRequest, req.body.status)
	  .catch(err => {
	    debug('%O', err)
	    res.status(500).send({ message: 'Internal server error.' })
	  })
      }

      methods.deleteFriendRequest(friendRequest)
	.then(() => res.sendStatus(200))
	.catch(err => {
	  debug('%O', err)
	  res.status(500).send({ message: 'Internal server error.' })
	})
    })
    .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.' })
    })
}

module.exports = {
  add: add,
  update: update
}

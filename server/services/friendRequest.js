'use strict'

const methods = require('../models/friendRequest/methods');

const add = (req, res) => {
  if (!req.body.to || !req.body.from)
    return res.status(422).json({ message: 'Required field(s) missing.' });

  methods.addFriendRequest(req.body.to, req.body.from, req.body.message)
    .then((friendRequest) => res.status(200).send(friendRequest))
    .catch(err => res.status(500).send({ message: 'Internal server error.' }))
}

const update = (req, res) => {
  if (!req.body.status)
    return res.status(422).json({ message: 'Required field(s) missing.'})

  methods.getFriendRequestById(req.params.id)
    .then(friendRequest => {
      if (friendRequest === undefined)
	return res.status(404).send({ message: 'Friend request not found.' });

      if (req.body.status === 'accept') {
	methods.acceptFriendRequest(friendRequest, req.body.status)
	  .catch(err => res.status(500).send({ message: 'Internal server error.'}))
      }

      methods.deleteFriendRequest(friendRequest)
	.then(() => res.sendStatus(200))
	.catch(err => res.status(500).send({ message: 'Internal server error.'}))
    })
    .catch(err => res.status(500).send({ message: 'Internal server error.'}))
}

module.exports = {
  add: add,
  update: update
}

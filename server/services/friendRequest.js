'use strict';

const methods = require('../models/friendRequest/methods');

function add(req, res) {
  if (!req.body.to || !req.body.from)
    return res.status(422).json({ message: 'Required field(s) missing.' });

  methods.addFriendRequest(req.body.to, req.body.from, req.body.message, (err, fr) => err
			   ? res.status(500).send({ message: 'Internal server error.' })
			   : res.status(200).send(fr))
}

function update(req, res) {
  if (!req.body.status)
    return res.status(422).json({ message: 'Required field(s) missing.'})

  methods.getFriendRequestById(req.params.id, (err, fr) => {
    if (err) return res.status(500).send({ message: 'Internal server error.'});
    if (fr === null) return res.status(404).send({ message: 'Friend request not found.' });

    methods.updateFriendRequest(fr, req.body.status, err => err
				? res.status(500).send({ message: 'Internal server error.'})
				: res.sendStatus(200))
  });
}

module.exports = {
  add: add,
  update: update
};

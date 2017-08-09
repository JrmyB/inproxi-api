'use strict';

const FriendRequest = require('../models/friendRequest');

function add(req, res) {
    if (!req.body.to || !req.body.from)
	return res.status(422).json({ message: 'Required field(s) missing.' });

    let friendRequest = new FriendRequest({
	from: req.body.from,
	to: req.body.to,
	message: req.body.message || ''
    });

    friendRequest.save(err => {
	if (err)
	    return res.status(500).send({ message: 'Internal server error.' });

	res.status(200).send();
    });
}

function update(req, res) {
    if (!req.body.status)
	return res.status(422).json({ message: 'Status field missing.' });
    
    if (req.body.status === 'accept') {
	// TODO: Add friendship to each user.
	// PUSH notif on both clients.
    }
    
    FriendRequest.remove({ _id: req.params.id }, (err, fr) => {
	if (err) return res.status(500).send({ message: 'Internal server error.' });
	return res.status(200).json({ message: 'Friend request deleted.' });
    });
}


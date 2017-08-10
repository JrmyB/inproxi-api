'use strict';

const FriendRequest = require('../models/friendRequest');
const User = require('../models/user');

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
	// PUSH NOTIF TO ALL CLIENTS
	
	FriendRequest.findById(req.params.id, (err, fr) => {
	    if (err) return res.status(404).send({ message: 'Internal server error.' });
	    
	    User.find({$or: [{ _id: fr.from }, { _id: fr.to }]}, (err, users) => {

		users.forEach(user => {
		    var newFriendId = user._id.equals(fr.from)
			? fr.to
			: fr.from; 
		    
		    user.friends.push(newFriendId);
		    user.save(err => {
			if (err)
			    return res.status(500).send({ message: 'Internal server error.' });
		    });
		});

		res.status(200).send();
	    });
	});
    }
    
    FriendRequest.remove({ _id: req.params.id }, (err, fr) => {
    	if (err) return res.status(500).send({ message: 'Internal server error.' });
    	return res.status(200).json({ message: 'Friend request deleted.' });
    });
}

module.exports = {
    add: add,
    update: update
};

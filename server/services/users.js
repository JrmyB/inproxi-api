'use strict'

const User = require('../models/user')
const methods = require('../models/user/methods');
// const FriendRequest = require('../models/friendRequest');

const getUser = (req, res) => {
    if (!req.params.id)
	return res.status(422).json({ message: 'User`s ID required.'});
    
    methods.getUserById(req.params.id, (err, user) => {
	if (err) return res.status(500).send({ message: 'Internal server error.'});
	if (user === null) return res.status(404).send({ message: 'User not found.' });

	res.status(200).json({
	    id: user._id,
	    first_name: user.first_name,
	    last_name: user.last_name
	});
    });
}

const createUser = (req, res) => {    
    if (!req.body.first_name || !req.body.last_name
	|| !req.body.email || !req.body.password)
	return res.status(422).json({ message: 'Required field(s) missing.'})

    methods.createUser(req.body, err => {
	if (err && err.code === 11000) return res.status(409).json({ message: 'This email is taken. Try another.' });
	if (err) return res.status(500).send({ message: 'Internal server error.' });
	res.status(200).json();
    });
}

const updateUser = (req, res) => {
    if (!req.body.password || !req.params.id)
	return res.status(422).json({ message: 'Required field(s) missing.'})

    methods.getUserById(req.params.id, (err, user) => {
	if (err) return res.status(500).send({ message: 'Internal server error.'});
	if (user === null) return res.status(404).send({ message: 'User not found.' });

	user.comparePwd(req.body.password, (err, isMatch) => {
	    if (err) return res.status(500).send({ message: 'Internal server error.'});
	    if (!isMatch) return res.status(401).send({ message: 'Passwords don\'t match.' })

	    methods.updateUser(user, req.body, err => {
		if (err) return res.status(500).send({ message: 'Internal server error.'});
		res.status(200).json();
	    });
	});
    });
}

const deleteUser = (req, res) => {
    if (!req.body.password)
	return res.status(401).json({ message: 'Password required.' });
    
    methods.getUserById(req.params.id, (err, user) => {
	if (err) return res.status(500).send({ message: 'Internal server error.'});
	if (user === null) return res.status(404).send({ message: 'User not found.' });
	
	user.comparePwd(req.body.password, (err, isMatch) => {
	    if (err) return res.status(404).send(err);
	    if (!isMatch) return res.status(401).send({ message: 'Passwords don\'t match.' });

	    methods.deleteUser(user, err => {
		if (err) return res.status(500).send({ message: 'Internal server error.' });
		res.status(200).json();
	    });
	});
    });
}

const getFriends = (req, res) => {
    if (!req.params.id)
	return res.status(422).json({ message: 'User\'s ID required.'});

    methods.getUserById(req.params.id, (err, user) => {
	if (err) return res.status(500).send({ message: 'Internal server error.'});
	if (user === null) return res.status(404).send({ message: 'User not found.' });
	
	methods.getFriends(user, (err, friends) => {
	    if (err) return res.status(500).send({ message: 'Internal server error.'});
	    res.status(200).json(friends);
	});
    });
};

// const getFriendRequests = (req, res) => {
//     const frType = req.query.outgoing
// 	  ? { from: req.params.id }
// 	  : { to: req.params.id };
//     FriendRequest.find(frType, (err, frs) => {
// 	if (err)
// 	    return res.status(500).send({ message: 'Internal server error.' })
// 	res.status(200).json(frs)
//     })
	
// };

module.exports = {
    getUser: getUser,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getFriends: getFriends
}

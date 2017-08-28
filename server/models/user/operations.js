'use strict';

const User = require('./');

function getUserById(id, cb) {
    User.findById(id, (err, user) => {
	if (err)
	    return cb(err, null);

	return cb(null, user);
    })
};

function getFriends(user, cb) {
    var friends = [];

    user.friends.forEach((friendId, i, arr) => {
	getUserById(friendId, (err, friend) => {
	    if (err)
		return cb(err, null);
	    
	    friends.push({
		_id: f._id,
		first_name: f.first_name,
		last_name: f.last_name
	    });

	    if (i === user.friends.length -1)
		return cb(null, friends);
	});
    });
};

function updateUserwithId(user, data, cb) {
    user.first_name = data.first_name || user.first_name;
    user.last_name = data.last_name || user.last_name;
    user.email = data.email || user.email;

    user.save(err => {
	if (err)
	    return cb(err);

	cb(null);
    });
};

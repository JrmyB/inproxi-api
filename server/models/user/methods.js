'use strict';

const User = require('./');

function getUserById(id, cb) {
    User.findById(id, (err, user) => {
	if (err) return cb(err, null);
	cb(null, user);
    });
};

function getUserByEmail(email, cb) {
    User.findOne({ email: email }, (err, user) => {
	if (err) return cb(err, null);
	cb(null, user);
    });
};

function createUser(data, cb) {
    let user = new User({
	first_name: data.first_name,
	last_name: data.last_name,
	email: data.email,
	password: data.password
    });

    user.save(err => {
	if (err) return cb(err);
	cb(null);
    });
};

function updateUser(user, data, cb) {
    user.first_name = data.first_name || user.first_name;
    user.last_name = data.last_name || user.last_name;
    user.email = data.email || user.email;
    user.token = data.token || user.token;
    
    user.save(err => {
	if (err) return cb(err);
	cb(null);
    });
};

function deleteUser(user, cb) {
    User.remove({ _id: user._id }, (err, user) => {
	if (err) return cb(err);
	cb(null);
    });
};

function getFriends(user, cb) {
    var friends = [];
    
    user.friends.forEach((friendId, i, arr) => {
	getUserById(friendId, (err, f) => {
	    if (err) return cb(err, null);
	    
	    friends.push({
		id: f._id,
		first_name: f.first_name,
		last_name: f.last_name
	    });
	    
	    if (i === user.friends.length -1)
		return cb(null, friends);
	});
    });
};

module.exports = {
    getUserById: getUserById,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getFriends: getFriends,
    getUserByEmail: getUserByEmail
};

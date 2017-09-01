'use strict';

const FriendRequest = require('./');

function getFriendRequestById(id, cb) {
    FriendRequest.findById(id, (err, fr) => {
	if (err) return cb(err, null);
	cb(null, fr);
    });
};

function addFriendRequest(toId, fromId, msg, cb) {
    let friendRequest = new FriendRequest({
	from: fromId,
	to: toId,
	message: msg || ''
    });

    friendRequest.save((err, fr) => {
	if (err) return cb(err, null);
	cb(null, fr);
    });
};

function deleteFriendRequest(fr, cb) {
    FriendRequest.remove({ _id: fr._id }, (err, friendRequest) => {
    	if (err) return cb(err);
	cb(null);
    });
};

function updateFriendRequest(fr, status, cb) {
    if (status === 'accept') {
	User.find({$or: [{ _id: fr.from }, { _id: fr.to }]}, (err, users) => {
	    if (err || users === null) return cb(err);
	    
	    users.forEach(user => {
		let newFriendId = user._id.equals(fr.from)
		    ? fr.to
		    : fr.from; 
		
		user.friends.push(newFriendId);
		user.save(err => {
		    if (err) return cb(err);
		});
	    });

	    cb(null);
	});
    }

    deleteFriendRequest(fr, err => {
	if (err) return cb(err);
	cb(null);
    });
}

function getFriendRequests(outgoing, userId, cb) {
    let type = outgoing
	? { from: userId }
	: { to: userId }
    
    FriendRequest.find(type, (err, friendRequests) => {
    	if (err) return cb(err, null);

	let frs = friendRequests.map(e => {
	    return {
		id: e._id,
		from: e.from,
		to: e.to,
		message: e.message
	    }
	});
	
	cb(null, frs);
    })
};

module.exports = {
    getFriendRequestById: getFriendRequestById,
    addFriendRequest: addFriendRequest,
    deleteFriendRequest: deleteFriendRequest,
    udpateFriendRequest: updateFriendRequest,
    getFriendRequests: getFriendRequests
};

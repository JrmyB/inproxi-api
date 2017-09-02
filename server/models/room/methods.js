'use strict';

const Room = require('./');
const userMethods = require('../user/methods');

function getRoomById(id, cb) {
    Room.findById(id, (err, room) => {
	if (err) return cb(err, null);
	cb(null, room);
    });
};

function createRoom(data, cb) {
    let room = new Room({
	name: data.name,
	members: [{
	    id: data.owner,
	    permission: Room.ePermissions.OWNER
	}]
    })

    room.save((err, room) => {
	if (err) return cb(err, null);
	cb(null, room);
    });
};

function addMember(room, user) {
    room.members.push({
	id: userId,
	permission: Room.ePermissions.MEMBER
    });

    room.save(err => {
	if (err) return cb(err);
	cb(null);
    });
};

function deleteMember(room, user) {
    room.members = room.members.filter(e => !e.id.equals(user._id));
    
    room.save(err => {
	if (err) return cb(err);
	cb(null);
    });
};

function getMembers(room, cb) {
    var members = [];
    
    room.members.forEach((member, i, arr) => {
	userMethods.getUserById(member.id, (err, user) => {
	    if (err) return cb(err, null);

	    members.push({
		id: user._id,
		first_name: user.first_name,
		last_name: user.last_name,
		permission: member.permission
	    });

	    if (i === room.members.length - 1)
		return cb(null, members);
	});
    });
};

module.exports = {
    getRoomById: getRoomById,
    createRoom: createRoom,
    getMembers: getMembers,
    addMember: addMember,
    deleteMember: deleteMember
};

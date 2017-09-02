'use strict';

const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: {
	type: String,
	required: true
    },
    members: {
	type: [{
	    id: { type : mongoose.Schema.Types.ObjectId, required: true },
	    permission: { type: Number, required: true }
	}],
	required: true
    }
});

const ePermissions = {
    OWNER: 0,
    ADMIN: 1,
    MEMBER: 2
};

module.exports = mongoose.model('Room', RoomSchema);

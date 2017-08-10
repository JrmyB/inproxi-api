'use strict';

const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema({
    from: {
	type: mongoose.Schema.Types.ObjectId,
	required: true
    },
    to: {
	type: mongoose.Schema.Types.ObjectId,
	required: true
    },
    message: {
	type: String
    }
});

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);

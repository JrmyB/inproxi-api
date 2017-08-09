'use strict';

const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema({
    from: {
	type: Schema.ObjectId,
	required: true
    },
    to: {
	type: Schema.ObjectId
	required: true
    },
    message: {
	type: String
    }
});

module.exports = mongoose.model('FriendRequest');

'use strict'

const mongoose = require('mongoose')

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
})

FriendRequestSchema.options.toJSON = {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
}

module.exports = mongoose.model('FriendRequest', FriendRequestSchema)


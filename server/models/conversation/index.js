'use strict'

const mongoose = require('mongoose')

const ConversationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

ConversationSchema.options.toJSON = {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  }
}

module.exports = mongoose.model('Conversation', ConversationSchema)

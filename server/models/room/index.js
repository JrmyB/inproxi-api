'use strict'

const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coords: {
    type : Array ,
    "default" : []
  }
})

RoomSchema.options.toJSON = {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  }
}

module.exports = mongoose.model('Room', RoomSchema)

'use strict'

const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  area_id: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false
  }
})

RoomSchema.options.toJSON = {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
}

module.exports = mongoose.model('Room', RoomSchema)

'use strict'

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

// UserSchema.pre('save', (next) => {
//   //TODO: crypt pwd
// })

module.exports = mongoose.model('User', UserSchema)

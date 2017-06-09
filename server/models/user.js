'use strict'

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)

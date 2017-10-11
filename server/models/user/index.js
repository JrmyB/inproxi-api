'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

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
  token: {
    type: String,
    required: false
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false
  }
})

UserSchema.options.toJSON = {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    delete ret.password;
    delete ret.token
    delete ret.friends
    delete ret.updated_at
    return ret;
  }
}

UserSchema.pre('save', function(next) {
  const user = this

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR)
    .then(salt => bcrypt.hash(user.password, salt))
    .then(hash => {
      user.password = hash
      next()
    })
    .catch(err => next(err))
})

UserSchema.methods.comparePwd = function(candidatePwd) {
  return new Promise((resolve, reject) => {
    const user = this
    
    bcrypt.compare(candidatePwd, user.password)
      .then(isPwdMatch => resolve(isPwdMatch))
      .catch(err => reject(err))
  })
}

module.exports = mongoose.model('User', UserSchema)

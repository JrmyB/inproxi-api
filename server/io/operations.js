'use strict'

const Conversation = require('../models/conversation')

const joinGroupsAfterAuth = (userId, socket) => new Promise((resolve, reject) => {
  Conversation
    .find({ members: userId })
    .select('-_id ')
    .exec()
    .then(groups => {
      groups.forEach(g => socket.join(g._id))
      resolve()
    })
    .catch(err => reject(err))
})

module.exports = {
  joinGroupsAfterAuth: joinGroupsAfterAuth
}

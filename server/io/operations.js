'use strict'

const convM = require('../models/conversation/methods')
const msgM = require('../models/message/methods')

const joinGroupsAfterAuth = (user_id, socket) => new Promise((resolve, reject) => {
  convM.getConversations(user_id)
    .then(groups => {
      groups.forEach(g => socket.join(g._id))
      resolve()
    })
    .catch(err => reject(err))
})

module.exports = {
  joinGroupsAfterAuth: joinGroupsAfterAuth
}

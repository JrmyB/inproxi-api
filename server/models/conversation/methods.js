'use strict'

const Conversation = require('./')
const Message = require('../message/')

const createConversation = membersId => new Promise((resolve, reject) => {
  console.log(membersId)

  const conversation = new Conversation({
    members: membersId
  })

  conversation.save()  
    .then(conversation => resolve(conversation))
    .reject(err => reject(err))
})

const getConversationById = id => new Promise((resolve, reject) => {
  Conversation.findById(id)
    .then(conversation => resolve(conversation))
    .catch(err => reject(err))
})

const addMembers = (conversation, membersId) => new Promise((resolve, reject) => {
  conversation.members = conversation.members.concat(membersId)

  conversation.save()
    .then(conversation => resolve(conversation))
    .reject(err => reject(err))
})

const getConversationsFromUserId = userId => new Promise((resolve, reject) => {
  Conversation
    .find({ members: userId })
    .populate('members', 'first_name last_name')
    .exec()
    .then(conversations => {
      // Get conversations + last messages
      conversations.forEach((conversation, i) => {
      	Message.find({ 'conversation': conversation._id })
          .sort('-createdAt')
          .limit(1)
          .exec()
      	  .then(msg => {
	    conversation.last_message = msg[0].content
	    console.log(conversation.last_message)

	    if (i === conversations.length - 1)

	  //   if (msg) {
	  //     conversation.last_message = msg[0].content
	  //     return msg[0].content
      	    //   }


	    
      	  })
      	  .catch(err => reject(err))
      })

//      resolve(conversations)
    })
    .catch(err => reject(err))
})

module.exports = {
  createConversation: createConversation,
  addMembers: addMembers,
  getConversationsFromUserId: getConversationsFromUserId,
  getConversationById: getConversationById
}

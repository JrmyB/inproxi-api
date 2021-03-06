'use strict'

const Chat = require('../../io')
const Conversation = require('./')
const Message = require('../message/')

const createConversation = (membersId, name) => new Promise((resolve, reject) => {
  const conversation = new Conversation({
    members: membersId,
    name: name
  })
  
  conversation.save()  
    .then(conversation => {
      conversation.members.forEach(userId => {
	Chat.joinGroup(userId, conversation._id)
      })
      resolve(conversation)
    })
    .catch(err => {
      console.log(err)
      reject(err)
    })
})

const getConversationById = id => new Promise((resolve, reject) => {
  Conversation.findById(id)
    .then(conversation => resolve(conversation))
    .catch(err => reject(err))
})

const addMembers = (conversation, membersId) => new Promise((resolve, reject) => {
  conversation.members = conversation.members.concat(membersId)

  conversation.save()
    .then(conversation => {
      membersId.forEach(userId => Chat.joinGroup(userId, conversation.id))
      resolve(conversation)
    })
    .catch(err => reject(err))
})

const deleteMember = (conversation, memberId) => new Promise((resolve, reject) => {
  const conv = conversation.members.filter(e => e !== memberId)

  conv.save()
    .then(conversation => {
      Chat.leaveGroup(memberId, conversation.id)
      resolve(conversation)
    })
    .catch(err => reject(err))
})

const getConversations = userId => new Promise((resolve, reject) => {
  Conversation
    .find({ members: userId })
    .select('_id name')
    .exec()
    .then(conversations => {
      if (conversations === null)
	console.log('pas de conv')
      
      resolve(conversations)
    })
    .catch(err => reject(err))
})

const getConversationsFromUserId = userId => new Promise((resolve, reject) => {
  Conversation
    .find({ members: userId })
    .populate('members', 'first_name last_name _id')
    .exec()
    .then(conversations => {
      if (!conversations.length)
	resolve(conversations)
      
      let fullConvs = []
      
      // Get last messages
      conversations.forEach((conversation, i) => {
	Message.find({ 'conversation': conversation._id })
          .sort('-createdAt')
          .limit(1)
          .exec()
      	  .then(msg => {
	    let convWithMsg = {}
	    convWithMsg.conversation = conversation

	    if (msg.length !== 0)
	      convWithMsg.last_message = msg[0].content

	    fullConvs.push(convWithMsg)

	    if (i == conversations.length - 1)
	      resolve(fullConvs)
  	  })
      	  .catch(err => reject(err))
      })
    })
    .catch(err => reject(err))
})

module.exports = {
  createConversation: createConversation,
  addMembers: addMembers,
  getConversationsFromUserId: getConversationsFromUserId,
  getConversationById: getConversationById,
  getConversations: getConversations
}

'use strict'

const convMethods = require('../models/conversation/methods')
const msgMethods = require('../models/message/methods')

const createConversation = (req, res) => {
  if (!req.body.members)
    return res.status(422).json({ message: 'Required member(s) id missing.'})

  console.log(req.body.members)
  
  convMethods.createConversation(req.body.members)
    .then(conversation => res.status(200).json(conversation))
    .catch(err => res.status(500).send({ message: 'Internal server error.' }))
}

const addMembers = (req, res) => {
  if (!req.body.members)
    return res.status(422).json({ message: 'Required member(s) id missing.'})

  convMethods.getConversationById(req.params.id)
    .then(conversation => {
      convMethods.addMembers(conversation, JSON.parse(req.body.members))
	.then(conversation => res.status(200).json(conversation))
	.catch(err => res.status(500).send({ message: 'Internal server error.' }))
    })
    .catch(err => res.status(500).send({ message: 'Internal server error.' }))
}

const deleteMember = (req, res) => {
  if (!req.body.memberId)
    return res.status(422).json({ message: 'Required member id missing.'})

  convMethods.getConversationById(req.params.id)
    .then(conversation => {
      convMethods.deleteMember(conversation, memberId)
	.then(conversation => res.status(200).json(conversation))
	.catch(err => res.status(500).send({ message: 'Internal server error.' }))
    })
    .catch(err => res.status(500).send({ message: 'Internal server error.' }))
}

const getMessages = (req, res) => {
  msgMethods.getMessagesFromConversationId(req.params.id)
    .then(msgs => res.status(200).json(msgs))
    .catch(err => res.status(500).send({ message: 'Internal server error.' }))
}

const createMessage = (req, res) => {
  if (!req.body.content || !req.body.author)
    return res.status(422).json({ message: 'Required fields missing.'})
  
  const data = {
    conversation_id: req.params.id,
    content: req.body.content,
    author: req.body.author
  }

  msgMethods.createMessage(data)
    .then(msgs => res.status(200).json(msgs))
    .catch(err => res.status(500).send({ message: 'Internal server error.' }))
}

module.exports = {
  createConversation: createConversation,
  addMembers: addMembers,
  getMessages: getMessages,
  createMessage: createMessage
}

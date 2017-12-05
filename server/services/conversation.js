'use strict'

const convMethods = require('../models/conversation/methods')
const msgMethods = require('../models/message/methods')

const createConversation = (req, res) => {
  if (!req.body.members || !req.body.name)
    return res.status(422).json({ message: 'Required member(s) id missing.'})

  const members = req.body.members.split(',')
  
  convMethods.createConversation(members, req.body.name)
    .then(conversation => res.status(200).json(conversation))
    .catch(err => res.status(500).send({ message: 'Internal server error.' }))
}

const getConversation = (req, res) => {
  convMethods.getConversationById(req.params.id)
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

module.exports = {
  createConversation: createConversation,
  addMembers: addMembers,
  getConversation: getConversation,
  getMessages: getMessages
}

'use strict'

const convMethods = require('../models/conversation/methods')
const msgMethods = require('../models/message/methods')
const debug = require('debug')('http')

const createConversation = (req, res) => {
  debug('Creating conversation')

  if (!req.body.members || !req.body.name)
    return res.status(422).json({ message: 'Required member(s) id missing.'})

  const members = req.body.members.split(',')
  
  convMethods.createConversation(members, req.body.name)
    .then(conversation => res.status(200).json(conversation))
    .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.' })
    })
}

const getConversation = (req, res) => {
  debug('Getting conversation')

  convMethods.getConversationById(req.params.id)
    .then(conversation => res.status(200).json(conversation))
    .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.' })
    })
}

const addMembers = (req, res) => {
  debug('Adding members to conversation')
  
  if (!req.body.members)
    return res.status(422).json({ message: 'Required member(s) id missing.'})

  convMethods.getConversationById(req.params.id)
    .then(conversation => {
      convMethods.addMembers(conversation, JSON.parse(req.body.members))
	.then(conversation => res.status(200).json(conversation))
        .catch(err => {
	  debug('%O', err)
	  res.status(500).send({ message: 'Internal server error.' })
	})
    })
    .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.' })
    })
}

const deleteMember = (req, res) => {
  debug('Deleting member to conversation')

  if (!req.body.memberId)
    return res.status(422).json({ message: 'Required member id missing.'})

  convMethods.getConversationById(req.params.id)
    .then(conversation => {
      convMethods.deleteMember(conversation, memberId)
	.then(conversation => res.status(200).json(conversation))
        .catch(err => {
	  debug('%O', err)
	  res.status(500).send({ message: 'Internal server error.' })
	})
    })
    .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.' })
    })
}

const getMessages = (req, res) => {
  debug('Getting messages from conversation')

  msgMethods.getMessagesFromConversationId(req.params.id)
    .then(msgs => res.status(200).json(msgs))
    .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.' })
    })
}

module.exports = {
  createConversation: createConversation,
  addMembers: addMembers,
  getConversation: getConversation,
  getMessages: getMessages
}

'use strict'

const Message = require('./')

const createMessage = data => new Promise((resolve, reject) => {

  console.log('Data2:')
  console.log(data)

  const message = new Message({
    conversation: data.conversation_id,
    content: data.content,
    author: data.author
  })

  message.save()
    .then(message => resolve(message))
    .catch(err => reject(err))
})

const getMessagesFromConversationId = conversationId => new Promise((resolve, reject) => {
  Message.find({ conversation: conversationId })
    .select('createdAt content author')
    .sort('-createdAt')
    .populate('author', 'first_name last_name')
    .exec()
    .then(msgs => resolve(msgs))
    .catch(err => reject(err))
})

module.exports = {
  createMessage: createMessage,
  getMessagesFromConversationId
}

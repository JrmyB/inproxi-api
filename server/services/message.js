// 'use strict'

// const msgMethods = require('../models/message/methods')

// const createMessage = (req, res) => {
//   if (!req.body.conversation_id || !req.body.message || !req.body.from)
//     return res.status(422).json({ message: 'Required fields missing.'})

//   msgMethods.createMessage(req.body)
//     .then(msg => res.status(200).json(msg))
//     .catch(err => res.status(500).send({ message: 'Internal server error.' }))
// }

// module.exports = {
//   createMessage: createMessage
// }

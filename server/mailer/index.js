'use strict'

const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const email = 'inproxi.app@gmail.com'
const pass = 'inproxiapp'
const path = require('path')

var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
})

var handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: path.resolve('./server/mailer/'),
  extName: '.html'
}

smtpTransport.use('compile', hbs(handlebarsOptions))

module.exports = {
  email: email,
  pass: pass,
  smtpTransport
}

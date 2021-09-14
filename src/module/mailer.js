const nodemailer = require('nodemailer')

const path = require('path')

const nhb = require('nodemailer-express-handlebars');

const {host, port,user,pass} = require('../config/mail.json')

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {user, pass }
  });

transport.use('compile',nhb({
  viewEngine: 'handlebar',
  viewPath: path.resolve('./src/resource/mail'),
  extName: 'html'
}));

module.exports = transport;
#!/usr/bin/env node

var express = require('express')
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var nconf = require('nconf');

var config = nconf
  .argv()
  .env()
  .file({
    file: 'config.json'
  })
  .file('emails', {
    file: 'emails.json'
  });


var transport = nodemailer.createTransport(config.get('SMTP'));
var app = express();


//  Needed for 'req.body'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
  //  If the _gotcha field has a value, it's most likely a bot filling out
  //  the form. Fail silently.
  if (req.body._gotcha) {
    res.redirect(req.body._next || req.get('Referrer'));
    return;
  }

  //  Make sure the supplied key is valid
  if (!config.get(req.query.key)) {
    res.status(400).send({
      error: 'Error invalid key'
    });
    return;
  }

  //  Construct Message
  var emailMessage = req.body.message;

  // Make sure the email message is not empty
  if (!emailMessage) {
    res.send({
      error: 'Error, email message is empty'
    });
    return;
  }

  //  Create string of _fields elements to add at end of message
  if (emailMessage) {
    emailMessage += '\r\n\r\n';
  }

  for (key in req.body) {
    if (/^\_fields\.*/.test(key)) {
      var value = req.body[key];

      //  Make the key into a pretty sentence
      //  (e.g. _fields.hiThere => Hi there)
      var key = key
        .replace('_fields.', '')
        .replace(/^[a-z]|[A-Z]/g, function (v, i) {
          return i === 0 ? v.toUpperCase() : " " + v.toLowerCase();
        });

      emailMessage += key + ': ' + value + '\r\n';
    }
  }

  //  Create an email message based on post values
  var mailOpts = {
    'text': emailMessage || 'No message was provided',
    'subject': req.body._subject || 'Email from mailhound',
    'from': {
      'name': req.body.name,
      'address': req.body._replyto || req.body.email
    },
    'to': config.get(req.query.key),
    'cc': req.body._cc
  }

  //  Send the message!
  transport.sendMail(mailOpts, function (err, info) {
    if (err) {
      console.log('Error sending email: ' + err.name + ' - ' + err.message);
      return res.status(500).send({
        error: 'Error sending email'
      });
    }

    res.redirect(req.body._next || req.get('Referrer'));
  });
});

var server = app.listen(config.get('PORT') || 8000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('mailhound listening at http://%s:%s', host, port);
});

process.on('SIGTERM', function () {
  server.close(function () {
    process.exit(0)
  })
})
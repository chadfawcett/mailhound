var express = require('express')
var bodyParser = require('body-parser');
var multer = require('multer'); 
var mandrill = require('mandrill-api/mandrill');
var nconf = require('nconf');
var _ = require('lodash');

var config = nconf
  .argv()
  .env()
  .file({ file: 'config.json'})
  .file('emails', { file: 'emails.json' });

var mandrill_client = new mandrill.Mandrill(config.get('MANDRILL_API_KEY'));
var app = express();

//  Needed for 'req.body'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res) {
  //  If the _gotcha field has a value, it's most likely a bot filling out
  //  the form. Fail silently.
  if (req.body._gotcha) {
    res.redirect(req.body._next || req.get('Referrer'));
    return;
  }

  //  Make sure the supplied key is valid
  if (!config.get(req.query.key)) {
    res.status(400).send({ error: 'Error invalid key' });
    return;
  }

  //  Construct Message
  var emailMessage = req.body.message;

  //  Create string of _fields elements to add at end of message
  if (emailMessage) {
    emailMessage += '\r\n\r\n';
  }

  _.forIn(req.body, function(value, key) {
    if (/^\_fields\.*/.test(key)) {
      //  Make the key into a pretty sentence
      //  (e.g. _fields.hiThere => Hi there)
      var key = key
        .replace('_fields.', '')
        .replace(/^[a-z]|[A-Z]/g, function(v, i) {
          return i === 0 ? v.toUpperCase() : " " + v.toLowerCase();
        });

      emailMessage += key + ': ' + value + '\r\n';
    }
  });

  //  Create an email message based on post values
  var message = {
    'text': emailMessage || 'No message was provided',
    'subject': req.body._subject || 'Email from mailhound',
    'from_email': req.body._replyto,
    'from_name': req.body.name,
    'to': [
      {
        'email': config.get(req.query.key),
        'type': 'to'
      },
      {
        'email': req.body._cc,
        'type': 'cc'
      }
    ]
  }

  //  Send the message!
  mandrill_client.messages.send(
    {
      'message': message,
      'async': false
    },
    function(result) {
      res.redirect(req.body._next || req.get('Referrer'));
    },
    function(e) {
      console.log('Error sending email: ' + e.name + ' - ' + e.message);
      res.status(500).send({ error: 'Error sending email' });
    }
  );
});

var server = app.listen(config.get('PORT') || 8000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('mailhound listening at http://%s:%s', host, port);
});

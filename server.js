var express = require('express')
var bodyParser = require('body-parser');
var multer = require('multer'); 
var mandrill = require('mandrill-api/mandrill');
var nconf = require('nconf');

var config = nconf
  .argv()
  .env()
  .file({ file: 'config.json'})
  .file('emails', { file: 'emails.json' });

var app = express();
var mandrill_client = new mandrill.Mandrill(config.get('MANDRILL_API_KEY'));

//  Needed for 'req.body'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

app.get('/', function(req, res) {
  res.sendfile('index.html');
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

  var recipient = JSON.parse(config.get(req.query.key));
  console.log('Attempting to email ' + recipient.email, recipient);

  //  Create an email message based on post values
  var message = {
    'text': req.body.message || 'No message was provided',
    'subject': req.body._subject || 'Email from NodeMailForm',
    'from_email': req.body._replyto,
    'from_name': req.body.name,
    'to': [{
      'email': recipient.email,
      'name': recipient.name,
      'type': 'to'
    },
    {
      'email': req.body._cc,
      'type': 'cc'
    }]
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

  console.log('NodeMailForm listening at http://%s:%s', host, port);
});

var express = require('express')
var bodyParser = require('body-parser');
var multer = require('multer'); 
var emails = require('./emails.js');
var mandrill = require('mandrill-api/mandrill');

var app = express();
var mandrill_client = new mandrill.Mandrill('kxQ8B48RVKjaRJlCd7JvPg');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.post('/', function(req, res) {
  console.log(req.body);
  var message = {
    'text': req.body.message,
    'subject': req.body._subject ? req.body._subject : 'Email from NodeMailForm',
    'from_email': req.body._replyto,
    'from_name': req.body.name,
    'to': [{
      'email': emails[req.query.key].email,
      'name': emails[req.query.key].name,
      'type': 'to'
    }]
  }

  mandrill_client.messages.send({ 'message': message, 'async': false }, function(result) {
    console.log(result);
    res.redirect(req.body._next ? req.body._next : req.get('Referrer'));
  }, function(e) {
    console.log('Whoops, I errored: ' + e.name + ' - ' + e.message);
    res.status(500).send({ error: 'something blew up' });
  });
});

var server = app.listen(8002, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
})

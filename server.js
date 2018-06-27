const express = require('express');
const bodyParser = require('body-parser');


var { mongoose } = require('./db/mongoose');
var UserRoutes = require('./routes/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept,x-auth');
  next();
});

app.use('/users', UserRoutes);

app.listen(3000, () => {
  console.log('started on port ' + port)
});

module.exports = { app };
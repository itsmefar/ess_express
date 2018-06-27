var express = require('express');
var router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');
//var { authenticate } = require('../middleware/authenticate');

var { User } = require('../models/user.model');


//create user
router.post('/', (req, res) => {
    //var userBody = _.pick(req.body, ['email', 'password', 'name', 'nric', 'contact', 'firstName', 'lastName', 'address']);
    var user = new User(req.body);
    //console.log(userBody);
    //save user
    user.save().then((data) => {
      res.status(200).send(data);
    }).catch((e) => {
      console.log(e);
      res.status(400).send(e);
    })
  });
  
  // user login
  router.post('/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    console.log(body);
    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.json({token: token, user: user });
      });
    }).catch((e) => {
      res.status(403).send(e);
    });
  });
  
  //get current user
  router.get('/getuser', (req, res) => {
    var id = req.user._id;
    User.findByUserId(id).then((user) => {
      res.status(200).send(user);
    }, (err) => {
      res.status(400).send(err);
    });
  });
  module.exports = router;
var express = require('express');
var router = express.Router();
const _ = require('lodash');
var { authenticate } = require('../middleware/authenticate');

var { Leave } = require('../models/leave');
var { User } = require('../models/user.model')

//create leave detail
router.post("/createleave", authenticate, (req, res) => {
  console.log("create leave");
  //_id from user as primary key
  var id = req.user._id
  var body = req.body;
  body.id = id
  body.firstname=req.user.firstname;
  body.lastname=req.user.lastname;

  console.log(body)
  var leave = new Leave(body)
  leave.save().then((leave) => {
    console.log(leave);
    res.status(200).send();
  }).catch((e) => {
    res.status(400).send(e);
  })
});


//get all leave
router.get('/getallleave',authenticate, (req, res) => {
    var _id =req.user._id
    Leave.find({}).where('id').equals(_id).then(data => {
      res.status(200).send(data);
  
    }).catch(error => {
      res.status(400).send(error);
    })
  });

//get company detail
// router.get("/getCompDetail", authenticate, (req, res) => {
//   Company.findOne({id:req.user._id}).then(comp => {
//     res.status(200).send(comp);
//   }).catch((e) => {
//     res.status(400).send(e);
//   })
// });

//update company detail
// router.put("/update", authenticate, (req, res) => {
//   Company.update({ id: req.user._id }, req.body).then((data) => {
//     res.status(200).send(sata);
//   }).catch((e) => {
//     console.log(e)
//     res.status(400).send(e);
//   })
// });




module.exports = router;
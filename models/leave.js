const mongoose = require('mongoose');

var LeaveSchema = new mongoose.Schema({

    id: {
        type: String,
        required: true,

    },
    firstname: {
        type: String,

    },
    lastname:{
        type: String
    },
    startdate: {
        type: Date
    },
    enddate: {
        type: Date
    },
    totalday:{
        type: Number
    },
    typeofleave:{
        type: String
    },
    remarks:{
        type: String
    },
    approve:{
        type: String
    },
    leaveentitle:{
        type: String
    },
    bringforward :{
        type: String
    },
    total:{
        type: String
    },
    taken:{
        type: String
    },
    balance:{
        type: String
    },
    approveby:{
        type: String
    },
    lavel1date:{
        type: Date
    },
    level1app:{
        type: String
    },
    level2date:{
        type: Date
    },
    level2app:{
        type: String
    }
})


var Leave = mongoose.model('leave', LeaveSchema);

module.exports = { Leave }
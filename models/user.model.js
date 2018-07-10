const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const secretPass = "abc123"

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        minlength: 6
    },
    firstname: {
        type: String,
        minlength: 1
    },
    lastname: {
        type: String,
        minlength: 1
    },
    address: {
        type: String,
        minlength: 1
    },
    nric: {
        type: String,
        trim: true,
        minlength: 1
    },
    designation: {
        type: String,
    },
    department: {
        type: String,
    },
    nationality: {
        type: String,
    },
    contact: {
        type: String,
        minlength: 6
    },
    pm: {
        type: String,
    },
    hr: {
        type: String,
    },
    group: {
        type: String,
    },
    level1app: {
        type: String,
    },
    level2app: {
        type: String,
    },
    leaveperyear: {
        type: String,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
}, { usePushEach: true });


//overide method
//it will return specific attribute
// UserSchema.methods.toJSON = function () {
//     var user = this;
//     var userObject = user.toObject();

//     return _.pick(userObject, ['_id', 'email', 'firstName', 'lastName', 'nric', 'contact', 'address', 'designation', 'department']);
// };

UserSchema.statics.checkPassword = function (email, oldPassword) {
    var User = this;
    return User.findOne({ email }).then((user) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(oldPassword, user.password, (err, res) => {
                if (res) {
                    resolve();
                } else {
                    reject("Current password not correct");
                }
            });
        });
    });
}

//generate token for user
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, secretPass).toString();

    user.tokens.push({ access, token });

    return user.save().then(() => {
        return token;
    });
};

//find user token
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, secretPass);
    } catch (e) {
        //so then will not run
        //return new Promise((resolve,reject) =>{
        //       reject();
        //   });
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};


//mongoose midleware - this method will run before save
UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        //encrypt password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});



//check email and password,decrypt passwod
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject("Email doesn't exist");
        }
        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject("Authenticaton failed, wrong password.");
                }
            });
        });
    });
};


UserSchema.statics.findByUserId = function (_id) {
    var User = this;
    return User.findById(_id).then((user) => {
        if (!user) {
            return Promise.reject('user doesnt exist');
        }
        return Promise.resolve(user);
    });
}

//remove token 
UserSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
        //pull all
        $pull: {
            tokens: { token }
        }
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = { User }
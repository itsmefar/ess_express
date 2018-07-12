var { User } = require('./../models/user.model');

//token authenticate
//act as middlewere to determine if user have authorize to access db
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        //if user not existed
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();

    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = { authenticate };

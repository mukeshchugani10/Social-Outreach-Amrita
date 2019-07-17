var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../../models/User');
var bcrypt = require('bcryptjs');
var path = require('path');
var pug = require('pug');
var jwt = require('jsonwebtoken');


router.get('/',function(req,res) {
    res.status(200).send('Auth API works');
})

router.post('/login', function (req, res) {

    User.findOne({ username: req.body.username }, async function (err, user) {
        if (err) return res.status(200).send({ message: err.toString() });
        if (!user) return res.status(200).send({ message: 'Invalid Credentials' });


        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(200).send({ auth: false, token: null, message: 'Invalid Credentials' });


        var token = jwt.sign({ id: user._id, username: user.username }, "secret", {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    });

});

module.exports = router;
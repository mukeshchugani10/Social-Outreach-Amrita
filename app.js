var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
global.__root = __dirname + '/routes/';
var db = require('./db');
var User = require('./models/User');
var bcrypt = require('bcryptjs');


var expressWs = require('express-ws');
var expressWs = expressWs(express());

var app = expressWs.app;
// var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


var AuthController = require('./routes/auth/AuthController');
app.use('/api/auth', AuthController);


var UtilityController = require('./routes/utilityAPI/UtilityAPIController');
app.use('/api/utility', UtilityController);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}




// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



async function createAdmin(){
    const A = await User.findOne({username : "admin"});
    if(!A){
        const B = await User.create({
            username : "admin",
            password : bcrypt.hashSync("admin", 12),
            name: "admin"
        });
        console.log("Created Admin");
    }else{
        console.log("Admin already present");
    }
    
}

createAdmin();

module.exports = app;

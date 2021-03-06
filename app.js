var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var admin = require('./config/admin.json');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Setup Database connection
mongoose.connect('mongodb://localhost/mySite', function (err) {
    if (err) {
        console.log("Database connection failed: " + err);
    } else {
        console.log("Database connection successful");
    }
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Configuration
app.use(passport.initialize());
app.use/(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    if(username === admin.username && password === admin.password) {
        return done(null, {
            displayName: 'Admin'
        });
    }
    return done(null, false, { message: 'Incorrect username or password.' });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.displayName);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

// Routes Configuratio/n
app.use('/', routes);
app.use('/users', users);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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


module.exports = app;

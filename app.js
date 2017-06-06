var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

global.dbHandle = require('./database/dbHandle');
global.db = mongoose.connect('mongodb://localhost:27017/nodedb');

var app = express();
app.use(session({
  secret: 'secret',
  cookie: {
    maxAge: 1000 * 60 * 30
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(multer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  var err = req.session.error;
  delete req.session.error;
  res.locals.message = '';
  if (err) {
    res.locals.message = "<div class='alert alert-danger' style='margin-bottom:20px; color: red;'>" + err + "</div>";
  }
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/login', routes);
app.use('/register', routes);
app.use('/home', routes);
app.use('/logout', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req
    .app
    .get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
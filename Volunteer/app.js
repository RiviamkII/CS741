var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var router = require('./routes/index');

var app = express();
connect().on('error', console.log).on('disconneted', connect);

function connect() {
    var options = {server: {socketOptions: {keepAlive: 1}}};
    return mongoose.connect('mongodb://localhost:27017/volunteer', options).connection;
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.set('view engine', 'html');
app.engine( '.html', require( 'ejs' ).__express );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session中间件
app.use(cookieParser('weird key'));
app.use(session({
    /*name: identifier,*/
    secret:'weird key',
    resave:true,
    saveUninitialized:true,
    cookie:{maxAge:3*60*1000}
}));


app.get('/', function (req, res) {
    res.render('index', {root: __dirname + "/views"});
});

app.get('/adminlogin', function (req, res) {
    res.render('adminLogin', {root: __dirname + "/views"});
});

app.get('/userManual', function (req, res) {
    res.render('UserManual', {root: __dirname + "/views"});
});


app.get('/adminIndex', function (req, res) {
    res.render('adminIndex', {root: __dirname + "/views"});
});

app.get('/managerlogin', function (req, res) {
    res.render('managerLogin', {root: __dirname + "/views"});
});

app.get('/managerIndex', function (req, res) {
    res.render('managerIndex', {root: __dirname + "/views"});
});

app.get('/volunteerlogin', function (req, res) {
    res.render('volunteerLogin', {root: __dirname + "/views"});
});

app.get('/volunteerIndex', function (req, res) {
    res.render('volunteerIndex', {root: __dirname + "/views"});
});


app.get('/index', function (req, res) {
    res.render('index', {root: __dirname + "/views"});
});

app.use('/', router);




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
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
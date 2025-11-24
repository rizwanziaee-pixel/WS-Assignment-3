// server/config/app.js
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Import routers
var indexRouter = require('../routes/index');
var expenseRouter = require('../routes/expense');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files - fix the path to go up two directories to reach public folder
app.use(express.static(path.join(__dirname, '../../public')));
app.use('/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist')));
app.use('/@fortawesome', express.static(path.join(__dirname, '../../node_modules/@fortawesome')));
app.use('/jquery', express.static(path.join(__dirname, '../../node_modules/jquery/dist')));


// Route configuration
app.use('/', indexRouter);
app.use('/expenses', expenseRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // Render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

// Database connection
const mongoose = require('mongoose');
const dbConfig = require('./db');

// Connect to MongoDB
mongoose.connect(dbConfig.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
  console.log('Connected to MongoDB at: ' + dbConfig.URI);
});

module.exports = app;
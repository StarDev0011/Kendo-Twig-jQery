/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const config = require("config");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
let RedisStore = require("connect-redis")(session);

const {createClient} = require("redis");
let redisClient = createClient({
                                 legacyMode: true,
                                 url: config.get("redis.host")
                               });
redisClient.connect().catch(console.error);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(
  session({
            store: new RedisStore({client: redisClient}),
            saveUninitialized: false,
            secret: "8122af5c-c7e6-4f05-bf98-1252b7ca2a2e",
            resave: false
          })
);

// Prevent page cache on every route
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use('/', require('./routes/index'));
app.use('/api/v1/contact', require('./routes/contact'));

app.use('/home', function(err, req, res) {
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

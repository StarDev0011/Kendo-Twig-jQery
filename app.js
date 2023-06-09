/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const redisController = require('./controller/redis');
const logger = require('./controller/logger');
let RedisStore = require("connect-redis")(session);

// noinspection JSUnusedLocalSymbols
function error(err, req, res, next) {
  // set locals, only providing error in development
  res.locals = {
    message: err.message,
    error: req.app.get('env') !== 'production' ? err : {}
  };

  logger.error(JSON.stringify(err));
  // render the error page
  res.status(err.status || 500);
  res.render('error');
}

const {createClient} = require("redis");
let redisClient = createClient(
  {
    legacyMode: true,
    url: redisController.url
  });
redisClient.connect()
           .catch((error) => {
             logger.error(JSON.stringify(error));
           });

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(
  session(
    {
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

// Log every request
app.use(function(req, res, next) {
  logger.debug(req.url);
  next();
});

app.use(['/', '/profile'], require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(error);

module.exports = app;

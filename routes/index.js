const express = require('express');
const router = express.Router();

const ldapController = require('../controller/ldap')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/home', function(req, res, next) {
  res.render('home', { isAdmin: false, isOps: true, name: 'Tony Amos' });
});

router.post('/login', async function(req, res, next) {
  let account = await ldapController.authenticateAccount(req.body.email, req.body.pwd)
  if(account) {
    res.render('home', { isAdmin: false, isOps: true, name: account.displayName });
  } else {
    res.render('index', { isAdmin: false, isOps: true, name: 'Tony Amos' });
  }
});

router.get('/forgot', function(req, res, next) {
  res.render('forgot');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

module.exports = router;

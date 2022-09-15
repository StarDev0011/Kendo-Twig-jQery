const express = require('express');
const router = express.Router();

const ldapController = require('../controller/ldap');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/home', isAuthenticated, function(req, res) {
  const account = req.session.account;
  res.render('home', {
    isManager: account.isManager,
    isOps: account.isOps,
    displayName: account.displayName
  });
});

router.post('/home', async function(req, res) {
  const promise = ldapController.authenticateAccount(req.body.email, req.body.pwd);
  promise
    .then((account) => {
      req.session.account = account;
      res.redirect('/home');
    })
    .catch((error) => {
      res.render('index', {message: error});
    });
});

router.get('/logout', function(req, res) {
  req.session.destroy(function() {
  });

  res.redirect('/');
});

router.get('/forgot', function(req, res) {
  if(req.session.account) {
    res.redirect('/home');
  } else {
    res.render('forgot');
  }
});

router.get('/register', function(req, res) {
  if(req.session.account) {
    res.redirect('/home');
  } else {
    res.render('register');
  }
});

function isAuthenticated(req, res, next) {
  if(req.session.account) {
    next();
  } else {
    res.redirect('/');
  }
}

module.exports = router;

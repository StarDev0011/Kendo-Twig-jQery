/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const router = require('express').Router(),
  ldapController = require('../controller/ldap'),
  mongodbController = require('../controller/mongodb'),
  product = require('../package'),
  pageVariables = {
    product: product.name,
    version: product.version,
    description: product.description,
    isManager: false,
    isOps: false,
    displayName: null,
    message: null,
    content: {}
  };

function setVariables(x) {
  const account = x.account === undefined ? null : x.account;
  const message = x.message === undefined ? null : x.message;
  const content = x.content === undefined ? {} : x.content;
  let result = Object.assign({}, pageVariables);

  if(account) {
    result.isOps = account.isOps;
    result.isManager = account.isManager;
    result.displayName = account.displayName;
  }

  if(message) {
    result.message = message;
  }

  if(content) {
    result.content = content;
  }

  return result;
}

router.get('/',
           (req, res) => {
             res.render('index', setVariables({}));
           });

router.get('/forgot',
           (req, res) => {
             if(req.session.account) {
               res.redirect('/home');
             } else {
               res.render('forgot', setVariables({}));
             }
           });

router.get('/register',
           (req, res) => {
             if(req.session.account) {
               res.redirect('/home');
             } else {
               res.render('register', setVariables({}));
             }
           });

router.get('/logout',
           (req, res) => {
             req.session.destroy(function() {
             });

             res.redirect('/');
           });

router.get('/home',
           isAuthenticated,
           (req, res) => {
             const account = req.session.account;
             const promise = mongodbController.contactSummary();

             console.log(account);
             promise
               .then((summary) => {
                 res.render('home', setVariables({account: account, content: summary}));
               })
               .catch((error) => {
                 res.render('index', setVariables({message: error}));
               });
           });

router.post('/home',
            async(req, res) => {
              const promise = ldapController.authenticateAccount(req.body.email, req.body.pwd);

              promise
                .then(account => {
                  req.session.account = account;
                  res.redirect('/home');
                })
                .catch((error) => {
                  res.render('index', setVariables({message: error}));
                });
            });

router.get('/search',
           isOps,
           (req, res) => {
             const account = req.session.account;
             res.render('search', setVariables({account: account}));
           });

router.get('/profile',
           isAuthenticated,
           (req, res) => {
             const account = req.session.account;

             res.render('profile', setVariables({account: account}));
           });

router.get('/admin',
           isManager,
           (req, res) => {
             const account = req.session.account;

             res.render('admin', setVariables({account: account}));
           });

function isAuthenticated(req, res, next) {
  if(req.session.account) {
    next();
  } else {
    res.redirect('/');
  }
}

function isManager(req, res, next) {
  const account = req.session.account;

  if(account && account.isManager) {
    next();
  } else {
    res.redirect('/home');
  }
}

function isOps(req, res, next) {
  const account = req.session.account;

  if(account && (account.isOps || account.isManager)) {
    next();
  } else {
    res.redirect('/home');
  }
}

module.exports = router;

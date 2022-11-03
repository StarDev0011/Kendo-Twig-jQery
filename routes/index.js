/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const router = require('express').Router(),
  ldapController = require('../controller/ldap'),
  product = require('../package'),
  pageVariables = {
    product: product.name,
    version: product.version,
    description: product.description,
    isManager: false,
    isOps: false,
    displayName: null,
    profileID: null,
    message: null,
    content: {},
    error: {}
  };

function setVariables(x) {
  const account = x.account === undefined ? null : x.account;
  const message = x.message === undefined ? null : x.message;
  const content = x.content === undefined ? {} : x.content;
  const error = x.error === undefined ? {} : x.error;
  let result = Object.assign({}, pageVariables);

  if(account) {
    result.isOps = account.isOps;
    result.isManager = account.isManager;
    result.displayName = account.displayName;
    result.profileID = account.profileID;
  }

  if(message) {
    result.message = message;
  }

  if(content) {
    result.content = content;
  }

  if(error) {
    result.error = error;
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

router.get('/home', isAuthenticated, (req, res) => {
  const account = req.session.account;

  res.render('home', setVariables({account: account}));
});

router.post('/home', async(req, res) => {
  const email = req.body.email;
  const promise = ldapController.authenticateAccount(email, req.body.pwd);

  promise
    .then(account => {
      req.session.account = account;
      res.redirect('/home');
    })
    .catch((error) => {
      res.render('index', setVariables({message: error}));
    });
});

router.get('/search', isOps, (req, res) => {
  const account = req.session.account;

  res.render('search', setVariables({account: account}));
});

router.get('/profile/:profileID', isAuthenticated, (req, res) => {
  const profileID = req.params.profileID,
    account = req.session.account;

  if(account.profileID === profileID || (account.isManager || account.isOps)) {
    const content = {
      profileID: profileID
    };

    res.render('profile', setVariables({account: account, content: content}));
  } else {
    const variables = {
      account: account,
      content: content,
      message: "Bad Request",
      error: {status: 404, stack: null}
    };

    res.render("error", setVariables(variables));
  }
});

router.get('/admin', isManager, (req, res) => {
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

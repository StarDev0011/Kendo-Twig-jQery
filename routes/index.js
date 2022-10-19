const router = require('express').Router(),
  ldapController = require('../controller/ldap'),
  mongodbController = require('../controller/mongodb');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/home', isAuthenticated, function(req, res) {
  const account = req.session.account;
  const promise = mongodbController.contactSummary();
  promise
    .then((summary) => {
      res.render('home', {
        isManager: account.isManager,
        isOps: account.isOps,
        displayName: account.displayName,
        summary: summary
      });
    })
    .catch((error) => {
      res.render('index', {message: error});
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

router.get('/admin', isManager, function(req, res) {
  const account = req.session.account;
  res.render('admin', {
    isManager: account.isManager,
    isOps: account.isOps,
    displayName: account.displayName
  });
});

router.get('/search', isOps, function(req, res) {
  const account = req.session.account;
  res.render('search', {
    isManager: account.isManager,
    isOps: account.isOps,
    displayName: account.displayName
  });
});

router.get('/profile', isAuthenticated, function(req, res) {
  const account = req.session.account;
  res.render('profile', {
    isManager: account.isManager,
    isOps: account.isOps,
    displayName: account.displayName
  });
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

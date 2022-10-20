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

function setVariables({account = null, message = null, content = {}}) {
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

router.get('/', function(req, res) {
  res.render('index', setVariables({}));
});

router.get('/forgot', function(req, res) {
  if(req.session.account) {
    res.redirect('/home');
  } else {
    res.render('forgot', setVariables({}));
  }
});

router.get('/register', function(req, res) {
  if(req.session.account) {
    res.redirect('/home');
  } else {
    res.render('register', setVariables({}));
  }
});

router.get('/logout', function(req, res) {
  req.session.destroy(function() {
  });

  res.redirect('/');
});

router.get('/home', isAuthenticated, function(req, res) {
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

router.post('/home', async function(req, res) {
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

router.get('/search', isOps, function(req, res) {
  const account = req.session.account;
  res.render('search', setVariables({account: account}));
});

router.get('/profile', isAuthenticated, function(req, res) {
  const account = req.session.account;
  res.render('profile', setVariables({account: account}));
});

router.get('/admin', isManager, function(req, res) {
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

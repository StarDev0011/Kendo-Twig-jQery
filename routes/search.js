const router = express.Router();

const ldapController = require('../controller/ldap');
const mongodbController = require('../controller/mongodb');
const express = require('express');

router.get('/contactSearch', function(req, res) {
  const promise = mongodbController.contactSearch();
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

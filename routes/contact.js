const router = require('express').Router(),
  mongodbController = require('../controller/mongodb');

router.post('/search', function(req, res) {
  const promise = mongodbController.contactSearch(req.body);
  promise
    .then((contacts) => {
      res.json(contacts);
    })
    .catch((error) => {
      res.json({message: error});
    });
});

module.exports = router;

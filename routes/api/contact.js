/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const router = require('express').Router(),
  mongodbController = require('../../controller/mongodb');

router.post('/search',
            (req, res) => {
              const promise = mongodbController.contactSearch(req.body);

              promise
                .then((contacts) => {
                  res.json(contacts);
                })
                .catch((error) => {
                  res.status(400).send({message: error.message});
                });
            });

router.get('/profile/:profileID',
           (req, res) => {
             const promise = mongodbController.profile(req.params.profileID);
             console.log(`searching for '${req.params.profileID}'`);

             promise
               .then((profile) => {
                 if(profile.length === 0) {
                   res.status(404).send({message: 'Profile was not found'});
                 } else {
                   console.log(`Retrieved profile ${profile[0].familyName}`);
                   res.json(profile[0]);
                 }
               })
               .catch((error) => {
                 res.status(400).send({message: error.message});
               });
           });

module.exports = router;

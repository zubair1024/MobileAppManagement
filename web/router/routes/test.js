"use strict";

const express = require('express'),
    router = express.Router(),
    auth = require('../basic-auth');


//test home routes
router
    .get('/', function (req, res) {
        res.json({ "data": "I’m Bender, baby! Oh god, please insert liquor!!!" });
    })
    .post('/', auth, function (req, res) {
        res.status(200).send({ "status": "success", "message": "Successful POST" });
    })
    .delete('/', auth, function (req, res) {
        res.status(200).send({ "status": "success", "message": "Successful DELETE" });
    });

//being random
router.post('/liquor', auth, function (req, res) {
    res.json({ "data": "Thank you baby!" });
});

//some generic status routes
router
    .all('/404', function (req, res) {
        res.sendStatus(404);
    })
    .all('/401', function (req, res) {
        res.sendStatus(401);
    })
    .all('/500', function (req, res) {
        res.sendStatus(500);
    });



module.exports = router;
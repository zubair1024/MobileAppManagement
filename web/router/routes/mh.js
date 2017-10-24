"use strict";

const express = require('express'),
    router = express.Router(),
    transformer = require('../../transformer/transforms/mh');


//message handler routes
router.get('/', function (req, res) {
    res.json({
        "Message": "Response from platform: Message Handler you are clear to send information",
        "Status": true
    });
});


/**
 * Post a sensor message event
 */
router.post('/gps', function (req, res) {
    console.log(req.body);
    if (req) {
        try {
            //validate the data
            let error = transformer.validate(req.body);

            if (error) {
                res.status(500).send({
                    "Message": error,
                    "Status": false
                });
            } else {
                let transformed = transformer.transform(req.body);
                //Specify the event type
                transformed.eventType = 'Shadow GPS Report';
                new db.SensorMessageEvent(transformed).save(function (err) {
                    if (err) {
                        console.log(err);
                        res.status(500).send({
                            "Message": "Response from platform: Error",
                            "Status": false
                        });
                        throw err
                    } else {
                        res.status(200).send({
                            "Message": "Response from platform: Success",
                            "Status": true
                        });
                    }
                });
            }
        } catch (err) {
            res.status(500).send({
                "Message": err,
                "Status": false
            });
        }
    }
});

/**
 * Post a chat message event
 */
router.post('/chat_message', function (req, res) {
    if (req) {
        try {
            //validate the data
            let error = transformer.validate(req.body);

            if (error) {
                res.status(500).send({
                    "Message": error,
                    "Status": false
                });
            } else {
                let data = transformer.transform(req.body);
                data.eventType = 'Shadow Chat Message';
                //TODO some validation and transformation?
                new db.SensorMessageEvent(data).save(function (err) {
                    if (err) {
                        res.status(500).send({
                            "Message": "Response from platform: Error",
                            "Status": false
                        });
                        throw err
                    } else {
                        res.status(200).send({
                            "Message": "Response from platform: Success",
                            "Status": true
                        });
                    }
                });
            }
        } catch (err) {
            console.log('error: ', err);
            res.status(500).send({
                "Message": err,
                "Status": false
            });
        }
    }
});







module.exports = router;
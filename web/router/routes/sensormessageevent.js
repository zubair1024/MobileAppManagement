"use strict";

const express = require('express'),
    router = express.Router(),
    isAuthenticated = require('../session-auth'),
    paginator = require('../../utils/pagination-helper');

//SensorMessageEvent routes
router
    /**
     * Grab all events
     */
    .get('/', isAuthenticated, function (req, res) {
        let promise = new Promise((resolve, reject) => {
            paginator.getParams(req, resolve);
        });

        promise.then((obj) => {
            db.SensorMessageEvent.paginate(obj.filter, {
                page: obj.page,
                limit: obj.limit,
                select: obj.select,
                sort: obj.sort
            }, function (err, data) {
                if (err) {
                    res.status(500).send({ "status": "error", "message": err });
                } else {
                    res.json({ "status": "success", "data": data });
                };
            });
        });
    })
    /**
     * Delete a specific event
     */
    .delete('/:eventId', function (req, res) {
        if (req.params) {
            db.SensorMessageEvent.findByIdAndRemove(req.params.eventId, function (err, data) {
                if (err) {
                    res.status(500).send({ "status": "error", "message": "There was an error deleting the event." });
                    throw err
                } else {
                    res.status(200).send({ "status": "success", "message": "Event removed successfully." });
                }
            });
        }
    })

module.exports = router;
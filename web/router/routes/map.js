"use strict";

const express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"),
  auth = require("../basic-auth"),
  isAuthenticated = require("../session-auth");
  

//user routes
router
  /**
     * Get all users
     */
  .get("/assets", function(req, res) {
    //params for pagination
    let aggregation = [];

    //sorter
    aggregation.push({ $sort: { eventTime: -1 } });

    //matcher
    if (req.query) {
      if (req.query["ids"]) {
        let ids = req.query["ids"].split(',');
        for(let i= 0; i < ids.length;i++){
          ids[i] = mongoose.Types.ObjectId(ids[i]);
        }
        aggregation.push({
          $match: {
            _asset: { $in: ids }
          }
        });
      }
    }

    //grouper
    aggregation.push(
      {
        $match: {
          latitude: { $exists: true },
          longitude: { $exists: true },
          _asset: { $exists: true }
        }
      },
      {
        $group: {
          _id: "$imei",
          eventTime: { $last: "$eventTime" },
          eventType: { $last: "$eventType" },
          createdTime: { $last: "$createdTime" },
          latitude: { $last: "$latitude" },
          longitude: { $last: "$longitude" },
          _asset: { $last: "$_asset" },
          engineStatus: { $last: "$engineStatus" },
          powerSupplyVoltage: { $last: "$powerSupplyVoltage" },
          engineHourMeter: { $last: "$engineHourMeter" },
          engineCoolantTemperature: { $last: "$engineCoolantTemperature" },
          oilPressure: { $last: "$oilPressure" }
        }
      },
      {
        $lookup: {
          from: "assets",
          localField: "_asset",
          foreignField: "_id",
          as: "_asset"
        }
      },
      {
        $unwind: "$_asset"
      },
      {
        $project: {
          eventTime: 1,
          eventType: 1,
          createdTime: 1,
          latitude: 1,
          longitude: 1,
          "_asset._id": 1,
          "_asset.name": 1,
          "_asset.pState": 1,
          "_asset.status": 1,
          "_asset.features": 1,
          engineStatus: 1,
          powerSupplyVoltage: 1,
          engineHourMeter: 1,
          engineCoolantTemperature: 1,
          oilPressure: 1
        }
      },
      {
        $match: {
          "_asset.pState": 1
        }
      }
    );

    //query the db
    db.SensorMessageEvent.aggregate(aggregation, function(err, data) {
      if (err) {
        res.status(500).send({ status: "error", message: err });
      } else {
        res.json({ status: "success", data: data });
      }
    });
  });

module.exports = router;

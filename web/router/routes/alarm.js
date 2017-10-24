"use strict";

const express = require("express"),
  router = express.Router(),
  auth = require("../basic-auth"),
  extend = require("util")._extend,
  passport = require("passport"),
  isAuthenticated = require("../session-auth"),
  alarmProcessor = require("../../../db/alarmProcessor"),
  paginator = require("../../utils/pagination-helper");

//user routes
router
  /**
     * Get all users
     */
  .get("/",isAuthenticated, function(req, res) {
    let promise = new Promise((resolve, reject) => {
      paginator.getParams(req, resolve);
    });

    promise.then(obj => {
      db.Alarm.paginate(
        obj.filter,
        {
          page: obj.page,
          limit: obj.limit,
          sort: obj.sort,
          populate: {
            path: "_asset",
            select: { _id: 1, name: 1 }
          },
           select: obj.select
        },
        function(err, data) {
          if (err) {
            res.status(500).send({ status: "error", message: err });
          } else {
            res.json({ status: "success", data: data });
          }
        }
      );
    });
  })
  .get("/count",isAuthenticated, function(req, res) {
    db.Alarm.count({'triggered':true}, function( err, count){
       if (err) {
            res.status(500).send({ status: "error", message: err });
          } else {
            res.json({ status: "success", data: count });
          }
        });
  })
  /**
     * Reset Alarm
     */
  .put("/reset", function(req, res) {
    var me = this, dataItem = req.body, resetTime = Date.now();

    if (dataItem) {
      //find asset
      db.Asset.findOne(
        {
          _id: dataItem.alarm._asset._id
        },
        function(err, asset) {
          if (err) {
            console.log(err);
          } else {
            //create or update alarm
            db.Alarm.findOneAndUpdate(
              {
                _id: dataItem.alarm._id
              },
              {
                triggered: false,
                triggerTime: resetTime
              },
              {
                new: true,
                upsert: true
              },
              function(err, alarm) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Reset Alarm transacted successfully");
                  //create an alarm event
                  new db.AlarmEvent({
                    _asset: dataItem.alarm._asset._id,
                    _alarm: dataItem.alarm._id,
                    pState: 1,
                    alarmName: dataItem.alarm.name,
                    eventType: "reset"
                  }).save(function(err, alarmEvent) {
                    if (err) {
                      console.log("error transacting event");
                      console.log(err);
                    } else {
                      console.log("Reset Alarm Event transacted successfully");

                      let monitoredFeature = dataItem.alarm.monitoredFeature;

                      //set the alarmed state
                      asset.features[monitoredFeature.name].triggered = false;

                      //triggerTime
                      asset.features[
                        monitoredFeature.name
                      ].triggerTime = resetTime;

                      //persist the eventId on the asset
                      asset.features[monitoredFeature.name]._alarmEvent =
                        alarmEvent._id;

                      //transact and save asset
                      db.Asset.findOneAndUpdate(
                        {
                          _id: asset._id
                        },
                        asset,
                        {
                          new: true,
                          upsert: true
                        },
                        function(err) {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log("Reset Asset Alarm Successfully");
                            res.json({
                              status: "success",
                              message: "Alarm Reset Successful"
                            });
                          }
                        }
                      );
                    }
                  });

                  //end
                }
              }
            );

            //end
          }
        }
      );
    } else {
      res
        .status(500)
        .json({
          status: "error",
          message: "body of the request is empty or incorrect"
        });
    }
  });

module.exports = router;

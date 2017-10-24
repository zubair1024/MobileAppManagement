"use strict";

const express = require("express"),
  async = require("async"),
  moment = require("moment"),
  router = express.Router(),
  paginator = require("../../utils/pagination-helper"),
  extend = require("util")._extend;

//message handler routes
router
  .get("/liveoperationalstatistic", function(req, res) {
    //get the last/latest doc
    db.LiveOperationalStatistic
      .findOne({})
      .sort({ $natural: -1 })
      .exec(function(err, stats) {
        if (err) {
          res.status(500).json({
            status: "error",
            message: err
          });
        } else {
          if (stats) {
            if (stats.startTime) {
              //if data exists get the last day's information for comparison
              db.LiveOperationalStatistic
                .findOne({
                  startTime: { lte: moment(stats.startTime).add(-1, "m") }
                })
                .sort({ $natural: -1 })
                .limit(1)
                .exec(function(err, preStats) {
                  res.status(200).json({
                    status: "success",
                    data: {
                      current: stats,
                      previous: preStats
                    }
                  });
                });
            } else {
              res.status(200).json({
                status: "success",
                data: {
                  current: stats
                }
              });
            }
          }
        }
      });
  })
  .get("/generatorenginerating", function(req, res) {
    //get the last/latest doc
    db.ETLCustomer
      .find(
        {},
        {
          _id: 0,
          generatorEngineRating: 1,
          endTime: 1,
          nextRunTime: 1
        }
      )
      .sort({ $natural: -1 })
      .limit(1)
      .exec(function(err, stats) {
        if (err) {
          res.status(500).json({
            status: "error",
            message: err
          });
        } else {
          res.status(200).json({
            status: "success",
            data: stats
          });
        }
      });
  })
  .get("/generatorenginerating/:id", function(req, res) {
    //get the last/latest doc
    if (req.params && req.params.id) {
      db.ETLProject
        .find(
          { project: req.params.id },
          {
            _id: 0,
            generatorEngineRating: 1,
            endTime: 1,
            nextRunTime: 1
          }
        )
        .sort({ $natural: -1 })
        .limit(1)
        .exec(function(err, stats) {
          if (err) {
            res.status(500).json({
              status: "error",
              message: err
            });
          } else {
            res.status(200).json({
              status: "success",
              data: stats
            });
          }
        });
    } else {
      res.status(500).json({
        status: "error",
        message: "Insufficient parameters"
      });
    }
  })
  .get("/generatorcapacity", function(req, res) {
    //get the last/latest doc
    db.ETLCustomer
      .find(
        {},
        {
          _id: 0,
          generatorCapacity: 1,
          endTime: 1,
          nextRunTime: 1
        }
      )
      .sort({ $natural: -1 })
      .limit(1)
      .exec(function(err, stats) {
        if (err) {
          res.status(500).json({
            status: "error",
            message: err
          });
        } else {
          res.status(200).json({
            status: "success",
            data: stats
          });
        }
      });
  })
  .get("/generatorcapacity/:id", function(req, res) {
    //get the last/latest doc
    if (req.params && req.params.id) {
      db.ETLProject
        .find(
          {
            project: req.params.id
          },
          {
            _id: 0,
            generatorCapacity: 1,
            endTime: 1,
            nextRunTime: 1
          }
        )
        .sort({ $natural: -1 })
        .limit(1)
        .exec(function(err, stats) {
          if (err) {
            res.status(500).json({
              status: "error",
              message: err
            });
          } else {
            res.status(200).json({
              status: "success",
              data: stats
            });
          }
        });
    }
  })
  .get("/projectUtilization/poweroutputkwdaily", function(req, res) {
    let result = [];
    //get all projects
    db.Project.find({ pState: 1 }, function(err, projects) {
      //if projects are avaliable
      if (projects && projects.length) {
        //try promise
        var promises = projects.map(function(project) {
          return new Promise(function(resolve, reject) {
            db.ETLProjectUtilization
              .find(
                {
                  _project: project._id
                },
                {
                  _project: 1,
                  powerOutputKW: 1,
                  startTime: 1
                }
              )
              .sort({
                startTime: -1
              })
              .populate("_project")
              //get last 7 values
              .limit(7)
              .exec(function(err, data) {
                //check if there is data and push
                if (data && data.length) {
                  result.push(data[0]);
                }
                resolve();
              });
          });
        });

        //once all promises are resolved
        Promise.all(promises)
          .then(function() {
            res.status(200).json({
              status: "success",
              data: result
            });
          })
          .catch(console.error);
      } else {
        res.status(200).json({
          status: "success",
          data: []
        });
      }
    });
  })
  /**
     * Get Utilization Statistics 
     */
  .get("/assetutilization", function(req, res) {
    //get params through a promise, cause I'm async :)
    let promise = new Promise((resolve, reject) => {
      paginator.getParams(req, resolve);
    });

    promise.then(obj => {
      //forget the deleted objects
      obj.filter = extend(obj.filter, { pState: 1 });

      //extending with tags if needed
      if (obj.filter.tags) {
        let tags = obj.filter.tags.split(",");
        if (tags.length > 0) {
          obj.filter = extend(obj.filter, { tags: { $in: tags } });
        } else {
          delete obj.filter.tags;
        }
      } else {
        delete obj.filter.tags;
      }
      console.log(obj);
      //find asset through pagination
      db.ETLAssetUtilization.paginate(
        {},
        {
          page: obj.page,
          limit: obj.limit,
          select: obj.select,
          sort: obj.sort,
          populate: {
            path: "_asset",
            select: { _id: 1, name: 1, pState: 1 }
          }
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
  });

module.exports = router;

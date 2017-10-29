"use strict";

const express = require("express"),
  router = express.Router(),
  auth = require("../basic-auth"),
  passport = require("passport"),
  isAuthenticated = require("../session-auth"),
  paginator = require("../../utils/pagination-helper"),
  extend = require("util")._extend;

//user routes
router
  /**
     * Get all users
     */
  .get("/find/", isAuthenticated, function(req, res) {
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

      //get assets
      db.Ad
        .find(obj.filter)
        .select("_id name objectType")
        .sort({ createdTime: -1 })
        .limit(10)
        .exec(function(err, results) {
          if (err) {
            res.status(500).send({ status: "error", message: err });
          } else {
            //get projects
            db.Project
              .find(obj.filter)
              .select("_id name objectType")
              .sort({ createdTime: -1 })
              .limit(10)
              .exec(function(err, projects) {
                if (err) {
                  res.status(500).send({ status: "error", message: err });
                } else {
                  results.push.apply(results, projects);
                  res.json({
                    d: {
                      results: results,
                      __count: 10
                    }
                  });
                }
              });
          }
        });
    });
  })
  /**
     * find locations
     */
  .get("/find/location", isAuthenticated, function(req, res) {
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

      //get assets
      db.Location
        .find(obj.filter)
        .select("_id name objectType")
        .sort({ createdTime: -1 })
        .limit(10)
        .exec(function(err, results) {
          if (err) {
            res.status(500).send({ status: "error", message: err });
          } else {
            res.json({
              d: {
                results: results,
                 __count: 10
                }
            });
          }
        });
    });
  });

module.exports = router;

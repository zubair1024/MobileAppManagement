"use strict";

const express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"),
  auth = require("../basic-auth"),
  isAuthenticated = require("../session-auth"),
  paginator = require("../../utils/pagination-helper"),
  extend = require("util")._extend;


/**
* Multer file upload setup
*/
var multer = require("multer");
var path = require("path");

var storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "public/uploads/files/");
  // },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: multer.memoryStorage() });

//locations routes
router
  /**
     * Get all locations paginated
     */
  .get("/", function (req, res) {
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

      //find asset through pagination
      db.Location.paginate(
        obj.filter,
        {
          page: obj.page,
          limit: obj.limit,
          select: obj.select,
          sort: obj.sort
        },
        function (err, data) {
          if (err) {
            res.status(500).send({ status: "error", message: err });
          } else {
            res.json({ status: "success", data: data });
          }
        }
      );
    });
  })
  /**
     * Creating a new location
     */
  .post("/", function (req, res) {
    if (req) {
      //TODO some validation and transformation?
      //perform some sanity check
      if (req.body.name) {
        //adding pState value
        req.body = extend(req.body, { pState: 1 });

        new db.Location(req.body).save(function (err) {
          if (err) {
            res.status(500).send({
              status: "error",
              error: "There was an error saving the location."
            });
            throw err;
          } else {
            res.status(200).send({
              status: "success",
              message: "Location saved successfully."
            });
          }
        });
      } else {
        res.status(500).send({
          status: "error",
          message: "Insufficient information was provided."
        });
      }
    }
  })
  /**
     * Delete asset by id
     */
  .delete("/", function (req, res) {
    if (req.body) {
      //update the pState to 6 for removal
      db.Location.findOneAndUpdate({ _id: req.body._id }, { pState: 6 }, function (
        err,
        asset
      ) {
        if (err) {
          res.status(500).send({
            status: "error",
            message: "There was an error updating the location."
          });
          throw err;
        } else {
          res.status(200).send({
            status: "success",
            message: "Location removed successfully."
          });
        }
      });
    }
  })
  /**
   * Mass upload locations
   */
  .post("/upload", upload.array("files"), function (req, res) {
    let data = [], inserted = [], failed = [];
    
    if (req.files[0]) {
      //if it is a csv file
      if (req.files[0].originalname.match('.csv')) {
        let rows = req.files[0].buffer.toString().split('\r\n');
        //name, type, latitude, longitude
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i].split(',');
          db.Location.findOne({
            "name": row[0],
            "pState": 1
          }, function (err, location) {
            if (err) {
              console.log(err);
            } else {
              if (!location || !location.name) {
                //save location
                new db.Location({
                  "name": row[0],
                  "type": row[1],
                  "latitude": parseFloat(row[2]),
                  "longitude": parseFloat(row[3]),
                  "pState": 1,
                }).save(function (err) {
                  if (err) {
                    failed.push(row[i]);
                  } else {
                    inserted.push(row[i]);
                  }
                });
              }
            }
          });
        }
      }
      else if (req.files[0].originalname.match('.json')) {

      }
      res.status(200).send({
        status: "success",
        message: `Inserted:${inserted.length}, Failed:${failed.length}`
      });
    }
  })

module.exports = router;

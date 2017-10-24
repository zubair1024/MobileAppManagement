"use strict";

const express = require("express"),
  router = express.Router(),
  auth = require("../basic-auth"),
  passport = require("passport"),
  isAuthenticated = require("../session-auth"),
  paginator = require("../../utils/pagination-helper"),
  extend = require("util")._extend;

/**
 * Multer file upload setup
 */
var multer = require("multer");
var path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/assets/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

//user routes
router
  /**
     * Get all users
     */
  .get("/", isAuthenticated, function (req, res) {
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

      //extending with ids if needed
      if (obj.filter.ids) {
        let ids = obj.filter.ids.split(",");
        if (ids.length > 0) {
          obj.filter = extend(obj.filter, { _id: { $in: ids } });
          delete obj.filter.ids;
        } else {
          delete obj.filter.ids;
        }
      } else {
        delete obj.filter.ids;
      }

      //find asset through pagination
      db.Asset.paginate(
        obj.filter,
        {
          page: obj.page,
          limit: obj.limit,
          select: obj.select,
          sort: obj.sort,
          populate: {
            path: "_projects",
            select: { _id: 1, name: 1 }
          }
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
     * Creating a new asset
     */
  .post("/", isAuthenticated, function (req, res) {
    if (req) {
      //TODO some validation and transformation?
      //perform some sanity check
      if (req.body.name) {
        new db.Asset(req.body).save(function (err) {
          if (err) {
            res.status(500).send({
              status: "error",
              error: "There was an error saving the asset."
            });
            throw err;
          } else {
            res.status(200).send({
              status: "success",
              message: "Asset saved successfully."
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
    * Get asset by id
    */
  .get("/sensor/:id", isAuthenticated, function (req, res) {
    if (req.params) {
      // get asset by assetName
      db.Asset.find({ sensor: req.params.id }, function (err, asset) {
        if (err) {
          throw err;
        } else {
          res.json({ status: "success", data: asset });
        }
      });
    }
  })
  /**
     * Update asset by id
     */
  .put("/sensor/:id", isAuthenticated, function (req, res) {
    if (req.params) {
      db.Asset.findOneAndUpdate({ sensor: req.params.id }, req.body, function (
        err,
        asset
      ) {
        if (err) {
          res.status(500).send({
            status: "error",
            message: "There was an error updating the asset."
          });
          throw err;
        } else {
          res.status(200).send({
            status: "success",
            message: "Asset updated successfully."
          });
        }
      });
    }
  })
  /**
    * Get asset by id
    */
  .get("/id/:id", isAuthenticated, function (req, res) {
    if (req.params) {
      // get asset by id
      db.Asset
        .find({ _id: req.params.id })
        .populate("_projects")
        .exec(function (err, asset) {
          if (err) {
            throw err;
          } else {
            res.json({ status: "success", data: asset });
          }
        });
    }
  })
  /**
     * Update asset by id
     */
  .put("/id/:id", isAuthenticated, function (req, res) {
    if (req.params) {
      db.Asset.findOneAndUpdate({ _id: req.params.id }, req.body, function (
        err,
        asset
      ) {
        if (err) {
          res.status(500).send({
            status: "error",
            message: "There was an error updating the asset."
          });
          throw err;
        } else {
          res.status(200).send({
            status: "success",
            message: "Asset updated successfully."
          });
        }
      });
    }
  })
  /**
     * Delete asset by id
     */
  .delete("/id/:id", isAuthenticated, function (req, res) {
    if (req.params) {
      //update the pState to 6 for removal
      db.Asset.findOneAndUpdate({ _id: req.params.id }, { pState: 6 }, function (
        err,
        asset
      ) {
        if (err) {
          res.status(500).send({
            status: "error",
            message: "There was an error updating the asset."
          });
          throw err;
        } else {
          res.status(200).send({
            status: "success",
            message: "Asset removed successfully."
          });
        }
      });
    }
  })
  /**
     * Get user by loginName
     */
  .get("name/:assetName", isAuthenticated, function (req, res) {
    if (req.params) {
      // get asset by assetName
      db.Asset.find({ name: req.params.name }, function (err, asset) {
        if (err) {
          throw err;
        } else {
          res.json({ status: "success", data: asset });
        }
      });
    }
  })
  /**
     * Update asset by assetName
     */
  .put("name/:assetName", isAuthenticated, function (req, res) {
    if (req.params) {
      db.Asset.findOneAndUpdate({ name: req.params.name }, req.body, function (
        err,
        asset
      ) {
        if (err) {
          res.status(500).send({
            status: "error",
            message: "There was an error updating the asset."
          });
          throw err;
        } else {
          res.status(200).send({
            status: "success",
            message: "Asset updated successfully."
          });
        }
      });
    }
  })
  /**
     * Delete a asset by assetName
     */
  .delete("name/:assetName", isAuthenticated, function (req, res) {
    if (req.params) {
      db.Asset.findOneAndRemove({ name: req.params.name }, function (
        err,
        asset
      ) {
        if (err) {
          res.status(500).send({
            status: "error",
            message: "There was an error updating the asset."
          });
          throw err;
        } else {
          res.status(200).send({
            status: "success",
            message: "Asset removed successfully."
          });
        }
      });
    }
  })
  /**
     * Delete a asset by assetName
     */
  /**
    * Upload an avatar
    */
  .post("/photo", upload.array("images"), function (req, res, next) {
    if (req.files && req.files.length > 0) {
      let file = req.files[0], imageUrl;

      //check file type
      if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        db.Asset.findOneAndUpdate(
          { _id: req.body._id },
          { imageUrl: file.originalname },
          function (err, asset) {
            if (err) {
              res.status(500).send({
                status: "error",
                message: "There was an error updating the asset."
              });
              throw err;
            } else {
              res.status(200).send({
                status: "success",
                message: "Asset avatar updated successfully"
              });
            }
          }
        );
      } else {
        res
          .status(500)
          .send({ status: "error", message: "Invalid file type." });
      }
    }
  })
  /**
     * Send Command
     */
  .post("/command", isAuthenticated, function (req, res) {
    if (req.params) {
      if (comSpeaker) {
        comSpeaker.request('command', req.body, function (data) {
          res
            .status(200)
            .send({ status: "success", message: data.message });
        });
      } else {
        res
          .status(500)
          .send({ status: "error", message: "The communication server is not avaliable." });
      }
    }
  })
  /**
     * Send Raw Command
     */
  .post("/rawCommand", isAuthenticated, function (req, res) {
    if (req.params) {
      if (comSpeaker) {
        comSpeaker.request('command', req.body, function (data) {
          res
            .status(200)
            .send({ status: "success", message: data.message });
        });
      } else {
        res
          .status(500)
          .send({ status: "error", message: "The communication server is not avaliable." });
      }
    }
  })
  /**
   * Get command mapping
   */
  .get("/commandmapping", function (req, res) {
    db.CommandMapping.findOne({}, (err, data) => {
      if (err) {
        res
          .status(500)
          .send({ status: "error", message: err });
      } else {
        res.status(200).send(data);
      }
    });
  })

module.exports = router;

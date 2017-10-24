"use strict";

const express = require("express"),
  router = express.Router(),
  auth = require("../basic-auth"),
  passport = require("passport"),
  async = require("async"),
  isAuthenticated = require("../session-auth"),
  paginator = require("../../utils/pagination-helper"),
  extend = require("util")._extend;

/**
 * Multer file upload setup
 */
var multer = require("multer");
var path = require("path");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads/assets/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

//user routes
router
  /**
     * Get all users
     */
  .get("/", isAuthenticated, function(req, res) {
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
      db.Project.paginate(
        obj.filter,
        {
          page: obj.page,
          limit: obj.limit,
          select: obj.select,
          sort: obj.sort,
          populate: {
            path: "assets",
            select: { _id: 1, name: 1 }
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
  })
  /**
     * Creating a new project
     */
  .post("/", isAuthenticated, function(req, res) {
    if (req) {
      //TODO some validation and transformation?
      //perform some sanity check
      req.body.assets = req.body.assets.length
        ? req.body.assets.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
          })
        : [];
      if (req.body.name) {
        new db.Project(req.body).save(function(err, project) {
          if (err) {
            res.status(500).send({
              status: "error",
              error: "There was an error saving the project."
            });
            throw err;
          } else {
            //save project name on the asset start
            if (project.assets && project.assets.length) {
              //update all necessary assets
              async.times(
                project.assets.length,
                function(n, next) {
                  db.Asset.findByIdAndUpdate(
                    project.assets[n],
                    {
                      $addToSet: {
                        _projects: project._id
                      }
                    },
                    function(err, asset) {
                      if (err) {
                        throw err;
                      } else {
                        next(err, asset);
                      }
                    }
                  );
                },
                function(err, assets) {
                  //save project name on the asset end
                  res.status(200).send({
                    status: "success",
                    message: "Project saved successfully."
                  });
                }
              );
            } else {
              //save project name on the asset end
              res.status(200).send({
                status: "success",
                message: "Project saved successfully."
              });
            }
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
    * Get project by id
    */
  .get("/id/:id", isAuthenticated, function(req, res) {
    if (req.params) {
      db.Project
        .find({ _id: req.params.id })
        // .populate("assets")
        .exec((err, asset) => {
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
  .put("/id/:id", isAuthenticated, function(req, res) {
    if (req.params) {
      //TODO some validation and transformation?
      //perform some sanity check
      req.body.assets = req.body.assets.length
        ? req.body.assets.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
          })
        : [];
      db.Project.findOneAndUpdate({ _id: req.params.id }, req.body, function(
        err,
        project
      ) {
        //removal the project from assets that have been deallocated
        let forRemoval = req.body.assets.length ? [] : project.assets;
        if (forRemoval.length == 0) {
          loop1: for (var i = 0; i < project.assets.length; i++) {
            loop2: for (var j = 0; j < req.body.assets.length; j++) {
              if (req.body.assets[j] == project.assets[i]) {
                break loop2;
              } else {
                forRemoval.push(project.assets[i]);
                continue loop1;
              }
            }
          }
        }
        //remove respective assets from the _project
        async.times(
          forRemoval.length,
          function(n, next) {
            db.Asset.findByIdAndUpdate(
              forRemoval[n].toString(),
              { $pull: { _projects: project._id } },
              function(err, asset) {
                next(err, asset);
              }
            );
          },
          function(err, assets) {
            if (err) {
              res.status(500).send({
                status: "error",
                message: "There was an error updating the project."
              });
              throw err;
            } else {
              //save project name on the asset start
              if (req.body.assets && req.body.assets.length) {
                //update all necessary assets
                async.times(
                  req.body.assets.length,
                  function(n, next) {
                    db.Asset.findByIdAndUpdate(
                      req.body.assets[n],
                      {
                        $addToSet: {
                          _projects: project._id
                        }
                      },
                      function(err, asset) {
                        if (err) {
                          throw err;
                        } else {
                          next(err, asset);
                        }
                      }
                    );
                  },
                  function(err, assets) {
                    //save project name on the asset end
                    res.status(200).send({
                      status: "success",
                      message: "Asset updated successfully."
                    });
                  }
                );
              } else {
                //save project name on the asset end
                res.status(200).send({
                  status: "success",
                  message: "Project updated successfully."
                });
              }
            }
          }
        );
      });
    }
  })
  /**
     * Delete asset by id
     */
  .delete("/id/:id", isAuthenticated, function(req, res) {
    if (req.params) {
      db.Project.findById(req.params.id, function(err, project) {
        //remove respective assets from the _project
        if (project.assets) {
          async.times(
            project.assets.length,
            function(n, next) {
              if (project.assets[n]) {
                db.Asset.findByIdAndUpdate(
                  project.assets[n].toString(),
                  { $pull: { _projects: project._id } },
                  function(err, asset) {
                    next(err, asset);
                  }
                );
              } else {
                next(err, {});
              }
            },
            function(err, assets) {
              if (err) {
                res.status(500).send({
                  status: "error",
                  message: "There was an error updating the project."
                });
                throw err;
              } else {
                //update the pState to 6 for removal
                db.Project.findOneAndUpdate(
                  { _id: req.params.id },
                  {
                    pState: 6,
                    assets: []
                  },
                  function(err, project) {
                    if (err) {
                      res.status(500).send({
                        status: "error",
                        message: "There was an error updating the asset."
                      });
                      throw err;
                    } else {
                      res.status(200).send({
                        status: "success",
                        message: "Project removed successfully."
                      });
                    }
                  }
                );
              }
            }
          );
        } else {
          res.status(200).send({
            status: "success",
            message: "Project removed successfully."
          });
        }
      });
    }
  })
  /**
     * Get user by loginName
     */
  .get("/:projectName", isAuthenticated, function(req, res) {
    if (req.params) {
      // get asset by assetName
      db.Project.find({ name: req.params.name }, function(err, asset) {
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
  .put("/:projectName", isAuthenticated, function(req, res) {
    if (req.params) {
      db.Project.findOneAndUpdate({ name: req.params.name }, req.body, function(
        err,
        asset
      ) {
        if (err) {
          res.status(500).send({
            status: "error",
            message: "There was an error updating the project."
          });
          throw err;
        } else {
          res.status(200).send({
            status: "success",
            message: "Project updated successfully."
          });
        }
      });
    }
  })
  /**
     * Delete a asset by assetName
     */
  .delete("/:projectName", isAuthenticated, function(req, res) {
    if (req.params) {
      db.Project.findOneAndRemove({ name: req.params.name }, function(
        err,
        asset
      ) {
        if (err) {
          res.status(500).send({
            status: "error",
            message: "There was an error updating the project."
          });
          throw err;
        } else {
          res.status(200).send({
            status: "success",
            message: "Project removed successfully."
          });
        }
      });
    }
  });

module.exports = router;

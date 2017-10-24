"use strict";

const express = require("express"),
  router = express.Router(),
  auth = require("../basic-auth"),
  passport = require("passport"),
  paginator = require("../../utils/pagination-helper"),
  isAuthenticated = require("../session-auth"),
  extend = require("util")._extend;

/**
 * Multer file upload setup
 */
var multer = require("multer");
var path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/users/");
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
      db.User.paginate(
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
     * Creating a new user
     */
  .post("/", isAuthenticated, function (req, res) {
    if (req) {
      //TODO some validation and transformation?
      //perform some sanity check
      if (
        req.body.loginName &&
        req.body.name &&
        req.body.password &&
        req.body.email
      ) {

        //include pState
        req.body = extend(req.body, { pState: 1 });

        new db.User(req.body).save(function (err) {
          if (err) {
            res.status(500).send({
              status: "error",
              error: "There was an error saving the user."
            });
            throw err;
          } else {
            res
              .status(200)
              .send({ status: "success", message: "User saved successfully." });
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
     * Get user by loginName
     */
  .get("/:loginName", isAuthenticated, function (req, res) {
    if (req.params) {
      // get user by loginName
      db.User.find({ loginName: req.params.loginName }, function (err, users) {
        if (err) {
          throw err;
        } else {
          res.json({ status: "success", data: users });
        }
      });
    }
  })
  /**
     * Update user by loginName
     */
  .put("/:loginName", isAuthenticated, function (req, res) {
    if (req.params) {
      db.User.findOneAndUpdate(
        { loginName: req.params.loginName },
        req.body,
        function (err, user) {
          if (err) {
            res.status(500).send({
              status: "error",
              message: "There was an error updating the user."
            });
            throw err;
          } else {
            res.status(200).send({
              status: "success",
              message: "User updated successfully."
            });
          }
        }
      );
    }
  })
  /**
     * Delete a user by loginName
     */
  .delete("/:loginName", isAuthenticated, function (req, res) {
    if (req.params) {
      db.User.findOneAndRemove({ loginName: req.params.loginName }, function (
        err,
        user
      ) {
        if (err) {
          res.status(500).send({
            status: "error",
            message: "There was an error updating the user."
          });
          throw err;
        } else {
          res
            .status(200)
            .send({ status: "success", message: "User removed successfully." });
        }
      });
    }
  })
  /**
     * Get user by loginName
     */
  .get("/id/:id", isAuthenticated, function (req, res) {
    if (req.params) {
      // get user by loginName
      db.User.find({ _id: req.params.id }, function (err, users) {
        if (err) {
          throw err;
        } else {
          res.json({ status: "success", data: users });
        }
      });
    }
  })
  /**
     * Update user by loginName
     */
  .put("/id/:id", isAuthenticated, function (req, res) {
    if (req.params) {
      db.User.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        function (err, user) {
          if (err) {
            res.status(500).send({
              status: "error",
              message: "There was an error updating the user."
            });
            throw err;
          } else {
            res.status(200).send({
              status: "success",
              message: "User updated successfully."
            });
          }
        }
      );
    }
  })
  /**
     * Delete a user by loginName
     */
  .delete("/id/:id", isAuthenticated, function (req, res) {
    if (req.params) {
      db.User.findOneAndRemove({ _id: req.params.id }, function (
        err,
        user
      ) {
        if (err) {
          res.status(500).send({
            status: "error",
            message: "There was an error updating the user."
          });
          throw err;
        } else {
          res
            .status(200)
            .send({ status: "success", message: "User removed successfully." });
        }
      });
    }
  })
  /**
    * Login in a user
    */
  .post("/logon", passport.authenticate("local-login"), function (req, res) {
    if (req && req.isAuthenticated()) {
      //TODO some validation and transformation?
      //perform some sanity check
      if (req.body.loginName && req.body.password) {
        res.status(200).send({
          status: "success",
          data: req.user
        });
      } else {
        res.status(500).send({
          status: "error",
          data: "Insufficient information, please check your Username and Password fields."
        });
      }
    }
  })
  /**
     * Logout user
     */
  .post("/logout", isAuthenticated, function (req, res) {
    req.session.destroy(function (err) {
      if (err) {
        res.status(500).send({
          status: "error",
          message: "Could not logout user"
        });
      } else {
        res.status(200).send({
          status: "success",
          message: "User successfully logged out"
        });
      }
    });
  })
  /**
    * Check for a session
    */
  .post("/isloggedIn", isAuthenticated, function (req, res, next) {
    res.status(200).send({
      status: "success",
      data: req.user
    });
  })
  /**
    * Upload an avatar
    */
  .post("/photo", upload.array("images"), function (req, res, next) {
    if (req.files && req.files.length > 0) {
      let file = req.files[0], imageUrl;

      //check file type
      if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        db.User.findOneAndUpdate(
          { "loginName": req.body.user },
          { "imageUrl": file.originalname },
          function (err, user) {
            if (err) {
              res.status(500).send({
                status: "error",
                message: "There was an error updating the user."
              });
              throw err;
            } else {
              res.status(200).send({
                status: "success",
                message: "User avatar updated successfully"
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
   * Get user notifications from notification cache
   */
  .get("/notifications/:id", function (req, res) {
    if (req.params) {
      // get user by id
      db.User.findOne(
        {
          _id: req.params.id
        },
        {
          notificationCache: 1,
        })
        .populate({ path: "notificationCache._asset", select: "name" })
        .exec(function (err, user) {
          if (err) {
            throw err;
          } else {
            res.json({
              status: "success",
              data: user
            });
          }
        });
    }
  })
  /**
   * Dismiss user notification
   */
  .post("/notifications/dismiss/:id", function (req, res) {
    //update user and pull the notification by id
    db.User.update(
      { "_id": req.params.id },
      {
        $pull: {
          'notificationCache': {
            '_id': req.body.id
          }
        }
      },
      function (err, user) {
        if (err) {
          res.status(500).send({
            status: "error",
            message: "There was an error updating the user."
          });
          throw err;
        } else {
          res.status(200).send({
            status: "success",
            message: "Notification dismissed successfully"
          });
        }
      }
    );
  })

module.exports = router;

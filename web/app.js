"use strict";

const express = require("express"),
  fs = require("fs"),
  router = express.Router(),
  spdy = require("spdy"),
  cors = require("cors"),
  messenger = require("messenger"),
  compression = require("compression"),
  winston = require("winston"),
  config = require("../config"),
  db = require("../db/db"),
  cookieParser = require("cookie-parser"),
  options = {
    key: fs.readFileSync(__dirname + "/keys/server.key"),
    cert: fs.readFileSync(__dirname + "/keys/server.crt")
  };

// add this to the VERY top of the first file loaded in your app
var opbeat = require("opbeat").start({
  appId: "3a94a8f904",
  organizationId: "1d480c7c4dc844eda9226c048d9084f1",
  secretToken: "640fa846f9de8926b06f80d8dd4a3df4acc825eb"
});

//adding pmx for analysis
var pmx = require("pmx").init({
  http: true, // HTTP routes logging (default: true)
  ignore_routes: [/socket\.io/, /notFound/], // Ignore http routes with this pattern (Default: [])
  errors: true, // Exceptions logging (default: true)
  custom_probes: true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics
  network: true, // Network monitoring at the application level
  ports: true // Shows which ports your app is listening on (default: false)
});

/**
 * By default the Node.js HTTP server has a socket pool limit of only 5. 
 * This is a very conservative number and most servers can handle a much higher number 
 * of sockets than this.
 */
let http = require("http");
let https = require("https");

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

//Intialize express application
global.app = express();

// GZIP all assets
app.use(compression());

// Add the Opbeat middleware after your regular middleware
app.use(opbeat.middleware.express());

global.db = db;

//allow cross-domain requests to server
var originsWhitelist = [
  "http://localhost:4200",
  "http://localhost:9000",
  "http://razrapi.azurewebsites.net",
  "https://razrapi.azurewebsites.net",
  "https://razrweb.azurewebsites.net",
  "http://razrweb.azurewebsites.net",
  "t24.scctitan.com",
  "76.70.18.14"
];
var corsOptions = {
  origin: function (origin, callback) {
    var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
};
//here is the magic
app.use(cors(corsOptions));

//intialize the body parser
app.use(express.static(__dirname + "/public", { maxAge: 31557600 }));
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// require('@google-cloud/debug-agent').start({ allowExpressions: true });

/**
* For passport
*/
var passport = require("passport");
var passportLocal = require("passport-local");
var expressSession = require("express-session");

app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }
  })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 * Setting global headers for cors
 */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  if ("OPTIONS" == req.method) {
    // res.send(200);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  } else {
    next();
  }
});

//log API calls
app.use(function timeLog(req, res, next) {
  console.log(`REQ: ${req.url}`);
  //logging API requests into the log collection
  // db.mongoose.connection.db.collection('log').insert({
  //   "requester": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
  //   "headers": req.headers,
  //   "trailers": req.trailers,
  //   "query": escape(req.query),
  //   "method": req.method,
  //   "params": req.params,
  //   "body": req.body,
  //   "timestamp": new Date()
  // }, function (err, result) {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
  next();
});

//get routes
var routes = require("./router/router");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  if (req.accepts("html")) {
    res.sendStatus(404);
    return;
  }
  if (req.accepts("json")) {
    res.send({ error: "Not found" });
    return;
  }
  res.type("txt").send("Not found");
  next();
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    // res.render('error', {
    //   message: err.message,
    //   error: err
    // });
    res.json({
      message: err.message,
      error: err
    });
    next();
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  // res.render('error', {
  //   message: err.message,
  //   error: {}
  // });
  res.json({
    message: err.message,
    error: {}
  });
  next();
});

winston.add(winston.transports.File, {
  filename: "./logs/UnhandledException.log",
  handleExceptions: true,
  level: "warn",
  humanReadableUnhandledException: true
});

// prevent exiting from application after exception occurred:
winston.exitOnError = false;

//install db connection handlers
db.installConnectionHandlers();

//establish DB connection
// db.connect();

//check connection to the DB
db.checkConnection(function () {
  //load models
  db.loadModels();

  /**
   * Intialize Passport authentication Strategy
   */
  passport.use(
    "local-login",
    new passportLocal.Strategy(
      {
        usernameField: "loginName",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function (req, loginName, password, done) {
        if (loginName && password) {
          db.User.findOne({ loginName: loginName }, function (
            err,
            doc
          ) {
            if (err) {
              console.log(err);
            } else {
              if (doc && password == doc.password) {
                done(null, doc);
              } else {
                done(null, null);
              }
            }
          });
        } else {
          done(null, null);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    console.log("serializeUser");
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    console.log("deserializeUser");
    done(null, user);
  });
  //check for currentLog capped db

  //start the server
  // spdy
  //   .createServer(options, app)
  //   .listen(config.port, (err) => {
  //     if (err) {
  //       throw new Error(err);
  //     }

  //     //log that the server is listening
  //     console.log(`Bender is listening to us on ${config.port}`);

  //     //expose db globally
  //     global.db = db;
  //   });

  //oldschool
  app.listen(process.env.PORT || 80, function () {
    console.log(`Bender app listening on port ${process.env.PORT || 80}!`);
    
    //start off distribution to COM
    global.comSpeaker = messenger.createSpeaker(`${config.distribution.com.ip}:${config.distribution.com.port}`);
  });
});

module.exports = app;

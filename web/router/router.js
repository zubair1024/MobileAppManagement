"use strict";

const test = require("./routes/test"),
  user = require("./routes/user"),
  ad = require("./routes/ad"),
  misc = require("./routes/misc");

//load test routes
app.use("/test", test);
//load user routes
//use basic authentication
// app.use('/user', auth);
app.use("/user", user);
//use basic authentication
// app.use('/sensormessageevent', auth);
//load sensormessageevent routes
// app.use("/sensormessageevent", sensormessageevent);
//load asset routes
// app.use("/asset", asset);
app.use("/ad", ad);
//load project routes
// app.use("/project", project);
//load alarm routes
// app.use("/alarm", alarm);
//load map routes
// app.use("/map", map);
//load misc routes
app.use("/misc", misc);
//load map routes
// app.use("/location", location);
// app.use("/geofence", geofence);
//load statistics route
// app.use("/statistics", statistics);

/**
 * Routes for Shadow Message Handler Integration
 */
//use basic authentication
// app.use("/api/mh", auth);
//load message hander routes
// app.use("/api/mh", mh);

module.exports = app;

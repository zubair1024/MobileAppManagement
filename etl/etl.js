const moment = require("moment"),
  db = require("../db/db"),
  async = require("async");

//install db connection handlers
db.installConnectionHandlers();

//check connection to the DB
db.checkConnection(function () {
  //load models
  db.loadModels();

  //expose db globally (hours)
  global.offset = -4;

  //realtime reoccurance offset (mins)
  global.realtimeOffset = 3;

  //expose db globally
  global.db = db;

  //daily jobs

  //master jobs
  const etlCustomerJob = require("./realtime/etlCustomerJob"),
    etlProjectJob = require("./realtime/etlProjectJob"),
    //live jobs
    liveOperationalStatisticsJob = require("./realtime/liveOperationalStatistics"),
    //daily jobs
    etlAssetUtilizationJob = require("./daily/etlAssetUtilization"),
    etlProjectUtilizationJob = require("./daily/etlProjectUtilization");

  //Run Realtime Job(s)
  // setInterval(function () {
    let now = new Date();
    //set the start of the day
    global.startOfDay = moment.utc().startOf("day").add("h", offset);
    global.endOfDay = startOfDay.add("d", 1);

  //   async.parallel(
  //     [
  //       //run customer master job
  //       function (callback) {
  //         etlCustomerJob.init(
  //           moment(now).subtract(realtimeOffset, "m").toDate(),
  //           now,
  //           moment(now).add(realtimeOffset, "m").toDate(),
  //           callback
  //         );
  //       },
  //       //run project master job
  //       function (callback) {
  //         etlProjectJob.init(
  //           moment(now).subtract(realtimeOffset, "m").toDate(),
  //           now,
  //           moment(now).add(realtimeOffset, "m").toDate(),
  //           callback
  //         );
  //       }
  //     ],
  //     () => {
  //       //run live operational statistics job
  //       liveOperationalStatisticsJob.init(
  //         moment(now).subtract(realtimeOffset, "m").toDate(),
  //         now,
  //         moment(now).add(realtimeOffset, "m").toDate()
  //       );
  //     }
  //   );
  // }, realtimeOffset * 60 * 1000);

  //Run Realtime Job(s)
  // setTimeout(function () {
    // setInterval(function() {
    // let now = new Date();
    async.parallel(
      [
        //run customer master job
        function (callback) {
          etlCustomerJob.init(
            moment(now).subtract(1, "m").toDate(),
            now,
            moment(now).add(1, "m").toDate(),
            callback
          );
        },

        //run customer master job
        function (callback) {
          etlProjectJob.init(
            moment(now).subtract(1, "m").toDate(),
            now,
            moment(now).add(1, "m").toDate(),
            callback
          );
        }
      ],

      () => {
        /**

         * Utilization Series

         */
        async.series(
          [
            function (callback) {
              //asset Utilization
              etlAssetUtilizationJob.init(
                new Date("2016-12-15T00:00:00"),
                now,
                new Date("2016-12-16T00:00:00"),
                callback
              );
            },
            function (callback) {
              //asset Utilization
              etlProjectUtilizationJob.init(
                new Date("2016-12-15T00:00:00"),
                now,
                new Date("2016-12-16T00:00:00"),
                callback
              );
            }
          ],
          // optional callback
          function (err, results) {
            console.log("Utilization Jobs Completed");
          }
        );
      }
    );
  // }, 24 * 60 * 60 * 1000);
});

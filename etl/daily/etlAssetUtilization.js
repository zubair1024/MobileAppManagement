/**
 * Created by zubair on 17-Jun-16.
 */
let etljob = {},
  async = require("async"),
  extend = require("util")._extend,
  jobName = "etlAssetUtilizationJob";

/**
 * Job Initializeer (pre-requisites)
 */
etljob.init = function (startTime, endTime, nextRunTime, done) {
  console.time("etlAssetUtilizationJob");
  let me = this;
  db.checkConnection(function (err) {
    if (err) {
      console.log(err);
    } else {
      me.run(startTime, endTime, nextRunTime, done);
    }
  });
};

/**
 * Start ETL Live Operational Statistics Job
 * @param startTimestamp
 * @param endTimestamp
 */
etljob.run = function (startTime, endTime, nextRunTime, done) {
  let me = this;

  let cursor = db.Asset.find({ pState: 1 }).cursor();
  cursor.on("data", function (asset) {
    //job parameters
    let assetResult = {
      _asset: asset._id,
      startTime: startTime,
      endTime: endTime,
      nextRunTime: nextRunTime
    };

    async.parallel(
      [
        function (callback) {
          me.powerOutputStatistics(assetResult, asset, callback);
        }
      ],
      // optional callback
      function (err, results) {
        for (let i = 0; i < results.length; i++) {
          assetResult = extend(assetResult, results[i]);
          etljob.transactStatistics(assetResult, () => { });
        }
      }
    );
  });

  cursor.on("end", function () {
    console.timeEnd("etlAssetUtilizationJob");
    if (done) {
      done();
    }
  });
};

/**
 * Check for a pre-exisiting utilization value
 * @param dbObj
 * @param asset
 * @param etlDate
 * @param callback
 */
etljob.powerOutputStatistics = function (result, asset, callback) {
  let stats = {
    eventCount: 0,
    powerOutputKW: 0,
    firstFuelUsed: null,
    lastFuelUsed: null,
    firstEngineHourMeter: null,
    lastEngineHourMeter: null
  };

  // get all events for that asset
  let cursor = db.SensorMessageEvent
    .find({
      _asset: asset._id,
      eventTime: {
        $gte: result.startTime,
        $lte: result.endTime
      },
      powerOutputKW: { $exists: true }
    })
    .cursor();
  cursor.on("data", function (event) {
    //if power output value exists, aggregate to the stats
    if (event.get("powerOutputKW")) {
      stats.totalPowerOutputKW += event.get("powerOutputKW");

      //first and last running hours
      if (!stats.firstEngineHourMeter) {
        stats.firstEngineHourMeter = event.get("engineHourMeter");
      }
      stats.lastEngineHourMeter = event.get("engineHourMeter");

      //first and last fuel used
      if (!stats.firstFuelUsed) {
        stats.firstFuelUsed = event.get("fuelUsed");
      }
      stats.lastFuelUsed = event.get("fuelUsed");

      ++stats.eventCount;
    }
  });
  cursor.on("end", function (event) {

    //total engine hours meter
    if (stats.firstEngineHourMeter) {
      stats.totalEngineHours = stats.lastEngineHourMeter - stats.firstEngineHourMeter;
    }else{
      stats.totalEngineHours = 0;
    }
    //total fuel used
    if (stats.firstFuelUsed) {
      stats.totalFuelUsed = stats.lastFuelUsed - stats.firstFuelUsed;
    }else{
      stats.totalFuelUsed = 0;
    }
    //average power output
    if (stats.eventCount > 0) {
      stats.averagePowerOutput = stats.totalEngineHours / stats.eventCount;
    }else{
      stats.averagePowerOutput = 0;
    }
    //return
    callback(null, stats);
  });
};

etljob.transactStatistics = function (result, callback) {
  db.ETLAssetUtilization.findOneAndUpdate(
    {
      _asset: result._asset,
      startTime: result.startTime
    },
    result,
    { upsert: true },
    err => {
      if (err) {
      } else {
        callback();
      }
    }
  );
};

module.exports = etljob;

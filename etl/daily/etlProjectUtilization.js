/**
 * Created by zubair on 17-Jun-16.
 */
let etljob = {},
  async = require("async"),
  extend = require("util")._extend;

/**
 * Job Initializeer (pre-requisites)
 */
etljob.init = function(startTime, endTime, nextRunTime, done) {
  console.time("etlProjectUtilizationJob");
  let me = this;
  db.checkConnection(function(err) {
    if (err) {
      console.log(err);
    } else {
      db.ETLProject.remove({}, () => {
        me.run(startTime, endTime, nextRunTime, done);
      });
    }
  });
};

/**
 * Start ETL Live Operational Statistics Job
 * @param startTimestamp
 * @param endTimestamp
 */
etljob.run = function(startTime, endTime, nextRunTime, done) {
  let cursor = db.Project.find({ pState: 1 }).cursor();
  cursor.on("data", function(project) {
    if (project) {
      //persist the project identity
      let projectResult = {
        _project: project._id,
        startTime: startTime,
        endTime: endTime,
        nextRunTime: nextRunTime
      };
      let assets = project.assets;
      async.parallel(
        [
          function(callback) {
            etljob.powerOutputStatistics(callback, assets, projectResult);
          }
        ],
        // optional callback
        function(err, results) {
          for (let i = 0; i < results.length; i++) {
            projectResult = extend(projectResult, results[i]);
          }
          etljob.transactStatistics(projectResult, () => {});
        }
      );
    }
  });

  cursor.on("end", function() {
    console.timeEnd("etlProjectUtilizationJob");
    if (done) {
      done();
    }
  });
};

etljob.powerOutputStatistics = function(callback, assets, projectResult) {
  let stats = {
    powerOutputKW: 0
  };
  //check if there are assets in the project
  if (assets.length) {
    //get all assets
    async.times(
      assets.length,
      function(n, next) {
        // get utilization for each asset in the project
        db.ETLAssetUtilization.findOne(
          {
            _asset: assets[n],
            startTime: projectResult.startTime
          },
          function(err, assetStats) {
            //if power output value exists, aggregate to the stats
            if (assetStats && assetStats.powerOutputKW) {
              stats.powerOutputKW += assetStats.powerOutputKW;
            }
            //to the next asset
            next(err, assetStats);
          }
        );
      },
      function(err) {
        callback(null, stats);
      }
    );
  }
};

/**
 * Transact the ETL data
 */
etljob.transactStatistics = function(result, callback) {
  console.log('result: ', result);
  //persist the data
  db.ETLProjectUtilization.findOneAndUpdate(
    {
      _project: result._project,
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

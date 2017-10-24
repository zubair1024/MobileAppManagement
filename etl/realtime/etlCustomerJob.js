/**
 * Created by zubair on 17-Jun-16.
 */
let etljob = {},
  async = require("async"),
  extend = require("util")._extend;

/**
 * Job Initializeer (pre-requisites)
 */
etljob.init = function (startTime, endTime, nextRunTime, done) {
  console.time("etlCustomerJob");
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
 * @param startTime
 * @param endTime
 * @param nextRunTime
 * @param done
 */
etljob.run = function (startTime, endTime, nextRunTime, done) {
  let result = {
    startTime: startTime,
    endTime: endTime,
    nextRunTime: nextRunTime
  };
  db.Asset.find({ pState: 1 }, function (err, assets) {
    async.parallel(
      [
        function (callback) {
          etljob.assetEngineRatingStatistics(callback, assets);
        },
        function (callback) {
          etljob.assetStatusStatistics(callback, assets);
        },
        function (callback) {
          etljob.assetCapacityStatistics(callback, assets);
        }
      ],
      // optional callback
      function (err, results) {
        for (let i = 0; i < results.length; i++) {
          result = extend(result, results[i]);
        }
        //transact the data
        etljob.transactStatistics(result, () => {
          console.timeEnd("etlCustomerJob");
          done();
        });
      }
    );
  });
};

/**
 * Get Generator Status Statistics
 */
etljob.assetStatusStatistics = function (callback, assets) {
  let me = this;

  //job parameters
  let result = {
    deployed: 0,
    maintenance: 0,
      decommissioned: 0,
    readyForDeployment: 0
  };

  let len = assets.length;
  for (let i = 0; i < len; i++) {
    if (assets[i].status) {
      switch (assets[i].status) {
        case "Deployed":
          ++result.deployed;
          break;

        case "Maintenance":
          ++result.maintenance;
          break;

        case "Decommissioned":
          ++result.decommissioned;
          break;

        case "Ready for deployment":
          ++result.readyForDeployment;
          break;

        default:
          break;
      }
    }
  }
  // return result;
  callback(null, { generatorStatus: result });
};

/**
 * Get Generator Engine Rating Statistics
 */
etljob.assetEngineRatingStatistics = function (callback, assets) {
  let me = this;

  //job parameters
  let result = {
    prime: 0,
    continuous: 0,
    standby: 0
  };

  let len = assets.length;
  for (let i = 0; i < len; i++) {
    if (assets[i].generatorEngineRating) {
      switch (assets[i].generatorEngineRating) {
        case "Prime":
          ++result.prime;
          break;

        case "Continuous":
          ++result.continuous;
          break;

        case "Standby":
          ++result.standby;
          break;

        default:
          break;
      }
    }
  }
  // return result;
  callback(null, { generatorEngineRating: result });
};

etljob.assetCapacityStatistics = function (callback, assets) {
  let me = this;

  //job parameters
  let result = {};

  let len = assets.length;
  for (let i = 0; i < len; i++) {
    if (assets[i].generatorCapacity) {
      if (result[assets[i].generatorCapacity]) {
        ++result[assets[i].generatorCapacity];
      } else {
        result[assets[i].generatorCapacity] = 1;
      }
    }
  }
  // return result;
  callback(null, { generatorCapacity: result });
};

/**
 * Transact the ETL data
 */
etljob.transactStatistics = function (result, callback) {
  //persist the data
  console.log(result);
  db.ETLCustomer(result).save(err => {
    if (err) {
    } else {
      callback();
    }
  });
};

module.exports = etljob;

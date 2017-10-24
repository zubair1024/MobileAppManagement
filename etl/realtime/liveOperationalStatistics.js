/**
 * Created by zubair on 17-Jun-16.
 */
let etljob = {},
  async = require("async"),
  extend = require("util")._extend;

/**
 * Job Initializeer (pre-requisites)
 */
etljob.init = function (startTime, endTime, nextRunTime) {
  console.time("liveOperationalStatisticsJob");
  let me = this;
  db.checkConnection(function (err) {
    if (err) {
      console.log(err);
    } else {
      me.run(startTime, endTime, nextRunTime);
    }
  });
};

/**
 * Start ETL Live Operational Statistics Job
 * @param startTimestamp
 * @param endTimestamp
 */
etljob.run = function (startTime, endTime, nextRunTime) {
  let me = this;

  //job parameters
  let result = {
    //live
    operational: 0,
    notOperational: 0,
    unknown: 0,
    operationalToday: 0,
    //maintenance
    Deployed: 0,
    maintenance: 0,
      decommissioned: 0,
    readyForDeployment: 0,
    toBeServiced: 0,
    startTime: startTime,
    endTime: endTime,
    nextRunTime: nextRunTime
  };

  db.Asset.find({ pState: 1 }, function (err, assets) {
    if (err) {
      //TODO
    } else {
      let promises = [];

      async.forEach(
        assets,
        function (asset, callback) {
          me.checkOperationalStatistics(result, asset, callback);
        },
        function (err) {
          Promise.all(promises).then(function (value) {
            //transact the data
            etljob.transactStatistics(result, () => {
              console.timeEnd("liveOperationalStatisticsJob");
            });
          });
        }
      );
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
etljob.checkOperationalStatistics = function (result, asset, callback) {
  if (asset.features.nonReport && !asset.features.nonReport.triggered) {
    if (asset.features.engineStatus && asset.features.engineStatus.value) {
      //check the ignitions status
      if (asset.features.engineStatus.value == "on") {
        ++result.operational;
      } else {
        ++result.notOperational;
      }
    } else {
      ++result.unknown;
    }

    if (asset.features.inUse && asset.features.inUse.triggerTime) {
      if (startOfDay.toDate() - asset.features.inUse.triggerTime <= 0) {
        ++result.operationalToday;
      }
    }
    this.checkMaintenanceStatistics(result, asset, callback);
  } else {
    ++result.unknown;
    this.checkMaintenanceStatistics(result, asset, callback);
  }
};

/**
 * Check for a pre-exisiting utilization value
 * @param dbObj
 * @param asset
 * @param etlDate
 * @param callback
 */
etljob.checkMaintenanceStatistics = function (result, asset, callback) {
  if (asset.status) {
    switch (asset.status) {
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
    }
  }
 this.checkServiceStatistics(result, asset, callback);
};

/**
 * Check for service alarms
 */
etljob.checkServiceStatistics = function (result, asset, callback) {

  if (asset.features && asset.features.minorService && asset.features.minorService.triggered) {
    ++result.toBeServiced;
  } else {
    if (asset.features && asset.features.minorService && asset.features.minorService.triggered) {
      ++result.toBeServiced;
    }
  }

  // return result;
  callback && callback(result);
};


etljob.transactStatistics = function (result, callback) {
  db.LiveOperationalStatistic(result).save(err => {
    if (err) {
    } else {
      callback();
    }
  });
};

module.exports = etljob;

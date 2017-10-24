"use strict";

const async = require("async"), extend = require("util")._extend;

module.exports = {
  getParams: function(req, resolve) {
    var me = this, obj = {};

    async.parallel(
      {
        page: function(callback) {
          callback(
            null,
            req.query.$skip ? parseInt(req.query.$skip / req.query.$top) + 1 : 1
          );
        },
        limit: function(callback) {
          callback(null, req.query.$top ? parseInt(req.query.$top) : 10);
        },
        offset: function(callback) {
          callback(null, req.query.$skip ? parseInt(req.query.$skip) : 0);
        },
        select: function(callback) {
          callback(
            null,
            req.query.values ? req.query.values.replace(/,/g, " ") : ""
          );
        },
        sort: function(callback) {
          let value, order = null, sort = {};
          if (req.query.$orderby) {
            let splitValues = req.query.$orderby.split(" ");
            value = splitValues[0];
            order = splitValues[1] == "desc" ? 1 : -1;
            sort[value] = order;
          } else {
            sort = {
              eventTime: -1
            };
          }
          callback(null, sort);
        },
        filter: function(callback) {
          let filter = {};
          //fetch filter values
          if (req.query.$filter) {
            let filterData = req.query.$filter.split("and");
            if (filterData.length) {
              for (let i = 0; i < filterData.length; i++) {
                //trim starting and trailing whitespaces
                filterData[i] = filterData[i].trim();
                //check for contains
                if (
                  /contains/g.test(filterData[i]) &&
                  !/\'\'/g.test(filterData[i])
                ) {
                  filterData[i] = filterData[i].replace('contains','');
                  let keyAndValue = filterData[i].split(",");
                  //trim starting and trailing whitespaces
                  keyAndValue[0] = keyAndValue[0].trim();
                  keyAndValue[1] = keyAndValue[1].trim();
                  //replace braces, quotation marks and / => .
                  keyAndValue[0] = keyAndValue[0]
                    .replace(/\(|\)/g, "")
                    .replace(/\//g, ".")
                    .replace(/\'/g, "");
                  keyAndValue[1] = keyAndValue[1]
                    .replace(/\(|\)/g, "")
                    .replace(/\'/g, "");
                  if (
                    keyAndValue[0] == "createdTime" ||
                    keyAndValue[0] == "eventTime"
                  ) {
                    keyAndValue[1] = keyAndValue[1].replace("datetime", "");
                    filter[keyAndValue[0]] = new Date(keyAndValue[1]);
                  } else {
                    filter[keyAndValue[0]] = new RegExp(keyAndValue[1], "gi");
                  }
                }
                //check for substring
                if (
                  /substringof/g.test(filterData[i]) &&
                  !/\'\'/g.test(filterData[i])
                ) {
                  filterData[i] = filterData[i].replace('substringof','');
                  let keyAndValue = filterData[i].split(",");
                  //trim starting and trailing whitespaces
                  keyAndValue[0] = keyAndValue[0].trim();
                  keyAndValue[1] = keyAndValue[1].trim();
                  //replace braces, quotation marks
                  keyAndValue[0] = keyAndValue[0]
                    .replace(/\(|\)/g, "")
                    .replace(/\//g, ".")
                    .replace(/\'/g, "");
                  keyAndValue[1] = keyAndValue[1]
                    .replace(/\(|\)/g, "")
                    .replace(/\'/g, "");
                  console.log(keyAndValue);
                  if (
                    keyAndValue[0] == "createdTime" ||
                    keyAndValue[0] == "eventTime"
                  ) {
                    //remove 'datetime'
                    keyAndValue[1] = keyAndValue[1].replace("datetime", "");
                    filter[keyAndValue[0]] = new Date(keyAndValue[1]);
                  } else {
                    filter[keyAndValue[1]] = new RegExp(keyAndValue[0], "gi");
                  }
                }
                //check for equality
                if (
                  filterData[i].indexOf("eq") > 0 &&
                  !/\'\'/g.test(filterData[i])
                ) {
                  let keyAndValue = filterData[i].split("eq");
                  //trim starting and trailing whitespaces
                  keyAndValue[0] = keyAndValue[0].trim();
                  keyAndValue[1] = keyAndValue[1].trim();
                  //replace braces, quotation marks
                  keyAndValue[0] = keyAndValue[0]
                    .replace(/\(|\)/g, "")
                    .replace(/\//g, ".")
                    .replace(/\'/g, "");
                  keyAndValue[1] = keyAndValue[1]
                    .replace(/\(|\)/g, "")
                    .replace(/\'/g, "");
                  if (
                    keyAndValue[0] == "createdTime" ||
                    keyAndValue[0] == "eventTime"
                  ) {
                    //remove 'datetime'
                    keyAndValue[1] = keyAndValue[1].replace("datetime", "");
                    //convert to Date object
                    filter[keyAndValue[0]] = new Date(keyAndValue[1]);
                  } else {
                    filter[keyAndValue[0]] = keyAndValue[1];
                  }
                }
                //check for ge
                if (
                  filterData[i].indexOf(" ge ") > 0 &&
                  !/\'\'/g.test(filterData[i])
                ) {
                  let keyAndValue = filterData[i].split("ge");
                  //trim starting and trailing whitespaces
                  keyAndValue[0] = keyAndValue[0].trim();
                  keyAndValue[1] = keyAndValue[1].trim();
                  //replace braces, quotation marks
                  keyAndValue[0] = keyAndValue[0]
                    .replace(/\(|\)/g, "")
                    .replace(/\//g, ".")
                    .replace(/\'/g, "");
                  keyAndValue[1] = keyAndValue[1]
                    .replace(/\(|\)/g, "")
                    .replace(/\'/g, "");
                  if (
                    keyAndValue[0] == "createdTime" ||
                    keyAndValue[0] == "eventTime"
                  ) {
                    //remove 'datetime'
                    keyAndValue[1] = keyAndValue[1].replace("datetime", "");
                    //convert to Date object
                    if (filter[keyAndValue[0]]) {
                      filter[keyAndValue[0]] = extend(filter[keyAndValue[0]], {
                        $gte: new Date(keyAndValue[1])
                      });
                    } else {
                      filter[keyAndValue[0]] = {
                        $gte: new Date(keyAndValue[1])
                      };
                    }
                  } else {
                    if (filter[keyAndValue[0]]) {
                      filter[keyAndValue[0]] = extend(filter[keyAndValue[0]], {
                        $gte: keyAndValue[1]
                      });
                    } else {
                      filter[keyAndValue[0]] = { $gte: keyAndValue[1] };
                    }
                  }
                }
                //check for le
                if (
                  filterData[i].indexOf(" le ") > 0 &&
                  !/\'\'/g.test(filterData[i])
                ) {
                  let keyAndValue = filterData[i].split("le");
                  //trim starting and trailing whitespaces
                  keyAndValue[0] = keyAndValue[0].trim();
                  keyAndValue[1] = keyAndValue[1].trim();
                  //replace braces, quotation marks
                  keyAndValue[0] = keyAndValue[0]
                    .replace(/\(|\)/g, "")
                    .replace(/\//g, ".")
                    .replace(/\'/g, "");
                  keyAndValue[1] = keyAndValue[1]
                    .replace(/\(|\)/g, "")
                    .replace(/\'/g, "");
                  if (
                    keyAndValue[0] == "createdTime" ||
                    keyAndValue[0] == "eventTime"
                  ) {
                    //remove 'datetime'
                    keyAndValue[1] = keyAndValue[1].replace("datetime", "");
                    //convert to Date object
                    if (filter[keyAndValue[0]]) {
                      filter[keyAndValue[0]] = extend(filter[keyAndValue[0]], {
                        $lte: new Date(keyAndValue[1])
                      });
                    } else {
                      filter[keyAndValue[0]] = {
                        $lte: new Date(keyAndValue[1])
                      };
                    }
                  } else {
                    if (filter[keyAndValue[0]]) {
                      filter[keyAndValue[0]] = extend(filter[keyAndValue[0]], {
                        $gte: keyAndValue[1]
                      });
                    } else {
                      filter[keyAndValue[0]] = { $gte: keyAndValue[1] };
                    }
                  }
                }
              }
            }
          }
          callback(null, filter);
        }
      },
      function(err, results) {
        resolve(results);
      }
    );
  }
};

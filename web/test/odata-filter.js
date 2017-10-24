var createFilter = require('odata-v4-mongodb').createFilter;
var parser = require("odata-parser");

// var testCase = "imei eq '353161076760316'";
// var testCase = "(imei eq '353161076760316' and substringof('CAN',eventType))";
// var testCase = "(imei eq '353161076760316' and substringof('CAN',eventType))";
// var testCase = "imei eq '353161076760316'";
var testCase = {
    "$filter": "(imei eq '353161076760316' and eventType eq 'CAN' and latitude eq '1' and (eventTime ge datetime'2017-05-01T00:00:00' and eventTime ge datetime'2017-05-17T00:00:00'))"
};

// var filter = createFilter(testCase);

var ast = parser.parse(testCase)

console.log(ast);
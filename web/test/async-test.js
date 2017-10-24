const async = require('async');
// parallel = require('async/parallel');

async.parallel({
    one: function (callback) {
        setTimeout(function () {
            callback(null, 1);
        }, 200);
    },
    two: function (callback) {
        setTimeout(function () {
            callback(null, 2);
        }, 100);
    }
}, function (err, results) {
    console.log('results: ', results);
});

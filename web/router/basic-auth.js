"use strict";

const basicAuth = require('basic-auth'),
    config = require('../config');

module.exports = function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    };

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };

    if (user.name === config.authentication.basic.username && user.pass === config.authentication.basic.password) {
        return next();
    } else {
        return unauthorized(res);
    };
};

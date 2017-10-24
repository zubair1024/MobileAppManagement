module.exports = function (req, res, next) {
    if (req.user && req.isAuthenticated)
        return next();
    else
        return res.status(401).json({
            "status": "error",
            "message": "User is not authenticated"
        })
}
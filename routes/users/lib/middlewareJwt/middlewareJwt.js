const jwt = require("jsonwebtoken");

function middlewareJwt(req, res, next) {
    try {
        console.log(req.headers);
        if (req.headers && req.headers.authorization) {
            let notDecodedToken = req.headers.authorization;
            let slicedToken = notDecodedToken.slice(7);
            let decodedToken = jwt.verify(slicedToken, process.env.SECRET_KEY);

            res.locals.decodedData = decodedToken;
            console.log(decodedToken);
            next();
        } else {
            throw {
                message: "Authentication Denied!"
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "Error, Ware? Middle of Jwt",
            error: err.message
        });
    }
}

module.exports = {
    middlewareJwt
}
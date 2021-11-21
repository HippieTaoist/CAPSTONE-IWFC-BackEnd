const jwt = require("jsonwebtoken");

function middlewareJwt(req, res, next) {
    try {
        // console.log(req.headers);
        if (req.headers && req.headers.authorization) {
            let tokenNotDecoded = req.headers.authorization;
            // console.log(`middlewareJwt:tokenNotDecoded:`, tokenNotDecoded);
            let tokenSliced = tokenNotDecoded.slice(7);
            // console.log('middlewareJwt:tokenSliced: ', tokenSliced);
            let tokenDecoded = jwt.verify(tokenSliced, process.env.SECRET_KEY);
            // console.log('middlewareJwt:tokenDecoded: ', tokenDecoded);
            res.locals.dataDecoded = tokenDecoded;
            // console.log('middlewareJwt:res.locals.dataDecoded: ', res.locals.dataDecoded);
            next();
            // console.log(`middlewareJwt:res.locals:${res.locals}`);
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
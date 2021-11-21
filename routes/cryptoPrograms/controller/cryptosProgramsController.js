const CryptoProgram = require('../model/CryptoProgram')

async function cryptoProgramsGetAll(req, res) {
    res.json({
        message: "Im a little re sponse"
    })
}


module.exports = {
    cryptoProgramsGetAll
}
mongoose = require("mongoose");

const {
    isAlpha,
    isURL
} = require("validator");

const cryptoSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    nameCrypto: {
        type: String,
        validate: [isAlpha, "Letters Only"]
    },
    nameSymbol: {
        type: String,
        validate: [isAlpha, "Letters Only"]
    },
    logoImgSrc: {
        type: String,
        validate: [isURL, "Logo Img Src URL incorrectly formatted"]
    },
    website: {
        type: String,
        validate: [isURL, "Website URL incorrectly formatted"]
    },
    favoringUsers: [{
        type: mongoose.Schema.ObjectId,
        ref: "user"
    }],
    favoringPrograms: [{
        type: mongoose.Schema.ObjectId,
        ref: "cryptoProgram"
    }]
}, {
    timestamps: true,
})

module.exports = mongoose.model("crypto", cryptoSchema);
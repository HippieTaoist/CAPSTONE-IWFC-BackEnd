mongoose = require("mongoose");

import {
    isAlpha,
    isURL
} from "validator";

const cryptoSchema = new mongoose.Schema({
    nameCrypto: {
        type: String,
        validate: [isAlpha, "Letters Only In First Name"]
    },
    nameSymbol: {
        type: String,
        validate: [isAlpha, "Letters Only In Last Name"]
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
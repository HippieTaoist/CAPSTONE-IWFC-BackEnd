mongoose = require("mongoose");

const {
    isAlpha,
    isURL
} = require("validator");

const cryptoSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    logoImgSrc: {
        type: String,
        validate: [isURL, "Logo Img Src URL incorrectly formatted"]
    },
    nameCreator: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    nameCrypto: {
        type: String,
        validate: [isAlpha, "Letters Only"]
    },
    nameSymbol: {
        type: String,
        validate: [isAlpha, "Letters Only"]
    },
    priceCurrent: {
        type: Number,
    },
    website: {
        type: String,
        validate: [isURL, "Website URL incorrectly formatted"]
    },
    usersFavored: [{
        type: mongoose.Schema.ObjectId,
        ref: "user"
    }],
    usersUnfavored: [{
        type: mongoose.Schema.ObjectId,
        ref: "user"
    }],
    programsAffiliated: [{
        type: mongoose.Schema.ObjectId,
        ref: "cryptoProgram"
    }]
}, {
    timestamps: true,
})

module.exports = mongoose.model("crypto", cryptoSchema);
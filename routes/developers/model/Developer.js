mongoose = require("mongoose");

const {
    isURL
} = require("validator");

const developerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    website: {
        type: String,
        validate: [isURL, "Please enter correct URL for this developer"]
    },
    programsAffiliated: [{
        type: mongoose.Schema.ObjectId,
        ref: "cryptoProgram"
    }],
    cryptosAffiliated: [{
        type: mongoose.Schema.ObjectId,
        ref: "crypto"
    }],
    nameCreator: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model("developer", developerSchema);
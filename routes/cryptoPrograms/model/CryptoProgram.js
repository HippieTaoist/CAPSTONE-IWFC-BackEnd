mongoose = require('mongoose');

const {
    isURL
} = require('validator');

const cryptoProgramSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    developer: {
        type: String,
    },
    description: {
        type: String,
    },
    url: {
        type: String,
        validate: [isURL, "Crypto Program URL incorrectly formatted"]
    },
    urlSiteRef: {
        type: String,
        validate: [isURL, "Crypto Program URL incorrectly formatted"]
    },
    urlLogo: {
        type: String,
        validate: [isURL, "Logo img must be valid URL"]
    },
    type: {
        type: String,
    },
    earnOpportunities: {
        rewardDaily: [{
            type: String
        }],
        rewardHourly: [{
            type: String
        }],
        rewardBonus: [{
            type: String,
        }],
        offerWalls: [{
            type: String,
        }],
        promotions: [{
            type: String,
        }]
    },
    withdrawalOptions: [{
        type: String,
    }],
    withdrawalMinAmount: [{
        type: String,
    }],
    withdrawalFrequency: {
        type: String
    },
    withdrawalWallets: [{
        type: String
    }],
    access: [{
        type: String,
    }],
    cryptosAffiliated: [{
        type: mongoose.Schema.ObjectId,
        ref: "crypto"
    }],
    nameCreator: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    },
    usersFavored: [{
        type: mongoose.Schema.ObjectId,
        ref: "user"
    }],
    usersUnfavored: [{
        type: mongoose.Schema.ObjectId,
        ref: "user"
    }],

}, {
    timestamps: true,
})

module.exports = mongoose.model("cryptoProgram", cryptoProgramSchema)
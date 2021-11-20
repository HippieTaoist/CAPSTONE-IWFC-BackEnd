mongoose = require("mongoose");

const {
    isAlpha,
    isEmail,
    isStrongPassword,
    isAlphanumeric
} = require("validator");

const userSchema = new mongoose.Schema({
    nameFirst: {
        type: String,
        required: true,
        validate: [isAlpha, "Letters Only In First Name"]
    },
    nameLast: {
        type: String,
        required: true,
        validate: [isAlpha, "Letters Only In Last Name"]
    },
    username: {
        type: String,
        required: true,
        unique: true,
        validate: [isAlphanumeric, "Username must be alphanumeric."]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, "Valid Email Only (ThisIs@ValidEmail.com)"]
    },
    password: {
        type: String,
        validate: [isStrongPassword, "Make A Stronger Password. (At least one NUMBER & one SPECIAL CHARACTER & one UPPERCASE LETTER & one LOWERCASE LETTER, with at least 8 characters in total"]
    },
    favoringCryptos: [{
        type: mongoose.Schema.ObjectId,
        ref: "crypto"
    }],
    favoringCryptoPrograms: [{
        type: mongoose.Schema.ObjectId,
        ref: "cryptoProgram"
    }]
}, {
    timestamps: true,
})

module.exports = mongoose.model("user", userSchema);
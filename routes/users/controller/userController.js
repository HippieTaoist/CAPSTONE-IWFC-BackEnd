const User = require("../model/User");

const bcrypt = require("bcryptjs");
const {
    isEmpty,
    isAlpha,
    isAlphanumeric,
    isEmail,
    isStrongPassword,
} = require("validator");

const jwt = require("jsonwebtoken");


const errorHandler = require("../../utils/errorHandler/errorHandler");



function getUsers(req, res) {
    res.json({
        message: "soemthing cvool"
    })

    // try {
    //     let payload = await User.find(req.body);
    //     console.log(payload);

    //     res.json({
    //         message: "Successfully retrieved",
    //         payload: payload,
    //     });
    // } catch (err) {
    //     res.status(500).json({
    //         message: "Failed Fetching",
    //         error: err
    //     });
    // }
}


module.exports = {
    getUsers,

}
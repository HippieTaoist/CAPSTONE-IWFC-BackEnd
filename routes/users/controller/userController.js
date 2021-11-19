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



async function usersGet(req, res) {

    try {
        let payload = await User.find(req.body);

        res.json({
            message: "Successfully retrieved",
            payload: payload,
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed Fetching",
            error: err
        });
    }
    // res.json({
    //     message: "everything is awesome! cvool"
    // })

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

async function userCreate(req, res) {
    const {
        nameFirst,
        nameLast,
        username,
        email,
        password
    } = req.body;

    console.log(req.body);

    try {
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        const createdUser = new User({
            nameFirst,
            nameLast,
            username,
            email,
            password: hashedPassword,
        });

        let savedUser = await createdUser.save();

        res.json({
            message: "Successful",
            payload: savedUser
        });
    } catch (err) {
        res
            .status(500)
            .json({
                message: "Error in Creating User",
                error: errorHandler(err)
            });
    }
}

async function userLogin(req, res) {
    const {
        email,
        username,
        password,
    } = req.body;

    try {

        let userEmailFound = await User.findOne({
            email: email,
        })

        console.log(userEmailFound);
        // let foundUserUsername = await User.findOne({
        //     username: username,
        // })

        if (!userEmailFound) {
            return res.status(500).json({
                message: "Error in Logging In User",
                error: " Go Sign UP",
            })
        } else {
            let passwordCompare = await bcrypt.compare(password, userEmailFound.password);
            if (!passwordCompare) {
                return res.status(500).json({
                    message: "error",
                    error: "Please check email and password",
                });
            } else {
                let jwtToken = jwt.sign({
                    email: userEmailFound.email,
                    username: userEmailFound.username,

                }, process.env.SECRET_KEY, {
                    expiresIn: "2400h",
                });
                return res.json({
                    message: "Success Tokenizing",
                    payload: jwtToken,
                })
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "Login Error.. WHAT DID YOU DO!!!!",
            error: err.message
        })
    }


}

// async function

module.exports = {
    usersGet,
    userCreate,
    userLogin,

}
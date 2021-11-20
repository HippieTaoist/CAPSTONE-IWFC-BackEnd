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
    console.log('');
    console.log('');
    console.log('                usersGet Called');
    console.log('');
    console.log('');

    try {
        let payload = await User.find(req.body);

        res.json({
            message: "Successfully retrieved",
            payload: payload,
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed Fetching",
            error: errorHandler(err)
        });
    }
}

async function userCreate(req, res) {
    console.log('');
    console.log('');
    console.log('                userCreate Called');
    console.log('');
    console.log('');
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
    console.log('');
    console.log('');
    console.log('                userLogin Called');
    console.log('');
    console.log('');
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
            error: errorHandler(err)
        })
    }


}

async function userProfile(req, res) {
    try {
        let decodedToken = jwt.decode(req.body.token, process.env.SECRET_KEY);
        console.log(decodedToken);
        res.json({
            token: decodedToken
        })
    } catch (err) {
        res.status(500).json({
            message: "There is an issue in pulling your profile",
            error: errorHandler(err)
        })
    }
}

async function userUpdate(req, res) {
    console.log('');
    console.log('');
    console.log('                userUpdate Called');
    console.log('');
    console.log('');

    console.log(req.body);


    res.json({
        "message": "Your profile has been updated",
        "payload": "notyet"
    })
}

module.exports = {
    usersGet,
    userCreate,
    userLogin,
    userProfile,
    userUpdate,

}
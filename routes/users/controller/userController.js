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



async function userDecodeAndFind(data) {
    console.log('');
    console.log('');
    console.log('                userDecodeAndFind Called');
    console.log('');
    console.log('');
    console.log("decodedData: ", data);

    const {
        email,
        username
    } = data;

    console.log({
        email
    });
    console.log({
        username
    });

    let userFound = await User.findOne({
        username
    })

    console.log(userFound);

    return userFound;
}

async function passwordHasher(password) {
    console.log('');
    console.log('');
    console.log('                passwordHasher Called');
    console.log('');
    console.log('');
    let salt = await bcrypt.genSalt(10);
    let passwordHashed = await bcrypt.hash(password, salt);
    return passwordHashed;
}



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
        // let salt = await bcrypt.genSalt(10);
        let passwordHashed = passwordHasher(password); //await bcrypt.hash(password, salt);

        const userCreated = new User({
            nameFirst,
            nameLast,
            username,
            email,
            password: passwordHashed,
        });

        let savedUser = await userCreated.save(); //await passwordHasher(req.body)

        res.json({
            message: "Successful",
            payload: savedUser
        });
    } catch (err) {
        res
            .status(500)
            .json({
                message: "Error in Creating User",
                error: errorHandler(err),
                errMess: err.message
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

        let usernameFound = await User.findOne({
            username: username,
        })

        console.log(usernameFound);
        // let foundUserUsername = await User.findOne({
        //     username: username,
        // })

        if (!usernameFound) {
            return res.status(500).json({
                message: "Error in Logging In User",
                error: " Go Sign UP",
            })
        } else {
            let passwordCompare = await bcrypt.compare(password, usernameFound.password);
            if (!passwordCompare) {
                return res.status(500).json({
                    message: "error",
                    error: "Please check email and password",
                });
            } else {
                let jwtToken = jwt.sign({
                    email: usernameFound.email,
                    username: usernameFound.username,

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
    console.log('');
    console.log('');
    console.log('                userProfile Called');
    console.log('');
    console.log('');
    try {
        const decodedData = res.locals.decodedData;
        console.log(decodedData);

        res.json({
            token: decodedData
        });

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

    console.log('req.body:', req.body);

    console.log(`res.locals.dataDecoded:`, res.locals.dataDecoded);

    let userFound = await userDecodeAndFind(res.locals.dataDecoded)
    console.log('userFound: ', userFound);

    const {
        _id,
        email,
        password,
        favoringCryptos,
        favoringCryptoPrograms
    } = userFound

    switch (req.body.updateType) {
        case 'email':
            if (req.body.email) {
                let emailUpdate = await User.findOneAndUpdate({
                    _id: _id
                }, {
                    email: req.body.email
                }, {
                    new: true
                })

                console.log(emailUpdate);
                console.log(email);
                res.json({
                    payload: emailUpdate
                })
            }
            break;
        case 'password':
            if (req.body.password && req.body.passwordCompare) {
                console.log(req.body.password, "||", req.body.passwordCompare);
                try {
                    if (req.body.passwordCompare === req.body.password && req.body.password !== password && isStrongPassword(req.body.password)) {
                        console.log("MY PASSWORD IS SOOOOOO STRONG!");

                        let passwordHashed = await passwordHasher(req.body.password);
                        console.log('passwordHashed: ', passwordHashed);

                        console.log('_id', _id);
                        let passwordUpdate = await User.findOneAndUpdate({
                            _id: _id
                        }, {
                            password: passwordHashed
                        }, {
                            new: true
                        })

                        console.log('passwordUpdate: ', passwordUpdate);
                        res.json({
                            passwordUpdate
                        })

                    } else {
                        res.status(500).json({
                            message: "there is an issue with the password"
                        })
                    }
                } catch (error) {
                    res.status(500).json({
                        message: "An error has occurred on your update."
                    })

                }
            }
            break;

        default:

    }
    // username cannot be changed

    // email can be changed && needs to be verified by email prior to changing


    // if (req.body.password && req.body.passwordCompare) {
    //     console.log(req.body.password, "||", req.body.passwordCompare);
    //     try {
    //         if (req.body.passwordCompare === req.body.password && req.body.password !== password && isStrongPassword(req.body.password)) {
    //             console.log("MY PASSWORD IS SOOOOOO STRONG!");

    //             let passwordHashed = await passwordHasher(req.body.password);
    //             console.log('passwordHashed: ', passwordHashed);

    //             console.log('_id', _id);
    //             let userUpdate = await User.findOneAndUpdate({
    //                 _id: _id
    //             }, {
    //                 password: passwordHashed
    //             }, {
    //                 new: true
    //             })

    //             console.log('userUpdate: ', userUpdate);

    //         } else {
    //             res.status(500).json({
    //                 message: "there is an issue with the password"
    //             })
    //         }
    //     } catch (error) {
    //         res.status(500).json({
    //             message: "An error has occurred on your update."
    //         })

    //     }
    // }


    // res.json({
    //     "payload": userFound
    // })
    // think of how you are going to seperate this. update use should be called once per request. However if we set it up to send a param with it we can seperate function within it. case / switch type of setup.



    // res.json({
    //     "message": "Your profile has been updated",
    //     "payload": "notyet"
    // })
}

module.exports = {
    usersGet,
    userCreate,
    userLogin,
    userProfile,
    userUpdate,

}
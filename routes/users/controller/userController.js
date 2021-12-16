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
const userDecodeAndFind = require("../../utils/userDecodeAndFind/userDecodeAndFind");
const passwordHasher = require("../../utils/passwordHasher/passwordHasher");

async function usersGet(req, res) {
  console.log("");
  console.log("");
  console.log("                usersGet Called");
  console.log("");
  console.log("");

  try {
    let payload = await User.find({});

    res.json({
      message: "Successfully retrieved",
      payload: payload,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed Fetching",
      error: errorHandler(err),
    });
  }
}

async function userGet(req, res) {
  console.log("");
  console.log("");
  console.log("                userGet Called");
  console.log("");
  console.log("");

  try {
    console.log(req.params);
    let payload = await User.findOne({ username: req.params.username });
    console.log(payload);
    res.json({
      message: "Successfully retrieved",
      payload: payload,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed Fetching",
      error: errorHandler(err),
    });
  }
}

async function userCreate(req, res) {
  console.log("");
  console.log("");
  console.log("                userCreate Called");
  console.log("");
  console.log("");
  const { userLevel, nameFirst, nameLast, username, email, password } =
    req.body;

  console.log(req.body);

  try {
    // let salt = await bcrypt.genSalt(10);
    let passwordHashed = await passwordHasher(password); //await bcrypt.hash(password, salt);
    console.log("passwordHashed", passwordHashed);
    const userCreated = new User({
      userLevel,
      nameFirst,
      nameLast,
      username,
      email,
      password: passwordHashed,
    });

    let savedUser = await userCreated.save(); //await passwordHasher(req.body)

    res.json({
      message: "Successful",
      payload: savedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error in Creating User",
      error: errorHandler(err),
      errMess: err.message,
    });
  }
}

async function userLogin(req, res) {
  console.log("");
  console.log("");
  console.log("                userLogin Called");
  console.log("");
  console.log("");
  const { email, username, password } = req.body;

  let reqAttr = email ? email : username;
  console.log(reqAttr);
  try {
    if (!isEmail(reqAttr)) {
      userFound = await User.findOne({
        username: username,
      });
      console.log("username userFound", userFound);
    } else {
      userFound = await User.findOne({
        email: email,
      });
      console.log("email userFound", userFound);
    }

    console.log("Final userFound", userFound);
    // let foundUserUsername = await User.findOne({
    //     username: username,
    // })

    if (!userFound) {
      return res.status(500).json({
        message: "Error in Logging In User",
        error: " Go Sign UP",
      });
    } else {
      let passwordCompare = await bcrypt.compare(password, userFound.password);
      if (!passwordCompare) {
        return res.status(500).json({
          message: "error",
          error: "Please check email and password",
        });
      } else {
        const {
          _id,
          email,
          nameFirst,
          nameLast,
          username,
          favoringCryptos,
          favoringCryptoPrograms,
          createdAt,
          updatedAt,
        } = userFound;
        let jwtToken = jwt.sign(
          {
            email,
            username,

            _id,
            firstName: nameFirst,
            lastName: nameLast,
            username: username,
            favoringCryptos,
            favoringCryptoPrograms,
            createdDate: createdAt,
            updatedLast: updatedAt,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "2400h",
          }
        );
        return res.json({
          message: "Success Tokenizing",
          payload: jwtToken,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Login Error.. WHAT DID YOU DO!!!!",
      error: errorHandler(err),
    });
  }
}

async function userProfile(req, res) {
  console.log("");
  console.log("");
  console.log("                userProfile Called");
  console.log("");
  console.log("");
  try {
    const dataDecoded = res.locals.dataDecoded;
    console.log(dataDecoded);

    const {
      _id,
      nameFirst,
      nameLast,
      username,
      favoringCryptos,
      favoringCryptoPrograms,
      createdAt,
      updatedAt,
    } = await User.findOne({ username: dataDecoded.username });

    console.log(nameFirst, nameLast);

    res.json({
      _id: _id,
      firstName: nameFirst,
      lastName: nameLast,
      username: username,
      favoringCryptos: favoringCryptos,
      favoringCryptoPrograms: favoringCryptoPrograms,
      createdDate: createdAt,
      updatedLast: updatedAt,
    });
  } catch (err) {
    res.status(500).json({
      message: "There is an issue in pulling your profile",
      error: errorHandler(err),
    });
  }
}

async function userUpdate(req, res) {
  console.log("");
  console.log("");
  console.log("                userUpdate Called");
  console.log("");
  console.log("");

  console.log("req.body:", req.body);

  console.log(`res.locals.dataDecoded:`, res.locals.dataDecoded);

  let userFound = await userDecodeAndFind(res.locals.dataDecoded);
  console.log("userFound: ", userFound);

  const { _id, email, password, favoringCryptos, favoringCryptoPrograms } =
    userFound;

  switch (req.body.updateType) {
    case "email":
      if (req.body.email) {
        let emailUpdate = await User.findOneAndUpdate(
          {
            _id: _id,
          },
          {
            email: req.body.email,
          },
          {
            new: true,
          }
        );

        console.log(emailUpdate);
        console.log(email);
        res.json({
          payload: emailUpdate,
        });
      }
      break;

    case "password":
      if (req.body.password && req.body.passwordCompare) {
        console.log(req.body.password, "||", req.body.passwordCompare);
        try {
          if (
            req.body.passwordCompare === req.body.password &&
            req.body.password !== password &&
            isStrongPassword(req.body.password)
          ) {
            console.log("MY PASSWORD IS SOOOOOO STRONG!");

            let passwordHashed = await passwordHasher(req.body.password);
            console.log("passwordHashed: ", passwordHashed);

            console.log("_id", _id);
            let passwordUpdate = await User.findOneAndUpdate(
              {
                _id: _id,
              },
              {
                password: passwordHashed,
              },
              {
                new: true,
              }
            );

            console.log("passwordUpdate: ", passwordUpdate);
            res.json({
              passwordUpdate,
            });
          } else {
            res.status(500).json({
              message: "there is an issue with the password",
            });
          }
        } catch (error) {
          res.status(500).json({
            message: "An error has occurred on your update.",
          });
        }
      }
      break;

    default:
      console.log("not sure what to default yet");
      break;
  }
}

async function userDelete(req, res) {
  console.log("");
  console.log("");
  console.log("                userDelete Called");
  console.log("");
  console.log("");

  console.log("req.body:", req.body);

  console.log(`res.locals.dataDecoded:`, res.locals.dataDecoded);

  let userFound = await userDecodeAndFind(res.locals.dataDecoded);
  console.log("userFound: ", userFound);

  const { _id, email, password, favoringCryptos, favoringCryptoPrograms } =
    userFound;

  let userDeletePasswordCheck = await bcrypt.compare(
    req.body.password,
    password
  );
  let userDeleteDoubleCheck = req.body.doubleChecked;

  console.log(userDeletePasswordCheck);
  console.log(userDeleteDoubleCheck);
  // add in doublecheck to personal account delete.
  User.deleteOne({
    _id: _id,
  }).then(console.log(`User has been deleted and declared ${userFound}`));
  res.json({ message: "user deleted" });
  // add admin section  to delete without password.
}

module.exports = {
  usersGet,
  userGet,
  userCreate,
  userLogin,
  userProfile,
  userUpdate,
  userDelete,
};

const User = require("../../users/model/User")

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

    // console.log({
    //     email
    // });
    // console.log({
    //     username
    // });

    let userFound = await User.findOne({
        username
    })

    // console.log(userFound);

    return userFound;
}



module.exports = userDecodeAndFind
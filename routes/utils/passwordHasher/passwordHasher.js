const bcrypt = require("bcryptjs");

async function passwordHasher(password) {
  console.log("");
  console.log("");
  console.log("                passwordHasher Called");
  console.log("");
  console.log("");
  let salt = await bcrypt.genSalt(10);
  let passwordHashed = await bcrypt.hash(password, salt);
  console.log(passwordHashed);

  return passwordHashed;
}

module.exports = passwordHasher;

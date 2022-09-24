const bcrypt = require("bcrypt");

const handleBcrypt = {};

handleBcrypt.encryptPassword = async (password) => {
  try   {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.log(error);
  }
};

handleBcrypt.comparePassword = async (password, recivedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, recivedPassword);
    return isMatch;
  } catch (error) {
    console.log(error);
  }
};

module.exports = handleBcrypt;

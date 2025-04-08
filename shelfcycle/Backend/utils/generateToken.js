const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.Secret_Token_Key, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;

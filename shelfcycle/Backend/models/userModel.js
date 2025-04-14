const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: String,
  password: String,
  uploadPic: String,

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  emailVerified: { 
    type: Boolean, 
    default: false
 },
 
  emailOTP: String,
  emailOTPExpires: Date,

}, {
  timestamps: true,
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

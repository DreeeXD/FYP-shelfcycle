const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");

async function SignupUserController(req, res) {
  try {
    const { username, email, phone, password, uploadPic } = req.body;

    if (!username || !email || !phone || !password) {
      throw new Error("All fields are required");
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) throw new Error("This email is already in use.");

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = Date.now() + 1000 * 60 * 10; // 10 min

    const newUser = new userModel({
      username,
      email,
      phone,
      password: hashPassword,
      uploadPic,
      emailOTP: otp,
      emailOTPExpires: new Date(otpExpires),
      emailVerified: false,
    });

    await newUser.save();

    const emailBody = `
      <p>Hello ${username},</p>
      <p>Your ShelfCycle verification code is:</p>
      <h2 style="color:#3B82F6">${otp}</h2>
      <p>This code is valid for 10 minutes.</p>
    `;

    await sendEmail(email, "ShelfCycle Email Verification Code", emailBody);

    res.status(200).json({
      success: true,
      message: "Signup successful! OTP sent to email.",
      userId: newUser._id,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
}

module.exports = SignupUserController;

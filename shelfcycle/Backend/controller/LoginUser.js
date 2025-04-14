const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

async function LoginUserController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) throw new Error('Please provide your email address');
    if (!password) throw new Error('You need to provide your password');

    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error('User not found. Please create a new account before logging in.');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in.",
        success: false,
        error: true,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new Error('Incorrect password');

    const tokenPayload = {
      _id: user._id.toString(),
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, process.env.Secret_Token_Key, { expiresIn: '8h' });
    const tokenOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Lax",
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    };

    res.cookie("token", token, tokenOption).json({
      message: "Login successful",
      success: true,
      error: false,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

module.exports = LoginUserController;

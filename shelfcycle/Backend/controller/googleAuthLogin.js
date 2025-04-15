const { OAuth2Client } = require('google-auth-library');
const userModel = require('../models/userModel');
const generateToken = require('../utils/generateToken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const GoogleAuthLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await userModel.findOne({ email });

    if (!user) {
      // Create new user and auto-verify
      user = await userModel.create({
        email,
        username: name,
        uploadPic: picture,
        password: sub,
        emailVerified: true, // ✅ Skip OTP and mark verified
      });
    }

    // If user was created via signup and still unverified (somehow)
    if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Google login successful",
      data: user,
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      message: "Google login failed",
      success: false,
      error: true,
    });
  }
};

module.exports = GoogleAuthLogin;

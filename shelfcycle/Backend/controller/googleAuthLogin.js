const { OAuth2Client } = require("google-auth-library");
const userModel = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const generateOTP = require("../utils/generateOTP");

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
      // Create user but not verified yet
      const otp = generateOTP();
      const otpExpires = Date.now() + 10 * 60 * 1000;

      user = await userModel.create({
        email,
        username: name,
        uploadPic: picture,
        password: sub,
        emailOTP: otp,
        emailOTPExpires: otpExpires,
        emailVerified: false,
      });

      // Send OTP email
      await sendEmail(email, "Verify Your Email", `Your OTP is: ${otp}`);

      return res.status(200).json({
        requiresVerification: true,
        message: "We sent an OTP to your email. Please verify to complete signup.",
        data: { email },
      });
    }

    if (!user.emailVerified) {
      // Resend OTP
      const otp = generateOTP();
      const otpExpires = Date.now() + 10 * 60 * 1000;

      user.emailOTP = otp;
      user.emailOTPExpires = otpExpires;
      await user.save();

      await sendEmail(email, "Verify Your Email", `Your OTP is: ${otp}`);

      return res.status(200).json({
        requiresVerification: true,
        message: "Please verify your email. We've sent a new OTP.",
        data: { email },
      });
    }

    // ✅ Verified user – log them in
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Google login successful",
      data: user,
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      message: "Google login failed",
      success: false,
      error: true,
    });
  }
};

module.exports = GoogleAuthLogin;

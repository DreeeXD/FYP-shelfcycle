const userModel = require("../models/userModel");

const VerifyEmailOTP = async (req, res) => {
  const { userId, email, otp } = req.body;

  try {
    let user;

    if (userId) {
      user = await userModel.findById(userId);
    } else if (email) {
      user = await userModel.findOne({ email });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid access. No user ID or email provided.",
      });
    }

    if (!user || !user.emailOTP || user.emailOTPExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid or expired OTP",
      });
    }

    if (user.emailOTP !== otp) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Incorrect OTP",
      });
    }

    user.emailVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email successfully verified. You can now log in.",
    });
  } catch (err) {
    console.error("OTP verification error:", err.message);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error during verification",
    });
  }
};

module.exports = VerifyEmailOTP;

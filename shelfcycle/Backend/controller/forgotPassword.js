const User = require("../models/userModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const ForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 1000 * 60 * 30;

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(expires);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const html = `
      <p>Hello ${user.username},</p>
      <p>You requested to reset your password. Click the button below to do so:</p>
      <a href="${resetUrl}" style="background:#3B82F6;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you didn’t request this, you can ignore this email.</p>
      <p>– ShelfCycle Team</p>
    `;

    await sendEmail(user.email, "Reset your ShelfCycle password", html);

    res.json({ success: true, message: "Reset link sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to send email." });
  }
};

module.exports = ForgotPassword;

const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
      error: true,
    });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
        success: false,
        error: true,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({
      message: "Password updated successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({
      message: "Something went wrong on the server",
      success: false,
      error: true,
    });
  }
};

module.exports = changePassword;

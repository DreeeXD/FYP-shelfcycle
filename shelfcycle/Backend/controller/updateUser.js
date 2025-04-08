const userModel = require("../models/userModel");

async function updateUser(request, response) {
  try {
    const { userId, email, username, phone, uploadPic } = request.body;

    if (!userId) {
      return response.status(400).json({
        message: "User ID is required",
        error: true,
        success: false
      });
    }

    const payload = {
  ...(email && { email }),
  ...(username && { username }),
  ...(phone && { phone }),
  ...(uploadPic && { uploadPic }), 
};

    const updatedUser = await userModel.findByIdAndUpdate(userId, payload, {
      new: true // returns the updated document
    });

    response.json({
      data: updatedUser,
      message: "User updated successfully",
      success: true,
      error: false
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
      error: true,
      success: false
    });
  }
}

module.exports = updateUser;

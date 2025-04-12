const userModel = require("../models/userModel");
const bookModel = require("../models/bookModel");

const getPublicUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // <- changed from userId to id ✅

    const user = await userModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Count total books listed
    const totalBooks = await bookModel.countDocuments({ owner: id });

    // Count sold/exchanged books
    const booksSold = await bookModel.countDocuments({
      owner: id,
      $or: [
        { isExchanged: true },
        { status: "sold" },
        { bookStatus: "sold" },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        totalBooks,
        booksSold,
      },
    });
  } catch (error) {
    console.error("Public profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

module.exports = getPublicUserProfile;

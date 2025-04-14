const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel"); // Import the review model

const getPublicUserProfile = async (req, res) => {
  try {
    const { userID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const user = await userModel.findById(userID).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Book stats
    const totalBooks = await bookModel.countDocuments({ uploadedBy: userID });
    const booksSold = await bookModel.countDocuments({
      uploadedBy: userID,
      $or: [
        { isExchanged: true },
        { status: "sold" },
        { bookStatus: "sold" },
      ],
    });

    // Rating stats
    const reviews = await reviewModel.find({ reviewedUser: userID });
    const averageRating = reviews.length
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        totalBooks,
        booksSold,
        averageRating,
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

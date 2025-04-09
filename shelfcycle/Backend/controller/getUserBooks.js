const bookModel = require("../models/bookModel");

const getUserBooks = async (req, res) => {
  try {
    const userId = req.user._id;

    const books = await bookModel.find({ uploadedBy: userId });

    res.json({
      data: books,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user's books",
      error: true,
      success: false,
    });
  }
};

module.exports = getUserBooks;

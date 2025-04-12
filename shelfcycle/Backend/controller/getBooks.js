const bookModel = require("../models/bookModel");

const getBooksController = async (request, response) => {
  try {
    const searchQuery = request.query.search || request.query.query || ""; // Accept both

    let filter = {};
    if (searchQuery.trim()) {
      filter = {
        bookTitle: { $regex: searchQuery, $options: "i" }, // case-insensitive partial match
      };
    }

    const getBooks = await bookModel.find(filter).sort({ createdAt: -1 });

    response.status(200).json({
      data: getBooks,
      error: false,
      success: true,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

module.exports = getBooksController;

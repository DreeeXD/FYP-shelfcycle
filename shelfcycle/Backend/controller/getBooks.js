const bookModel = require("../models/bookModel");

const getBooksController = async (request, response) => {
  try {
    const searchQuery = request.query.search || request.query.query || "";

    let filter = {};
    if (searchQuery.trim()) {
      filter = {
        bookTitle: { $regex: searchQuery, $options: "i" },
      };
    }

    const getBooks = await bookModel
      .find(filter)
      .select("bookTitle bookAuthor bookImage bookType bookPrice bookCondition bookStatus isExchanged uploadedBy createdAt") 
      .populate("uploadedBy", "username email averageRating") 

      .sort({ createdAt: -1 });

    response.status(200).json({
      data: getBooks,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Get books error:", error);
    response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

module.exports = getBooksController;

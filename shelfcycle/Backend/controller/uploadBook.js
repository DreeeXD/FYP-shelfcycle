const bookModel = require("../models/bookModel");

async function uploadBookController(request, response) {
  try {
    const { bookType, bookPrice, ...rest } = request.body;

    // Validate bookType
    if (!["exchange", "sell"].includes(bookType)) {
      return response.status(400).json({
        message: "Invalid book type. Must be 'exchange' or 'sell'.",
        error: true,
        success: false,
      });
    }

    // Handle price logic
    let finalBookData = {
      ...rest,
      bookType,
      bookPrice: bookType === "sell" ? bookPrice : null,
    };

    // If it's a sale, price must be present and valid
    if (bookType === "sell" && (!bookPrice || isNaN(bookPrice))) {
      return response.status(400).json({
        message: "Please provide a valid price for selling the book.",
        error: true,
        success: false,
      });
    }

    const uploadBook = new bookModel(finalBookData);
    const saveProduct = await uploadBook.save();

    response.status(201).json({
      data: saveProduct,
      success: true,
      error: false,
      message: "Book uploaded successfully!",
    });
  } catch (error) {
    response.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = uploadBookController;

const bookModel = require("../models/bookModel");

const updateBookController = async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Book ID is required for update.",
      });
    }

    // Optional: Validate bookType logic here like in uploadBookController
    if (updateData.bookType === "exchange") {
      updateData.bookPrice = null;
    }

    const updatedBook = await bookModel.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Book not found.",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Book updated successfully.",
      data: updatedBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Server error while updating book.",
    });
  }
};

module.exports = updateBookController;
